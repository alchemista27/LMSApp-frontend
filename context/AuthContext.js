import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from AsyncStorage saat app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const u = await AsyncStorage.getItem("user");
        const t = await AsyncStorage.getItem("token");
        if (u && t) {
          setUser(JSON.parse(u));
          setToken(t);
        }
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    await AsyncStorage.setItem("token", tokenData);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
