// src/components/reservations/crud/GetReservation.jsx
import React, { useState } from 'react';
import { useGetReservation } from '../../shared/hooks/useGetReservation';
import { Input } from '../UI/Input';

export const GetReservation = () => {
  const [reservationId, setReservationId] = useState({
    value: '', isValid: false, showError: false
  });
  const { reservation, isLoading, error, fetchReservation } = useGetReservation(reservationId.value);

  const handleChange = val => {
    setReservationId({ value: val, isValid: val.trim() !== '', showError: false });
  };

  const handleBlur = () => {
    if (!reservationId.value.trim()) {
      setReservationId(id => ({ ...id, isValid: false, showError: true }));
    }
  };

  const handleFetch = e => {
    e.preventDefault();
    if (reservationId.isValid) {
      fetchReservation();
    } else {
      setReservationId(id => ({ ...id, showError: true }));
    }
  };

  return (
    <div className="p-3 border rounded">
      <h5 className="mb-3">Obtener Reservación</h5>
      <form onSubmit={handleFetch}>
        <Input
          field="reservationId"
          label="ID de Reservación"
          type="text"
          value={reservationId.value}
          onChangeHandler={val => handleChange(val)}
          onBlurHandler={() => handleBlur()}
          showErrorMessage={reservationId.showError}
          validationMessage="El ID de reservación es requerido."
        />
        <div className="d-grid mb-3">
          <button className="btn btn-secondary" type="submit" disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Cargar Reservación'}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger">
          Error al cargar reservación: {error.message || 'Revisa el ID e inténtalo de nuevo.'}
        </div>
      )}

      {reservation && (
        <div className="mt-3">
          <h6>Detalles de la Reservación:</h6>
          <ul className="list-group">
            <li className="list-group-item"><strong>ID:</strong> {reservation._id}</li>
            <li className="list-group-item"><strong>Usuario:</strong> {reservation.user}</li>
            <li className="list-group-item"><strong>Hotel:</strong> {reservation.hotel}</li>
            <li className="list-group-item"><strong>Habitación:</strong> {reservation.room}</li>
            <li className="list-group-item"><strong>Entrada:</strong> {new Date(reservation.checkInDate).toLocaleDateString()}</li>
            <li className="list-group-item"><strong>Salida:</strong> {new Date(reservation.checkOutDate).toLocaleDateString()}</li>
            <li className="list-group-item"><strong>Estado:</strong> {reservation.status}</li>
          </ul>
        </div>
      )}
    </div>
  );
};
