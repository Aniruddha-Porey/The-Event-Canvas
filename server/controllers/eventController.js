const Event = require('../models/Event');
const OTP = require('../models/OTP');
const { sendOTPEmail, sendEventStatusEmail } = require('../utils/email');

// @desc    Get all approved active events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'approved' }).sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// @desc    Get events created by the logged-in user
// @route   GET /api/events/my-events
// @access  Private
const getMyEvents = async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user events', error: error.message });
    }
};

// @desc    Get pending events for admin review
// @route   GET /api/events/pending
// @access  Private/Admin
const getPendingEvents = async (req, res) => {
    try {
        const pendingEvents = await Event.find({ status: 'pending' })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(pendingEvents);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending events', error: error.message });
    }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
};

// @desc    Send OTP to user for event creation
// @route   POST /api/events/send-otp
// @access  Private
const sendEventOtp = async (req, res) => {
    try {
        const email = req.user.email;
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete existing OTPs for this user and type
        await OTP.deleteMany({ email, type: 'event_creation' });

        // Create new OTP entry in MongoDB
        await OTP.create({
            email,
            otp: otpCode,
            type: 'event_creation'
        });

        // Respond immediately to UI without waiting for SMTP network response
        res.status(200).json({ message: 'OTP sent successfully to your registered email' });

        // Trigger email dispatch asynchronously in background
        sendOTPEmail(email, otpCode, 'event_creation').catch(err => {
            console.error('Asynchronous OTP email sending failed:', err);
        });

    } catch (error) {
        res.status(500).json({ message: 'Error generating OTP', error: error.message });
    }
};

// @desc    Verify OTP for event creation
// @route   POST /api/events/verify-otp
// @access  Private
const verifyEventOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const email = req.user.email;

        const otpRecord = await OTP.findOne({
            email,
            otp: otp.toString(),
            type: 'event_creation'
        });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP code' });
        }

        // Delete used OTP
        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error: error.message });
    }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            time,
            location,
            category,
            totalSeats,
            ticketPrice,
            image
        } = req.body;

        const status = req.user.role === 'admin' ? 'approved' : 'pending';

        const event = new Event({
            title,
            description,
            date,
            time,
            location,
            category,
            totalSeats,
            availableSeats: totalSeats,
            ticketPrice,
            image,
            createdBy: req.user._id,
            status
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

// @desc    Update event status (Admin approve or reject)
// @route   PATCH /api/events/:id/status
// @access  Private/Admin
const updateEventStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.status = status;
        await event.save();

        if (event.createdBy && event.createdBy.email) {
            sendEventStatusEmail(
                event.createdBy.email,
                event.createdBy.name,
                event.title,
                status
            ).catch(emailErr => console.error('Failed to send status email:', emailErr));
        }

        res.status(200).json({ message: `Event status updated to ${status}`, event });
    } catch (error) {
        res.status(500).json({ message: 'Error updating event status', error: error.message });
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to edit this event' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        await event.deleteOne();
        res.status(200).json({ message: 'Event removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};

module.exports = {
    getEvents,
    getMyEvents,
    getPendingEvents,
    getEventById,
    sendEventOtp,
    verifyEventOtp,
    createEvent,
    updateEventStatus,
    updateEvent,
    deleteEvent
};