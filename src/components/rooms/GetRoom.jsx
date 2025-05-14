// src/components/rooms/crud/GetRoom.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useGetRoom } from '../../shared/hooks/useGetRoom';
import { useGetRooms } from '../../shared/hooks/useGetRooms';
import { Input } from '../UI/Input';

export const GetRoom = () => {
  const [roomId, setRoomId] = useState({ value: '', isValid: false, showError: false });
  const { room, isLoading, error, fetchRoom } = useGetRoom(roomId.value);
  const { rooms, isLoading: loadingRooms } = useGetRooms();

  const handleChange = val => {
    setRoomId({ value: val, isValid: val.trim() !== '', showError: false });
  };

  const handleBlur = () => {
    if (!roomId.value.trim()) {
      setRoomId(id => ({ ...id, isValid: false, showError: true }));
    }
  };

  const handleSelect = (e) => {
    const selectedId = e.target.value;
    setRoomId({ value: selectedId, isValid: selectedId !== '', showError: false });
  };

  const handleFetch = e => {
    e.preventDefault();
    if (roomId.isValid) {
      fetchRoom();
    } else {
      setRoomId(id => ({ ...id, showError: true }));
    }
  };

  return (
    <div className="p-3 border rounded">
      <h5 className="mb-3">Obtener Habitación</h5>
      <form onSubmit={handleFetch}>
        {/* ComboBox de habitaciones */}
        <div className="mb-3">
          <label htmlFor="roomSelect" className="form-label">Seleccionar una habitación</label>
          <select
            id="roomSelect"
            className="form-select"
            onChange={handleSelect}
            value={roomId.value}
            disabled={loadingRooms}
          >
            <option value="">-- Selecciona una habitación --</option>
            {rooms.map(r => (
              <option key={r._id} value={r._id}>
                Habitación {r.number} - {r.type} (Hotel: {r.hotel?.name || r.hotel})
              </option>
            ))}
          </select>
        </div>

        {/* Campo manual por si desean pegar ID */}
        <Input
          field="roomId"
          label="ID de Habitación"
          type="text"
          value={roomId.value}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          showErrorMessage={roomId.showError}
          validationMessage="El ID de habitación es requerido."
        />

        <div className="d-grid mb-3">
          <button className="btn btn-secondary" type="submit" disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Cargar Habitación'}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger">
          Error al cargar habitación: {error.message || 'Revisa el ID e inténtalo de nuevo.'}
        </div>
      )}

      {room && (
        <div className="mt-3">
          <h6>Detalles de la Habitación:</h6>
          <ul className="list-group">
            <li className="list-group-item"><strong>ID:</strong> {room._id}</li>
            <li className="list-group-item"><strong>Hotel:</strong> {room.hotel?.name || room.hotel}</li>
            <li className="list-group-item"><strong>Número:</strong> {room.number}</li>
            <li className="list-group-item"><strong>Tipo:</strong> {room.type}</li>
            <li className="list-group-item"><strong>Capacidad:</strong> {room.capacity} personas</li>
            <li className="list-group-item"><strong>Precio:</strong> Q{room.price}</li>
            <li className="list-group-item">
              <strong>Disponibilidad:</strong> 
              {room.availability && room.availability.length > 0 
                ? room.availability.map((date, index) => (
                    <span key={index} className="badge bg-info mx-1">{new Date(date).toLocaleDateString()}</span>
                  ))
                : 'No disponible'}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

GetRoom.propTypes = {};
