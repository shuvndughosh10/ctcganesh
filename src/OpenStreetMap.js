import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix for default markers in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const OpenStreetMap = ({ photos, selectedPhoto, onMarkerClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize the map centered on Cuttack, Odisha
    const map = L.map(mapRef.current, {
      center: [20.4625, 85.8828], // Cuttack city center coordinates
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      touchZoom: true,
      attributionControl: true
    });

    // Add multiple tile layer options for better coverage
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      className: 'map-tiles'
    });

    // Alternative tile servers for better reliability
    const cartoLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
      className: 'map-tiles'
    });

    // Use the street layer by default
    streetLayer.addTo(map);

    // Add custom CSS for neon theme integration
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-container {
        background: #1a1a2e !important;
        font-family: 'Poppins', sans-serif !important;
      }
      .leaflet-control-attribution {
        background: rgba(17, 17, 17, 0.9) !important;
        color: #cccccc !important;
        border: 1px solid rgba(31, 81, 255, 0.3) !important;
        border-radius: 8px !important;
        font-size: 11px !important;
      }
      .leaflet-control-attribution a {
        color: #1F51FF !important;
        text-decoration: none !important;
      }
      .leaflet-control-attribution a:hover {
        color: #FF10F0 !important;
      }
      .leaflet-control-zoom {
        border: 1px solid rgba(31, 81, 255, 0.3) !important;
        border-radius: 8px !important;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(31, 81, 255, 0.2) !important;
      }
      .leaflet-control-zoom a {
        background: rgba(17, 17, 17, 0.9) !important;
        color: #1F51FF !important;
        border: none !important;
        border-bottom: 1px solid rgba(31, 81, 255, 0.3) !important;
        width: 30px !important;
        height: 30px !important;
        line-height: 30px !important;
        font-size: 18px !important;
        font-weight: bold !important;
      }
      .leaflet-control-zoom a:hover {
        background: rgba(31, 81, 255, 0.2) !important;
        color: #FF10F0 !important;
      }
      .leaflet-popup-content-wrapper {
        background: linear-gradient(135deg, #111111 0%, #1a1a2e 100%) !important;
        border: 2px solid #1F51FF !important;
        border-radius: 12px !important;
        box-shadow: 0 0 20px rgba(31, 81, 255, 0.4) !important;
      }
      .leaflet-popup-content {
        color: #ffffff !important;
        margin: 16px !important;
        font-family: 'Poppins', sans-serif !important;
      }
      .leaflet-popup-tip {
        background: #111111 !important;
        border: 2px solid #1F51FF !important;
      }
      .leaflet-popup-close-button {
        color: #FF10F0 !important;
        font-size: 20px !important;
        font-weight: bold !important;
        width: 24px !important;
        height: 24px !important;
        line-height: 20px !important;
      }
      .leaflet-popup-close-button:hover {
        color: #FFD700 !important;
        background: rgba(255, 16, 240, 0.1) !important;
        border-radius: 50% !important;
      }
    `;
    document.head.appendChild(style);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !photos.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Create custom neon marker icon
    const createNeonIcon = (index, isSelected = false) => {
      const size = isSelected ? 40 : 30;
      const color = isSelected ? '#FF10F0' : '#1F51FF';
      const glowColor = isSelected ? '#FFD700' : '#FF10F0';
      
      return L.divIcon({
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border: 3px solid ${glowColor};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${size > 30 ? '14px' : '12px'};
            box-shadow: 0 0 ${size/2}px ${color}80;
            animation: ${isSelected ? 'neonPulse' : 'neonGlow'} 2s infinite;
            position: relative;
          ">
            ${index + 1}
          </div>
          <style>
            @keyframes neonGlow {
              0%, 100% { box-shadow: 0 0 ${size/2}px ${color}80; }
              50% { box-shadow: 0 0 ${size}px ${color}ff, 0 0 ${size*1.5}px ${glowColor}60; }
            }
            @keyframes neonPulse {
              0%, 100% { 
                box-shadow: 0 0 ${size/2}px ${color}80;
                transform: scale(1);
              }
              50% { 
                box-shadow: 0 0 ${size}px ${color}ff, 0 0 ${size*2}px ${glowColor}80;
                transform: scale(1.1);
              }
            }
          </style>
        `,
        className: 'neon-marker',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
        popupAnchor: [0, -size/2]
      });
    };

    // Add markers for each photo
    photos.forEach((photo, index) => {
      const isSelected = selectedPhoto && selectedPhoto.id === photo.id;
      const icon = createNeonIcon(index, isSelected);
      
      const marker = L.marker([photo.coordinates.lat, photo.coordinates.lng], { 
        icon: icon 
      }).addTo(mapInstanceRef.current);

      // Create popup content
      const popupContent = `
        <div style="max-width: 200px;">
          <img src="${photo.img}" alt="${photo.title}" 
               style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;">
          <h3 style="margin: 0 0 4px 0; color: #1F51FF; font-size: 14px; font-weight: 600;">
            ${photo.title}
          </h3>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #cccccc; display: flex; align-items: center; gap: 4px;">
            📍 ${photo.location}
          </p>
          <p style="margin: 0; font-size: 11px; color: #999999; line-height: 1.3;">
            ${photo.description}
          </p>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 250,
        className: 'neon-popup'
      });

      // Add click event
      marker.on('click', () => {
        if (onMarkerClick) {
          onMarkerClick(photo);
        }
      });

      // Auto-open popup for selected photo
      if (isSelected) {
        marker.openPopup();
        mapInstanceRef.current.setView([photo.coordinates.lat, photo.coordinates.lng], 15);
      }

      markersRef.current.push(marker);
    });

    // Add a special marker for Cuttack city center
    const cityIcon = L.divIcon({
      html: `
        <div style="
          width: 50px;
          height: 50px;
          background: rgba(255, 215, 0, 0.2);
          border: 3px dashed #FFD700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFD700;
          font-weight: bold;
          font-size: 10px;
          text-align: center;
          line-height: 1.2;
          animation: cityGlow 3s infinite;
        ">
          🏛️<br>Cuttack<br>Center
        </div>
        <style>
          @keyframes cityGlow {
            0%, 100% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); }
            50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.6); }
          }
        </style>
      `,
      className: 'city-center-marker',
      iconSize: [50, 50],
      iconAnchor: [25, 25]
    });

    const cityMarker = L.marker([20.4625, 85.8828], { icon: cityIcon })
      .addTo(mapInstanceRef.current)
      .bindPopup(`
        <div style="text-align: center;">
          <h3 style="color: #FFD700; margin: 0 0 8px 0;">🏛️ Cuttack City Center</h3>
          <p style="color: #cccccc; margin: 0; font-size: 12px;">
            Historic city in Odisha, India<br>
            Famous for silver filigree work and festivals
          </p>
        </div>
      `);

    markersRef.current.push(cityMarker);

  }, [photos, selectedPhoto, onMarkerClick]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        borderRadius: '15px',
        overflow: 'hidden',
        border: '2px solid rgba(31, 81, 255, 0.3)'
      }} 
    />
  );
};

export default OpenStreetMap;