// src/shared/hooks/useGetRooms.jsx
import { useState, useEffect } from 'react';
import { getRooms as getRoomsRequest } from '../../services';

export const useGetRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await getRoomsRequest();
      if (response.error) {
        setError(response.details);
      } else {
        setRooms(response.data.rooms);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return { rooms, isLoading, error, fetchRooms };
};
