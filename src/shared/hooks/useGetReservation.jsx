// src/shared/hooks/useGetReservation.jsx
import { useState, useEffect } from 'react';
import { getReservation as getReservationRequest } from '../../services';

export const useGetReservation = id => {
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReservation = async () => {
    setIsLoading(true);
    try {
      const response = await getReservationRequest(id);
      if (response.error) {
        setError(response.details);
      } else {
        setReservation(response.data.reservation);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchReservation();
  }, [id]);

  return { reservation, isLoading, error, fetchReservation };
};
