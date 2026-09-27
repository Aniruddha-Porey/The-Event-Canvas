const express = require('express');
const router = express.Router();
const { 
    getEvents, 
    getEventById, 
    createEvent, 
    updateEvent, 
    deleteEvent,
    getPendingEvents,
    updateEventStatus,
    sendEventOtp,
    verifyEventOtp,
    getMyEvents
} = require('../controllers/eventController');
const { protect, admin } = require('../middleware/auth');

// Public routes
router.get('/', getEvents);

// Authenticated user route to fetch events created by the logged-in user
router.get('/my-events', protect, getMyEvents);

// Admin-only route to view pending user-submitted events
router.get('/pending', protect, admin, getPendingEvents);

router.get('/:id', getEventById);

// OTP Verification routes for Non-Admin event creation
router.post('/send-otp', protect, sendEventOtp);
router.post('/verify-otp', protect, verifyEventOtp);

// Any authenticated user can submit an event
router.post('/', protect, createEvent);

// Admin route to approve or reject event submissions
router.patch('/:id/status', protect, admin, updateEventStatus);

// Edit & Delete routes (Protected: Creator or Admin allowed)
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);

module.exports = router;