// src/shared/hooks/useDeleteEvent.jsx
import { useState } from 'react';
import { deleteEvent as deleteEventRequest } from '../../services';
import toast from 'react-hot-toast';

export const useDeleteEvent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteEvent = async id => {
    setIsLoading(true);
    try {
      const response = await deleteEventRequest(id);
      if (response.error) {
        const err = response.details;
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        return { success: false };
      }
      toast.success(response.data.message || 'Evento eliminado');
      return { success: true };
    } catch (err) {
      toast.error('Error inesperado: ' + err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteEvent, isLoading };
};
