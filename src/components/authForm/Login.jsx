// src/components/authForm/Login.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../UI/Input';
import { Logo } from '../logo/Logo';
import {
  validateEmail,
  validatePassword,
  valideEmailMessage,
  validatePasswordMessage,
} from '../../shared/validators';
import { useLogin } from '../../shared/hooks';

export const Login = ({ switchAuthHandler, onForgotPassword }) => {
  const { login, isLoading } = useLogin();
  const [form, setForm] = useState({
    email: { value: '', isValid: false, showError: false },
    password: { value: '', isValid: false, showError: false },
  });

  const handleChange = (val, field) => {
    setForm((f) => ({ ...f, [field]: { ...f[field], value: val } }));
  };

  const handleBlur = (val, field) => {
    const isValid = field === 'email'
      ? validateEmail(val)
      : validatePassword(val);
    setForm((f) => ({
      ...f,
      [field]: { ...f[field], isValid, showError: !isValid },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form.email.value, form.password.value);
  };

  const disabled = isLoading || !form.email.isValid || !form.password.isValid;

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="text-center mb-4">
        <Logo text="Iniciar sesión" />
      </div>
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
        field="password"
        label="Contraseña"
        type="password"
        value={form.password.value}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        showErrorMessage={form.password.showError}
        validationMessage={validatePasswordMessage}
      />
      <div className="d-grid mb-3">
        <button
          type="submit"
          className="btn btn-danger"
          disabled={disabled}
        >
          {isLoading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </div>

      {/* Enlace para disparar el modo "restablecer contraseña" */}
      <div className="text-center mb-3">
        <button
          type="button"
          className="btn btn-link p-0 text-sm"
          onClick={onForgotPassword}
        >
          ¿Olvidaste la contraseña?
        </button>
      </div>

      <div className="text-center">
        <small>
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={switchAuthHandler}
          >
            Regístrate aquí
          </button>
        </small>
      </div>
    </form>
  );
};

Login.propTypes = {
  switchAuthHandler: PropTypes.func.isRequired,
  onForgotPassword: PropTypes.func.isRequired,
};
