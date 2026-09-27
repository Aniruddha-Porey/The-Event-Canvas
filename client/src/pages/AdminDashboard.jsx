import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

import {
    FaCalendarAlt,
    FaTicketAlt,
    FaUsers,
    FaMoneyBillWave,
    FaClock,
    FaPlus,
    FaTrash,
    FaEdit,
    FaCheck,
    FaTimes,
    FaMapMarkerAlt,
    FaChair,
    FaHourglassHalf,
} from "react-icons/fa";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [pendingEvents, setPendingEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEventForm, setShowEventForm] = useState(false);

    const [editingEvent, setEditingEvent] = useState(null);

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

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/login");
            return;
        }

        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, pendingEventsRes, bookingsRes] = await Promise.all([
                api.get("/events"),
                api.get("/events/pending"),
                api.get("/bookings/my"),
            ]);

            setEvents(eventsRes.data);
            setPendingEvents(pendingEventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error("Error fetching admin data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();

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
                ticketPrice: formData.ticketPrice,
                image: formData.image,
            };

            await api.post("/events", payload);
            setShowEventForm(false);
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

            fetchData();
        } catch (error) {
            alert(
                error.response?.data?.message || "Error creating event"
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
            setEditingEvent(null);
            fetchData();
        } catch (error) {
            alert(
                error.response?.data?.message || "Error updating event"
            );
        }
    };

    const handleUpdateEventStatus = async (id, status) => {
        try {
            await api.patch(`/events/${id}/status`, { status });
            alert(`Event submission has been ${status}! An automated notification email was sent to the organizer.`);
            fetchData();
        } catch (error) {
            alert(
                error.response?.data?.message || `Error updating event status to ${status}`
            );
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await api.delete(`/events/${id}`);
                fetchData();
            } catch (error) {
                alert(
                    error.response?.data?.message || "Error deleting event"
                );
            }
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
            fetchData();
        } catch (error) {
            alert(
                error.response?.data?.message || "Error confirming booking"
            );
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm("Cancel this user's booking request?")) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchData();
            } catch (error) {
                alert(
                    error.response?.data?.message || "Error cancelling booking"
                );
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#05052b] flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-5"></div>
                    <p className="text-gray-400 font-semibold">
                        Loading admin panel...
                    </p>
                </div>
            </div>
        );
    }

    const totalRevenue = bookings.reduce(
        (sum, booking) =>
            booking.paymentStatus === "paid" && booking.status === "confirmed"
                ? sum + booking.amount
                : sum,
        0
    );

    const paidClients = new Set(
        bookings
            .filter(
                (booking) =>
                    booking.paymentStatus === "paid" &&
                    booking.status === "confirmed"
            )
            .map((booking) => booking.userId?._id)
    ).size;

    const pendingRequests = bookings.filter(
        (booking) => booking.status === "pending"
    ).length;

    return (
        <div className="min-h-screen bg-[#05052b] text-white relative overflow-hidden">
            <div className="fixed -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* ADMIN HEADER */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#11114a] via-[#151552] to-[#101044] border border-purple-500/20 p-6 sm:p-8 mb-8 shadow-2xl">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-400/20 mb-4">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                <span className="text-purple-300 text-xs font-bold uppercase tracking-wider">
                                    Administrator
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black mb-2">
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-400">
                                Manage events, approve submissions, and handle bookings.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowEventForm(!showEventForm)}
                            className="group w-full md:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 text-white font-black py-3.5 px-6 rounded-xl shadow-lg shadow-purple-900/30 transition-all hover:-translate-y-0.5"
                        >
                            <FaPlus className={showEventForm ? "rotate-45 transition-transform" : "transition-transform"} />
                            {showEventForm ? "Cancel Creation" : "Create New Event"}
                        </button>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                    <div className="bg-[#101044] border border-green-500/10 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs font-black uppercase tracking-wider mb-2">
                                    Total Revenue
                                </p>
                                <h3 className="text-3xl font-black text-green-400">
                                    ₹{totalRevenue}
                                </h3>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                <FaMoneyBillWave className="text-green-400 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#101044] border border-blue-500/10 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs font-black uppercase tracking-wider mb-2">
                                    Paid Clients
                                </p>
                                <h3 className="text-3xl font-black text-blue-400">
                                    {paidClients}
                                </h3>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center">
                                <FaUsers className="text-blue-400 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#101044] border border-yellow-500/10 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs font-black uppercase tracking-wider mb-2">
                                    Pending Bookings
                                </p>
                                <h3 className="text-3xl font-black text-yellow-400">
                                    {pendingRequests}
                                </h3>
                            </div>
                            <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                                <FaClock className="text-yellow-400 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* CREATE EVENT FORM */}
                {showEventForm && (
                    <div className="bg-[#101044] border border-purple-500/20 rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl">
                        <div className="flex items-center gap-4 mb-7">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                <FaCalendarAlt className="text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black">Create New Event</h2>
                                <p className="text-gray-500 text-sm">Add a new experience to The Event Canvas.</p>
                            </div>
                        </div>

                        <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <input required type="text" placeholder="Event Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="event-input" />
                            <input required type="text" placeholder="Category — e.g. Tech, Music" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="event-input" />
                            
                            <input required type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="event-input" />
                            <input required type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="event-input" />

                            <input required type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="event-input md:col-span-2" />
                            <input required type="number" min="1" placeholder="Total Seats" value={formData.totalSeats} onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })} className="event-input" />
                            <input required type="number" min="0" placeholder="Ticket Price — 0 for free" value={formData.ticketPrice} onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })} className="event-input" />
                            <input type="text" placeholder="Event Image URL" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="event-input md:col-span-2" />
                            <textarea required placeholder="Event Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="event-input md:col-span-2 min-h-[140px] resize-none" />
                            <button type="submit" className="md:col-span-2 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white font-black py-4 rounded-xl shadow-lg transition-all hover:-translate-y-0.5">
                                <FaPlus /> Publish Event
                            </button>
                        </form>
                    </div>
                )}

                {/* EDIT EVENT MODAL OVERLAY */}
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
                                        <p className="text-gray-400 text-xs">Update event details and capacity</p>
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

                {/* PENDING EVENT APPROVALS SECTION */}
                {pendingEvents.length > 0 && (
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                <FaHourglassHalf className="text-orange-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black">Pending Event Approvals</h2>
                                <p className="text-gray-500 text-xs">Review user-submitted events awaiting approval</p>
                            </div>
                        </div>

                        <div className="bg-[#101044] rounded-2xl border border-orange-500/20 overflow-hidden shadow-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pendingEvents.map((evt) => (
                                <div key={evt._id} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex flex-col justify-between gap-4">
                                    <div>
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <h4 className="font-black text-white text-lg">{evt.title}</h4>
                                            <span className="px-2.5 py-1 text-[10px] font-black rounded uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                                Pending Approval
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-3 line-clamp-2">{evt.description}</p>
                                        <p className="text-xs text-purple-300 mb-1">Created by: <strong>{evt.createdBy?.name || "User"}</strong> ({evt.createdBy?.email})</p>
                                        <div className="text-xs text-gray-500 flex flex-wrap gap-3">
                                            <span>📍 {evt.location}</span>
                                            <span>💺 {evt.totalSeats} seats</span>
                                            <span>💰 {evt.ticketPrice === 0 ? "Free" : `₹${evt.ticketPrice}`}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdateEventStatus(evt._id, 'approved')}
                                            className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white border border-green-500/20 text-xs font-black py-2.5 rounded-xl transition"
                                        >
                                            <FaCheck /> Approve Event
                                        </button>
                                        <button
                                            onClick={() => handleUpdateEventStatus(evt._id, 'rejected')}
                                            className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 text-xs font-black py-2.5 rounded-xl transition"
                                        >
                                            <FaTimes /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CONTENT GRID */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* ALL APPROVED EVENTS */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                    <FaCalendarAlt className="text-purple-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black">Active Events</h2>
                                    <p className="text-gray-500 text-xs">Manage published active events</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-black">
                                {events.length}
                            </span>
                        </div>

                        <div className="bg-[#101044] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                            <ul className="divide-y divide-white/5 max-h-[650px] overflow-y-auto">
                                {events.length === 0 ? (
                                    <li className="p-10 text-center">
                                        <FaCalendarAlt className="text-gray-700 text-4xl mx-auto mb-4" />
                                        <p className="text-gray-500">No active events created yet.</p>
                                    </li>
                                ) : (
                                    events.map((event) => (
                                        <li key={event._id} className="p-5 hover:bg-white/[0.02] transition">
                                            <div className="flex justify-between items-center gap-4">
                                                <div className="min-w-0">
                                                    <h4 className="font-black text-white mb-2 truncate">{event.title}</h4>
                                                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1.5">
                                                            <FaCalendarAlt className="text-purple-400" />
                                                            {new Date(event.date).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <FaChair className={event.availableSeats > 0 ? "text-green-400" : "text-red-400"} />
                                                            {event.availableSeats} / {event.totalSeats}
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <FaMapMarkerAlt className="text-pink-400" />
                                                            {event.location}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 shrink-0">
                                                    <button
                                                        onClick={() => handleOpenEditModal(event)}
                                                        className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white flex items-center justify-center transition"
                                                        title="Edit event"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(event._id)}
                                                        className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition"
                                                        title="Delete event"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* BOOKING REQUESTS */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                                    <FaTicketAlt className="text-pink-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black">Booking Requests</h2>
                                    <p className="text-gray-500 text-xs">Review and manage bookings</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 text-xs font-black">
                                {bookings.length}
                            </span>
                        </div>

                        <div className="bg-[#101044] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                            <ul className="divide-y divide-white/5 max-h-[650px] overflow-y-auto">
                                {bookings.length === 0 ? (
                                    <li className="p-10 text-center">
                                        <FaTicketAlt className="text-gray-700 text-4xl mx-auto mb-4" />
                                        <p className="text-gray-500">No bookings yet.</p>
                                    </li>
                                ) : (
                                    bookings.map((booking) => (
                                        <li
                                            key={booking._id}
                                            className={`p-5 border-l-4 ${
                                                booking.status === "pending"
                                                    ? "border-yellow-400"
                                                    : booking.status === "confirmed"
                                                    ? "border-green-400"
                                                    : "border-red-400"
                                            }`}
                                        >
                                            <div className="flex justify-between gap-4 mb-4">
                                                <div className="min-w-0">
                                                    <h4 className="font-black text-white leading-tight">
                                                        {booking.eventId?.title || "Deleted Event"}
                                                    </h4>
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        Booking ID: {booking._id.slice(-8)}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-end gap-1 shrink-0">
                                                    <span
                                                        className={`px-2.5 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
                                                            booking.status === "confirmed"
                                                                ? "bg-green-500/10 text-green-400"
                                                                : booking.status === "cancelled"
                                                                ? "bg-red-500/10 text-red-400"
                                                                : "bg-yellow-500/10 text-yellow-400"
                                                        }`}
                                                    >
                                                        {booking.status}
                                                    </span>

                                                    {booking.status !== "cancelled" && (
                                                        <span
                                                            className={`px-2.5 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
                                                                booking.paymentStatus === "paid"
                                                                    ? "bg-blue-500/10 text-blue-400"
                                                                    : "bg-white/5 text-gray-400"
                                                            }`}
                                                        >
                                                            {booking.paymentStatus.replace("_", " ")}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 mb-4 space-y-3">
                                                <div>
                                                    <p className="text-[10px] text-gray-600 uppercase font-black tracking-wider">User</p>
                                                    <p className="text-sm font-bold text-gray-300 mt-1">{booking.userId?.name || "Unknown User"}</p>
                                                    <p className="text-xs text-gray-600 mt-0.5">{booking.userId?.email || "No email"}</p>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <p className="text-[10px] text-gray-600 uppercase font-black">Amount</p>
                                                        <p className={`text-sm font-bold mt-1 ${booking.amount === 0 ? "text-green-400" : "text-gray-300"}`}>
                                                            {booking.amount === 0 ? "Free" : `₹${booking.amount}`}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[10px] text-gray-600 uppercase font-black">Requested</p>
                                                        <p className="text-sm font-bold text-gray-300 mt-1">
                                                            {new Date(booking.bookedAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {booking.eventId && (
                                                    <div className="pt-3 border-t border-white/5">
                                                        <p className="text-[10px] text-gray-600 uppercase font-black">Remaining Seats</p>
                                                        <p className={`text-sm font-black mt-1 ${booking.eventId.availableSeats > 0 ? "text-green-400" : "text-red-400"}`}>
                                                            {booking.eventId.availableSeats} remaining of {booking.eventId.totalSeats}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {booking.status === "pending" && (
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                    <button
                                                        onClick={() => handleConfirmBooking(booking._id, "paid")}
                                                        className="flex items-center justify-center gap-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white border border-green-500/20 text-xs font-black py-3 rounded-xl transition"
                                                    >
                                                        <FaCheck /> Approve Paid
                                                    </button>

                                                    <button
                                                        onClick={() => handleConfirmBooking(booking._id, "not_paid")}
                                                        className="flex items-center justify-center gap-2 bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 text-xs font-black py-3 rounded-xl transition"
                                                    >
                                                        <FaCheck /> Approve
                                                    </button>

                                                    <button
                                                        onClick={() => handleCancelBooking(booking._id)}
                                                        className="flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 text-xs font-black py-3 rounded-xl transition"
                                                    >
                                                        <FaTimes /> Reject
                                                    </button>
                                                </div>
                                            )}
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

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
        </div>
    );
};

export default AdminDashboard;