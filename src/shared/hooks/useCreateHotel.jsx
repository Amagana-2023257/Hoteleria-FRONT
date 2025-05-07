// src/shared/hooks/useCreateHotel.jsx
import { useState } from 'react';
import { createHotel as createHotelRequest } from '../../services';
import toast from 'react-hot-toast';

export const useCreateHotel = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createHotel = async hotelData => {
    setIsLoading(true);
    try {
      const response = await createHotelRequest(hotelData);
      if (response.error) {
        const err = response.details;
        const msg = err.response?.data?.message || err.message;
        toast.error(msg);
        return { success: false };
      }
      toast.success(response.data.message || 'Hotel creado');
      return { success: true, data: response.data };
    } catch (err) {
      toast.error('Error inesperado: ' + err.message);
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { createHotel, isLoading };
};
