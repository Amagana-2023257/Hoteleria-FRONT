import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css'; 

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <App />
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
