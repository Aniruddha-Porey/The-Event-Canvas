import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaKey, FaLock, FaArrowRight } from "react-icons/fa";

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email Form, 2: Reset Form
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Step 1: Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/forgot-password-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setStep(2);
            } else {
                setError(data.message || "Failed to send OTP");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await res.json();

            if (res.ok) {
                setMessage("Password updated successfully! Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError(data.message || "Password reset failed");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#05052b] text-white flex items-center justify-center p-5">
            <div className="bg-[#101044] border border-white/10 p-8 rounded-3xl max-w-md w-full">
                <h2 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    Forgot Password
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                    {step === 1
                        ? "Enter your email to receive a reset OTP."
                        : "Enter the OTP sent to your email and your new password."}
                </p>

                {error && (
                    <div className="p-3 mb-4 text-xs rounded-xl bg-red-500/20 text-red-400 border border-red-500/30">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="p-3 mb-4 text-xs rounded-xl bg-green-500/20 text-green-400 border border-green-500/30">
                        {message}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                        <div className="relative">
                            <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
                            <input
                                type="email"
                                required
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 font-bold flex items-center justify-center gap-2 hover:opacity-90 transition"
                        >
                            {loading ? "Sending..." : "Send OTP"} <FaArrowRight />
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="relative">
                            <FaKey className="absolute left-4 top-4 text-gray-400" />
                            <input
                                type="text"
                                required
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div className="relative">
                            <FaLock className="absolute left-4 top-4 text-gray-400" />
                            <input
                                type="password"
                                required
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 font-bold flex items-center justify-center gap-2 hover:opacity-90 transition"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center text-xs text-gray-400">
                    Remember your password?{" "}
                    <Link to="/login" className="text-purple-400 font-bold hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;