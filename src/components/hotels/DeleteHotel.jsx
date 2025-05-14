// src/components/hotels/crud/DeleteHotel.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDeleteHotel } from '../../shared/hooks/useDeleteHotel';
import { useGetHotels } from '../../shared/hooks/useGetHotels';
import { Input } from '../UI/Input';

export const DeleteHotel = ({ onDeleted }) => {
  const { deleteHotel, isLoading } = useDeleteHotel();
  const { hotels, isLoading: loadingHotels } = useGetHotels();

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

  const handleSelect = (e) => {
    const selectedId = e.target.value;
    const isValid = selectedId.trim() !== '';
    setForm({
      id: { value: selectedId, isValid, showError: !isValid }
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { value: id } = form.id;
    const result = await deleteHotel(id);
    if (result.success && onDeleted) {
      onDeleted(id);
      setForm({ id: { value: '', isValid: false, showError: false } });
    }
  };

  const disabled = isLoading || !form.id.isValid;

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow">
      <h5 className="mb-3 font-semibold">Eliminar Hotel</h5>

      {/* ComboBox para seleccionar hotel */}
      <div className="mb-3">
        <label htmlFor="selectHotel" className="form-label">Selecciona un hotel</label>
        <select
          id="selectHotel"
          className="form-select"
          onChange={handleSelect}
          disabled={loadingHotels}
          value={form.id.value}
        >
          <option value="">-- Selecciona un hotel --</option>
          {hotels.map(h => (
            <option key={h._id} value={h._id}>
              {h.name}
            </option>
          ))}
        </select>
      </div>

      {/* Campo ID editable */}
      <Input
        field="id"
        label="ID de Hotel"
        type="text"
        value={form.id.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.id.showError}
        validationMessage="El ID de hotel es requerido."
      />

      <div className="d-grid mt-3">
        <button type="submit" className="btn btn-danger" disabled={disabled}>
          {isLoading ? 'Eliminando...' : 'Eliminar Hotel'}
        </button>
      </div>
    </form>
  );
};

DeleteHotel.propTypes = {
  onDeleted: PropTypes.func,
};

DeleteHotel.defaultProps = {
  onDeleted: null,
};
