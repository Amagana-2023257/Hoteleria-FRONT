// src/components/hotels/crud/CreateHotel.jsx
import React, { useReducer, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useCreateHotel } from '../../shared/hooks/useCreateHotel';
import { motion } from 'framer-motion';

const initialState = {
  name: '', location: '', address: '', category: '',
  price: '', availableRooms: '', rating: '0',
  amenities: '', images: [], errors: {}, previews: []
};

function reducer(state, action) {
  switch (action.type) {
    case 'FIELD_CHANGE':
      return { ...state, [action.field]: action.value };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SET_IMAGES':
      return {
        ...state,
        images: action.files,
        previews: action.files.map(file => URL.createObjectURL(file))
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export const CreateHotel = ({ onCreated }) => {
  const { createHotel, isLoading } = useCreateHotel();
  const [state, dispatch] = useReducer(reducer, initialState);

  const validate = useCallback(() => {
    const errs = {};
    ['name','location','address','category'].forEach(f => {
      if (!state[f].trim()) errs[f] = 'Requerido';
    });
    if (!state.price || Number(state.price) <= 0) errs.price = 'Mayor que 0';
    if (!Number.isInteger(Number(state.availableRooms)) || Number(state.availableRooms) < 0)
      errs.availableRooms = 'Entero ≥ 0';
    if (isNaN(Number(state.rating)) || Number(state.rating) < 0 || Number(state.rating) > 5)
      errs.rating = '0–5';
    return errs;
  }, [state]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      const fileList = Array.from(files);
      dispatch({ type: 'SET_IMAGES', files: fileList });
    } else {
      dispatch({ type: 'FIELD_CHANGE', field: name, value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      dispatch({ type: 'SET_ERRORS', errors: errs });
      return;
    }
    const fd = new FormData();
    ['name','location','address','category','price','availableRooms','rating']
      .forEach(field => fd.append(field, state[field]));
    state.amenities
      .split(',')
      .map(a => a.trim())
      .filter(Boolean)
      .forEach(a => fd.append('amenities', a));
    state.images.forEach(img => fd.append('images', img));

    const result = await createHotel(fd);
    if (result.success) {
      onCreated?.(result.data.hotel);
      dispatch({ type: 'RESET' });
    }
  };

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}>
      <form onSubmit={handleSubmit} className="container border p-4 rounded bg-light">
        <h3 className="mb-4">Crear Nuevo Hotel</h3>
        <div className="row">
          {['name','location','address','category'].map(f => (
            <div key={f} className="mb-3 col-md-6">
              <label htmlFor={f} className="form-label">{f.charAt(0).toUpperCase()+f.slice(1)}</label>
              {f==='category' ? (
                <select
                  id={f}
                  name={f}
                  className={`form-select ${state.errors[f]?'is-invalid':''}`}
                  value={state[f]}
                  onChange={handleChange}
                >
                  <option value="">Selecciona</option>
                  <option>Luxury</option>
                  <option>Standard</option>
                  <option>Economy</option>
                </select>
              ) : (
                <input
                  id={f}
                  name={f}
                  type="text"
                  className={`form-control ${state.errors[f]?'is-invalid':''}`}
                  value={state[f]}
                  onChange={handleChange}
                />
              )}
              {state.errors[f] && <div className="invalid-feedback">{state.errors[f]}</div>}
            </div>
          ))}

          {[ ['price','Precio (Q)'], ['availableRooms','Habit. disp.'] ].map(([name,label]) => (
            <div key={name} className="mb-3 col-md-6">
              <label htmlFor={name} className="form-label">{label}</label>
              <input
                id={name}
                name={name}
                type="number"
                className={`form-control ${state.errors[name]?'is-invalid':''}`}
                value={state[name]}
                onChange={handleChange}
              />
              {state.errors[name] && <div className="invalid-feedback">{state.errors[name]}</div>}
            </div>
          ))}

          <div className="mb-3 col-md-6">
            <label htmlFor="rating" className="form-label">Calificación (0–5)</label>
            <input
              id="rating"
              name="rating"
              type="number"
              min="0"
              max="5"
              className={`form-control ${state.errors.rating?'is-invalid':''}`}
              value={state.rating}
              onChange={handleChange}
            />
            {state.errors.rating && <div className="invalid-feedback">{state.errors.rating}</div>}
          </div>

          <div className="mb-3 col-12">
            <label htmlFor="amenities" className="form-label">Amenidades (coma separadas)</label>
            <input
              id="amenities"
              name="amenities"
              type="text"
              className="form-control"
              value={state.amenities}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3 col-12">
            <label htmlFor="images" className="form-label">Imágenes</label>
            <input
              id="images"
              name="images"
              type="file"
              multiple
              accept="image/*"
              className="form-control"
              onChange={handleChange}
            />
            <div className="mt-2 d-flex flex-wrap gap-2">
              {state.previews.map((src,i) => (
                <img key={i} src={src} alt="preview"
                     className="img-thumbnail"
                     style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
              ))}
            </div>
          </div>

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Hotel'}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

CreateHotel.propTypes = { onCreated: PropTypes.func };
CreateHotel.defaultProps = { onCreated: null };
