// src/shared/hooks/useCreateRoom.jsx
import { useState } from 'react';
import { createRoom as createRoomRequest } from '../../services';
import toast from 'react-hot-toast';

export const useCreateRoom = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createRoom = async roomData => {
    setIsLoading(true);
    try {
      const response = await createRoomRequest(roomData);
      if (response.error) {
        const err = response.details;
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        return { success: false };
      }
      toast.success(response.data.message || 'Habitación creada');
      return { success: true, data: response.data };
    } catch (err) {
      toast.error('Error inesperado: ' + err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { createRoom, isLoading };
};
