// src/components/hotels/crud/GetHotel.jsx
import React, { useState } from 'react';
import { useGetHotel } from '../../shared/hooks/useGetHotel';
import { useGetHotels } from '../../shared/hooks/useGetHotels';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

const GetHotel = () => {
  const [hotelId, setHotelId] = useState('');
  const [errorId, setErrorId] = useState(false);

  const { hotels, isLoading: loadingHotels } = useGetHotels();
  const { hotel, isLoading: loadingHotel, error: fetchError, fetchHotel } = useGetHotel(hotelId);

  const handleChange = e => {
    setHotelId(e.target.value);
    if (e.target.value.trim()) setErrorId(false);
  };
  const handleSearch = e => {
    e.preventDefault();
    if (!hotelId.trim()) {
      setErrorId(true);
      return;
    }
    fetchHotel();
  };

  return (
    <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.4 }}
                className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Buscar Hotel por ID</h5>
          <form onSubmit={handleSearch} className="row g-3 align-items-end">
            <div className="col-md-6">
              <label htmlFor="hotelId" className="form-label">ID de Hotel</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0"><FaSearch/></span>
                <input id="hotelId" type="text"
                       className={`form-control border-start-0 ${errorId?'is-invalid':''}`}
                       placeholder="Ingresa ID" value={hotelId} onChange={handleChange}/>
                <div className="invalid-feedback">El ID de hotel es requerido.</div>
              </div>
            </div>

            <div className="col-md-6">
              <label htmlFor="selectHotel" className="form-label">O seleccionar un hotel</label>
              <select id="selectHotel" className="form-select"
                      value={hotelId} onChange={handleChange} disabled={loadingHotels}>
                <option value="">-- Selecciona --</option>
                {hotels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
              </select>
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-primary" disabled={loadingHotel}>
                {loadingHotel ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </form>

          {fetchError && (
            <motion.div className="alert alert-danger mt-3" initial={{ opacity:0 }} animate={{ opacity:1 }}>
              Error al buscar hotel: {fetchError.message || 'Intenta de nuevo.'}
            </motion.div>
          )}

          {hotel && (
            <motion.div className="mt-4" initial={{ opacity:0 }} animate={{ opacity:1 }}>
              <h6 className="mb-3">Detalles del Hotel</h6>
              <img src={`${import.meta.env.VITE_API_URL}${hotel.images[0]}`} alt={hotel.name}
                   className="img-fluid rounded mb-3" style={{ maxHeight: '200px', objectFit: 'cover' }}/>
              <ul className="list-group">
                {['ID','Nombre','Ubicación','Dirección','Categoría','Precio','Amenidades','Calificación','Disponibles']
                  .map((field, i) => (
                  <li key={i} className="list-group-item">
                    <strong>{field}:</strong>{' '}
                    {{
                      ID: hotel._id,
                      Nombre: hotel.name,
                      Ubicación: hotel.location,
                      Dirección: hotel.address,
                      Categoría: hotel.category,
                      Precio: `Q${hotel.price} por noche`,
                      Amenidades: hotel.amenities.join(', '),
                      Calificación: `${hotel.rating} / 5`,
                      Disponibles: hotel.availableRooms
                    }[field]}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GetHotel;
