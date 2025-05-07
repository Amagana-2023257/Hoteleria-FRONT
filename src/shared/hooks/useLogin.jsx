// src/shared/hooks/useLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const { data } = await loginRequest({ email, password });
      toast.success(data.msg || "Inicio de sesión exitoso");
      localStorage.setItem("user", JSON.stringify(data.userDetails));
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data);
      toast.error(err.response?.data?.msg || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
