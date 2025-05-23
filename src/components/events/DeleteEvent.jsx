// src/components/events/crud/DeleteEvent.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaTrash, FaSearch } from 'react-icons/fa';
import { useGetEvents } from '../../shared/hooks/useGetEvents';
import { useGetEvent } from '../../shared/hooks/useGetEvent';
import { useDeleteEvent } from '../../shared/hooks/useDeleteEvent';

const formatDate = iso => new Date(iso).toLocaleDateString('es-GT');

const DeleteEvent = ({ onDeleted }) => {
  const [eventId, setEventId] = useState('');
  const [errorId, setErrorId] = useState(false);

  const { events, isLoading: loadingList, error: listError, fetchEvents } = useGetEvents();
  const { event, isLoading: loadingEvent, error: fetchError, fetchEvent } = useGetEvent(eventId);
  const { deleteEvent, isLoading: deleting } = useDeleteEvent();

  // cargar lista al montar
  useEffect(() => {
    if (!events.length) fetchEvents();
  }, []);

  // cargar detalles cuando cambia selección
  useEffect(() => {
    if (eventId) {
      fetchEvent();
      setErrorId(false);
    }
  }, [eventId]);

  const handleSelect = e => {
    setEventId(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!eventId) {
      setErrorId(true);
      return;
    }
    const result = await deleteEvent(eventId);
    if (result.success) {
      onDeleted?.(eventId);
      setEventId('');
    }
  };

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
        <h5 className="mb-4">Eliminar Evento</h5>

        <div className="mb-3">
          <label htmlFor="selectEvent" className="form-label">Seleccionar Evento</label>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0"><FaSearch/></span>
            <select
              id="selectEvent"
              className={`form-select border-start-0 ${errorId ? 'is-invalid' : ''}`}
              value={eventId}
              onChange={handleSelect}
              disabled={loadingList}
            >
              <option value="">-- Selecciona un evento --</option>
              {events.map(evt => (
                <option key={evt._id} value={evt._id}>
                  {evt.name} ({formatDate(evt.startDate)})
                </option>
              ))}
            </select>
            <div className="invalid-feedback">Por favor selecciona un evento.</div>
          </div>
        </div>

        {loadingEvent && <div className="text-center mb-3">⏳ Cargando detalles...</div>}
        {fetchError && (
          <div className="alert alert-danger mb-3">
            Error al cargar evento: {fetchError.message}
          </div>
        )}

        {event && (
          <div className="border rounded p-3 bg-light mb-3">
            <h6 className="mb-2">Detalles del Evento</h6>
            <ul className="list-unstyled small mb-0">
              <li><strong>ID:</strong> {event._id}</li>
              <li><strong>Nombre:</strong> {event.name}</li>
              <li><strong>Descripción:</strong> {event.description || '—'}</li>
              <li><strong>Inicio:</strong> {formatDate(event.startDate)}</li>
              <li><strong>Fin:</strong> {formatDate(event.endDate)}</li>
              <li><strong>Hotel:</strong> {event.hotel?.name || '—'}</li>
              <li><strong>Recursos:</strong> {event.resources?.length ? event.resources.join(', ') : '—'}</li>
            </ul>
          </div>
        )}

        <div className="d-grid">
          <button type="submit" className="btn btn-danger" disabled={deleting || !eventId}>
            {deleting ? 'Eliminando...' : <><FaTrash className="me-2"/>Eliminar Evento</>}
          </button>
        </div>

        {(listError) && (
          <div className="alert alert-danger mt-3">
            Error al cargar lista de eventos: {listError.message}
          </div>
        )}
      </form>
    </motion.div>
  );
};

DeleteEvent.propTypes = {
  onDeleted: PropTypes.func,
};

DeleteEvent.defaultProps = {
  onDeleted: null,
};

 export { DeleteEvent };
 export default DeleteEvent;