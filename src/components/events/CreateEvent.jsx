// src/components/events/crud/CreateEvent.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCreateEvent } from '../../shared/hooks/useCreateEvent';
import { Input } from '../UI/Input'; 

export const CreateEvent = ({ onSuccess }) => {
  const { createEvent, isLoading } = useCreateEvent();
  const [form, setForm] = useState({
    name:        { value: '', isValid: false, showError: false },
    description: { value: '', isValid: false, showError: false },
    date:        { value: '', isValid: false, showError: false },
  });

  const handleChange = (val, field) => {
    setForm(f => ({
      ...f,
      [field]: { ...f[field], value: val }
    }));
  };

  const handleBlur = (val, field) => {
    const isValid = val.trim() !== '';
    setForm(f => ({
      ...f,
      [field]: { ...f[field], isValid, showError: !isValid }
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const eventData = {
      name:        form.name.value,
      description: form.description.value,
      date:        form.date.value,
    };
    const result = await createEvent(eventData);
    if (result.success && onSuccess) {
      onSuccess(result.data);
      // opcional: limpiar el formulario
      setForm({
        name:        { value: '', isValid: false, showError: false },
        description: { value: '', isValid: false, showError: false },
        date:        { value: '', isValid: false, showError: false },
      });
    }
  };

  const isDisabled = isLoading
    || !form.name.isValid
    || !form.description.isValid
    || !form.date.isValid;

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded">
      <h5 className="mb-3">Crear Evento</h5>

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
        value={form.description.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.description.showError}
        validationMessage="La descripción es requerida."
        textArea
      />

      <Input
        field="date"
        label="Fecha"
        type="date"
        value={form.date.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.date.showError}
        validationMessage="La fecha es requerida."
      />

      <div className="d-grid mt-3">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isDisabled}
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
