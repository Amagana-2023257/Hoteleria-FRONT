// src/components/hotels/crud/ListHotels.jsx
import React, { useState, useEffect } from 'react';
import { useGetHotels } from '../../shared/hooks/useGetHotels';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaSyncAlt } from 'react-icons/fa';

export const ListHotels = () => {
  const [filters, setFilters] = useState({ location:'',category:'',minPrice:'',maxPrice:'',minRating:'' });
  const { hotels, isLoading, error, fetchHotels } = useGetHotels(filters);

  useEffect(() => { fetchHotels(); }, []);

  const onChangeFilter = e => setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  const apply = () => fetchHotels();
  const reset = () => { setFilters({location:'',category:'',minPrice:'',maxPrice:'',minRating:''}); fetchHotels(); };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center mb-3 overflow-auto py-2 border-bottom">
        <div className="input-group me-2" style={{minWidth:'200px'}}>
          <span className="input-group-text bg-white border-end-0"><FaSearch/></span>
          <input type="text" name="location" className="form-control border-start-0"
                 placeholder="Ubicación" value={filters.location} onChange={onChangeFilter}/>
        </div>
        <select name="category" className="form-select me-2" value={filters.category} onChange={onChangeFilter}>
          <option value="">Categoría</option><option>Luxury</option><option>Standard</option><option>Economy</option>
        </select>
        {['minPrice','maxPrice','minRating'].map(name=>(
          <input key={name} type="number" name={name} className="form-control me-2" style={{width:120}}
                 placeholder={name.includes('Price')?'Q': '⭐'} value={filters[name]} onChange={onChangeFilter}/>
        ))}
        <button className="btn btn-outline-primary me-2" onClick={apply} disabled={isLoading}>Aplicar</button>
        <button className="btn btn-outline-secondary" onClick={reset}><FaSyncAlt/></button>
      </div>

      {error && <div className="alert alert-danger">{error.message}</div>}
      {isLoading && <div className="text-center py-5">Cargando...</div>}

      <AnimatePresence>
        {!isLoading && hotels.length===0 && (
          <motion.div className="text-center text-muted py-5" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            No se encontraron hoteles
          </motion.div>
        )}

        <div className="row">
          {hotels.map((h,i)=>(
            <motion.div className="col-sm-6 col-lg-4 mb-4" key={h._id}
                        initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} exit={{opacity:0,y:20}}>
              <div className="card h-100 shadow-sm border-0">
                {h.images?.[0] && (
                  <div className="ratio ratio-16x9">
                    <img src={`${import.meta.env.VITE_API_URL}${h.images[0]}`}
                         alt={h.name} className="card-img-top object-fit-cover"/>
                  </div>
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-truncate">{h.name}</h5>
                  <p className="card-text text-truncate mb-2" style={{maxHeight:'3em'}}>{h.address}</p>
                  <div className="mt-auto">
                    <span className="badge bg-info text-dark me-2">{h.category}</span>
                    <span className="fw-bold">Q{h.price}/noche</span>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 d-flex justify-content-between">
                  <small className="text-muted">⭐{h.rating}</small>
                  <small className="text-muted">Disp:{h.availableRooms}</small>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};
