import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
    FaTicketAlt,
    FaCalendarAlt,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaArrowRight,
    FaSearch,
    FaQrcode,
    FaTimes,
    FaPrint,
    FaCreditCard,
    FaPlus,
    FaEdit,
    FaTrash,
    FaMapMarkerAlt,
    FaChair,
    FaKey,
    FaEnvelope,
} from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";

const UserDashboard = () => {
    const { user } = useContext(AuthContext);

    const [bookings, setBookings] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [processingPaymentId, setProcessingPaymentId] = useState(null);

    // User Event Submission & Edit State
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    // OTP Modal & Process State
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [submittingEvent, setSubmittingEvent] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "10:00",
        location: "",
        category: "",
        totalSeats: "",
        ticketPrice: "",
        image: "",
    });

    const [editFormData, setEditFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "10:00",
        location: "",
        category: "",
        totalSeats: "",
        ticketPrice: "",
        image: "",
    });

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/bookings/my",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                setBookings(
                    Array.isArray(data)
                        ? data
                        : data.bookings || []
                );
            }
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        }
    };

    const fetchUserEvents = async () => {
        try {
            const response = await api.get("/events/my-events");
            setMyEvents(response.data || []);
        } catch (error) {
            console.error("Failed to fetch hosted events:", error);
        }
    };

    const loadDashboardData = async () => {
        setLoading(true);
        await Promise.all([fetchBookings(), fetchUserEvents()]);
        setLoading(false);
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    // Initiates event creation flow by requesting an OTP for non-admin users
    const handleInitiateCreateEvent = async (e) => {
        e.preventDefault();

        // Admin users bypass OTP verification
        if (user?.role === "admin") {
            await handleFinalizeEventCreation();
            return;
        }

        setOtpLoading(true);
        try {
            await api.post("/events/send-otp");
            setShowOtpModal(true);
        } catch (error) {
            alert(
                error.response?.data?.message || "Failed to send OTP email. Please try again."
            );
        } finally {
            setOtpLoading(false);
        }
    };

    // Submits event after verifying OTP code
    const handleVerifyAndCreateEvent = async (e) => {
        e.preventDefault();
        if (!otp || otp.trim().length !== 6) {
            alert("Please enter a valid 6-digit OTP code.");
            return;
        }

        setSubmittingEvent(true);
        try {
            await api.post("/events/verify-otp", { otp: otp.trim() });
            setShowOtpModal(false);
            setOtp("");
            await handleFinalizeEventCreation();
        } catch (error) {
            alert(
                error.response?.data?.message || "Invalid or expired OTP. Please try again."
            );
        } finally {
            setSubmittingEvent(false);
        }
    };

    // Submits payload to backend
    const handleFinalizeEventCreation = async () => {
        try {
            const combinedDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();

            const payload = {
                title: formData.title,
                description: formData.description,
                date: combinedDateTime,
                time: formData.time,
                location: formData.location,
                category: formData.category,
                totalSeats: formData.totalSeats,
                availableSeats: formData.totalSeats,
                ticketPrice: formData.ticketPrice,
                image: formData.image,
            };

            await api.post("/events", payload);
            alert("Event submitted successfully! It is now pending admin approval.");
            setShowCreateForm(false);
            setFormData({
                title: "",
                description: "",
                date: "",
                time: "10:00",
                location: "",
                category: "",
                totalSeats: "",
                ticketPrice: "",
                image: "",
            });
            fetchUserEvents();
        } catch (error) {
            alert(
                error.response?.data?.message || "Error submitting event"
            );
        }
    };

    const handleOpenEditModal = (event) => {
        const parsedDate = event.date ? new Date(event.date).toISOString().split("T")[0] : "";
        setEditingEvent(event);
        setEditFormData({
            title: event.title || "",
            description: event.description || "",
            date: parsedDate,
            time: event.time || "10:00",
            location: event.location || "",
            category: event.category || "",
            totalSeats: event.totalSeats || "",
            ticketPrice: event.ticketPrice || 0,
            image: event.image || "",
        });
    };

    const handleUpdateEvent = async (e) => {
        e.preventDefault();

        try {
            const combinedDateTime = new Date(`${editFormData.date}T${editFormData.time}`).toISOString();

            const payload = {
                title: editFormData.title,
                description: editFormData.description,
                date: combinedDateTime,
                time: editFormData.time,
                location: editFormData.location,
                category: editFormData.category,
                totalSeats: editFormData.totalSeats,
                ticketPrice: editFormData.ticketPrice,
                image: editFormData.image,
            };

            await api.put(`/events/${editingEvent._id}`, payload);
            alert("Event updated successfully!");
            setEditingEvent(null);
            fetchUserEvents();
        } catch (error) {
            alert(
                error.response?.data?.message || "Error updating event"
            );
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await api.delete(`/events/${id}`);
                alert("Event deleted successfully!");
                fetchUserEvents();
            } catch (error) {
                alert(
                    error.response?.data?.message || "Error deleting event"
                );
            }
        }
    };

    const handlePayment = async (booking) => {
        setProcessingPaymentId(booking._id);

        try {
            const token = localStorage.getItem("token");

            const orderRes = await fetch("http://localhost:5000/api/payments/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ bookingId: booking._id }),
            });

            const { order, key } = await orderRes.json();

            if (!orderRes.ok) {
                alert("Failed to initiate payment. Please try again.");
                setProcessingPaymentId(null);
                return;
            }

            const options = {
                key: key,
                amount: order.amount,
                currency: order.currency,
                name: "The Event Canvas",
                description: `Ticket payment for ${booking.eventId?.title || "Event"}`,
                order_id: order.id,
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                },
                theme: {
                    color: "#a855f7",
                },
                handler: async (response) => {
                    try {
                        const verifyRes = await fetch("http://localhost:5000/api/payments/verify", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                bookingId: booking._id,
                            }),
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyRes.ok && verifyData.success) {
                            alert("Payment successful! Your ticket is confirmed.");
                            fetchBookings();
                        } else {
                            alert(verifyData.message || "Payment verification failed.");
                        }
                    } catch (err) {
                        console.error("Payment verification error:", err);
                        alert("Error verifying payment.");
                    } finally {
                        setProcessingPaymentId(null);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setProcessingPaymentId(null);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment process error:", error);
            alert("Could not process payment.");
            setProcessingPaymentId(null);
        }
    };

    const totalBookings = bookings.length;

    const confirmedBookings = bookings.filter(
        (booking) =>
            String(booking.status).trim().toLowerCase() === "confirmed"
    ).length;

    const pendingBookings = bookings.filter(
        (booking) =>
            String(booking.status).trim().toLowerCase() === "pending"
    ).length;

    const cancelledBookings = bookings.filter(
        (booking) =>
            String(booking.status).trim().toLowerCase() === "cancelled"
    ).length;

    const getStatusStyle = (status) => {
        switch (String(status)?.trim().toLowerCase()) {
            case "confirmed":
            case "approved":
                return "bg-green-500/10 text-green-400 border-green-500/20";
            case "pending":
                return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
            case "cancelled":
            case "rejected":
                return "bg-red-500/10 text-red-400 border-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-400 border-gray-500/20";
        }
    };

    const getStatusIcon = (status) => {
        switch (String(status)?.trim().toLowerCase()) {
            case "confirmed":
            case "approved":
                return <FaCheckCircle />;
            case "pending":
                return <FaClock />;
            case "cancelled":
            case "rejected":
                return <FaTimesCircle />;
            default:
                return <FaTicketAlt />;
        }
    };

    return (
        <div className="min-h-screen bg-[#05052b] text-white flex flex-col">
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
                <div className="absolute top-1/3 -right-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
            </div>

            <main className="relative z-10 flex-1">
                <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10 lg:py-14">
                    {/* WELCOME SECTION */}
                    <section className="mb-10">
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-400/20 mb-5">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                    <span className="text-purple-300 text-xs font-bold uppercase tracking-wider">
                                        User Dashboard
                                    </span>
                                </div>

                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                                    Welcome,
                                    <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                                        {user?.name || "Event Explorer"}!
                                    </span>
                                </h1>

                                <p className="text-gray-400 text-base sm:text-lg mt-4 max-w-2xl leading-relaxed">
                                    Manage your bookings, host your own events, and keep your next big moment organized with{" "}
                                    <span className="text-pink-400 font-bold">
                                        The Event Canvas.
                                    </span>
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setShowCreateForm(!showCreateForm)}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold transition"
                                >
                                    <FaPlus />
                                    {showCreateForm ? "Cancel Event Submission" : "Host an Event"}
                                </button>

                                <Link
                                    to="/events"
                                    className="group inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 font-bold shadow-lg shadow-purple-900/30 transition-all hover:-translate-y-0.5"
                                >
                                    <FaSearch />
                                    Discover Events
                                    <FaArrowRight className="group-hover:translate-x-1 transition" />
                                </Link>
                            </div>
                        </div>
                    </section>

                    {/* CREATE EVENT FORM FOR USER */}
                    {showCreateForm && (
                        <div className="bg-[#101044] border border-purple-500/20 rounded-3xl p-6 sm:p-8 mb-10 shadow-2xl">
                            <div className="flex items-center gap-4 mb-7">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                    <FaCalendarAlt className="text-purple-400 text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black">Request to Host an Event</h2>
                                    <p className="text-gray-500 text-sm">Submit your event details. An OTP will be sent to your registered email for verification.</p>
                                </div>
                            </div>

                            <form onSubmit={handleInitiateCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <input required type="text" placeholder="Event Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="event-input" />
                                <input required type="text" placeholder="Category — e.g. Tech, Music" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="event-input" />
                                
                                <input required type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="event-input" />
                                <input required type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="event-input" />
                                
                                <input required type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="event-input md:col-span-2" />
                                <input required type="number" min="1" placeholder="Total Seats" value={formData.totalSeats} onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })} className="event-input" />
                                <input required type="number" min="0" placeholder="Ticket Price — 0 for free" value={formData.ticketPrice} onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })} className="event-input" />
                                <input type="text" placeholder="Event Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="event-input md:col-span-2" />
                                <textarea required placeholder="Event Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="event-input md:col-span-2 min-h-[140px] resize-none" />
                                <button disabled={otpLoading} type="submit" className="md:col-span-2 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white font-black py-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-50">
                                    <FaEnvelope /> {otpLoading ? "Sending Verification OTP..." : "Verify OTP & Submit Event"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* OTP VERIFICATION MODAL */}
                    {showOtpModal && (
                        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                            <div className="bg-[#101044] border border-purple-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl text-center">
                                <button
                                    onClick={() => setShowOtpModal(false)}
                                    className="absolute top-5 right-5 text-gray-400 hover:text-white transition"
                                >
                                    <FaTimes className="text-xl" />
                                </button>

                                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                    <FaKey className="text-purple-400 text-2xl" />
                                </div>

                                <h2 className="text-2xl font-black mb-1">Verify Event Submission</h2>
                                <p className="text-xs text-gray-400 mb-6">
                                    Enter the 6-digit verification code sent to <span className="text-purple-300 font-bold">{user?.email}</span>
                                </p>

                                <form onSubmit={handleVerifyAndCreateEvent} className="space-y-4">
                                    <input
                                        type="text"
                                        maxLength="6"
                                        required
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-center font-mono text-2xl tracking-[0.5em] text-white focus:border-purple-500 outline-none"
                                    />

                                    <button
                                        type="submit"
                                        disabled={submittingEvent}
                                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white font-bold transition shadow-lg disabled:opacity-50"
                                    >
                                        {submittingEvent ? "Verifying & Submitting..." : "Verify & Submit Event"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* EDIT EVENT MODAL FOR ORGANIZER */}
                    {editingEvent && (
                        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
                            <div className="bg-[#101044] border border-purple-500/30 rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                            <FaEdit className="text-purple-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black">Edit Event</h2>
                                            <p className="text-gray-400 text-xs">Update your event details</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setEditingEvent(null)}
                                        className="p-2 text-gray-400 hover:text-white rounded-lg transition"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>

                                <form onSubmit={handleUpdateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input required type="text" placeholder="Event Title" value={editFormData.title} onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })} className="event-input" />
                                    <input required type="text" placeholder="Category" value={editFormData.category} onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })} className="event-input" />
                                    
                                    <input required type="date" value={editFormData.date} onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })} className="event-input" />
                                    <input required type="time" value={editFormData.time} onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })} className="event-input" />

                                    <input required type="text" placeholder="Location" value={editFormData.location} onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })} className="event-input md:col-span-2" />
                                    <input required type="number" min="1" placeholder="Total Seats" value={editFormData.totalSeats} onChange={(e) => setEditFormData({ ...editFormData, totalSeats: e.target.value })} className="event-input" />
                                    <input required type="number" min="0" placeholder="Ticket Price" value={editFormData.ticketPrice} onChange={(e) => setEditFormData({ ...editFormData, ticketPrice: e.target.value })} className="event-input" />
                                    <input type="text" placeholder="Event Image URL" value={editFormData.image} onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })} className="event-input md:col-span-2" />
                                    <textarea required placeholder="Event Description" value={editFormData.description} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} className="event-input md:col-span-2 min-h-[120px] resize-none" />
                                    
                                    <div className="md:col-span-2 flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditingEvent(null)}
                                            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold transition shadow-lg shadow-purple-900/30"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* HOSTED EVENTS SECTION */}
                    {myEvents.length > 0 && (
                        <section className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-purple-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                                        Organizer Panel
                                    </p>
                                    <h2 className="text-2xl sm:text-3xl font-black">
                                        My Hosted Events
                                    </h2>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-black border border-purple-500/20">
                                    {myEvents.length} Event{myEvents.length > 1 ? "s" : ""}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {myEvents.map((evt) => (
                                    <div
                                        key={evt._id}
                                        className="rounded-2xl bg-[#101044]/90 border border-white/10 hover:border-purple-500/30 p-5 flex flex-col justify-between transition gap-4"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                <h3 className="font-black text-white text-lg truncate">{evt.title}</h3>
                                                <span className={`px-2.5 py-1 text-[10px] font-black rounded uppercase border shrink-0 ${getStatusStyle(evt.status)}`}>
                                                    {evt.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mb-4 line-clamp-2">{evt.description}</p>
                                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1.5">
                                                    <FaCalendarAlt className="text-purple-400" />
                                                    {new Date(evt.date).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <FaChair className="text-green-400" />
                                                    {evt.availableSeats} / {evt.totalSeats}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <FaMapMarkerAlt className="text-pink-400" />
                                                    {evt.location}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-3 border-t border-white/5">
                                            <button
                                                onClick={() => handleOpenEditModal(evt)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white border border-purple-500/20 text-xs font-black py-2.5 rounded-xl transition"
                                            >
                                                <FaEdit /> Edit Event
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEvent(evt._id)}
                                                className="w-10 h-10 shrink-0 flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl transition"
                                                title="Delete event"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* STATISTICS */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                        <div className="group relative overflow-hidden rounded-2xl bg-[#101044]/90 border border-purple-500/20 p-6 hover:border-purple-500/40 transition">
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium">Total Bookings</p>
                                    <h2 className="text-3xl font-black mt-2">{totalBookings}</h2>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-400/20 flex items-center justify-center">
                                    <FaTicketAlt className="text-purple-400 text-xl" />
                                </div>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-2xl bg-[#101044]/90 border border-blue-500/20 p-6 hover:border-blue-500/40 transition">
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium">Confirmed</p>
                                    <h2 className="text-3xl font-black mt-2">{confirmedBookings}</h2>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-400/20 flex items-center justify-center">
                                    <FaCheckCircle className="text-blue-400 text-xl" />
                                </div>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-2xl bg-[#101044]/90 border border-yellow-500/20 p-6 hover:border-yellow-500/40 transition">
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium">Pending</p>
                                    <h2 className="text-3xl font-black mt-2">{pendingBookings}</h2>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-yellow-500/15 border border-yellow-400/20 flex items-center justify-center">
                                    <FaClock className="text-yellow-400 text-xl" />
                                </div>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-2xl bg-[#101044]/90 border border-red-500/20 p-6 hover:border-red-500/40 transition">
                            <div className="relative flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm font-medium">Cancelled</p>
                                    <h2 className="text-3xl font-black mt-2">{cancelledBookings}</h2>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-red-500/15 border border-red-400/20 flex items-center justify-center">
                                    <FaTimesCircle className="text-red-400 text-xl" />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* BOOKINGS SECTION */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-pink-400 text-xs font-bold uppercase tracking-[0.2em] mb-2">
                                    Your Experience
                                </p>
                                <h2 className="text-2xl sm:text-3xl font-black">
                                    Recent Bookings
                                </h2>
                            </div>

                            <Link
                                to="/events"
                                className="hidden sm:flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold text-sm transition"
                            >
                                Explore Events
                                <FaArrowRight />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="rounded-2xl bg-[#101044]/90 border border-white/10 p-10 text-center">
                                <div className="w-8 h-8 mx-auto border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
                                <p className="text-gray-500 text-sm mt-4">
                                    Loading your bookings...
                                </p>
                            </div>
                        ) : bookings.length === 0 ? (
                            <div className="rounded-2xl bg-[#101044]/90 border border-white/10 p-10 sm:p-14 text-center">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                    <FaTicketAlt className="text-purple-400 text-2xl" />
                                </div>

                                <h3 className="text-xl font-bold mt-5">No bookings yet</h3>
                                <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                                    You haven't booked any events yet. Discover something exciting and make your next big moment count.
                                </p>

                                <Link
                                    to="/events"
                                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 font-bold hover:-translate-y-0.5 transition"
                                >
                                    Explore Events
                                    <FaArrowRight />
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {bookings.map((booking) => (
                                    <div
                                        key={booking._id}
                                        className="group rounded-2xl bg-[#101044]/90 border border-white/10 hover:border-purple-500/30 p-5 transition"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/20 flex items-center justify-center">
                                                    <FaTicketAlt className="text-purple-400 text-xl" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-white font-bold text-lg truncate">
                                                        {booking.eventId?.title ||
                                                            booking.event?.title ||
                                                            "Event Booking"}
                                                    </h3>

                                                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                                                        <span className="flex items-center gap-2">
                                                            <FaCalendarAlt />
                                                            {booking.eventId?.date
                                                                ? new Date(booking.eventId.date).toLocaleDateString()
                                                                : booking.event?.date
                                                                ? new Date(booking.event.date).toLocaleDateString()
                                                                : "Date unavailable"}
                                                        </span>

                                                        <span>
                                                            Booking ID: {booking._id?.slice(-8)}
                                                        </span>

                                                        {booking.amount !== undefined && (
                                                            <span className="text-purple-300 font-semibold">
                                                                {booking.amount === 0 ? "Free" : `₹${booking.amount}`}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 self-start md:self-center">
                                                <div
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-bold uppercase ${getStatusStyle(
                                                        booking.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(booking.status)}
                                                    {booking.status || "Unknown"}
                                                </div>

                                                {String(booking.status).trim().toLowerCase() === "pending" && (
                                                    <button
                                                        onClick={() => handlePayment(booking)}
                                                        disabled={processingPaymentId === booking._id}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 font-bold text-xs uppercase transition shadow-lg shadow-green-900/20 disabled:opacity-50"
                                                    >
                                                        <FaCreditCard className="text-sm" />
                                                        {processingPaymentId === booking._id ? "Processing..." : `Pay ₹${booking.amount || ""}`}
                                                    </button>
                                                )}

                                                {String(booking.status).trim().toLowerCase() === "confirmed" && (
                                                    <button
                                                        onClick={() => setSelectedTicket(booking)}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 font-bold text-xs uppercase transition shadow-lg shadow-purple-900/20"
                                                    >
                                                        <FaQrcode className="text-sm" /> View Ticket
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* TICKET MODAL WITH QR CODE */}
            {selectedTicket && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#101044] border border-purple-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full relative text-center shadow-2xl">
                        <button
                            onClick={() => setSelectedTicket(null)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-white transition"
                        >
                            <FaTimes className="text-xl" />
                        </button>

                        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 mb-1">
                            Official Event Ticket
                        </h2>
                        <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider mb-6">
                            The Event Canvas
                        </p>

                        <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-lg">
                            {selectedTicket.qrCode ? (
                                <img
                                    src={selectedTicket.qrCode}
                                    alt="Ticket QR Code"
                                    className="w-48 h-48 mx-auto"
                                />
                            ) : (
                                <div className="w-48 h-48 flex items-center justify-center bg-gray-100 text-gray-400 text-xs font-semibold">
                                    QR Code Unavailable
                                </div>
                            )}
                        </div>

                        <div className="text-left bg-white/5 rounded-2xl p-4 text-sm space-y-2 mb-6 border border-white/10">
                            <p className="flex justify-between">
                                <span className="text-gray-400">Event:</span>
                                <strong className="text-white font-bold truncate max-w-[200px]">
                                    {selectedTicket.eventId?.title || selectedTicket.event?.title || "N/A"}
                                </strong>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-400">Attendee:</span>
                                <strong className="text-white font-bold">{user?.name || "Event Explorer"}</strong>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-400">Booking ID:</span>
                                <strong className="text-purple-400 font-mono">{selectedTicket._id}</strong>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-400">Status:</span>
                                <strong className="text-green-400 uppercase font-bold">{selectedTicket.status}</strong>
                            </p>
                        </div>

                        <button
                            onClick={() => window.print()}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 font-bold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-lg shadow-purple-900/30 text-sm"
                        >
                            <FaPrint /> Save / Print Ticket
                        </button>
                    </div>
                </div>
            )}

            <style>
                {`
                    .event-input {
                        width: 100%;
                        background: rgba(255,255,255,0.04);
                        border: 1px solid rgba(255,255,255,0.08);
                        color: white;
                        padding: 14px 16px;
                        border-radius: 12px;
                        outline: none;
                        transition: all 0.2s ease;
                    }
                    .event-input::placeholder { color: #666680; }
                    .event-input:focus {
                        border-color: rgba(168,85,247,0.7);
                        box-shadow: 0 0 0 3px rgba(168,85,247,0.1);
                    }
                    .event-input::-webkit-calendar-picker-indicator {
                        filter: invert(1);
                        opacity: 0.6;
                    }
                `}
            </style>

            <footer className="relative z-10 border-t border-white/10 bg-[#05052b]/80">
                <div className="max-w-7xl mx-auto px-5 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <p className="text-gray-600 text-xs text-center sm:text-left">
                            © {new Date().getFullYear()} The Event Canvas. Discover. Book. Experience.
                        </p>
                        <p className="text-purple-400/70 text-xs font-semibold">
                            Your Next Big Moment.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UserDashboard;