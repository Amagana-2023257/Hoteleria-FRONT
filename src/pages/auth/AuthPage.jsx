import React, { useState } from 'react';
import { Login } from '../../components/authForm/Login';
import { Register } from '../../components/authForm/Register';
import './auth.css';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthPageToggle = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="auth-wrapper d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="auth-card card shadow-sm">
        {isLogin ? (
          <Login switchAuthHandler={handleAuthPageToggle} />
        ) : (
          <Register switchAuthHandler={handleAuthPageToggle} />
        )}
      </div>
    </div>
  );
};
