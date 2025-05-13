import { useState, useEffect, useCallback } from 'react';
import { getRoomsByHotel as getRoomsByHotelRequest } from '../../services';
import toast from 'react-hot-toast';

/**
 * Hook para obtener las habitaciones de un hotel específico.
 * @param {string} hotelId - ObjectId del hotel.
 */
export const useGetRoomsByHotel = hotelId => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRoomsByHotel = useCallback(async () => {
    if (!hotelId) return;
    setIsLoading(true);
    try {
      const response = await getRoomsByHotelRequest(hotelId);
      if (response.error) {
        const err = response.details;
        const msg = err.response?.data?.message || err.message || 'Error al cargar habitaciones';
        toast.error(msg);
      } else {
        setRooms(response.data.rooms);
      }
    } catch (err) {
      toast.error('Error inesperado: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    fetchRoomsByHotel();
  }, [fetchRoomsByHotel]);

  return { rooms, isLoading, fetchRoomsByHotel };
};
