// src/components/rooms/crud/ListRooms.jsx
import React from 'react';
import { useGetRooms } from '../../shared/hooks/useGetRooms';

export const ListRooms = () => {
  const { rooms, isLoading, error, fetchRooms } = useGetRooms();

  return (
    <div className="p-3 border rounded">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Lista de Habitaciones</h5>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={fetchRooms}
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Recargar'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          Error al cargar habitaciones: {error.message || 'Intenta de nuevo.'}
        </div>
      )}

      {!isLoading && rooms.length === 0 && (
        <div className="text-muted">No hay habitaciones disponibles.</div>
      )}

      {rooms.length > 0 && (
        <ul className="list-group">
          {rooms.map(room => (
            <li key={room._id} className="list-group-item">
              <div><strong>ID:</strong> {room._id}</div>
              <div><strong>Hotel:</strong> {room.hotel}</div>
              <div><strong>Número:</strong> {room.number}</div>
              <div><strong>Tipo:</strong> {room.type}</div>
              <div><strong>Precio:</strong> Q{room.price}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
