import React from "react";
import { Link } from "react-router-dom";

import {
    FaCheckCircle,
    FaTicketAlt,
    FaArrowRight,
    FaHome,
} from "react-icons/fa";

import logo from "../assets/logo.png";
import heroImage from "../assets/hero-bg.png";

const PaymentSuccess = () => {
    return (
        <div className="min-h-screen bg-[#05052b] text-white relative overflow-hidden">

            {/* ==========================================
                HERO BACKGROUND
            ========================================== */}

            <div
                className="absolute inset-0 bg-cover bg-center opacity-25"
                style={{
                    backgroundImage: `url(${heroImage})`,
                }}
            ></div>


            {/* ==========================================
                DARK OVERLAY
            ========================================== */}

            <div className="absolute inset-0 bg-gradient-to-br from-[#05052b] via-[#08083c]/95 to-[#18052f]/90"></div>


            {/* ==========================================
                GLOW EFFECTS
            ========================================== */}

            <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"></div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>


            {/* ==========================================
                MAIN CONTENT
            ========================================== */}

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">

                <div className="w-full max-w-xl">

                    {/* ==================================
                        LOGO
                    ================================== */}

                    <div className="flex justify-center mb-8">

                        <img
                            src={logo}
                            alt="The Event Canvas"
                            className="w-44 sm:w-52 object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                        />

                    </div>


                    {/* ==================================
                        SUCCESS CARD
                    ================================== */}

                    <div className="relative overflow-hidden rounded-3xl bg-[#101044]/95 backdrop-blur-xl border border-purple-500/20 shadow-2xl shadow-purple-950/50">

                        {/* Card glow */}

                        <div className="absolute -top-32 -right-32 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>

                        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl"></div>


                        <div className="relative z-10 p-8 sm:p-12 text-center">


                            {/* ==================================
                                SUCCESS ICON
                            ================================== */}

                            <div className="relative w-28 h-28 mx-auto mb-7">

                                <div className="absolute inset-0 rounded-full bg-green-500/10 animate-pulse"></div>

                                <div className="absolute inset-2 rounded-full bg-green-500/10 border border-green-400/20 flex items-center justify-center">

                                    <FaCheckCircle className="text-green-400 text-6xl drop-shadow-[0_0_15px_rgba(74,222,128,0.4)]" />

                                </div>

                            </div>


                            {/* ==================================
                                BADGE
                            ================================== */}

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-400/20 mb-5">

                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>

                                <span className="text-green-300 text-xs font-bold uppercase tracking-wider">
                                    Payment Successful
                                </span>

                            </div>


                            {/* ==================================
                                TITLE
                            ================================== */}

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">

                                Booking

                                <span className="block bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Confirmed!
                                </span>

                            </h1>


                            {/* ==================================
                                DESCRIPTION
                            ================================== */}

                            <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-md mx-auto">

                                Your ticket has been booked successfully.

                                <span className="block mt-2">
                                    A confirmation email has been sent to
                                    your registered email address.
                                </span>

                            </p>


                            {/* ==================================
                                TICKET INFO
                            ================================== */}

                            <div className="relative my-8">

                                <div className="border-t border-dashed border-white/10"></div>

                                <div className="absolute left-0 -top-3 w-6 h-6 rounded-full bg-[#08082f] border-r border-white/10"></div>

                                <div className="absolute right-0 -top-3 w-6 h-6 rounded-full bg-[#08082f] border-l border-white/10"></div>

                            </div>


                            <div className="flex items-center justify-center gap-4 mb-8">

                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">

                                    <FaTicketAlt className="text-purple-400 text-xl" />

                                </div>

                                <div className="text-left">

                                    <p className="text-white font-bold">
                                        Your event ticket is ready
                                    </p>

                                    <p className="text-gray-500 text-sm">
                                        Check your email for booking details
                                    </p>

                                </div>

                            </div>


                            {/* ==================================
                                BUTTONS
                            ================================== */}

                            <div className="space-y-4">


                                {/* DASHBOARD */}

                                <Link
                                    to="/dashboard"
                                    className="group flex items-center justify-center gap-3 w-full bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 text-white font-black py-4 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-purple-900/30 hover:-translate-y-0.5"
                                >

                                    <FaTicketAlt />

                                    View My Tickets

                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />

                                </Link>


                                {/* HOME */}

                                <Link
                                    to="/"
                                    className="group flex items-center justify-center gap-3 w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/30 text-gray-300 hover:text-white font-bold py-4 px-6 rounded-xl transition"
                                >

                                    <FaHome />

                                    Discover More Events

                                </Link>

                            </div>


                            {/* ==================================
                                BRAND MESSAGE
                            ================================== */}

                            <div className="mt-9 pt-6 border-t border-white/10">

                                <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">
                                    The Event Canvas
                                </p>

                                <p className="text-purple-300 text-sm mt-2 font-semibold">
                                    Discover. Book. Experience.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* ==================================
                        FOOTER
                    ================================== */}

                    <p className="text-center text-gray-600 text-xs mt-6">

                        © {new Date().getFullYear()} The Event Canvas.
                        Your Next Big Moment.

                    </p>

                </div>

            </div>

        </div>
    );
};

export default PaymentSuccess;