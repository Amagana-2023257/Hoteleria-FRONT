// src/shared/hooks/useRegister.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerRequest } from "../../services/api";
import toast from "react-hot-toast";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (formData) => {
    setIsLoading(true);
    try {
      const response = await registerRequest(formData);

      if (response.error) {
        const err = response.e;
        const payload = err.response?.data;

        if (Array.isArray(payload?.errors)) {
          payload.errors.forEach(({ msg }) => {
            toast.error(msg);
          });
        } else {
          toast.error(payload?.msg || err.message || "Error al registrar");
        }
        return;
      }

      const { data } = response;
      toast.success(data.msg || "Cuenta creada exitosamente");
      localStorage.setItem("user", JSON.stringify(data.userDetails));
      navigate("/dashboard");

    } catch (err) {
      console.error("Error inesperado:", err);
      toast.error("Error inesperado: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading };
};
