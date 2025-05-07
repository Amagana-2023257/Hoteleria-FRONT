// src/components/rooms/crud/CreateRoom.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCreateRoom } from '../../shared/hooks/useCreateRoom';
import { Input } from '../UI/Input';

export const CreateRoom = ({ onCreated }) => {
  const { createRoom, isLoading } = useCreateRoom();
  const [form, setForm] = useState({
    hotel:       { value: '', isValid: false, showError: false },
    number:      { value: '', isValid: false, showError: false },
    type:        { value: '', isValid: false, showError: false },
    price:       { value: '', isValid: false, showError: false },
  });

  const handleChange = (val, field) => {
    setForm(f => ({
      ...f,
      [field]: { ...f[field], value: val }
    }));
  };

  const handleBlur = (val, field) => {
    let isValid = val.trim() !== '';
    if (field === 'price') {
      const num = Number(val);
      isValid = !isNaN(num) && num > 0;
    }
    setForm(f => ({
      ...f,
      [field]: { ...f[field], isValid, showError: !isValid }
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = {
      hotel:  form.hotel.value,
      number: form.number.value,
      type:   form.type.value,
      price:  Number(form.price.value),
    };
    const result = await createRoom(data);
    if (result.success && onCreated) {
      onCreated(result.data.room);
      setForm({
        hotel:  { value: '', isValid: false, showError: false },
        number: { value: '', isValid: false, showError: false },
        type:   { value: '', isValid: false, showError: false },
        price:  { value: '', isValid: false, showError: false },
      });
    }
  };

  const disabled =
    isLoading ||
    !form.hotel.isValid ||
    !form.number.isValid ||
    !form.type.isValid ||
    !form.price.isValid;

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded">
      <h5 className="mb-3">Crear Habitación</h5>

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
        field="number"
        label="Número de Habitación"
        type="text"
        value={form.number.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.number.showError}
        validationMessage="El número es requerido."
      />

      <Input
        field="type"
        label="Tipo de Habitación"
        type="text"
        value={form.type.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.type.showError}
        validationMessage="El tipo es requerido."
      />

      <Input
        field="price"
        label="Precio"
        type="number"
        value={form.price.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.price.showError}
        validationMessage="El precio debe ser un número mayor que 0."
      />

      <div className="d-grid mt-3">
        <button type="submit" className="btn btn-primary" disabled={disabled}>
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
