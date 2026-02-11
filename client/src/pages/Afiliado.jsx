import React, { useState, useEffect } from 'react'

const Afiliado = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [affiliate, setAffiliate] = useState(null)
  const [referrals, setReferrals] = useState([])
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/affiliate/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setAffiliate(data.affiliate)
      setReferrals(data.referrals)
      setIsAuthenticated(true)
    } catch (err) {
      setError('Error de conexión')
    }
  }

  const completedReferrals = referrals.filter(r => r.status === 'completed')
  const totalCommission = completedReferrals.reduce((sum, r) => sum + r.commission_amount, 0)
  const totalSales = completedReferrals.reduce((sum, r) => sum + (r.original_amount - r.discount_amount), 0)

  const s = {
    page: { minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif' },
    header: { backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    container: { maxWidth: '1000px', margin: '0 auto', padding: '0 24px' },
    card: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
    stat: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' },
    statNumber: { fontSize: '28px', fontWeight: 'bold', margin: '0' },
    statLabel: { fontSize: '13px', color: '#6b7280', margin: '4px 0 0' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
    th: { padding: '10px 12px', textAlign: 'left', borderBottom: '2px solid #e5e7eb', color: '#6b7280', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' },
    td: { padding: '10px 12px', borderBottom: '1px solid #f3f4f6' },
    badge: { padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' },
    loginContainer: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' },
    loginBox: { backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
    input: { width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', marginBottom: '12px', boxSizing: 'border-box' },
    btn: { width: '100%', padding: '12px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
    linkBox: { backgroundColor: '#F0F4FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '16px', margin: '16px 0' }
  }

  if (!isAuthenticated) {
    return (
      <div style={s.loginContainer}>
        <div style={s.loginBox}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '40px' }}>🤝</span>
            <h1 style={{ fontSize: '22px', margin: '8px 0' }}>Panel de Afiliado</h1>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>DedosFácil</p>
          </div>
          <form onSubmit={handleLogin}>
            <input style={s.input} type="email" placeholder="Tu email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input style={s.input} type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <p style={{ color: '#dc2626', fontSize: '14px', margin: '0 0 12px' }}>{error}</p>}
            <button type="submit" style={s.btn}>Entrar</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🤝</span>
          <h1 style={{ fontSize: '20px', margin: 0 }}>Panel de Afiliado</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>{affiliate.name}</span>
          <button onClick={() => { setIsAuthenticated(false); setAffiliate(null) }} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={s.container}>
        {/* Link */}
        <div style={s.linkBox}>
          <p style={{ margin: '0 0 12px', fontWeight: '600', color: '#1E40AF' }}>🔗 Tus enlaces de afiliado</p>
          
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Enlace con 10% descuento:</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
              <input
                style={{ ...s.input, marginBottom: 0, flex: 1, fontFamily: 'monospace', fontSize: '13px' }}
                readOnly
                value={`https://dedosfacil.es/?ref=${affiliate.code}&d=10`}
                onClick={e => { e.target.select(); navigator.clipboard.writeText(e.target.value) }}
              />
              <button onClick={() => { navigator.clipboard.writeText(`https://dedosfacil.es/?ref=${affiliate.code}&d=10`); alert('✅ Enlace 10% copiado') }} style={{ ...s.btn, width: 'auto', padding: '10px 16px', whiteSpace: 'nowrap', fontSize: '14px' }}>
                📋
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Enlace con 20% descuento:</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
              <input
                style={{ ...s.input, marginBottom: 0, flex: 1, fontFamily: 'monospace', fontSize: '13px' }}
                readOnly
                value={`https://dedosfacil.es/?ref=${affiliate.code}&d=20`}
                onClick={e => { e.target.select(); navigator.clipboard.writeText(e.target.value) }}
              />
              <button onClick={() => { navigator.clipboard.writeText(`https://dedosfacil.es/?ref=${affiliate.code}&d=20`); alert('✅ Enlace 20% copiado') }} style={{ ...s.btn, width: 'auto', padding: '10px 16px', whiteSpace: 'nowrap', fontSize: '14px' }}>
                📋
              </button>
            </div>
          </div>

          <p style={{ margin: '12px 0 0', fontSize: '13px', color: '#6b7280' }}>
            Tu comisión: <strong>{affiliate.commission_percent}%</strong> sobre cada venta
          </p>
        </div>

        {/* Stats */}
        <div style={s.statsGrid}>
          <div style={s.stat}>
            <p style={{ ...s.statNumber, color: '#1f2937' }}>{referrals.length}</p>
            <p style={s.statLabel}>Total referidos</p>
          </div>
          <div style={s.stat}>
            <p style={{ ...s.statNumber, color: '#10b981' }}>{completedReferrals.length}</p>
            <p style={s.statLabel}>Ventas completadas</p>
          </div>
          <div style={s.stat}>
            <p style={{ ...s.statNumber, color: '#3B82F6' }}>{(totalSales / 100).toFixed(0)}€</p>
            <p style={s.statLabel}>Ventas generadas</p>
          </div>
          <div style={s.stat}>
            <p style={{ ...s.statNumber, color: '#f59e0b' }}>{(totalCommission / 100).toFixed(0)}€</p>
            <p style={s.statLabel}>Comisión acumulada</p>
          </div>
        </div>

        {/* Referrals table */}
        <div style={s.card}>
          <h3 style={{ margin: '0 0 16px' }}>📊 Mis referidos</h3>
          {referrals.length === 0 ? (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: '24px' }}>
              Aún no tienes referidos. Comparte tu enlace para empezar.
            </p>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Fecha</th>
                  <th style={s.th}>Cliente</th>
                  <th style={s.th}>Servicio</th>
                  <th style={s.th}>Importe</th>
                  <th style={s.th}>Descuento</th>
                  <th style={s.th}>Tu comisión</th>
                  <th style={s.th}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map(r => (
                  <tr key={r.id}>
                    <td style={s.td}>{new Date(r.order_date).toLocaleDateString('es-ES')}</td>
                    <td style={s.td}>{r.customer_email}</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, backgroundColor: r.service_type === 'n2' ? '#FEF3C7' : '#DBEAFE', color: r.service_type === 'n2' ? '#92400E' : '#1E40AF' }}>
                        {r.service_type === 'n2' ? 'Modelo N2' : 'NRUA'}
                      </span>
                    </td>
                    <td style={s.td}>{((r.original_amount - r.discount_amount) / 100).toFixed(0)}€</td>
                    <td style={s.td}>-{(r.discount_amount / 100).toFixed(0)}€</td>
                    <td style={{ ...s.td, fontWeight: '600', color: '#f59e0b' }}>{(r.commission_amount / 100).toFixed(0)}€</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, backgroundColor: r.status === 'completed' ? '#D1FAE5' : '#FEF3C7', color: r.status === 'completed' ? '#065F46' : '#92400E' }}>
                        {r.status === 'completed' ? 'Completado' : 'Pendiente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Afiliado
