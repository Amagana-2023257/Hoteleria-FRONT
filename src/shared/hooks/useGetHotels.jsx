// src/shared/hooks/useGetHotels.jsx
import { useState, useEffect } from 'react';
import { getHotels as getHotelsRequest } from '../../services';

export const useGetHotels = (filters = {}) => {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const response = await getHotelsRequest(filters);

      if (response.error) {
        setError(response.e);
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
  }, [JSON.stringify(filters)]);

  return { hotels, isLoading, error, fetchHotels };
};
