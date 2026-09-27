import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaKey,
    FaArrowRight,
    FaCheckCircle,
    FaHome,
} from "react-icons/fa";

import logo from "../assets/logo.png";
import heroImage from "../assets/hero-bg.png";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { register, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    // ==========================================
    // FORM SUBMISSION
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            if (!showOTP) {
                await register(name, email, password);

                setShowOTP(true);
                setError("");
            } else {
                await verifyOTP(email, otp);

                navigate("/dashboard");
            }
        } catch (err) {
            setError(
                typeof err === "string"
                    ? err
                    : err?.response?.data?.message ||
                          err?.message ||
                          "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // MAIN UI
    // ==========================================

    return (
        <div className="min-h-screen bg-[#05052b] text-white relative overflow-hidden">

            {/* ======================================
                BACKGROUND
            ====================================== */}

            <div
                className="fixed inset-0 bg-cover bg-center opacity-20"
                style={{
                    backgroundImage: `url(${heroImage})`,
                }}
            ></div>

            {/* Dark overlay */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#05052b] via-[#08083c]/95 to-[#19052d]/90"></div>

            {/* TOP BAR / BACK TO HOME BUTTON */}
            <div className="fixed top-6 left-6 z-30">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold backdrop-blur-md transition-all duration-200"
                >
                    <FaHome className="text-pink-400" />
                    <span>Back to Home</span>
                </Link>
            </div>

            {/* Purple glow */}
            <div className="fixed -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
            <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"></div>

            {/* ======================================
                PAGE CONTENT
            ====================================== */}

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">

                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/* ==================================
                        LEFT SIDE
                    ================================== */}

                    <div className="hidden lg:block">

                        <div className="max-w-xl">

                            {/* LOGO */}
                            <img
                                src={logo}
                                alt="The Event Canvas"
                                className="w-48 mb-8 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                            />

                            {/* SMALL BADGE */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/30 backdrop-blur-md mb-6">
                                <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse"></span>
                                <span className="text-purple-200 text-sm font-semibold">
                                    Your next big moment starts here
                                </span>
                            </div>

                            {/* HEADING */}
                            <h1 className="text-5xl xl:text-6xl font-black leading-tight">
                                Discover.
                                <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                                    Book.
                                </span>
                                <span className="block text-white">
                                    Experience.
                                </span>
                            </h1>

                            {/* DESCRIPTION */}
                            <p className="text-gray-300 text-lg leading-relaxed mt-6 max-w-lg">
                                Join The Event Canvas and discover concerts,
                                celebrations, conferences, festivals and
                                unforgettable experiences.
                            </p>

                            {/* FEATURES */}
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/15 border border-purple-400/20 flex items-center justify-center">
                                        <FaCheckCircle className="text-purple-400" />
                                    </div>
                                    <span className="text-gray-300">
                                        Discover exciting events
                                    </span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-pink-500/15 border border-pink-400/20 flex items-center justify-center">
                                        <FaCheckCircle className="text-pink-400" />
                                    </div>
                                    <span className="text-gray-300">
                                        Book your favorite experiences
                                    </span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/15 border border-blue-400/20 flex items-center justify-center">
                                        <FaCheckCircle className="text-blue-400" />
                                    </div>
                                    <span className="text-gray-300">
                                        Manage all your bookings
                                    </span>
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* ==================================
                        REGISTER CARD
                    ================================== */}

                    <div className="w-full max-w-md mx-auto">

                        <div className="relative overflow-hidden rounded-3xl bg-[#101044]/95 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-950/40">

                            {/* Card glow */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-600/15 rounded-full blur-3xl"></div>

                            <div className="relative z-10 p-7 sm:p-9">

                                {/* MOBILE LOGO */}
                                <div className="lg:hidden flex justify-center mb-6">
                                    <img
                                        src={logo}
                                        alt="The Event Canvas"
                                        className="w-40 object-contain"
                                    />
                                </div>

                                {/* TITLE */}
                                <div className="text-center mb-8">
                                    <p className="text-pink-400 uppercase tracking-[0.25em] text-xs font-bold mb-3">
                                        The Event Canvas
                                    </p>

                                    <h2 className="text-3xl sm:text-4xl font-black text-white">
                                        {showOTP
                                            ? "Verify Your Account"
                                            : "Create Account"}
                                    </h2>

                                    <p className="text-gray-400 mt-3">
                                        {showOTP
                                            ? "Enter the verification code sent to your email."
                                            : "Create your account and start exploring amazing events."}
                                    </p>
                                </div>

                                {/* ERROR MESSAGE */}
                                {error && (
                                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                {/* ==================================
                                    FORM
                                ================================== */}

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >
                                    {!showOTP ? (
                                        <>
                                            {/* NAME */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                    Full Name
                                                </label>

                                                <div className="relative">
                                                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Enter your full name"
                                                        value={name}
                                                        onChange={(e) =>
                                                            setName(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-[#08082f] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                                                    />
                                                </div>
                                            </div>

                                            {/* EMAIL */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                    Email Address
                                                </label>

                                                <div className="relative">
                                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" />
                                                    <input
                                                        type="email"
                                                        required
                                                        placeholder="Enter your email"
                                                        value={email}
                                                        onChange={(e) =>
                                                            setEmail(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-[#08082f] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition"
                                                    />
                                                </div>
                                            </div>

                                            {/* PASSWORD */}
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                    Password
                                                </label>

                                                <div className="relative">
                                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
                                                    <input
                                                        type="password"
                                                        required
                                                        minLength="6"
                                                        placeholder="Create a password"
                                                        value={password}
                                                        onChange={(e) =>
                                                            setPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-[#08082f] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                                    />
                                                </div>

                                                <p className="text-xs text-gray-500 mt-2">
                                                    Password should be at least 6 characters.
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        /* ==================================
                                            OTP SECTION
                                        ================================== */

                                        <div>
                                            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                                <div className="flex items-start gap-3">
                                                    <FaCheckCircle className="text-green-400 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-green-300 font-semibold text-sm">
                                                            OTP Sent Successfully
                                                        </p>
                                                        <p className="text-gray-400 text-xs mt-1">
                                                            A 6-digit verification
                                                            code has been sent to:
                                                        </p>
                                                        <p className="text-white font-semibold text-sm mt-1 break-all">
                                                            {email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <label className="block text-sm font-semibold text-gray-300 mb-2 text-center">
                                                Verification Code
                                            </label>

                                            <div className="relative">
                                                <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" />
                                                <input
                                                    type="text"
                                                    required
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    maxLength="6"
                                                    placeholder="Enter 6-digit OTP"
                                                    value={otp}
                                                    onChange={(e) =>
                                                        setOtp(
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                ""
                                                            )
                                                        )
                                                    }
                                                    className="w-full bg-[#08082f] border border-white/10 rounded-xl pl-11 pr-4 py-4 text-white placeholder-gray-600 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition text-center font-black tracking-[0.5em] text-xl"
                                                />
                                            </div>

                                            <p className="text-center text-gray-500 text-xs mt-3">
                                                Check your inbox and enter the
                                                OTP to verify your account.
                                            </p>
                                        </div>
                                    )}

                                    {/* SUBMIT BUTTON */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group w-full flex items-center justify-center gap-3 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 text-white font-black py-3.5 rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                {showOTP
                                                    ? "Verify & Complete"
                                                    : "Create My Account"}

                                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* ==================================
                                    LOGIN LINK & HOME LINK
                                ================================== */}

                                {!showOTP && (
                                    <div className="text-center mt-7 pt-6 border-t border-white/10 space-y-2">
                                        <p className="text-gray-400 text-sm">
                                            Already have an account?
                                            <Link
                                                to="/login"
                                                className="ml-2 text-pink-400 font-bold hover:text-pink-300 transition"
                                            >
                                                Sign in
                                            </Link>
                                        </p>
                                        <div>
                                            <Link
                                                to="/"
                                                className="text-gray-500 hover:text-gray-300 text-xs font-semibold inline-flex items-center gap-1 transition"
                                            >
                                                <FaHome className="text-[10px]" /> Return to Home
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* OTP BACK */}
                                {showOTP && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowOTP(false);
                                            setOtp("");
                                            setError("");
                                        }}
                                        className="w-full mt-5 text-sm text-gray-400 hover:text-white transition"
                                    >
                                        ← Back to registration
                                    </button>
                                )}

                            </div>

                        </div>

                        {/* FOOTER */}
                        <p className="text-center text-gray-600 text-xs mt-6">
                            © {new Date().getFullYear()} The Event Canvas.
                            Discover. Book. Experience.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Register;