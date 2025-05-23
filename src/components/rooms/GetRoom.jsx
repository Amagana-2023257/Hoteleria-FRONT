// src/components/rooms/crud/GetRoom.jsx
import React, { useState } from 'react';
import { useGetRoom } from '../../shared/hooks/useGetRoom';
import { useGetRooms } from '../../shared/hooks/useGetRooms';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

const formatDate = iso => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-GT');
};

const GetRoom = () => {
  const [roomId, setRoomId] = useState('');
  const [errorId, setErrorId] = useState(false);

  const { rooms, isLoading: loadingRooms } = useGetRooms();
  const { room, isLoading: loadingRoom, error: fetchError, fetchRoom } = useGetRoom(roomId);

  const handleChange = e => {
    setRoomId(e.target.value);
    if (e.target.value.trim()) setErrorId(false);
  };
  const handleSearch = e => {
    e.preventDefault();
    if (!roomId.trim()) {
      setErrorId(true);
      return;
    }
    fetchRoom();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mt-4"
    >
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Buscar Habitación por ID</h5>

          <form onSubmit={handleSearch} className="row g-3 align-items-end">
            <div className="col-md-6">
              <label htmlFor="roomId" className="form-label">ID de Habitación</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FaSearch /></span>
                <input
                  id="roomId"
                  type="text"
                  className={`form-control border-start-0 ${errorId ? 'is-invalid' : ''}`}
                  placeholder="Ingresa ID"
                  value={roomId}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">El ID de habitación es requerido.</div>
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="selectRoom" className="form-label">O seleccionar una habitación</label>
              <select
                id="selectRoom"
                className="form-select"
                value={roomId}
                onChange={handleChange}
                disabled={loadingRooms}
              >
                <option value="">-- Selecciona --</option>
                {rooms.map(r => (
                  <option key={r._id} value={r._id}>
                    {r.type} — {r.hotel?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary" disabled={loadingRoom}>
                {loadingRoom ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </form>

          {fetchError && (
            <motion.div
              className="alert alert-danger mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Error al buscar habitación: {fetchError.message || 'Intenta de nuevo.'}
            </motion.div>
          )}

          {room && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h6 className="mb-3">Detalles de la Habitación</h6>
              <ul className="list-group">
                {[
                  ['ID', room._id],
                  ['Hotel', room.hotel?.name || '—'],
                  ['Tipo', room.type],
                  ['Descripción', room.description || '—'],
                  ['Capacidad', `${room.capacity} pax`],
                  ['Precio', `Q${room.price.toFixed(2)}`],
                  ['Disponibilidad', room.availability === 'available' ? 'Disponible' : 'No disponible'],
                  ['Disponible desde', formatDate(room.availabilityDate)],
                  ['Creada', formatDate(room.createdAt)],
                  ['Actualizada', formatDate(room.updatedAt)]
                ].map(([label, value], i) => (
                  <li key={i} className="list-group-item">
                    <strong>{label}:</strong> {value}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GetRoom;
