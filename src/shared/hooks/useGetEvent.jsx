// src/shared/hooks/useGetEvent.jsx
import { useState, useEffect } from 'react';
import { getEvent as getEventRequest } from '../../services';

export const useGetEvent = id => {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvent = async () => {
    setIsLoading(true);
    try {
      const response = await getEventRequest(id);
      if (response.error) {
        setError(response.details);
      } else {
        setEvent(response.data.event);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  return { event, isLoading, error, fetchEvent };
};
