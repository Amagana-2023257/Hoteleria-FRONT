// src/components/rooms/crud/DeleteRoom.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDeleteRoom } from '../../shared/hooks/useDeleteRoom';
import { Input } from '../UI/Input';

export const DeleteRoom = ({ onDeleted }) => {
  const { deleteRoom, isLoading } = useDeleteRoom();
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
    const result = await deleteRoom(id);
    if (result.success && onDeleted) {
      onDeleted(id);
      setForm({ id: { value: '', isValid: false, showError: false } });
    }
  };

  const disabled = isLoading || !form.id.isValid;

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded">
      <h5 className="mb-3">Eliminar Habitación</h5>

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

      <div className="d-grid mt-3">
        <button type="submit" className="btn btn-danger" disabled={disabled}>
          {isLoading ? 'Eliminando...' : 'Eliminar Habitación'}
        </button>
      </div>
    </form>
  );
};

DeleteRoom.propTypes = {
  onDeleted: PropTypes.func,
};

DeleteRoom.defaultProps = {
  onDeleted: null,
};
