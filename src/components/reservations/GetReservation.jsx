// src/components/reservations/crud/GetReservation.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { useGetReservations } from '../../shared/hooks/useGetReservations';
import { useGetReservation } from '../../shared/hooks/useGetReservation';

const formatDate = iso => new Date(iso).toLocaleDateString('es-GT');

const GetReservation = () => {
  const [reservationId, setReservationId] = useState('');
  const [errorId, setErrorId] = useState(false);

  const {
    reservations,
    isLoading: loadingList,
    error: listError,
    fetchReservations
  } = useGetReservations();

  const {
    reservation,
    isLoading: loadingRes,
    error: fetchError,
    fetchReservation
  } = useGetReservation(reservationId);

  useEffect(() => {
    if (!reservations.length) fetchReservations();
  }, [reservations.length, fetchReservations]);

  const handleChange = useCallback(e => {
    setReservationId(e.target.value);
    if (e.target.value.trim()) setErrorId(false);
  }, []);

  const handleSubmit = useCallback(e => {
    e.preventDefault();
    if (!reservationId.trim()) {
      setErrorId(true);
      return;
    }
    fetchReservation(reservationId);
  }, [reservationId, fetchReservation]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mt-4"
    >
      <div className="p-4 border rounded shadow-sm bg-white">
        <h5 className="mb-4">Obtener Reservación</h5>

        <form onSubmit={handleSubmit} className="row g-3 align-items-end">
          <div className="col-md-6">
            <label htmlFor="reservationId" className="form-label d-flex align-items-center">
              <FaSearch className="me-2"/> ID de Reservación
            </label>
            <input
              id="reservationId"
              type="text"
              className={`form-control ${errorId ? 'is-invalid' : ''}`}
              placeholder="Ingresa ID"
              value={reservationId}
              onChange={handleChange}
            />
            <div className="invalid-feedback">El ID de reservación es requerido.</div>
          </div>

          <div className="col-md-6">
            <label htmlFor="selectRes" className="form-label">O seleccionar una reservación</label>
            <select
              id="selectRes"
              className="form-select"
              value={reservationId}
              onChange={handleChange}
              disabled={loadingList || loadingRes}
            >
              <option value="">-- Selecciona --</option>
              {reservations.map(r => {
                const userLabel = r.user?.name
                  ? `${r.user.name} ${r.user.surname || ''}`.trim()
                  : r.user;
                return (
                  <option key={r._id} value={r._id}>
                    {`${userLabel} — ${formatDate(r.checkInDate)} a ${formatDate(r.checkOutDate)}`}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-secondary" disabled={loadingRes}>
              {loadingRes ? 'Cargando...' : 'Cargar Reservación'}
            </button>
          </div>
        </form>

        {listError && (
          <motion.div className="alert alert-danger mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Error al cargar reservaciones: {listError.message}
          </motion.div>
        )}

        {fetchError && (
          <motion.div className="alert alert-danger mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Error al buscar reservación: {fetchError.message || 'Intenta de nuevo.'}
          </motion.div>
        )}

        {reservation && (
          <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h6>Detalles de la Reservación</h6>
            <ul className="list-group">
              <li className="list-group-item"><strong>ID:</strong> {reservation._id}</li>
              <li className="list-group-item"><strong>Usuario:</strong> {reservation.user?.name ? `${reservation.user.name} ${reservation.user.surname || ''}`.trim() : reservation.user}</li>
              <li className="list-group-item"><strong>Hotel:</strong> {reservation.hotel?.name}</li>
              <li className="list-group-item"><strong>Habitación:</strong> {reservation.room?.number}</li>
              <li className="list-group-item"><strong>Entrada:</strong> {formatDate(reservation.checkInDate)}</li>
              <li className="list-group-item"><strong>Salida:</strong> {formatDate(reservation.checkOutDate)}</li>
              <li className="list-group-item"><strong>Estado:</strong> {reservation.status}</li>
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default GetReservation;
export { GetReservation };