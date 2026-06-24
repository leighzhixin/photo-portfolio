/* =============================================
   Photography Portfolio — Main Script
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ===================== CONFIG ===================== */
    var slides = [
    { src: '/images/home-1.jpg' },
    { src: '/images/home-2.jpg' },
    { src: '/images/home-3.jpg' },
    { src: '/images/home-4.jpg' },
    { src: '/images/home-5.jpg' },
    { src: '/images/home-6.jpg' },
    { src: '/images/home-7.jpg' },
    { src: '/images/home-8.jpg' },
    { src: '/images/home-9.jpg' },
    { src: '/images/home-10.jpg' },
    { src: '/images/home-11.jpg' }
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

  /* ===================== CAROUSEL ===================== */
  var carouselEl = document.getElementById('homeCarousel');
  if (carouselEl && slides.length > 0) {
    var img = carouselEl.querySelector('.carousel-stage img');
    var btnPrev = document.getElementById('carouselPrev');
    var btnNext = document.getElementById('carouselNext');
    var dotsContainer = document.getElementById('carouselDots');
    var stage = document.getElementById('carouselStage');

    var n = slides.length;
    var current = 0;
    var animating = false;
    var paused = false;
    var autoTimer = null;
    var resumeTimer = null;

    // Preload
    slides.forEach(function (s) { var p = new Image(); p.src = s.src; });

    // Init
    img.src = slides[0].src;

    // Build dots
    if (dotsContainer) {
      for (var d = 0; d < n; d++) {
        var dot = document.createElement('span');
        dot.className = 'carousel-dot' + (d === 0 ? ' active' : '');
        dot.dataset.index = d;
        dot.addEventListener('click', function () {
          var idx = parseInt(this.dataset.index, 10);
          if (idx !== current && !animating) { paused = false; goTo(idx); }
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
      autoTimer = setTimeout(function () { autoTimer = null; if (!paused) goTo((current + 1) % n); }, 7000);
    }

    function goTo(next) {
      if (next === current || animating || next < 0 || next >= n) return;
      clearTimeout(autoTimer); autoTimer = null;
      animating = true;
      if (btnPrev) btnPrev.disabled = true;
      if (btnNext) btnNext.disabled = true;

      img.style.opacity = '0';
      setTimeout(function () {
        img.src = slides[next].src;
        img.style.opacity = '1';
        current = next;
        animating = false;
        updateDots();
        if (btnPrev) btnPrev.disabled = false;
        if (btnNext) btnNext.disabled = false;
        if (!paused) schedule();
      }, 1000);
    }

    if (btnPrev) btnPrev.addEventListener('click', function () { paused = false; goTo((current - 1 + n) % n); });
    if (btnNext) btnNext.addEventListener('click', function () { paused = false; goTo((current + 1) % n); });

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

    carouselEl.addEventListener('mouseenter', function () { paused = true; clearTimeout(autoTimer); autoTimer = null; clearTimeout(resumeTimer); resumeTimer = null; });
    carouselEl.addEventListener('mouseleave', function () {
      clearTimeout(resumeTimer); resumeTimer = null;
      resumeTimer = setTimeout(function () { resumeTimer = null; paused = false; if (!animating) schedule(); }, 2000);
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
