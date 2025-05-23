// src/components/rooms/ListRooms.jsx
import React from 'react';
import { useGetRooms } from '../../shared/hooks/useGetRooms';
import { motion } from 'framer-motion';

// Formatea la fecha en dd/mm/yyyy
const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-GT');
};

export const ListRooms = () => {
  const { rooms, isLoading, error, fetchRooms } = useGetRooms();

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">📋 Lista de Habitaciones</h4>
        <button
          className="btn btn-outline-secondary"
          onClick={fetchRooms}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Cargando...' : '🔄 Recargar'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          Error al cargar habitaciones: {typeof error === 'string' ? error : error.message}
        </div>
      )}

      {!isLoading && rooms.length === 0 && (
        <div className="text-muted">No hay habitaciones disponibles.</div>
      )}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {rooms.map(room => (
          <div key={room._id} className="col">
            <motion.div
              className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header estilo Instagram */}
              <div
                className="px-3 py-2"
                style={{
                  background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F56040)',
                }}
              >
                <h6 className="text-white mb-0">{room.type}</h6>
              </div>

              <div className="card-body">
                <h5 className="card-title text-truncate">{room.hotel?.name || '—'}</h5>
                <p className="card-text mb-2">{room.description || 'Sin descripción.'}</p>
                <ul className="list-unstyled small mb-0">
                  <li><strong>ID:</strong> {room._id}</li>
                  <li><strong>Capacidad:</strong> {room.capacity} pax</li>
                  <li><strong>Precio:</strong> Q{room.price.toFixed(2)}</li>
                  <li>
                    <strong>Disponibilidad:</strong>{' '}
                    <span className={`badge ${
                      room.availability === 'available'
                        ? 'bg-success'
                        : 'bg-secondary'
                    }`}>
                      {room.availability === 'available' ? 'Disponible' : 'No disponible'}
                    </span>
                  </li>
                  <li>
                    <strong>Disponible desde:</strong>{' '}
                    {formatDate(room.availabilityDate)}
                  </li>
                </ul>
              </div>

            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};
