// src/components/ui/Footer.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './css/Footer.css';

export const Footer = ({ company, year, email, phone }) => (
  <footer className="footer-section py-4">
    <Container className="text-center">
      <p className="mb-1">© {year} {company} · Todos los derechos reservados</p>
      <small>
        <a href={`mailto:${email}`}>{email}</a> · <a href={`tel:${phone}`}>{phone}</a>
      </small>
    </Container>
  </footer>
);

Footer.propTypes = {
  company: PropTypes.string,
  year: PropTypes.number,
  email: PropTypes.string,
  phone: PropTypes.string,
};

Footer.defaultProps = {
  company: 'Luxury Stays',
  year: new Date().getFullYear(),
  email: 'ventas@luxurystays.com',
  phone: '+502 1234 5678',
};
