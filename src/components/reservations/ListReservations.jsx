// src/components/reservations/crud/ListReservations.jsx
import React from 'react';
import { useGetReservations } from '../../shared/hooks/useGetReservations';

export const ListReservations = () => {
  const { reservations, isLoading, error, fetchReservations } = useGetReservations();

  return (
    <div className="p-3 border rounded">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Lista de Reservaciones</h5>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={fetchReservations}
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Recargar'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          Error al cargar reservaciones: {error.message || 'Intenta de nuevo.'}
        </div>
      )}

      {!isLoading && reservations.length === 0 && (
        <div className="text-muted">No hay reservaciones disponibles.</div>
      )}

      {reservations.length > 0 && (
        <ul className="list-group">
          {reservations.map(res => (
            <li key={res._id} className="list-group-item">
              <div><strong>ID:</strong> {res._id}</div>
              <div><strong>Usuario:</strong> {res.user}</div>
              <div><strong>Hotel:</strong> {res.hotel}</div>
              <div><strong>Habitación:</strong> {res.room}</div>
              <div><strong>Entrada:</strong> {new Date(res.checkInDate).toLocaleDateString()}</div>
              <div><strong>Salida:</strong> {new Date(res.checkOutDate).toLocaleDateString()}</div>
              <div><strong>Estado:</strong> {res.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
