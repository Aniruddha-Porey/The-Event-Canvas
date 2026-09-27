const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    type: { 
        type: String, 
        enum: ['account_verification', 'event_booking', 'password_reset', 'event_creation'], 
        required: true 
    },
    createdAt: { type: Date, default: Date.now, expires: 300 } // TTL index: Automatically expires in 5 minutes
});

module.exports = mongoose.model('OTP', otpSchema);