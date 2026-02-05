import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const Factura = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/factura/${orderId}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [orderId])

  const handlePrint = () => window.print()

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Cargando...</div>
  if (!order) return <div style={{ padding: '50px', textAlign: 'center' }}>Factura no encontrada</div>

  const fecha = new Date(order.created_at).toLocaleDateString('es-ES')
 const totalConIva = (order.amount / 100)
const baseImponible = (totalConIva / 1.255).toFixed(2)
const alv = (totalConIva - parseFloat(baseImponible)).toFixed(2)
const total = totalConIva.toFixed(2)

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Botón imprimir */}
      <button 
        onClick={handlePrint}
        style={{
          position: 'fixed', top: '20px', right: '20px',
          padding: '10px 20px', background: '#2563eb', color: 'white',
          border: 'none', borderRadius: '8px', cursor: 'pointer',
          fontSize: '14px', fontWeight: '600'
        }}
        className="no-print"
      >
        🖨️ Imprimir / Guardar PDF
      </button>

      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1e3a5f', fontSize: '28px' }}>FACTURA</h1>
          <p style={{ color: '#666', margin: '5px 0' }}>Nº: <strong>DF-{order.id}</strong></p>
          <p style={{ color: '#666', margin: '5px 0' }}>Fecha: <strong>{fecha}</strong></p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, color: '#2563eb', fontSize: '24px' }}>DedosFácil</h2>
          <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>dedosfacil.es</p>
        </div>
      </div>

      {/* Datos emisor y cliente */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>EMISOR</h3>
          <p style={{ margin: '3px 0', fontWeight: '600' }}>Rental Connect Solutions Tmi</p>
          <p style={{ margin: '3px 0', fontSize: '14px' }}>Y-tunnus: 3502814-5</p>
          <p style={{ margin: '3px 0', fontSize: '14px' }}>Telttakuja 3D 39</p>
          <p style={{ margin: '3px 0', fontSize: '14px' }}>00770 Helsinki, Finlandia</p>
        </div>
        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#666' }}>CLIENTE</h3>
          <p style={{ margin: '3px 0', fontWeight: '600' }}>{order.name || 'Cliente'}</p>
          <p style={{ margin: '3px 0', fontSize: '14px' }}>{order.email}</p>
          {order.phone && <p style={{ margin: '3px 0', fontSize: '14px' }}>{order.phone}</p>}
        </div>
      </div>

      {/* Detalle */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr style={{ background: '#1e3a5f', color: 'white' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Concepto</th>
            <th style={{ padding: '12px', textAlign: 'center' }}>Cantidad</th>
            <th style={{ padding: '12px', textAlign: 'right' }}>Importe</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
            <td style={{ padding: '15px 12px' }}>
              <strong>Servicio de presentación Modelo N2</strong><br/>
              <span style={{ fontSize: '13px', color: '#666' }}>
                Plan: {order.properties_count} propiedad(es) - Ejercicio 2025
              </span>
            </td>
            <td style={{ padding: '15px 12px', textAlign: 'center' }}>1</td>
            <td style={{ padding: '15px 12px', textAlign: 'right' }}>{baseImponible} €</td>
          </tr>
        </tbody>
      </table>

      {/* Totales */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: '250px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
            <span>Base imponible:</span>
            <span>{baseImponible} €</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
          <span>ALV (25.5%):</span>
<span>{alv} €</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: '700', fontSize: '18px', color: '#1e3a5f' }}>
            <span>TOTAL:</span>
            <span>{total} €</span>
          </div>
        </div>
      </div>

      {/* Nota */}
      <div style={{ marginTop: '40px', padding: '15px', background: '#f0fdf4', borderRadius: '8px', fontSize: '13px', color: '#166534' }}>
       <strong>Nota:</strong> Servicio prestado por Rental Connect Solutions Tmi (Y-tunnus: 3502814-5), empresa establecida en Finlandia. Precio con ALV finlandés (25.5%) incluido conforme a la normativa fiscal finlandesa aplicable a servicios electrónicos B2C.
      </div>

      {/* Footer */}
      <div style={{ marginTop: '40px', textAlign: 'center', color: '#999', fontSize: '12px' }}>
        <p>Gracias por confiar en DedosFácil</p>
        <p>support@dedosfacil.es | dedosfacil.es</p>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  )
}

export default Factura
