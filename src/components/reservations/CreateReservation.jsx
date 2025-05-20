// src/components/hotels/crud/CreateReservation.jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { useCreateReservation } from '../../shared/hooks/useCreateReservation';
import { useUserDetails } from '../../shared/hooks/useUserDetails';
import { useGetHotels } from '../../shared/hooks/useGetHotels';
import { useGetRoomsByHotel } from '../../shared/hooks/useGetRoomsByHotel';
import { Input } from '../UI/Input';

const initialFormState = {
  hotel:        { value: '', isValid: false, showError: false },
  room:         { value: '', isValid: false, showError: false },
  checkInDate:  { value: '', isValid: false, showError: false },
  checkOutDate: { value: '', isValid: false, showError: false },
};

export const CreateReservation = ({ onCreated }) => {
  const { createReservation, isLoading: creating } = useCreateReservation();
  const { id: userId } = useUserDetails();
  const { hotels, isLoading: loadingHotels, error: hotelsError } = useGetHotels();

  const [form, setForm] = useState(initialFormState);
  const hotelId = form.hotel.value;
  const {
    rooms: hotelRooms,
    isLoading: loadingRooms,
    fetchRoomsByHotel
  } = useGetRoomsByHotel(hotelId);

  // Cargar habitaciones al cambiar de hotel
  useEffect(() => {
    setForm(prev => ({ ...prev, room: initialFormState.room }));
    if (hotelId) fetchRoomsByHotel();
  }, [hotelId, fetchRoomsByHotel]);

  const validateField = (value, field) =>
    field.includes('Date')
      ? !isNaN(Date.parse(value))
      : value.trim() !== '';

  const handleChange = useCallback((value, field) => {
    const isValid = validateField(value, field);
    setForm(prev => ({
      ...prev,
      [field]: { value, isValid, showError: false }
    }));
  }, []);

  const handleBlur = useCallback((value, field) => {
    const isValid = validateField(value, field);
    setForm(prev => ({
      ...prev,
      [field]: { ...prev[field], isValid, showError: !isValid }
    }));
  }, []);

  const handleSubmit = useCallback(async e => {
    e.preventDefault();

    // Primero, marcar errores de campos vacíos
    let newForm = { ...form };
    Object.keys(newForm).forEach(field => {
      if (!newForm[field].isValid) {
        newForm[field].showError = true;
      }
    });
    setForm(newForm);

    // Validar form completo
    const isFormValid = Object.values(newForm).every(f => f.isValid);
    if (!isFormValid) return;

    // Validar orden de fechas
    const inDate = new Date(form.checkInDate.value);
    const outDate = new Date(form.checkOutDate.value);
    if (inDate > outDate) {
      setForm(prev => ({
        ...prev,
        checkInDate:  { ...prev.checkInDate, showError: true },
        checkOutDate: { ...prev.checkOutDate, showError: true }
      }));
      toast.error('La fecha de check-in debe ser anterior a la de check-out');
      return;
    }

    // Enviar petición
    const payload = {
      user: userId,
      hotel: hotelId,
      room: form.room.value,
      checkInDate: form.checkInDate.value,
      checkOutDate: form.checkOutDate.value
    };
    const result = await createReservation(payload);
    if (result.success) {
      toast.success('Reservación creada');
      onCreated?.(result.data.reservation);
      setForm(initialFormState);
    }
  }, [form, hotelId, userId, createReservation, onCreated]);

  const isFormValid = Object.values(form).every(f => f.isValid);

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-white shadow">
      <h5 className="mb-3 font-semibold">Reservar Habitación</h5>

      {hotelsError && (
        <div className="alert alert-danger">
          Error al cargar hoteles: {hotelsError.response?.data?.message || hotelsError.message}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="hotel" className="form-label">Hotel</label>
        <select
          id="hotel"
          className={`form-select ${form.hotel.showError ? 'is-invalid' : ''}`}
          value={form.hotel.value}
          onChange={e => handleChange(e.target.value, 'hotel')}
          onBlur={e => handleBlur(e.target.value, 'hotel')}
          disabled={loadingHotels || creating}
        >
          <option value="">Seleccione un hotel</option>
          {hotels.map(h => (
            <option key={h._id} value={h._id}>{h.name}</option>
          ))}
        </select>
        {form.hotel.showError && (
          <div className="invalid-feedback">El hotel es requerido.</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="room" className="form-label">Habitación</label>
        <select
          id="room"
          className={`form-select ${form.room.showError ? 'is-invalid' : ''}`}
          value={form.room.value}
          onChange={e => handleChange(e.target.value, 'room')}
          onBlur={e => handleBlur(e.target.value, 'room')}
          disabled={!hotelId || loadingRooms || creating}
        >
          <option value="">Seleccione una habitación</option>
          {hotelRooms.map(r => (
            <option key={r._id} value={r._id}>
              {`${r.type} - Capacidad: ${r.capacity}`}
            </option>
          ))}
        </select>
        {form.room.showError && (
          <div className="invalid-feedback">La habitación es requerida.</div>
        )}
      </div>

      <Input
        field="checkInDate"
        label="Fecha de Entrada"
        type="date"
        value={form.checkInDate.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.checkInDate.showError}
        validationMessage="Fecha inválida."
        disabled={creating}
      />

      <Input
        field="checkOutDate"
        label="Fecha de Salida"
        type="date"
        value={form.checkOutDate.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.checkOutDate.showError}
        validationMessage="Fecha inválida."
        disabled={creating}
      />

      <button
        type="submit"
        className="btn btn-primary w-full mt-3"
        disabled={creating || !isFormValid}
      >
        {creating ? 'Creando...' : 'Reservar ahora'}
      </button>
    </form>
  );
};

CreateReservation.propTypes = {
  onCreated: PropTypes.func
};
CreateReservation.defaultProps = {
  onCreated: null
};
