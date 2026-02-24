import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import Anthropic from '@anthropic-ai/sdk';
import pg from 'pg';
import multer from 'multer';
import { Resend } from 'resend';  
import XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize
const app = express();
const PORT = process.env.PORT || 3001;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const upload = multer({ storage: multer.memoryStorage() });
const resend = new Resend(process.env.RESEND_API_KEY);

// Database connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Price mapping
const PRICES = {
  '1': { amount: 9900, properties: 1, name: 'DedosFácil - 1 Propiedad' },
  '3': { amount: 25900, properties: 3, name: 'DedosFácil - 3 Propiedades' },
  '10': { amount: 79900, properties: 10, name: 'DedosFácil - 10 Propiedades' },
};

// Enviar email de confirmación
async function sendConfirmationEmail(email, orderData) {
  try {
    await resend.emails.send({
      from: 'DedosFácil <noreply@dedosfacil.es>',
      // to: email, // TESTING: descomentado para producción
      to: 'support@dedosfacil.es',
      bcc: ['dedosfacil.es+b70c16ff1f@invite.trustpilot.com'],
      subject: `[TEST → ${email}] ✅ Pedido DF-${orderData.orderId} confirmado - DedosFácil`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #10b981 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">DedosFácil</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #10b981;">✅ ¡Pago completado!</h2>
            <p>Gracias por confiar en DedosFácil. Hemos recibido tu pedido.</p>
            <div style="background: #1e3a5f; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 14px;">Tu número de referencia</span><br>
              <strong style="font-size: 28px;">DF-${orderData.orderId}</strong>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Resumen:</h3>
              <p><strong>Plan:</strong> ${orderData.plan} Propiedad(es)</p>
              <p><strong>Importe:</strong> ${orderData.amount}€</p>
            </div>
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
              <h3 style="margin-top: 0; color: #166534;">¿Qué pasa ahora?</h3>
              <ol style="color: #166534;">
                ${orderData.serviceType === 'nrua_request'
                  ? '<li>Tramitaremos tu solicitud de número NRUA</li><li>En 24-48h recibirás tu número NRUA por email</li>'
                  : '<li>Procesaremos tu declaración del Modelo N2</li><li>En 24-48h recibirás el justificante de presentación</li>'
                }
              </ol>
            </div>
           <div style="text-align: center; margin: 20px 0;">
  <a href="https://dedosfacil.es/factura/${orderData.orderId}" 
     style="display: inline-block; padding: 12px 24px; background: #1e3a5f; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
    📄 Descargar Factura
  </a>
</div>
              ¿Dudas? Escríbenos a support@dedosfacil.es indicando tu referencia DF-${orderData.orderId}
            </p>
          </div>
        </div>
      `
    });
    console.log('Email sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, '../client/dist')));

// Stripe webhook needs raw body
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

 if (event.type === 'checkout.session.completed') {
  const session = event.data.object;
  
  // Update order status
  const updateResult = await pool.query(
    'UPDATE orders SET status = $1, stripe_payment_id = $2, completed_at = NOW() WHERE stripe_session_id = $3 RETURNING *',
    ['completed', session.payment_intent, session.id]
  );
  
  // También actualizar submission status
  if (updateResult.rows.length > 0) {
    const order = updateResult.rows[0];
    
    // Update submissions OR nrua_requests depending on service type
    await pool.query(
      'UPDATE submissions SET status = $1 WHERE order_id = $2',
      ['completed', order.id]
    );
    await pool.query(
      'UPDATE nrua_requests SET status = $1 WHERE order_id = $2',
      ['completed', order.id]
    );
    // Update affiliate referral status
    await pool.query('UPDATE affiliate_referrals SET status = $1 WHERE order_id = $2', ['completed', order.id]);
    
    // Enviar email...
    await sendConfirmationEmail(session.customer_email, {
      orderId: order.id,
      serviceType: order.service_type,
      plan: order.properties_count,
      amount: order.amount / 100
    });
  }
  
  console.log('Payment completed for session:', session.id);
}

  res.json({ received: true });
});

// JSON middleware for other routes
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================
// ENVIAR NÚMERO NRUA PROVISIONAL AL CLIENTE
// Añadir en server/index.js junto a los otros endpoints admin
// ============================================

app.post('/api/admin/send-nrua/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nrua } = req.body;

    if (!nrua) {
      return res.status(400).json({ error: 'Número NRUA obligatorio' });
    }

    // Obtener datos de la solicitud
    const result = await pool.query(
      `SELECT nr.*, o.email, o.amount
       FROM nrua_requests nr
       JOIN orders o ON o.id = nr.order_id
       WHERE nr.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    const req_data = result.rows[0];
    const { email, name, surname, property_address, property_municipality, property_province, order_id } = req_data;

    const nombreCliente = name ? `${name}${surname ? ' ' + surname : ''}` : null;
    const reviewUrl = `https://dedosfacil.es/valoracion?order_id=${order_id}`;
    const facturaUrl = `https://dedosfacil.es/factura/${order_id}`;

    // Guardar el número provisional en la BD
    await pool.query(
      'UPDATE nrua_requests SET provisional_nrua = $1 WHERE id = $2',
      [nrua, id]
    );

    // Marcar como enviado
    await pool.query('UPDATE nrua_requests SET status = $1 WHERE id = $2', ['enviado', id]);
    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['enviado', order_id]);

    // Enviar email
    await resend.emails.send({
      from: 'DedosFácil <noreply@dedosfacil.es>',
      // to: email, // TESTING: descomentado para producción
      to: 'support@dedosfacil.es',
      subject: `[TEST → ${email}] 🔑 Tu número NRUA provisional ya está disponible - Pedido DF-${order_id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #10b981 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">DedosFácil</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #10b981; margin-top: 0;">✅ Tu número NRUA provisional está listo</h2>
            <p>Hola${nombreCliente ? ' ' + nombreCliente : ''},</p>
            <p>Nos complace informarte de que tu número NRUA provisional ha sido asignado correctamente para el inmueble ubicado en <strong>${property_address || ''}, ${property_municipality || ''} (${property_province || ''})</strong>.</p>

            <div style="background: #1e3a5f; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <p style="margin: 0 0 8px; font-size: 14px; opacity: 0.8;">Tu número NRUA provisional</p>
              <strong style="font-size: 26px; font-family: monospace; letter-spacing: 2px;">${nrua}</strong>
            </div>

            <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px; font-weight: 600; color: #1e40af;">✅ ¿Puedo usarlo ya?</p>
              <p style="margin: 0; color: #1e3a5f; font-size: 14px;">Sí, este número ya tiene plena validez. Puedes añadirlo a tus anuncios en <strong>Airbnb</strong>, <strong>Booking.com</strong> y cualquier otra plataforma de reservas online.</p>
            </div>

            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px; font-weight: 600; color: #065f46;">📅 ¿Y el Modelo N2?</p>
              <p style="margin: 0; color: #065f46; font-size: 14px;">Como has recibido tu número NRUA en 2026, <strong>no tienes que presentar el Modelo N2 este año</strong>. Tu primera declaración será en febrero de 2027, con los datos de las estancias de 2026.</p>
            </div>

            <div style="background: #fefce8; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">🔄 <strong>Número definitivo:</strong> En cuanto el Registro de la Propiedad emita tu número NRUA definitivo, te lo enviaremos a este mismo correo. Mientras tanto, el número provisional es completamente válido para su uso en las plataformas.</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <h3 style="margin-top: 0;">📋 Referencia de tu pedido</h3>
              <p style="margin: 4px 0;"><strong>Nº pedido:</strong> DF-${order_id}</p>
              <p style="margin: 4px 0;"><strong>Inmueble:</strong> ${property_address || '-'}, ${property_municipality || '-'}</p>
              <p style="margin: 4px 0;"><strong>NRUA:</strong> <span style="font-family: monospace;">${nrua}</span></p>
            </div>

            <div style="text-align: center; margin: 25px 0;">
  <a href="${facturaUrl}"
     style="display: inline-block; padding: 14px 32px; background: #1e3a5f; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
    📄 Ver Factura
  </a>
</div>

            <div style="background: #fffbeb; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <p style="margin: 0 0 12px 0; font-size: 16px;"><strong>¿Qué tal tu experiencia?</strong></p>
              <p style="margin: 0 0 16px 0; color: #6b7280;">Solo tardas 30 segundos. Tu opinión nos ayuda mucho.</p>
              <a href="${reviewUrl}"
                 style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f97316, #f59e0b); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                ⭐ Dejar valoración
              </a>
            </div>

            <p style="color: #6b7280; font-size: 13px;">
              ¿Tienes alguna duda? Escríbenos a <a href="mailto:support@dedosfacil.es">support@dedosfacil.es</a> indicando tu referencia DF-${order_id}.
            </p>

            <p style="color: #6b7280; font-size: 12px; margin-top: 0;">
              — Irina, equipo DedosFácil
            </p>
          </div>
        </div>
      `
    });

    console.log(`📧 NRUA provisional ${nrua} enviado a: ${email}`);
    res.json({ success: true, email });

  } catch (error) {
    console.error('Send NRUA error:', error);
    res.status(500).json({ error: 'Error al enviar número NRUA' });
  }
});

// Create Stripe checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { plan, email, formData, files, stays, noActivity, gdprConsent, affiliateCode } = req.body;
    console.log('📦 Checkout request received:');
    console.log('- Email:', email);
    console.log('- Plan:', plan);
    console.log('- Affiliate:', affiliateCode || 'none');
    const priceData = PRICES[plan];

    // Lookup affiliate discount
