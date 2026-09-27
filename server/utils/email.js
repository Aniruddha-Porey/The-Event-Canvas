const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const logoPath = path.join(__dirname, '../../client/src/assets/logo.png');

// Configured for explicit TLS and port handling to prevent server crashes
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Prevents self-signed SSL/TLS certificate errors
    }
});

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        const mailOptions = {
            from: `"The Event Canvas" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Booking Confirmed - ${eventTitle}`,
            attachments: [
                {
                    filename: 'logo.png',
                    path: logoPath,
                    cid: 'eventcanvaslogo'
                }
            ],
            html: `
                <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6ff; padding: 40px 20px;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.08);">
                        <div style="background: linear-gradient(135deg, #101a4d, #4b1fa8, #f21b8f); padding: 30px; text-align: center; color: white;">
                            <img src="cid:eventcanvaslogo" alt="The Event Canvas Logo" style="max-width: 140px; margin-bottom: 10px;" />
                            <h1 style="margin: 0; font-size: 24px;">THE EVENT CANVAS</h1>
                            <p style="margin: 5px 0 0; font-size: 14px;">Discover. Book. Experience.</p>
                        </div>
                        <div style="padding: 35px;">
                            <h2 style="color: #17233c; margin-top: 0;">Booking Confirmed! 🎉</h2>
                            <p style="color: #555; font-size: 16px; line-height: 1.6;">Hi <strong>${userName}</strong>,</p>
                            <p style="color: #555; font-size: 16px; line-height: 1.6;">Your booking has been successfully confirmed. We are excited to have you join us!</p>
                            <div style="background: #f5f3ff; border-left: 5px solid #f21b8f; padding: 18px; margin: 25px 0; border-radius: 8px;">
                                <p style="margin: 0; color: #777; font-size: 13px;">EVENT</p>
                                <h3 style="margin: 8px 0 0; color: #24115f; font-size: 20px;">${eventTitle}</h3>
                            </div>
                            <p style="color: #555; font-size: 15px; line-height: 1.6;">Please keep this email for your records. We recommend arriving at the venue a little before the event begins.</p>
                            <div style="text-align: center; margin: 30px 0 10px;">
                                <span style="display: inline-block; background: linear-gradient(90deg, #ff9d00, #f21b8f, #5146e5); color: white; padding: 12px 25px; border-radius: 25px; font-weight: bold;">
                                    Your Spot is Reserved ✓
                                </span>
                            </div>
                        </div>
                        <div style="background: #101a4d; padding: 25px; text-align: center; color: #ffffff;">
                            <h3 style="margin: 0 0 8px;">THE EVENT CANVAS</h3>
                            <p style="margin: 0; font-size: 13px; color: #d8d8e8;">Discover. Book. Experience — Your Next Big Moment.</p>
                            <p style="margin: 15px 0 0; font-size: 12px; color: #aaa;">This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Booking email sent successfully to:', userEmail);
        return info;
    } catch (error) {
        console.error('Error sending booking email:', error);
        throw error;
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        let title = "Verification Code";
        let message = "Use the OTP below to complete your action.";
        let subject = "The Event Canvas - Verification Code";

        if (type === 'account_verification') {
            title = 'Verify Your The Event Canvas Account';
            message = 'Use the OTP below to verify your email address and activate your account.';
            subject = 'The Event Canvas - Email Verification OTP';
        } else if (type === 'password_reset') {
            title = 'Reset Your Password';
            message = 'We received a request to reset your password. Use the OTP below to reset it:';
            subject = 'The Event Canvas - Password Reset OTP';
        } else if (type === 'event_booking') {
            title = 'Confirm Your Event Booking';
            message = 'Use the OTP below to verify and confirm your event booking.';
            subject = 'The Event Canvas - Booking Verification OTP';
        } else if (type === 'event_creation') {
            title = 'Verify Event Submission';
            message = 'Use the OTP below to verify your identity and submit your event for review.';
            subject = 'The Event Canvas - Event Submission Verification OTP';
        }

        const mailOptions = {
            from: `"The Event Canvas" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: subject,
            attachments: [
                {
                    filename: 'logo.png',
                    path: logoPath,
                    cid: 'eventcanvaslogo'
                }
            ],
            html: `
                <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6ff; padding: 40px 20px;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.08);">
                        <div style="background: linear-gradient(135deg, #101a4d, #4b1fa8, #f21b8f); padding: 30px; text-align: center; color: white;">
                            <img src="cid:eventcanvaslogo" alt="The Event Canvas Logo" style="max-width: 140px; margin-bottom: 10px;" />
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">THE EVENT CANVAS</h1>
                            <p style="margin: 5px 0 0; font-size: 14px;">Discover. Book. Experience.</p>
                        </div>
                        <div style="padding: 35px; text-align: center;">
                            <h2 style="color: #17233c; margin-top: 0;">${title}</h2>
                            <p style="color: #555; font-size: 15px; line-height: 1.6;">${message}</p>
                            <div style="margin: 30px auto; padding: 20px; background: #f5f3ff; border: 2px dashed #f21b8f; border-radius: 12px; width: 220px;">
                                <p style="margin: 0 0 10px; color: #777; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Your OTP</p>
                                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #24115f;">${otp}</div>
                            </div>
                            <p style="color: #888; font-size: 13px; line-height: 1.5;">This OTP is valid for <strong>5 minutes</strong>.</p>
                            <p style="color: #999; font-size: 12px; line-height: 1.5;">If you did not request this code, you can safely ignore this email.</p>
                        </div>
                        <div style="background: #101a4d; padding: 25px; text-align: center; color: white;">
                            <h3 style="margin: 0 0 8px;">THE EVENT CANVAS</h3>
                            <p style="margin: 0; font-size: 13px; color: #d8d8e8;">Your Next Big Moment.</p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`OTP sent successfully to ${userEmail} for ${type}`);
        return info;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error;
    }
};

const sendEventStatusEmail = async (userEmail, userName, eventTitle, status) => {
    try {
        const isApproved = status === 'approved';
        const subject = isApproved 
            ? `Event Approved 🎉 - ${eventTitle}` 
            : `Event Status Update - ${eventTitle}`;

        const mailOptions = {
            from: `"The Event Canvas" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: subject,
            attachments: [
                {
                    filename: 'logo.png',
                    path: logoPath,
                    cid: 'eventcanvaslogo'
                }
            ],
            html: `
                <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6ff; padding: 40px 20px;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.08);">
                        <div style="background: linear-gradient(135deg, #101a4d, #4b1fa8, #f21b8f); padding: 30px; text-align: center; color: white;">
                            <img src="cid:eventcanvaslogo" alt="The Event Canvas Logo" style="max-width: 140px; margin-bottom: 10px;" />
                            <h1 style="margin: 0; font-size: 24px;">THE EVENT CANVAS</h1>
                            <p style="margin: 5px 0 0; font-size: 14px;">Organizer Notification</p>
                        </div>
                        <div style="padding: 35px;">
                            <h2 style="color: #17233c; margin-top: 0;">
                                ${isApproved ? 'Event Approved & Published! 🚀' : 'Event Update'}
                            </h2>
                            <p style="color: #555; font-size: 16px; line-height: 1.6;">Hi <strong>${userName}</strong>,</p>
                            <p style="color: #555; font-size: 16px; line-height: 1.6;">
                                ${isApproved 
                                    ? `Great news! Your event submission has been reviewed and <strong>approved</strong> by the admin team. It is now live on The Event Canvas platform for users to discover and book.`
                                    : `Your event submission status has been updated to <strong>${status}</strong> by the admin team.`}
                            </p>
                            <div style="background: ${isApproved ? '#f0fdf4' : '#fef2f2'}; border-left: 5px solid ${isApproved ? '#22c55e' : '#ef4444'}; padding: 18px; margin: 25px 0; border-radius: 8px;">
                                <p style="margin: 0; color: #777; font-size: 13px;">SUBMITTED EVENT</p>
                                <h3 style="margin: 8px 0 0; color: #17233c; font-size: 20px;">${eventTitle}</h3>
                                <p style="margin: 8px 0 0; font-weight: bold; color: ${isApproved ? '#16a34a' : '#dc2626'}; font-size: 14px; text-transform: uppercase;">
                                    STATUS: ${status}
                                </p>
                            </div>
                        </div>
                        <div style="background: #101a4d; padding: 25px; text-align: center; color: #ffffff;">
                            <h3 style="margin: 0 0 8px;">THE EVENT CANVAS</h3>
                            <p style="margin: 0; font-size: 13px; color: #d8d8e8;">Organizer Portal</p>
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Event status email sent successfully to ${userEmail} for status: ${status}`);
        return info;
    } catch (error) {
        console.error('Error sending event status email:', error);
        throw error;
    }
};

module.exports = {
    sendBookingEmail,
    sendOTPEmail,
    sendEventStatusEmail
};