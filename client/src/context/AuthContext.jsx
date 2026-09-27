import React, { createContext, useEffect, useState } from "react";
import api from "../utils/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // RESTORE LOGIN SESSION
    // ==========================================
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("userInfo");
            const storedToken = localStorage.getItem("token");

            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to restore user session:", error);

            localStorage.removeItem("userInfo");
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    }, []);

    // ==========================================
    // LOGIN
    // ==========================================
    const login = async (email, password) => {
        try {
            const { data } = await api.post("/auth/login", {
                email,
                password,
            });

            // Save user profile object (contains .role, .email, .name, etc.)
            const userData = data.user;
            setUser(userData);

            // Save authentication information
            localStorage.setItem("userInfo", JSON.stringify(userData));
            localStorage.setItem("token", data.token);

            return userData;
        } catch (error) {
            const response = error.response?.data;

            // Account exists but email is not verified
            if (response?.needsVerification) {
                throw response;
            }

            throw new Error(
                response?.message || "Unable to login. Please try again."
            );
        }
    };

    // ==========================================
    // REGISTER
    // ==========================================
    const register = async (name, email, password) => {
        try {
            const { data } = await api.post("/auth/register", {
                name,
                email,
                password,
            });

            return data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Registration failed. Please try again.";

            throw new Error(message);
        }
    };

    // ==========================================
    // VERIFY OTP
    // ==========================================
    const verifyOTP = async (email, otp) => {
        try {
            const { data } = await api.post("/auth/verify-otp", {
                email,
                otp,
            });

            const userData = data.user;
            setUser(userData);

            // Save login session
            localStorage.setItem("userInfo", JSON.stringify(userData));
            localStorage.setItem("token", data.token);

            return userData;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "OTP verification failed. Please try again.";

            throw new Error(message);
        }
    };

    // ==========================================
    // LOGOUT
    // ==========================================
    const logout = () => {
        setUser(null);

        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
    };

    // ==========================================
    // CONTEXT VALUE
    // ==========================================
    const contextValue = {
        user,
        loading,
        login,
        register,
        verifyOTP,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};