let affiliate = null;
    let finalAmount = priceData.amount;
    let discountAmount = 0;
    if (affiliateCode) {
      const affResult = await pool.query(
        'SELECT * FROM affiliates WHERE code = $1 AND active = true',
        [affiliateCode.toUpperCase()]
      );
      if (affResult.rows.length > 0) {
        affiliate = affResult.rows[0];
        const discountPercent = req.body.affiliateDiscount === 10 || req.body.affiliateDiscount === 20 ? req.body.affiliateDiscount : affiliate.discount_percent;
        discountAmount = Math.round(priceData.amount * discountPercent / 100);
        finalAmount = priceData.amount - discountAmount;
        console.log(`🎟️ Affiliate ${affiliate.code}: ${affiliate.discount_percent}% off = -${discountAmount/100}€`);
      }
    }

    // Email de prueba que salta Stripe
    if (email === 'demiandreu@gmail.com') {
      const orderResult = await pool.query(
        'INSERT INTO orders (email, plan, properties_count, amount, status, affiliate_code, discount_amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [email, plan, priceData.properties, finalAmount, 'completed', affiliate?.code || null, discountAmount]
      );
      const orderId = orderResult.rows[0].id;
      
      if (parseInt(plan) === 1) {
        await pool.query(
          `INSERT INTO submissions 
           (order_id, name, nif, nrua, address, province, phone, airbnb_file, booking_file, other_file, nrua_photo_base64, nrua_photo_name, extracted_stays, status, authorization_timestamp, authorization_ip, gdpr_accepted, gdpr_timestamp, gdpr_ip)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
          [
            orderId,
            formData?.name || null, null, formData?.nrua || null,
            formData?.address || null, formData?.province || null, formData?.phone || null,
            files?.airbnb ? JSON.stringify({ name: files.airbnbName, data: files.airbnb }) : null,
            files?.booking ? JSON.stringify({ name: files.bookingName, data: files.booking }) : null,
            files?.other ? JSON.stringify({ name: files.otherName, data: files.other }) : null,
            files?.nruaPhoto ? JSON.stringify({ name: files.nruaPhotoName, data: files.nruaPhoto }) : null,
            files?.nruaPhotoName || null,
            JSON.stringify(stays || []), 'completed',
            new Date(), req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            gdprConsent?.accepted || false, new Date(), req.headers['x-forwarded-for'] || req.socket.remoteAddress
          ]
        );
      }

      // Register affiliate referral
      if (affiliate) {
        const commissionAmount = Math.round(finalAmount * affiliate.commission_percent / 100);
        await pool.query(
          'INSERT INTO affiliate_referrals (affiliate_id, order_id, service_type, original_amount, discount_amount, commission_amount, status) VALUES ($1,$2,$3,$4,$5,$6,$7)',
          [affiliate.id, orderId, 'n2', priceData.amount, discountAmount, commissionAmount, 'completed']
        );
      }

      await sendConfirmationEmail(email, { orderId, plan: priceData.properties, amount: finalAmount / 100 });
      if (parseInt(plan) > 1) {
        return res.json({ url: `${req.headers.origin}/mi-cuenta?email=${encodeURIComponent(email)}&order_id=${orderId}`, orderId });
      } else {
        return res.json({ url: `${req.headers.origin}/exito?order_id=${orderId}&test=true`, orderId });
      }
    }

    if (!priceData) {
      return res.status(400).json({ error: 'Plan no válido' });
    }

    // Create order in database
    const orderResult = await pool.query(
      'INSERT INTO orders (email, plan, properties_count, amount, status, affiliate_code, discount_amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      [email, plan, priceData.properties, finalAmount, 'pending', affiliate?.code || null, discountAmount]
    );
    const orderId = orderResult.rows[0].id;

    if (parseInt(plan) === 1) {
      await pool.query(
        `INSERT INTO submissions 
           (order_id, name, nif, nrua, address, province, phone, airbnb_file, booking_file, other_file, nrua_photo_base64, nrua_photo_name, extracted_stays, status, authorization_timestamp, authorization_ip, gdpr_accepted, gdpr_timestamp, gdpr_ip)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
        [
          orderId,
          formData?.name || null, null, formData?.nrua || null,
          formData?.address || null, formData?.province || null, formData?.phone || null,
          files?.airbnb ? JSON.stringify({ name: files.airbnbName, data: files.airbnb }) : null,
          files?.booking ? JSON.stringify({ name: files.bookingName, data: files.booking }) : null,
          files?.other ? JSON.stringify({ name: files.otherName, data: files.other }) : null,
          files?.nruaPhoto ? JSON.stringify({ name: files.nruaPhotoName, data: files.nruaPhoto }) : null,
          files?.nruaPhotoName || null,
          JSON.stringify(stays || []), 'pending',
          new Date(), req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          gdprConsent?.accepted || false, new Date(), req.headers['x-forwarded-for'] || req.socket.remoteAddress
        ]
      );
    }

    // Register pending affiliate referral
    if (affiliate) {
      const commissionAmount = Math.round(finalAmount * affiliate.commission_percent / 100);
      await pool.query(
        'INSERT INTO affiliate_referrals (affiliate_id, order_id, service_type, original_amount, discount_amount, commission_amount, status) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [affiliate.id, orderId, 'n2', priceData.amount, discountAmount, commissionAmount, 'pending']
      );
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: priceData.name,
            description: affiliate ? `Presentación NRUA - Descuento ${affiliate.discount_percent}%` : 'Presentación NRUA ante el Registro de la Propiedad',
          },
          unit_amount: finalAmount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: parseInt(plan) > 1 
        ? `${req.headers.origin}/mi-cuenta?email=${encodeURIComponent(email)}&order_id=${orderId}`
        : `${req.headers.origin}/exito?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${req.headers.origin}/formulario`,
      customer_email: email,
      metadata: { orderId: orderId.toString(), affiliateCode: affiliate?.code || '' }
    });

    await pool.query('UPDATE orders SET stripe_session_id = $1 WHERE id = $2', [session.id, orderId]);
    res.json({ url: session.url, orderId });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Error al crear sesión de pago' });
  }
});

