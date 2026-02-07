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
  '3': { amount: 22900, properties: 3, name: 'DedosFácil - 3 Propiedades' },
  '10': { amount: 54900, properties: 10, name: 'DedosFácil - 10 Propiedades' }
};

// Enviar email de confirmación
async function sendConfirmationEmail(email, orderData) {
  try {
    await resend.emails.send({
      from: 'DedosFácil <noreply@dedosfacil.es>',
      to: email,
       bcc: 'support@dedosfacil.es',
      subject: `✅ Pedido DF-${orderData.orderId} confirmado - DedosFácil`,
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
                <li>Procesaremos tu declaración NRUA</li>
                <li>En 24-48h recibirás el justificante</li>
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
    const { plan, email, formData, files, stays, noActivity, gdprConsent } = req.body;
      console.log('📦 Checkout request received:');
    console.log('- Email:', email);
    console.log('- Plan:', plan);
    console.log('- FormData:', formData ? 'YES' : 'NO');
    console.log('- Files:', files ? 'YES' : 'NO');
    console.log('- Stays:', stays?.length || 0);
    const priceData = PRICES[plan];

    // Email de prueba que salta Stripe
    if (email === 'demiandreu@gmail.com') {
      const orderResult = await pool.query(
        'INSERT INTO orders (email, plan, properties_count, amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [email, plan, priceData.properties, priceData.amount, 'completed']
      );
      const orderId = orderResult.rows[0].id;
      
       if (parseInt(plan) === 1) {
      await pool.query(
        `INSERT INTO submissions 
         (order_id, name, nif, nrua, address, province, phone, airbnb_file, booking_file, other_file, nrua_photo_base64, nrua_photo_name, extracted_stays, status, authorization_timestamp, authorization_ip, gdpr_accepted, gdpr_timestamp, gdpr_ip)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16 $17, $18, $19)`,
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
  files?.nruaPhoto ? JSON.stringify({ name: files.nruaPhotoName, data: files.nruaPhoto }) : null,
  files?.nruaPhotoName || null,
  JSON.stringify(stays || []),
  'completed',
  new Date(),
  req.headers['x-forwarded-for'] || req.socket.remoteAddress,
  gdprConsent?.accepted || false,
  new Date(),
  req.headers['x-forwarded-for'] || req.socket.remoteAddress
        ]
      );
}
     await sendConfirmationEmail(email, {
  orderId: orderId,
  plan: priceData.properties,
  amount: priceData.amount / 100
});
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
      'INSERT INTO orders (email, plan, properties_count, amount, status) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [email, plan, priceData.properties, priceData.amount, 'pending']
    );
    const orderId = orderResult.rows[0].id;

  if (parseInt(plan) === 1) {
  await pool.query(
 `INSERT INTO submissions 
    (order_id, name, nif, nrua, address, province, phone, airbnb_file, booking_file, other_file, nrua_photo_base64, nrua_photo_name, extracted_stays, status, authorization_timestamp, authorization_ip) 
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
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
    files?.nruaPhoto ? JSON.stringify({ name: files.nruaPhotoName, data: files.nruaPhoto }) : null,
          files?.nruaPhotoName || null,
    JSON.stringify(stays || []),
    'pending',
    new Date(),
    req.headers['x-forwarded-for'] || req.socket.remoteAddress
  ]
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
            description: 'Presentación NRUA ante el Registro de la Propiedad',
          },
          unit_amount: priceData.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: parseInt(plan) > 1 
  ? `${req.headers.origin}/mi-cuenta?email=${encodeURIComponent(email)}&order_id=${orderId}`
  : `${req.headers.origin}/exito?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
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
          content: `Analiza este CSV de Airbnb y extrae TODAS las estancias.

FORMATO AIRBNB - Columnas conocidas:
- "Fecha de inicio" = fecha de entrada (check-in)
- "Hasta" = fecha de salida (check-out)  
- "Número de adultos" + "Número de niños" + "Número de bebés" = SUMA para total huéspedes

REGLAS:
- Incluye TODAS las estancias del archivo
- Ignora reservas con estado "Cancelada" o "Cancelled"
- Calcula huéspedes = adultos + niños + bebés
- Convierte todas las fechas a formato DD/MM/YYYY

IMPORTANTE: Devuelve ÚNICAMENTE un JSON válido, sin texto adicional, sin markdown, sin backticks:
{"estancias":[{"fecha_entrada":"DD/MM/YYYY","fecha_salida":"DD/MM/YYYY","huespedes":2,"plataforma":"Airbnb"}],"total_estancias":0}

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

    // Process Booking CSV/XLS
    if (files.booking && files.booking[0]) {
      const bookingContent = files.booking[0].buffer.toString('utf-8');
      const bookingResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [{
          role: 'user',
          content: `Analiza este archivo de Booking.com y extrae TODAS las estancias.

FORMATO BOOKING - Columnas conocidas:
- "Entrada" o "Check-in" = fecha de entrada
- "Salida" o "Checkout" = fecha de salida
- "Personas" o "Guests" = número de huéspedes
- Si no hay columna de personas, usa "Adultos" o pon 2 por defecto

REGLAS:
- Incluye TODAS las estancias del archivo
- Ignora reservas con estado "cancelled", "cancelada", "no_show"
- Las fechas pueden venir en formato "24 May 2025" o "24/05/2025", convierte a DD/MM/YYYY

IMPORTANTE: Devuelve ÚNICAMENTE un JSON válido, sin texto adicional, sin markdown, sin backticks:
{"estancias":[{"fecha_entrada":"DD/MM/YYYY","fecha_salida":"DD/MM/YYYY","huespedes":2,"plataforma":"Booking"}],"total_estancias":0}

Archivo:
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

    // Process Other file (VRBO, Channel Managers, etc.)
    if (files.other && files.other[0]) {
      const otherContent = files.other[0].buffer.toString('utf-8');
      const otherResponse = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [{
          role: 'user',
          content: `Analiza este archivo de reservas y extrae TODAS las estancias.

DETECTA AUTOMÁTICAMENTE las columnas buscando:
- Fecha de entrada: "check-in", "entrada", "llegada", "arrival", "start", "from", "first night", "inicio"
- Fecha de salida: "check-out", "salida", "departure", "end", "to", "last night", "hasta", "fin"
- Número de huéspedes: "guests", "huéspedes", "personas", "people", "pax", "adultos", "adults", "occupancy"

REGLAS:
- Si hay columnas separadas de adultos/niños/bebés, SUMA todos para el total
- Si no encuentras número de huéspedes, pon 2 por defecto
- Ignora reservas canceladas (cualquier variación de "cancel")
- Incluye TODAS las estancias del archivo
- Detecta el formato de fecha y conviértelo a DD/MM/YYYY

IMPORTANTE: Devuelve ÚNICAMENTE un JSON válido, sin texto adicional, sin markdown, sin backticks:
{"estancias":[{"fecha_entrada":"DD/MM/YYYY","fecha_salida":"DD/MM/YYYY","huespedes":2,"plataforma":"Otro"}],"total_estancias":0}

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
    
    const result = await pool.query(
      `SELECT 
        s.name, s.nrua, s.address, s.province, s.phone,
        s.authorization_timestamp, s.authorization_ip,
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
      other: 'other_file',
      nruaPhoto: 'nrua_photo_base64'
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
    const { nrua } = req.body;
    
    await pool.query(
      'UPDATE submissions SET nrua = $1 WHERE order_id = $2',
      [nrua, orderId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Update NRUA error:', error);
    res.status(500).json({ error: 'Error al actualizar NRUA' });
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
      to: email,
      bcc: 'support@dedosfacil.es',
      subject: `📄 Justificante${pdfList.length > 1 ? 's' : ''} Modelo N2 - Pedido DF-${orderId}`,
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
            to: email,
            subject: `📄 Justificante Modelo N2 - Pedido DF-${orderId}`,
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
      to: email,
     bcc: 'support@dedosfacil.es',
      subject: `${name ? name + ', ¿' : '¿'}Qué tal tu experiencia con DedosFácil?`,
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
      to: order.email,
      bcc: 'support@dedosfacil.es',
      subject: `⏳ Tu pedido DF-${orderId} está pendiente de pago`,
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
app.post('/api/mi-cuenta/process-csv', upload.fields([
  { name: 'airbnb', maxCount: 1 },
  { name: 'booking', maxCount: 1 },
  { name: 'other', maxCount: 1 }
]), async (req, res) => {
  try {
    const files = req.files;
    let airbnbData = null, bookingData = null, otherData = null;

    const processFile = async (content, platform, hints) => {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        messages: [{
          role: 'user',
          content: `Analiza este archivo de ${platform} y extrae TODAS las estancias.
${hints}
REGLAS:
- Incluye TODAS las estancias del archivo
- Ignora reservas canceladas
- Convierte todas las fechas a formato DD/MM/YYYY
IMPORTANTE: Devuelve ÚNICAMENTE un JSON válido, sin texto adicional, sin markdown, sin backticks:
{"estancias":[{"fecha_entrada":"DD/MM/YYYY","fecha_salida":"DD/MM/YYYY","huespedes":2,"plataforma":"${platform}"}],"total_estancias":0}
Archivo:
${content}`
        }]
      });
      const text = response.content[0].text;
      const match = text.match(/\{[\s\S]*\}/);
      return match ? JSON.parse(match[0]) : null;
    };

    if (files.airbnb?.[0]) {
      airbnbData = await processFile(
        files.airbnb[0].buffer.toString('utf-8'), 'Airbnb',
        '"Fecha de inicio" = check-in, "Hasta" = check-out, huéspedes = adultos + niños + bebés'
      );
    }
    if (files.booking?.[0]) {
      bookingData = await processFile(
        files.booking[0].buffer.toString('utf-8'), 'Booking',
        '"Entrada"/"Check-in" = check-in, "Salida"/"Checkout" = check-out'
      );
    }
    if (files.other?.[0]) {
      otherData = await processFile(
        files.other[0].buffer.toString('utf-8'), 'Otro',
        'Detecta automáticamente las columnas de entrada, salida, huéspedes'
      );
    }

    res.json({ success: true, airbnb: airbnbData, booking: bookingData, other: otherData });
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
