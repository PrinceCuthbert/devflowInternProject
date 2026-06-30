import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios"; // Retained temporarily for your traditional REST signup if needed

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = () => {
      try {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        const username = localStorage.getItem("username");
        const role = localStorage.getItem("role");

        if (token && id && username && role) {
          setUser({ id, username, role, token });
        } else {
          localStorage.clear();
        }
      } catch (error) {
        console.error("Session token validation failed, wiping context", error);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    bootstrapAuth();
  }, []);

  // 🔄 Handles saving credentials upon final validation success
  const completeLoginSession = (authPayload) => {
    const { token, user: userData } = authPayload;

    localStorage.setItem("token", token);
    localStorage.setItem("id", userData.id);
    localStorage.setItem("username", userData.username);
    localStorage.setItem("role", userData.role);

    setUser({ ...userData, token });
  };

  const register = async (username, password, email, phoneNumber) => {
    // Porting signup to match your updated backend properties fields
    await axios.post("http://localhost:5000/api/auth/register", {
      username,
      password,
      email,
      phoneNumber,
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, completeLoginSession, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
