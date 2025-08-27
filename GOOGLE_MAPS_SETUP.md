# Google Maps Integration Setup Guide

## 🗺️ How to Set Up Google Maps

### Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional, for enhanced features)
4. Go to "Credentials" and create an API key
5. Restrict your API key to your domain for security

### Step 2: Update the Code

Replace `YOUR_GOOGLE_MAPS_API_KEY` in `src/App.js` (MapSection component) with your actual API key:

```javascript
script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places`;
```

### Step 3: Update Photo Locations

In `src/data.js`, update the coordinates for each photo location:

```javascript
coordinates: { lat: YOUR_LATITUDE, lng: YOUR_LONGITUDE }
```

## 📍 How to Get Coordinates for Your Locations

### Method 1: Google Maps (Easy)
1. Go to [Google Maps](https://maps.google.com)
2. Search for your location (e.g., "Sheikh Bazar, Cuttack")
3. Right-click on the exact spot
4. Click on the coordinates that appear
5. Copy the latitude and longitude values

### Method 2: GPS Coordinates
- Use your phone's GPS or any GPS app
- Visit each Ganesh pandal location
- Note down the exact coordinates

### Method 3: Address to Coordinates (Programmatic)
You can use the Google Geocoding API to convert addresses to coordinates:

```javascript
// Example function to get coordinates from address
async function getCoordinates(address) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=YOUR_API_KEY`
  );
  const data = await response.json();
  if (data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  }
  return null;
}
```

## 🎯 Example Location Data Format

```javascript
{
  id: 1,
  title: "Sheikh Bazar Ganesh",
  location: "Sheikh Bazar",
  img: "path/to/your/image.jpg",
  coordinates: { lat: 20.2961, lng: 85.8245 }, // Replace with actual coordinates
  description: "Beautiful Ganesh idol at Sheikh Bazar with traditional decorations"
}
```

## 🖼️ How to Add Your Own Photos

### Option 1: Local Images
1. Create a `public/images` folder
2. Add your photos there
3. Update the `img` field in `data.js`:
```javascript
img: "/images/sheikh-bazar-ganesh.jpg"
```

### Option 2: Cloud Storage (Recommended)
1. Upload images to:
   - Google Drive (make public)
   - Cloudinary
   - Firebase Storage
   - Any image hosting service
2. Use the direct image URLs

### Option 3: Unsplash (Placeholder)
- Current setup uses Unsplash for demo images
- Replace with your actual photos

## 🚀 Features Included

✅ **Interactive Map with Custom Markers**
- Neon-themed markers with numbers
- Click markers to view photo details
- Auto-highlight selected photos

✅ **Info Windows**
- Photo preview on marker click
- Location details
- Smooth animations

✅ **Dark Theme Integration**
- Map matches your neon theme
- Custom styled markers
- Responsive design

✅ **Mobile Friendly**
- Touch-friendly markers
- Responsive map container
- Optimized for all screen sizes

## 🔧 Customization Options

### Change Map Center
Update the center coordinates in `GoogleMap.js`:
```javascript
center: { lat: YOUR_CITY_LAT, lng: YOUR_CITY_LNG }
```

### Modify Marker Style
Edit the marker icon in `GoogleMap.js` to change colors, size, or design.

### Add More Map Features
- Directions between locations
- Clustering for many markers
- Custom map controls
- Street View integration

## 🛡️ Security Best Practices

1. **Restrict API Key**: Limit to your domain only
2. **Set Usage Limits**: Prevent unexpected charges
3. **Monitor Usage**: Check Google Cloud Console regularly
4. **Environment Variables**: Store API key securely (not in code)

## 💡 Pro Tips

- Test with a few locations first
- Use high-quality images (recommended: 800x600px)
- Keep descriptions concise but descriptive
- Consider adding photo timestamps for festival dates
- Add photo credits if using others' images

## 🆘 Troubleshooting

**Map not loading?**
- Check API key is correct
- Verify APIs are enabled in Google Cloud Console
- Check browser console for errors

**Markers not appearing?**
- Verify coordinates are valid
- Check if coordinates are within map bounds
- Ensure photos array has coordinate data

**Images not loading?**
- Check image URLs are accessible
- Verify image paths are correct
- Test image URLs in browser directly