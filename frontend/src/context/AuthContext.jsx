import React, { useState } from "react";
import { authAPI } from "../services/api";
import AuthContext from "./auth-context";

function readStoredUser() {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });

    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const register = async (name, email, password) => {
    const { data } = await authAPI.register({ name, email, password });
    return data;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}
