// src/components/reservations/crud/DeleteReservation.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDeleteReservation } from '../../shared/hooks/useDeleteReservation';
import { Input } from '../UI/Input';    

export const DeleteReservation = ({ onDeleted }) => {
  const { deleteReservation, isLoading } = useDeleteReservation();
  const [form, setForm] = useState({
    id: { value: '', isValid: false, showError: false },
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
    const { value: id } = form.id;
    const result = await deleteReservation(id);
    if (result.success && onDeleted) {
      onDeleted(id);
      setForm({ id: { value: '', isValid: false, showError: false } });
    }
  };

  const disabled = isLoading || !form.id.isValid;

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded">
      <h5 className="mb-3">Eliminar Reservación</h5>

      <Input
        field="id"
        label="ID de Reservación"
        type="text"
        value={form.id.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.id.showError}
        validationMessage="El ID de reservación es requerido."
      />

      <div className="d-grid mt-3">
        <button type="submit" className="btn btn-danger" disabled={disabled}>
          {isLoading ? 'Eliminando...' : 'Eliminar Reservación'}
        </button>
      </div>
    </form>
  );
};

DeleteReservation.propTypes = {
  onDeleted: PropTypes.func,
};

DeleteReservation.defaultProps = {
  onDeleted: null,
};
