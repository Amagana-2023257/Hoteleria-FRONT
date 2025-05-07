// src/shared/hooks/useUpdateReservation.jsx
import { useState } from 'react';
import { updateReservation as updateReservationRequest } from '../../services';
import toast from 'react-hot-toast';

export const useUpdateReservation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateReservation = async (id, data) => {
    setIsLoading(true);
    try {
      const response = await updateReservationRequest(id, data);
      if (response.error) {
        const err = response.details;
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        return { success: false };
      }
      toast.success(response.data.message || 'Reservación actualizada');
      return { success: true, data: response.data };
    } catch (err) {
      toast.error('Error inesperado: ' + err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { updateReservation, isLoading };
};
