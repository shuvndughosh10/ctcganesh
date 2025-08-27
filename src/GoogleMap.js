import React, { useEffect, useRef, useState } from 'react';

const GoogleMap = ({ photos, onMarkerClick, selectedPhoto }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Initialize Google Map
    if (window.google && mapRef.current && !map) {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 20.4625, lng: 85.8828 }, // Cuttack city center coordinates
        zoom: 14,
        mapTypeId: 'roadmap',
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        streetViewControl: true,
        rotateControl: true,
        fullscreenControl: true,
        styles: [
          // Enhanced dark theme for better visibility
          { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
          {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1F51FF", weight: 1 }]
          },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#1F51FF" }]
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#cccccc" }]
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3c" }]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }]
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }]
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }]
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }]
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }]
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }]
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }]
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }]
          }
        ]
      });
      setMap(mapInstance);
    }
  }, [map]);

  useEffect(() => {
    // Add markers for each photo
    if (map && photos.length > 0) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));

      const newMarkers = photos.map((photo, index) => {
        const isSelected = selectedPhoto && selectedPhoto.id === photo.id;
        const markerSize = isSelected ? 50 : 40;
        const markerColor = isSelected ? '#FF10F0' : '#1F51FF';
        const strokeColor = isSelected ? '#FFD700' : '#FF10F0';
        
        const marker = new window.google.maps.Marker({
          position: photo.coordinates,
          map: map,
          title: photo.title,
          animation: isSelected ? window.google.maps.Animation.BOUNCE : null,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="${markerSize}" height="${markerSize}" viewBox="0 0 ${markerSize} ${markerSize}" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                <circle cx="${markerSize/2}" cy="${markerSize/2}" r="${markerSize/2 - 3}" fill="${markerColor}" stroke="${strokeColor}" stroke-width="3" filter="url(#glow)"/>
                <circle cx="${markerSize/2}" cy="${markerSize/2}" r="${markerSize/4}" fill="#ffffff"/>
                <text x="${markerSize/2}" y="${markerSize/2 + 4}" text-anchor="middle" fill="${markerColor}" font-size="${markerSize > 40 ? '14' : '12'}" font-weight="bold">${index + 1}</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(markerSize, markerSize),
            anchor: new window.google.maps.Point(markerSize/2, markerSize/2)
          }
        });

        // Create enhanced info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="
              background: linear-gradient(135deg, #111111 0%, #1a1a2e 100%);
              color: #ffffff;
              max-width: 250px;
              border-radius: 12px;
              padding: 16px;
              border: 2px solid #1F51FF;
              box-shadow: 0 0 20px rgba(31, 81, 255, 0.3);
            ">
              <img src="${photo.img}" alt="${photo.title}" 
                   style="width: 100%; height: 140px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; border: 1px solid rgba(31, 81, 255, 0.3);">
              <h3 style="margin: 0 0 8px 0; color: #1F51FF; font-size: 16px; font-weight: 600;">
                🕉️ ${photo.title}
              </h3>
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #cccccc; display: flex; align-items: center; gap: 4px;">
                📍 ${photo.location}
              </p>
              <p style="margin: 0; font-size: 12px; color: #999999; line-height: 1.4;">
                ${photo.description}
              </p>
              <div style="margin-top: 12px; text-align: center;">
                <span style="background: linear-gradient(45deg, #1F51FF, #FF10F0); color: white; padding: 4px 12px; border-radius: 15px; font-size: 11px; font-weight: 600;">
                  Location ${index + 1}
                </span>
              </div>
            </div>
          `,
          pixelOffset: new window.google.maps.Size(0, -10)
        });

        marker.addListener('click', () => {
          // Close all other info windows
          markers.forEach(m => m.infoWindow && m.infoWindow.close());
          
          infoWindow.open(map, marker);
          onMarkerClick && onMarkerClick(photo);
        });

        // Add hover effects
        marker.addListener('mouseover', () => {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
        });

        marker.addListener('mouseout', () => {
          if (!isSelected) {
            marker.setAnimation(null);
          }
        });

        marker.infoWindow = infoWindow;

        // Auto-open info window for selected photo
        if (isSelected) {
          infoWindow.open(map, marker);
          map.panTo(photo.coordinates);
          map.setZoom(16);
        }

        return marker;
      });

      // Add Cuttack city center marker
      const cityMarker = new window.google.maps.Marker({
        position: { lat: 20.4625, lng: 85.8828 },
        map: map,
        title: "Cuttack City Center",
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="cityGlow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <circle cx="30" cy="30" r="25" fill="rgba(255, 215, 0, 0.2)" stroke="#FFD700" stroke-width="3" stroke-dasharray="5,5" filter="url(#cityGlow)"/>
              <text x="30" y="25" text-anchor="middle" fill="#FFD700" font-size="16" font-weight="bold">🏛️</text>
              <text x="30" y="40" text-anchor="middle" fill="#FFD700" font-size="8" font-weight="bold">CUTTACK</text>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(60, 60),
          anchor: new window.google.maps.Point(30, 30)
        }
      });

      const cityInfoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="
            background: linear-gradient(135deg, #111111 0%, #1a1a2e 100%);
            color: #ffffff;
            max-width: 200px;
            border-radius: 12px;
            padding: 16px;
            border: 2px solid #FFD700;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
            text-align: center;
          ">
            <h3 style="margin: 0 0 8px 0; color: #FFD700; font-size: 18px; font-weight: 600;">
              🏛️ Cuttack City Center
            </h3>
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #cccccc;">
              Historic city in Odisha, India
            </p>
            <p style="margin: 0; font-size: 12px; color: #999999; line-height: 1.4;">
              Famous for silver filigree work, festivals, and rich cultural heritage
            </p>
          </div>
        `
      });

      cityMarker.addListener('click', () => {
        cityInfoWindow.open(map, cityMarker);
      });

      newMarkers.push(cityMarker);
      setMarkers(newMarkers);
    }
  }, [map, photos, selectedPhoto, onMarkerClick]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        borderRadius: '15px',
        overflow: 'hidden'
      }} 
    />
  );
};

export default GoogleMap;