// src/components/rooms/crud/UpdateRoom.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useUpdateRoom } from '../../shared/hooks/useUpdateRoom';
import { Input } from '../UI/Input';

export const UpdateRoom = ({ onUpdated }) => {
  const { updateRoom, isLoading } = useUpdateRoom();
  const [form, setForm] = useState({
    id:     { value: '', isValid: false, showError: false },
    number: { value: '', isValid: false, showError: false },
    type:   { value: '', isValid: false, showError: false },
    price:  { value: '', isValid: false, showError: false },
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
    const { id, number, type, price } = form;
    const payload = {
      number: number.value,
      type:   type.value,
      price:  Number(price.value),
    };
    const result = await updateRoom(id.value, payload);
    if (result.success && onUpdated) {
      onUpdated(result.data.room);
      setForm({
        id:     { value: '', isValid: false, showError: false },
        number: { value: '', isValid: false, showError: false },
        type:   { value: '', isValid: false, showError: false },
        price:  { value: '', isValid: false, showError: false },
      });
    }
  };

  const disabled =
    isLoading ||
    !form.id.isValid ||
    !form.number.isValid ||
    !form.type.isValid ||
    !form.price.isValid;

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded">
      <h5 className="mb-3">Actualizar Habitación</h5>

      <Input
        field="id"
        label="ID de Habitación"
        type="text"
        value={form.id.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.id.showError}
        validationMessage="El ID de habitación es requerido."
      />

      <Input
        field="number"
        label="Número"
        type="text"
        value={form.number.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.number.showError}
        validationMessage="El número es requerido."
      />

      <Input
        field="type"
        label="Tipo"
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
        <button type="submit" className="btn btn-warning" disabled={disabled}>
          {isLoading ? 'Actualizando...' : 'Actualizar Habitación'}
        </button>
      </div>
    </form>
  );
};

UpdateRoom.propTypes = {
  onUpdated: PropTypes.func,
};

UpdateRoom.defaultProps = {
  onUpdated: null,
};
