// src/components/nav/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useUserDetails } from '../../shared/hooks/useUserDetails';

const menuItems = [
  { path: '/dashboard',                     label: 'Inicio',                     allowedRoles: ['ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'] },
  // Hotels
  { path: '/dashboard/hotels',              label: 'Listar Hoteles',            allowedRoles: ['ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'] },
  { path: '/dashboard/hotels/create',       label: 'Crear Hotel',               allowedRoles: ['ADMIN_GLOBAL'] },
  { path: '/dashboard/hotels/:id',          label: 'Ver Hotel',                 allowedRoles: ['ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'] },
  { path: '/dashboard/hotels/update/:id',   label: 'Actualizar Hotel',           allowedRoles: ['ADMIN_GLOBAL'] },
  { path: '/dashboard/hotels/delete/:id',   label: 'Eliminar Hotel',             allowedRoles: ['ADMIN_GLOBAL'] },
  // Rooms
  { path: '/dashboard/rooms',               label: 'Listar Habitaciones',        allowedRoles: ['ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'] },
  { path: '/dashboard/rooms/create',        label: 'Crear Habitación',           allowedRoles: ['ADMIN_GLOBAL','ADMIN_HOTEL'] },
  { path: '/dashboard/rooms/:id',           label: 'Ver Habitación',             allowedRoles: ['ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'] },
  { path: '/dashboard/rooms/update/:id',    label: 'Actualizar Habitación',      allowedRoles: ['ADMIN_GLOBAL','ADMIN_HOTEL'] },
  { path: '/dashboard/rooms/delete/:id',    label: 'Eliminar Habitación',        allowedRoles: ['ADMIN_GLOBAL','ADMIN_HOTEL'] },
  // Events
  { path: '/dashboard/events',              label: 'Listar Eventos',            allowedRoles: ['ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'] },
  { path: '/dashboard/events/create',       label: 'Crear Evento',              allowedRoles: ['ADMIN_HOTEL','ADMIN_SERVICE'] },
  { path: '/dashboard/events/:id',          label: 'Ver Evento',                allowedRoles: ['ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE'] },
  { path: '/dashboard/events/update/:id',   label: 'Actualizar Evento',          allowedRoles: ['ADMIN_HOTEL','ADMIN_SERVICE'] },
  { path: '/dashboard/events/delete/:id',   label: 'Eliminar Evento',            allowedRoles: ['ADMIN_HOTEL','ADMIN_SERVICE'] },
  // Reservations
  { path: '/dashboard/reservations',        label: 'Listar Reservaciones',      allowedRoles: ['ADMIN_GLOBAL','ADMIN_HOTEL'] },
  { path: '/dashboard/reservations/create', label: 'Crear Reservación',          allowedRoles: ['USER_ROLE'] },
  { path: '/dashboard/reservations/:id',    label: 'Ver Reservación',           allowedRoles: ['ADMIN_GLOBAL','ADMIN_HOTEL'] },
  { path: '/dashboard/reservations/update/:id', label: 'Actualizar Reservación', allowedRoles: ['ADMIN_GLOBAL','ADMIN_HOTEL'] },
  { path: '/dashboard/reservations/delete/:id', label: 'Eliminar Reservación',  allowedRoles: ['USER_ROLE','ADMIN_GLOBAL','ADMIN_HOTEL'] },
];

export const Sidebar = () => {
  const { role } = useUserDetails();

  return (
    <nav className="sidebar d-none d-md-flex flex-column bg-dark text-white p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Menú</h5>
      </div>
      <ul className="nav nav-pills flex-column">
        {menuItems.map(({ path, label, allowedRoles }) => {
          const isAllowed = allowedRoles.includes(role);
          const baseClasses = 'nav-link text-white';
          const classes = isAllowed ? baseClasses : `${baseClasses} disabled-link`;
          const title = isAllowed ? '' : `Requiere rol: ${allowedRoles.join(', ')}`;

          return (
            <li key={path} className="nav-item mb-2">
              {isAllowed ? (
                <NavLink to={path} className={classes} activeclassname="active-link">
                  {label}
                </NavLink>
              ) : (
                <span className={classes} title={title}>
                  {label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
