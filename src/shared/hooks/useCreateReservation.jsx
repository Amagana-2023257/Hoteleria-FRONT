// src/shared/hooks/useCreateReservation.jsx
import { useState } from 'react';
import { createReservation as createReservationRequest } from '../../services';
import toast from 'react-hot-toast';

export const useCreateReservation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createReservation = async resData => {
    setIsLoading(true);
    try {
      const response = await createReservationRequest(resData);
      if (response.error) {
        const err = response.details;
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        return { success: false };
      }
      toast.success(response.data.message || 'Reservación creada');
      return { success: true, data: response.data };
    } catch (err) {
      toast.error('Error inesperado: ' + err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { createReservation, isLoading };
};
