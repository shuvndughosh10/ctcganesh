# Image Setup Instructions

## Steps to set up your 3:4 aspect ratio images:

### 1. Copy Images
Run the `copy-images.bat` file to copy your images from the Downloads folder to the public folder:
```
copy-images.bat
```

### 2. Update Image Paths in data.js
Open `src/data.js` and update the image paths to match your actual filenames. For example:

```javascript
// If your image is named "SheikhBazar.jpg"
img: "./Images/SheikhBazar.jpg"

// If your image is named "stadium_ganesh.jpg"  
img: "./Images/stadium_ganesh.jpg"
```

### 3. Update Location Names
The location names in the data.js file should match your image filenames for consistency. Update both the `title` and `location` fields based on your images.

### 4. Image Requirements
- **Aspect Ratio**: 3:4 (portrait orientation)
- **Format**: JPG, PNG, or WebP
- **Size**: Recommended 800x1067px or similar 3:4 ratio
- **Location**: Place in `public/Images/` folder

### 5. Current Features
- ✅ 3:4 aspect ratio support
- ✅ Map disabled
- ✅ Note added: "These images have been uploaded. Additional photos will be added in the coming days."
- ✅ Last updated date: December 27, 2024
- ✅ Neon theme styling
- ✅ Search functionality
- ✅ Lightbox gallery
- ✅ Social sharing

### 6. Example Data Structure
```javascript
{
  id: 1,
  title: "Sheikh Bazar Ganesh",
  location: "Sheikh Bazar", 
  img: "./Images/SheikhBazar.jpg", // Your actual filename
  coordinates: { lat: 20.4620, lng: 85.8820 },
  description: "Beautiful Ganesh idol at Sheikh Bazar with traditional decorations"
}
```

### 7. Testing
After updating the image paths, run:
```
npm start
```

The gallery will display your images in a beautiful 3:4 aspect ratio grid with neon styling.