app.delete('/api/admin/nrua-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT order_id FROM nrua_requests WHERE id = $1', [id]);
    const orderId = result.rows[0]?.order_id;
    await pool.query('DELETE FROM affiliate_referrals WHERE order_id = $1', [orderId]);
    await pool.query('DELETE FROM nrua_requests WHERE id = $1', [id]);
    if (orderId) await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/affiliate/payment-info', async (req, res) => {
  try {
    const { email, password, paymentInfo } = req.body;
    const result = await pool.query('SELECT * FROM affiliates WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'No encontrado' });
    const affiliate = result.rows[0];
    if (password !== affiliate.password_hash) return res.status(401).json({ error: 'Contraseña incorrecta' });
    await pool.query('UPDATE affiliates SET payment_info = $1 WHERE id = $2', [paymentInfo, affiliate.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/affiliate/track-click', async (req, res) => {
  try {
    const { code } = req.body;
    if (code) {
      await pool.query('UPDATE affiliates SET link_clicks = link_clicks + 1 WHERE code = $1 AND active = true', [code.toUpperCase()]);
    }
    res.json({ ok: true });
  } catch (error) {
    res.json({ ok: false });
  }
});
// ============================================
// SOLICITAR NRUA - Checkout 149€
// ============================================

app.post('/api/create-checkout-nrua', async (req, res) => {
  try {
    const { form, personType, hasLicense, lang, affiliateCode } = req.body;
    const email = form.email;

    if (!email) {
      return res.status(400).json({ error: 'Email obligatorio' });
    }

    const baseAmount = 14900;

    // Lookup affiliate
    let affiliate = null;
    let finalAmount = baseAmount;
    let discountAmount = 0;
    if (affiliateCode) {
      const affResult = await pool.query(
        'SELECT * FROM affiliates WHERE code = $1 AND active = true',
        [affiliateCode.toUpperCase()]
      );
      if (affResult.rows.length > 0) {
       affiliate = affResult.rows[0];
        const discountPercent = req.body.affiliateDiscount === 10 || req.body.affiliateDiscount === 20 ? req.body.affiliateDiscount : affiliate.discount_percent;
        discountAmount = Math.round(baseAmount * discountPercent / 100);
        finalAmount = baseAmount - discountAmount;
        console.log(`🎟️ Affiliate NRUA ${affiliate.code}: ${affiliate.discount_percent}% off`);
      }
    }

    if (email === 'demiandreu@gmail.com') {
      const orderResult = await pool.query(
        'INSERT INTO orders (email, plan, properties_count, amount, status, service_type, affiliate_code, discount_amount) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
        [email, 'nrua', 1, finalAmount, 'completed', 'nrua_request', affiliate?.code || null, discountAmount]
      );
      const orderId = orderResult.rows[0].id;

      await pool.query(
        `INSERT INTO nrua_requests 
         (order_id, person_type, name, surname, company_name, id_type, id_number,
          country, address, postal_code, province, municipality, email, phone,
          property_address, property_extra, property_postal_code, property_province, property_municipality,
          catastral_ref, cru, unit_type, category, residence_type, max_guests, equipped,
          has_license, license_number, authorization_accepted, authorization_timestamp, authorization_ip,
          gdpr_accepted, status, lang)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34)`,
        [
          orderId, personType,
          form.name || null, form.surname || null, form.companyName || null,
          form.idType || null, form.idNumber || null,
          form.country || null, form.address || null, form.postalCode || null,
          form.province || null, form.municipality || null,
          email, form.phone || null,
          form.propertyAddress || null, form.propertyExtra || null,
          form.propertyPostalCode || null, form.propertyProvince || null, form.propertyMunicipality || null,
          form.catastralRef || null, form.cru || null,
          form.unitType || null, form.category || null, form.residenceType || null,
          form.maxGuests ? parseInt(form.maxGuests) : null, form.equipped || null,
          hasLicense || null, form.licenseNumber || null,
          true, new Date(), req.headers['x-forwarded-for'] || req.socket.remoteAddress,
          true, 'completed', lang
        ]
      );

      if (affiliate) {
        const commissionAmount = Math.round(finalAmount * affiliate.commission_percent / 100);
        await pool.query(
          'INSERT INTO affiliate_referrals (affiliate_id, order_id, service_type, original_amount, discount_amount, commission_amount, status) VALUES ($1,$2,$3,$4,$5,$6,$7)',
          [affiliate.id, orderId, 'nrua', baseAmount, discountAmount, commissionAmount, 'completed']
        );
      }

  return res.json({ url: `${req.headers.origin}/exito?order_id=${orderId}&service=nrua`, orderId });
    }

    const orderResult = await pool.query(
      'INSERT INTO orders (email, plan, properties_count, amount, status, service_type, affiliate_code, discount_amount) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
      [email, 'nrua', 1, finalAmount, 'pending', 'nrua_request', affiliate?.code || null, discountAmount]
    );
    const orderId = orderResult.rows[0].id;

    await pool.query(
      `INSERT INTO nrua_requests 
       (order_id, person_type, name, surname, company_name, id_type, id_number,
        country, address, postal_code, province, municipality, email, phone,
        property_address, property_extra, property_postal_code, property_province, property_municipality,
        catastral_ref, cru, unit_type, category, residence_type, max_guests, equipped,
        has_license, license_number, authorization_accepted, authorization_timestamp, authorization_ip,
        gdpr_accepted, status, lang)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34)`,
      [
        orderId, personType,
        form.name || null, form.surname || null, form.companyName || null,
        form.idType || null, form.idNumber || null,
        form.country || null, form.address || null, form.postalCode || null,
        form.province || null, form.municipality || null,
        email, form.phone || null,
        form.propertyAddress || null, form.propertyExtra || null,
        form.propertyPostalCode || null, form.propertyProvince || null, form.propertyMunicipality || null,
        form.catastralRef || null, form.cru || null,
        form.unitType || null, form.category || null, form.residenceType || null,
        form.maxGuests ? parseInt(form.maxGuests) : null, form.equipped || null,
        hasLicense || null, form.licenseNumber || null,
        true, new Date(), req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        true, 'pending', lang
      ]
    );

    if (affiliate) {
      const commissionAmount = Math.round(finalAmount * affiliate.commission_percent / 100);
      await pool.query(
        'INSERT INTO affiliate_referrals (affiliate_id, order_id, service_type, original_amount, discount_amount, commission_amount, status) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [affiliate.id, orderId, 'nrua', baseAmount, discountAmount, commissionAmount, 'pending']
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'DedosFácil - Solicitud NRUA',
            description: affiliate ? `Solicitud NRUA - Descuento ${affiliate.discount_percent}%` : 'Gestión de solicitud del Número de Registro de Alquiler',
          },
          unit_amount: finalAmount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/exito?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&service=nrua`,
      cancel_url: `${req.headers.origin}/solicitar-nrua`,
      customer_email: email,
      metadata: { orderId: orderId.toString(), serviceType: 'nrua_request', affiliateCode: affiliate?.code || '' }
    });

    await pool.query('UPDATE orders SET stripe_session_id = $1 WHERE id = $2', [session.id, orderId]);
    res.json({ url: session.url, orderId });
  } catch (error) {
    console.error('NRUA Checkout error:', error);
    res.status(500).json({ error: 'Error al crear sesión de pago' });
  }
});

// =====================================================
// PARSEO DIRECTO DE CSV/XLSX + FALLBACK A CLAUDE AI
// Todos los idiomas europeos soportados
// =====================================================

function parseFileToRows(buffer, originalName) {
  const ext = (originalName || '').toLowerCase();
  
 if (ext.endsWith('.xlsx') || ext.endsWith('.xls')) {
    const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const allRows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    
    // Si la primera fila no tiene columnas reconocibles, buscar la fila de headers real
    if (allRows.length > 0) {
      const firstKeys = Object.keys(allRows[0]);
      const hasDateCol = firstKeys.some(k => {
        const kl = k.toLowerCase();
        return kl.includes('check') || kl.includes('fecha') || kl.includes('arrival') || 
               kl.includes('entrada') || kl.includes('night') || kl.includes('salida') ||
               kl.includes('departure') || kl.includes('anreise') || kl.includes('arrivée');
      });
      
      if (!hasDateCol) {
        // Probar con sheet_to_json usando range desde diferentes filas
        const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        for (let i = 1; i < Math.min(rawData.length, 10); i++) {
          const testRow = rawData[i];
          if (Array.isArray(testRow)) {
            const testStr = testRow.map(c => String(c).toLowerCase()).join('|');
            // Contar cuántas columnas reconocibles tiene esta fila (necesita mínimo 2)
let colMatches = 0;
for (const cell of testRow) {
  const cl = String(cell).toLowerCase().trim();
  if (cl === 'check-in' || cl === 'check in' || cl === 'checkin' || cl === 'arrival' || 
      cl === 'entrada' || cl === 'first night' || cl === 'fecha de inicio' || cl === 'fecha de entrada' ||
      cl === 'anreise' || cl === 'arrivée' || cl === 'arrivo' || cl === 'chegada' ||
      cl === 'check-out' || cl === 'check out' || cl === 'checkout' || cl === 'departure' ||
      cl === 'salida' || cl === 'fecha de salida' || cl === 'fecha de finalización' ||
      cl === 'adults' || cl === 'adultos' || cl === 'guests' || cl === 'huéspedes' ||
      cl === 'children' || cl === 'niños' || cl === 'menores') {
    colMatches++;
  }
}
if (colMatches >= 2) {
              // Esta fila es la de headers real
              const headers = testRow.map(c => String(c).trim());
              const dataRows = [];
              for (let j = i + 1; j < rawData.length; j++) {
                const row = {};
                headers.forEach((h, idx) => { row[h] = rawData[j]?.[idx] ?? ''; });
                dataRows.push(row);
              }
              console.log(`📋 XLSX: headers reales encontrados en fila ${i + 1}`);
              return dataRows;
            }
          }
        }
      }
    }
    
    return allRows;
  }
  
  // CSV parsing
  const text = buffer.toString('utf-8');
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  
  // Detect separator
  const firstLine = lines[0];
  let sep = ',';
  if (firstLine.split('\t').length > firstLine.split(',').length) sep = '\t';
  else if (firstLine.split(';').length > firstLine.split(',').length) sep = ';';
  
  const headers = parseCsvLine(firstLine, sep);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i], sep);
    const row = {};
    headers.forEach((h, idx) => { row[h.trim()] = (values[idx] || '').trim(); });
    rows.push(row);
  }
  return rows;
}

function parseCsvLine(line, sep) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === sep && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function normalizeDate(val) {
  if (!val) return null;
  
  // If Date object (from xlsx cellDates)
  if (val instanceof Date) {
    const d = val.getDate().toString().padStart(2, '0');
    const m = (val.getMonth() + 1).toString().padStart(2, '0');
    const y = val.getFullYear();
    if (y < 2000 || y > 2100) return null;
    return `${d}/${m}/${y}`;
  }
  
  const s = String(val).trim();
  if (!s) return null;
  

// DD/MM/YYYY or MM/DD/YYYY or DD-MM-YYYY or DD.MM.YYYY
let match = s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
if (match) {
    let d = parseInt(match[1]);
    let m = parseInt(match[2]);
    // If second number > 12, it must be MM/DD/YYYY (US format like Airbnb)
    if (m > 12 && d <= 12) {
      [d, m] = [m, d];
    }
    return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${match[3]}`;
}
  
  // YYYY-MM-DD
  match = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  
  // Month names in ALL European languages
  const months = {
    // English
    jan: '01', january: '01', feb: '02', february: '02', mar: '03', march: '03',
    apr: '04', april: '04', may: '05', jun: '06', june: '06',
    jul: '07', july: '07', aug: '08', august: '08', sep: '09', sept: '09', september: '09',
    oct: '10', october: '10', nov: '11', november: '11', dec: '12', december: '12',
    // Spanish
    ene: '01', enero: '01', febrero: '02', marzo: '03', abr: '04', abril: '04',
    mayo: '05', junio: '06', julio: '07', ago: '08', agosto: '08',
    septiembre: '09', octubre: '10', noviembre: '11', dic: '12', diciembre: '12',
    // French
    janvier: '01', fév: '02', février: '02', fevrier: '02', mars: '03', avril: '04',
    mai: '05', juin: '06', juillet: '07', août: '08', aout: '08',
    septembre: '09', octobre: '10', novembre: '11', décembre: '12', decembre: '12',
    // German
    januar: '01', jän: '01', jänner: '01', februar: '02', märz: '03', maerz: '03',
    juni: '06', juli: '07', oktober: '10', dezember: '12', dez: '12',
    // Italian
    gennaio: '01', febbraio: '02', aprile: '04', maggio: '05',
    giugno: '06', luglio: '07', settembre: '09',
    ottobre: '10', dicembre: '12',
    // Portuguese
    janeiro: '01', fevereiro: '02', março: '03', marco: '03', maio: '05',
    junho: '06', julho: '07', setembro: '09', outubro: '10', dezembro: '12',
    // Dutch
    januari: '01', februari: '02', maart: '03', mei: '05', augustus: '08',
    // Swedish
    maj: '05', augusti: '08',
    // Norwegian / Danish
    desember: '12',
    // Polish
    styczeń: '01', styczen: '01', luty: '02', marzec: '03', kwiecień: '04', kwiecien: '04',
    czerwiec: '06', lipiec: '07', sierpień: '08', sierpien: '08',
    wrzesień: '09', wrzesien: '09', październik: '10', pazdziernik: '10',
    listopad: '11', grudzień: '12', grudzien: '12',
    // Czech
    leden: '01', únor: '02', unor: '02', březen: '03', brezen: '03',
    duben: '04', květen: '05', kveten: '05', červen: '06', cerven: '06',
    červenec: '07', cervenec: '07', srpen: '08', září: '09', zari: '09',
    říjen: '10', rijen: '10', prosinec: '12',
    // Romanian
    ianuarie: '01', februarie: '02', martie: '03', aprilie: '04',
    iunie: '06', iulie: '07', septembrie: '09',
    // Finnish
    tammikuu: '01', helmikuu: '02', maaliskuu: '03', huhtikuu: '04',
    toukokuu: '05', kesäkuu: '06', kesakuu: '06', heinäkuu: '07', heinakuu: '07',
    elokuu: '08', syyskuu: '09', lokakuu: '10', marraskuu: '11', joulukuu: '12',
    // Hungarian
    január: '01', február: '02', március: '03', május: '05', majus: '05',
    június: '06', junius: '06', július: '07', julius: '07', augusztus: '08',
    szeptember: '09', október: '10',
    // Croatian / Serbian
    siječanj: '01', sijecanj: '01', veljača: '02', veljaca: '02',
    ožujak: '03', ozujak: '03', travanj: '04', svibanj: '05',
    lipanj: '06', srpanj: '07', kolovoz: '08', rujan: '09',
    studeni: '11', prosinac: '12',
  };
  
  // "24 May 2025"
  match = s.match(/^(\d{1,2})\s+(\w+)\s+(\d{4})$/i);
  if (match) {
    const monthKey = match[2].toLowerCase();
    const m = months[monthKey];
    if (m) return `${match[1].padStart(2, '0')}/${m}/${match[3]}`;
  }
  
  // "May 24, 2025"
  match = s.match(/^(\w+)\s+(\d{1,2}),?\s+(\d{4})$/i);
  if (match) {
    const monthKey = match[1].toLowerCase();
    const m = months[monthKey];
    if (m) return `${match[2].padStart(2, '0')}/${m}/${match[3]}`;
  }
  
  // "24. May 2025" (German format)
  match = s.match(/^(\d{1,2})\.\s*(\w+)\s+(\d{4})$/i);
  if (match) {
    const monthKey = match[2].toLowerCase();
    const m = months[monthKey];
    if (m) return `${match[1].padStart(2, '0')}/${m}/${match[3]}`;
  }
  
  return null;
}

// =====================================================
// COLUMN NAMES - ALL EUROPEAN LANGUAGES
// =====================================================

const CHECK_IN_NAMES = [
  // English
  'check-in', 'checkin', 'check in', 'arrival', 'start date', 'start', 'from',
  // Spanish
  'fecha de inicio', 'fecha de entrada', 'fecha entrada', 'entrada', 'llegada', 'inicio',
  // French
  'arrivée', 'arrivee', 'date d\'arrivée', 'date arrivee', 'début', 'debut',
  // German
  'anreise', 'ankunft', 'check-in datum', 'anreisedatum', 'von', 'ab',
  // Italian
  'arrivo', 'data arrivo', 'data di arrivo', 'ingresso',
  // Portuguese
  'chegada', 'data de chegada', 'data entrada',
  // Dutch
  'aankomst', 'inchecken', 'aankomstdatum',
  // Swedish
  'ankomst', 'incheckning', 'ankomstdatum',
  // Norwegian / Danish
  'innsjekk', 'ankomstdato',
  // Finnish
  'saapuminen', 'tulopäivä', 'tulopaiva',
  // Polish
  'przyjazd', 'zameldowanie', 'data przyjazdu',
  // Czech
  'příjezd', 'prijezd', 'datum příjezdu',
  // Hungarian
  'érkezés', 'erkezes', 'bejelentkezés',
  // Romanian
  'sosire', 'data sosirii',
  // Croatian
  'dolazak', 'prijava',
  // Russian
  'заезд', 'дата заезда', 'прибытие',
  // Beds24 / Channel managers
  'first night', 'first_night',
];

const CHECK_OUT_NAMES = [
  // English
  'check-out', 'checkout', 'check out', 'departure', 'end date', 'end', 'to', 'last night',
  // Spanish
  'fecha de finalización', 'fecha de finalizacion', 'fecha de salida', 'fecha salida', 'salida', 'hasta', 'fin',
  // French
  'départ', 'depart', 'date de départ', 'date depart', 'fin',
  // German
  'abreise', 'abreisedatum', 'check-out datum', 'bis',
  // Italian
  'partenza', 'data partenza', 'data di partenza', 'uscita',
  // Portuguese
  'saída', 'saida', 'data de saída', 'data saida', 'data de saida',
  // Dutch
  'vertrek', 'uitchecken', 'vertrekdatum',
  // Swedish
  'avresa', 'utcheckning', 'avresedatum',
  // Norwegian / Danish
  'avreise', 'utsjekk', 'avreisedato',
  // Finnish
  'lähtö', 'lahto', 'lähtöpäivä',
  // Polish
  'wyjazd', 'wymeldowanie', 'data wyjazdu',
  // Czech
  'odjezd', 'datum odjezdu',
  // Hungarian
  'távozás', 'tavozas', 'kijelentkezés',
  // Romanian
  'plecare', 'data plecarii',
  // Croatian
  'odlazak', 'odjava',
  // Russian
  'выезд', 'дата выезда', 'отъезд',
];

const ADULTS_NAMES = [
  // English
  'adults', 'adult', 'number of adults',
  // Spanish
  'adultos', 'n.º de adultos', 'nº de adultos', 'número de adultos', 'num adultos',
  // French
  'adultes', 'nombre d\'adultes',
  // German
  'erwachsene', 'anzahl erwachsene',
  // Italian
  'adulti', 'numero adulti',
  // Portuguese
  'adultos',
  // Dutch
  'volwassenen',
  // Swedish
  'vuxna', 'antal vuxna',
  // Norwegian / Danish
  'voksne',
  // Finnish
  'aikuiset',
  // Polish
  'dorośli', 'dorosli',
  // Czech
  'dospělí', 'dospeli',
  // Hungarian
  'felnőttek',
  // Romanian
  'adulți',
  // Croatian
  'odrasli',
  // Russian
  'взрослые',
];

const CHILDREN_NAMES = [
  // English
  'children', 'child', 'kids', 'number of children',
  // Spanish
  'niños', 'ninos', 'menores', 'n.º de niños', 'nº de niños', 'número de niños', 'num niños',
  // French
  'enfants', 'nombre d\'enfants',
  // German
  'kinder', 'anzahl kinder',
  // Italian
  'bambini', 'numero bambini',
  // Portuguese
  'crianças', 'criancas',
  // Dutch
  'kinderen',
  // Swedish
  'barn', 'antal barn',
  // Norwegian / Danish
  'børn', 'born',
  // Finnish
  'lapset',
  // Polish
  'dzieci',
  // Czech
  'děti', 'deti',
  // Hungarian
  'gyermekek',
  // Romanian
  'copii',
  // Croatian
  'djeca',
  // Russian
  'дети',
];

const BABIES_NAMES = [
  // English
  'infants', 'babies', 'number of infants',
  // Spanish
  'bebés', 'bebes', 'n.º de bebés', 'nº de bebés', 'número de bebés', 'num bebés',
  // French
  'bébés', 'nourrissons', 'nombre de bébés',
  // German
  'kleinkinder', 'säuglinge', 'anzahl kleinkinder',
  // Italian
  'neonati',
  // Portuguese
  'bebês', 'bebes',
  // Dutch
  'baby\'s',
  // Swedish
  'spädbarn',
  // Norwegian
  'spedbarn',
  // Finnish
  'vauvat',
  // Polish
  'niemowlęta', 'niemowleta',
  // Czech
  'kojenci',
  // Hungarian
  'csecsemők',
  // Romanian
  'bebeluși',
  // Croatian
  'dojenčad',
  // Russian
  'младенцы',
];

const GUESTS_NAMES = [
  // English
  'guests', 'people', 'occupancy', 'number of guests', 'pax',
  // Spanish
  'huéspedes', 'huespedes', 'personas',
  // French
  'voyageurs', 'personnes',
  // German
  'gäste', 'gaste', 'personen',
  // Italian
  'ospiti', 'persone',
  // Portuguese
  'hóspedes', 'hospedes', 'pessoas',
  // Dutch
  'gasten', 'personen',
  // Swedish
  'gäster', 'gaster', 'antal gäster',
  // Norwegian / Danish
  'gjester',
  // Finnish
  'vieraat',
  // Polish
  'goście', 'goscie',
  // Czech
  'hosté', 'hoste',
  // Hungarian
  'vendégek', 'vendegek',
  // Romanian
  'oaspeți', 'oaspeti',
  // Croatian
  'gosti',
  // Russian
  'гости',
];

const STATUS_NAMES = [
  'status', 'estado', 'statut', 'stato',
  'tillstånd', 'stav', 'állapot', 'stare', 'статус',
  'reservation status', 'booking status',
];

function findColumn(headers, candidates) {
  const lower = headers.map(h => h.toLowerCase().trim());
  
  // Primero buscar coincidencia exacta
  for (const c of candidates) {
    const cl = c.toLowerCase();
    const idx = lower.findIndex(h => h === cl);
    if (idx >= 0) return headers[idx];
  }
  
  // Luego buscar con includes, pero solo para candidatos de 4+ caracteres
  for (const c of candidates) {
    const cl = c.toLowerCase();
    if (cl.length < 4) continue; // Ignorar "to", "ab", "von", "fin", "bis" etc.
    const idx = lower.findIndex(h => h.includes(cl));
    if (idx >= 0) return headers[idx];
  }
  
  return null;
}

function isCancelled(row) {
  const vals = Object.values(row).map(v => String(v).toLowerCase());
  return vals.some(v => 
    v === 'cancelada' || v === 'cancelled' || v === 'canceled' || 
    v === 'cancel' || v === 'no_show' || v === 'no show' ||
    v === 'annulée' || v === 'annulee' || v === 'annulé' ||
    v === 'storniert' || v === 'geannuleerd' ||
    v === 'cancellato' || v === 'cancelado' ||
    v === 'avbokad' || v === 'avbestilt' || v === 'peruutettu' ||
    v === 'anulowane' || v === 'zrušeno' || v === 'zruseno' ||
    v === 'lemondva' || v === 'anulat' || v === 'otkazano' ||
    v === 'отменено'
  );
}

// =====================================================
// PLATFORM-SPECIFIC PROCESSORS
// =====================================================

function processAirbnb(rows) {
  if (!rows.length) return null;
  const headers = Object.keys(rows[0]);
  console.log('📋 Airbnb headers:', JSON.stringify(headers));
  console.log('📋 Airbnb headers:', headers);
console.log('📋 CheckIn found:', findColumn(headers, CHECK_IN_NAMES));
console.log('📋 CheckOut found:', findColumn(headers, CHECK_OUT_NAMES));
  
  const checkInCol = findColumn(headers, CHECK_IN_NAMES);
  const checkOutCol = findColumn(headers, CHECK_OUT_NAMES);
  const adultsCol = findColumn(headers, ADULTS_NAMES);
  const childrenCol = findColumn(headers, CHILDREN_NAMES);
  const babiesCol = findColumn(headers, BABIES_NAMES);
  const guestsCol = findColumn(headers, GUESTS_NAMES);
  const statusCol = findColumn(headers, STATUS_NAMES);
  
  if (!checkInCol || !checkOutCol) return null;
  
  const estancias = [];
  for (const row of rows) {
    if (statusCol) {
      const status = String(row[statusCol]).toLowerCase();
      if (status.includes('cancel') || status.includes('anulad') || status.includes('annul') || status.includes('stornier')) continue;
    }
    if (isCancelled(row)) continue;
    
    const fechaEntrada = normalizeDate(row[checkInCol]);
    const fechaSalida = normalizeDate(row[checkOutCol]);
    if (!fechaEntrada || !fechaSalida) continue;
    
    let guests = 2;
    if (adultsCol) {
      const adults = parseInt(row[adultsCol]) || 0;
      const children = childrenCol ? (parseInt(row[childrenCol]) || 0) : 0;
      const babies = babiesCol ? (parseInt(row[babiesCol]) || 0) : 0;
      guests = adults + children + babies;
    } else if (guestsCol) {
      guests = parseInt(row[guestsCol]) || 2;
    }
    if (guests < 1) guests = 2;
    
    estancias.push({ fecha_entrada: fechaEntrada, fecha_salida: fechaSalida, huespedes: guests, plataforma: 'Airbnb' });
  }
  
  return estancias.length > 0 ? { estancias, total_estancias: estancias.length } : null;
}

function processBooking(rows) {
  if (!rows.length) return null;
  const headers = Object.keys(rows[0]);
  console.log('📋 Booking headers:', JSON.stringify(headers));
  
  const checkInCol = findColumn(headers, CHECK_IN_NAMES);
  const checkOutCol = findColumn(headers, CHECK_OUT_NAMES);
  const guestsCol = findColumn(headers, GUESTS_NAMES);
  const adultsCol = findColumn(headers, ADULTS_NAMES);
  const childrenCol = findColumn(headers, CHILDREN_NAMES);
  const statusCol = findColumn(headers, STATUS_NAMES);
  
  if (!checkInCol || !checkOutCol) return null;
  
  const estancias = [];
  for (const row of rows) {
    if (statusCol) {
      const status = String(row[statusCol]).toLowerCase();
      if (status.includes('cancel') || status.includes('no_show') || status.includes('no show') || status.includes('annul') || status.includes('stornier')) continue;
    }
    if (isCancelled(row)) continue;
    
    const fechaEntrada = normalizeDate(row[checkInCol]);
    const fechaSalida = normalizeDate(row[checkOutCol]);
    if (!fechaEntrada || !fechaSalida) continue;
    
    let guests = 2;
    if (adultsCol) {
      const adults = parseInt(row[adultsCol]) || 0;
      const children = childrenCol ? (parseInt(row[childrenCol]) || 0) : 0;
      guests = adults + children;
    } else if (guestsCol) {
      guests = parseInt(row[guestsCol]) || 2;
    }
    if (guests < 1) guests = 2;
    
    estancias.push({ fecha_entrada: fechaEntrada, fecha_salida: fechaSalida, huespedes: guests, plataforma: 'Booking' });
  }
  
  return estancias.length > 0 ? { estancias, total_estancias: estancias.length } : null;
}

function processVrbo(rows) {
  if (!rows.length) return null;
  const headers = Object.keys(rows[0]);
  
  const checkInCol = findColumn(headers, CHECK_IN_NAMES);
  const checkOutCol = findColumn(headers, CHECK_OUT_NAMES);
  const adultsCol = findColumn(headers, ADULTS_NAMES);
  const childrenCol = findColumn(headers, CHILDREN_NAMES);
  const guestsCol = findColumn(headers, GUESTS_NAMES);
  const statusCol = findColumn(headers, STATUS_NAMES);
  
  if (!checkInCol || !checkOutCol) return null;
  
  const estancias = [];
  for (const row of rows) {
    if (statusCol) {
      const status = String(row[statusCol]).toLowerCase();
      if (status.includes('cancel') || status.includes('rechaz') || status.includes('decline') || status.includes('annul') || status.includes('stornier')) continue;
    }
    if (isCancelled(row)) continue;
    
    const fechaEntrada = normalizeDate(row[checkInCol]);
    const fechaSalida = normalizeDate(row[checkOutCol]);
    if (!fechaEntrada || !fechaSalida) continue;
    
    let guests = 2;
    if (adultsCol) {
      const adults = parseInt(row[adultsCol]) || 0;
      const children = childrenCol ? (parseInt(row[childrenCol]) || 0) : 0;
      guests = adults + children;
    } else if (guestsCol) {
      guests = parseInt(row[guestsCol]) || 2;
    }
    if (guests < 1) guests = 2;
    
    estancias.push({ fecha_entrada: fechaEntrada, fecha_salida: fechaSalida, huespedes: guests, plataforma: 'VRBO' });
  }
  
  return estancias.length > 0 ? { estancias, total_estancias: estancias.length } : null;
}

function processGeneric(rows) {
  if (!rows.length) return null;
  const headers = Object.keys(rows[0]);
  
  const checkInCol = findColumn(headers, CHECK_IN_NAMES);
  const checkOutCol = findColumn(headers, CHECK_OUT_NAMES);
  const adultsCol = findColumn(headers, ADULTS_NAMES);
  const childrenCol = findColumn(headers, CHILDREN_NAMES);
  const guestsCol = findColumn(headers, GUESTS_NAMES);
  const statusCol = findColumn(headers, STATUS_NAMES);
  
  if (!checkInCol || !checkOutCol) return null;
  
  const estancias = [];
  for (const row of rows) {
    if (statusCol) {
      const status = String(row[statusCol]).toLowerCase();
      if (status.includes('cancel') || status.includes('annul') || status.includes('stornier')) continue;
    }
    if (isCancelled(row)) continue;
    
    const fechaEntrada = normalizeDate(row[checkInCol]);
    const fechaSalida = normalizeDate(row[checkOutCol]);
    if (!fechaEntrada || !fechaSalida) continue;
    
    let guests = 2;
    if (adultsCol) {
      const adults = parseInt(row[adultsCol]) || 0;
      const children = childrenCol ? (parseInt(row[childrenCol]) || 0) : 0;
      guests = adults + children;
    } else if (guestsCol) {
      guests = parseInt(row[guestsCol]) || 2;
    }
    if (guests < 1) guests = 2;
    
    estancias.push({ fecha_entrada: fechaEntrada, fecha_salida: fechaSalida, huespedes: guests, plataforma: 'Otro' });
  }
  
  return estancias.length > 0 ? { estancias, total_estancias: estancias.length } : null;
}

// =====================================================
// FALLBACK A CLAUDE AI (si el parseo directo falla)
// =====================================================

async function processWithClaude(fileContent, platform) {
  try {
    console.log(`⚠️ Fallback a Claude AI para archivo ${platform} (columnas no reconocidas)`);
    
    // Limitar contenido para no exceder tokens
    const maxChars = 15000;
    const truncated = fileContent.length > maxChars 
      ? fileContent.substring(0, maxChars) + '\n... (truncado)' 
      : fileContent;
    
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{
        role: 'user',
        content: `Analiza este archivo de reservas y extrae TODAS las estancias.

DETECTA AUTOMÁTICAMENTE las columnas buscando fechas de entrada/salida y número de huéspedes.

REGLAS:
- Si hay columnas separadas de adultos/niños/bebés, SUMA todos para el total
- Si no encuentras número de huéspedes, pon 2 por defecto
- Ignora reservas canceladas (cualquier variación de "cancel" en cualquier idioma)
- Incluye TODAS las estancias del archivo
- Convierte TODAS las fechas a formato DD/MM/YYYY

IMPORTANTE: Devuelve ÚNICAMENTE un JSON válido, sin texto adicional, sin markdown, sin backticks:
{"estancias":[{"fecha_entrada":"DD/MM/YYYY","fecha_salida":"DD/MM/YYYY","huespedes":2,"plataforma":"${platform}"}],"total_estancias":0}

Archivo:
${truncated}`
      }]
    });
    
    const responseText = response.content[0].text;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      console.log(`✅ Claude AI extrajo ${data.estancias?.length || 0} estancias para ${platform}`);
      return data;
    }
    return null;
  } catch (error) {
    console.error(`❌ Error en fallback Claude AI para ${platform}:`, error.message);
    return null;
  }
}

