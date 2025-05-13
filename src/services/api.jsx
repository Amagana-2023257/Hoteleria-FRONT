// src/services/api.js
import axios from 'axios';
import { logout } from '../shared/hooks/useLogout';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/hotelManager/v1',
  timeout: 5000,
  httpsAgent: false,
});

// Attach token on every request
apiClient.interceptors.request.use(
  config => {
    const userDetails = localStorage.getItem('user');
    if (userDetails) {
      const token = JSON.parse(userDetails).token;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  e => Promise.reject(e)
);

// Auto-logout on 401/403
apiClient.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status;
    if (status === 401 || status === 403) logout();
    return Promise.reject(err);
  }
);

const handleError = e => {
  return { error: true, e }; 
};

// ── Auth ───────────────────────────────────────────────────────────────────────
export const register = async data => {
  try {
    return await apiClient.post('/auth/register', data);
  } catch (e) {
    return handleError(e);
  }
};

export const login = async data => {
  try {
    return await apiClient.post('/auth/login', data);
  } catch (e) {
    return handleError(e);
  }
};

// ── Hotels ─────────────────────────────────────────────────────────────────────
export const createHotel = async data => {
  try {
    return await apiClient.post('/hotel/createHotel', data);
  } catch (e) {
    return handleError(e);
  }
};

export const getHotels = async () => {
  try {
    return await apiClient.get('/hotel/getHotels');
  } catch (e) {
    return handleError(e);
  }
};

export const getHotel = async id => {
  try {
    return await apiClient.get(`/hotel/getHotel/${id}`);
  } catch (e) {
    return handleError(e);
  }
};

export const updateHotel = async (id, data) => {
  try {
    return await apiClient.put(`/hotel/updateHotel/${id}`, data);
  } catch (e) {
    return handleError(e);
  }
};

export const deleteHotel = async id => {
  try {
    return await apiClient.delete(`/hotel/deleteHotel/${id}`);
  } catch (e) {
    return handleError(e);
  }
};

// ── Rooms ──────────────────────────────────────────────────────────────────────
export const createRoom = async data => {
  try {
    return await apiClient.post('/room/createRoom', data);
  } catch (e) {
    return handleError(e);
  }
};

export const getRooms = async () => {
  try {
    return await apiClient.get('/room/getRooms');
  } catch (e) {
    return handleError(e);
  }
};

export const getRoom = async id => {
  try {
    return await apiClient.get(`/room/getRoom/${id}`);
  } catch (e) {
    return handleError(e);
  }
};

export const updateRoom = async (id, data) => {
  try {
    return await apiClient.put(`/room/updateRoom/${id}`, data);
  } catch (e) {
    return handleError(e);
  }
};

export const deleteRoom = async id => {
  try {
    return await apiClient.delete(`/room/deleteRoom/${id}`);
  } catch (e) {
    return handleError(e);
  }
};

export const getRoomsByHotel = async hotelId => {
  try {
    return await apiClient.get(`/room/getRoomsByHotel/${hotelId}`);
  } catch (e) {
    return handleError(e);
  }
};

// ── Events ─────────────────────────────────────────────────────────────────────
export const createEvent = async data => {
  try {
    return await apiClient.post('/events/createEvent', data);
  } catch (e) {
    return handleError(e);
  }
};

export const getEvents = async () => {
  try {
    return await apiClient.get('/events/getEvents');
  } catch (e) {
    return handleError(e);
  }
};

export const getEvent = async id => {
  try {
    return await apiClient.get(`/events/getEvent/${id}`);
  } catch (e) {
    return handleError(e);
  }
};

export const updateEvent = async (id, data) => {
  try {
    return await apiClient.put(`/events/updateEvent/${id}`, data);
  } catch (e) {
    return handleError(e);
  }
};

export const deleteEvent = async id => {
  try {
    return await apiClient.delete(`/events/deleteEvent/${id}`);
  } catch (e) {
    return handleError(e);
  }
};

// ── Reservations ────────────────────────────────────────────────────────────────
export const createReservation = async data => {
  try {
    return await apiClient.post('/reservation/createReservation', data);
  } catch (e) {
    return handleError(e);
  }
};

export const getReservations = async () => {
  try {
    return await apiClient.get('/reservation/getReservations');
  } catch (e) {
    return handleError(e);
  }
};

export const getReservation = async id => {
  try {
    return await apiClient.get(`/reservation/getReservation/${id}`);
  } catch (e) {
    return handleError(e);
  }
};

export const updateReservation = async (id, data) => {
  try {
    return await apiClient.put(`/reservation/updateReservation/${id}`, data);
  } catch (e) {
    return handleError(e);
  }
};

export const deleteReservation = async id => {
  try {
    return await apiClient.delete(`/reservation/deleteReservation/${id}`);
  } catch (e) {
    return handleError(e);
  }
};
