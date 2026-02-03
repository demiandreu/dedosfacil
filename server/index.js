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
  '1': { amount: 6900, properties: 1, name: 'DedosFácil - 1 Propiedad' },
  '3': { amount: 19900, properties: 3, name: 'DedosFácil - 3 Propiedades' },
  '10': { amount: 39900, properties: 10, name: 'DedosFácil - 10 Propiedades' }
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
              ¿Dudas? Escríbenos a support@dedosfacil.es
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
    
    await pool.query(
      'UPDATE submissions SET status = $1 WHERE order_id = $2',
      ['completed', order.id]
    );
    
    // Enviar email...
    await sendConfirmationEmail(session.customer_email, {
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

// Create Stripe checkout session

// Create Stripe checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { plan, email, formData, files, stays, noActivity } = req.body;
      console.log('📦 Checkout request received:');
    console.log('- Email:', email);
    console.log('- Plan:', plan);
    console.log('- FormData:', formData ? 'YES' : 'NO');
    console.log('- Files:', files ? 'YES' : 'NO');
    console.log('- Stays:', stays?.length || 0);
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

    // Create submission with all data (pending until payment completes)
  await pool.query(
  `INSERT INTO submissions 
    (order_id, name, nif, nrua, address, province, phone, airbnb_file, booking_file, other_file, extracted_stays, status, authorization_timestamp, authorization_ip) 
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
  [
    orderId,
    formData?.name || null,
    null,
    formData?.nrua || null,
    formData?.address || null,
    formData?.province || null,
    formData?.phone || null,
    files?.airbnb ? JSON.stringify({ name: files.airbnbName, data: files.airbnb }) : null,
    files?.booking ? JSON.stringify({ name: files.bookingName, data: files.booking }) : null,
    files?.other ? JSON.stringify({ name: files.otherName, data: files.other }) : null,
    JSON.stringify(stays || []),
    'pending',
    new Date(),
    req.headers['x-forwarded-for'] || req.socket.remoteAddress
  ]
);

    // Create Stripe session
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
app.post('/api/process-csv', upload.fields([
  { name: 'airbnb', maxCount: 1 },
  { name: 'booking', maxCount: 1 },
  { name: 'other', maxCount: 1 }
]), async (req, res) => {
  try {
    const files = req.files;
    let airbnbData = null;
    let bookingData = null;
    let otherData = null;

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
        s.name,
        s.nrua,
        s.address,
        s.province,
        s.phone,
        s.airbnb_file IS NOT NULL as has_airbnb,
        s.booking_file IS NOT NULL as has_booking,
        s.other_file IS NOT NULL as has_other,
        s.extracted_stays,
        COALESCE(jsonb_array_length(s.extracted_stays), 0) as stays_count
      FROM orders o
      LEFT JOIN submissions s ON s.order_id = o.id
      ORDER BY o.id DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// Download file (airbnb, booking, or other)
app.get('/api/admin/download/:orderId/:fileType', async (req, res) => {
  try {
    const { orderId, fileType } = req.params;
    
    const columnMap = {
      airbnb: 'airbnb_file',
      booking: 'booking_file',
      other: 'other_file'
    };
    
    const column = columnMap[fileType];
    if (!column) {
      return res.status(400).json({ error: 'Tipo de archivo no válido' });
    }
    
    const result = await pool.query(
      `SELECT ${column} as file_data FROM submissions WHERE order_id = $1`,
      [orderId]
    );
    
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
    
    const result = await pool.query(
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
    const csvLines = ['NRUA;checkin;checkout;huespedes;finalidad'];
    
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
    
    res.json({ success: true });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

// ============================================
// FIN ADMIN ENDPOINTS
// ============================================


// Catch-all: serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
