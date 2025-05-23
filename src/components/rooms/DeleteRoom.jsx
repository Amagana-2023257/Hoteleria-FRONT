// src/components/rooms/crud/DeleteRoom.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useDeleteRoom } from '../../shared/hooks/useDeleteRoom';
import { useGetRooms } from '../../shared/hooks/useGetRooms';

const formatDate = iso => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-GT');
};

export const DeleteRoom = ({ onDeleted }) => {
  const { deleteRoom, isLoading: deleting } = useDeleteRoom();
  const { rooms, isLoading: loadingRooms, error: fetchError } = useGetRooms();
  const [selectedRoomId, setSelectedRoomId] = useState('');

  const handleChange = e => {
    setSelectedRoomId(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedRoomId) return;
    const result = await deleteRoom(selectedRoomId);
    if (result.success) {
      onDeleted?.(selectedRoomId);
      setSelectedRoomId('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mt-4"
    >
      <form
        onSubmit={handleSubmit}
        className="card shadow-sm"
      >
        {/* Header */}
        <div
          className="px-4 py-2"
          style={{
            background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F56040)'
          }}
        >
          <h5 className="text-white mb-0">Eliminar Habitación</h5>
        </div>
        <div className="card-body">
          {fetchError && (
            <div className="alert alert-danger">
              Error cargando habitaciones. Intenta de nuevo.
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="roomSelect" className="form-label">
              Seleccionar habitación
            </label>
            <select
              id="roomSelect"
              className="form-select"
              value={selectedRoomId}
              onChange={handleChange}
              disabled={loadingRooms || deleting}
            >
              <option value="">-- Elige una habitación --</option>
              {rooms.map(r => (
                <option key={r._id} value={r._id}>
                  {r.hotel?.name} – {r.type} – {r.capacity} pax – Q{r.price.toFixed(2)} –
                  {r.availability === 'available' ? ' Disponible' : ' No disponible'} desde {formatDate(r.availabilityDate)}
                </option>
              ))}
            </select>
          </div>
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-danger"
              disabled={!selectedRoomId || deleting}
            >
              {deleting ? 'Eliminando…' : 'Eliminar Habitación'}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

DeleteRoom.propTypes = {
  onDeleted: PropTypes.func,
};

DeleteRoom.defaultProps = {
  onDeleted: null,
};
