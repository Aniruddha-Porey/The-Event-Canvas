const Booking = require('../models/Booking');
const Event = require('../models/Event');
const OTP = require('../models/OTP');
const { sendBookingEmail, sendOTPEmail } = require('../utils/email');
const mongoose = require('mongoose');
const QRCode = require('qrcode');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Utility function to generate Base64 QR Code
const generateTicketQR = async (bookingId, userId) => {
    try {
        const payload = JSON.stringify({
            bookingId: bookingId.toString(),
            userId: userId.toString(),
            issuedAt: new Date().toISOString()
        });
        return await QRCode.toDataURL(payload);
    } catch (err) {
        console.error("Failed to generate QR Code:", err);
        return null;
    }
};

exports.sendBookingOTP = async (req, res) => {
    try {
        const otp = generateOTP();
        const email = req.user.email;

        // Updated field name from 'action' to 'type'
        await OTP.deleteMany({ email, type: 'event_booking' });
        await OTP.create({ email, otp, type: 'event_booking' });

        // Respond immediately to prevent UI timeouts
        res.json({ message: 'OTP sent successfully' });

        // Trigger email dispatch asynchronously in background
        sendOTPEmail(email, otp, 'event_booking').catch(err => {
            console.error('Failed to send booking OTP email in background:', err);
        });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
};

exports.bookEvent = async (req, res) => {
    try {
        const { eventId, otp } = req.body;
        const currentUserId = req.user._id || req.user.id;

        // Verify OTP using 'type' field
        const validOTP = await OTP.findOne({ email: req.user.email, otp: otp.toString(), type: 'event_booking' });
        if (!validOTP) {
            return res.status(400).json({ message: 'Invalid or expired OTP for booking' });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.availableSeats <= 0) return res.status(400).json({ message: 'No seats available' });

        const existingBooking = await Booking.findOne({ userId: currentUserId, eventId });
        if (existingBooking && existingBooking.status !== 'cancelled') {
            return res.status(400).json({ message: 'Already booked or pending' });
        }

        const isFreeEvent = event.ticketPrice === 0;

        // Create booking: Auto-confirm for free events, set pending for paid events
        const booking = await Booking.create({
            userId: currentUserId,
            eventId,
            status: isFreeEvent ? 'confirmed' : 'pending',
            paymentStatus: isFreeEvent ? 'paid' : 'not_paid',
            amount: event.ticketPrice
        });

        // Deduct seat immediately if it's a free confirmed booking
        if (isFreeEvent) {
            event.availableSeats -= 1;
            await event.save();

            // Send confirmation email asynchronously
            sendBookingEmail(req.user.email, req.user.name, event.title).catch(err => {
                console.error('Failed to send booking confirmation email:', err);
            });
        }

        await OTP.deleteOne({ _id: validOTP._id });

        res.status(201).json({ 
            message: isFreeEvent ? 'Booking confirmed successfully' : 'Booking request submitted', 
            booking 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.confirmBooking = async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        if (booking.status === 'confirmed') return res.status(400).json({ message: 'Booking is already confirmed' });

        const event = await Event.findById(booking.eventId);
        if (!event || event.availableSeats <= 0) {
            return res.status(400).json({ message: 'No seats available to confirm this booking' });
        }

        booking.status = 'confirmed';
        if (paymentStatus) {
            booking.paymentStatus = paymentStatus;
        }
        await booking.save();

        event.availableSeats -= 1;
        await event.save();

        const populatedBooking = await Booking.findById(booking._id)
            .populate('userId', 'name email')
            .populate('eventId', 'title');

        if (populatedBooking?.userId?.email) {
            sendBookingEmail(
                populatedBooking.userId.email,
                populatedBooking.userId.name,
                populatedBooking.eventId.title
            ).catch(err => console.error('Failed to send booking confirmation email:', err));
        }

        res.json({ message: 'Booking confirmed successfully', booking: populatedBooking });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const rawUserId = req.user._id || req.user.id;
        const userObjId = new mongoose.Types.ObjectId(rawUserId.toString());

        const bookings = req.user.role === 'admin'
            ? await Booking.find()
                .populate('eventId')
                .populate('userId', 'name email')
                .sort({ createdAt: -1 })
            : await Booking.find({
                $or: [
                    { userId: userObjId },
                    { userId: rawUserId.toString() },
                    { "userId._id": userObjId }
                ]
            })
            .populate('eventId')
            .sort({ createdAt: -1 });

        const bookingsWithQR = await Promise.all(
            bookings.map(async (b) => {
                const bookingObj = b.toObject();
                if (bookingObj.status === 'confirmed') {
                    bookingObj.qrCode = await generateTicketQR(bookingObj._id, rawUserId);
                }
                return bookingObj;
            })
        );

        res.json(bookingsWithQR);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const currentUserId = (req.user._id || req.user.id).toString();
        const bookingUserId = booking.userId._id ? booking.userId._id.toString() : booking.userId.toString();

        if (bookingUserId !== currentUserId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        if (booking.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

        const wasConfirmed = booking.status === 'confirmed';

        booking.status = 'cancelled';
        await booking.save();

        if (wasConfirmed) {
            const event = await Event.findById(booking.eventId);
            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
        }

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};