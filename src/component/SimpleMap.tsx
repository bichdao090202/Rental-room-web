import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

// Tọa độ mặc định (ví dụ: Hà Nội)
const center = {
  lat: 21.0285,
  lng: 105.8542
};

const defaultOptions = {
  panControl: true,
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  clickableIcons: true,
  keyboardShortcuts: true,
  scrollwheel: true,
  disableDoubleClickZoom: false,
  fullscreenControl: true,
};

const SimpleMap = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyBwZ0jrJgm3kxGq2dqSs5zY6pCw8jU9j1h">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        options={defaultOptions}
      >
      </GoogleMap>
    </LoadScript>
  );
};

export default SimpleMap;