import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";

import {
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaChair,
    FaMoneyBillWave,
    FaArrowRight,
    FaSearch,
    FaTicketAlt,
} from "react-icons/fa";

const Events = () => {
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    // ==========================================
    // FETCH EVENTS FROM BACKEND / MONGODB
    // ==========================================

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                setError("");

                const { data } = await api.get("/events");

                setEvents(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching events:", err);

                setError(
                    err.response?.data?.message ||
                        "Failed to load events. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // ==========================================
    // FILTER EVENTS
    // ==========================================

    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            event.title?.toLowerCase().includes(search.toLowerCase()) ||
            event.description
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            event.location?.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
            !category ||
            event.category?.toLowerCase() === category.toLowerCase();

        return matchesSearch && matchesCategory;
    });

    // ==========================================
    // GET UNIQUE CATEGORIES
    // ==========================================

    const categories = [
        ...new Set(
            events
                .map((event) => event.category)
                .filter(Boolean)
        ),
    ];

    // ==========================================
    // FORMAT DATE & TIME
    // ==========================================

    const formatDate = (date) => {
        if (!date) return "Date not available";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (event) => {
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

    // ==========================================
    // EVENT CARD
    // ==========================================

    const EventCard = ({ event }) => {
        const isSoldOut = event.availableSeats <= 0;

        return (
            <div
                className="group bg-[#101044]/90 border border-purple-500/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-purple-900/30 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-2"
            >
                {/* IMAGE */}
                <div className="relative h-56 overflow-hidden">
                    {event.image ? (
                        <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900 via-[#151552] to-pink-900 flex items-center justify-center">
                            <FaTicketAlt className="text-white/10 text-7xl" />
                        </div>
                    )}

                    {/* IMAGE OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101044] via-transparent to-black/20" />

                    {/* CATEGORY */}
                    {event.category && (
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 backdrop-blur-md text-purple-200 text-xs font-black uppercase tracking-wider">
                                {event.category}
                            </span>
                        </div>
                    )}

                    {/* SOLD OUT */}
                    {isSoldOut && (
                        <div className="absolute top-4 right-4">
                            <span className="px-3 py-1.5 rounded-full bg-red-500/20 border border-red-400/30 backdrop-blur-md text-red-300 text-xs font-black uppercase">
                                Sold Out
                            </span>
                        </div>
                    )}
                </div>

                {/* CONTENT */}
                <div className="p-6">
                    {/* TITLE */}
                    <h2 className="text-xl font-black text-white mb-3 line-clamp-2 group-hover:text-purple-300 transition">
                        {event.title}
                    </h2>

                    {/* DESCRIPTION */}
                    <p className="text-gray-500 text-sm leading-6 line-clamp-2 mb-5">
                        {event.description || "Experience an amazing event."}
                    </p>

                    {/* EVENT DETAILS */}
                    <div className="space-y-3 mb-6">
                        {/* DATE */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                                <FaCalendarAlt className="text-purple-400 text-sm" />
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-black text-gray-600">
                                    Date
                                </p>

                                <p className="text-sm font-bold text-gray-300">
                                    {formatDate(event.date)}
                                </p>
                            </div>
                        </div>

                        {/* TIME */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                                <FaClock className="text-purple-400 text-sm" />
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-black text-gray-600">
                                    Time
                                </p>

                                <p className="text-sm font-bold text-gray-300">
                                    {formatTime(event)}
                                </p>
                            </div>
                        </div>

                        {/* LOCATION */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
                                <FaMapMarkerAlt className="text-pink-400 text-sm" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[10px] uppercase tracking-wider font-black text-gray-600">
                                    Location
                                </p>

                                <p className="text-sm font-bold text-gray-300 truncate">
                                    {event.location || "Location not available"}
                                </p>
                            </div>
                        </div>

                        {/* SEATS */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                                <FaChair className="text-blue-400 text-sm" />
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-black text-gray-600">
                                    Availability
                                </p>

                                <p
                                    className={`text-sm font-black ${
                                        isSoldOut
                                            ? "text-red-400"
                                            : event.availableSeats < 10
                                            ? "text-orange-400"
                                            : "text-green-400"
                                    }`}
                                >
                                    {event.availableSeats ?? 0} /{" "}
                                    {event.totalSeats ?? 0} seats
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM */}
                    <div className="flex items-center justify-between gap-4 pt-5 border-t border-white/5">
                        {/* PRICE */}
                        <div>
                            <p className="text-[10px] uppercase tracking-wider font-black text-gray-600">
                                Ticket
                            </p>

                            <p className="text-xl font-black text-green-400">
                                {event.ticketPrice === 0
                                    ? "FREE"
                                    : `₹${event.ticketPrice}`}
                            </p>
                        </div>

                        {/* VIEW EVENT */}
                        <button
                            onClick={() =>
                                navigate(`/events/${event._id}`)
                            }
                            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white text-sm font-black hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-900/30 transition-all"
                        >
                            View Event
                            <FaArrowRight className="text-xs" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-72px)] bg-[#05052b] text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-purple-500/20 border-t-purple-400 rounded-full animate-spin mx-auto mb-5" />

                    <p className="text-gray-400 font-semibold">
                        Loading events...
                    </p>

                    <p className="text-gray-600 text-sm mt-2">
                        Fetching events from The Event Canvas
                    </p>
                </div>
            </div>
        );
    }

    // ==========================================
    // MAIN PAGE
    // ==========================================

    return (
        <div className="min-h-[calc(100vh-72px)] bg-[#05052b] text-white relative overflow-hidden">
            {/* BACKGROUND GLOWS */}
            <div className="fixed -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="fixed top-1/2 -right-40 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* MAIN CONTENT */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* HEADER */}
                <div className="text-center max-w-3xl mx-auto mb-10">
                    <p className="text-purple-400 text-sm font-black uppercase tracking-[0.3em] mb-3">
                        The Event Canvas
                    </p>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
                        Discover Amazing{" "}
                        <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                            Events
                        </span>
                    </h1>

                    <p className="text-gray-500 text-base sm:text-lg mt-5 leading-7">
                        Find your next unforgettable experience. Discover,
                        book, and experience the moments that matter.
                    </p>
                </div>

                {/* SEARCH + FILTER */}
                <div className="bg-[#101044]/80 border border-purple-500/10 rounded-2xl p-4 mb-10 shadow-xl backdrop-blur-xl">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4">
                        {/* SEARCH */}
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                placeholder="Search events, locations..."
                                className="w-full pl-11 pr-4 py-4 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-gray-600 outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/10 transition"
                            />
                        </div>

                        {/* CATEGORY */}
                        <select
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                            className="w-full px-4 py-4 rounded-xl bg-[#080832] border border-white/10 text-gray-300 outline-none focus:border-purple-500/50 transition"
                        >
                            <option value="">All Categories</option>

                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
                        <p className="text-red-400 font-semibold">
                            {error}
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 font-bold hover:bg-red-500/20 transition"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* EVENTS COUNT */}
                {!error && (
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-black text-white">
                                Upcoming Events
                            </h2>

                            <p className="text-gray-600 text-sm mt-1">
                                {filteredEvents.length}{" "}
                                {filteredEvents.length === 1
                                    ? "event"
                                    : "events"}{" "}
                                found
                            </p>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
                            <FaTicketAlt className="text-purple-400" />
                            Secure booking
                        </div>
                    </div>
                )}

                {/* EVENTS GRID */}
                {!error && filteredEvents.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event) => (
                            <EventCard
                                key={event._id}
                                event={event}
                            />
                        ))}
                    </div>
                )}

                {/* NO EVENTS */}
                {!error && filteredEvents.length === 0 && (
                    <div className="text-center py-20 bg-[#101044]/60 border border-purple-500/10 rounded-3xl">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-5">
                            <FaTicketAlt className="text-purple-400 text-2xl" />
                        </div>

                        <h2 className="text-2xl font-black text-white">
                            No events found
                        </h2>

                        <p className="text-gray-600 mt-2">
                            Try changing your search or category filter.
                        </p>

                        {(search || category) && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setCategory("");
                                }}
                                className="mt-6 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white font-bold"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;