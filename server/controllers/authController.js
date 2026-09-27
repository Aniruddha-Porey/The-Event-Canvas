const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/email');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '30d' });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email ? email.trim().toLowerCase() : '';

        let user = await User.findOne({ email: normalizedEmail });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Pass raw password string — User model pre('save') hook hashes it
        user = await User.create({
            name,
            email: normalizedEmail,
            password,
            role: 'user',
            isVerified: false
        });

        const otp = generateOTP();

        // Updated 'action' to 'type' to match OTP Schema
        await OTP.deleteMany({ email: normalizedEmail, type: 'account_verification' });
        await OTP.create({ email: normalizedEmail, otp, type: 'account_verification' });

        // Respond immediately so frontend transitions to the OTP screen without lagging
        res.status(201).json({
            message: 'OTP sent to email. Please verify.',
            email: user.email
        });

        // Trigger email dispatch asynchronously in background
        sendOTPEmail(normalizedEmail, otp, 'account_verification').catch(err => {
            console.error('Failed to send registration OTP email in background:', err);
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerified && user.role !== 'admin') {
            const otp = generateOTP();
            await OTP.deleteMany({ email: user.email, type: 'account_verification' });
            await OTP.create({ email: user.email, otp, type: 'account_verification' });

            res.status(403).json({ 
                message: 'Account not verified. OTP sent to your email.', 
                needsVerification: true, 
                email: user.email 
            });

            sendOTPEmail(user.email, otp, 'account_verification').catch(err => {
                console.error('Failed to send verification email:', err);
            });
            return;
        }

        const token = generateToken(user._id, user.role);

        res.json({
            token,
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        const validOTP = await OTP.findOne({ email: normalizedEmail, otp: otp.toString(), type: 'account_verification' });
        if (!validOTP) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = await User.findOneAndUpdate({ email: normalizedEmail }, { isVerified: true }, { new: true });
        await OTP.deleteOne({ _id: validOTP._id });

        const token = generateToken(user._id, user.role);

        res.json({
            token,
            user: {
                id: user._id,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.forgotPasswordOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email' });
        }

        const otp = generateOTP();
        await OTP.deleteMany({ email: normalizedEmail, type: 'password_reset' });
        await OTP.create({ email: normalizedEmail, otp, type: 'password_reset' });

        res.json({ message: 'Password reset OTP sent to your email' });

        sendOTPEmail(normalizedEmail, otp, 'password_reset').catch(err => {
            console.error('Failed to send reset email:', err);
        });
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        const validOTP = await OTP.findOne({ email: normalizedEmail, otp: otp.toString(), type: 'password_reset' });
        if (!validOTP) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = newPassword;
        await user.save();

        await OTP.deleteOne({ _id: validOTP._id });

        res.json({ message: 'Password reset successfully. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
};