/* =============================================
   Found Not Lost — Image preview (lightbox)
   Matches sevenliang.com — native <dialog> API
   ============================================= */

(function () {
  'use strict';

  var dialog = document.getElementById('lightbox');
  if (!dialog || dialog.tagName !== 'DIALOG') return;

  var imgEl = document.getElementById('lightboxImg');
  var closeBtn = document.getElementById('lightboxClose');

  var items = [];
  var currentIndex = -1;

  // Collect all photo items from the grid
  function initItems() {
    var photoEls = document.querySelectorAll('.preview-trigger');
    items = [];
    photoEls.forEach(function (el) {
      var img = el.querySelector('img');
      if (img) {
        var src = img.getAttribute('src') || '';
        var hqSrc = src.replace(/w=600&q=80/, 'w=1600&q=85');
        items.push({
          src: hqSrc,
          label: img.alt || ''
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
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }

  // Close lightbox
  function close() {
    dialog.close();
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
  document.querySelectorAll('.preview-trigger').forEach(function (el, idx) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      open(idx);
    });
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', close);
  }

  // Keyboard navigation — native Escape closes <dialog> automatically
  document.addEventListener('keydown', function (e) {
    if (!dialog.open) return;
    if (e.key === 'Escape') {
      // Let the native Escape handler close the dialog
      return;
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    }
  });

  // Touch swipe for mobile
  (function () {
    var tx = 0;
    dialog.addEventListener('touchstart', function (e) {
      if (!e.touches || !e.touches[0]) return;
      tx = e.touches[0].clientX;
    }, { passive: true });
    dialog.addEventListener('touchend', function (e) {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      if (!dialog.open) return;
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
    document.querySelectorAll('.preview-trigger').forEach(function (el, idx) {
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
