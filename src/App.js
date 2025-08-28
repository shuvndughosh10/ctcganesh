import React, { useMemo, useState, useEffect } from 'react';
import { Search, MapPin, Download, Share2, X, ChevronLeft, ChevronRight, Moon, Sun, Play, Pause } from 'lucide-react';
import { photos } from './data';
// import OpenStreetMap from './OpenStreetMap';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isGoldTheme, setIsGoldTheme] = useState(false);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const filteredPhotos = useMemo(() => {
    return photos.filter(photo => {
      const matchesSearch = photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  // Slideshow functionality
  useEffect(() => {
    if (isSlideshow && selectedPhoto) {
      const interval = setInterval(() => {
        setCurrentSlideIndex(prev => (prev + 1) % filteredPhotos.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isSlideshow, selectedPhoto, filteredPhotos.length]);

  useEffect(() => {
    if (selectedPhoto) {
      const photoIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
      setCurrentSlideIndex(photoIndex);
    }
  }, [selectedPhoto, filteredPhotos]);

  const openLightbox = (photo) => {
    setSelectedPhoto(photo);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
    setIsSlideshow(false);
    document.body.style.overflow = 'unset';
  };

  const navigatePhoto = (direction) => {
    const currentIndex = filteredPhotos.findIndex(p => p.id === selectedPhoto.id);
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredPhotos.length;
    } else {
      newIndex = currentIndex === 0 ? filteredPhotos.length - 1 : currentIndex - 1;
    }

    setSelectedPhoto(filteredPhotos[newIndex]);
    setCurrentSlideIndex(newIndex);
  };

  const downloadImage = async (imageUrl, filename) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const sharePhoto = (photo) => {
    if (navigator.share) {
      navigator.share({
        title: photo.title,
        text: photo.description,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(`Check out this amazing Ganesh idol: ${photo.title} - ${photo.description}`)}`;
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <div className={`app ${isGoldTheme ? 'gold-theme' : ''}`}>
      <Header
        isGoldTheme={isGoldTheme}
        setIsGoldTheme={setIsGoldTheme}
      />
      <main className="main">
        <div className="container">
          <Controls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Gallery
            photos={filteredPhotos}
            onPhotoClick={openLightbox}
            onDownload={downloadImage}
            onShare={sharePhoto}
          />
          {/* <MapSection
            photos={filteredPhotos}
            selectedPhoto={selectedPhoto}
            onPhotoSelect={openLightbox}
          /> */}
        </div>
      </main>

      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          photos={filteredPhotos}
          currentIndex={currentSlideIndex}
          onClose={closeLightbox}
          onNavigate={navigatePhoto}
          onDownload={downloadImage}
          onShare={sharePhoto}
          isSlideshow={isSlideshow}
          setIsSlideshow={setIsSlideshow}
        />
      )}

      <Footer />
    </div>
  );
}

function Header({ isGoldTheme, setIsGoldTheme }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <h1 className="title glow">Ganesh Gallery</h1>
        <nav className="nav">
          <a href="#home">HOME</a>
          <a href="#gallery">GALLERY</a>
          <a href="#contact">CONTACT</a>
          <button
            className="theme-toggle"
            onClick={() => setIsGoldTheme(!isGoldTheme)}
            title={isGoldTheme ? 'Switch to Neon Theme' : 'Switch to Gold Theme'}
          >
            {isGoldTheme ? <Moon size={16} /> : <Sun size={16} />}
            {isGoldTheme ? 'Neon' : 'Gold'}
          </button>
        </nav>
      </div>
    </header>
  );
}

function Controls({ searchQuery, setSearchQuery }) {
  return (
    <section className="controls">
      <div className="search-container">
        <Search className="search-icon" size={20} />
        <input
          className="search"
          placeholder="Search locations, titles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </section>
  );
}

function Gallery({ photos, onPhotoClick, onDownload, onShare }) {
  if (photos.length === 0) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <h3>No photos found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      </div>
    );
  }

  return (
    <section className="gallery container" id="gallery">
      <div className="gallery-note">
        <div className="note-content">
          <p className="note-text">
            📸 <strong>Note:</strong> These images have been uploaded. Additional photos will be added in the coming days.
          </p>
          {/* <p className="note-text contribution-note">
            🙏 <strong>Contribute:</strong> If you have images of Lord Ganesh from different locations, please send them to our Instagram handle or email us. Contact details are in the contact section below.
          </p> */}
          <div className="last-updated">
            Last updated: August 28, 2025
          </div>
        </div>
      </div>

      {photos.map((photo, index) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          index={index}
          onClick={() => onPhotoClick(photo)}
          onDownload={() => onDownload(photo.img, `${photo.location}-ganesh.jpg`)}
          onShare={() => onShare(photo)}
        />
      ))}
    </section>
  );
}

function PhotoCard({ photo, index, onClick, onDownload, onShare }) {
  return (
    <div
      className="photo-card"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={onClick}
    >
      <div className="img-container">
        <img
          src={photo.img}
          alt={photo.title}
          className="photo-img"
          loading="lazy"
        />
        <div className="card-overlay">
          <div className="card-actions">
            <button
              className="action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              title="Download"
            >
              <Download size={20} />
            </button>
            <button
              className="action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              title="Share"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{photo.title}</h3>
        <div className="card-location">
          <MapPin size={16} />
          {photo.location}
        </div>

      </div>
    </div>
  );
}

function Lightbox({
  photo,
  photos,
  currentIndex,
  onClose,
  onNavigate,
  onDownload,
  onShare,
  isSlideshow,
  setIsSlideshow
}) {
  const currentPhoto = photos[currentIndex] || photo;

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onClose, onNavigate]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>
          <X size={20} />
        </button>

        {photos.length > 1 && (
          <>
            <button className="lightbox-nav lightbox-prev" onClick={() => onNavigate('prev')}>
              <ChevronLeft size={24} />
            </button>
            <button className="lightbox-nav lightbox-next" onClick={() => onNavigate('next')}>
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <img
          src={currentPhoto.img}
          alt={currentPhoto.title}
          className="lightbox-img"
        />

        <div className="lightbox-info">
          <h2 className="lightbox-title">{currentPhoto.title}</h2>
          <div className="card-location" style={{ marginBottom: '1rem' }}>
            <MapPin size={16} />
            {currentPhoto.location}
          </div>
          <p className="lightbox-description">{currentPhoto.description}</p>

          <div className="lightbox-actions">
            {photos.length > 1 && (
              <button
                className="lightbox-btn"
                onClick={() => setIsSlideshow(!isSlideshow)}
              >
                {isSlideshow ? <Pause size={16} /> : <Play size={16} />}
                {isSlideshow ? 'Pause' : 'Slideshow'}
              </button>
            )}
            <button
              className="lightbox-btn"
              onClick={() => onDownload(currentPhoto.img, `${currentPhoto.location}-ganesh.jpg`)}
            >
              <Download size={16} />
              Download
            </button>
            <button
              className="lightbox-btn"
              onClick={() => onShare(currentPhoto)}
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MapSection({ photos, selectedPhoto, onPhotoSelect }) {
  const [mapError, setMapError] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  useEffect(() => {
    // Map loads automatically with Leaflet - no API key needed
    setIsMapLoaded(true);
  }, []);

  return (
    <section className="map-container" id="map">
      <div className="map-header">
        <h3 className="map-title">🗺️ Cuttack City, Odisha - Ganesh Locations</h3>
        <p className="map-subtitle">Interactive Street Map showing {photos.length} beautiful Ganesh idol locations</p>
      </div>

      <div className="street-map">
        {isMapLoaded && !mapError ? (
          <OpenStreetMap
            photos={photos}
            selectedPhoto={selectedPhoto}
            onMarkerClick={onPhotoSelect}
          />
        ) : (
          <div className="map-fallback">
            <div className="fallback-content">
              <MapPin size={48} style={{ color: 'var(--neon-blue)' }} />
              <h3>{mapError ? 'Map Error' : 'Loading Street Map...'}</h3>
              <p>
                {mapError
                  ? 'Unable to load the map. Please check your internet connection.'
                  : `Loading interactive street map of Cuttack City with ${photos.length} Ganesh locations`
                }
              </p>
              {!mapError && <div className="spinner"></div>}
            </div>
          </div>
        )}
      </div>

      <div className="map-info">
        <div className="map-legend">
          <h4>🕉️ Festival Locations</h4>
          <div className="legend-items">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={`legend-item ${selectedPhoto?.id === photo.id ? 'selected' : ''}`}
                onClick={() => onPhotoSelect(photo)}
              >
                <div className="legend-marker">{index + 1}</div>
                <span>{photo.location}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="map-controls">
          <p className="map-tip">💡 Click on markers to view photo details</p>
          <p className="map-tip">🔍 Use mouse wheel to zoom in/out</p>
          <p className="map-tip">🖱️ Drag to pan around the map</p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <h2 className="footer-title">Contact Us</h2>
        <div className="contact-info">
          <div className="contact-item">
            <strong>Email:</strong>
            <a href="mailto:akashedits10@gmail.com" className="contact-link">
              akashedits10@gmail.com
            </a>
          </div>
          <div className="contact-item">
            <strong>Instagram:</strong>
            <a href="https://instagram.com/akashedits10" target="_blank" rel="noopener noreferrer" className="contact-link">
              @akashedits10
            </a>
          </div>
          <div className="contact-item">
            <strong>Instagram:</strong>
            <a href="https://instagram.com/the.photographer_10" target="_blank" rel="noopener noreferrer" className="contact-link">
              @the.photographer_10
            </a>
          </div>
          <div className="contact-item">
            <strong>YouTube:</strong>
            <a href="https://youtube.com/@AkashEdits" target="_blank" rel="noopener noreferrer" className="contact-link">
              AkashEdits Youtube
            </a>
          </div>
          <div className="contact-item">
            <strong>Instagram:</strong>
            <a href="https://instagram.com/shuvendughosh10" target="_blank" rel="noopener noreferrer" className="contact-link">
              @shuvendughosh10
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Akash Edits Photography - Shuvendu Ghosh</p>
          <p>Celebrating the divine beauty of Lord Ganesh across the city</p>
        </div>
      </div>
    </footer>
  );
}
