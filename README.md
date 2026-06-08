# Lei Zhixin — Photography Portfolio

Personal photography portfolio website. Minimal, clean design inspired by [cargocollective.com/zheis](https://cargocollective.com/zheis) and [sevenliang.com](https://www.sevenliang.com/).

Built with vanilla HTML, CSS, and JavaScript. Deployed on Vercel.

## Features

- Minimal, responsive design
- Photo grid gallery with lightbox viewer
- Works/Projects showcase
- About page (bilingual EN/ZH)
- Contact form
- Image protection (disables right-click/drag on photos)
- Mobile-friendly with slide-out navigation

## Getting Started

1. **Replace placeholder images** — edit `js/main.js` to add your own photos to the gallery array:
   ```js
   { src: 'images/your-photo.jpg', title: 'Photo Title', year: '2026' }
   ```

2. **Update personal info** — edit `about.html` with your own biography and `contact.html` with your contact details.

3. **Update social links** — edit the sidebar in each HTML file to point to your Instagram, email, etc.

4. **Deploy your own**:
   - Push to GitHub
   - Import repo in Vercel
   - Done!

## Structure

```
├── index.html          # Home page — hero + photo grid
├── works.html          # Works / Projects gallery
├── about.html          # About page
├── contact.html        # Contact page
├── css/
│   └── style.css       # Styles
├── js/
│   └── main.js         # Gallery data, lightbox, interactions
├── images/             # Your photos go here
├── vercel.json         # Vercel config
└── README.md           # This file
```

## Tech

- HTML5 / CSS3 / JavaScript (vanilla)
- Google Fonts: Inter + Noto Sans SC
- Placeholder images from Unsplash
- Hosted on Vercel
