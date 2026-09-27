const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { sendBookingEmail } = require('../utils/email');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 1. Create Razorpay Order
exports.createOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId).populate('eventId');

        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // Verify seat availability before initiating payment
        if (!booking.eventId || booking.eventId.availableSeats <= 0) {
            return res.status(400).json({ message: 'No seats available for this event' });
        }

        const options = {
            amount: booking.amount * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_${booking._id}`
        };

        const order = await razorpay.orders.create(options);
        res.json({ order, key: process.env.RAZORPAY_KEY_ID });
    } catch (error) {
        res.status(500).json({ message: 'Error creating payment order', error: error.message });
    }
};

// 2. Verify Payment Signature & Update Booking
exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            const booking = await Booking.findById(bookingId);
            if (!booking) return res.status(404).json({ message: 'Booking not found' });

            const event = await Event.findById(booking.eventId);
            if (!event || event.availableSeats <= 0) {
                return res.status(400).json({ message: "Payment verified, but no seats left to confirm ticket" });
            }

            // Payment verified — update booking status and reduce available seats
            booking.paymentStatus = 'paid';
            booking.status = 'confirmed';
            await booking.save();

            event.availableSeats -= 1;
            await event.save();

            // Fetch user info to send confirmation email
            const populatedBooking = await Booking.findById(booking._id)
                .populate('userId', 'name email')
                .populate('eventId', 'title');

            if (populatedBooking?.userId?.email) {
                await sendBookingEmail(
                    populatedBooking.userId.email,
                    populatedBooking.userId.name,
                    populatedBooking.eventId.title
                );
            }

            res.json({ success: true, message: "Payment verified & booking confirmed" });
        } else {
            res.status(400).json({ success: false, message: "Invalid payment signature" });
        }
    } catch (error) {
        res.status(500).json({ message: "Verification failed", error: error.message });
    }
};