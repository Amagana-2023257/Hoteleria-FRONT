// src/components/authForm/ResetPassword.jsx
import React, { useState } from 'react';
import { useResetPassword } from '../../shared/hooks/useResetPassword';
import { Input } from '../UI/Input';

export const ResetPassword = () => {
  const { resetPassword, isLoading } = useResetPassword();
  const [form, setForm] = useState({ email: '', code: '', newPassword: '' });

  const onChange = field => value => setForm(f => ({ ...f, [field]: value }));
  const handleSubmit = async e => {
    e.preventDefault();
    await resetPassword(form.email, form.code, form.newPassword);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl text-center mb-4">Restablecer contraseña</h2>
      <Input field="email" label="Correo electrónico" type="email" value={form.email}
        onChangeHandler={onChange('email')} showErrorMessage={false} validationMessage="" />
      <Input field="code" label="Código" type="text" value={form.code}
        onChangeHandler={onChange('code')} showErrorMessage={false} validationMessage="" />
      <Input field="newPassword" label="Nueva contraseña" type="password" value={form.newPassword}
        onChangeHandler={onChange('newPassword')} showErrorMessage={false} validationMessage="" />
      <button type="submit" disabled={isLoading || !form.email || !form.code || !form.newPassword}
        className="btn btn-primary w-full mt-3">
        {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
      </button>
    </form>
  );
};
