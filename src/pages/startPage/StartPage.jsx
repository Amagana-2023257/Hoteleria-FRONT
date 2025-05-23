import React, { useState, useCallback, Suspense, lazy, useMemo } from 'react';
import { useGetHotels } from '../../shared/hooks/useGetHotels';
import { useGetEvents } from '../../shared/hooks/useGetEvents';
import { Spinner, Container, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';
import './StartPage.css';
import { NavBar } from '../../components/nav/NavBar';
import { Testimonials } from '../../components/ui/Testimonials';
import { Footer } from '../../components/ui/Footer';

const GalleryCard = lazy(() =>
  import('../../components/ui/GalleryCard').then(module => ({ default: module.GalleryCard }))
);
const DetailsModal = lazy(() =>
  import('../../components/ui/DetailsModal').then(module => ({ default: module.DetailsModal }))
);

const slogans = [
  'Donde el éxito descansa.',
  'Lujo que inspira grandes negocios.',
  'Tu refugio ejecutivo te espera.',
];

const HeroSection = React.memo(({ slogan, onDiscover }) => (
  <motion.section
    className="py-5 text-center bg-dark text-light"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <h1 className="display-4 mb-3">Excelencia y Confort</h1>
    <p className="lead mb-4">{slogan}</p>
    <Button variant="outline-light" size="lg" onClick={onDiscover}>
      Descubre Nuestros Eventos
    </Button>
  </motion.section>
));

HeroSection.propTypes = {
  slogan: PropTypes.string.isRequired,
  onDiscover: PropTypes.func.isRequired,
};

export const StartPage = () => {
  const { hotels, isLoading: loadingHotels, error: errorHotels } = useGetHotels();
  const { events, isLoading: loadingEvents, error: errorEvents } = useGetEvents();

  const [activeItem, setActiveItem] = useState({ type: null, data: null });

  const randomSlogan = useMemo(() => slogans[Math.floor(Math.random() * slogans.length)], []);

  const handleClick = useCallback((item, type) => setActiveItem({ type, data: item }), []);
  const handleClose = useCallback(() => setActiveItem({ type: null, data: null }), []);
  const scrollToSection = useCallback(id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), []);

  return (
    <>
      <NavBar />
      <HeroSection slogan={randomSlogan} onDiscover={() => scrollToSection('events')} />

      <Container className="py-5">
        <Section
          id="events"
          title="Eventos Exclusivos"
          isLoading={loadingEvents}
          error={errorEvents}
          items={events}
          type="event"
          onItemClick={handleClick}
        />

        <Section
          id="hotels"
          title="Destinos de Ensueño"
          isLoading={loadingHotels}
          error={errorHotels}
          items={hotels}
          type="hotel"
          onItemClick={handleClick}
        />

        <Testimonials />
      </Container>

      {activeItem.data && (
        <Suspense fallback={<Spinner animation="border" />}>
          <DetailsModal show onHide={handleClose} item={activeItem.data} type={activeItem.type} />
        </Suspense>
      )}

      <Footer />
    </>
  );
};

const Section = ({ id, title, isLoading, error, items, type, onItemClick }) => (
  <section id={id} className="mb-5">
    <h2 className="mb-4">{title}</h2>
    {isLoading ? (
      <div className="text-center py-5"><Spinner animation="border" /></div>
    ) : error ? (
      <p className="text-danger">{error.message}</p>
    ) : (
      <Row xs={1} md={3} className="g-4">
        {items.map(item => (
          <Col key={item._id}>
            <div onClick={() => onItemClick(item, type)} role="button" tabIndex={0} className="gallery__item">
              {type === 'event' ? (
                <motion.div
                  className="event-card"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 80 }}
                >
                  <FaCalendarAlt size={48} className="event-card__icon mb-2 text-primary" />
                  <h5 className="overlay__title">{item.name}</h5>
                  <p className="small text-muted">{new Date(item.startDate).toLocaleDateString()}</p>
                </motion.div>
              ) : (
                <Suspense fallback={<Spinner animation="grow" size="sm" />}>
                  <GalleryCard item={item} type={type} onClick={() => onItemClick(item, type)} />
                </Suspense>
              )}
            </div>
          </Col>
        ))}
      </Row>
    )}
  </section>
);

Section.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object,
  items: PropTypes.array.isRequired,
  type: PropTypes.oneOf(['hotel', 'event']).isRequired,
  onItemClick: PropTypes.func.isRequired,
};
Section.defaultProps = { error: null };

export default StartPage;
