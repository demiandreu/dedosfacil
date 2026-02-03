import React, { useEffect, useState } from 'react'
import { CheckCircle, Download, Home, Mail } from 'lucide-react'

function Exito() {
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    // Recuperar datos del localStorage
    const saved = localStorage.getItem('dedosfacil_form')
    if (saved) {
      setOrderData(JSON.parse(saved))
    }
  }, [])

  return (
    <div className="form-page">
      <div className="form-header">
        <a href="/" className="logo">
          <span className="logo-icon">DF</span>
          <span className="logo-text">DedosFácil</span>
        </a>
      </div>

      <div className="form-container">
        <div className="form-content" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <CheckCircle size={80} color="#10b981" style={{ marginBottom: '24px' }} />
          
          <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#0f172a' }}>
            ¡Pago completado!
          </h1>
          
          <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '32px' }}>
            Gracias por confiar en DedosFácil
          </p>

          <div style={{ 
            background: '#f0fdf4', 
            border: '1px solid #86efac', 
            borderRadius: '12px', 
            padding: '24px', 
            marginBottom: '32px',
            textAlign: 'left'
          }}>
            <h3 style={{ marginBottom: '16px', color: '#166534' }}>
              <Mail size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              ¿Qué pasa ahora?
            </h3>
            <ol style={{ paddingLeft: '20px', color: '#166534', lineHeight: '1.8' }}>
              <li>Recibirás un email de confirmación</li>
              <li>Procesaremos tu declaración NRUA</li>
              <li>En 24-48h recibirás el justificante de presentación</li>
            </ol>
          </div>

          {orderData && (
            <div style={{ 
              background: '#f8fafc', 
              borderRadius: '12px', 
              padding: '24px', 
              marginBottom: '32px',
              textAlign: 'left'
            }}>
              <h4 style={{ marginBottom: '16px' }}>Resumen de tu pedido:</h4>
              <p><strong>NRUA:</strong> {orderData.nrua}</p>
              <p><strong>Dirección:</strong> {orderData.address}</p>
              <p><strong>Estancias:</strong> {orderData.stays?.length || 0}</p>
              <p><strong>Email:</strong> {orderData.email}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/" className="btn btn-primary">
              <Home size={18} />
              Volver al inicio
            </a>
          </div>

          <p style={{ marginTop: '32px', fontSize: '14px', color: '#94a3b8' }}>
            ¿Dudas? Escríbenos a <a href="mailto:info@dedosfacil.es" style={{ color: '#2563eb' }}>info@dedosfacil.es</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Exito
