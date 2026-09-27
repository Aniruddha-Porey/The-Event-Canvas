import React from "react";
import { Link } from "react-router-dom";
import {
    FaInstagram,
    FaFacebook,
    FaTwitter,
} from "react-icons/fa";

import logo from "../assets/logo.png";

const Footer = () => {
    return (
        <footer className="bg-[#03031d] border-t border-white/10">

            <div className="max-w-7xl mx-auto px-5 py-6">

                <div className="flex flex-col md:flex-row items-center justify-between gap-5">

                    {/* LOGO */}
                    <Link to="/" className="flex items-center">

                        <img
                            src={logo}
                            alt="The Event Canvas"
                            className="w-32 object-contain"
                        />

                    </Link>


                    {/* LINKS */}
                    <div className="flex items-center gap-5 text-sm text-gray-400">

                        <Link
                            to="/"
                            className="hover:text-pink-400 transition"
                        >
                            Home
                        </Link>

                        <Link
                            to="/dashboard"
                            className="hover:text-purple-400 transition"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/login"
                            className="hover:text-blue-400 transition"
                        >
                            Login
                        </Link>

                    </div>


                    {/* SOCIAL */}
                    <div className="flex items-center gap-3">

                        <a
                            href="#"
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-pink-400 hover:border-pink-400/30 transition"
                        >
                            <FaInstagram />
                        </a>

                        <a
                            href="#"
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-purple-400 hover:border-purple-400/30 transition"
                        >
                            <FaFacebook />
                        </a>

                        <a
                            href="#"
                            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-400/30 transition"
                        >
                            <FaTwitter />
                        </a>

                    </div>

                </div>


                {/* COPYRIGHT */}
                <div className="border-t border-white/5 mt-5 pt-4 text-center">

                    <p className="text-xs text-gray-600">
                        © {new Date().getFullYear()} The Event Canvas.
                        Discover. Book. Experience.
                    </p>

                </div>

            </div>

        </footer>
    );
};

export default Footer;