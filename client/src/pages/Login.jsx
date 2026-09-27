import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import {
    FaEnvelope,
    FaLock,
    FaKey,
    FaArrowRight,
    FaCheckCircle,
    FaHome,
} from "react-icons/fa";

import logo from "../assets/logo.png";
import heroImage from "../assets/hero-bg.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    // ==========================================
    // HANDLE LOGIN / OTP VERIFICATION
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            let resData;
            if (!showOTP) {
                resData = await login(email, password);
            } else {
                resData = await verifyOTP(email, otp);
            }

            // Extract role safely whether resData is user object or full response object
            const userRole = resData?.user?.role || resData?.role;

            if (userRole === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);

                setError(
                    "Account not verified. A new OTP has been sent to your email."
                );
            } else {
                setError(
                    typeof err === "string"
                        ? err
                        : err?.response?.data?.message ||
                              err?.message ||
                              "Invalid email or password."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full bg-[#05052b] text-white relative overflow-hidden">

            {/* BACKGROUND IMAGE */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{
                    backgroundImage: `url(${heroImage})`,
                }}
            />

            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#05052b] via-[#08083c]/95 to-[#19052d]/90" />

            {/* TOP BAR / BACK TO HOME BUTTON */}
            <div className="absolute top-6 left-6 z-20">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold backdrop-blur-md transition-all duration-200"
                >
                    <FaHome className="text-pink-400" />
                    <span>Back to Home</span>
                </Link>
            </div>

            {/* GLOW EFFECTS */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* MAIN CONTENT */}
            <div className="relative z-10 h-screen w-full flex items-center justify-center px-4">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    {/* LEFT BRANDING */}
                    <div className="hidden lg:block">
                        <div className="max-w-xl">
                            <img
                                src={logo}
                                alt="The Event Canvas"
                                className="w-40 xl:w-44 mb-6 object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                            />

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/30 backdrop-blur-md mb-5">
                                <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-purple-200 text-sm font-semibold">
                                    Welcome back to The Event Canvas
                                </span>
                            </div>

                            <h1 className="text-5xl xl:text-6xl font-black leading-[1.05]">
                                Your next
                                <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                                    big moment
                                </span>
                                <span className="block">
                                    awaits.
                                </span>
                            </h1>

                            <p className="text-gray-300 text-base xl:text-lg leading-relaxed mt-5 max-w-lg">
                                Sign in to manage your bookings, discover
                                exciting events and continue your journey
                                with The Event Canvas.
                            </p>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-purple-500/15 border border-purple-400/20 flex items-center justify-center">
                                        <FaCheckCircle className="text-purple-400 text-sm" />
                                    </div>
                                    <span className="text-gray-300 text-sm">
                                        Manage your event bookings
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-pink-500/15 border border-pink-400/20 flex items-center justify-center">
                                        <FaCheckCircle className="text-pink-400 text-sm" />
                                    </div>
                                    <span className="text-gray-300 text-sm">
                                        Discover new experiences
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-500/15 border border-blue-400/20 flex items-center justify-center">
                                        <FaCheckCircle className="text-blue-400 text-sm" />
                                    </div>
                                    <span className="text-gray-300 text-sm">
                                        Keep your tickets in one place
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LOGIN CARD */}
                    <div className="w-full max-w-md mx-auto">
                        <div className="relative overflow-hidden rounded-3xl bg-[#101044]/95 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-950/40">

                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10 p-6 sm:p-8">

                                {/* MOBILE LOGO */}
                                <div className="lg:hidden flex justify-center mb-4">
                                    <img
                                        src={logo}
                                        alt="The Event Canvas"
                                        className="w-32 object-contain"
                                    />
                                </div>

                                {/* TITLE */}
                                <div className="text-center mb-6">
                                    <p className="text-pink-400 uppercase tracking-[0.25em] text-[10px] font-bold mb-2">
                                        The Event Canvas
                                    </p>

                                    <h2 className="text-2xl sm:text-3xl font-black text-white">
                                        {showOTP ? "Verify Account" : "Welcome Back"}
                                    </h2>

                                    <p className="text-gray-400 text-sm mt-2">
                                        {showOTP
                                            ? "Enter the OTP sent to your email."
                                            : "Sign in to continue your event journey."}
                                    </p>
                                </div>

                                {/* ERROR */}
                                {error && (
                                    <div
                                        className={`mb-5 p-3 rounded-xl text-xs text-center border ${
                                            showOTP
                                                ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-300"
                                                : "bg-red-500/10 border-red-500/20 text-red-300"
                                        }`}
                                    >
                                        {error}
                                    </div>
                                )}

                                {/* FORM */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {!showOTP ? (
                                        <>
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
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="w-full bg-[#08082f] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition"
                                                    />
                                                </div>
                                            </div>

                                            {/* PASSWORD */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="block text-sm font-semibold text-gray-300">
                                                        Password
                                                    </label>
                                                    <Link
                                                        to="/forgot-password"
                                                        className="text-xs text-pink-400 hover:text-pink-300 font-semibold transition"
                                                    >
                                                        Forgot Password?
                                                    </Link>
                                                </div>
                                                <div className="relative">
                                                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                                                    <input
                                                        type="password"
                                                        required
                                                        placeholder="Enter your password"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className="w-full bg-[#08082f] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        /* OTP */
                                        <div>
                                            <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                                                <div className="flex items-start gap-3">
                                                    <FaCheckCircle className="text-green-400 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-green-300 font-semibold text-xs">
                                                            Verification Required
                                                        </p>
                                                        <p className="text-gray-400 text-[11px] mt-1">
                                                            OTP sent to:
                                                        </p>
                                                        <p className="text-white font-semibold text-xs mt-1 break-all">
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
                                                    placeholder="Enter 6-digit OTP"
                                                    maxLength="6"
                                                    value={otp}
                                                    onChange={(e) =>
                                                        setOtp(
                                                            e.target.value.replace(
                                                                /\D/g,
                                                                ""
                                                            )
                                                        )
                                                    }
                                                    className="w-full bg-[#08082f] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-gray-600 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition text-center font-black tracking-[0.5em] text-lg"
                                                />
                                            </div>

                                            <p className="text-center text-gray-500 text-[11px] mt-2">
                                                Enter the 6-digit code from your email.
                                            </p>
                                        </div>
                                    )}

                                    {/* SUBMIT */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group w-full flex items-center justify-center gap-3 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 text-white font-black py-3 rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                {showOTP
                                                    ? "Verify OTP & Log In"
                                                    : "Sign In"}
                                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                {/* REGISTER & HOME LINK */}
                                {!showOTP && (
                                    <div className="text-center mt-5 pt-5 border-t border-white/10 space-y-2">
                                        <p className="text-gray-400 text-xs">
                                            Don't have an account?
                                            <Link
                                                to="/register"
                                                className="ml-2 text-pink-400 font-bold hover:text-pink-300 transition"
                                            >
                                                Create Account
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

                                {/* BACK TO LOGIN */}
                                {showOTP && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowOTP(false);
                                            setOtp("");
                                            setError("");
                                        }}
                                        className="w-full mt-4 text-xs text-gray-400 hover:text-white transition"
                                    >
                                        ← Back to login
                                    </button>
                                )}

                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Login;