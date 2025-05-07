// src/shared/hooks/useGetEvents.jsx
import { useState, useEffect } from 'react';
import { getEvents as getEventsRequest } from '../../services';

export const useGetEvents = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await getEventsRequest();
      if (response.error) {
        setError(response.details);
      } else {
        setEvents(response.data.events);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, isLoading, error, fetchEvents };
};
