# Ganesh Photo Gallery (React)

A responsive photo gallery inspired by your Cuttack Ganesh Puja page.

## Run locally
```bash
npm install
npm start
```

## Replace images
- Put your photos in `public/photos/` and update `src/data.js` like:
```js
{ id: 13, title: "New Location", img: "/photos/new-location.jpg" }
```
(Using `/photos/...` paths ensures they're served from the `public` folder.)

## Design notes
- Black header with glowing **Photo Gallery** title and simple nav.
- Gold gradient background with a soft radial watermark.
- Grid of image cards; white caption bar with bold black text.
- Sticky footer with credits.
