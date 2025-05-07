// src/components/rooms/crud/GetRoom.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useGetRoom } from '../../shared/hooks/useGetRoom';
import { Input } from '../UI/Input';

export const GetRoom = () => {
  const [roomId, setRoomId] = useState({ value: '', isValid: false, showError: false });
  const { room, isLoading, error, fetchRoom } = useGetRoom(roomId.value);

  const handleChange = val => {
    setRoomId({ value: val, isValid: val.trim() !== '', showError: false });
  };

  const handleBlur = () => {
    if (!roomId.value.trim()) {
      setRoomId(id => ({ ...id, isValid: false, showError: true }));
    }
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
        <Input
          field="roomId"
          label="ID de Habitación"
          type="text"
          value={roomId.value}
          onChangeHandler={val => handleChange(val)}
          onBlurHandler={() => handleBlur()}
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
            <li className="list-group-item"><strong>Hotel:</strong> {room.hotel}</li>
            <li className="list-group-item"><strong>Número:</strong> {room.number}</li>
            <li className="list-group-item"><strong>Tipo:</strong> {room.type}</li>
            <li className="list-group-item"><strong>Precio:</strong> Q{room.price}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

GetRoom.propTypes = {};
