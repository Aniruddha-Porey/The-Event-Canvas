import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import logo from "../assets/logo.png";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <>
            {/* ================= NAVBAR ================= */}
            <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-[#05052b]/85 backdrop-blur-xl">

                <div className="mx-auto flex h-20 w-[92%] max-w-7xl items-center justify-between">

                    {/* ================= LOGO ================= */}
                    <Link
                        to="/"
                        onClick={closeMenu}
                        className="flex items-center group"
                    >
                        <img
                            src={logo}
                            alt="The Event Canvas"
                            className="h-14 sm:h-16 w-auto object-contain transition duration-300 group-hover:scale-105"
                        />
                    </Link>

                    {/* ================= DESKTOP NAV ================= */}
                    <div className="hidden md:flex items-center gap-8">

                        <Link
                            to="/"
                            className={`relative font-medium transition duration-300 ${
                                isActive("/")
                                    ? "text-orange-400"
                                    : "text-white hover:text-orange-400"
                            }`}
                        >
                            Home

                            {isActive("/") && (
                                <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500" />
                            )}
                        </Link>

                        <Link
                            to="/events"
                            className={`relative font-medium transition duration-300 ${
                                isActive("/events")
                                    ? "text-pink-400"
                                    : "text-white hover:text-pink-400"
                            }`}
                        >
                            Events

                            {isActive("/events") && (
                                <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500" />
                            )}
                        </Link>

                        {user && (
                            <Link
                                to={
                                    user.role === "admin"
                                        ? "/admin"
                                        : "/dashboard"
                                }
                                className={`relative font-medium transition duration-300 ${
                                    isActive(
                                        user.role === "admin"
                                            ? "/admin"
                                            : "/dashboard"
                                    )
                                        ? "text-purple-400"
                                        : "text-white hover:text-purple-400"
                                }`}
                            >
                                Dashboard

                                {isActive(
                                    user.role === "admin"
                                        ? "/admin"
                                        : "/dashboard"
                                ) && (
                                    <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500" />
                                )}
                            </Link>
                        )}

                        {/* ================= AUTH ================= */}

                        {!user ? (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-full border border-white/20 bg-white/5 px-6 py-2.5 font-semibold text-white backdrop-blur-md transition duration-300 hover:border-pink-400/50 hover:bg-white/10"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-pink-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-pink-500/40"
                                >
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">

                                {/* USER */}
                                <div className="flex items-center gap-2 text-white">
                                    <FaUserCircle className="text-xl text-pink-400" />

                                    <span className="font-medium">
                                        {user.name}
                                    </span>
                                </div>

                                {/* LOGOUT */}
                                <button
                                    onClick={logout}
                                    className="rounded-full border border-red-400/30 bg-red-500/10 px-5 py-2 font-semibold text-red-300 transition duration-300 hover:bg-red-500 hover:text-white"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ================= MOBILE BUTTON ================= */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-3 text-xl text-white transition hover:bg-white/10 md:hidden"
                        aria-label="Toggle navigation menu"
                    >
                        {menuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* ================= MOBILE MENU ================= */}
                {menuOpen && (
                    <div className="border-t border-white/10 bg-[#05052b]/95 px-6 py-6 backdrop-blur-xl md:hidden">

                        <div className="mx-auto flex max-w-7xl flex-col gap-4">

                            <Link
                                to="/"
                                onClick={closeMenu}
                                className={`rounded-xl px-4 py-3 font-medium transition ${
                                    isActive("/")
                                        ? "bg-white/10 text-orange-400"
                                        : "text-white hover:bg-white/5 hover:text-orange-400"
                                }`}
                            >
                                Home
                            </Link>

                            <Link
                                to="/events"
                                onClick={closeMenu}
                                className={`rounded-xl px-4 py-3 font-medium transition ${
                                    isActive("/events")
                                        ? "bg-white/10 text-pink-400"
                                        : "text-white hover:bg-white/5 hover:text-pink-400"
                                }`}
                            >
                                Events
                            </Link>

                            {user && (
                                <Link
                                    to={
                                        user.role === "admin"
                                            ? "/admin"
                                            : "/dashboard"
                                    }
                                    onClick={closeMenu}
                                    className="rounded-xl px-4 py-3 font-medium text-white transition hover:bg-white/5 hover:text-purple-400"
                                >
                                    Dashboard
                                </Link>
                            )}

                            {!user ? (
                                <>
                                    <Link
                                        to="/login"
                                        onClick={closeMenu}
                                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center font-semibold text-white transition hover:bg-white/10"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        onClick={closeMenu}
                                        className="rounded-xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 px-4 py-3 text-center font-semibold text-white shadow-lg"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-white">
                                        <FaUserCircle className="text-xl text-pink-400" />

                                        <div>
                                            <p className="text-sm text-gray-400">
                                                Welcome
                                            </p>

                                            <p className="font-semibold">
                                                {user.name}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            logout();
                                            closeMenu();
                                        }}
                                        className="rounded-xl bg-red-500/10 px-4 py-3 font-semibold text-red-300 transition hover:bg-red-500 hover:text-white"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* ================= NAVBAR SPACING ================= */}
            <div className="h-20" />
        </>
    );
};

export default Navbar;