// src/components/reservations/crud/UpdateReservation.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useUpdateReservation } from '../../shared/hooks/useUpdateReservation';
import { Input } from '../UI/Input';

export const UpdateReservation = ({ onUpdated }) => {
  const { updateReservation, isLoading } = useUpdateReservation();
  const [form, setForm] = useState({
    id:     { value: '', isValid: false, showError: false },
    status: { value: '', isValid: false, showError: false },
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
    const { id, status } = form;
    const result = await updateReservation(id.value, { status: status.value });
    if (result.success && onUpdated) {
      onUpdated(result.data.reservation);
      setForm({
        id:     { value: '', isValid: false, showError: false },
        status: { value: '', isValid: false, showError: false },
      });
    }
  };

  const disabled =
    isLoading ||
    !form.id.isValid ||
    !form.status.isValid;

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded">
      <h5 className="mb-3">Actualizar Reservación</h5>

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

      <div className="mb-3">
        <label htmlFor="status" className="form-label">Estado</label>
        <select
          id="status"
          name="status"
          className={`form-select ${form.status.showError ? 'is-invalid' : ''}`}
          value={form.status.value}
          onChange={e => handleChange(e.target.value, 'status')}
          onBlur={e => handleBlur(e.target.value, 'status')}
        >
          <option value="">Selecciona estado</option>
          <option value="Booked">Booked</option>
          <option value="CheckedIn">CheckedIn</option>
          <option value="CheckedOut">CheckedOut</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        {form.status.showError && (
          <div className="invalid-feedback">El estado es requerido.</div>
        )}
      </div>

      <div className="d-grid mt-3">
        <button type="submit" className="btn btn-warning" disabled={disabled}>
          {isLoading ? 'Actualizando...' : 'Actualizar Reservación'}
        </button>
      </div>
    </form>
  );
};

UpdateReservation.propTypes = {
  onUpdated: PropTypes.func,
};

UpdateReservation.defaultProps = {
  onUpdated: null,
};
