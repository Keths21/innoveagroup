/* ============================================
   INNOVEA GROUP — Main JavaScript
   ============================================ */

// === NAVBAR ===
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
}

// Close mobile nav on link click
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// === SCROLL ANIMATIONS ===
const animatedEls = document.querySelectorAll('.fade-up, .fade-in, .slide-left, .slide-right, .stagger');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animatedEls.forEach(el => observer.observe(el));

// === COUNTER ANIMATION ===
function animateCounter(el, target, duration = 2000, suffix = '') {
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start).toLocaleString('fr-FR') + suffix;
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const suffix = counter.dataset.suffix || '';
        animateCounter(counter, target, 1800, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stats-grid, .hero-stats').forEach(el => statsObserver.observe(el));

// === CONTACT FORM — Envoi vers contact@innoveagroup.com via Web3Forms ===
const contactForm = document.getElementById('contactForm');
if (contactForm) {

  // Synchronise le champ replyto avec l'email saisi
  const emailInput = document.getElementById('email');
  const replytoField = document.getElementById('replyto_field');
  if (emailInput && replytoField) {
    emailInput.addEventListener('input', () => { replytoField.value = emailInput.value; });
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ── Validation ──
    let valid = true;
    contactForm.querySelectorAll('[required]').forEach(field => {
      if (field.type === 'checkbox') {
        if (!field.checked) { valid = false; }
        return;
      }
      const error = field.parentElement.querySelector('.form-error');
      if (!field.value.trim()) {
        field.classList.add('error');
        if (error) { error.textContent = 'Ce champ est requis'; error.classList.add('show'); }
        valid = false;
      } else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
        field.classList.add('error');
        if (error) { error.textContent = 'Adresse email invalide'; error.classList.add('show'); }
        valid = false;
      } else {
        field.classList.remove('error');
        if (error) error.classList.remove('show');
      }
    });

    if (!valid) return;

    // ── Envoi ──
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '⏳ Envoi en cours…';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(contactForm);
      // Synchronise replyto avec l'email du demandeur
      formData.set('replyto', formData.get('email') || '');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        contactForm.style.display = 'none';
        const success = document.getElementById('formSuccess');
        if (success) success.classList.add('show');
      } else {
        throw new Error(data.message || 'Erreur serveur');
      }
    } catch (err) {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      // Affiche un message d'erreur inline
      let errDiv = contactForm.querySelector('.form-send-error');
      if (!errDiv) {
        errDiv = document.createElement('div');
        errDiv.className = 'form-send-error';
        errDiv.style.cssText = 'margin-top:16px;padding:14px 18px;background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;font-size:14px;color:#DC2626;';
        contactForm.appendChild(errDiv);
      }
      errDiv.innerHTML = '⚠️ Envoi échoué. Veuillez nous contacter directement par WhatsApp ou par email à <strong>contact@innoveagroup.com</strong>.';
    }
  });

  // Efface les erreurs au fur et à mesure de la saisie
  contactForm.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      const error = input.parentElement.querySelector('.form-error');
      if (error) error.classList.remove('show');
    });
  });
}

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// === HERO CHART ANIMATION ===
const chartBars = document.querySelectorAll('.chart-bar');
chartBars.forEach((bar, i) => {
  const heights = [45, 65, 55, 80, 70, 90, 75];
  bar.style.height = heights[i % heights.length] + '%';
});

// === NAVBAR ACTIVE LINK ===
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// === PARTICLES HERO ===
const particlesContainer = document.querySelector('.hero-particles');
if (particlesContainer) {
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100 + 100}%;
      background:${Math.random() > 0.5 ? 'var(--accent-green)' : 'var(--accent-gold)'};
      animation-duration:${Math.random() * 15 + 10}s;
      animation-delay:${Math.random() * 5}s;
    `;
    particlesContainer.appendChild(p);
  }
}

// === TAB FUNCTIONALITY ===
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.tab-group');
    const targetId = btn.dataset.tab;

    group.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    group.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const panel = document.getElementById(targetId);
    if (panel) panel.classList.add('active');
  });
});

// === FAQ ACCORDION ===
document.querySelectorAll('.faq-item').forEach(item => {
  const toggle = item.querySelector('.faq-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  }
});

// === INIT ===
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
}, { passive: true });