// =====================================================
// ENDPOINT PRINCIPAL
// =====================================================

app.post('/api/process-csv', upload.fields([
  { name: 'airbnb', maxCount: 1 },
  { name: 'booking', maxCount: 1 },
  { name: 'vrbo', maxCount: 1 },
  { name: 'other', maxCount: 1 }
]), async (req, res) => {
  try {
    const files = req.files;
    let airbnbData = null;
    let bookingData = null;
    let vrboData = null;
    let otherData = null;

    // AIRBNB - parseo directo, fallback a Claude
    if (files.airbnb?.[0]) {
      const rows = parseFileToRows(files.airbnb[0].buffer, files.airbnb[0].originalname);
      airbnbData = processAirbnb(rows);
      if (!airbnbData) {
        const content = files.airbnb[0].buffer.toString('utf-8');
        airbnbData = await processWithClaude(content, 'Airbnb');
      }
    }

    // BOOKING - parseo directo, fallback a Claude
    if (files.booking?.[0]) {
      const rows = parseFileToRows(files.booking[0].buffer, files.booking[0].originalname);
      bookingData = processBooking(rows);
      if (!bookingData) {
        const content = files.booking[0].buffer.toString('utf-8');
        bookingData = await processWithClaude(content, 'Booking');
      }
    }

    // VRBO - parseo directo, fallback a Claude
    if (files.vrbo?.[0]) {
      const rows = parseFileToRows(files.vrbo[0].buffer, files.vrbo[0].originalname);
      vrboData = processVrbo(rows);
      if (!vrboData) {
        const content = files.vrbo[0].buffer.toString('utf-8');
        vrboData = await processWithClaude(content, 'VRBO');
      }
    }

    // OTHER - parseo directo, fallback a Claude
    if (files.other?.[0]) {
      const rows = parseFileToRows(files.other[0].buffer, files.other[0].originalname);
      otherData = processGeneric(rows);
      if (!otherData) {
        const content = files.other[0].buffer.toString('utf-8');
        otherData = await processWithClaude(content, 'Otro');
      }
    }

    res.json({
      success: true,
      airbnb: airbnbData,
      booking: bookingData,
      vrbo: vrboData,
      other: otherData
    });
  } catch (error) {
    console.error('Process CSV error:', error);
    res.status(500).json({ error: 'Error al procesar archivos' });
  }
});

