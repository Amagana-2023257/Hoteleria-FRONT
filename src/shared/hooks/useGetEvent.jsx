// src/shared/hooks/useGetEvent.jsx
import { useState, useEffect, useCallback } from 'react';
import { getEvent as getEventRequest } from '../../services';

export const useGetEvent = (id) => {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvent = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getEventRequest(id);
      if (response.error) {
        setError(response.details || new Error('Error al obtener evento'));
      } else {
        setEvent(response.data.event);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return { event, isLoading, error, fetchEvent };
};
