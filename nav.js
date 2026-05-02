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

function initDesignerModal() {
  var trigger = document.querySelector('.footer-credit');
  if (!trigger) return;

  if (document.getElementById('designer-modal')) return;

  var modal = document.createElement('div');
  modal.className = 'designer-modal';
  modal.id = 'designer-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML =
    '<div class="designer-modal-card" role="dialog" aria-modal="true" aria-labelledby="designer-modal-title">' +
      '<button type="button" class="designer-modal-close" aria-label="Close designer contact card">X</button>' +
      '<div class="designer-modal-header">' +
        '<img src="images/eternal-logo.png" alt="Eternal logo" class="designer-modal-logo" />' +
        '<div>' +
          '<div class="designer-modal-kicker">Designed by Eternal</div>' +
          '<div class="designer-modal-title" id="designer-modal-title">Want a similar website?</div>' +
        '</div>' +
      '</div>' +
      '<div class="designer-modal-body">Contact <a class="designer-modal-link" href="mailto:info@glenvillajuniors.co.uk">info@glenvillajuniors.co.uk</a> and ask the club to refer you to the designer.</div>' +
      '<div class="designer-modal-actions">' +
        '<a class="designer-modal-email" href="mailto:info@glenvillajuniors.co.uk?subject=Designer%20Referral">Email the Club for a Referral</a>' +
      '</div>' +
    '</div>';

  document.body.appendChild(modal);

  var closeBtn = modal.querySelector('.designer-modal-close');

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  window.openDesignerModal = openModal;
  window.closeDesignerModal = closeModal;

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    var activeTrigger = e.target && e.target.classList && e.target.classList.contains('footer-credit');
    if (activeTrigger && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      openModal();
      return;
    }
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
  document.addEventListener('click', function(e) {
    var target = e.target.closest('.footer-credit');
    if (!target) return;
    e.preventDefault();
    openModal();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initMobileNav();
    initDesignerModal();
  });
} else {
  initMobileNav();
  initDesignerModal();
}
