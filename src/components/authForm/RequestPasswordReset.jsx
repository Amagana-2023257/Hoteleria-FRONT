// src/components/authForm/RequestPasswordReset.jsx
import React, { useState } from 'react';
import { useRequestPasswordReset } from '../../shared/hooks/useRequestPasswordReset';
import { Input } from '../UI/Input';
import PropTypes from 'prop-types';

export const RequestPasswordReset = ({ onNext }) => {
  const { requestPasswordReset, isLoading } = useRequestPasswordReset();
  const [email, setEmail] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await requestPasswordReset(email);
    if (res.success) onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl text-center mb-4">Recuperar contraseña</h2>
      <Input field="email" label="Correo electrónico" type="email" value={email}
        onChangeHandler={v => setEmail(v)} showErrorMessage={false} validationMessage="" />
      <button type="submit" disabled={isLoading || !email} className="btn btn-primary w-full mt-3">
        {isLoading ? 'Enviando...' : 'Enviar código'}
      </button>
    </form>
  );
};
RequestPasswordReset.propTypes = { onNext: PropTypes.func.isRequired };