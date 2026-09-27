import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";

import {
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaChair,
    FaMoneyBillWave,
    FaArrowLeft,
    FaTicketAlt,
    FaShieldAlt,
} from "react-icons/fa";

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    const [otp, setOtp] = useState("");
    const [showOTP, setShowOTP] = useState(false);

    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError("Failed to load event details.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        setBookingLoading(true);
        setError("");
        setSuccessMsg("");

        try {
            // STEP 1 - SEND OTP
            if (!showOTP) {
                await api.post("/bookings/send-otp");

                setShowOTP(true);

                setSuccessMsg(
                    "OTP sent to your registered email. Please enter it below."
                );
            }

            // STEP 2 - VERIFY OTP & PROCESS BOOKING
            else {
                const response = await api.post("/bookings", {
                    eventId: event._id,
                    otp,
                });

                const isFree = event.ticketPrice === 0;

                if (isFree) {
                    setSuccessMsg(
                        "Booking confirmed successfully! Your free ticket is ready in your dashboard."
                    );
                    setEvent({
                        ...event,
                        availableSeats: Math.max(
                            0,
                            event.availableSeats - 1
                        ),
                    });
                } else {
                    setSuccessMsg(
                        "Booking request created! Please visit your User Dashboard to complete payment and confirm your ticket."
                    );
                }

                setShowOTP(false);
                setOtp("");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Booking failed. Please try again."
            );
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-72px)] bg-[#05052b] flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-400 rounded-full animate-spin mx-auto mb-5"></div>
                    <p className="text-gray-400 font-semibold">
                        Loading event...
                    </p>
                </div>
            </div>
        );
    }

    if (error && !event) {
        return (
            <div className="min-h-[calc(100vh-72px)] bg-[#05052b] flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-white mb-4">
                        Event Not Found
                    </h1>
                    <p className="text-gray-500 mb-6">
                        We couldn't load this event.
                    </p>
                    <button
                        onClick={() => navigate("/events")}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white font-bold px-6 py-3 rounded-xl"
                    >
                        <FaArrowLeft />
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    const isSoldOut = event.availableSeats <= 0;
    const bookingComplete = successMsg && !showOTP;

    const formatTime = () => {
        if (event.time) return event.time;
        if (event.date) {
            return new Date(event.date).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        }
        return "N/A";
    };

    return (
        <div className="min-h-[calc(100vh-72px)] bg-[#05052b] text-white relative overflow-hidden">
            <div className="fixed -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button
                    onClick={() => navigate("/events")}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6 font-semibold"
                >
                    <FaArrowLeft />
                    Back to Events
                </button>

                <div className="bg-[#101044]/90 border border-purple-500/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
                    <div className="relative h-64 sm:h-80 lg:h-[420px] overflow-hidden">
                        {event.image ? (
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-900 via-[#151552] to-pink-900 flex items-center justify-center">
                                <span className="text-white/20 text-6xl sm:text-8xl font-black uppercase tracking-widest">
                                    {event.category}
                                </span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#101044] via-transparent to-black/20"></div>
                        <div className="absolute bottom-6 left-6">
                            <span className="inline-block px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-md text-purple-200 text-xs font-black uppercase tracking-wider">
                                {event.category}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8 lg:p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
                            <div>
                                <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5">
                                    {event.title}
                                </h1>

                                <p className="text-gray-400 text-base sm:text-lg leading-8 max-w-3xl">
                                    {event.description}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                    {/* DATE CARD */}
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                        <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                                            <FaCalendarAlt className="text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider font-black text-gray-600">
                                                Date
                                            </p>
                                            <p className="text-sm font-bold text-gray-200 mt-1">
                                                {new Date(event.date).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* TIME CARD */}
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                        <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                                            <FaClock className="text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider font-black text-gray-600">
                                                Time
                                            </p>
                                            <p className="text-sm font-bold text-gray-200 mt-1">
                                                {formatTime()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* LOCATION CARD */}
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                        <div className="w-11 h-11 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
                                            <FaMapMarkerAlt className="text-pink-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider font-black text-gray-600">
                                                Location
                                            </p>
                                            <p className="text-sm font-bold text-gray-200 mt-1">
                                                {event.location}
                                            </p>
                                        </div>
                                    </div>

                                    {/* AVAILABILITY CARD */}
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                        <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                            <FaChair className="text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider font-black text-gray-600">
                                                Availability
                                            </p>
                                            <p
                                                className={`text-sm font-black mt-1 ${
                                                    isSoldOut
                                                        ? "text-red-400"
                                                        : event.availableSeats < 10
                                                        ? "text-orange-400"
                                                        : "text-green-400"
                                                }`}
                                            >
                                                {event.availableSeats} / {event.totalSeats} seats
                                            </p>
                                        </div>
                                    </div>

                                    {/* TICKET PRICE CARD */}
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 sm:col-span-2 md:col-span-1">
                                        <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                                            <FaMoneyBillWave className="text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wider font-black text-gray-600">
                                                Ticket Price
                                            </p>
                                            <p className="text-sm font-black text-green-400 mt-1">
                                                {event.ticketPrice === 0 ? "Free" : `₹${event.ticketPrice}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="sticky top-24 bg-[#080832] border border-purple-500/20 rounded-3xl p-6 shadow-2xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                            <FaTicketAlt className="text-purple-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black">Book Your Seat</h2>
                                            <p className="text-xs text-gray-500">Secure your experience</p>
                                        </div>
                                    </div>

                                    <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                        <p className="text-xs text-gray-500 uppercase font-black tracking-wider">
                                            Ticket
                                        </p>
                                        <p className="text-3xl font-black text-white mt-1">
                                            {event.ticketPrice === 0 ? "FREE" : `₹${event.ticketPrice}`}
                                        </p>
                                    </div>

                                    {showOTP && (
                                        <div className="mb-5">
                                            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                                                Enter OTP
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                inputMode="numeric"
                                                placeholder="6-digit code"
                                                maxLength={6}
                                                value={otp}
                                                onChange={(e) =>
                                                    setOtp(e.target.value.replace(/\D/g, ""))
                                                }
                                                className="w-full px-4 py-4 rounded-xl bg-white/[0.04] border border-white/10 text-white text-center text-xl font-black tracking-[0.4em] outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/10 transition"
                                            />
                                            <p className="text-xs text-gray-600 mt-2 text-center">
                                                Check your registered email for the OTP.
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleBooking}
                                        disabled={
                                            isSoldOut ||
                                            bookingLoading ||
                                            (showOTP && !otp) ||
                                            bookingComplete
                                        }
                                        className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-black text-base transition-all shadow-lg ${
                                            isSoldOut || bookingComplete
                                                ? "bg-white/5 text-gray-600 cursor-not-allowed"
                                                : "bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white hover:-translate-y-1 hover:shadow-purple-900/40"
                                        }`}
                                    >
                                        <FaTicketAlt />
                                        {bookingLoading
                                            ? "Processing..."
                                            : showOTP
                                            ? "Verify OTP & Book"
                                            : bookingComplete
                                            ? "Booking Submitted"
                                            : isSoldOut
                                            ? "Sold Out"
                                            : "Confirm Registration"}
                                    </button>

                                    {error && (
                                        <p className="mt-4 text-sm text-red-400 text-center bg-red-500/10 border border-red-500/10 p-3 rounded-xl">
                                            {error}
                                        </p>
                                    )}

                                    {successMsg && (
                                        <p className="mt-4 text-sm text-green-400 text-center bg-green-500/10 border border-green-500/10 p-3 rounded-xl">
                                            {successMsg}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-center gap-2 mt-5 text-[11px] text-gray-600">
                                        <FaShieldAlt /> Secure OTP verification
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;