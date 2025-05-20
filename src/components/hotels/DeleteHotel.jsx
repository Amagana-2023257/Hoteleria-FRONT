// src/components/hotels/crud/DeleteHotel.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaTrash, FaSyncAlt } from 'react-icons/fa';
import { useGetHotels } from '../../shared/hooks/useGetHotels';
import { useDeleteHotel } from '../../shared/hooks/useDeleteHotel';

export const DeleteHotel = ({ onDeleted }) => {
  const { hotels, isLoading: loadingHotels } = useGetHotels();
  const { deleteHotel, isLoading: deleting } = useDeleteHotel();

  const [selectedId, setSelectedId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedId) setError('');
  }, [selectedId]);

  const handleSelect = e => setSelectedId(e.target.value);

  const handleDelete = async e => {
    e.preventDefault();
    if (!selectedId) {
      setError('Selecciona un hotel.');
      return;
    }
    const result = await deleteHotel(selectedId);
    if (result.success) {
      onDeleted?.(selectedId);
      setSelectedId('');
    }
  };

  return (
    <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.4 }}
                className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Eliminar Hotel</h5>

          <form onSubmit={handleDelete} className="row g-3 align-items-end">
            <div className="col-md-8">
              <label htmlFor="hotelSelect" className="form-label">Selecciona un Hotel</label>
              <div className="input-group">
                <select id="hotelSelect" className="form-select"
                        value={selectedId} onChange={handleSelect}
                        disabled={loadingHotels || deleting}>
                  <option value="">-- Selecciona --</option>
                  {hotels.map(h => (
                    <option key={h._id} value={h._id}>{h.name}</option>
                  ))}
                </select>
                <button type="button" className="btn btn-outline-secondary"
                        onClick={() => setSelectedId('')} disabled={deleting}>
                  <FaSyncAlt />
                </button>
              </div>
              {error && <div className="text-danger mt-1">{error}</div>}
            </div>

            <div className="col-md-4 text-end">
              <button type="submit" className="btn btn-danger"
                      disabled={!selectedId || deleting}>
                {deleting ? 'Eliminando...' : <><FaTrash className="me-1"/>Eliminar</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

DeleteHotel.propTypes = { onDeleted: PropTypes.func };
DeleteHotel.defaultProps = { onDeleted: null };
