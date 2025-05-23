// src/components/reservations/crud/CreateReservation.jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaHotel, FaDoorClosed, FaCalendarAlt } from 'react-icons/fa';
import { useCreateReservation } from '../../shared/hooks/useCreateReservation';
import { useUserDetails }      from '../../shared/hooks/useUserDetails';
import { useGetHotels }        from '../../shared/hooks/useGetHotels';
import { useGetRoomsByHotel }  from '../../shared/hooks/useGetRoomsByHotel';
import { Input }               from '../UI/Input';

const initialForm = {
  hotel:        { value: '', isValid: false, showError: false },
  room:         { value: '', isValid: false, showError: false },
  checkInDate:  { value: '', isValid: false, showError: false },
  checkOutDate: { value: '', isValid: false, showError: false },
};

export const CreateReservation = ({ onCreated }) => {
  const { createReservation, isLoading: creating } = useCreateReservation();
  const { id: userId } = useUserDetails();
  const { hotels, isLoading: loadingHotels, error: hotelsError, fetchHotels } = useGetHotels();

  const [form, setForm] = useState(initialForm);
  const hotelId = form.hotel.value;

  // Fetch rooms when hotelId changes
  const { rooms: hotelRooms, isLoading: loadingRooms, error: roomsError, fetchRoomsByHotel } = useGetRoomsByHotel(hotelId);

  // Load hotels on mount
  useEffect(() => {
    if (!hotels.length) fetchHotels();
  }, [hotels.length, fetchHotels]);

  // Reset room field when hotel changes
  useEffect(() => {
    setForm(f => ({ ...f, room: initialForm.room }));
  }, [hotelId]);

  const validate = (value, field) => {
    if (field.includes('Date')) {
      return Boolean(value) && !isNaN(Date.parse(value));
    }
    return value.trim() !== '';
  };

  const updateField = useCallback((value, field) => {
    const isValid = validate(value, field);
    setForm(f => ({
      ...f,
      [field]: { value, isValid, showError: false }
    }));
  }, []);

  const markTouched = useCallback((value, field) => {
    const isValid = validate(value, field);
    setForm(f => ({
      ...f,
      [field]: { ...f[field], isValid, showError: !isValid }
    }));
  }, []);

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    // show errors on invalid fields
    const updated = { ...form };
    Object.keys(updated).forEach(key => {
      if (!updated[key].isValid) updated[key].showError = true;
    });
    setForm(updated);
    if (!Object.values(updated).every(f => f.isValid)) return;

    // validate date order
    const inDate = new Date(form.checkInDate.value);
    const outDate = new Date(form.checkOutDate.value);
    if (inDate > outDate) {
      setForm(f => ({
        ...f,
        checkInDate:  { ...f.checkInDate, showError: true },
        checkOutDate: { ...f.checkOutDate, showError: true }
      }));
      toast.error('La fecha de entrada debe ser anterior a la de salida');
      return;
    }

    const payload = {
      user:         userId,
      hotel:        hotelId,
      room:         form.room.value,
      checkInDate:  form.checkInDate.value,
      checkOutDate: form.checkOutDate.value
    };

    const result = await createReservation(payload);
    if (result.success) {
      toast.success('Reservación creada');
      onCreated?.(result.data.reservation);
      setForm(initialForm);
    } else {
      toast.error(result.message || 'Error al crear reservación');
    }
  }, [form, userId, hotelId, createReservation, onCreated]);

  const isFormReady = Object.values(form).every(f => f.isValid);

  return (
    <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="p-4 bg-white rounded shadow">
      <h5 className="mb-4">Reservar Habitación</h5>

      {hotelsError && <div className="alert alert-danger mb-3">Error al cargar hoteles: {hotelsError.message}</div>}

      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="hotel" className="form-label d-flex align-items-center">
            <FaHotel className="me-2"/> Hotel
          </label>
          <select
            id="hotel"
            className={`form-select ${form.hotel.showError ? 'is-invalid' : ''}`}
            value={form.hotel.value}
            onChange={e => updateField(e.target.value, 'hotel')}
            onBlur={e => markTouched(e.target.value, 'hotel')}
            disabled={loadingHotels || creating}
          >
            <option value="">Selecciona un hotel</option>
            {hotels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
          </select>
          {form.hotel.showError && <div className="invalid-feedback">El hotel es requerido.</div>}
        </div>

        <div className="col-md-6">
          <label htmlFor="room" className="form-label d-flex align-items-center">
            <FaDoorClosed className="me-2"/> Habitación
          </label>
          <select
            id="room"
            className={`form-select ${form.room.showError ? 'is-invalid' : ''}`}
            value={form.room.value}
            onChange={e => updateField(e.target.value, 'room')}
            onBlur={e => markTouched(e.target.value, 'room')}
            disabled={!hotelId || loadingRooms || creating}
          >
            <option value="">Selecciona una habitación</option>
            {hotelRooms.map(r => <option key={r._id} value={r._id}>{`${r.type} — Capacidad: ${r.capacity}`}</option>)}
          </select>
          {form.room.showError && <div className="invalid-feedback">La habitación es requerida.</div>}
          {roomsError && <div className="text-danger mt-1">Error al cargar habitaciones</div>}
        </div>

        <div className="col-md-6">
          <Input
            field="checkInDate"
            label={<><FaCalendarAlt className="me-2"/> Fecha de Entrada</>}
            type="date"
            value={form.checkInDate.value}
            onChangeHandler={updateField}
            onBlurHandler={markTouched}
            showErrorMessage={form.checkInDate.showError}
            validationMessage="Fecha inválida"
            disabled={creating}
          />
        </div>

        <div className="col-md-6">
          <Input
            field="checkOutDate"
            label={<><FaCalendarAlt className="me-2"/> Fecha de Salida</>}
            type="date"
            value={form.checkOutDate.value}
            onChangeHandler={updateField}
            onBlurHandler={markTouched}
            showErrorMessage={form.checkOutDate.showError}
            validationMessage="Fecha inválida"
            disabled={creating}
          />
        </div>
      </div>

      <div className="d-grid mt-4">
        <button type="submit" className="btn btn-primary" disabled={creating || !isFormReady}>
          {creating ? 'Creando…' : 'Reservar ahora'}
        </button>
      </div>
    </motion.form>
  );
};

CreateReservation.propTypes = {
  onCreated: PropTypes.func
};
CreateReservation.defaultProps = {
  onCreated: null
};