// Save submission
app.post('/api/submissions', async (req, res) => {
  try {
    const { orderId, nif, name, airbnbData, bookingData } = req.body;

    const result = await pool.query(
      'INSERT INTO submissions (order_id, nif, name, airbnb_data, booking_data) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [orderId, nif, name, JSON.stringify(airbnbData), JSON.stringify(bookingData)]
    );

    res.json({ success: true, submissionId: result.rows[0].id });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ error: 'Error al guardar datos' });
  }
});

// Get order status
app.get('/api/orders/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Error al obtener orden' });
  }
});

// Obtener datos para factura
app.get('/api/factura/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params
    const result = await pool.query(
      `SELECT o.id, o.email, o.amount, o.properties_count, o.created_at, s.name, s.phone
       FROM orders o
       LEFT JOIN submissions s ON s.order_id = o.id
       WHERE o.id = $1 AND o.status IN ('completed', 'enviado')`,
      [orderId]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Factura no encontrada' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get authorization data for PDF
app.get('/api/admin/authorization/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { submissionId } = req.query;

    const result = submissionId
      ? await pool.query(
          `SELECT
            s.name, s.nrua, s.address, s.province, s.phone,
            s.authorization_timestamp, s.authorization_ip,
            s.gdpr_accepted, s.gdpr_timestamp, s.gdpr_ip,
            o.email
           FROM submissions s
           JOIN orders o ON o.id = s.order_id
           WHERE s.id = $1`,
          [submissionId]
        )
      : await pool.query(
          `SELECT
            s.name, s.nrua, s.address, s.province, s.phone,
            s.authorization_timestamp, s.authorization_ip,
            s.gdpr_accepted, s.gdpr_timestamp, s.gdpr_ip,
            o.email
           FROM submissions s
           JOIN orders o ON o.id = s.order_id
           WHERE s.order_id = $1`,
          [orderId]
        );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Authorization data error:', error);
    res.status(500).json({ error: 'Error al obtener datos' });
  }
});

// ============================================
// ADMIN ENDPOINTS - Añade esto a server/index.js
// ============================================

