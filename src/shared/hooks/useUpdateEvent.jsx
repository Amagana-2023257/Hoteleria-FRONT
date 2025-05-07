// src/shared/hooks/useUpdateEvent.jsx
import { useState } from 'react';
import { updateEvent as updateEventRequest } from '../../services';
import toast from 'react-hot-toast';

export const useUpdateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateEvent = async (id, data) => {
    setIsLoading(true);
    try {
      const response = await updateEventRequest(id, data);
      if (response.error) {
        const err = response.details;
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        return { success: false };
      }
      toast.success(response.data.message || 'Evento actualizado');
      return { success: true, data: response.data };
    } catch (err) {
      toast.error('Error inesperado: ' + err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { updateEvent, isLoading };
};
