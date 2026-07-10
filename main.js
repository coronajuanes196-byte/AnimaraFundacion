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
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const msg = document.getElementById('form-success');
    if (msg) { msg.style.display = 'block'; contactForm.reset(); }
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
      const submitBtn = document.getElementById('paypal-submit-btn');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '0.6'; }

      const response = await fetch('/api/donacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, causa, monto, metodo: 'PayPal' })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'No se pudo enviar la notificación');

      if (successMsg) {
        document.getElementById('success-text').textContent = '✅ ¡Gracias por tu apoyo! Te hemos enviado una confirmación a tu correo.';
        successMsg.style.display = 'block';
      }
      donationForm.reset();
    } catch (error) {
      console.error(error);
      if (successMsg) {
        document.getElementById('success-text').textContent = '⚠️ No se pudo enviar la notificación, pero puedes continuar con PayPal.';
        successMsg.style.display = 'block';
      }
    } finally {
      const continueBtn = document.getElementById('continue-paypal');
      if (continueBtn) {
        continueBtn.addEventListener('click', () => {
          const hostId = document.getElementById('paypal-hosted-button')?.value || 'HQNJVRXJG2Y58';
          window.location.href = `https://www.paypal.com/donate?hosted_button_id=${hostId}`;
        });
      }
      const submitBtn = document.getElementById('paypal-submit-btn');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = '1'; }
    }
  });
}
