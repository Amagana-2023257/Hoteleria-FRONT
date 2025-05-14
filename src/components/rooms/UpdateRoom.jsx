// src/components/rooms/crud/UpdateRoom.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useUpdateRoom } from '../../shared/hooks/useUpdateRoom';
import { useGetRooms } from '../../shared/hooks/useGetRooms';
import { Input } from '../UI/Input';

export const UpdateRoom = ({ onUpdated }) => {
  const { updateRoom, isLoading } = useUpdateRoom();
  const { rooms, isLoading: loadingRooms } = useGetRooms();

  const [form, setForm] = useState({
    id:           { value: '', isValid: false, showError: false },
    hotel:        { value: '', isValid: false, showError: false },
    type:         { value: '', isValid: false, showError: false },
    capacity:     { value: '', isValid: false, showError: false },
    price:        { value: '', isValid: false, showError: false },
    availability: { value: [], isValid: true, showError: false },
  });

  const [selectedDate, setSelectedDate] = useState('');

  const validate = (value, field) => {
    if (['price', 'capacity'].includes(field)) {
      const n = Number(value);
      return Number.isFinite(n) && n > 0;
    }
    return value.trim() !== '';
  };

  const handleChange = (val, field) => {
    setForm(prev => ({
      ...prev,
      [field]: { value: val, isValid: validate(val, field), showError: false }
    }));
  };

  const handleBlur = (val, field) => {
    const isValid = validate(val, field);
    setForm(prev => ({
      ...prev,
      [field]: { ...prev[field], isValid, showError: !isValid }
    }));
  };

  const handleSelect = (id) => {
    const room = rooms.find(r => r._id === id);
    if (!room) return;

    setForm({
      id:           { value: room._id, isValid: true, showError: false },
      hotel:        { value: room.hotel?.name || room.hotel, isValid: true, showError: false },
      type:         { value: room.type, isValid: true, showError: false },
      capacity:     { value: String(room.capacity), isValid: true, showError: false },
      price:        { value: String(room.price), isValid: true, showError: false },
      availability: { value: room.availability.map(date => new Date(date).toISOString().split('T')[0]), isValid: true, showError: false },
    });
  };

  const handleAddDate = () => {
    if (selectedDate && !form.availability.value.includes(selectedDate)) {
      setForm(prev => ({
        ...prev,
        availability: {
          value: [...prev.availability.value, selectedDate],
          isValid: true,
          showError: false
        }
      }));
      setSelectedDate('');
    }
  };

  const handleRemoveDate = (dateToRemove) => {
    setForm(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        value: prev.availability.value.filter(date => date !== dateToRemove)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = Object.values(form).every(f => f.isValid);

    if (!isFormValid) {
      setForm(prev =>
        Object.fromEntries(
          Object.entries(prev).map(([key, val]) => [
            key,
            { ...val, showError: !val.isValid }
          ])
        )
      );
      return;
    }

    const payload = {
      type: form.type.value,
      capacity: Number(form.capacity.value),
      price: Number(form.price.value),
      availability: form.availability.value.map(d => new Date(d)),
    };

    const result = await updateRoom(form.id.value, payload);
    if (result.success && onUpdated) {
      onUpdated(result.data.room);
      setForm(prev =>
        Object.fromEntries(
          Object.entries(prev).map(([key]) => [
            key,
            { value: key === 'availability' ? [] : '', isValid: false, showError: false }
          ])
        )
      );
    }
  };

  const isAvailable = () => {
    return form.availability.value.some(date => new Date(date) > new Date());
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded bg-white shadow">
      <h5 className="mb-4">Actualizar Habitación</h5>

      <div className="mb-3">
        <label htmlFor="roomSelect" className="form-label">Seleccionar habitación</label>
        <select
          id="roomSelect"
          className="form-select"
          onChange={e => handleSelect(e.target.value)}
          disabled={loadingRooms}
        >
          <option value="">-- Selecciona una habitación --</option>
          {rooms.map(room => (
            <option key={room._id} value={room._id}>
              {room.type} - {room._id.slice(-6)}
            </option>
          ))}
        </select>
      </div>

      <Input
        field="type"
        label="Tipo"
        type="text"
        value={form.type.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.type.showError}
        validationMessage="El tipo es obligatorio."
        disabled={isLoading}
      />

      <Input
        field="capacity"
        label="Capacidad"
        type="number"
        value={form.capacity.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.capacity.showError}
        validationMessage="Debe ser un número válido mayor que 0."
        disabled={isLoading}
      />

      <Input
        field="price"
        label="Precio"
        type="number"
        value={form.price.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.price.showError}
        validationMessage="Debe ser un número válido mayor que 0."
        disabled={isLoading}
      />

      {/* Calendario para disponibilidad */}
      <div className="mb-3">
        <label className="form-label">Agregar fechas de disponibilidad</label>
        <div className="d-flex gap-2">
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleAddDate}
            disabled={!selectedDate || isLoading}
          >
            Agregar
          </button>
        </div>
        <div className="mt-2 d-flex flex-wrap gap-2">
          {form.availability.value.map(date => (
            <span key={date} className="badge bg-info">
              {new Date(date).toLocaleDateString()}
              <button
                type="button"
                className="btn-close btn-close-white btn-sm ms-2"
                onClick={() => handleRemoveDate(date)}
                aria-label="Eliminar"
              />
            </span>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <span className={`badge ${isAvailable() ? 'bg-success' : 'bg-secondary'}`}>
          {isAvailable() ? 'Disponible' : 'No disponible'}
        </span>
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-warning" disabled={isLoading}>
          {isLoading ? 'Actualizando...' : 'Actualizar'}
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