// Get all orders with submissions
app.get('/api/admin/orders', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        o.id,
        o.email,
        o.plan,
        o.properties_count,
        o.amount,
        o.status,
        o.created_at,
        o.completed_at,
        s.id as submission_id,
        s.name,
        s.nrua,
        s.address,
        s.province,
        s.phone,
        s.airbnb_file IS NOT NULL as has_airbnb,
        s.booking_file IS NOT NULL as has_booking,
        s.other_file IS NOT NULL as has_other,
        s.nrua_photo_name,
        s.nrua_photo_base64 IS NOT NULL as has_nrua_photo,
        s.extracted_stays,
        COALESCE(jsonb_array_length(s.extracted_stays), 0) as stays_count
      FROM orders o
      LEFT JOIN submissions s ON s.order_id = o.id
      WHERE (o.service_type IS NULL OR o.service_type = 'n2')
      ORDER BY o.id DESC, s.id ASC
    `);

    // Group submissions by order
    const ordersMap = new Map();
    for (const row of result.rows) {
      if (!ordersMap.has(row.id)) {
        ordersMap.set(row.id, {
          id: row.id,
          email: row.email,
          plan: row.plan,
          properties_count: row.properties_count,
          amount: row.amount,
          status: row.status,
          created_at: row.created_at,
          completed_at: row.completed_at,
          submissions: []
        });
      }
      if (row.submission_id) {
        ordersMap.get(row.id).submissions.push({
          id: row.submission_id,
          name: row.name,
          nrua: row.nrua,
          address: row.address,
          province: row.province,
          phone: row.phone,
          has_airbnb: row.has_airbnb,
          has_booking: row.has_booking,
          has_other: row.has_other,
          nrua_photo_name: row.nrua_photo_name,
          has_nrua_photo: row.has_nrua_photo,
          extracted_stays: row.extracted_stays,
          stays_count: parseInt(row.stays_count) || 0
        });
      }
    }

    // Convert to array with backward-compat flat fields from first submission
    const orders = [...ordersMap.values()].map(order => {
      const first = order.submissions[0] || {};
      return {
        ...order,
        name: first.name,
        nrua: first.nrua,
        address: first.address,
        province: first.province,
        phone: first.phone,
        has_airbnb: first.has_airbnb,
        has_booking: first.has_booking,
        has_other: first.has_other,
        nrua_photo_name: first.nrua_photo_name,
        has_nrua_photo: first.has_nrua_photo,
        extracted_stays: first.extracted_stays,
        stays_count: first.stays_count || 0
      };
    });

    res.json(orders);
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});
// Download file (airbnb, booking, or other)
app.get('/api/admin/download/:orderId/:fileType', async (req, res) => {
  try {
    const { orderId, fileType } = req.params;
    const { submissionId } = req.query;

 const columnMap = {
      airbnb: 'airbnb_file',
      booking: 'booking_file',
      other: 'other_file',
      nruaPhoto: 'nrua_photo_base64'
    };

    const column = columnMap[fileType];
    if (!column) {
      return res.status(400).json({ error: 'Tipo de archivo no válido' });
    }

    const result = submissionId
      ? await pool.query(`SELECT ${column} as file_data FROM submissions WHERE id = $1`, [submissionId])
      : await pool.query(`SELECT ${column} as file_data FROM submissions WHERE order_id = $1`, [orderId]);
    
    if (result.rows.length === 0 || !result.rows[0].file_data) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    
    const fileData = result.rows[0].file_data;
    
    // Parse JSON if stored as JSON with name and data
    let data, filename;
    try {
      const parsed = typeof fileData === 'string' ? JSON.parse(fileData) : fileData;
      data = parsed.data;
      filename = parsed.name || `${fileType}_order_${orderId}.csv`;
    } catch {
      // If not JSON, assume it's the raw base64
      data = fileData;
      filename = `${fileType}_order_${orderId}.csv`;
    }
    
    res.json({ data, filename });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Error al descargar archivo' });
  }
});

// Generate N2 CSV from extracted stays
app.get('/api/admin/generate-n2-csv/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { submissionId } = req.query;

    const result = submissionId
      ? await pool.query(
          `SELECT s.nrua, s.extracted_stays, o.email
           FROM submissions s
           JOIN orders o ON o.id = s.order_id
           WHERE s.id = $1`,
          [submissionId]
        )
      : await pool.query(
          `SELECT s.nrua, s.extracted_stays, o.email
           FROM submissions s
           JOIN orders o ON o.id = s.order_id
           WHERE s.order_id = $1`,
          [orderId]
        );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    const { nrua, extracted_stays } = result.rows[0];
    const stays = extracted_stays || [];
    
    if (stays.length === 0) {
      return res.status(400).json({ error: 'No hay estancias para exportar' });
    }
    
    // Purpose codes for N2
    const purposeMap = {
      'Vacacional/Turístico': '1',
      'vacation': '1',
      'Laboral': '2',
      'work': '2',
      'Estudios': '3',
      'study': '3',
      'Tratamiento médico': '4',
      'medical': '4',
      'Otros': '5',
      'other': '5'
    };
    
    // Format date to dd/MM/yyyy
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      // Try different formats
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        // Try DD/MM/YYYY format
        const parts = dateStr.split(/[\/\-\.]/);
        if (parts.length === 3) {
          // Assume DD/MM/YYYY
          return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
        }
        return dateStr;
      }
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    
    // Generate CSV
    // Format: NRUA;checkin;checkout;huéspedes;código_finalidad
    const csvLines = [];
    
    stays.forEach(stay => {
      const checkIn = formatDate(stay.fecha_entrada || stay.checkIn);
      const checkOut = formatDate(stay.fecha_salida || stay.checkOut);
      const guests = stay.huespedes || stay.guests || '2';
      const purpose = purposeMap[stay.finalidad || stay.purpose] || '1';
      
      csvLines.push(`${nrua || 'NRUA_PENDIENTE'};${checkIn};${checkOut};${guests};${purpose}`);
    });
    
    const csv = csvLines.join('\n');
    const filename = `N2_order_${orderId}_${nrua || 'pendiente'}.csv`;
    
    res.json({ csv, filename });
  } catch (error) {
    console.error('Generate N2 CSV error:', error);
    res.status(500).json({ error: 'Error al generar CSV' });
  }
});

// Update NRUA number
app.post('/api/admin/update-nrua/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { nrua, submissionId } = req.body;

    if (submissionId) {
      await pool.query('UPDATE submissions SET nrua = $1 WHERE id = $2', [nrua, submissionId]);
    } else {
      await pool.query('UPDATE submissions SET nrua = $1 WHERE order_id = $2', [nrua, orderId]);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update NRUA error:', error);
    res.status(500).json({ error: 'Error al actualizar NRUA' });
  }
});

// Update stays from admin
app.post('/api/admin/update-stays/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { stays, submissionId } = req.body;

    if (submissionId) {
      await pool.query('UPDATE submissions SET extracted_stays = $1 WHERE id = $2', [JSON.stringify(stays), submissionId]);
    } else {
      await pool.query('UPDATE submissions SET extracted_stays = $1 WHERE order_id = $2', [JSON.stringify(stays), orderId]);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update stays error:', error);
    res.status(500).json({ error: 'Error al actualizar estancias' });
  }
});

// Upload justificante and send email with everything

app.post('/api/admin/send-justificante/:orderId', express.json({ limit: '50mb' }), async (req, res) => {
  try {
    const { orderId } = req.params;
    const { pdfs, pdfBase64, pdfName } = req.body;

    // Support both old format (single) and new format (array)
    let pdfList = [];
    if (pdfs && Array.isArray(pdfs)) {
      pdfList = pdfs;
    } else if (pdfBase64) {
      pdfList = [{ data: pdfBase64, name: pdfName || `Justificante_N2_DF-${orderId}.pdf` }];
    }

    if (pdfList.length === 0) {
      return res.status(400).json({ error: 'No se han adjuntado PDFs' });
    }

    // Get order data
    const result = await pool.query(
      `SELECT o.email, o.amount, o.properties_count, o.status, s.name 
       FROM orders o 
       LEFT JOIN submissions s ON s.order_id = o.id 
       WHERE o.id = $1
       LIMIT 1`,
      [orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const { email, name, amount, properties_count } = result.rows[0];
    const facturaUrl = `https://dedosfacil.es/factura/${orderId}`;
    const reviewUrl = `https://dedosfacil.es/valoracion?order_id=${orderId}`;

    // Save first PDF in database (for reference)
    const firstPdfData = pdfList[0].data;
    await pool.query(
      'UPDATE submissions SET justificante_pdf = $1, justificante_sent_at = NOW() WHERE order_id = $2',
      [firstPdfData, orderId]
    );

    // Update status
    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['enviado', orderId]);
    await pool.query('UPDATE submissions SET status = $1 WHERE order_id = $2', ['enviado', orderId]);

    // Build attachments array
    const attachments = pdfList.map((pdf, i) => {
      const base64Data = pdf.data.includes(',') ? pdf.data.split(',')[1] : pdf.data;
      return {
        filename: pdf.name || `Justificante_N2_${i + 1}_DF-${orderId}.pdf`,
        content: base64Data,
        type: 'application/pdf'
      };
    });

    // Send email with all PDFs attached
    await resend.emails.send({
      from: 'DedosFácil <noreply@dedosfacil.es>',
      // to: email, // TESTING: descomentado para producción
      to: 'support@dedosfacil.es',
      subject: `[TEST → ${email}] 📄 Justificante${pdfList.length > 1 ? 's' : ''} Modelo N2 - Pedido DF-${orderId}`,
      attachments,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #10b981 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">DedosFácil</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #10b981; margin-top: 0;">✅ ¡Tu${pdfList.length > 1 ? 's' : ''} Modelo N2 ha${pdfList.length > 1 ? 'n' : ''} sido presentado${pdfList.length > 1 ? 's' : ''}!</h2>
            <p>Hola${name ? ' ' + name : ''}, te confirmamos que hemos completado la presentación de tu${pdfList.length > 1 ? 's' : ''} Modelo N2.</p>
            
            <div style="background: #1e3a5f; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 14px;">Referencia</span><br>
              <strong style="font-size: 28px;">DF-${orderId}</strong>
            </div>

            <div style="background: #d1fae5; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 16px;">📎 <strong>${pdfList.length} justificante${pdfList.length > 1 ? 's' : ''} adjunto${pdfList.length > 1 ? 's' : ''} a este email</strong></p>
              <p style="margin: 0; font-size: 13px; color: #065f46;">Documento(s) emitido(s) por Registradores de España.</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <h3 style="margin-top: 0;">📋 Resumen</h3>
              <p><strong>Plan:</strong> ${properties_count} Propiedad(es)</p>
              <p><strong>Importe:</strong> ${amount / 100}€</p>
              <p><strong>Estado:</strong> ✅ Presentado</p>
            </div>

           <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bae6fd; font-size: 13px; color: #1e3a5f; line-height: 1.6;">
  <p style="margin: 0 0 12px; font-weight: 600; font-size: 14px;">ℹ️ Información importante sobre su justificante de presentación</p>
  
  <p style="margin: 0 0 10px;">El documento adjunto constituye el <strong>acuse de presentación del Modelo Informativo de Arrendamientos de Corta Duración (Modelo N2)</strong> ante el Registro de la Propiedad, conforme a lo establecido en el artículo 10.4 del Real Decreto 1312/2024 y la Orden VAU/1560/2025. Este acuse es el <strong>único comprobante oficial</strong> que certifica que su declaración ha sido presentada correctamente dentro del plazo establecido.</p>
  
  <p style="margin: 0 0 10px;">Si desea verificar la autenticidad de este documento, puede hacerlo acudiendo a <strong>cualquier oficina del Registro de la Propiedad en España</strong>, donde le confirmarán que la presentación consta debidamente registrada.</p>
  
  <p style="margin: 0 0 10px;">Es importante que sepa que, en cumplimiento del <strong>Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos Personales</strong>, el acuse de presentación no refleja datos identificativos del inmueble como la dirección, número de apartamento u otros datos personales del titular. Esta es la práctica habitual del Registro y no afecta en absoluto a la validez de la presentación.</p>
  
  <p style="margin: 0 0 10px;">Asimismo, le informamos de que la <strong>tasa registral de 32€</strong> correspondiente a esta presentación ya ha sido abonada por nuestra parte. <strong>No es necesario que realice ninguna gestión adicional</strong>; su obligación de presentación del Modelo N2 para el ejercicio 2025 queda cumplida con este trámite.</p>
  
  <p style="margin: 0;">Por último, le comunicamos que en determinados casos, dependiendo de la oficina registral, es posible que el Registro solicite una <strong>autorización firmada del titular de la vivienda a favor del gestor</strong> que realizó la presentación en su nombre. En caso de que esto ocurra, nos pondremos en contacto con usted y le enviaremos a este mismo correo electrónico un documento de <strong>firma electrónica</strong> para que lo firme de forma rápida y sencilla. Hasta entonces, no es necesario que haga nada al respecto.</p>
</div>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${facturaUrl}" 
                 style="display: inline-block; padding: 14px 32px; background: #1e3a5f; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                📄 Ver Factura
              </a>
            </div>

            <div style="background: #fffbeb; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <p style="margin: 0 0 12px 0; font-size: 16px;"><strong>¿Qué tal tu experiencia?</strong></p>
              <p style="margin: 0 0 16px 0; color: #6b7280;">Solo tardas 30 segundos. Tu opinión nos ayuda mucho.</p>
              <a href="${reviewUrl}" 
                 style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f97316, #f59e0b); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                ⭐ Dejar valoración
              </a>
            </div>

            <p style="color: #6b7280; font-size: 13px;">
              ¿Dudas? Escríbenos a <a href="mailto:support@dedosfacil.es">support@dedosfacil.es</a> indicando tu referencia DF-${orderId}.
            </p>
          </div>
        </div>
      `
    });

    console.log(`📧 ${pdfList.length} justificante(s) enviado(s) a: ${email}`);
    res.json({ success: true, email });
  } catch (error) {
    console.error('Send justificante error:', error);
    res.status(500).json({ error: 'Error al enviar justificante' });
  }
});

// Update order status
app.post('/api/admin/update-status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'completed', 'enviado'].includes(status)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }
    
    await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2',
      [status, orderId]
    );
    
    await pool.query(
      'UPDATE submissions SET status = $1 WHERE order_id = $2',
      [status, orderId]
    );

    // Cuando se marca como "enviado", enviar email con justificante + valoración
    if (status === 'enviado') {
      try {
        const result = await pool.query(
          `SELECT o.email, o.amount, o.properties_count, s.name 
           FROM orders o 
           LEFT JOIN submissions s ON s.order_id = o.id 
           WHERE o.id = $1`,
          [orderId]
        );

        if (result.rows.length > 0) {
          const { email, name, amount, properties_count } = result.rows[0];
          const facturaUrl = `https://dedosfacil.es/factura/${orderId}`;
          const reviewUrl = `https://dedosfacil.es/valoracion?order_id=${orderId}`;

          await resend.emails.send({
            from: 'DedosFácil <noreply@dedosfacil.es>',
            // to: email, // TESTING: descomentado para producción
            to: 'support@dedosfacil.es',
            subject: `[TEST → ${email}] 📄 Justificante Modelo N2 - Pedido DF-${orderId}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #2563eb 0%, #10b981 100%); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0;">DedosFácil</h1>
                </div>
                <div style="padding: 30px; background: #f8fafc;">
                  <h2 style="color: #10b981; margin-top: 0;">✅ ¡Tu Modelo N2 ha sido presentado!</h2>
                  <p>Hola${name ? ' ' + name : ''}, te confirmamos que hemos completado la presentación de tu Modelo N2.</p>
                  
                  <div style="background: #1e3a5f; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <span style="font-size: 14px;">Referencia</span><br>
                    <strong style="font-size: 28px;">DF-${orderId}</strong>
                  </div>

                  <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
                    <h3 style="margin-top: 0;">📋 Resumen</h3>
                    <p><strong>Plan:</strong> ${properties_count} Propiedad(es)</p>
                    <p><strong>Importe:</strong> ${amount / 100}€</p>
                    <p><strong>Estado:</strong> ✅ Presentado</p>
                  </div>

                  <div style="text-align: center; margin: 25px 0;">
                    <a href="${facturaUrl}" 
                       style="display: inline-block; padding: 14px 32px; background: #1e3a5f; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      📄 Ver Justificante / Factura
                    </a>
                  </div>

                  <div style="background: #fffbeb; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
                    <p style="margin: 0 0 12px 0; font-size: 16px;"><strong>¿Qué tal tu experiencia?</strong></p>
                    <p style="margin: 0 0 16px 0; color: #6b7280;">Solo tardas 30 segundos. Tu opinión nos ayuda mucho.</p>
                    <a href="${reviewUrl}" 
                       style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f97316, #f59e0b); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      ⭐ Dejar valoración
                    </a>
                  </div>

                  <p style="color: #6b7280; font-size: 13px;">
                    ¿Dudas? Escríbenos a <a href="mailto:support@dedosfacil.es">support@dedosfacil.es</a> indicando tu referencia DF-${orderId}.
                  </p>
                </div>
              </div>
            `
          });
          console.log(`📧 Email justificante + valoración enviado a: ${email}`);
        }
      } catch (emailErr) {
        console.error('Error sending delivery email:', emailErr);
        // No falla el endpoint si el email falla
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});
// Delete order
app.delete('/api/admin/delete-order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
  await pool.query('DELETE FROM affiliate_referrals WHERE order_id = $1', [orderId]);
    // Primero eliminar submissions relacionadas
    await pool.query('DELETE FROM submissions WHERE order_id = $1', [orderId]);
    
    // Luego eliminar la orden
    await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Error al eliminar pedido' });
  }
});

