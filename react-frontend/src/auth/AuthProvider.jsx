import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// 1. Create the Context (The Bubble)
const AuthContext = createContext();

// 2. Export the custom hook so other files can easily grab the auth data!
export const useAuth = () => useContext(AuthContext);

// 3. The Provider Component that wraps your app
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // When the app loads, check if we left a Keycard in localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        const id = localStorage.getItem('id');
        const username = localStorage.getItem('username');
        const role = localStorage.getItem('role');

        if (token) {
            setUser({id, username, role, token });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
        const { token,id, role } = response.data;

        // Save to browser memory
        localStorage.setItem('token', token);
        localStorage.setItem('id', id);
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);

        setUser({ id,username, role, token });
    };

    const register = async (username, password) => {
        await axios.post('http://localhost:5000/api/auth/register', { username, password });
        // Automatically log them in after they register
        await login(username, password);
    };

    const logout = () => {
        localStorage.clear(); // Shred the Keycard!
        setUser(null);
    };

    if (loading) return null; // Don't render the app until we check localStorage

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}