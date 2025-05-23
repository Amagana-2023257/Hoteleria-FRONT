// src/components/events/crud/ListEvents.jsx
import React from 'react';
import { useGetEvents } from '../../shared/hooks/useGetEvents';
import { motion } from 'framer-motion';

// Formatea la fecha en dd/mm/yyyy
const formatDate = iso => new Date(iso).toLocaleDateString('es-GT');

export const ListEvents = () => {
  const { events, isLoading, error, fetchEvents } = useGetEvents();

  return (
    <div className="container-fluid py-4">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {isLoading && (
          <div className="text-center w-100">⏳ Cargando eventos...</div>
        )}
        {!isLoading && error && (
          <div className="alert alert-danger w-100">
            Error al cargar eventos: {error.message || 'Intenta de nuevo.'}
          </div>
        )}
        {!isLoading && events.length === 0 && (
          <div className="text-muted w-100 text-center">No hay eventos disponibles.</div>
        )}

        {events.map(evt => (
          <div key={evt._id} className="col">
            <motion.div
              className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header Instagram-style */}
              <div
                className="px-3 py-2"
                style={{ background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F56040)' }}
              >
                <h6 className="text-white mb-0 text-truncate">{evt.name}</h6>
              </div>

              <div className="card-body">
                <p className="mb-1 small text-muted">
                  <strong>Hotel:</strong>{' '}
                  {evt.hotel?.name || (typeof evt.hotel === 'string' ? evt.hotel : '—')}
                </p>
                <p className="mb-1 small">
                  <strong>Inicio:</strong> {formatDate(evt.startDate)}
                </p>
                <p className="mb-2 small">
                  <strong>Fin:</strong> {formatDate(evt.endDate)}
                </p>
                {evt.description && (
                  <p className="card-text text-truncate mb-2">{evt.description}</p>
                )}
                {Array.isArray(evt.resources) && evt.resources.length > 0 && (
                  <p className="card-text small mb-0">
                    <strong>Recursos:</strong> {evt.resources.join(', ')}
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
      {/* Recargar en pie de página */}
      <div className="d-flex justify-content-end mt-3">
        <button
          className="btn btn-outline-secondary"
          onClick={fetchEvents}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Cargando...' : '🔄 Recargar Eventos'}
        </button>
      </div>
    </div>
  );
};