// Submit review
app.post('/api/reviews', async (req, res) => {
  try {
    const { orderId, name, rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Valoración no válida' });
    }
    
    // Check order exists and is completed
    const orderCheck = await pool.query(
      'SELECT id FROM orders WHERE id = $1 AND status IN ($2, $3)',
      [orderId, 'completed', 'enviado']
    );
    
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    // Check if already reviewed
    const existing = await pool.query(
      'SELECT id FROM reviews WHERE order_id = $1',
      [orderId]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Ya has dejado una valoración' });
    }
    
    await pool.query(
      'INSERT INTO reviews (order_id, name, rating, comment) VALUES ($1, $2, $3, $4)',
      [orderId, name, rating, comment]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: 'Error al guardar valoración' });
  }
});

// Get approved reviews (public)
app.get('/api/reviews', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT name, rating, comment, created_at FROM reviews WHERE approved = true ORDER BY created_at DESC LIMIT 20'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Error al obtener valoraciones' });
  }
});
// Send review request email
app.post('/api/admin/send-review/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const result = await pool.query(
      `SELECT o.email, s.name FROM orders o 
       LEFT JOIN submissions s ON s.order_id = o.id 
       WHERE o.id = $1 AND o.status IN ('completed', 'enviado')`,
      [orderId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    const { email, name } = result.rows[0];
    const reviewUrl = `https://dedosfacil.es/valoracion?order_id=${orderId}`;
    
    await resend.emails.send({
      from: 'DedosFácil <noreply@dedosfacil.es>',
      // to: email, // TESTING: descomentado para producción
      to: 'support@dedosfacil.es',
      subject: `[TEST → ${email}] ${name ? name + ', ¿' : '¿'}Qué tal tu experiencia con DedosFácil?`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #10b981 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">DedosFácil</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1f2937;">¡Hola${name ? ' ' + name : ''}! 👋</h2>
            <p>Tu declaración NRUA ya ha sido presentada. Esperamos que todo haya ido bien.</p>
            <p>¿Podrías dedicarnos <strong>30 segundos</strong> para valorar el servicio? Tu opinión nos ayuda mucho.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${reviewUrl}" 
                 style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f97316, #10b981); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px;">
                ⭐ Dejar valoración
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px; text-align: center;">Solo tardas 30 segundos. ¡Gracias!</p>
          </div>
        </div>
      `
    });
    
    console.log('Review email sent to:', email);
    res.json({ success: true, email });
  } catch (error) {
    console.error('Send review error:', error);
    res.status(500).json({ error: 'Error al enviar email' });
  }
});

// Send payment reminder email
app.post('/api/admin/send-payment-reminder/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Get order data
    const result = await pool.query(
      `SELECT o.id, o.email, o.plan, o.amount, o.properties_count, o.status, s.name 
       FROM orders o 
       LEFT JOIN submissions s ON s.order_id = o.id 
       WHERE o.id = $1`,
      [orderId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    const order = result.rows[0];
    
    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Este pedido ya está pagado' });
    }
    
    const priceData = PRICES[order.plan];
    if (!priceData) {
      return res.status(400).json({ error: 'Plan no válido' });
    }
    
    // Create new Stripe session for this order
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: priceData.name,
            description: 'Presentación NRUA ante el Registro de la Propiedad',
          },
          unit_amount: priceData.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `https://dedosfacil.es/exito?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `https://dedosfacil.es`,
      customer_email: order.email,
      metadata: { orderId: orderId.toString() }
    });
    
    // Update order with new session ID
    await pool.query(
      'UPDATE orders SET stripe_session_id = $1 WHERE id = $2',
      [session.id, orderId]
    );
    
    // Send reminder email
    await resend.emails.send({
      from: 'DedosFácil <noreply@dedosfacil.es>',
      // to: order.email, // TESTING: descomentado para producción
      to: 'support@dedosfacil.es',
      subject: `[TEST → ${order.email}] ⏳ Tu pedido DF-${orderId} está pendiente de pago`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #10b981 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">DedosFácil</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1f2937;">Hola${order.name ? ' ' + order.name : ''} 👋</h2>
            
            <p>Hemos recibido tus datos para la presentación del Modelo N2, pero el pago no se completó.</p>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;">
                <strong>⚠️ Recuerda:</strong> El plazo para presentar el Modelo N2 termina el <strong>2 de marzo de 2026</strong>.
              </p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <h3 style="margin-top: 0;">📋 Tu pedido</h3>
              <p><strong>Referencia:</strong> DF-${orderId}</p>
              <p><strong>Plan:</strong> ${order.properties_count} Propiedad(es)</p>
              <p><strong>Importe:</strong> ${order.amount / 100}€</p>
            </div>
            
            <p><strong>Buenas noticias:</strong> No tienes que volver a rellenar nada. Tus datos ya están guardados.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${session.url}" 
                 style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #f97316, #10b981); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 18px;">
                💳 Completar pago
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 13px;">
              ¿Dudas? Escríbenos a <a href="mailto:support@dedosfacil.es">support@dedosfacil.es</a>
            </p>
          </div>
        </div>
      `
    });
    
    console.log(`📧 Payment reminder sent to: ${order.email} for order ${orderId}`);
    res.json({ success: true, email: order.email, paymentUrl: session.url });
  } catch (error) {
    console.error('Send payment reminder error:', error);
    res.status(500).json({ error: 'Error al enviar recordatorio' });
  }
});

// ============================================
// MI CUENTA ENDPOINTS
// ============================================

// Login: email + orderId
app.post('/api/mi-cuenta/login', async (req, res) => {
  try {
    const { email, orderId } = req.body;

    if (!email || !orderId) {
      return res.status(400).json({ error: 'Email y número de pedido son obligatorios' });
    }

    // Find order
    const orderResult = await pool.query(
      `SELECT id, email, plan, properties_count, amount, status, created_at
       FROM orders 
       WHERE id = $1 AND LOWER(email) = LOWER($2) AND status IN ('completed', 'enviado')`,
      [orderId, email.trim()]
    );

    if (orderResult.rows.length === 0) {
      return res.status(401).json({ error: 'Email o número de pedido incorrectos' });
    }

    const order = orderResult.rows[0];

    // Get submissions for this order
    const subsResult = await pool.query(
      `SELECT id, nrua, address, province, status, created_at
       FROM submissions 
       WHERE order_id = $1
       ORDER BY id ASC`,
      [order.id]
    );

    // For multi-property plans: count only submissions that have address (added via mi-cuenta)
    // The first submission (from checkout) may not have address if plan > 1
    const propertySubmissions = subsResult.rows.filter(s => s.address && s.address.trim() !== '');

    res.json({
      order,
      submissions: propertySubmissions,
      creditsTotal: order.properties_count,
      creditsUsed: propertySubmissions.length
    });
  } catch (error) {
    console.error('Mi cuenta login error:', error);
    res.status(500).json({ error: 'Error de conexión' });
  }
});

// Process CSV (reuse existing logic but under mi-cuenta path)
// Process CSV for mi-cuenta (reuses same logic as main endpoint)
app.post('/api/mi-cuenta/process-csv', upload.fields([
  { name: 'airbnb', maxCount: 1 },
  { name: 'booking', maxCount: 1 },
  { name: 'vrbo', maxCount: 1 },
  { name: 'other', maxCount: 1 }
]), async (req, res) => {
  try {
    const files = req.files;
    let airbnbData = null, bookingData = null, vrboData = null, otherData = null;

    if (files.airbnb?.[0]) {
      const rows = parseFileToRows(files.airbnb[0].buffer, files.airbnb[0].originalname);
      airbnbData = processAirbnb(rows);
      if (!airbnbData) {
        airbnbData = await processWithClaude(files.airbnb[0].buffer.toString('utf-8'), 'Airbnb');
      }
    }
    if (files.booking?.[0]) {
      const rows = parseFileToRows(files.booking[0].buffer, files.booking[0].originalname);
      bookingData = processBooking(rows);
      if (!bookingData) {
        bookingData = await processWithClaude(files.booking[0].buffer.toString('utf-8'), 'Booking');
      }
    }
    if (files.vrbo?.[0]) {
      const rows = parseFileToRows(files.vrbo[0].buffer, files.vrbo[0].originalname);
      vrboData = processVrbo(rows);
      if (!vrboData) {
        vrboData = await processWithClaude(files.vrbo[0].buffer.toString('utf-8'), 'VRBO');
      }
    }
    if (files.other?.[0]) {
      const rows = parseFileToRows(files.other[0].buffer, files.other[0].originalname);
      otherData = processGeneric(rows);
      if (!otherData) {
        otherData = await processWithClaude(files.other[0].buffer.toString('utf-8'), 'Otro');
      }
    }

    res.json({ success: true, airbnb: airbnbData, booking: bookingData, vrbo: vrboData, other: otherData });
  } catch (error) {
    console.error('Mi cuenta process-csv error:', error);
    res.status(500).json({ error: 'Error al procesar archivos' });
  }
});

// Add property to existing order
app.post('/api/mi-cuenta/add-property', upload.fields([
  { name: 'airbnb', maxCount: 1 },
  { name: 'booking', maxCount: 1 },
  { name: 'other', maxCount: 1 }
]), async (req, res) => {
  try {
    const { orderId, email, nrua, address, province, phone, stays, noActivity } = req.body;

    // Verify order exists and belongs to this email
    const orderCheck = await pool.query(
      `SELECT id, properties_count, email FROM orders 
       WHERE id = $1 AND LOWER(email) = LOWER($2) AND status IN ('completed', 'enviado')`,
      [orderId, email]
    );

    if (orderCheck.rows.length === 0) {
      return res.status(401).json({ error: 'Pedido no válido' });
    }

    const order = orderCheck.rows[0];

    // Check credits
    const usedResult = await pool.query(
      `SELECT COUNT(*) as count FROM submissions 
       WHERE order_id = $1 AND address IS NOT NULL AND address != ''`,
      [orderId]
    );
    const usedCount = parseInt(usedResult.rows[0].count);

    if (usedCount >= order.properties_count) {
      return res.status(400).json({ error: 'No te quedan propiedades disponibles' });
    }

    // Convert uploaded files to base64 JSON
    const files = req.files;
    const fileToJson = (file) => {
      if (!file?.[0]) return null;
      const base64 = file[0].buffer.toString('base64');
      return JSON.stringify({ name: file[0].originalname, data: base64 });
    };

    // Parse stays
    let parsedStays = [];
    try {
      parsedStays = JSON.parse(stays || '[]');
    } catch (e) {
      parsedStays = [];
    }

    // Insert submission
    await pool.query(
      `INSERT INTO submissions 
       (order_id, name, nrua, address, province, phone, 
        airbnb_file, booking_file, other_file, 
        extracted_stays, status, authorization_timestamp, authorization_ip)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        orderId,
        null, // name already on file
        nrua || null,
        address || null,
        province || null,
        phone || null,
        fileToJson(files?.airbnb),
        fileToJson(files?.booking),
        fileToJson(files?.other),
        JSON.stringify(parsedStays),
        'completed',
        new Date(),
        req.headers['x-forwarded-for'] || req.socket.remoteAddress
      ]
    );

    // Count updated credits
    const newUsedResult = await pool.query(
      `SELECT COUNT(*) as count FROM submissions 
       WHERE order_id = $1 AND address IS NOT NULL AND address != ''`,
      [orderId]
    );

    res.json({ 
      success: true, 
      creditsUsed: parseInt(newUsedResult.rows[0].count) 
    });
  } catch (error) {
    console.error('Add property error:', error);
    res.status(500).json({ error: 'Error al añadir propiedad' });
  }
});

