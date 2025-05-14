// src/components/reservations/crud/ListReservations.jsx
import React from 'react';
import { useGetReservations } from '../../shared/hooks/useGetReservations';

export const ListReservations = () => {
  const { reservations, isLoading, error, fetchReservations } = useGetReservations();

  return (
    <div className="p-4 border rounded-lg bg-white shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Lista de Reservaciones</h2>
        <button
          className="px-3 py-1 border border-gray-400 text-sm rounded hover:bg-gray-100"
          onClick={fetchReservations}
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Recargar'}
        </button>
      </div>

      {error && (
        <div className="text-red-600 mb-3">
          Error al cargar reservaciones: {error.message || 'Intenta de nuevo.'}
        </div>
      )}

      {!isLoading && reservations.length === 0 && (
        <div className="text-gray-500">No hay reservaciones disponibles.</div>
      )}

      {reservations.length > 0 && (
        <ul className="space-y-4">
          {reservations.map(res => (
            <li key={res._id} className="p-4 border rounded shadow-sm bg-gray-50">
              <div><strong>ID:</strong> {res._id}</div>
              <div><strong>Usuario:</strong> {res.user?.name} {res.user?.surname} ({res.user?.email})</div>
              <div><strong>Hotel:</strong> {res.hotel?.name}</div>
              <div><strong>Habitación:</strong> {res.room?.number}</div>
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
