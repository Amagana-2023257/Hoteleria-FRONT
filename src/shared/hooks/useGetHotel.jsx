// src/shared/hooks/useGetHotel.jsx
import { useState, useEffect } from 'react';
import { getHotel as getHotelRequest } from '../../services';

export const useGetHotel = id => {
  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHotel = async () => {
    setIsLoading(true);
    try {
      const response = await getHotelRequest(id);
      if (response.error) {
        setError(response.details);
      } else {
        setHotel(response.data.hotel);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchHotel();
  }, [id]);

  return { hotel, isLoading, error, fetchHotel };
};
