// src/shared/hooks/useDeleteRoom.jsx
import { useState } from 'react';
import { deleteRoom as deleteRoomRequest } from '../../services';
import toast from 'react-hot-toast';

export const useDeleteRoom = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteRoom = async id => {
    setIsLoading(true);
    try {
      const response = await deleteRoomRequest(id);
      if (response.error) {
        const err = response.details;
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        return { success: false };
      }
      toast.success(response.data.message || 'Habitación eliminada');
      return { success: true };
    } catch (err) {
      toast.error('Error inesperado: ' + err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteRoom, isLoading };
};
