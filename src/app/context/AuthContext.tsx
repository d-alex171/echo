// context/AuthContext.tsx
"use client";

import React, { createContext, useState, useContext, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  profile: any;
  login: (userProfile: any, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userProfile = localStorage.getItem("user_profile");

    if (token && userProfile) {
      setIsLoggedIn(true);
      setProfile(JSON.parse(userProfile));
    }
  }, []);

  const login = (userProfile: any, token: string) => {
    setIsLoggedIn(true);
    setProfile(userProfile);
    localStorage.setItem("access_token", token);
    localStorage.setItem("user_profile", JSON.stringify(userProfile));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setProfile(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_profile");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, profile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
