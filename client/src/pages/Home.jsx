import React from "react";
import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaTicketAlt,
    FaCalendarAlt,
    FaStar,
} from "react-icons/fa";

import heroBg from "../assets/hero-bg.png";
import logo from "../assets/logo.png";

const Home = () => {
    return (
        <div className="h-[calc(100vh-72px)] bg-[#05052b] text-white overflow-hidden">

            {/* ==========================================
                HERO SECTION
                NAVBAR 72px + HERO = 100VH
            ========================================== */}

            <section
                className="relative h-full w-full flex items-center overflow-hidden bg-cover bg-center"
                style={{
                    backgroundImage: `url(${heroBg})`,
                }}
            >

                {/* ======================================
                    DARK OVERLAY
                ====================================== */}

                <div className="absolute inset-0 bg-gradient-to-r from-[#05052b] via-[#05052b]/90 to-[#05052b]/30"></div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#05052b] via-transparent to-[#05052b]/40"></div>


                {/* ======================================
                    PURPLE / PINK GLOWS
                ====================================== */}

                <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>

                <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>


                {/* ======================================
                    CONTENT
                ====================================== */}

                <div className="relative z-10 mx-auto w-[90%] max-w-7xl">

                    <div className="max-w-3xl">

                       


                        {/* BADGE */}

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/30 backdrop-blur-md mb-5">

                            <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-pulse"></span>

                            <span className="text-purple-200 text-xs sm:text-sm font-bold uppercase tracking-wider">
                                Your next big moment starts here
                            </span>

                        </div>


                        {/* HEADING */}

                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">

                            Discover.

                            <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mt-2">
                                Book.
                            </span>

                            <span className="block text-white mt-2">
                                Experience.
                            </span>

                        </h1>


                        {/* DESCRIPTION */}

                        <p className="mt-5 max-w-2xl text-base sm:text-lg md:text-xl leading-7 text-gray-300">

                            Discover unforgettable events, book your tickets,
                            and experience moments that stay with you forever.

                        </p>


                        {/* BUTTONS */}

                        <div className="mt-7 flex flex-wrap gap-4">

                            <Link
                                to="/events"
                                className="group flex items-center gap-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 px-7 py-4 font-black text-white shadow-lg shadow-purple-900/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-800/50"
                            >

                                <FaTicketAlt />

                                Explore Events

                                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />

                            </Link>


                            <Link
                                to="/register"
                                className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-7 py-4 font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15 hover:border-purple-400/40"
                            >

                                Get Started

                                <FaArrowRight />

                            </Link>

                        </div>


                        {/* STATS */}

                        <div className="mt-8 flex flex-wrap gap-6 sm:gap-10">

                            {/* EVENTS */}

                            <div className="flex items-center gap-3">

                                <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-400/20 flex items-center justify-center">

                                    <FaCalendarAlt className="text-purple-400" />

                                </div>

                                <div>

                                    <p className="text-xl font-black text-white">
                                        100+
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Events
                                    </p>

                                </div>

                            </div>


                            {/* EXPERIENCES */}

                            <div className="flex items-center gap-3">

                                <div className="w-11 h-11 rounded-xl bg-pink-500/10 border border-pink-400/20 flex items-center justify-center">

                                    <FaStar className="text-pink-400" />

                                </div>

                                <div>

                                    <p className="text-xl font-black text-white">
                                        1K+
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Experiences
                                    </p>

                                </div>

                            </div>


                            {/* TICKETS */}

                            <div className="flex items-center gap-3">

                                <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center">

                                    <FaTicketAlt className="text-blue-400" />

                                </div>

                                <div>

                                    <p className="text-xl font-black text-white">
                                        Easy
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Booking
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ======================================
                    BOTTOM GRADIENT
                ====================================== */}

                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#05052b] to-transparent"></div>


                {/* ======================================
                    SCROLL INDICATOR
                ====================================== */}

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-gray-500">

                    <span className="text-[10px] uppercase tracking-[0.3em]">
                        Explore
                    </span>

                    <div className="w-5 h-8 rounded-full border border-gray-500/50 flex justify-center pt-1">

                        <div className="w-1 h-2 rounded-full bg-purple-400 animate-bounce"></div>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default Home;