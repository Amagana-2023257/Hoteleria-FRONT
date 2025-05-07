// src/shared/hooks/useUpdateRoom.jsx
import { useState } from 'react';
import { updateRoom as updateRoomRequest } from '../../services';
import toast from 'react-hot-toast';

export const useUpdateRoom = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateRoom = async (id, data) => {
    setIsLoading(true);
    try {
      const response = await updateRoomRequest(id, data);
      if (response.error) {
        const err = response.details;
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        return { success: false };
      }
      toast.success(response.data.message || 'Habitación actualizada');
      return { success: true, data: response.data };
    } catch (err) {
      toast.error('Error inesperado: ' + err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { updateRoom, isLoading };
};
