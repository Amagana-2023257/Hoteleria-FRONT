// src/components/events/crud/GetEvent.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useGetEvent } from '../../shared/hooks/useGetEvent';
import { Input } from '../UI/Input';

export const GetEvent = () => {
  const [eventId, setEventId] = useState({ value: '', isValid: false, showError: false });
  const { event, isLoading, error, fetchEvent } = useGetEvent(eventId.value);

  const handleChange = (val) => {
    setEventId({
      value: val,
      isValid: val.trim() !== '',
      showError: false
    });
  };

  const handleBlur = () => {
    if (!eventId.value.trim()) {
      setEventId(id => ({ ...id, isValid: false, showError: true }));
    }
  };

  const handleFetch = e => {
    e.preventDefault();
    if (eventId.isValid) {
      fetchEvent();
    } else {
      setEventId(id => ({ ...id, showError: true }));
    }
  };

  return (
    <div className="p-3 border rounded">
      <h5 className="mb-3">Obtener Evento</h5>
      <form onSubmit={handleFetch}>
        <Input
          field="eventId"
          label="ID de Evento"
          type="text"
          value={eventId.value}
          onChangeHandler={(val) => handleChange(val)}
          onBlurHandler={() => handleBlur()}
          showErrorMessage={eventId.showError}
          validationMessage="El ID de evento es requerido."
        />
        <div className="d-grid mb-3">
          <button className="btn btn-secondary" type="submit" disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Cargar Evento'}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger">
          Error cargando el evento: {error.message || 'Revisa el ID e inténtalo de nuevo.'}
        </div>
      )}

      {event && (
        <div className="mt-3">
          <h6>Detalles del Evento:</h6>
          <ul className="list-group">
            <li className="list-group-item"><strong>ID:</strong> {event._id}</li>
            <li className="list-group-item"><strong>Nombre:</strong> {event.name}</li>
            <li className="list-group-item"><strong>Descripción:</strong> {event.description}</li>
            <li className="list-group-item"><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

GetEvent.propTypes = {};

