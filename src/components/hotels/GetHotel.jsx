// src/components/hotels/crud/GetHotel.jsx
import React, { useState } from 'react';
import { useGetHotel } from '../../shared/hooks/useGetHotel';
import { useGetHotels } from '../../shared/hooks/useGetHotels';
import { Input } from '../UI/Input';

export const GetHotel = () => {
  const [hotelId, setHotelId] = useState({ value: '', isValid: false, showError: false });

  // Hook para obtener 1 hotel por ID
  const { hotel, isLoading: loadingHotel, error, fetchHotel } = useGetHotel(hotelId.value);

  // Hook para listar todos los hoteles (para combo box)
  const { hotels, isLoading: loadingHotels } = useGetHotels();

  const handleChange = (val) => {
    setHotelId({
      value: val,
      isValid: val.trim() !== '',
      showError: false,
    });
  };

  const handleBlur = () => {
    if (!hotelId.value.trim()) {
      setHotelId((id) => ({ ...id, isValid: false, showError: true }));
    }
  };

  const handleFetch = (e) => {
    e.preventDefault();
    if (hotelId.isValid) {
      fetchHotel();
    } else {
      setHotelId((id) => ({ ...id, showError: true }));
    }
  };

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      handleChange(selectedId); // actualiza el estado y valida
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h5 className="mb-4 font-semibold">Obtener Hotel</h5>

      <form onSubmit={handleFetch}>
        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">Buscar por ID</label>
          <Input
            field="hotelId"
            label="ID de Hotel"
            type="text"
            value={hotelId.value}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
            showErrorMessage={hotelId.showError}
            validationMessage="El ID de hotel es requerido."
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">O seleccionar un hotel</label>
          <select
            className="w-full p-2 border rounded"
            onChange={handleSelectChange}
            disabled={loadingHotels}
            value={hotelId.value}
          >
            <option value="">-- Selecciona un hotel --</option>
            {hotels.map((h) => (
              <option key={h._id} value={h._id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-secondary w-full" type="submit" disabled={loadingHotel}>
          {loadingHotel ? 'Cargando...' : 'Cargar Hotel'}
        </button>
      </form>

      {error && (
        <div className="mt-3 text-red-600">
          Error al cargar el hotel: {error.message || 'Revisa el ID e inténtalo de nuevo.'}
        </div>
      )}

      {hotel && (
        <div className="mt-5">
          <h6 className="font-semibold mb-2">Detalles del Hotel:</h6>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>ID:</strong> {hotel.uid}</li>
            <li><strong>Nombre:</strong> {hotel.name}</li>
            <li><strong>Dirección:</strong> {hotel.address}</li>
            <li><strong>Categoría:</strong> {hotel.category}</li>
            <li><strong>Precio:</strong> Q{hotel.price}</li>
            <li><strong>Servicios:</strong> {hotel.amenities.join(', ')}</li>
          </ul>
        </div>
      )}
    </div>
  );
};
