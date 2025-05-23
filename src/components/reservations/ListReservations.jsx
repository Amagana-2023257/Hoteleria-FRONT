// src/components/reservations/crud/ListReservations.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useGetReservations } from '../../shared/hooks/useGetReservations';

const formatDate = iso => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-GT');
};

export const ListReservations = () => {
  const { reservations, isLoading, error, fetchReservations } = useGetReservations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mt-4"
    >
      <div className="card shadow-sm rounded overflow-hidden">
        {/* Header Instagram-style */}
        <div
          className="px-4 py-3 d-flex justify-content-between align-items-center"
          style={{
            background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F56040)'
          }}
        >
          <h5 className="text-white mb-0">📋 Lista de Reservaciones</h5>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={fetchReservations}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Cargando…' : '🔄 Recargar'}
          </button>
        </div>

        <div className="card-body bg-white">
          {error && (
            <div className="alert alert-danger">
              Error al cargar reservaciones: {error.message || 'Intenta de nuevo.'}
            </div>
          )}

          {!isLoading && reservations.length === 0 && (
            <div className="text-muted">No hay reservaciones disponibles.</div>
          )}

          {reservations.length > 0 && (
            <div className="row row-cols-1 row-cols-md-2 g-3">
              {reservations.map(r => (
                <div key={r._id} className="col">
                  <motion.div
                    className="card h-100 border-0 shadow-sm"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="card-body">
                      <h6 className="card-title mb-3 text-truncate">{r.user?.name} {r.user?.surname}</h6>
                      <ul className="list-unstyled small mb-0">
                        <li><strong>ID:</strong> {r._id}</li>
                        <li><strong>Email:</strong> {r.user?.email}</li>
                        <li><strong>Hotel:</strong> {r.hotel?.name}</li>
                        <li><strong>Habitación:</strong> {r.room?.number}</li>
                        <li><strong>Check-in:</strong> {formatDate(r.checkInDate)}</li>
                        <li><strong>Check-out:</strong> {formatDate(r.checkOutDate)}</li>
                        <li>
                          <strong>Estado:</strong>{' '}
                          <span className={`badge ${
                            r.status === 'Booked' ? 'bg-primary' :
                            r.status === 'CheckedIn' ? 'bg-success' :
                            r.status === 'CheckedOut' ? 'bg-secondary' :
                            'bg-danger'
                          }`}>
                            {r.status}
                          </span>
                        </li>
                        <li><strong>Creada:</strong> {formatDate(r.createdAt)}</li>
                        <li><strong>Actualizada:</strong> {formatDate(r.updatedAt)}</li>
                      </ul>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
