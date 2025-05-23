// src/components/events/crud/GetEvent.jsx
import React, { useState, useEffect } from 'react';
import { useGetEvents } from '../../shared/hooks/useGetEvents';
import { useGetEvent }  from '../../shared/hooks/useGetEvent';
import { motion }       from 'framer-motion';
import { FaSearch }     from 'react-icons/fa';

const formatDate = iso => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-GT');
};

export const GetEvent = () => {
  const [eventId, setEventId] = useState('');
  const [errorId, setErrorId] = useState(false);

  const { events, isLoading: loadingList, error: listError, fetchEvents } = useGetEvents();
  const { event, isLoading: loadingEvent, error: fetchError, fetchEvent } = useGetEvent(eventId);

  useEffect(() => {
    if (events.length === 0) fetchEvents();
  }, []);

  const handleChange = e => {
    setEventId(e.target.value);
    if (e.target.value.trim()) setErrorId(false);
  };

  const handleSearch = e => {
    e.preventDefault();
    if (!eventId.trim()) {
      setErrorId(true);
      return;
    }
    fetchEvent();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Buscar Evento por ID</h5>

          <form onSubmit={handleSearch} className="row g-3 align-items-end">
            <div className="col-md-6">
              <label htmlFor="eventId" className="form-label">ID de Evento</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FaSearch /></span>
                <input
                  id="eventId"
                  type="text"
                  className={`form-control border-start-0 ${errorId ? 'is-invalid' : ''}`}
                  placeholder="Ingresa ID"
                  value={eventId}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">El ID de evento es requerido.</div>
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="selectEvent" className="form-label">O seleccionar un evento</label>
              <select
                id="selectEvent"
                className="form-select"
                value={eventId}
                onChange={handleChange}
                disabled={loadingList}
              >
                <option value="">-- Selecciona --</option>
                {events.map(evt => (
                  <option key={evt._id} value={evt._id}>
                    {evt.name} ({formatDate(evt.startDate)})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary" disabled={loadingEvent}>
                {loadingEvent ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </form>

          {listError && (
            <motion.div className="alert alert-danger mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Error al cargar lista de eventos: {listError.message}
            </motion.div>
          )}

          {fetchError && (
            <motion.div className="alert alert-danger mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Error al buscar evento: {fetchError.message || 'Intenta de nuevo.'}
            </motion.div>
          )}

          {event && (
            <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h6 className="mb-3">Detalles del Evento</h6>
              <ul className="list-group">
                {[
                  ['ID', event._id],
                  ['Nombre', event.name],
                  ['Descripción', event.description || '—'],
                  ['Inicio', formatDate(event.startDate)],
                  ['Fin', formatDate(event.endDate)],
                  ['Hotel', event.hotel?.name || '—'],
                  ['Recursos', event.resources?.length ? event.resources.join(', ') : '—'],
                  ['Creado', formatDate(event.createdAt)],
                  ['Actualizado', formatDate(event.updatedAt)]
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

export default GetEvent;
