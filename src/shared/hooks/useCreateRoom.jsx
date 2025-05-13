// src/shared/hooks/useCreateRoom.jsx
import { useState, useCallback } from 'react';
import { createRoom as createRoomService } from '../../services';
import toast from 'react-hot-toast';


export const useCreateRoom = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState(null);

  const createRoom = useCallback(async (roomData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createRoomService(roomData);

      // Manejo de error de la capa de servicios
      if (response.error) {
        // extraemos mensaje de detalles si existe
        const msg = response.details?.message || 'Error al crear la habitación';
        setError(msg);
        toast.error(msg);
        return { success: false, error: msg };
      }

      // Éxito
      const successMsg = response.data?.message || 'Habitación creada correctamente';
      toast.success(successMsg);
      return { success: true, data: response.data };

    } catch (err) {
      // Errores de red o excepciones inesperadas
      const msg = err.response?.data?.message || err.message || 'Error inesperado';
      setError(msg);
      toast.error(msg);
      return { success: false, error: msg };

    } finally {
      setIsLoading(false);
    }
  }, []);

  return { createRoom, isLoading, error };
};
