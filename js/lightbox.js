/* =============================================
   Found Not Lost — Lightbox viewer
   ============================================= */

(function () {
  'use strict';

  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  var imgEl = document.getElementById('lightboxImg');
  var labelEl = document.getElementById('lightboxLabel');
  var closeBtn = document.getElementById('lightboxClose');
  var prevBtn = document.getElementById('lightboxPrev');
  var nextBtn = document.getElementById('lightboxNext');

  var items = [];
  var currentIndex = -1;

  // Collect all photo items from the grid
  function initItems() {
    var photoEls = document.querySelectorAll('.photo-item');
    items = [];
    photoEls.forEach(function (el) {
      var img = el.querySelector('img');
      var label = el.querySelector('.photo-label');
      if (img) {
        // Build high-res src for lightbox
        var src = img.getAttribute('src') || '';
        var hqSrc = src.replace(/w=600&q=80/, 'w=1600&q=85');
        items.push({
          src: hqSrc,
          label: label ? label.textContent : ''
        });
      }
    });
  }

  // Open lightbox at index
  function open(index) {
    if (index < 0 || index >= items.length) return;
    currentIndex = index;
    var item = items[currentIndex];
    imgEl.src = item.src;
    imgEl.alt = item.label;
    labelEl.textContent = item.label;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  // Close lightbox
  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Navigate
  function prev() {
    if (items.length === 0) return;
    var idx = (currentIndex - 1 + items.length) % items.length;
    open(idx);
  }

  function next() {
    if (items.length === 0) return;
    var idx = (currentIndex + 1) % items.length;
    open(idx);
  }

  // Build items on load
  initItems();

  // Click handler on photo items
  document.querySelectorAll('.photo-item').forEach(function (el, idx) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      open(idx);
    });
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', close);
  }

  // Nav buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      prev();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      next();
    });
  }

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  });

  // Click outside image to close
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  // Touch swipe for mobile
  (function () {
    var tx = 0;
    lightbox.addEventListener('touchstart', function (e) {
      if (!e.touches || !e.touches[0]) return;
      tx = e.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', function (e) {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) < 48) return;
      if (dx < 0) next(); else prev();
    }, { passive: true });
  })();

  // Year nav — active state + smooth scroll
  var yearLinks = document.querySelectorAll('.year-link');
  var yearSections = document.querySelectorAll('.year-section');

  function updateActiveYear() {
    var scrollY = window.scrollY;
    var activeId = null;

    yearSections.forEach(function (section) {
      var top = section.offsetTop - 100;
      var bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        activeId = section.id;
      }
    });

    // Fallback to last section if scrolled past
    if (!activeId && yearSections.length > 0) {
      var last = yearSections[yearSections.length - 1];
      if (scrollY >= last.offsetTop - 100) {
        activeId = last.id;
      }
    }

    yearLinks.forEach(function (link) {
      var target = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', target === activeId);
    });
  }

  yearLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = this.getAttribute('href').replace('#', '');
      var target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  var scrollTimer;
  window.addEventListener('scroll', function () {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updateActiveYear, 50);
  });
  setTimeout(updateActiveYear, 200);

  // Re-init items if photos change dynamically
  var observer = new MutationObserver(function () {
    initItems();
    document.querySelectorAll('.photo-item').forEach(function (el, idx) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        open(idx);
      });
    });
  });
  observer.observe(document.querySelector('.photo-grid') || document.body, {
    childList: true,
    subtree: true
  });

})();
