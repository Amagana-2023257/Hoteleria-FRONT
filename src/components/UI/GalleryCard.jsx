import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import './css/GalleryCard.css'; // ajusta estilos aquí

export const GalleryCard = ({ item, type, onClick }) => (
  <motion.div
    className="gallery__item"
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ type: 'spring', stiffness: 80 }}
  >
    <div
      className={`${type}-card`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={e => e.key === 'Enter' && onClick()}
    >
      <img
        src={item.images?.[0] || '/stock-placeholder.jpg'}
        alt={item.name}
        className={`${type}-card__image`}
        loading="lazy"
      />
      <div className="overlay">
        <h5 className="overlay__title">{item.name}</h5>
        {type === 'hotel' && <p className="overlay__subtitle">Desde ${item.price} USD / noche</p>}
      </div>
    </div>
  </motion.div>
);

GalleryCard.propTypes = {
  item: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['hotel', 'event']).isRequired,
  onClick: PropTypes.func.isRequired,
};
