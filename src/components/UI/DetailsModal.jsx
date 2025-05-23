import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './css/DetailsModal.css';

export const DetailsModal = ({ show, onHide, item, type }) => {
  const navigate = useNavigate();

  const handleReserve = () => {
    navigate('/auth');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" dialogClassName="modal-luxury">
      {item && (
        <>
          <Modal.Header closeButton>
            <Modal.Title>{item.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {type === 'event' ? (
              <ul className="modal__list">
                <li><strong>Hotel:</strong> {item.hotel.name}</li>
                <li><strong>Ubicación:</strong> {item.hotel.location}</li>
                <li><strong>Inicio:</strong> {new Date(item.startDate).toLocaleString()}</li>
                <li><strong>Fin:</strong> {new Date(item.endDate).toLocaleString()}</li>
                <li><strong>Recursos:</strong> {item.resources.join(', ') || 'Ninguno'}</li>
              </ul>
            ) : (
              <div className="d-flex flex-wrap">
                <img
                  src={item.images?.[0] || '/stock-placeholder.jpg'}
                  alt={item.name}
                  className="img-fluid me-3 mb-3 details-img"
                />
                <div>
                  <p><strong>Ubicación:</strong> {item.location}</p>
                  <p><strong>Calificación:</strong> {item.rating} ★</p>
                  <p><strong>Precio:</strong> ${item.price} USD / noche</p>
                  <h6 className="text-gold">Amenidades</h6>
                  <ul>{item.amenities.map(a => <li key={a}>{a}</li>)}</ul>
                </div>
              </div>
            )}
            <p className="mt-3">{item.description}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={onHide}>Cerrar</Button>
            {type === 'hotel' && <Button variant="gold" onClick={handleReserve}>Reservar Ahora</Button>}
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

DetailsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  item: PropTypes.object,
  type: PropTypes.oneOf(['hotel', 'event']).isRequired,
};

DetailsModal.defaultProps = {
  item: null,
};
