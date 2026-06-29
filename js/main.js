/* =============================================
   Photography Portfolio — Main Script
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ===================== CONFIG ===================== */
    var slides = [
    { src: '/images/home/home-1.jpg' },
    { src: '/images/home/home-2.jpg' },
    { src: '/images/home/home-3.jpg' },
    { src: '/images/home/home-4.jpg' },
    { src: '/images/home/home-5.jpg' },
    { src: '/images/home/home-6.jpg' },
    { src: '/images/home/home-7.jpg' },
    { src: '/images/home/home-8.jpg' },
    { src: '/images/home/home-9.jpg' },
    { src: '/images/home/home-10.jpg' },
    { src: '/images/home/home-11.jpg' }
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

  /* ===================== CAROUSEL (Cross Fade + Ken Burns) ===================== */
  var carouselEl = document.getElementById('homeCarousel');
  if (carouselEl && slides.length > 0) {
    var stage = document.getElementById('carouselStage');
    var dotsContainer = document.getElementById('carouselDots');

    var n = slides.length;
    var current = 0;
    var currentIdx = 0;
    var paused = false;
    var autoTimer = null;
    var resumeTimer = null;
    var imgs = [];

    // Create two overlapping img elements for crossfade
    for (var i = 0; i < 2; i++) {
      var img = document.createElement('img');
      img.className = 'carousel-img' + (i === 0 ? ' active' : ' inactive');
      img.alt = i === 0 ? 'Photo slideshow' : '';
      stage.appendChild(img);
      imgs.push(img);
    }

    // Preload all slides
    slides.forEach(function (s) { var p = new Image(); p.src = s.src; });

    // Set initial image
    imgs[0].src = slides[0].src;

    // Click/tap stage to advance
    stage.addEventListener('click', function () {
      if (n < 2) return;
      paused = false;
      goTo((current + 1) % n);
    });

    // Build dots
    if (dotsContainer) {
      for (var d = 0; d < n; d++) {
        var dot = document.createElement('span');
        dot.className = 'carousel-dot' + (d === 0 ? ' active' : '');
        dot.dataset.index = d;
        dot.addEventListener('click', function () {
          var idx = parseInt(this.dataset.index, 10);
          if (idx !== current) { paused = false; goTo(idx); }
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      var all = dotsContainer.querySelectorAll('.carousel-dot');
      for (var i = 0; i < all.length; i++)
        all[i].className = 'carousel-dot' + (i === current ? ' active' : '');
    }

    function schedule() {
      clearTimeout(autoTimer); autoTimer = null;
      if (paused) return;
      autoTimer = setTimeout(function () { autoTimer = null; if (!paused) goTo((current + 1) % n); }, 6000);
    }

    function goTo(next) {
      if (next === current || next < 0 || next >= n || n < 2) return;
      clearTimeout(autoTimer); autoTimer = null;

      var toIdx = (currentIdx + 1) % 2;
      var from = imgs[currentIdx];
      var to = imgs[toIdx];

      // Preload into the hidden img, then crossfade
      var pre = new Image();
      pre.onload = function () {
        to.src = slides[next].src;
        void to.offsetWidth; // force reflow so transition fires
        from.className = 'carousel-img inactive';
        to.className = 'carousel-img active';
        current = next;
        currentIdx = toIdx;
        updateDots();
        if (!paused) schedule();
      };
      pre.src = slides[next].src;
    }

    // Keyboard navigation
    window.addEventListener('keydown', function (e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault(); paused = false;
      if (e.key === 'ArrowLeft') goTo((current - 1 + n) % n);
      else goTo((current + 1) % n);
    });

    // Touch swipe
    (function () {
      var tx = 0;
      if (!stage) return;
      stage.addEventListener('touchstart', function (e) {
        if (!e.touches || !e.touches[0]) return;
        tx = e.touches[0].clientX;
      }, { passive: true });
      stage.addEventListener('touchend', function (e) {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        var dx = e.changedTouches[0].clientX - tx;
        if (Math.abs(dx) < 48) return;
        paused = false;
        if (dx < 0) goTo((current + 1) % n);
        else goTo((current - 1 + n) % n);
      }, { passive: true });
    })();

    // Pause on hover
    carouselEl.addEventListener('mouseenter', function () { paused = true; clearTimeout(autoTimer); autoTimer = null; clearTimeout(resumeTimer); resumeTimer = null; });
    carouselEl.addEventListener('mouseleave', function () {
      clearTimeout(resumeTimer); resumeTimer = null;
      resumeTimer = setTimeout(function () { resumeTimer = null; paused = false; schedule(); }, 2000);
    });

    schedule();
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

      /* ===================== SUB-MENU TOGGLE ===================== */
  var toggles = document.querySelectorAll('.sub-menu-toggle');
  var openSubMenu = null;
  toggles.forEach(function (tog) {
    var menuId = tog.getAttribute('data-submenu') || 'subMenuProject';
    var menu = document.getElementById(menuId);
    if (!menu) return;
    tog.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (openSubMenu && openSubMenu !== menu) {
        openSubMenu.classList.remove('open');
      }
      menu.classList.toggle('open');
      openSubMenu = menu.classList.contains('open') ? menu : null;


      // If the toggle has a real URL, navigate there
      var href = this.getAttribute('href');
      if (href && href !== '#') {
        window.location.href = href;
      }
    });
  });
  document.addEventListener('click', function (e) {
    var inToggle = false;
    var inMenu = false;
    toggles.forEach(function (t) {
      if (t.contains(e.target)) inToggle = true;
    });
    document.querySelectorAll('.sub-menu').forEach(function (m) {
      if (m.contains(e.target)) inMenu = true;
    });
    if (!inToggle && !inMenu) {
      document.querySelectorAll('.sub-menu.open').forEach(function (m) {
        m.classList.remove('open');
      });
      openSubMenu = null;
    }
  });

  /* ===================== SUB-MENU ACTIVE STATE ===================== */
  document.querySelectorAll('.sub-menu').forEach(function (menu) {
    var links = menu.querySelectorAll('a');
    var page = window.location.pathname.split('/').pop();
    links.forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === '/' + page) a.classList.add('active');
    });
  });
});
