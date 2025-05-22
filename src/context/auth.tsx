"use client"

import Login from "@/app/login/page";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any;                // User object (null if not logged in)
  isAuthenticated: boolean; // Derived from `user` (true if user exists)
  loading: boolean;         // True while checking auth state
  login: () => Promise<void>;    // Login function
  logout: () => void;       // Logout function
};

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // State management
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Effects
    useEffect(() => {
        // Check localStorage for saved user on mount
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
        setUser(JSON.parse(storedUser));
        }
        setLoading(false);

        // Sync auth state across browser tabs
        const handleStorageChange = () => {
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Methods
    const login = async () => {
        Login();
    };

    const logout = async () => {
    try {
        // Clear client-side storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        // Clear auth state
        setUser(null);
        
        // Notify other tabs/windows
        window.dispatchEvent(new Event('storage'));
    } catch (error) {
        console.error('Logout error:', error);
    }
    };

    // Provider setup
    return (
        <AuthContext.Provider
        value={{
            user,
            isAuthenticated: !!user,    // Converts user to boolean
            loading,
            login,
            logout,
        }}
        >
        {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);