// src/shared/hooks/useGetReservations.jsx
import { useState, useEffect } from 'react';
import { getReservations as getReservationsRequest } from '../../services';

export const useGetReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const response = await getReservationsRequest();
      if (response.error) {
        setError(response.details);
      } else {
        setReservations(response.data.reservations);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return { reservations, isLoading, error, fetchReservations };
};
