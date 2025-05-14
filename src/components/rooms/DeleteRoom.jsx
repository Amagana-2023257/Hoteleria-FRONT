// src/components/rooms/crud/DeleteRoom.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDeleteRoom } from '../../shared/hooks/useDeleteRoom';
import { useGetRooms } from '../../shared/hooks/useGetRooms';

export const DeleteRoom = ({ onDeleted }) => {
  const { deleteRoom, isLoading } = useDeleteRoom();
  const { rooms, isLoading: loadingRooms } = useGetRooms();

  const [selectedRoomId, setSelectedRoomId] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedRoomId) return;

    const result = await deleteRoom(selectedRoomId);
    if (result.success && onDeleted) {
      onDeleted(selectedRoomId);
      setSelectedRoomId('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-white shadow">
      <h5 className="mb-3">Eliminar Habitación</h5>

      <div className="mb-3">
        <label htmlFor="roomSelect" className="form-label">Seleccionar habitación</label>
        <select
          id="roomSelect"
          className="form-select"
          value={selectedRoomId}
          onChange={e => setSelectedRoomId(e.target.value)}
          disabled={loadingRooms || isLoading}
        >
          <option value="">-- Selecciona una habitación --</option>
          {rooms.map(room => (
            <option key={room._id} value={room._id}>
              {room.type} - Capacidad: {room.capacity} - Q{room.price}
            </option>
          ))}
        </select>
      </div>

      <div className="d-grid mt-3">
        <button type="submit" className="btn btn-danger" disabled={!selectedRoomId || isLoading}>
          {isLoading ? 'Eliminando...' : 'Eliminar Habitación'}
        </button>
      </div>
    </form>
  );
};

DeleteRoom.propTypes = {
  onDeleted: PropTypes.func,
};

DeleteRoom.defaultProps = {
  onDeleted: null,
};
