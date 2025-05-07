// src/shared/hooks/useDeleteReservation.jsx
import { useState } from 'react';
import { deleteReservation as deleteReservationRequest } from '../../services';
import toast from 'react-hot-toast';

export const useDeleteReservation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteReservation = async id => {
    setIsLoading(true);
    try {
      const response = await deleteReservationRequest(id);
      if (response.error) {
        const err = response.details;
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        return { success: false };
      }
      toast.success(response.data.message || 'Reservación eliminada');
      return { success: true };
    } catch (err) {
      toast.error('Error inesperado: ' + err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteReservation, isLoading };
};
