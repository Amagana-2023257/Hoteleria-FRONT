// src/components/rooms/CreateRoom.jsx
import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useCreateRoom } from '../../shared/hooks/useCreateRoom';
import { useGetHotels } from '../../shared/hooks/useGetHotels';
import { Input } from '../UI/Input';

const initialFormState = {
  hotel:     { value: '', isValid: false, showError: false },
  type:      { value: '', isValid: false, showError: false },
  description: { value: '', isValid: true, showError: false },
  capacity:  { value: '', isValid: false, showError: false },
  price:     { value: '', isValid: false, showError: false },
  availability: { value: 'available', isValid: true, showError: false },
  availabilityDate: { value: '', isValid: false, showError: false },
};

export const CreateRoom = ({ onCreated }) => {
  const { createRoom, isLoading, error } = useCreateRoom();
  const { hotels, isLoading: loadingHotels, error: hotelsError } = useGetHotels();
  const [form, setForm] = useState(initialFormState);

  // Cuando carguen hoteles, dejamos hotel inválido hasta que el usuario seleccione
  useEffect(() => {
    if (hotels.length && !form.hotel.value) {
      setForm(prev => ({
        ...prev,
        hotel: { ...prev.hotel, isValid: false }
      }));
    }
  }, [hotels]);

  const validateField = (value, field) => {
    if (['capacity', 'price'].includes(field)) {
      const num = Number(value);
      return Number.isFinite(num) && num > 0;
    }
    if (field === 'availabilityDate') {
      return value.trim() !== '';
    }
    // description y availability siempre válidos si llegan
    return value.trim() !== '';
  };

  const handleChange = useCallback((value, field) => {
    const valid = validateField(value, field);
    setForm(prev => ({
      ...prev,
      [field]: { value, isValid: valid, showError: false }
    }));
  }, []);

  const handleBlur = useCallback((value, field) => {
    const valid = validateField(value, field);
    setForm(prev => ({
      ...prev,
      [field]: { ...prev[field], isValid: valid, showError: !valid }
    }));
  }, []);

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    // marcar errores
    const isFormValid = Object.values(form).every(f => f.isValid);
    if (!isFormValid) {
      setForm(prev =>
        Object.fromEntries(
          Object.entries(prev).map(([key, fld]) => [
            key,
            { ...fld, showError: !fld.isValid }
          ])
        )
      );
      return;
    }

    const payload = {
      hotel:            form.hotel.value,
      type:             form.type.value,
      description:      form.description.value.trim(),
      capacity:         Number(form.capacity.value),
      price:            Number(form.price.value),
      availability:     form.availability.value,
      availabilityDate: new Date(form.availabilityDate.value),
    };

    const result = await createRoom(payload);
    if (result.success) {
      onCreated?.(result.data.room);
      setForm(initialFormState);
    }
  }, [form, createRoom, onCreated]);

  // chequeo final de validez
  const isFormValid = Object.values(form).every(f => f.isValid);

  return (
    <motion.div
      className="container-fluid p-0"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <form
        onSubmit={handleSubmit}
        className="card shadow-sm rounded-3 overflow-hidden"
      >
        {/* Header Instagram-style */}
        <div
          className="px-4 py-3"
          style={{
            background: 'linear-gradient(45deg, #833AB4, #FD1D1D, #F56040)'
          }}
        >
          <h5 className="text-white mb-0">Crear Habitación</h5>
        </div>

        <div className="card-body bg-white">
          {error && <div className="alert alert-danger">{error}</div>}
          {hotelsError && <div className="alert alert-danger">Error cargando hoteles</div>}

          {/* Hotel */}
          <div className="mb-3">
            <label htmlFor="hotel" className="form-label">Hotel</label>
            <select
              id="hotel"
              className={`form-select ${form.hotel.showError ? 'is-invalid' : ''}`}
              value={form.hotel.value}
              onChange={e => handleChange(e.target.value, 'hotel')}
              onBlur={e => handleBlur(e.target.value, 'hotel')}
              disabled={loadingHotels || isLoading}
            >
              <option value="">-- Seleccione un hotel --</option>
              {hotels.map(h => (
                <option key={h._id} value={h._id}>{h.name}</option>
              ))}
            </select>
            {form.hotel.showError && (
              <div className="invalid-feedback">El hotel es obligatorio.</div>
            )}
          </div>

          {/* Tipo */}
          <Input
            field="type"
            label="Tipo de Habitación"
            type="text"
            value={form.type.value}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
            showErrorMessage={form.type.showError}
            validationMessage="El tipo es obligatorio."
            disabled={isLoading}
          />

          {/* Descripción */}
          <Input
            field="description"
            label="Descripción (opcional)"
            textArea
            value={form.description.value}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
            showErrorMessage={false}
            validationMessage=""
            disabled={isLoading}
          />

          {/* Capacidad y Precio en fila */}
          <div className="row">
            <div className="col-md-6">
              <Input
                field="capacity"
                label="Capacidad"
                type="number"
                value={form.capacity.value}
                onChangeHandler={handleChange}
                onBlurHandler={handleBlur}
                showErrorMessage={form.capacity.showError}
                validationMessage="Número mayor a 0."
                disabled={isLoading}
              />
            </div>
            <div className="col-md-6">
              <Input
                field="price"
                label="Precio"
                type="number"
                value={form.price.value}
                onChangeHandler={handleChange}
                onBlurHandler={handleBlur}
                showErrorMessage={form.price.showError}
                validationMessage="Número mayor a 0."
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Disponibilidad */}
          <div className="mb-3 row">
            <div className="col-md-6">
              <label htmlFor="availability" className="form-label">Disponibilidad</label>
              <select
                id="availability"
                className="form-select"
                value={form.availability.value}
                onChange={e => handleChange(e.target.value, 'availability')}
                disabled={isLoading}
              >
                <option value="available">Disponible</option>
                <option value="not available">No disponible</option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="availabilityDate" className="form-label">
                Fecha de Disponibilidad
              </label>
              <input
                id="availabilityDate"
                type="date"
                className={`form-control ${form.availabilityDate.showError ? 'is-invalid' : ''}`}
                value={form.availabilityDate.value}
                onChange={e => handleChange(e.target.value, 'availabilityDate')}
                onBlur={e => handleBlur(e.target.value, 'availabilityDate')}
                disabled={isLoading}
              />
              {form.availabilityDate.showError && (
                <div className="invalid-feedback">La fecha es obligatoria.</div>
              )}
            </div>
          </div>

          {/* Botón */}
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? 'Creando…' : 'Crear Habitación'}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

CreateRoom.propTypes = {
  onCreated: PropTypes.func,
};

CreateRoom.defaultProps = {
  onCreated: null,
};
