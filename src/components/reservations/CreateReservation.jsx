import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
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
  const { createReservation, isLoading: creating, error: createError } = useCreateReservation();
  const { id: userId } = useUserDetails();
  const { hotels, isLoading: loadingHotels, error: hotelsError } = useGetHotels();

  const [form, setForm] = useState(initialFormState);

  // Hook to fetch rooms for selected hotel
  const hotelId = form.hotel.value;
  const {
    rooms: hotelRooms,
    isLoading: loadingRooms,
    fetchRoomsByHotel
  } = useGetRoomsByHotel(hotelId);

  // When hotel changes, reset room field and fetch rooms
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      room: { value: '', isValid: false, showError: false }
    }));
    if (hotelId) fetchRoomsByHotel();
  }, [hotelId, fetchRoomsByHotel]);

  const validateField = (value, field) => {
    if (field === 'checkInDate' || field === 'checkOutDate') {
      return !isNaN(Date.parse(value));
    }
    return value.trim() !== '';
  };

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
    // Validate all fields
    const isFormValid = Object.values(form).every(f => f.isValid);
    if (!isFormValid) {
      setForm(prev =>
        Object.fromEntries(
          Object.entries(prev).map(([key, field]) => [
            key,
            { ...field, showError: !field.isValid }
          ])
        )
      );
      return;
    }

    const data = {
      user:        userId,
      hotel:       form.hotel.value,
      room:        form.room.value,
      checkInDate: form.checkInDate.value,
      checkOutDate:form.checkOutDate.value,
    };

    const result = await createReservation(data);
    if (result.success) {
      onCreated?.(result.data.reservation);
      setForm(initialFormState);
    }
  }, [form, userId, createReservation, onCreated]);

  const isFormValid = Object.values(form).every(f => f.isValid);

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded">
      <h5 className="mb-3">Crear Reservación</h5>

      {createError && <div className="alert alert-danger">{createError}</div>}
      {hotelsError && <div className="alert alert-danger">Error cargando hoteles</div>}

      {/* Hotel selection */}
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
        {form.hotel.showError && <div className="invalid-feedback">El hotel es requerido.</div>}
      </div>

      {/* Room selection based on hotel */}
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
            <option key={r._id} value={r._id}>{r.type} - Capacidad: {r.capacity}</option>
          ))}
        </select>
        {form.room.showError && <div className="invalid-feedback">La habitación es requerida.</div>}
      </div>

      {/* Fechas */}
      <Input
        field="checkInDate"
        label="Fecha de Entrada"
        type="date"
        value={form.checkInDate.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.checkInDate.showError}
        validationMessage="Fecha de entrada inválida."
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
        validationMessage="Fecha de salida inválida."
        disabled={creating}
      />

      <div className="d-grid mt-3">
        <button type="submit" className="btn btn-primary" disabled={creating || !isFormValid}>
          {creating ? 'Creando...' : 'Crear Reservación'}
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
