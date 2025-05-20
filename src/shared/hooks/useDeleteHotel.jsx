// src/shared/hooks/useDeleteHotel.jsx
import { useState } from 'react';
import { deleteHotel as deleteHotelRequest } from '../../services';
import toast from 'react-hot-toast';

export const useDeleteHotel = () => {
  const [isLoading, setIsLoading] = useState(false);

  const deleteHotel = async id => {
    setIsLoading(true);
    try {
      const response = await deleteHotelRequest(id);

      if (response.error) {
        const err = response.e;
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        return { success: false };
      }

      toast.success(response.data.message || 'Hotel eliminado');
      return { success: true };
    } catch (err) {
      toast.error('Error inesperado: ' + err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteHotel, isLoading };
};
