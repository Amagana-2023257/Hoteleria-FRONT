// src/components/hotels/CreateHotel.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCreateHotel } from '../../shared/hooks/useCreateHotel';
import { Input } from '../UI/Input';

export const CreateHotel = ({ onCreated }) => {
  const { createHotel, isLoading } = useCreateHotel();
  const [form, setForm] = useState({
    name:       { value: '', isValid: false, showError: false },
    address:    { value: '', isValid: false, showError: false },
    category:   { value: '', isValid: false, showError: false },
    price:      { value: '', isValid: false, showError: false },
    amenities:  { value: '', isValid: false, showError: false },
  });

  const handleChange = (val, field) => {
    setForm(f => ({
      ...f,
      [field]: { ...f[field], value: val }
    }));
  };

  const handleBlur = (val, field) => {
    let isValid = val.trim() !== '';
    if (field === 'price') {
      const num = Number(val);
      isValid = !isNaN(num) && num > 0;
    }
    setForm(f => ({
      ...f,
      [field]: { ...f[field], isValid, showError: !isValid }
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const amenitiesArray = form.amenities.value
      .split(',')
      .map(a => a.trim())
      .filter(a => a);
    const result = await createHotel({
      name:      form.name.value,
      address:   form.address.value,
      category:  form.category.value,
      price:     Number(form.price.value),
      amenities: amenitiesArray
    });
    if (result.success && onCreated) {
      onCreated(result.data.hotel);
      setForm({
        name:       { value: '', isValid: false, showError: false },
        address:    { value: '', isValid: false, showError: false },
        category:   { value: '', isValid: false, showError: false },
        price:      { value: '', isValid: false, showError: false },
        amenities:  { value: '', isValid: false, showError: false },
      });
    }
  };

  const disabled =
    isLoading ||
    !form.name.isValid ||
    !form.address.isValid ||
    !form.category.isValid ||
    !form.price.isValid;

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded">
      <h5 className="mb-3">Crear Hotel</h5>

      <Input
        field="name"
        label="Nombre"
        type="text"
        value={form.name.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.name.showError}
        validationMessage="El nombre es requerido."
      />

      <Input
        field="address"
        label="Dirección"
        type="text"
        value={form.address.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.address.showError}
        validationMessage="La dirección es requerida."
      />

      <div className="mb-3">
        <label htmlFor="category" className="form-label">Categoría</label>
        <select
          id="category"
          name="category"
          className={`form-select ${form.category.showError ? 'is-invalid' : ''}`}
          value={form.category.value}
          onChange={e => handleChange(e.target.value, 'category')}
          onBlur={e => handleBlur(e.target.value, 'category')}
        >
          <option value="">Selecciona categoría</option>
          <option value="Luxury">Luxury</option>
          <option value="Standard">Standard</option>
          <option value="Economy">Economy</option>
        </select>
        {form.category.showError && (
          <div className="invalid-feedback">La categoría es requerida.</div>
        )}
      </div>

      <Input
        field="price"
        label="Precio"
        type="number"
        value={form.price.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.price.showError}
        validationMessage="El precio debe ser un número mayor que 0."
      />

      <Input
        field="amenities"
        label="Servicios (comma separados)"
        type="text"
        value={form.amenities.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.amenities.showError}
        validationMessage="Proporciona al menos un servicio o déjalo en blanco."
      />

      <div className="d-grid mt-3">
        <button type="submit" className="btn btn-primary" disabled={disabled}>
          {isLoading ? 'Creando...' : 'Crear Hotel'}
        </button>
      </div>
    </form>
  );
};

CreateHotel.propTypes = {
  onCreated: PropTypes.func,
};

CreateHotel.defaultProps = {
  onCreated: null,
};
