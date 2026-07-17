// ===== HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.navbar__links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));
}

// ===== ACTIVE NAV LINK =====
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.navbar__links a').forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== STICKY NAV SHADOW =====
window.addEventListener('scroll', () => {
  document.querySelector('.navbar').style.boxShadow =
    window.scrollY > 10 ? '0 4px 20px rgba(0,0,0,0.13)' : '0 2px 12px rgba(0,0,0,0.08)';
});

// ===== DONATION AMOUNT SELECTOR =====
document.querySelectorAll('.amount-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const input = document.getElementById('custom-amount');
    if (input) input.value = btn.dataset.amount || '';
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = document.getElementById('contact-name').value.trim();
    const apellido = document.getElementById('contact-lastname').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const asunto = document.getElementById('contact-asunto').value.trim();
    const mensaje = document.getElementById('contact-message').value.trim();
    const msg = document.getElementById('form-success');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, email, asunto, mensaje })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'No se pudo enviar el mensaje.');
      if (msg) {
        msg.textContent = '✅ ¡Mensaje enviado! Te responderemos en menos de 24 horas.';
        msg.style.display = 'block';
      }
      contactForm.reset();
    } catch (error) {
      console.error(error);
      if (msg) {
        msg.textContent = '⚠️ No se pudo enviar tu mensaje. Por favor intenta de nuevo más tarde.';
        msg.style.display = 'block';
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// ===== DONATION NOTIFICATION =====
const donationForm = document.getElementById('donation-form');
const successMsg = document.getElementById('success-msg');

if (donationForm) {
  donationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('don-name').value.trim();
    const email = document.getElementById('don-email').value.trim();
    const causa = document.getElementById('don-causa').value;
    const monto = document.getElementById('don-monto').value;

    try {
      const response = await fetch('/api/donacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, causa, monto, metodo: 'PayPal' })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'No se pudo enviar la notificación');

      if (successMsg) successMsg.style.display = 'block';
      donationForm.reset();
      window.location.href = 'https://www.paypal.com/donate?hosted_button_id=HQNJVRXJG2Y58';
    } catch (error) {
      console.error(error);
      if (successMsg) {
        successMsg.textContent = '⚠️ No se pudo enviar la notificación, pero puedes continuar con PayPal.';
        successMsg.style.display = 'block';
      }
      window.location.href = 'https://www.paypal.com/donate?hosted_button_id=HQNJVRXJG2Y58';
    }
  });
}
