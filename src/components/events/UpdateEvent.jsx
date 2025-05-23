// src/components/events/crud/UpdateEvent.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { useGetEvents } from '../../shared/hooks/useGetEvents';
import { useGetEvent } from '../../shared/hooks/useGetEvent';
import { useUpdateEvent } from '../../shared/hooks/useUpdateEvent';
import { Input } from '../UI/Input';

const formatDateInput = iso => iso?.slice(0, 10) || '';

export const UpdateEvent = ({ onUpdated }) => {
  const [eventId, setEventId] = useState('');
  const [errorId, setErrorId] = useState(false);

  const { events, isLoading: loadingList, error: listError, fetchEvents } = useGetEvents();
  const {
    event: selectedEvent,
    isLoading: loadingEvent,
    error: fetchError,
    fetchEvent
  } = useGetEvent(eventId);
  const { updateEvent, isLoading: updating } = useUpdateEvent();

  const [form, setForm] = useState({
    name:        { value: '', isValid: false, showError: false },
    description: { value: '', isValid: false, showError: false },
    startDate:   { value: '', isValid: false, showError: false },
    endDate:     { value: '', isValid: false, showError: false },
    resources:   { value: '', isValid: true,  showError: false },
  });

  // cargar lista al montar
  useEffect(() => {
    if (!events.length) fetchEvents();
  }, []);

  // cuando cambia selección, cargar datos y popular form
  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  useEffect(() => {
    if (selectedEvent) {
      setForm({
        name:        { value: selectedEvent.name,        isValid: true, showError: false },
        description: { value: selectedEvent.description || '', isValid: true, showError: false },
        startDate:   { value: formatDateInput(selectedEvent.startDate), isValid: true, showError: false },
        endDate:     { value: formatDateInput(selectedEvent.endDate),   isValid: true, showError: false },
        resources:   { value: (selectedEvent.resources || []).join(', '), isValid: true, showError: false },
      });
      setErrorId(false);
    }
  }, [selectedEvent]);

  const handleSelect = e => {
    setEventId(e.target.value);
    if (e.target.value) setErrorId(false);
  };

  const handleFieldChange = (val, field) => {
    setForm(f => ({
      ...f,
      [field]: { ...f[field], value: val }
    }));
  };

  const handleFieldBlur = (val, field) => {
    const isValid = val.trim() !== '';
    setForm(f => ({
      ...f,
      [field]: { ...f[field], isValid, showError: !isValid }
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!eventId) {
      setErrorId(true);
      return;
    }
    // verificar validaciones básicas
    let valid = true;
    ['name', 'startDate', 'endDate'].forEach(f => {
      if (!form[f].value.trim()) {
        setForm(fm => ({
          ...fm,
          [f]: { ...fm[f], isValid: false, showError: true }
        }));
        valid = false;
      }
    });
    if (!valid) return;

    const payload = {
      name:        form.name.value,
      description: form.description.value,
      startDate:   form.startDate.value,
      endDate:     form.endDate.value,
      resources:   form.resources.value.split(',').map(r => r.trim()).filter(r => r)
    };

    const result = await updateEvent(eventId, payload);
    if (result.success) {
      onUpdated?.(result.data.event);
    }
  };

  const disabled =
    updating ||
    !eventId ||
    !form.name.isValid ||
    !form.startDate.isValid ||
    !form.endDate.isValid;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
        <h5 className="mb-4">Actualizar Evento</h5>

        {/* Selección de evento */}
        <div className="mb-3">
          <label htmlFor="selectEvent" className="form-label">Evento a actualizar</label>
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
                  {evt.name} ({formatDateInput(evt.startDate)})
                </option>
              ))}
            </select>
            <div className="invalid-feedback">Debes seleccionar un evento.</div>
          </div>
        </div>

        {/* Campos */}
        <Input
          field="name"
          label="Nombre"
          type="text"
          value={form.name.value}
          onChangeHandler={handleFieldChange}
          onBlurHandler={handleFieldBlur}
          showErrorMessage={form.name.showError}
          validationMessage="El nombre es requerido."
        />

        <Input
          field="description"
          label="Descripción"
          type="text"
          textArea
          value={form.description.value}
          onChangeHandler={handleFieldChange}
          onBlurHandler={handleFieldBlur}
          showErrorMessage={form.description.showError}
          validationMessage="La descripción es requerida."
        />

        <Input
          field="startDate"
          label="Fecha de inicio"
          type="date"
          value={form.startDate.value}
          onChangeHandler={handleFieldChange}
          onBlurHandler={handleFieldBlur}
          showErrorMessage={form.startDate.showError}
          validationMessage="La fecha de inicio es requerida."
        />

        <Input
          field="endDate"
          label="Fecha de fin"
          type="date"
          value={form.endDate.value}
          onChangeHandler={handleFieldChange}
          onBlurHandler={handleFieldBlur}
          showErrorMessage={form.endDate.showError}
          validationMessage="La fecha de fin es requerida."
        />

        <Input
          field="resources"
          label="Recursos (separados por coma)"
          type="text"
          value={form.resources.value}
          onChangeHandler={handleFieldChange}
          onBlurHandler={() => {}}
          showErrorMessage={false}
        />

        <div className="d-grid mt-4">
          <button type="submit" className="btn btn-warning" disabled={disabled}>
            {updating ? 'Actualizando...' : 'Actualizar Evento'}
          </button>
        </div>
      </form>

      {(listError || fetchError) && (
        <motion.div className="alert alert-danger mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {listError?.message || fetchError?.message}
        </motion.div>
      )}
    </motion.div>
  );
};

UpdateEvent.propTypes = {
  onUpdated: PropTypes.func,
};

UpdateEvent.defaultProps = {
  onUpdated: null,
};
