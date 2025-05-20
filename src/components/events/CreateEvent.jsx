// src/components/events/crud/CreateEvent.jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { useCreateEvent } from '../../shared/hooks/useCreateEvent';
import { useGetHotels } from '../../shared/hooks/useGetHotels';
import { Input } from '../UI/Input';

const initialFormState = {
  hotel:       { value: '', isValid: false, showError: false },
  name:        { value: '', isValid: false, showError: false },
  description: { value: '', isValid: false, showError: false },
  startDate:   { value: '', isValid: false, showError: false },
  endDate:     { value: '', isValid: false, showError: false },
  resources:   { value: '', isValid: true,  showError: false }, // opcional
};

export const CreateEvent = ({ onSuccess }) => {
  const { createEvent, isLoading } = useCreateEvent();
  const { hotels, isLoading: loadingHotels, error: hotelsError } = useGetHotels();

  const [form, setForm] = useState(initialFormState);

  // Validación básica: todos los campos excepto "resources" deben tener texto
  const validateField = (value, field) => {
    if (field === 'resources') return true;
    return value.trim() !== '';
  };

  const handleChange = useCallback((value, field) => {
    const isValid = validateField(value, field);
    setForm(prev => ({
      ...prev,
      [field]: { value, isValid, showError: false }
    }));
  }, []);

  const handleBlur = useCallback((value, field) => {
    const isValid = validateField(value, field);
    setForm(prev => ({
      ...prev,
      [field]: { ...prev[field], isValid, showError: !isValid }
    }));
  }, []);

  const handleSubmit = useCallback(async e => {
    e.preventDefault();

    // Marcar errores de validación
    let touched = false;
    const newForm = { ...form };
    Object.entries(newForm).forEach(([field, f]) => {
      if (!f.isValid) {
        f.showError = true;
        touched = true;
      }
    });
    if (touched) {
      setForm(newForm);
      return;
    }

    // Validar orden de fechas
    const inDate = new Date(form.startDate.value);
    const outDate = new Date(form.endDate.value);
    if (inDate > outDate) {
      setForm(prev => ({
        ...prev,
        startDate: { ...prev.startDate, showError: true },
        endDate:   { ...prev.endDate,   showError: true }
      }));
      toast.error('La fecha de inicio debe ser anterior a la de fin');
      return;
    }

    // Preparar recursos como array
    const resourcesArray = form.resources.value
      .split(',')
      .map(r => r.trim())
      .filter(r => r);

    // Payload
    const payload = {
      hotel:       form.hotel.value,
      name:        form.name.value.trim(),
      description: form.description.value.trim(),
      startDate:   form.startDate.value,
      endDate:     form.endDate.value,
      resources:   resourcesArray
    };

    const result = await createEvent(payload);
    if (result.success) {
      toast.success('Evento creado');
      onSuccess?.(result.data.event);
      setForm(initialFormState);
    }
  }, [form, createEvent, onSuccess]);

  const isFormValid = Object.values(form)
    .filter((_, i) => i !== Object.keys(form).indexOf('resources'))
    .every(f => f.isValid);

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-white shadow">
      <h5 className="mb-3">Crear Evento</h5>

      {hotelsError && (
        <div className="alert alert-danger">
          Error al cargar hoteles: {hotelsError.response?.data?.message || hotelsError.message}
        </div>
      )}

      {/* Selección de hotel */}
      <div className="mb-3">
        <label htmlFor="hotelSelect" className="form-label">Hotel</label>
        <select
          id="hotelSelect"
          className={`form-select ${form.hotel.showError ? 'is-invalid' : ''}`}
          value={form.hotel.value}
          onChange={e => handleChange(e.target.value, 'hotel')}
          onBlur={e => handleBlur(e.target.value, 'hotel')}
          disabled={loadingHotels || isLoading}
        >
          <option value="">Seleccione un hotel</option>
          {hotels.map(h => (
            <option key={h._id} value={h._id}>{h.name}</option>
          ))}
        </select>
        {form.hotel.showError && (
          <div className="invalid-feedback">El hotel es obligatorio.</div>
        )}
      </div>

      {/* Nombre */}
      <Input
        field="name"
        label="Nombre del evento"
        type="text"
        value={form.name.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.name.showError}
        validationMessage="El nombre es requerido."
        disabled={isLoading}
      />

      {/* Descripción */}
      <Input
        field="description"
        label="Descripción"
        type="text"
        textArea
        value={form.description.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.description.showError}
        validationMessage="La descripción es requerida."
        disabled={isLoading}
      />

      {/* Recursos */}
      <Input
        field="resources"
        label="Recursos (comma separados)"
        type="text"
        value={form.resources.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.resources.showError}
        validationMessage="" // opcional, no mostrado
        disabled={isLoading}
      />

      {/* Fechas */}
      <Input
        field="startDate"
        label="Fecha de inicio"
        type="date"
        value={form.startDate.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.startDate.showError}
        validationMessage="Fecha de inicio es requerida."
        disabled={isLoading}
      />

      <Input
        field="endDate"
        label="Fecha de fin"
        type="date"
        value={form.endDate.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.endDate.showError}
        validationMessage="Fecha de fin es requerida."
        disabled={isLoading}
      />

      <div className="d-grid mt-3">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? 'Creando...' : 'Crear Evento'}
        </button>
      </div>
    </form>
  );
};

CreateEvent.propTypes = {
  onSuccess: PropTypes.func,
};

CreateEvent.defaultProps = {
  onSuccess: null,
};
