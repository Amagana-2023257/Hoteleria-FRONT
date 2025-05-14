// src/components/events/crud/GetEvent.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGetEvent } from '../../shared/hooks/useGetEvent';
import { useGetEvents } from '../../shared/hooks/useGetEvents'; // Para obtener todos los eventos
import { Input } from '../UI/Input';

export const GetEvent = () => {
  const { events, isLoading: loadingEvents, error: eventsError, fetchEvents } = useGetEvents();
  const { event, isLoading, error, fetchEvent } = useGetEvent();

  const [eventId, setEventId] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');

  // Cargar eventos al montar el componente
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Manejar la selección de evento
  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId);
    fetchEvent(eventId); // Llama a la función de obtener evento al seleccionar uno
  };

  // Manejar el cambio del ID manualmente
  const handleChange = (val) => {
    setEventId(val);
  };

  // Validar el ID del evento
  const handleBlur = () => {
    if (!eventId.trim()) {
      setEventId('');
    }
  };

  const handleFetch = (e) => {
    e.preventDefault();
    if (eventId.trim()) {
      fetchEvent(eventId);
    }
  };

  return (
    <div className="p-3 border rounded bg-white shadow">
      <h5 className="mb-3">Obtener Evento</h5>

      {/* Buscar por ID o seleccionar un evento */}
      <form onSubmit={handleFetch}>
        {/* Campo para introducir el ID del evento */}
        <div className="mb-3">
          <label htmlFor="eventId" className="form-label">Buscar Evento por ID</label>
          <Input
            field="eventId"
            label="ID del Evento"
            type="text"
            value={eventId}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
            showErrorMessage={eventId.trim() === ''}
            validationMessage="El ID del evento es requerido."
          />
        </div>

        {/* Combo Box para seleccionar un evento */}
        <div className="mb-3">
          <label htmlFor="eventSelect" className="form-label">Seleccionar Evento</label>
          <select
            id="eventSelect"
            className="form-select"
            value={selectedEventId}
            onChange={e => handleSelectEvent(e.target.value)}
            disabled={loadingEvents || isLoading}
          >
            <option value="">-- Selecciona un evento --</option>
            {events.map(evt => (
              <option key={evt._id} value={evt._id}>
                {evt.name} - {new Date(evt.startDate).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* Botón para cargar el evento */}
        <button className="btn btn-secondary w-full" type="submit" disabled={isLoading || !eventId.trim()}>
          {isLoading ? 'Cargando...' : 'Cargar Evento'}
        </button>
      </form>

      {/* Mostrar errores globales */}
      {eventsError && (
        <div className="mt-3 text-red-600">
          Error al cargar eventos: {eventsError.message || 'Intenta de nuevo.'}
        </div>
      )}

      {/* Mostrar los detalles del evento */}
      {event && (
        <div className="mt-5">
          <h6 className="font-semibold mb-2">Detalles del Evento:</h6>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>ID:</strong> {event._id}</li>
            <li><strong>Nombre:</strong> {event.name}</li>
            <li><strong>Descripción:</strong> {event.description}</li>
            <li><strong>Fecha de inicio:</strong> {new Date(event.startDate).toLocaleDateString()}</li>
            <li><strong>Fecha de fin:</strong> {new Date(event.endDate).toLocaleDateString()}</li>
            {event.hotel && <li><strong>Hotel:</strong> {event.hotel.name}</li>}
            {event.resources && event.resources.length > 0 && (
              <li><strong>Recursos:</strong> {event.resources.join(', ')}</li>
            )}
          </ul>
        </div>
      )}

      {/* Mensaje de error si no se encuentra el evento */}
      {error && (
        <div className="alert alert-danger">
          Error al cargar el evento: {error.message || 'Revisa el ID e inténtalo de nuevo.'}
        </div>
      )}
    </div>
  );
};

GetEvent.propTypes = {};
