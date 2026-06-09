import React, { useState } from 'react';
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader
} from '@react-google-maps/api';
import { FiMapPin, FiPhone, FiMail, FiClock, FiNavigation, FiCopy, FiCheck, FiMap, FiCalendar } from 'react-icons/fi';
import { FaParking, FaAccessibleIcon, FaMoneyBillWave } from 'react-icons/fa';
import styles from './Direccion.module.css';

const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 12.384101,
  lng: -85.516983
};

const Direccion = () => {
  const [copied, setCopied] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  });

  const storeLocation = {
    lat: 12.384101,
    lng: -85.516983,
    address: "12°23'02.8\"N 85°31'01.1\"W",
    fullAddress: "De la medalla milagrosa 3 cuadras al este, 20 metros al norte, Camoapa, Nicaragua"
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${storeLocation.lat},${storeLocation.lng}`;
  const wazeUrl = `https://www.waze.com/ul?ll=${storeLocation.lat},${storeLocation.lng}&navigate=yes`;
  
  const copyAddress = () => {
    navigator.clipboard.writeText(storeLocation.fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Map render - YOUR EXACT WORKING CODE
  const renderMap = () => {
    if (loadError) {
      return (
        <div>
          Error loading Google Maps
          <br />
          Check your API key and browser console.
        </div>
      );
    }

    if (!isLoaded) {
      return <div>Loading map...</div>;
    }

    return (
      <div style={{ width: '100%', height: '500px' }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={17}
        >
          <Marker
            position={center}
            title="Bordados Sacuanjoche"
            onLoad={() => console.log('Marker loaded')}
            onClick={() => setSelectedMarker(true)}
          />

          {selectedMarker && (
            <InfoWindow
              position={center}
              onCloseClick={() => setSelectedMarker(false)}
            >
              <div>
                <h3>Bordados Sacuanjoche</h3>
                <p>
                  De la medalla milagrosa 3 cuadras al este,
                  20 metros al norte, Camoapa, Nicaragua
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    );
  };

  return (
    <section className={styles.direccion}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>¡Los Esperamos!</h1>
          <p className={styles.subtitle}>
            Visítanos en nuestra tienda física o contáctanos a través de nuestros canales digitales
          </p>
        </div>

        <div className={styles.grid}>
          {/* Contact Information Card */}
          <div className={styles.infoCard}>
            <h2 className={styles.cardTitle}>Información de Contacto</h2>
            
            <div className={styles.infoSection}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiMapPin size={24} />
                </div>
                <div className={styles.infoContent}>
                  <h3>Dirección</h3>
                  <p>{storeLocation.fullAddress}</p>
                  <p className={styles.coordinates}>{storeLocation.address}</p>
                  <button onClick={copyAddress} className={styles.copyBtn}>
                    {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                    {copied ? '¡Copiado!' : 'Copiar dirección'}
                  </button>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiPhone size={24} />
                </div>
                <div className={styles.infoContent}>
                  <h3>Teléfono</h3>
                  <p>+505 8719 2899</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiMail size={24} />
                </div>
                <div className={styles.infoContent}>
                  <h3>Correo Electrónico</h3>
                  <p>sacuanjochepeleteria@gmail.com</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <FiClock size={24} />
                </div>
                <div className={styles.infoContent}>
                  <h3>Horarios de Atención</h3>
                  <div className={styles.schedule}>
                    <div className={styles.scheduleRow}>
                      <span>
                        <FiCalendar size={14} />
                        Lunes a Viernes:
                        {(() => {
                          const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                          const today = new Date().getDay();
                          const currentDay = days[today];
                          const isCurrentDay = currentDay === 'Lunes' || currentDay === 'Martes' || currentDay === 'Miércoles' || currentDay === 'Jueves' || currentDay === 'Viernes';
                          if (isCurrentDay) {
                            return <span className={styles.currentDayBadge}>Hoy</span>;
                          }
                          return null;
                        })()}
                      </span>
                      <strong>
                        {(() => {
                          const now = new Date();
                          const day = now.getDay();
                          const hour = now.getHours();
                          const minute = now.getMinutes();
                          const isOpen = (day >= 1 && day <= 5 && (hour > 8 || (hour === 8 && minute >= 0)) && (hour < 17 || (hour === 17 && minute === 0)));
                          return isOpen ? <span className={`${styles.scheduleStatus} ${styles.statusOpen}`}></span> : null;
                        })()}
                        8:00 AM - 5:00 PM
                      </strong>
                    </div>
                    <div className={styles.scheduleRow}>
                      <span>
                        <FiCalendar size={14} />
                        Sábados:
                        {(() => {
                          const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                          const today = new Date().getDay();
                          const currentDay = days[today];
                          if (currentDay === 'Sábado') {
                            return <span className={styles.currentDayBadge}>Hoy</span>;
                          }
                          return null;
                        })()}
                      </span>
                      <strong>
                        {(() => {
                          const now = new Date();
                          const day = now.getDay();
                          const hour = now.getHours();
                          const minute = now.getMinutes();
                          const isOpen = (day === 6 && (hour > 8 || (hour === 8 && minute >= 0)) && (hour < 12 || (hour === 12 && minute === 0)));
                          return isOpen ? <span className={`${styles.scheduleStatus} ${styles.statusOpen}`}></span> : null;
                        })()}
                        8:00 AM - 12:00 PM
                      </strong>
                    </div>
                    <div className={styles.scheduleRow}>
                      <span>
                        <FiCalendar size={14} />
                        Domingos:
                        {(() => {
                          const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
                          const today = new Date().getDay();
                          const currentDay = days[today];
                          if (currentDay === 'Domingo') {
                            return <span className={styles.currentDayBadge}>Hoy</span>;
                          }
                          return null;
                        })()}
                      </span>
                      <strong>
                        <span className={`${styles.scheduleStatus} ${styles.statusClosed}`}></span>
                        Cerrado
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.mapCard}>
            <h2 className={styles.cardTitle}>
              <FiMap size={20} style={{ marginRight: '8px' }} />
              Nuestra Ubicación
            </h2>
            {renderMap()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Direccion;