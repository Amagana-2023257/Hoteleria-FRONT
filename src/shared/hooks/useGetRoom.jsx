// src/shared/hooks/useGetRoom.jsx
import { useState, useEffect } from 'react';
import { getRoom as getRoomRequest } from '../../services';

export const useGetRoom = id => {
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoom = async () => {
    setIsLoading(true);
    try {
      const response = await getRoomRequest(id);
      if (response.error) {
        setError(response.details);
      } else {
        setRoom(response.data.room);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchRoom();
  }, [id]);

  return { room, isLoading, error, fetchRoom };
};
