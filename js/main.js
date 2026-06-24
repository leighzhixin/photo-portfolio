/* =============================================
   Photography Portfolio — Main Script
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ===================== CONFIG ===================== */
  var slides = [
    { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=85', title: 'Morning Light' },
    { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85', title: 'The Edge' },
    { src: 'https://images.unsplash.com/photo-1470071459604-7b8ec44ffd6b?w=1400&q=85', title: 'Stillness' },
    { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&q=85', title: 'Forest Path' },
    { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1400&q=85', title: 'Canyon' },
    { src: 'https://images.unsplash.com/photo-1518173946687-a36f968f7e3b?w=1400&q=85', title: 'Golden Hour' },
    { src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1400&q=85', title: 'Urban Lines' },
    { src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1400&q=85', title: 'Horizon' },
    { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1400&q=85', title: 'Night Sky' },
    { src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1400&q=85', title: 'Urban Flow' }
  ];

  /* ===================== SIDEBAR TOGGLE (Mobile) ===================== */
  var sidebar = document.getElementById('sidebar');
  var navToggle = document.getElementById('navToggle');
  var navOverlay = document.getElementById('navOverlay');

  if (navToggle && sidebar && navOverlay) {
    function openNav() {
      sidebar.classList.add('open');
      navOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeNav() {
      sidebar.classList.remove('open');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      sidebar.classList.contains('open') ? closeNav() : openNav();
    });
    navOverlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) closeNav();
    });
  }

  /* ===================== FULL-SCREEN CAROUSEL ===================== */
  var carouselEl = document.getElementById('homeCarousel');
  if (carouselEl) {
    var imgA = document.getElementById('carouselImgA');
    var imgB = document.getElementById('carouselImgB');
    var btnPrev = document.getElementById('carouselPrev');
    var btnNext = document.getElementById('carouselNext');
    var dotsContainer = document.getElementById('carouselDots');
    var stage = document.getElementById('carouselStage');

    if (imgA && imgB && slides.length > 0) {
      var n = slides.length;
      var current = 0;
      var isActiveA = true;
      var isCrossfading = false;
      var paused = false;
      var waitTimer = null;
      var crossTimer = null;
      var resumeTimer = null;

      // Preload all images for smooth transitions
      for (var i = 0; i < n; i++) {
        var pre = new Image();
        pre.src = slides[i].src;
      }

      // Init: set first slide visible, preload second into hidden img
      imgA.src = slides[0].src;
      imgA.alt = slides[0].title;
      imgB.src = slides[1 % n].src;
      imgB.alt = slides[1 % n].title;

      // Build dots
      if (dotsContainer) {
        for (var d = 0; d < n; d++) {
          var dot = document.createElement('span');
          dot.className = 'carousel-dot' + (d === 0 ? ' active' : '');
          dot.dataset.index = d;
          dot.addEventListener('click', function () {
            var idx = parseInt(this.dataset.index, 10);
            if (idx !== current && !isCrossfading) {
              paused = false;
              crossfadeTo(idx);
            }
          });
          dotsContainer.appendChild(dot);
        }
      }

      function updateDots() {
        if (!dotsContainer) return;
        var allDots = dotsContainer.querySelectorAll('.carousel-dot');
        for (var i = 0; i < allDots.length; i++) {
          allDots[i].className = 'carousel-dot' + (i === current ? ' active' : '');
        }
      }

      function schedule() {
        clearTimeout(waitTimer);
        waitTimer = null;
        if (paused) return;
        waitTimer = setTimeout(function () {
          waitTimer = null;
          if (!paused) crossfadeTo((current + 1) % n);
        }, 6000);
      }

      function crossfadeTo(next) {
        if (next === current || isCrossfading || next < 0 || next >= n) return;
        clearTimeout(waitTimer);
        waitTimer = null;
        isCrossfading = true;
        if (btnPrev) btnPrev.disabled = true;
        if (btnNext) btnNext.disabled = true;

        var active = isActiveA ? imgA : imgB;
        var incoming = isActiveA ? imgB : imgA;

        // Set incoming image (already preloaded)
        incoming.src = slides[next].src;
        incoming.alt = slides[next].title;

        // Crossfade using CSS transitions
        active.className = 'active fade';
        incoming.className = 'inactive fade';

        // Force layout then trigger
        void incoming.offsetWidth;  // Force reflow

        active.style.zIndex = '2';
        incoming.style.zIndex = '1';

        // Start: fade out active, fade in incoming
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            active.style.opacity = '0';
            incoming.style.opacity = '1';
          });
        });

        clearTimeout(crossTimer);
        crossTimer = setTimeout(function () {
          crossTimer = null;
          isCrossfading = false;
          current = next;
          isActiveA = !isActiveA;

          // Clean up: hidden image becomes preload buffer
          var hidden = isActiveA ? imgB : imgA;
          var prepIdx = (current + 1) % n;
          hidden.src = slides[prepIdx].src;
          hidden.alt = slides[prepIdx].title;
          hidden.style.opacity = '0';
          hidden.style.zIndex = '0';
          hidden.className = 'inactive';

          active.style.zIndex = '0';
          active.className = 'active';

          updateDots();
          if (btnPrev) btnPrev.disabled = false;
          if (btnNext) btnNext.disabled = false;
          if (!paused) schedule();
        }, 1300);
      }

      // Manual navigation
      if (btnPrev) {
        btnPrev.addEventListener('click', function () {
          paused = false;
          crossfadeTo((current - 1 + n) % n);
        });
      }
      if (btnNext) {
        btnNext.addEventListener('click', function () {
          paused = false;
          crossfadeTo((current + 1) % n);
        });
      }

      // Keyboard
      window.addEventListener('keydown', function (e) {
        if (e.defaultPrevented) return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        if (!carouselEl.contains(e.target) && e.target !== document.body) return;
        e.preventDefault();
        paused = false;
        if (e.key === 'ArrowLeft') crossfadeTo((current - 1 + n) % n);
        else crossfadeTo((current + 1) % n);
      });

      // Touch swipe
      (function () {
        var tx = 0;
        stage.addEventListener('touchstart', function (e) {
          if (!e.touches || !e.touches[0]) return;
          tx = e.touches[0].clientX;
        }, { passive: true });
        stage.addEventListener('touchend', function (e) {
          if (!e.changedTouches || !e.changedTouches[0]) return;
          var dx = e.changedTouches[0].clientX - tx;
          if (Math.abs(dx) < 48) return;
          paused = false;
          if (dx < 0) crossfadeTo((current + 1) % n);
          else crossfadeTo((current - 1 + n) % n);
        }, { passive: true });
      })();

      // Pause on hover (desktop)
      carouselEl.addEventListener('mouseenter', function () {
        paused = true;
        clearTimeout(waitTimer);
        waitTimer = null;
        clearTimeout(resumeTimer);
        resumeTimer = null;
      });
      carouselEl.addEventListener('mouseleave', function () {
        clearTimeout(resumeTimer);
        resumeTimer = null;
        resumeTimer = setTimeout(function () {
          resumeTimer = null;
          paused = false;
          if (!isCrossfading) schedule();
        }, 2500);
      });

      // Start
      schedule();
    }
  }

  /* ===================== FADE-IN ON SCROLL ===================== */
  function checkFadeIn() {
    var elements = document.querySelectorAll('.fade-in:not(.visible)');
    elements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var wh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < wh - 60) el.classList.add('visible');
    });
  }
  setTimeout(checkFadeIn, 100);
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
      if (!name || !email || !message) {
        alert('Please fill in all fields.');
        return;
      }
      alert('Thank you for your message, ' + name + '! I\'ll get back to you soon.');
      contactForm.reset();
    });
  }

  /* ===================== IMAGE PROTECTION ===================== */
  document.addEventListener('contextmenu', function (e) {
    if (e.target.classList && e.target.classList.contains('protected-img')) e.preventDefault();
  });
  document.addEventListener('dragstart', function (e) {
    if (e.target.classList && e.target.classList.contains('protected-img')) e.preventDefault();
  });

});

  /* ===================== SUB-MENU TOGGLE (Project) ===================== */
  var toggle = document.querySelector('.sub-menu-toggle');
  var subMenu = document.getElementById('subMenuProject');
  if (toggle && subMenu) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      subMenu.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!subMenu.contains(e.target) && !toggle.contains(e.target)) {
        subMenu.classList.remove('open');
      }
    });
  }

  /* ===================== SUB-MENU ACTIVE STATE ===================== */
  if (subMenu) {
    var links = subMenu.querySelectorAll('a');
    var page = window.location.pathname.split('/').pop();
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === '/' + page) a.classList.add('active');
    });
  }
