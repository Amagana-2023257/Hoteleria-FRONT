import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCreateRoom } from '../../shared/hooks/useCreateRoom';
import { useGetHotels } from '../../shared/hooks/useGetHotels';
import { Input } from '../UI/Input';

const initialFormState = {
  hotel: { value: '', isValid: false, showError: false },
  type: { value: '', isValid: false, showError: false },
  capacity: { value: '', isValid: false, showError: false },
  price: { value: '', isValid: false, showError: false },
  availability: { value: [], isValid: true, showError: false },
};

export const CreateRoom = ({ onCreated }) => {
  const { createRoom, isLoading, error } = useCreateRoom();
  const { hotels, isLoading: loadingHotels, error: hotelsError } = useGetHotels();
  const [form, setForm] = useState(initialFormState);
  const [selectedDate, setSelectedDate] = useState('');

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

  const handleAddDate = () => {
    if (selectedDate && !form.availability.value.includes(selectedDate)) {
      setForm(prev => ({
        ...prev,
        availability: {
          value: [...prev.availability.value, selectedDate],
          isValid: true,
          showError: false
        }
      }));
      setSelectedDate('');
    }
  };

  const handleRemoveDate = dateToRemove => {
    setForm(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        value: prev.availability.value.filter(date => date !== dateToRemove)
      }
    }));
  };

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    const isFormValid = Object.values(form).every(f => f.isValid);
    if (!isFormValid) {
      setForm(prev =>
        Object.fromEntries(
          Object.entries(prev).map(([key, field]) => [
            key,
            { ...field, showError: !field.isValid }
          ])
        )
      );
      return;
    }

    const payload = {
      hotel: form.hotel.value,
      type: form.type.value,
      capacity: Number(form.capacity.value),
      price: Number(form.price.value),
      availability: form.availability.value.map(date => new Date(date)),
    };

    const result = await createRoom(payload);
    if (result.success) {
      onCreated?.(result.data.room);
      setForm(initialFormState);
    }
  }, [form, createRoom, onCreated]);

  const isFormValid = Object.values(form).every(f => f.isValid);

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow">
      <h5 className="mb-3">Crear Habitación</h5>

      {error && <div className="alert alert-danger">{error}</div>}
      {hotelsError && <div className="alert alert-danger">Error cargando hoteles</div>}

      {/* Hotel Selector */}
      <div className="mb-3">
        <label htmlFor="hotel" className="form-label">Hotel</label>
        <select
          id="hotel"
          className={`form-select ${form.hotel.showError ? 'is-invalid' : ''}`}
          value={form.hotel.value}
          onChange={e => handleChange(e.target.value, 'hotel')}
          onBlur={e => handleBlur(e.target.value, 'hotel')}
          disabled={loadingHotels || !!hotelsError || isLoading}
        >
          <option value="">Seleccione un hotel</option>
          {hotels.map(h => (
            <option key={h._id} value={h._id}>{h.name}</option>
          ))}
        </select>
        {form.hotel.showError && <div className="invalid-feedback">El hotel es requerido.</div>}
      </div>

      <Input
        field="type"
        label="Tipo de Habitación"
        type="text"
        value={form.type.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.type.showError}
        validationMessage="El tipo de habitación es requerido."
        disabled={isLoading}
      />

      <Input
        field="capacity"
        label="Capacidad"
        type="number"
        value={form.capacity.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.capacity.showError}
        validationMessage="Debe ser un número mayor que 0."
        disabled={isLoading}
      />

      <Input
        field="price"
        label="Precio"
        type="number"
        value={form.price.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.price.showError}
        validationMessage="Debe ser un número mayor que 0."
        disabled={isLoading}
      />

      {/* Disponibilidad */}
      <div className="mb-3">
        <label className="form-label">Disponibilidad</label>
        <div className="d-flex gap-2">
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleAddDate}
            disabled={!selectedDate || isLoading}
          >
            Agregar
          </button>
        </div>
        <div className="mt-2 d-flex flex-wrap gap-2">
          {form.availability.value.map(date => (
            <span key={date} className="badge bg-info">
              {new Date(date).toLocaleDateString()}
              <button
                type="button"
                className="btn-close btn-close-white btn-sm ms-2"
                onClick={() => handleRemoveDate(date)}
                aria-label="Eliminar"
              />
            </span>
          ))}
        </div>
      </div>

      <div className="d-grid mt-3">
        <button type="submit" className="btn btn-primary" disabled={isLoading || !isFormValid}>
          {isLoading ? 'Creando...' : 'Crear Habitación'}
        </button>
      </div>
    </form>
  );
};

CreateRoom.propTypes = {
  onCreated: PropTypes.func,
};

CreateRoom.defaultProps = {
  onCreated: null,
};
