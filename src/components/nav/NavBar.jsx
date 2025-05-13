import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useUserDetails } from '../../shared/hooks';


export const Navbar = () => {
  const { isLogged, logout } = useUserDetails();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
          <img
            src="../../src/assets/logo.png"
            alt="Logo"
            width="40"
            height="40"
            className="me-2"
          />
          <span className="fw-bold text-dark">Hostel</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {!isLogged ? (
              <li className="nav-item">
                <NavLink className="nav-link" to="/auth">
                  Iniciar sesión
                </NavLink>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger ms-3"
                    onClick={logout}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
