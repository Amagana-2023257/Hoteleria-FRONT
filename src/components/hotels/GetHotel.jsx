// src/components/hotels/crud/GetHotel.jsx
import React, { useState } from 'react';
import { useGetHotel } from '../../shared/hooks/useGetHotel';
import { Input } from '../UI/Input';

export const GetHotel = () => {
  const [hotelId, setHotelId] = useState({ value: '', isValid: false, showError: false });
  const { hotel, isLoading, error, fetchHotel } = useGetHotel(hotelId.value);

  const handleChange = val => {
    setHotelId({
      value: val,
      isValid: val.trim() !== '',
      showError: false
    });
  };

  const handleBlur = () => {
    if (!hotelId.value.trim()) {
      setHotelId(id => ({ ...id, isValid: false, showError: true }));
    }
  };

  const handleFetch = e => {
    e.preventDefault();
    if (hotelId.isValid) {
      fetchHotel();
    } else {
      setHotelId(id => ({ ...id, showError: true }));
    }
  };

  return (
    <div className="p-3 border rounded">
      <h5 className="mb-3">Obtener Hotel</h5>
      <form onSubmit={handleFetch}>
        <Input
          field="hotelId"
          label="ID de Hotel"
          type="text"
          value={hotelId.value}
          onChangeHandler={(val) => handleChange(val)}
          onBlurHandler={() => handleBlur()}
          showErrorMessage={hotelId.showError}
          validationMessage="El ID de hotel es requerido."
        />
        <div className="d-grid mb-3">
          <button className="btn btn-secondary" type="submit" disabled={isLoading}>
            {isLoading ? 'Cargando...' : 'Cargar Hotel'}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert alert-danger">
          Error al cargar el hotel: {error.message || 'Revisa el ID e inténtalo de nuevo.'}
        </div>
      )}

      {hotel && (
        <div className="mt-3">
          <h6>Detalles del Hotel:</h6>
          <ul className="list-group">
            <li className="list-group-item"><strong>ID:</strong> {hotel.uid}</li>
            <li className="list-group-item"><strong>Nombre:</strong> {hotel.name}</li>
            <li className="list-group-item"><strong>Dirección:</strong> {hotel.address}</li>
            <li className="list-group-item"><strong>Categoría:</strong> {hotel.category}</li>
            <li className="list-group-item"><strong>Precio:</strong> Q{hotel.price}</li>
            <li className="list-group-item">
              <strong>Servicios:</strong> {hotel.amenities.join(', ')}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
