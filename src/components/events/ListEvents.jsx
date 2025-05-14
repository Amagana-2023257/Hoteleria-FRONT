// src/components/events/crud/ListEvents.jsx
import React from 'react';
import { useGetEvents } from '../../shared/hooks/useGetEvents';

export const ListEvents = () => {
  const { events, isLoading, error, fetchEvents } = useGetEvents();

  return (
    <div className="p-3 border rounded bg-white shadow">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Lista de Eventos</h5>
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

      {!isLoading && events.length === 0 && (
        <div className="text-muted">No hay eventos disponibles.</div>
      )}

      {events.length > 0 && (
        <ul className="list-group">
          {events.map(evt => (
            <li key={evt._id} className="list-group-item">
              <h6 className="mb-1">{evt.name}</h6>
              <div className="text-muted mb-1">
                <strong>Hotel:</strong> {typeof evt.hotel === 'object' ? evt.hotel.name : evt.hotel}
              </div>
              <div>
                <strong>Inicio:</strong> {new Date(evt.startDate).toLocaleDateString()}<br />
                <strong>Fin:</strong> {new Date(evt.endDate).toLocaleDateString()}
              </div>
              {evt.description && (
                <div className="mt-2"><strong>Descripción:</strong> {evt.description}</div>
              )}
              {Array.isArray(evt.resources) && evt.resources.length > 0 && (
                <div className="mt-2">
                  <strong>Recursos:</strong> {evt.resources.join(', ')}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