app.get('/api/admin/nrua-requests', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM nrua_requests ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Admin NRUA requests error:', error);
    res.status(500).json({ error: 'Error al cargar solicitudes NRUA' });
  }
});

app.post('/api/admin/nrua-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await pool.query('UPDATE nrua_requests SET status = $1 WHERE id = $2', [status, id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Update NRUA status error:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

// Send NRUA justificante with PDF attachment
app.post('/api/admin/send-nrua-justificante/:id', express.json({ limit: '50mb' }), async (req, res) => {
  try {
    const { id } = req.params;
    const { pdfBase64, pdfName, nruaNumber } = req.body;

    if (!pdfBase64) {
      return res.status(400).json({ error: 'No se ha adjuntado PDF' });
    }

    // Get NRUA request data
    const result = await pool.query(
      'SELECT * FROM nrua_requests WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud NRUA no encontrada' });
    }

    const nruaReq = result.rows[0];
    const email = nruaReq.email;
    const name = nruaReq.person_type === 'physical'
      ? `${nruaReq.name || ''} ${nruaReq.surname || ''}`.trim()
      : nruaReq.company_name || '';

    // Update NRUA number if provided
    if (nruaNumber) {
      await pool.query('UPDATE nrua_requests SET provisional_nrua = $1 WHERE id = $2', [nruaNumber, id]);
    }

    // Update status to enviado
    await pool.query('UPDATE nrua_requests SET status = $1 WHERE id = $2', ['enviado', id]);
    await pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['enviado', nruaReq.order_id]);

    // Build attachment
    const base64Data = pdfBase64.includes(',') ? pdfBase64.split(',')[1] : pdfBase64;

    await resend.emails.send({
      from: 'DedosFácil <noreply@dedosfacil.es>',
      // to: email, // TESTING: descomentado para producción
      to: 'support@dedosfacil.es',
      subject: `[TEST → ${email}] 🔑 Tu número NRUA - Pedido DF-${nruaReq.order_id}`,
      attachments: [{
        filename: pdfName || `NRUA_DF-${nruaReq.order_id}.pdf`,
        content: base64Data,
        type: 'application/pdf'
      }],
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #10b981 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">DedosFácil</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #10b981; margin-top: 0;">🔑 ¡Tu número NRUA está listo!</h2>
            <p>Hola${name ? ' ' + name : ''}, te confirmamos que hemos tramitado tu solicitud de número NRUA ante el Registro de la Propiedad.</p>

            <div style="background: #1e3a5f; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 14px;">Referencia</span><br>
              <strong style="font-size: 28px;">DF-${nruaReq.order_id}</strong>
            </div>

            ${nruaNumber ? `
            <div style="background: #d1fae5; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #065f46;">Tu número NRUA provisional:</p>
              <p style="margin: 0; font-size: 15px; font-weight: bold; color: #065f46; font-family: monospace; word-break: break-all;">${nruaNumber}</p>
            </div>
            ` : ''}

            <div style="background: #fff7ed; border: 1px solid #fed7aa; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #9a3412;">📋 ¿Qué significa "provisional"?</p>
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #7c2d12; line-height: 1.5;">
                El Registro de la Propiedad asigna inicialmente un <strong>número provisional</strong> de registro de alquiler de corta duración. Este número es <strong>completamente válido</strong> y puedes utilizarlo de inmediato en plataformas como <strong>Airbnb, Booking.com, Vrbo</strong> y cualquier otra plataforma de alquiler turístico.
              </p>
              <p style="margin: 0; font-size: 14px; color: #7c2d12; line-height: 1.5;">
                Cuando el Registro emita tu <strong>número definitivo</strong>, te lo enviaremos automáticamente por correo electrónico. No necesitas hacer nada más por tu parte.
              </p>
            </div>

            <div style="background: #d1fae5; padding: 16px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 16px;">📎 <strong>1 documento adjunto a este email</strong></p>
              <p style="margin: 0; font-size: 13px; color: #065f46;">Comunicación oficial del Registro de la Propiedad con tu número NRUA asignado.</p>
            </div>

            <div style="text-align: center; margin: 25px 0;">
              <a href="https://dedosfacil.es/factura/${nruaReq.order_id}"
                 style="display: inline-block; padding: 14px 32px; background: #1e3a5f; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                📄 Ver Factura
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              ¿Dudas? Escríbenos a support@dedosfacil.es indicando tu referencia DF-${nruaReq.order_id}
            </p>
          </div>
        </div>
      `
    });

    console.log('NRUA justificante sent to:', email);
    res.json({ success: true, email });
  } catch (error) {
    console.error('Send NRUA justificante error:', error);
    res.status(500).json({ error: 'Error al enviar justificante NRUA' });
  }
});

// ============================================
// AFFILIATE ENDPOINTS
// ============================================

// Validate affiliate code (public)
app.get('/api/affiliate/validate/:code', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT code, discount_percent FROM affiliates WHERE code = $1 AND active = true',
      [req.params.code.toUpperCase()]
    );
  if (result.rows.length === 0) return res.json({ valid: false });
    res.json({ valid: true, defaultDiscount: result.rows[0].discount_percent, code: result.rows[0].code });
  } catch (error) {
    res.status(500).json({ valid: false });
  }
});

// Affiliate login
app.post('/api/affiliate/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      'SELECT * FROM affiliates WHERE LOWER(email) = LOWER($1) AND active = true',
      [email]
    );
    if (result.rows.length === 0) return res.status(401).json({ error: 'Credenciales incorrectas' });
    
    const aff = result.rows[0];
    if (aff.password_hash !== password) return res.status(401).json({ error: 'Credenciales incorrectas' });

    // Get referrals
    const referrals = await pool.query(
      `SELECT ar.*, o.email as customer_email, o.created_at as order_date
       FROM affiliate_referrals ar
       JOIN orders o ON o.id = ar.order_id
       WHERE ar.affiliate_id = $1
       ORDER BY ar.created_at DESC`,
      [aff.id]
    );
    await pool.query('UPDATE affiliates SET last_login = NOW(), login_count = login_count + 1 WHERE id = $1', [aff.id]);
    res.json({
      affiliate: { id: aff.id, name: aff.name, email: aff.email, code: aff.code, discount_percent: aff.discount_percent, commission_percent: aff.commission_percent },
      referrals: referrals.rows
    });
  } catch (error) {
    console.error('Affiliate login error:', error);
    res.status(500).json({ error: 'Error de conexión' });
  }
});

// ============================================
// ADMIN - AFFILIATES
// ============================================

// List affiliates
app.get('/api/admin/affiliates', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.*, 
        (SELECT COUNT(*) FROM affiliate_referrals WHERE affiliate_id = a.id) as total_referrals,
        (SELECT COUNT(*) FROM affiliate_referrals WHERE affiliate_id = a.id AND status = 'completed') as completed_referrals,
        (SELECT COALESCE(SUM(commission_amount), 0) FROM affiliate_referrals WHERE affiliate_id = a.id AND status = 'completed') as total_commission
      FROM affiliates a ORDER BY a.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Admin affiliates error:', error);
    res.status(500).json({ error: 'Error al cargar afiliados' });
  }
});

// Create affiliate
app.post('/api/admin/affiliates', async (req, res) => {
  try {
    const { name, email, code, password, discount_percent, commission_percent } = req.body;
    const result = await pool.query(
      'INSERT INTO affiliates (name, email, code, password_hash, discount_percent, commission_percent) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, email, code.toUpperCase(), password, discount_percent || 10, commission_percent || 10]
    );
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') return res.status(400).json({ error: 'Código o email ya existe' });
    console.error('Create affiliate error:', error);
    res.status(500).json({ error: 'Error al crear afiliado' });
  }
});

// Toggle affiliate active
app.post('/api/admin/affiliates/:id/toggle', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE affiliates SET active = NOT active WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar afiliado' });
  }
});

// Delete affiliate
app.delete('/api/admin/affiliates/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM affiliate_referrals WHERE affiliate_id = $1', [req.params.id]);
    await pool.query('DELETE FROM affiliates WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar afiliado' });
  }
});

// ============================================
// FIN MI CUENTA ENDPOINTS
// ============================================

// Catch-all: serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
