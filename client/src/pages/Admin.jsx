import React, { useState, useEffect } from 'react'

const Admin = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [filter, setFilter] = useState('all')
  const [adminPassword, setAdminPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(null)

  const ADMIN_PASSWORD = 'dedos2026'

  const handleLogin = (e) => {
    e.preventDefault()
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('adminAuth', 'true')
    } else {
      alert('Contraseña incorrecta')
    }
  }

  useEffect(() => {
    if (localStorage.getItem('adminAuth') === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/orders')
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setOrders(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  const downloadFile = async (orderId, fileType) => {
    try {
      const response = await fetch(`/api/admin/download/${orderId}/${fileType}`)
      const data = await response.json()
      
      if (data.error) {
        alert(data.error)
        return
      }

      const link = document.createElement('a')
      link.href = data.data
      link.download = data.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      alert('Error al descargar: ' + err.message)
    }
  }

  const downloadN2Csv = async (orderId) => {
    try {
      const response = await fetch(`/api/admin/generate-n2-csv/${orderId}`)
      const data = await response.json()
      
      if (data.error) {
        alert(data.error)
        return
      }

      const blob = new Blob([data.csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = data.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      alert('Error al generar CSV: ' + err.message)
    }
  }

  const downloadAuthorizationPdf = async (orderId) => {
  try {
    const response = await fetch(`/api/admin/authorization/${orderId}`)
    const data = await response.json()
    
    if (data.error) {
      alert(data.error)
      return
    }
   

    const timestamp = data.authorization_timestamp 
      ? new Date(data.authorization_timestamp).toLocaleString('es-ES', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        })
      : 'No registrado'

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Autorización NRUA - ${data.name}</title>
        <style>
       body { font-family: Arial, sans-serif; max-width: 700px; margin: 20px auto; padding: 15px; line-height: 1.4; font-size: 13px; }
h1 { text-align: center; color: #1e3a5f; border-bottom: 2px solid #1e3a5f; padding-bottom: 8px; font-size: 16px; margin: 10px 0 15px 0; }
.section { margin: 12px 0; }
.section-title { font-weight: bold; color: #1e3a5f; margin-bottom: 6px; font-size: 14px; }
.data-row { margin: 4px 0; }
.label { color: #666; }
.value { font-weight: 500; }
.highlight { background: #f0fdf4; border: 1px solid #10b981; padding: 12px; border-radius: 6px; margin: 15px 0; font-size: 12px; }
.legal { font-size: 11px; color: #666; margin-top: 15px; padding-top: 10px; border-top: 1px solid #ddd; }
.footer { text-align: center; margin-top: 20px; font-size: 10px; color: #999; }
.timestamp { background: #fef3c7; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>AUTORIZACIÓN PARA PRESENTACIÓN DEL MODELO N2</h1>
        
        <div class="section">
          <div class="section-title">DATOS DEL AUTORIZANTE</div>
          <div class="data-row"><span class="label">Nombre:</span> <span class="value">${data.name || '-'}</span></div>
          <div class="data-row"><span class="label">Email:</span> <span class="value">${data.email || '-'}</span></div>
          <div class="data-row"><span class="label">Teléfono:</span> <span class="value">${data.phone || '-'}</span></div>
          <div class="data-row"><span class="label">NRUA:</span> <span class="value">${data.nrua || '-'}</span></div>
          <div class="data-row"><span class="label">Dirección inmueble:</span> <span class="value">${data.address || '-'}, ${data.province || '-'}</span></div>
        </div>

        <div class="section">
          <div class="section-title">DATOS DEL AUTORIZADO</div>
          <div class="data-row"><span class="label">Empresa:</span> <span class="value">Rental Connect Solutions Tmi</span></div>
          <div class="data-row"><span class="label">Y-tunnus:</span> <span class="value">3502814-5</span></div>
          <div class="data-row"><span class="label">Domicilio:</span> <span class="value">Telttakuja 3D 39, 00770 Helsinki, Finlandia</span></div>
        </div>

        <div class="highlight">
          <strong>OBJETO DE LA AUTORIZACIÓN</strong><br><br>
          El autorizante AUTORIZA expresamente a Rental Connect Solutions Tmi para cumplimentar y presentar 
          en su nombre el Modelo Informativo de Arrendamientos de Corta Duración (Modelo N2) correspondiente 
          al ejercicio 2025 ante el Registro de la Propiedad competente, conforme al artículo 10.4 del 
          Real Decreto 1312/2024.
        </div>

        <div class="section">
          <div class="section-title">REGISTRO DE ACEPTACIÓN ELECTRÓNICA</div>
          <div class="timestamp">
            <div class="data-row"><span class="label">Fecha y hora:</span> <span class="value">${timestamp}</span></div>
            <div class="data-row"><span class="label">Dirección IP:</span> <span class="value">${data.authorization_ip || 'No registrada'}</span></div>
          </div>
        </div>

        <div class="legal">
          <strong>DECLARACIONES:</strong><br>
          • El autorizante declara ser el titular registral del inmueble o tener poderes suficientes para otorgar esta autorización.<br>
          • El autorizante declara que los datos facilitados son veraces y se compromete a conservar la documentación acreditativa.<br>
          • Esta autorización tiene validez exclusivamente para el ejercicio fiscal 2025.<br>
          • Los datos serán tratados conforme al RGPD. Más información en dedosfacil.es/privacidad
        </div>

        <div class="footer">
          Documento generado automáticamente por DedosFácil.es<br>
          Rental Connect Solutions Tmi - Y-tunnus: 3502814-5
        </div>
      </body>
      </html>
    `

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const win = window.open(url, '_blank')
    win.onload = () => {
      win.print()
    }
  } catch (err) {
    alert('Error al generar autorización: ' + err.message)
  }
}
  
  const updateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId)
    try {
      const response = await fetch(`/api/admin/update-status/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      await fetchOrders()
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const sendReviewEmail = async (orderId) => {
    try {
      const response = await fetch(`/api/admin/send-review/${orderId}`, {
        method: 'POST'
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      alert(`✅ Email de valoración enviado a ${data.email}`)
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const updateNrua = async (orderId, newNrua) => {
  try {
    const response = await fetch(`/api/admin/update-nrua/${orderId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nrua: newNrua })
    })
    const data = await response.json()
    if (data.error) throw new Error(data.error)
    await fetchOrders()
  } catch (err) {
    alert('Error al actualizar NRUA: ' + err.message)
  }
}
   const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/admin/delete-order/${orderId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      await fetchOrders()
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    }
  }


  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    headerTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '24px'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    statNumber: {
      fontSize: '32px',
      fontWeight: 'bold',
      margin: 0
    },
    statLabel: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    filterBar: {
      display: 'flex',
      gap: '8px',
      marginBottom: '16px'
    },
    filterBtn: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    filterActive: {
      backgroundColor: '#f97316',
      color: 'white'
    },
    filterInactive: {
      backgroundColor: 'white',
      color: '#4b5563'
    },
    orderCard: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '16px',
      overflow: 'hidden'
    },
    orderHeader: {
      padding: '16px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      borderBottom: '1px solid #e5e7eb'
    },
    orderHeaderLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    orderId: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937'
    },
    badge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500'
    },
    badgePending: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    },
    badgeCompleted: {
      backgroundColor: '#dbeafe',
      color: '#1e40af'
    },
    badgeEnviado: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    orderEmail: {
      color: '#4b5563'
    },
    orderHeaderRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    orderDate: {
      fontSize: '14px',
      color: '#6b7280'
    },
    orderAmount: {
      fontWeight: '600',
      color: '#f97316',
      fontSize: '18px'
    },
    orderDetails: {
      padding: '20px',
      backgroundColor: '#f9fafb'
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px'
    },
    sectionTitle: {
      fontWeight: '600',
      marginBottom: '12px',
      color: '#374151',
      fontSize: '16px'
    },
    detailRow: {
      marginBottom: '8px',
      fontSize: '14px'
    },
    detailLabel: {
      color: '#6b7280'
    },
    detailValue: {
      color: '#1f2937'
    },
    downloadBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      marginBottom: '8px',
      width: '100%'
    },
    staysTable: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
      marginTop: '12px'
    },
    tableHeader: {
      backgroundColor: '#f3f4f6',
      textAlign: 'left'
    },
    tableCell: {
      padding: '10px 12px',
      borderBottom: '1px solid #e5e7eb'
    },
    actionsBar: {
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    btnPrimary: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      backgroundColor: '#f97316',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    btnSuccess: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    btnSecondary: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    loginContainer: {
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    loginBox: {
      backgroundColor: 'white',
      padding: '32px',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '400px'
    },
    loginTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '24px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      marginBottom: '16px',
      boxSizing: 'border-box'
    },
    loginBtn: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#f97316',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    refreshBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: '#f3f4f6',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px'
    },
    logoutBtn: {
      background: 'none',
      border: 'none',
      color: '#6b7280',
      cursor: 'pointer',
      fontSize: '14px'
    }
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h1 style={styles.loginTitle}>🔐 Admin DedosFácil</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Contraseña"
              style={styles.input}
              autoFocus
            />
            <button type="submit" style={styles.loginBtn}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  const getBadgeStyle = (status) => {
    if (status === 'pending') return { ...styles.badge, ...styles.badgePending }
    if (status === 'completed') return { ...styles.badge, ...styles.badgeCompleted }
    if (status === 'enviado') return { ...styles.badge, ...styles.badgeEnviado }
    return styles.badge
  }

  const getStatusLabel = (status) => {
    if (status === 'pending') return 'Pendiente'
    if (status === 'completed') return 'Pagado'
    if (status === 'enviado') return 'Enviado'
    return status
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>📋 Panel Admin - DedosFácil</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={fetchOrders} style={styles.refreshBtn}>
            🔄 Actualizar
          </button>
          <button 
            onClick={() => { localStorage.removeItem('adminAuth'); setIsAuthenticated(false) }}
            style={styles.logoutBtn}
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={styles.container}>
        {/* Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#1f2937' }}>{orders.length}</p>
            <p style={styles.statLabel}>Total pedidos</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#2563eb' }}>
              {orders.filter(o => o.status === 'completed').length}
            </p>
            <p style={styles.statLabel}>Pagados</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#10b981' }}>
              {orders.filter(o => o.status === 'enviado').length}
            </p>
            <p style={styles.statLabel}>Enviados</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#f59e0b' }}>
              {orders.filter(o => o.status === 'pending').length}
            </p>
            <p style={styles.statLabel}>Pendientes</p>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filterBar}>
          {[
            { key: 'all', label: 'Todos' },
            { key: 'completed', label: 'Pagados' },
            { key: 'enviado', label: 'Enviados' },
            { key: 'pending', label: 'Pendientes' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                ...styles.filterBtn,
                ...(filter === f.key ? styles.filterActive : styles.filterInactive)
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <p style={{ color: '#6b7280' }}>⏳ Cargando pedidos...</p>
          </div>
        ) : (
          /* Orders list */
          <div>
            {filteredOrders.length === 0 ? (
              <div style={{ ...styles.orderCard, padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                No hay pedidos {filter !== 'all' ? 'con este filtro' : ''}
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} style={styles.orderCard}>
                  {/* Order header */}
                  <div 
                    style={styles.orderHeader}
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div style={styles.orderHeaderLeft}>
                      <span style={styles.orderId}>#{order.id}</span>
                      <span style={getBadgeStyle(order.status)}>
                        {getStatusLabel(order.status)}
                      </span>
                      <span style={styles.orderEmail}>{order.email}</span>
                    </div>
                    <div style={styles.orderHeaderRight}>
                      <span style={styles.orderDate}>
                        {new Date(order.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span style={styles.orderAmount}>{(order.amount / 100).toFixed(0)}€</span>
                      <span>{expandedOrder === order.id ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expandedOrder === order.id && (
                    <div style={styles.orderDetails}>
                      <div style={styles.detailsGrid}>
                        {/* Client info */}
                        <div>
                          <h3 style={styles.sectionTitle}>📋 Datos del cliente</h3>
                          <p style={styles.detailRow}>
                            <span style={styles.detailLabel}>Nombre: </span>
                            <span style={styles.detailValue}>{order.name || '-'}</span>
                          </p>
                          <p style={styles.detailRow}>
                            <span style={styles.detailLabel}>Email: </span>
                            <span style={styles.detailValue}>{order.email}</span>
                          </p>
                          <p style={styles.detailRow}>
                            <span style={styles.detailLabel}>Teléfono: </span>
                            <span style={styles.detailValue}>{order.phone || '-'}</span>
                          </p>
                          <div style={{ ...styles.detailRow, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={styles.detailLabel}>NRUA: </span>
                            <input
                              style={{ 
                                fontFamily: 'monospace', 
                                fontSize: '13px',
                                padding: '4px 8px', 
                                border: '1px solid #d1d5db', 
                                borderRadius: '4px',
                                flex: 1,
                                maxWidth: '400px'
                              }}
                              defaultValue={order.nrua || ''}
                              onBlur={(e) => {
                                if (e.target.value !== (order.nrua || '')) {
                                  updateNrua(order.id, e.target.value)
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') e.target.blur()
                              }}
                            />
                          </div>
                          <p style={styles.detailRow}>
                            <span style={styles.detailLabel}>Dirección: </span>
                            <span style={styles.detailValue}>{order.address || '-'}</span>
                          </p>
                          <p style={styles.detailRow}>
                            <span style={styles.detailLabel}>Provincia: </span>
                            <span style={styles.detailValue}>{order.province || '-'}</span>
                          </p>
                        </div>

                        {/* Files */}
                        <div>
                          <h3 style={styles.sectionTitle}>📁 Archivos</h3>
                          {order.has_airbnb && (
                            <button onClick={() => downloadFile(order.id, 'airbnb')} style={styles.downloadBtn}>
                              ⬇️ Descargar Airbnb
                            </button>
                          )}
                          {order.has_booking && (
                            <button onClick={() => downloadFile(order.id, 'booking')} style={styles.downloadBtn}>
                              ⬇️ Descargar Booking
                            </button>
                          )}
                          {order.has_other && (
                            <button onClick={() => downloadFile(order.id, 'other')} style={styles.downloadBtn}>
                              ⬇️ Descargar Otro
                            </button>
                          )}
                         {order.has_nrua_photo && (
                            <button onClick={() => downloadFile(order.id, 'nruaPhoto')} style={styles.downloadBtn}>
                              📷 Foto NRUA ({order.nrua_photo_name})
                            </button>
                          )}
                          {!order.has_airbnb && !order.has_booking && !order.has_other && !order.has_nrua_photo && (
                            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Sin archivos</p>
                          )}
                        </div>
                      </div>

                      {/* Stays */}
                      {order.stays_count > 0 && (
                        <div style={{ marginTop: '24px' }}>
                          <h3 style={styles.sectionTitle}>🏠 Estancias extraídas ({order.stays_count})</h3>
                          <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                            <table style={styles.staysTable}>
                              <thead style={styles.tableHeader}>
                                <tr>
                                  <th style={styles.tableCell}>Entrada</th>
                                  <th style={styles.tableCell}>Salida</th>
                                  <th style={styles.tableCell}>Huéspedes</th>
                                  <th style={styles.tableCell}>Finalidad</th>
                                  <th style={styles.tableCell}>Fuente</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(order.extracted_stays || []).map((stay, idx) => (
                                  <tr key={idx}>
                                    <td style={styles.tableCell}>{stay.fecha_entrada || stay.checkIn}</td>
                                    <td style={styles.tableCell}>{stay.fecha_salida || stay.checkOut}</td>
                                    <td style={styles.tableCell}>{stay.huespedes || stay.guests || '-'}</td>
                                    <td style={styles.tableCell}>{stay.finalidad || stay.purpose || 'Vacacional'}</td>
                                    <td style={styles.tableCell}>{stay.plataforma || stay.source || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={styles.actionsBar}>
                        <div>
                         <div style={{ display: 'flex', gap: '8px' }}>
  {order.stays_count > 0 && (
    <button onClick={() => downloadN2Csv(order.id)} style={styles.btnPrimary}>
      📄 CSV para N2
    </button>
  )}
<button onClick={() => downloadAuthorizationPdf(order.id)} style={styles.btnSecondary}>
    📋 Autorización PDF
  </button>
  {(order.status === 'completed' || order.status === 'enviado') && (
    <button onClick={() => sendReviewEmail(order.id)} style={{ ...styles.btnSecondary, backgroundColor: '#f59e0b' }}>
      ⭐ Pedir valoración
    </button>
  )}
</div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {order.status === 'completed' && (
                            <button
                              onClick={() => updateStatus(order.id, 'enviado')}
                              disabled={updatingStatus === order.id}
                              style={{ ...styles.btnSuccess, opacity: updatingStatus === order.id ? 0.5 : 1 }}
                            >
                              {updatingStatus === order.id ? '⏳' : '✅'} Marcar como Enviado
                            </button>
                          )}
                          {order.status === 'enviado' && (
                            <button
                              onClick={() => updateStatus(order.id, 'completed')}
                              disabled={updatingStatus === order.id}
                              style={{ ...styles.btnSecondary, opacity: updatingStatus === order.id ? 0.5 : 1 }}
                            >
                              Desmarcar Enviado
                            </button>
                          )}
                          <button
  onClick={() => {
    if (window.confirm(`¿Seguro que quieres eliminar el pedido #${order.id}?`)) {
      deleteOrder(order.id)
    }
  }}
  style={{
    padding: '10px 16px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fca5a5',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  }}
>
  🗑️ Eliminar
</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
