// src/components/ui/Testimonials.jsx
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import './css/Testimonials.css';

const defaultEntries = [
  {
    text: 'Una experiencia inigualable: espacios de trabajo y descanso fusionados con lujo discreto.',
    author: 'CEO de TechCorp',
  },
  { text: 'Servicio impecable y atención al detalle en cada rincón.', author: 'Fundador de GlobalBank' },
  { text: 'Elegancia y confort unidos para el viajero exigente.', author: 'Directora de Ventas en BigCo' },
];

export const Testimonials = ({ entries = defaultEntries }) => (
  <section className="py-5 text-center testimonials-section">
    <h2 className="mb-4">Lo Dicen Nuestros Clientes</h2>
    <Row xs={1} md={3} className="g-4">
      {entries.map((entry, i) => (
        <Col key={i}>
          <motion.blockquote
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            className="blockquote testimonial-card"
          >
            <p>“{entry.text}”</p>
            <footer className="blockquote-footer">{entry.author}</footer>
          </motion.blockquote>
        </Col>
      ))}
    </Row>
  </section>
);

Testimonials.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
    })
  ),
};

