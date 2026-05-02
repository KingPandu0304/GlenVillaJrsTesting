/**
 * Glen Vila Juniors — main.js
 * Fetches teams.json, renders team cards, and manages the modal popup.
 */

let teamsData = [];

/* ── Boot ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('teams-grid');
  if (!grid) return;

  loadTeams(grid);

  // Close modal on overlay click
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeTeam();
    });
  }

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTeam();
  });
});

/* ── Fetch & Render ───────────────────────────────────── */
async function loadTeams(grid) {
  grid.innerHTML = `
    <div class="loader-wrap">
      <div class="spinner"></div>
      <p>Loading teams...</p>
    </div>`;

  try {
    const res = await fetch('teams.json?v=' + Date.now());
    if (!res.ok) throw new Error('HTTP ' + res.status);
    teamsData = await res.json();
    renderCards(grid, teamsData);
  } catch (err) {
    grid.innerHTML = `
      <div class="loader-wrap">
        <p style="color:#800000;font-weight:700;">Could not load teams. Make sure teams.json is in the same folder.</p>
        <p style="font-size:0.85rem;margin-top:0.5rem;color:#666;">${err.message}</p>
      </div>`;
    console.error('Failed to load teams.json:', err);
  }
}

function renderCards(grid, teams) {
  grid.innerHTML = '';

  teams.forEach((team, index) => {
    const card = document.createElement('article');
    card.className = 'team-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'View details for ' + team.team);

    const hasImage = team.image && team.image !== 'blank.png' && team.image !== 'images/blank.png';
    const spacesBadge = typeof team.spaces !== 'undefined'
      ? '<div class="card-spaces-badge ' + (team.spaces ? 'spaces-yes' : 'spaces-no') + '">'
        + (team.spaces ? '✓ Spaces Available' : '✗ Squad Full')
        + '</div>'
      : '';
    card.innerHTML =
      '<div class="card-img-wrap">' +
        (hasImage
          ? '<img src="' + team.image + '" alt="' + team.team + ' team photo" ' +
              'onload="this.style.opacity=\'1\';" ' +
              'onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';" />' +
            '<div class="card-img-placeholder" style="display:none;">' + team.team + '</div>'
          : '<div class="card-img-placeholder" style="display:flex;">' + team.team + '</div>'
        ) +
        '<span class="team-badge">Squad</span>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-team-name">' + team.team + '</div>' +
        '<div class="card-coach">' + team.coach + '</div>' +
        spacesBadge +
        '<div class="card-cta">View Details</div>' +
      '</div>';

    card.addEventListener('click', () => openTeam(index));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openTeam(index);
      }
    });

    grid.appendChild(card);
  });
}

/* ── Modal ────────────────────────────────────────────── */
function openTeam(index) {
  const team = teamsData[index];
  if (!team) return;

  const overlay = document.getElementById('modal-overlay');

  document.getElementById('modal-team-name').textContent    = team.team;
  document.getElementById('modal-coach-val').textContent    = team.coach;
  document.getElementById('modal-time-val').textContent     = team.training_time;
  document.getElementById('modal-location-val').textContent = team.training_location;
  const contact = team.contact || team.email;
  document.getElementById('modal-contact-val').textContent  = contact;

  // Spaces indicator
  const spacesRow = document.getElementById('modal-spaces-row');
  if (spacesRow) {
    if (typeof team.spaces !== 'undefined') {
      spacesRow.style.display = '';
      const spacesVal = document.getElementById('modal-spaces-val');
      spacesVal.textContent = team.spaces ? 'Spaces available' : 'Squad full';
      spacesVal.style.color = team.spaces ? '#2e7d32' : '#8b0000';
      spacesVal.style.fontWeight = '700';
    } else {
      spacesRow.style.display = 'none';
    }
  }

  const img = document.getElementById('modal-img');
  const isPlaceholder = !team.image || team.image === 'blank.png' || team.image === 'images/blank.png';
  if (isPlaceholder) {
    img.style.display = 'none';
    let ph = document.getElementById('modal-img-placeholder');
    if (!ph) {
      ph = document.createElement('div');
      ph.id = 'modal-img-placeholder';
      ph.style.cssText = 'width:80px;height:80px;border-radius:8px;background:linear-gradient(135deg,#6ec6e6,#ADD8E6);display:flex;align-items:center;justify-content:center;font-family:Bebas Neue,sans-serif;font-size:1.6rem;letter-spacing:0.06em;color:rgba(122,0,0,0.35);flex-shrink:0;';
      img.parentNode.insertBefore(ph, img);
    }
    ph.textContent = team.team;
    ph.style.display = 'flex';
  } else {
    img.style.display = 'block';
    const ph = document.getElementById('modal-img-placeholder');
    if (ph) ph.style.display = 'none';
    img.src = team.image;
    img.alt = team.team + ' team photo';
  }

  const emailBtn = document.getElementById('modal-email-btn');
  const isEmail = contact.includes('@');
  if (isEmail) {
    emailBtn.href = 'mailto:' + contact;
    emailBtn.textContent = '✉ Email Coach';
    emailBtn.title = 'Email ' + team.coach;
  } else {
    emailBtn.href = 'tel:' + contact;
    emailBtn.textContent = '📞 Call Coach';
    emailBtn.title = 'Call ' + team.coach;
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Accessibility: focus close button
  setTimeout(() => {
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
  }, 50);
}

function closeTeam() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}
