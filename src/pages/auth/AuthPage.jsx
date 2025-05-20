import React, { useState } from 'react';
import { Login } from '../../components/authForm/Login';
import { Register } from '../../components/authForm/Register';
import { RequestPasswordReset } from '../../components/authForm/RequestPasswordReset';
import { ResetPassword } from '../../components/authForm/ResetPassword';
import './auth.css';

export const AuthPage = () => {
  // modos: 'login' | 'register' | 'request' | 'reset'
  const [mode, setMode] = useState('login');

  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <Login
            switchAuthHandler={() => setMode('register')}
            onForgotPassword={() => setMode('request')}
          />
        );
      case 'register':
        return <Register switchAuthHandler={() => setMode('login')} />;
      case 'request':
        return <RequestPasswordReset switchAuthHandler={() => setMode('login')} onNext={() => setMode('reset')} />;
      case 'reset':
        return <ResetPassword switchAuthHandler={() => setMode('login')} />;
      default:
        return null;
    }
  };

  return (
    <div className="auth-wrapper d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="auth-card card shadow-sm">
        {renderForm()}
      </div>
    </div>
  );
};
