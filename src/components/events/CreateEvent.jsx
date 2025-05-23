// src/components/events/crud/CreateEvent.jsx
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
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

  const validateField = (value, field) => field === 'resources' || value.trim() !== '';

  const handleChange = useCallback((value, field) => {
    const isValid = validateField(value, field);
    setForm(prev => ({ ...prev, [field]: { value, isValid, showError: false } }));
  }, []);

  const handleBlur = useCallback((value, field) => {
    const isValid = validateField(value, field);
    setForm(prev => ({ ...prev, [field]: { ...prev[field], isValid, showError: !isValid } }));
  }, []);

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    // Validación general
    let hasError = false;
    const updated = { ...form };
    Object.entries(updated).forEach(([f, obj]) => {
      if (!obj.isValid) {
        updated[f].showError = true;
        hasError = true;
      }
    });
    if (hasError) return setForm(updated);

    // Fechas
    const start = new Date(form.startDate.value);
    const end   = new Date(form.endDate.value);
    if (start > end) {
      setForm(prev => ({
        ...prev,
        startDate: { ...prev.startDate, showError: true },
        endDate:   { ...prev.endDate,   showError: true }
      }));
      toast.error('La fecha de inicio debe ser anterior a la de fin');
      return;
    }

    const resourcesArray = form.resources.value
      .split(',').map(r => r.trim()).filter(r => r);

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
    .filter((_, i) => Object.keys(form)[i] !== 'resources')
    .every(f => f.isValid);

  return (
    <div className="container-fluid py-4">
      <motion.div
        className="card border-0 shadow-sm rounded-3 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header Instagram-style */}
        <div
          className="px-3 py-2"
          style={{ background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F56040)' }}
        >
          <h5 className="text-white mb-0">Crear Evento</h5>
        </div>
        <div className="card-body bg-white">
          {hotelsError && (
            <div className="alert alert-danger">
              Error al cargar hoteles: {hotelsError.response?.data?.message || hotelsError.message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Hotel Select */}
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
                {hotels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
              </select>
              {form.hotel.showError && <div className="invalid-feedback">El hotel es obligatorio.</div>}
            </div>

            {/* Other Inputs */}
            <Input field="name" label="Nombre del evento" type="text" textArea={false}
              value={form.name.value} onChangeHandler={handleChange} onBlurHandler={handleBlur}
              showErrorMessage={form.name.showError} validationMessage="El nombre es requerido." disabled={isLoading}
            />
            <Input field="description" label="Descripción" type="text" textArea
              value={form.description.value} onChangeHandler={handleChange} onBlurHandler={handleBlur}
              showErrorMessage={form.description.showError} validationMessage="La descripción es requerida." disabled={isLoading}
            />
            <Input field="resources" label="Recursos (comma separados)" type="text"
              value={form.resources.value} onChangeHandler={handleChange} onBlurHandler={handleBlur}
              showErrorMessage={form.resources.showError} validationMessage="" disabled={isLoading}
            />
            <div className="row g-3">
              <div className="col-md-6">
                <Input field="startDate" label="Fecha de inicio" type="date"
                  value={form.startDate.value} onChangeHandler={handleChange} onBlurHandler={handleBlur}
                  showErrorMessage={form.startDate.showError} validationMessage="Fecha de inicio es requerida." disabled={isLoading}
                />
              </div>
              <div className="col-md-6">
                <Input field="endDate" label="Fecha de fin" type="date"
                  value={form.endDate.value} onChangeHandler={handleChange} onBlurHandler={handleBlur}
                  showErrorMessage={form.endDate.showError} validationMessage="Fecha de fin es requerida." disabled={isLoading}
                />
              </div>
            </div>

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-primary"
                disabled={isLoading || !isFormValid}
              >
                {isLoading ? 'Creando...' : 'Crear Evento'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

CreateEvent.propTypes = { onSuccess: PropTypes.func };
CreateEvent.defaultProps = { onSuccess: null };
