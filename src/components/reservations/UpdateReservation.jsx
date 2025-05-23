// src/components/reservations/crud/UpdateReservation.jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useGetReservations } from '../../shared/hooks/useGetReservations';
import { useUpdateReservation } from '../../shared/hooks/useUpdateReservation';
import { Input } from '../UI/Input';

const statusOptions = [
  { value: '', label: 'Selecciona estado' },
  { value: 'Booked',     label: 'Booked' },
  { value: 'CheckedIn',  label: 'Checked In' },
  { value: 'CheckedOut', label: 'Checked Out' },
  { value: 'Cancelled',  label: 'Cancelled' }
];

const UpdateReservation = ({ onUpdated }) => {
  const { reservations, isLoading: loadingList, error: listError, fetchReservations } = useGetReservations();
  const { updateReservation, isLoading: updating, error: updateError } = useUpdateReservation();

  const [form, setForm] = useState({
    id:     { value: '', isValid: false, showError: false },
    status: { value: '', isValid: false, showError: false }
  });

  // cargar lista de reservaciones
  useEffect(() => {
    if (!reservations.length) fetchReservations();
  }, [reservations.length, fetchReservations]);

  // validar ambos campos
  useEffect(() => {
    setForm(f => ({
      id:     { ...f.id,     isValid: f.id.value.trim() !== '' },
      status: { ...f.status, isValid: f.status.value.trim() !== '' }
    }));
  }, [form.id.value, form.status.value]);

  const handleChange = useCallback((val, field) => {
    setForm(f => ({
      ...f,
      [field]: { ...f[field], value: val }
    }));
  }, []);

  const handleBlur = useCallback((val, field) => {
    const isValid = val.trim() !== '';
    setForm(f => ({
      ...f,
      [field]: { ...f[field], isValid, showError: !isValid }
    }));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    // marcar errores
    if (!form.id.isValid || !form.status.isValid) {
      setForm(f => ({
        id:     { ...f.id,     showError: !f.id.isValid },
        status: { ...f.status, showError: !f.status.isValid }
      }));
      return;
    }

    const result = await updateReservation(form.id.value, { status: form.status.value });
    if (result.success) {
      toast.success('Reservación actualizada');
      onUpdated?.(result.data.reservation);
      setForm({
        id:     { value: '', isValid: false, showError: false },
        status: { value: '', isValid: false, showError: false }
      });
    } else {
      toast.error(result.message || 'Error actualizando reservación');
    }
  };

  const isDisabled = updating || !(form.id.isValid && form.status.isValid);

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-white rounded shadow"
    >
      <h5 className="mb-4">Actualizar Reservación</h5>

      {/* Selector de reservación */}
      <div className="mb-3">
        <label htmlFor="reservationSelect" className="form-label">Selecciona Reservación</label>
        <select
          id="reservationSelect"
          className={`form-select ${form.id.showError ? 'is-invalid' : ''}`}
          value={form.id.value}
          onChange={e => handleChange(e.target.value, 'id')}
          onBlur={e => handleBlur(e.target.value, 'id')}
          disabled={loadingList || updating}
        >
          <option value="">-- Selecciona --</option>
          {reservations.map(r => (
            <option key={r._id} value={r._id}>
              {`${r.user?.name || r.user} — ${new Date(r.checkInDate).toLocaleDateString('es-GT')} → ${new Date(r.checkOutDate).toLocaleDateString('es-GT')}`}
            </option>
          ))}
        </select>
        <div className="invalid-feedback">La reservación es requerida.</div>
        {listError && (
          <div className="text-danger mt-1">Error cargando lista: {listError.message}</div>
        )}
      </div>

      {/* Estado */}
      <div className="mb-3">
        <label htmlFor="status" className="form-label">Estado</label>
        <select
          id="status"
          className={`form-select ${form.status.showError ? 'is-invalid' : ''}`}
          value={form.status.value}
          onChange={e => handleChange(e.target.value, 'status')}
          onBlur={e => handleBlur(e.target.value, 'status')}
          disabled={updating}
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="invalid-feedback">El estado es requerido.</div>
      </div>

      {updateError && (
        <div className="alert alert-danger mb-3">
          Error: {updateError.message || 'No se pudo actualizar.'}
        </div>
      )}

      <div className="d-grid">
        <button type="submit" className="btn btn-warning" disabled={isDisabled}>
          {updating ? 'Actualizando...' : 'Actualizar Reservación'}
        </button>
      </div>
    </motion.form>
  );
};

UpdateReservation.propTypes = {
  onUpdated: PropTypes.func
};

UpdateReservation.defaultProps = {
  onUpdated: null
};

export default UpdateReservation;
export { UpdateReservation };
