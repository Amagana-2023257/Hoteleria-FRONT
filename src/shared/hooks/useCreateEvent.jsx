// src/shared/hooks/useCreateEvent.jsx
import { useState } from 'react';
import { createEvent as createEventRequest } from '../../services';
import toast from 'react-hot-toast';

export const useCreateEvent = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createEvent = async eventData => {
    setIsLoading(true);
    try {
      const response = await createEventRequest(eventData);
      if (response.error) {
        const err = response.details;
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        return { success: false };
      }
      toast.success(response.data.message || 'Evento creado');
      return { success: true, data: response.data };
    } catch (err) {
      toast.error('Error inesperado: ' + err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { createEvent, isLoading };
};
