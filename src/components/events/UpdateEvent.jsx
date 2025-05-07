// src/components/events/crud/UpdateEvent.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useUpdateEvent } from '../../shared/hooks/useUpdateEvent';
import { Input } from '../UI/Input';

export const UpdateEvent = ({ onUpdated }) => {
  const { updateEvent, isLoading } = useUpdateEvent();
  const [form, setForm] = useState({
    id:          { value: '', isValid: false, showError: false },
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
    const isValid = field === 'id'
      ? val.trim() !== ''
      : val.trim() !== '';
    setForm(f => ({
      ...f,
      [field]: { ...f[field], isValid, showError: !isValid }
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { id, name, description, date } = form;
    const result = await updateEvent(id.value, {
      name:        name.value,
      description: description.value,
      date:        date.value,
    });
    if (result.success && onUpdated) {
      onUpdated(result.data.event);
      setForm({
        id:          { value: '', isValid: false, showError: false },
        name:        { value: '', isValid: false, showError: false },
        description: { value: '', isValid: false, showError: false },
        date:        { value: '', isValid: false, showError: false },
      });
    }
  };

  const disabled =
    isLoading ||
    !form.id.isValid ||
    !form.name.isValid ||
    !form.description.isValid ||
    !form.date.isValid;

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded">
      <h5 className="mb-3">Actualizar Evento</h5>

      <Input
        field="id"
        label="ID de Evento"
        type="text"
        value={form.id.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.id.showError}
        validationMessage="El ID de evento es requerido."
      />

      <Input
        field="name"
        label="Nombre"
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
        <button type="submit" className="btn btn-warning" disabled={disabled}>
          {isLoading ? 'Actualizando...' : 'Actualizar Evento'}
        </button>
      </div>
    </form>
  );
};

UpdateEvent.propTypes = {
  onUpdated: PropTypes.func,
};

UpdateEvent.defaultProps = {
  onUpdated: null,
};
