function initMobileNav() {
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('main-nav');

  if (!hamburger || !nav) return;

  // Toggle nav open/closed when hamburger clicked
  hamburger.addEventListener('click', function() {
    var isOpen = nav.classList.contains('active');
    if (isOpen) {
      nav.classList.remove('active');
      hamburger.classList.remove('active');
    } else {
      nav.classList.add('active');
      hamburger.classList.add('active');
    }
  });

  // Close when a nav link is clicked
  nav.addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-link')) {
      nav.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });

  // Close when clicking outside
  document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      nav.classList.remove('active');
      hamburger.classList.remove('active');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileNav);
} else {
  initMobileNav();
}