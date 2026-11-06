/* Innovea Group — interactions du site */

// Navigation : fond plein dès qu'on quitte le haut de page (accueil)
const navbar = document.getElementById('navbar');
const onScroll = () => navbar?.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menu mobile
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');
const setMenu = (open) => {
  navToggle?.setAttribute('aria-expanded', String(open));
  navToggle?.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  mobileNav?.classList.toggle('open', open);
  navbar?.classList.toggle('scrolled', open || window.scrollY > 24);
  document.body.style.overflow = open ? 'hidden' : '';
};
navToggle?.addEventListener('click', () => setMenu(navToggle.getAttribute('aria-expanded') !== 'true'));
mobileNav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// FAQ
document.querySelectorAll('.faq-item').forEach((item) => {
  const toggle = item.querySelector('.faq-toggle');
  toggle?.addEventListener('click', () => {
    const open = !item.classList.contains('open');
    item.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  });
});

// Formulaire de contact — envoi vers contact@innoveagroup.com via Web3Forms
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const emailInput = document.getElementById('email');
  const replytoField = document.getElementById('replyto_field');
  emailInput?.addEventListener('input', () => { if (replytoField) replytoField.value = emailInput.value; });

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;
    contactForm.querySelectorAll('[required]').forEach((field) => {
      if (field.type === 'checkbox') {
        field.closest('.consent')?.classList.toggle('error', !field.checked);
        if (!field.checked) valid = false;
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
        error?.classList.remove('show');
      }
    });
    if (!valid) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Envoi en cours…';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(contactForm);
      formData.set('replyto', formData.get('email') || '');
      const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Erreur serveur');
      contactForm.hidden = true;
      document.getElementById('formSuccess')?.classList.add('show');
    } catch (err) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      let errDiv = contactForm.querySelector('.form-send-error');
      if (!errDiv) {
        errDiv = document.createElement('div');
        errDiv.className = 'form-send-error';
        errDiv.setAttribute('role', 'alert');
        contactForm.appendChild(errDiv);
      }
      errDiv.innerHTML = "L'envoi a échoué. Écrivez-nous directement à <strong>contact@innoveagroup.com</strong>.";
    }
  });

  document.getElementById('consent')?.addEventListener('change', (e) => {
    e.target.closest('.consent')?.classList.toggle('error', !e.target.checked);
  });

  contactForm.querySelectorAll('.form-input').forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
      input.parentElement.querySelector('.form-error')?.classList.remove('show');
    });
  });
}
