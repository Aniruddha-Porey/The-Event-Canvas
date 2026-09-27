const express = require('express');
const router = express.Router();
const {
    register,
    login,
    verifyOTP,
    forgotPasswordOTP,
    resetPassword
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);

// Forgot & Reset Password Routes
router.post('/forgot-password-otp', forgotPasswordOTP);
router.post('/reset-password', resetPassword);

module.exports = router;