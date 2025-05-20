// src/components/hotels/crud/UpdateHotel.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaSyncAlt } from 'react-icons/fa';
import { useGetHotels } from '../../shared/hooks/useGetHotels';
import { useUpdateHotel } from '../../shared/hooks/useUpdateHotel';

export const UpdateHotel = ({ onUpdated }) => {
  const { hotels, isLoading: loadingHotels } = useGetHotels();
  const { updateHotel, isLoading: updating } = useUpdateHotel();

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    name:'', location:'', address:'', category:'', price:'',
    amenities:'', rating:'', availableRooms:''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selected) {
      setForm({
        name: selected.name,
        location: selected.location,
        address: selected.address,
        category: selected.category,
        price: String(selected.price),
        amenities: selected.amenities.join(', '),
        rating: String(selected.rating),
        availableRooms: String(selected.availableRooms)
      });
      setErrors({});
    }
  }, [selected]);

  const onSelect = e => setSelected(hotels.find(h=>h._id===e.target.value)||null);
  const onChange = e => { setForm(f=>({...f,[e.target.name]:e.target.value})); setErrors({}); };

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name='Requerido';
    if (!form.location) errs.location='Requerido';
    if (!form.address) errs.address='Requerido';
    if (!form.category) errs.category='Requerido';
    if (!form.price||Number(form.price)<=0) errs.price='>0';
    if (form.rating&&(isNaN(Number(form.rating))||Number(form.rating)<0||Number(form.rating)>5))
      errs.rating='0–5';
    if (!form.availableRooms||Number(form.availableRooms)<0) errs.availableRooms='≥0';
    return errs;
  };

  const onSubmit=async e=>{
    e.preventDefault();
    const errs=validate();
    if(Object.keys(errs).length){setErrors(errs);return;}
    const payload={
      name:form.name,location:form.location,address:form.address,
      category:form.category,price:Number(form.price),
      amenities:form.amenities.split(',').map(a=>a.trim()).filter(Boolean),
      rating:Number(form.rating),availableRooms:Number(form.availableRooms)
    };
    const res=await updateHotel(selected._id,payload);
    if(res.success){onUpdated?.(res.data.hotel);setSelected(null);}
  };

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.4}}
                className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">Actualizar Hotel</h5>

          <div className="mb-3">
            <label htmlFor="hotelSelect" className="form-label">Selecciona un Hotel</label>
            <div className="input-group">
              <select id="hotelSelect" className="form-select"
                      value={selected?._id||''} onChange={onSelect} disabled={loadingHotels}>
                <option value="">-- Selecciona --</option>
                {hotels.map(h=>(
                  <option key={h._id} value={h._id}>{h.name}</option>
                ))}
              </select>
              <button type="button" className="btn btn-outline-secondary" onClick={()=>setSelected(null)}>
                <FaSyncAlt/>
              </button>
            </div>
          </div>

          {selected && (
            <form onSubmit={onSubmit} className="row g-3">
              {['name','location','address','category'].map(n=>(
                <div className="col-md-6" key={n}>
                  <label htmlFor={n} className="form-label">{n.charAt(0).toUpperCase()+n.slice(1)}</label>
                  <input id={n} name={n} type="text"
                         className={`form-control ${errors[n]?'is-invalid':''}`}
                         value={form[n]} onChange={onChange}/>
                  {errors[n]&&<div className="invalid-feedback">{errors[n]}</div>}
                </div>
              ))}
              {[['price','number'],['rating','number'],['availableRooms','number']].map(([n,t])=>(
                <div className="col-md-4" key={n}>
                  <label htmlFor={n} className="form-label">{n.charAt(0).toUpperCase()+n.slice(1)}</label>
                  <input id={n} name={n} type={t}
                         className={`form-control ${errors[n]?'is-invalid':''}`}
                         value={form[n]} onChange={onChange}/>
                  {errors[n]&&<div className="invalid-feedback">{errors[n]}</div>}
                </div>
              ))}
              <div className="col-12">
                <label htmlFor="amenities" className="form-label">Amenidades (coma separadas)</label>
                <input id="amenities" name="amenities" type="text"
                       className="form-control" value={form.amenities} onChange={onChange}/>
              </div>
              <div className="col-12 text-end">
                <button type="submit" className="btn btn-warning" disabled={updating}>
                  {updating?'Actualizando...':'Actualizar'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
};

UpdateHotel.propTypes={onUpdated:PropTypes.func};
UpdateHotel.defaultProps={onUpdated:null};
