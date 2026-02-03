import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import Anthropic from '@anthropic-ai/sdk';
import pg from 'pg';
import multer from 'multer';
import { Resend } from 'resend';  

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
  '1': { amount: 7900, properties: 1, name: 'DedosFácil - 1 Propiedad' },
  '3': { amount: 19900, properties: 3, name: 'DedosFácil - 3 Propiedades' },
  '10': { amount: 44900, properties: 10, name: 'DedosFácil - 10 Propiedades' }
};

// Enviar email de confirmación
async function sendConfirmationEmail(email, orderData) {
  try {
    await resend.emails.send({
      from: 'DedosFácil <noreply@dedosfacil.es>',
      to: email,
      subject: '✅ Pago confirmado - DedosFácil',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #10b981 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">DedosFácil</h1>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #10b981;">✅ ¡Pago completado!</h2>
            <p>Gracias por confiar en DedosFácil. Hemos recibido tu pedido.</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Resumen:</h3>
              <p><strong>Plan:</strong> ${orderData.plan} Propiedad(es)</p>
              <p><strong>Importe:</strong> ${orderData.amount}€</p>
            </div>
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
              <h3 style="margin-top: 0; color: #166534;">¿Qué pasa ahora?</h3>
              <ol style="color: #166534;">
                <li>Procesaremos tu declaración NRUA</li>
                <li>En 24-48h recibirás el justificante</li>
              </ol>
            </div>
            <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
              ¿Dudas? Escríbenos a info@dedosfacil.es
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
  
  await pool.query(
    'UPDATE orders SET status = $1, stripe_payment_id = $2, completed_at = NOW() WHERE stripe_session_id = $3',
    ['completed', session.payment_intent, session.id]
  );
  
  // Obtener datos y enviar email
  const orderResult = await pool.query(
    'SELECT * FROM orders WHERE stripe_session_id = $1',
    [session.id]
  );
  
  if (orderResult.rows.length > 0) {
    const order = orderResult.rows[0];
    await sendConfirmationEmail(session.customer_email, {
      plan: order.properties_count,
      amount: order.amount / 100
    });
  }
  
  console.log('Payment completed for session:', session.id);
}


// JSON middleware for other routes
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create Stripe checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { plan, email } = req.body;
    const priceData = PRICES[plan];

    if (!priceData) {
      return res.status(400).json({ error: 'Plan no válido' });
    }

    // Create order in database
    const orderResult = await pool.query(
      'INSERT INTO orders (email, plan, properties_count, amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [email, plan, priceData.properties, priceData.amount, 'pending']
    );
    const orderId = orderResult.rows[0].id;

    // Create Stripe session
  // Create Stripe session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'eur',
      product_data: {
        name: plan === '1' ? 'DedosFácil - 1 Propiedad' : 
              plan === '3' ? 'DedosFácil - 3 Propiedades' : 
              'DedosFácil - 10 Propiedades',
        description: 'Presentación NRUA ante el Registro de la Propiedad',
      },
      unit_amount: priceData.amount, // ya está en céntimos
    },
    quantity: 1,
  }],
      mode: 'payment',
      success_url: `${req.headers.origin}/exito?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${req.headers.origin}/formulario`,
      customer_email: email,
      metadata: { orderId: orderId.toString() }
    });

    // Update order with session ID
    await pool.query(
      'UPDATE orders SET stripe_session_id = $1 WHERE id = $2',
      [session.id, orderId]
    );

    res.json({ url: session.url, orderId });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Error al crear sesión de pago' });
  }
});

// Process CSV with Anthropic

// Process CSV with Anthropic
upload.fields([
  { name: 'airbnb', maxCount: 1 },
  { name: 'booking', maxCount: 1 },
  { name: 'other', maxCount: 1 }
]), async (req, res) => {
  try {
    const files = req.files;
    let airbnbData = null;
    let bookingData = null;

    // Process Airbnb CSV
    if (files.airbnb && files.airbnb[0]) {
      const airbnbContent = files.airbnb[0].buffer.toString('utf-8');
      const airbnbResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [{
          role: 'user',
          content: `Analiza este CSV de Airbnb y extrae TODAS las estancias del año 2025.

IMPORTANTE: Devuelve ÚNICAMENTE un JSON válido, sin texto adicional, sin markdown, sin backticks.

Formato exacto requerido:
{"estancias":[{"fecha_entrada":"DD/MM/YYYY","fecha_salida":"DD/MM/YYYY","noches":0,"importe":0.00,"plataforma":"Airbnb"}],"total_ingresos":0.00,"total_noches":0}

Si no hay estancias de 2025, devuelve: {"estancias":[],"total_ingresos":0,"total_noches":0}

CSV:
${airbnbContent}`
        }]
      });
      
      try {
        let responseText = airbnbResponse.content[0].text;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          airbnbData = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Error parsing Airbnb response:', e.message);
      }
    }

    // Process Booking CSV
    if (files.booking && files.booking[0]) {
      const bookingContent = files.booking[0].buffer.toString('utf-8');
      const bookingResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [{
          role: 'user',
          content: `Analiza este CSV de Booking.com y extrae TODAS las estancias del año 2025.

IMPORTANTE: Devuelve ÚNICAMENTE un JSON válido, sin texto adicional, sin markdown, sin backticks.

Formato exacto requerido:
{"estancias":[{"fecha_entrada":"DD/MM/YYYY","fecha_salida":"DD/MM/YYYY","noches":0,"importe":0.00,"plataforma":"Booking"}],"total_ingresos":0.00,"total_noches":0}

Si no hay estancias de 2025, devuelve: {"estancias":[],"total_ingresos":0,"total_noches":0}

CSV:
${bookingContent}`
        }]
      });
      
      try {
        let responseText = bookingResponse.content[0].text;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          bookingData = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Error parsing Booking response:', e.message);
      }
    }
      // Process Other file
    let otherData = null;
    if (files.other && files.other[0]) {
      const otherContent = files.other[0].buffer.toString('utf-8');
      const otherResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [{
          role: 'user',
          content: `Analiza este archivo y extrae TODAS las estancias del año 2025.

IMPORTANTE: Devuelve ÚNICAMENTE un JSON válido, sin texto adicional, sin markdown, sin backticks.

Formato exacto requerido:
{"estancias":[{"fecha_entrada":"DD/MM/YYYY","fecha_salida":"DD/MM/YYYY","noches":0,"importe":0.00,"plataforma":"Otro"}],"total_ingresos":0.00,"total_noches":0}

Si no hay estancias de 2025, devuelve: {"estancias":[],"total_ingresos":0,"total_noches":0}

Archivo:
${otherContent}`
        }]
      });
      
      try {
        let responseText = otherResponse.content[0].text;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          otherData = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error('Error parsing Other response:', e.message);
      }
    }
   res.json({
      success: true,
      airbnb: airbnbData,
      booking: bookingData,
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

// Catch-all: serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
