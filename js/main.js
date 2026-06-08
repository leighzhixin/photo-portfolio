/* =============================================
   Minimal Photography Portfolio — Main Script
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ===================== CONFIG ===================== */
  // Gallery images for the homepage grid
  // Replace these URLs with your own photos
  var galleryImages = [
    { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', title: 'Morning Light', year: '2026' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', title: 'The Edge', year: '2026' },
    { src: 'https://images.unsplash.com/photo-1470071459604-7b8ec44ffd6b?w=600&q=80', title: 'Stillness', year: '2025' },
    { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', title: 'Forest Path', year: '2025' },
    { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80', title: 'Canyon', year: '2025' },
    { src: 'https://images.unsplash.com/photo-1518173946687-a36f968f7e3b?w=600&q=80', title: 'Golden Hour', year: '2025' },
    { src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80', title: 'Urban Lines', year: '2024' },
    { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80', title: 'Horizon', year: '2024' },
    { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80', title: 'Night Sky', year: '2024' },
    { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80', title: 'Urban Flow', year: '2024' },
    { src: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=600&q=80', title: 'Reflection', year: '2023' },
    { src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80', title: 'Open Field', year: '2023' }
  ];

  /* ===================== SIDEBAR TOGGLE (Mobile) ===================== */
  var sidebar = document.getElementById('sidebar');
  var navToggle = document.getElementById('navToggle');
  var navOverlay = document.getElementById('navOverlay');

  if (navToggle && sidebar && navOverlay) {
    function openNav() {
      sidebar.classList.add('open');
      navOverlay.classList.add('active');
    }
    function closeNav() {
      sidebar.classList.remove('open');
      navOverlay.classList.remove('active');
    }
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (sidebar.classList.contains('open')) {
        closeNav();
      } else {
        openNav();
      }
    });
    navOverlay.addEventListener('click', closeNav);

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeNav();
      }
    });
  }

  /* ===================== PHOTO GRID (Homepage) ===================== */
  var grid = document.getElementById('photoGrid');
  if (grid) {
    galleryImages.forEach(function (img, index) {
      var item = document.createElement('div');
      item.className = 'photo-item fade-in';

      var imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.title;
      imgEl.loading = 'lazy';
      imgEl.className = 'protected-img';
      imgEl.dataset.index = index;

      var info = document.createElement('div');
      info.className = 'photo-item-info';
      info.innerHTML = '<div class="photo-item-title">' + img.title + '</div>' +
                       '<div class="photo-item-year">' + img.year + '</div>';

      item.appendChild(imgEl);
      item.appendChild(info);
      grid.appendChild(item);
    });
  }

  /* ===================== LIGHTBOX ===================== */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var currentIndex = -1;

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    var item = galleryImages[index];
    if (!item) return;
    currentIndex = index;
    // Use higher resolution for lightbox
    lightboxImg.src = item.src.replace('w=600', 'w=1200');
    lightboxImg.alt = item.title;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    currentIndex = -1;
  }

  function navigateLightbox(direction) {
    if (currentIndex < 0) return;
    var next = currentIndex + direction;
    if (next < 0) next = galleryImages.length - 1;
    if (next >= galleryImages.length) next = 0;
    openLightbox(next);
  }

  // Click on photo grid items to open lightbox
  if (grid) {
    grid.addEventListener('click', function (e) {
      var img = e.target.closest('.photo-item img');
      if (img && img.dataset.index !== undefined) {
        openLightbox(parseInt(img.dataset.index, 10));
      }
    });
  }

  // Lightbox controls
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', function () { navigateLightbox(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', function () { navigateLightbox(1); });

  // Close lightbox on overlay click (click outside image)
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target === lightboxImg) {
        // Only close if clicking the background, not the image
        if (e.target === lightbox) closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  /* ===================== FADE-IN ON SCROLL ===================== */
  function checkFadeIn() {
    var elements = document.querySelectorAll('.fade-in:not(.visible)');
    elements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < windowHeight - 60) {
        el.classList.add('visible');
      }
    });
  }

  // Initial check
  setTimeout(checkFadeIn, 100);

  // Check on scroll
  var scrollTimeout;
  window.addEventListener('scroll', function () {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkFadeIn, 50);
  });

  /* ===================== CONTACT FORM ===================== */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('formName').value.trim();
      var email = document.getElementById('formEmail').value.trim();
      var message = document.getElementById('formMessage').value.trim();

      // Simple client-side validation
      if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
      }

      // For now, show a success message
      // Replace this with actual form handling (e.g., Formspree, EmailJS)
      alert('Thank you for your message, ' + name + '! I\'ll get back to you soon.');
      contactForm.reset();
    });
  }

  /* ===================== IMAGE PROTECTION ===================== */
  // Disable right-click on protected images
  document.addEventListener('contextmenu', function (e) {
    var target = e.target;
    if (target.classList && target.classList.contains('protected-img')) {
      e.preventDefault();
    }
  });

  // Disable drag on protected images
  document.addEventListener('dragstart', function (e) {
    if (e.target.classList && e.target.classList.contains('protected-img')) {
      e.preventDefault();
    }
  });

  console.log('Photography portfolio loaded.');
});
