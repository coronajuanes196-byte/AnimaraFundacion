require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const sendDonationEmail = async ({ nombre, email, causa, monto, metodo = 'PayPal', source = 'web' }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const adminMailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
    subject: `Nueva donación recibida - ${nombre}`,
    html: `
      <h2>¡Nueva donación recibida!</h2>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Correo:</strong> ${email}</p>
      <p><strong>Causa:</strong> ${causa || 'No especificada'}</p>
      <p><strong>Monto:</strong> ${monto || 'No especificado'}</p>
      <p><strong>Método:</strong> ${metodo}</p>
      <p><strong>Origen:</strong> ${source}</p>
      <p>Se ha detectado un nuevo aporte desde la web de Animara.</p>
    `,
  };

  const donorMailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: '🎉 Gracias por tu donación a Animara',
    html: `
      <h2>¡Gracias por tu generosidad!</h2>
      <p>Hola ${nombre},</p>
      <p>Tu donación ha sido recibida con mucho cariño y gratitud. Gracias por apoyar a Animara y por ayudar a los animales que necesitan una segunda oportunidad.</p>
      <p><strong>Causa:</strong> ${causa || 'No especificada'}</p>
      <p><strong>Método:</strong> ${metodo}</p>
      <p>Tu apoyo hace una gran diferencia. Gracias por formar parte de esta causa.</p>
      <p>Adjuntamos tu certificado de donación para que puedas descargarlo y conservarlo.</p>
      <p>Con cariño,<br/>Animara Fundación</p>
    `,
    attachments: [
      {
        filename: 'certificadoAnimara.png',
        path: path.join(__dirname, 'img', 'certuficadoAnimara.png'),
      },
    ],
  };

  await transporter.sendMail(adminMailOptions);

  if (email) {
    await transporter.sendMail(donorMailOptions);
  }
};

const sendContactEmail = async ({ nombre, apellido, email, asunto, mensaje }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const adminMailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_EMAIL || process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
    subject: `Nueva consulta desde Animara: ${asunto || 'Sin asunto'}`,
    html: `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${nombre} ${apellido || ''}</p>
      <p><strong>Correo:</strong> ${email}</p>
      <p><strong>Asunto:</strong> ${asunto || 'No especificado'}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${mensaje.replace(/\n/g, '<br/>')}</p>
    `,
  };

  await transporter.sendMail(adminMailOptions);
};

app.post('/api/donacion', async (req, res) => {
  try {
    const { nombre, email, causa, monto, metodo = 'PayPal' } = req.body;

    if (!email || !nombre) {
      return res.status(400).json({ ok: false, message: 'Faltan datos obligatorios.' });
    }

    await sendDonationEmail({ nombre, email, causa, monto, metodo, source: 'web' });

    res.json({ ok: true, message: 'Notificación enviada correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'No se pudo enviar la notificación.' });
  }
});

app.post('/api/contacto', async (req, res) => {
  try {
    const { nombre, apellido, email, asunto, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ ok: false, message: 'Faltan datos obligatorios.' });
    }

    await sendContactEmail({ nombre, apellido, email, asunto, mensaje });

    res.json({ ok: true, message: 'Mensaje enviado correctamente.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'No se pudo enviar el mensaje.' });
  }
});

app.post('/api/paypal-webhook', async (req, res) => {
  try {
    const event = req.body || {};
    const eventType = event.event_type;
    const completed = ['PAYMENT.SALE.COMPLETED', 'PAYMENT.CAPTURE.COMPLETED', 'CHECKOUT.ORDER.APPROVED'].includes(eventType);

    if (!completed) {
      return res.json({ ok: true, ignored: true, eventType });
    }

    const resource = event.resource || {};
    const amount = resource.amount?.value || resource.gross_amount?.value || 'No especificado';
    const currency = resource.amount?.currency_code || resource.gross_amount?.currency_code || '';
    const payerEmail = resource.payer?.email_address || 'No especificado';

    await sendDonationEmail({
      nombre: 'Donación PayPal',
      email: payerEmail,
      causa: 'Donación confirmada por PayPal',
      monto: `${amount}${currency ? ` ${currency}` : ''}`,
      metodo: 'PayPal',
      source: 'paypal-webhook',
    });

    res.json({ ok: true, message: 'Webhook procesado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'No se pudo procesar el webhook.' });
  }
});

// Simple endpoint to trigger a test email (useful to verify SMTP config)
app.post('/api/test-email', async (req, res) => {
  try {
    const to = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
    if (!to) return res.status(400).json({ ok: false, message: 'No NOTIFY_EMAIL configured.' });

    await sendDonationEmail({
      nombre: 'Prueba de servidor',
      email: to,
      causa: 'Verificación SMTP',
      monto: '0',
      metodo: 'test',
      source: 'manual-test',
    });

    res.json({ ok: true, message: 'Correo de prueba enviado.' });
  } catch (error) {
    console.error('Error enviando correo de prueba:', error);
    res.status(500).json({ ok: false, message: error.message || 'Error enviando correo de prueba.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
