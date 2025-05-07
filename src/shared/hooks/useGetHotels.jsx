// src/shared/hooks/useGetHotels.jsx
import { useState, useEffect } from 'react';
import { getHotels as getHotelsRequest } from '../../services';

export const useGetHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const response = await getHotelsRequest();
      if (response.error) {
        setError(response.details);
      } else {
        setHotels(response.data.hotels);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return { hotels, isLoading, error, fetchHotels };
};
