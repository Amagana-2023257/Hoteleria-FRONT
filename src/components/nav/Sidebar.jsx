// src/components/nav/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUserDetails } from '../../shared/hooks/useUserDetails';

const sections = [
  {
    title: 'Hoteles',
    items: [
      { path: '/dashboard/hotels', label: ' Hoteles', allowedRoles: ['ALL'] },
      { path: '/dashboard/hotels/create', label: 'Crear Hotel', allowedRoles: ['ADMIN_GLOBAL'] },
      { path: '/dashboard/hotels/:id', label: 'Ver Hotel', allowedRoles: ['ALL'] },
      { path: '/dashboard/hotels/update/:id', label: 'Actualizar Hotel', allowedRoles: ['ADMIN_GLOBAL'] },
      { path: '/dashboard/hotels/delete/:id', label: 'Eliminar Hotel', allowedRoles: ['ADMIN_GLOBAL'] },
    ],
  },
  {
    title: 'Habitaciones',
    items: [
      { path: '/dashboard/rooms', label: 'Listar Habitaciones', allowedRoles: ['ALL'] },
      { path: '/dashboard/rooms/create', label: 'Crear Habitación', allowedRoles: ['ADMIN_GLOBAL', 'ADMIN_HOTEL'] },
      { path: '/dashboard/rooms/:id', label: 'Ver Habitación', allowedRoles: ['ALL'] },
      { path: '/dashboard/rooms/update/:id', label: 'Actualizar Habitación', allowedRoles: ['ADMIN_GLOBAL', 'ADMIN_HOTEL'] },
      { path: '/dashboard/rooms/delete/:id', label: 'Eliminar Habitación', allowedRoles: ['ADMIN_GLOBAL', 'ADMIN_HOTEL'] },
    ],
  },
  {
    title: 'Eventos',
    items: [
      { path: '/dashboard/events', label: 'Listar Eventos', allowedRoles: ['ALL'] },
      { path: '/dashboard/events/create', label: 'Crear Evento', allowedRoles: ['ADMIN_HOTEL', 'ADMIN_SERVICE'] },
      { path: '/dashboard/events/:id', label: 'Ver Evento', allowedRoles: ['ALL'] },
      { path: '/dashboard/events/update/:id', label: 'Actualizar Evento', allowedRoles: ['ADMIN_HOTEL', 'ADMIN_SERVICE'] },
      { path: '/dashboard/events/delete/:id', label: 'Eliminar Evento', allowedRoles: ['ADMIN_HOTEL', 'ADMIN_SERVICE'] },
    ],
  },
  {
    title: 'Reservaciones',
    items: [
      { path: '/dashboard/reservations', label: 'Listar Reservaciones', allowedRoles: ['ADMIN_GLOBAL', 'ADMIN_HOTEL'] },
      { path: '/dashboard/reservations/create', label: 'Crear Reservación', allowedRoles: ['USER_ROLE'] },
      { path: '/dashboard/reservations/:id', label: 'Ver Reservación', allowedRoles: ['ADMIN_GLOBAL', 'ADMIN_HOTEL'] },
      { path: '/dashboard/reservations/update/:id', label: 'Actualizar Reservación', allowedRoles: ['ADMIN_GLOBAL', 'ADMIN_HOTEL'] },
      { path: '/dashboard/reservations/delete/:id', label: 'Eliminar Reservación', allowedRoles: ['USER_ROLE', 'ADMIN_GLOBAL', 'ADMIN_HOTEL'] },
    ],
  },
];

export const Sidebar = () => {
  const { role } = useUserDetails();

  const canAccess = (allowedRoles) => {
    return (
      role === 'ADMIN_GLOBAL' ||
      allowedRoles.includes(role) ||
      allowedRoles.includes('ALL')
    );
  };

  return (
    <nav className="sidebar d-none d-md-flex flex-column bg-dark text-white p-3" style={{ minHeight: '100vh' }}>
      <div className="mb-4">
        <h5 className="text-uppercase">Menú principal</h5>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-link text-white ${isActive ? 'fw-bold' : ''}`
          }
        >
          🏠 Inicio
        </NavLink>
      </div>

      {sections.map(({ title, items }) => {
        const visibleItems = items.filter(({ allowedRoles }) => canAccess(allowedRoles));
        if (visibleItems.length === 0) return null;

        return (
          <div key={title} className="mb-3">
            <h6 className="text-secondary text-uppercase mb-2">{title}</h6>
            <ul className="nav flex-column">
              {visibleItems.map(({ path, label }) => (
                <li key={path} className="nav-item">
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `nav-link text-white ${isActive ? 'fw-bold bg-secondary rounded px-2' : ''}`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
};
