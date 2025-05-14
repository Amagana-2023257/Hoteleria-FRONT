// src/components/events/crud/CreateEvent.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useCreateEvent } from '../../shared/hooks/useCreateEvent';
import { useGetHotels } from '../../shared/hooks/useGetHotels';
import { Input } from '../UI/Input';

export const CreateEvent = ({ onSuccess }) => {
  const { createEvent, isLoading } = useCreateEvent();
  const { hotels, isLoading: loadingHotels } = useGetHotels();

  const [form, setForm] = useState({
    hotel:       { value: '', isValid: false, showError: false },
    name:        { value: '', isValid: false, showError: false },
    description: { value: '', isValid: false, showError: false },
    startDate:   { value: '', isValid: false, showError: false },
    endDate:     { value: '', isValid: false, showError: false },
  });

  const validate = (val) => val.trim() !== '';

  const handleChange = (val, field) => {
    const isValid = validate(val);
    setForm(prev => ({
      ...prev,
      [field]: { value: val, isValid, showError: false }
    }));
  };

  const handleBlur = (val, field) => {
    const isValid = validate(val);
    setForm(prev => ({
      ...prev,
      [field]: { ...prev[field], isValid, showError: !isValid }
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const isFormValid = Object.values(form).every(f => f.isValid);
    if (!isFormValid) {
      setForm(prev => Object.fromEntries(
        Object.entries(prev).map(([k, f]) => [
          k,
          { ...f, showError: !f.isValid }
        ])
      ));
      return;
    }

    const payload = {
      hotel: form.hotel.value,
      name: form.name.value,
      description: form.description.value,
      startDate: form.startDate.value,
      endDate: form.endDate.value,
    };

    const result = await createEvent(payload);
    if (result.success && onSuccess) {
      onSuccess(result.data.event);
      setForm(Object.fromEntries(
        Object.entries(form).map(([k]) => [k, { value: '', isValid: false, showError: false }])
      ));
    }
  };

  const disabled =
    isLoading ||
    Object.values(form).some(f => !f.isValid);

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-white shadow">
      <h5 className="mb-3">Crear Evento</h5>

      {/* Hotel selector */}
      <div className="mb-3">
        <label htmlFor="hotelSelect" className="form-label">Hotel</label>
        <select
          id="hotelSelect"
          className={`form-select ${form.hotel.showError ? 'is-invalid' : ''}`}
          value={form.hotel.value}
          onChange={e => handleChange(e.target.value, 'hotel')}
          onBlur={e => handleBlur(e.target.value, 'hotel')}
          disabled={loadingHotels}
        >
          <option value="">Seleccione un hotel</option>
          {hotels.map(h => (
            <option key={h._id} value={h._id}>{h.name}</option>
          ))}
        </select>
        {form.hotel.showError && <div className="invalid-feedback">El hotel es obligatorio.</div>}
      </div>

      <Input
        field="name"
        label="Nombre del evento"
        type="text"
        value={form.name.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.name.showError}
        validationMessage="El nombre es requerido."
      />

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
      />

      <Input
        field="startDate"
        label="Fecha de inicio"
        type="date"
        value={form.startDate.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.startDate.showError}
        validationMessage="La fecha de inicio es requerida."
      />

      <Input
        field="endDate"
        label="Fecha de fin"
        type="date"
        value={form.endDate.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.endDate.showError}
        validationMessage="La fecha de fin es requerida."
      />

      <div className="d-grid mt-3">
        <button type="submit" className="btn btn-primary" disabled={disabled}>
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
