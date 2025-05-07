// src/components/auth/Register.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../UI/Input';
import { Logo } from '../logo/Logo';
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhone,
  validatePasswordConfirm,
  valideEmailMessage,
  validateUsernameMessage,
  validatePasswordMessage,
  validatePhoneMessage,
  validatePasswordConfirmMessage,
} from '../../shared/validators';
import { useRegister } from '../../shared/hooks/useRegister';

export const Register = ({ switchAuthHandler }) => {
  const { register, isLoading } = useRegister();
  const [form, setForm] = useState({
    name:         { value: '', isValid: false, showError: false },
    surname:      { value: '', isValid: false, showError: false },
    username:     { value: '', isValid: false, showError: false },
    email:        { value: '', isValid: false, showError: false },
    phone:        { value: '', isValid: false, showError: false },
    password:     { value: '', isValid: false, showError: false },
    passwordConf: { value: '', isValid: false, showError: false },
  });

  const handleChange = (val, field) =>
    setForm(f => ({ ...f, [field]: { ...f[field], value: val } }));

  const handleBlur = (val, field) => {
    let valid = false;
    switch (field) {
      case 'name':
      case 'surname':
        valid = val.trim().length > 0;
        break;
      case 'username':
        valid = validateUsername(val);
        break;
      case 'email':
        valid = validateEmail(val);
        break;
      case 'phone':
        valid = validatePhone(val);
        break;
      case 'password':
        valid = validatePassword(val);
        break;
      case 'passwordConf':
        valid = validatePasswordConfirm(form.password.value, val);
        break;
      default:
        break;
    }
    setForm(f => ({
      ...f,
      [field]: { ...f[field], isValid: valid, showError: !valid }
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    register({
      name:     form.name.value,
      surname:  form.surname.value,
      username: form.username.value,
      email:    form.email.value,
      phone:    form.phone.value,
      password: form.password.value
    });
  };

  const disabled = isLoading ||
    !form.name.isValid ||
    !form.surname.isValid ||
    !form.username.isValid ||
    !form.email.isValid ||
    !form.phone.isValid ||
    !form.password.isValid ||
    !form.passwordConf.isValid;

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="text-center mb-4">
        <Logo text="Crear cuenta" />
      </div>

      <Input
        field="name"
        label="Nombre"
        type="text"
        value={form.name.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.name.showError}
        validationMessage="El nombre es obligatorio."
      />

      <Input
        field="surname"
        label="Apellido"
        type="text"
        value={form.surname.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.surname.showError}
        validationMessage="El apellido es obligatorio."
      />

      <Input
        field="username"
        label="Usuario"
        type="text"
        value={form.username.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.username.showError}
        validationMessage={validateUsernameMessage}
      />

      <Input
        field="email"
        label="Correo electrónico"
        type="email"
        value={form.email.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.email.showError}
        validationMessage={valideEmailMessage}
      />

      <Input
        field="phone"
        label="Teléfono (8 dígitos)"
        type="text"
        value={form.phone.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.phone.showError}
        validationMessage={validatePhoneMessage}
      />

      <Input
        field="password"
        label="Contraseña"
        type="password"
        value={form.password.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.password.showError}
        validationMessage={validatePasswordMessage}
      />

      <Input
        field="passwordConf"
        label="Confirmar contraseña"
        type="password"
        value={form.passwordConf.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.passwordConf.showError}
        validationMessage={validatePasswordConfirmMessage}
      />

      <div className="d-grid mb-3">
        <button type="submit" className="btn btn-danger" disabled={disabled}>
          {isLoading ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </div>

      <div className="text-center">
        <small>
          ¿Ya tienes cuenta?{' '}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={switchAuthHandler}
          >
            Inicia sesión aquí
          </button>
        </small>
      </div>
    </form>
  );
};

Register.propTypes = {
  switchAuthHandler: PropTypes.func.isRequired,
};
