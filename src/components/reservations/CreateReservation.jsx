// src/components/reservations/crud/CreateReservation.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCreateReservation } from '../../shared/hooks/useCreateReservation';
import { Input } from '../UI/Input';

export const CreateReservation = ({ onCreated }) => {
  const { createReservation, isLoading } = useCreateReservation();
  const [form, setForm] = useState({
    user:         { value: '', isValid: false, showError: false },
    hotel:        { value: '', isValid: false, showError: false },
    room:         { value: '', isValid: false, showError: false },
    checkInDate:  { value: '', isValid: false, showError: false },
    checkOutDate: { value: '', isValid: false, showError: false },
  });

  const handleChange = (val, field) => {
    setForm(f => ({
      ...f,
      [field]: { ...f[field], value: val }
    }));
  };

  const handleBlur = (val, field) => {
    let isValid = val.trim() !== '';
    if (field === 'checkInDate' || field === 'checkOutDate') {
      isValid = !isNaN(Date.parse(val));
    }
    setForm(f => ({
      ...f,
      [field]: { ...f[field], isValid, showError: !isValid }
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = {
      user:        form.user.value,
      hotel:       form.hotel.value,
      room:        form.room.value,
      checkInDate: form.checkInDate.value,
      checkOutDate: form.checkOutDate.value,
    };
    const result = await createReservation(data);
    if (result.success && onCreated) {
      onCreated(result.data.reservation);
      setForm({
        user:         { value: '', isValid: false, showError: false },
        hotel:        { value: '', isValid: false, showError: false },
        room:         { value: '', isValid: false, showError: false },
        checkInDate:  { value: '', isValid: false, showError: false },
        checkOutDate: { value: '', isValid: false, showError: false },
      });
    }
  };

  const disabled =
    isLoading ||
    !form.user.isValid ||
    !form.hotel.isValid ||
    !form.room.isValid ||
    !form.checkInDate.isValid ||
    !form.checkOutDate.isValid;

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded">
      <h5 className="mb-3">Crear Reservación</h5>

      <Input
        field="user"
        label="ID de Usuario"
        type="text"
        value={form.user.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.user.showError}
        validationMessage="El ID de usuario es requerido."
      />

      <Input
        field="hotel"
        label="ID de Hotel"
        type="text"
        value={form.hotel.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.hotel.showError}
        validationMessage="El ID de hotel es requerido."
      />

      <Input
        field="room"
        label="ID de Habitación"
        type="text"
        value={form.room.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.room.showError}
        validationMessage="El ID de habitación es requerido."
      />

      <Input
        field="checkInDate"
        label="Fecha de Entrada"
        type="date"
        value={form.checkInDate.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.checkInDate.showError}
        validationMessage="Fecha de entrada inválida."
      />

      <Input
        field="checkOutDate"
        label="Fecha de Salida"
        type="date"
        value={form.checkOutDate.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.checkOutDate.showError}
        validationMessage="Fecha de salida inválida."
      />

      <div className="d-grid mt-3">
        <button type="submit" className="btn btn-primary" disabled={disabled}>
          {isLoading ? 'Creando...' : 'Crear Reservación'}
        </button>
      </div>
    </form>
  );
};

CreateReservation.propTypes = {
  onCreated: PropTypes.func,
};

CreateReservation.defaultProps = {
  onCreated: null,
};
