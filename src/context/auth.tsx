'use client';

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  bio: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;                // User object (null if not logged in)
  isAuthenticated: boolean; // Derived from `user` (true if user exists)
  loading: boolean;         // True while checking auth state
  login: (userData: User) => void;    // Login function
  logout: () => void;       // Logout function
  updateUser: (userData: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {} // Add this
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // State management
    const [user, setUser] = useState<User | null>(null);
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
    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    };

    const updateUser = (userData: Partial<User>) => {
        if (!user) return;
    
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
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
            updateUser
        }}
        >
        {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);