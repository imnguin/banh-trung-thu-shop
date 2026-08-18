import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";
import { getStoredAuth, subscribeAuthChange } from "../services/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [seller, setSeller] = useState(getStoredAuth);

    useEffect(() => subscribeAuthChange(setSeller), []);

    async function login(username, otp) {
        const res = await authService.login(username, otp);
        return res;
    }

    async function logout() {
        await authService.logout();
    }

    const value = {
        seller,
        isAuthenticated: Boolean(seller?.accessToken),
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
