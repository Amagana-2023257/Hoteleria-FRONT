// src/components/hotels/crud/ListHotels.jsx
import React from 'react';
import { useGetHotels } from '../../shared/hooks/useGetHotels';

export const ListHotels = () => {
  const { hotels, isLoading, error, fetchHotels } = useGetHotels();

  return (
    <div className="p-3 border rounded">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Lista de Hoteles</h5>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={fetchHotels}
          disabled={isLoading}
        >
          {isLoading ? 'Cargando...' : 'Recargar'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          Error al cargar hoteles: {error.message || 'Intenta de nuevo.'}
        </div>
      )}

      {!isLoading && hotels.length === 0 && (
        <div className="text-muted">No hay hoteles disponibles.</div>
      )}

      {hotels.length > 0 && (
        <ul className="list-group">
          {hotels.map(hotel => (
            <li key={hotel.uid} className="list-group-item">
              <div><strong>Nombre:</strong> {hotel.name}</div>
              <div><strong>Dirección:</strong> {hotel.address}</div>
              <div><strong>Categoría:</strong> {hotel.category}</div>
              <div><strong>Precio:</strong> Q{hotel.price}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
