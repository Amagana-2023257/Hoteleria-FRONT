// src/shared/hooks/useUpdateHotel.jsx
import { useState } from 'react';
import { updateHotel as updateHotelRequest } from '../../services';
import toast from 'react-hot-toast';

export const useUpdateHotel = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateHotel = async (id, data) => {
    setIsLoading(true);
    try {
      const response = await updateHotelRequest(id, data);

      if (response.error) {
        const err = response.e;
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        return { success: false };
      }

      toast.success(response.data.message || 'Hotel actualizado');
      return { success: true, data: response.data };
    } catch (err) {
      toast.error('Error inesperado: ' + err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { updateHotel, isLoading };
};
