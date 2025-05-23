// src/components/rooms/crud/UpdateRoom.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useUpdateRoom } from '../../shared/hooks/useUpdateRoom';
import { useGetRooms } from '../../shared/hooks/useGetRooms';
import { Input } from '../UI/Input';

export const UpdateRoom = ({ onUpdated }) => {
  const { updateRoom, isLoading: updating } = useUpdateRoom();
  const { rooms, isLoading: loadingRooms } = useGetRooms();

  const emptyForm = {
    id:               { value: '', isValid: false, showError: false },
    hotel:            { value: '', isValid: false, showError: false },
    type:             { value: '', isValid: false, showError: false },
    description:      { value: '', isValid: true,  showError: false },
    capacity:         { value: '', isValid: false, showError: false },
    price:            { value: '', isValid: false, showError: false },
    availability:     { value: 'available', isValid: true, showError: false },
    availabilityDate: { value: '', isValid: false, showError: false },
  };

  const [form, setForm] = useState(emptyForm);

  // Validaciones simples
  const validate = (v, field) => {
    if (['price','capacity'].includes(field)) {
      const n = Number(v);
      return Number.isFinite(n) && n > 0;
    }
    if (field === 'availabilityDate') {
      return v.trim() !== '';
    }
    return v.trim() !== '';
  };

  // Al seleccionar una habitación, cargamos sus datos
  const handleSelect = id => {
    const r = rooms.find(x => x._id === id);
    if (!r) {
      setForm(emptyForm);
      return;
    }
    setForm({
      id:               { value: r._id, isValid: true, showError: false },
      hotel:            { value: r.hotel?._id || '', isValid: true, showError: false },
      type:             { value: r.type, isValid: true, showError: false },
      description:      { value: r.description, isValid: true, showError: false },
      capacity:         { value: String(r.capacity), isValid: true, showError: false },
      price:            { value: String(r.price), isValid: true, showError: false },
      availability:     { value: r.availability, isValid: true, showError: false },
      availabilityDate: {
        value: r.availabilityDate
                 ? new Date(r.availabilityDate).toISOString().split('T')[0]
                 : '',
        isValid: Boolean(r.availabilityDate),
        showError: false
      },
    });
  };

  // Cambios en inputs
  const handleChange = (v, f) => {
    const ok = validate(v, f);
    setForm(prev => ({
      ...prev,
      [f]: { value: v, isValid: ok, showError: false }
    }));
  };
  const handleBlur = (v, f) => {
    const ok = validate(v, f);
    setForm(prev => ({
      ...prev,
      [f]: { ...prev[f], isValid: ok, showError: !ok }
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // marcar errores si faltan
    const valid = Object.values(form).every(f => f.isValid);
    if (!valid) {
      setForm(prev =>
        Object.fromEntries(
          Object.entries(prev).map(([k, fld]) => [
            k,
            { ...fld, showError: !fld.isValid }
          ])
        )
      );
      return;
    }

    const payload = {
      hotel:            form.hotel.value,
      type:             form.type.value.trim(),
      description:      form.description.value.trim(),
      capacity:         Number(form.capacity.value),
      price:            Number(form.price.value),
      availability:     form.availability.value,
      availabilityDate: new Date(form.availabilityDate.value),
    };

    const res = await updateRoom(form.id.value, payload);
    if (res.success) {
      onUpdated?.(res.data.room);
      setForm(emptyForm);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mt-4"
    >
      <form
        onSubmit={handleSubmit}
        className="card shadow-sm p-4 rounded"
      >
        <h5 className="mb-4">Actualizar Habitación</h5>

        {/* Selección */}
        <div className="mb-3">
          <label htmlFor="roomSelect" className="form-label">
            Seleccionar habitación
          </label>
          <select
            id="roomSelect"
            className="form-select"
            onChange={e => handleSelect(e.target.value)}
            disabled={loadingRooms || updating}
            value={form.id.value}
          >
            <option value="">-- Elige una habitación --</option>
            {rooms.map(r => (
              <option key={r._id} value={r._id}>
                {r.type} — {r._id.slice(-6)}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo */}
        <Input
          field="type"
          label="Tipo"
          type="text"
          value={form.type.value}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          showErrorMessage={form.type.showError}
          validationMessage="El tipo es obligatorio."
          disabled={updating}
        />

        {/* Descripción */}
        <Input
          field="description"
          label="Descripción"
          textArea
          value={form.description.value}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          showErrorMessage={false}
          validationMessage=""
          disabled={updating}
        />

        {/* Capacidad & Precio */}
        <div className="row">
          <div className="col-md-6">
            <Input
              field="capacity"
              label="Capacidad"
              type="number"
              value={form.capacity.value}
              onChangeHandler={handleChange}
              onBlurHandler={handleBlur}
              showErrorMessage={form.capacity.showError}
              validationMessage="Número mayor que 0."
              disabled={updating}
            />
          </div>
          <div className="col-md-6">
            <Input
              field="price"
              label="Precio"
              type="number"
              value={form.price.value}
              onChangeHandler={handleChange}
              onBlurHandler={handleBlur}
              showErrorMessage={form.price.showError}
              validationMessage="Número mayor que 0."
              disabled={updating}
            />
          </div>
        </div>

        {/* Disponibilidad */}
        <div className="row g-3 mt-3">
          <div className="col-md-6">
            <label htmlFor="availability" className="form-label">
              Disponibilidad
            </label>
            <select
              id="availability"
              className="form-select"
              value={form.availability.value}
              onChange={e => handleChange(e.target.value, 'availability')}
              disabled={updating}
            >
              <option value="available">Disponible</option>
              <option value="not available">No disponible</option>
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="availabilityDate" className="form-label">
              Fecha de Disponibilidad
            </label>
            <input
              id="availabilityDate"
              type="date"
              className={`form-control ${form.availabilityDate.showError ? 'is-invalid' : ''}`}
              value={form.availabilityDate.value}
              onChange={e => handleChange(e.target.value, 'availabilityDate')}
              onBlur={e => handleBlur(e.target.value, 'availabilityDate')}
              disabled={updating}
            />
            {form.availabilityDate.showError && (
              <div className="invalid-feedback">
                La fecha de disponibilidad es obligatoria.
              </div>
            )}
          </div>
        </div>

        {/* Botón */}
        <div className="d-grid mt-4">
          <button
            type="submit"
            className="btn btn-warning"
            disabled={updating || !form.id.isValid}
          >
            {updating ? 'Actualizando…' : 'Actualizar Habitación'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

UpdateRoom.propTypes = {
  onUpdated: PropTypes.func,
};
UpdateRoom.defaultProps = {
  onUpdated: null,
};
