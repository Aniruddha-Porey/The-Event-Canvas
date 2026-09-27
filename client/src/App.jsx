import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";


// ==========================================
// LAYOUT
// ==========================================

const AppLayout = () => {
    const location = useLocation();

    // Pages that should NOT have Navbar/Footer
    const noLayoutPages = [
        "/login",
        "/register",
        "/forgot-password",
        "/payment-success",
        "/payment-failed",
    ];

    const hideLayout = noLayoutPages.includes(location.pathname);

    return (
        <div className="min-h-screen bg-[#05052b] flex flex-col">

            {/* NAVBAR */}
            {!hideLayout && <Navbar />}

            {/* MAIN */}
            <main className="flex-grow">

                <Routes>

                    {/* HOME */}
                    <Route
                        path="/"
                        element={<Home />}
                    />

                    {/* EVENTS */}
                    <Route
                        path="/events"
                        element={<Events />}
                    />

                    <Route
                        path="/events/:id"
                        element={<EventDetail />}
                    />

                    {/* AUTH */}
                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />

                    {/* DASHBOARDS */}
                    <Route
                        path="/dashboard"
                        element={<UserDashboard />}
                    />

                    <Route
                        path="/admin"
                        element={<AdminDashboard />}
                    />

                    {/* PAYMENT */}
                    <Route
                        path="/payment-success"
                        element={<PaymentSuccess />}
                    />

                    <Route
                        path="/payment-failed"
                        element={<PaymentFailed />}
                    />

                    {/* 404 */}
                    <Route
                        path="*"
                        element={
                            <div className="min-h-screen bg-[#05052b] text-white flex items-center justify-center">
                                <h1 className="text-3xl font-bold">
                                    404 - Page Not Found
                                </h1>
                            </div>
                        }
                    />

                </Routes>

            </main>

            {/* FOOTER */}
            {!hideLayout && <Footer />}

        </div>
    );
};


// ==========================================
// APP
// ==========================================

function App() {
    return (
        <Router>
            <AppLayout />
        </Router>
    );
}

export default App;