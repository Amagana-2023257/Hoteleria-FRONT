// src/components/events/crud/ListEvents.jsx
import React from 'react';
import { useGetEvents } from '../../shared/hooks/useGetEvents';

export const ListEvents = () => {
  const { events, isLoading, error, fetchEvents } = useGetEvents();

  return (
    <div className="p-3 border rounded">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Lista de Eventos</h5>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={fetchEvents}
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Recargar'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          Error al cargar eventos: {error.message || 'Intenta de nuevo.'}
        </div>
      )}

      {events.length === 0 && !isLoading && (
        <div className="text-muted">No hay eventos disponibles.</div>
      )}

      {events.length > 0 && (
        <ul className="list-group">
          {events.map(evt => (
            <li key={evt._id} className="list-group-item">
              <div><strong>Nombre:</strong> {evt.name}</div>
              <div><strong>Fecha:</strong> {new Date(evt.date).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
