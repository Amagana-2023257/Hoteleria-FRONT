// src/components/dashboard/Content.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { DefaultDashboard } from './DefaultDashboard';
import { ProtectedRoute } from '../routes/ProtectedRoute';

// Hotels
import { CreateHotel }   from '../hotels/CreateHotel';
import { ListHotels }    from '../hotels/ListHotels';
import GetHotel          from '../hotels/GetHotel';
import { UpdateHotel }   from '../hotels/UpdateHotel';
import { DeleteHotel }   from '../hotels/DeleteHotel';

// Rooms
import { CreateRoom }    from '../rooms/CreateRoom';
import { ListRooms }     from '../rooms/ListRooms';
import GetRoom from '../rooms/GetRoom';
import { UpdateRoom }    from '../rooms/UpdateRoom';
import { DeleteRoom }    from '../rooms/DeleteRoom';

// Events
import { CreateEvent }   from '../events/CreateEvent';
import { ListEvents }    from '../events/ListEvents';
import { GetEvent }      from '../events/GetEvent';
import { UpdateEvent }   from '../events/UpdateEvent';
import { DeleteEvent }   from '../events/DeleteEvent';

// Reservations
import { CreateReservation }   from '../reservations/CreateReservation';
import { ListReservations }    from '../reservations/ListReservations';
import { GetReservation }      from '../reservations/GetReservation';
import { UpdateReservation }   from '../reservations/UpdateReservation';
import { DeleteReservation }   from '../reservations/DeleteReservation';

export const Content = () => (
  <main className="content-container flex-grow-1 p-4">
    <Routes>
      {/* Default */}
      <Route path="" element={<DefaultDashboard />} />

      {/* Hotels */}
      <Route
        path="hotels"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE']}>
            <ListHotels />
          </ProtectedRoute>
        }
      />
      <Route
        path="hotels/create"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL']}>
            <CreateHotel />
          </ProtectedRoute>
        }
      />
      <Route
        path="hotels/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE']}>
            <GetHotel />
          </ProtectedRoute>
        }
      />
      <Route
        path="hotels/update/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL']}>
            <UpdateHotel />
          </ProtectedRoute>
        }
      />
      <Route
        path="hotels/delete/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL']}>
            <DeleteHotel />
          </ProtectedRoute>
        }
      />

      {/* Rooms */}
      <Route
        path="rooms"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE']}>
            <ListRooms />
          </ProtectedRoute>
        }
      />
      <Route
        path="rooms/create"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL']}>
            <CreateRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="rooms/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE']}>
            <GetRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="rooms/update/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL']}>
            <UpdateRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="rooms/delete/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL']}>
            <DeleteRoom />
          </ProtectedRoute>
        }
      />

      {/* Events */}
      <Route
        path="events"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE']}>
            <ListEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="events/create"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','ADMIN_SERVICE','ADMIN_HOTEL']}>
            <CreateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="events/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','ADMIN_HOTEL','ADMIN_SERVICE','USER_ROLE']}>
            <GetEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="events/update/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','ADMIN_SERVICE','ADMIN_HOTEL']}>
            <UpdateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="events/delete/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','ADMIN_SERVICE','ADMIN_HOTEL']}>
            <DeleteEvent />
          </ProtectedRoute>
        }
      />

      {/* Reservations */}
      <Route
        path="reservations"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','ADMIN_HOTEL']}>
            <ListReservations />
          </ProtectedRoute>
        }
      />
      <Route
        path="reservations/create"
        element={
          <ProtectedRoute allowedRoles={['USER_ROLE']}>
            <CreateReservation />
          </ProtectedRoute>
        }
      />
      <Route
        path="reservations/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','ADMIN_HOTEL','USER_ROLE']}>
            <GetReservation />
          </ProtectedRoute>
        }
      />
      <Route
        path="reservations/update/:id"
        element={
          <ProtectedRoute allowedRoles={['ADMIN_GLOBAL','ADMIN_HOTEL']}>
            <UpdateReservation />
          </ProtectedRoute>
        }
      />
      <Route
        path="reservations/delete/:id"
        element={
          <ProtectedRoute allowedRoles={['USER_ROLE','ADMIN_GLOBAL','ADMIN_HOTEL']}>
            <DeleteReservation />
          </ProtectedRoute>
        }
      />
    </Routes>
  </main>
);
