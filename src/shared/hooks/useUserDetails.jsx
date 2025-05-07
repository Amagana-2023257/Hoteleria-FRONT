// src/shared/hooks/useUserDetails.js
import { useState, useEffect } from "react";
import { logout as logoutHandler } from "./useLogout";

const getUserDetails = () => {
  const stored = localStorage.getItem("user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const useUserDetails = () => {
  const [userDetails, setUserDetails] = useState(getUserDetails());

  useEffect(() => {
    setUserDetails(getUserDetails());
  }, []);

  const logout = () => {
    logoutHandler();
    localStorage.removeItem("user");
    setUserDetails(null);
  };

  const user = userDetails?.user ?? {};

  return {
    isLogged: Boolean(userDetails?.token),
    id:        userDetails?.user?.id ?? null,
    name:      user.name ?? null,
    surname:   user.surname ?? null,
    username:  user.username ?? "Invitado",
    email:     user.email ?? null,
    phone:     user.phone ?? null,
    role:      user.role ?? null,
    token:     userDetails?.token ?? null,
    logout,
  };
};
