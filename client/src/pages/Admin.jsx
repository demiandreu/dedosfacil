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
  const [activeTab, setActiveTab] = useState('n2')
const [nruaRequests, setNruaRequests] = useState([])
  const [affiliates, setAffiliates] = useState([])
const [newAffiliate, setNewAffiliate] = useState({ name: '', email: '', code: '', password: '', discount_percent: 10, commission_percent: 10 })
const [showAffForm, setShowAffForm] = useState(false)
  const [nruaSearch, setNruaSearch] = useState('')
  const [n2Search, setN2Search] = useState('')
  const [nruaNumbers, setNruaNumbers] = useState({})
  const [editingStays, setEditingStays] = useState({}) // { orderId: [...stays] }

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
      fetchNruaRequests()
      fetchAffiliates()
    }
  }, [isAuthenticated])

  const fetchNruaRequests = async () => {
    try {
      const response = await fetch('/api/admin/nrua-requests')
      const data = await response.json()
      if (!data.error) setNruaRequests(data)
    } catch (err) {
      console.error('Error fetching NRUA requests:', err)
    }
  }

  const fetchAffiliates = async () => {
    try {
      const res = await fetch('/api/admin/affiliates')
      const data = await res.json()
      if (!data.error) setAffiliates(data)
    } catch (err) { console.error('Error fetching affiliates:', err) }
  }

  const createAffiliate = async () => {
    if (!newAffiliate.name || !newAffiliate.email || !newAffiliate.code || !newAffiliate.password) {
      alert('Rellena todos los campos')
      return
    }
    try {
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAffiliate)
      })
      const data = await res.json()
      if (data.error) { alert(data.error); return }
      setNewAffiliate({ name: '', email: '', code: '', password: '', discount_percent: 10, commission_percent: 10 })
      setShowAffForm(false)
      fetchAffiliates()
    } catch (err) { alert('Error al crear afiliado') }
  }

  const toggleAffiliate = async (id) => {
    try {
      await fetch(`/api/admin/affiliates/${id}/toggle`, { method: 'POST' })
      fetchAffiliates()
    } catch (err) { console.error(err) }
  }

  const deleteAffiliate = async (id) => {
    if (!window.confirm('¿Eliminar afiliado y todos sus referidos?')) return
    try {
      await fetch(`/api/admin/affiliates/${id}`, { method: 'DELETE' })
      fetchAffiliates()
    } catch (err) { console.error(err) }
  }
  
  const downloadFile = async (orderId, fileType) => {
    try {
      const response = await fetch(`/api/admin/download/${orderId}/${fileType}`)
      const data = await response.json()
      if (data.error) { alert(data.error); return }
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
      if (data.error) { alert(data.error); return }
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
    if (data.error) { alert(data.error); return }

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
         ${data.gdpr_accepted ? `
        <div class="section">
          <div class="section-title">CONSENTIMIENTO PROTECCIÓN DE DATOS (RGPD)</div>
          <div class="timestamp">
            <div class="data-row"><span class="label">Consentimiento:</span> <span class="value">✅ Aceptado</span></div>
            <div class="data-row"><span class="label">Fecha y hora:</span> <span class="value">${new Date(data.gdpr_timestamp).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span></div>
            <div class="data-row"><span class="label">Dirección IP:</span> <span class="value">${data.gdpr_ip || 'No registrada'}</span></div>
            <div class="data-row"><span class="label">Texto aceptado:</span> <span class="value" style="font-size:11px;">Acepto el tratamiento de mis datos personales y de los datos contenidos en los archivos de reservas (Airbnb, Booking, etc.) por parte de Rental Connect Solutions Tmi, con la finalidad exclusiva de gestionar la presentación del Modelo N2 ante el Registro de la Propiedad.</span></div>
          </div>
        </div>
        ` : ''}
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
    win.onload = () => { win.print() }
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
      const response = await fetch(`/api/admin/send-review/${orderId}`, { method: 'POST' })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      alert(`✅ Email de valoración enviado a ${data.email}`)
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }

  const sendJustificante = async (orderId) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf'
    input.multiple = true
    input.onchange = async (e) => {
      const files = Array.from(e.target.files)
      if (files.length === 0) return
      try {
        const pdfs = await Promise.all(files.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve({ data: reader.result, name: file.name })
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
        }))
        const response = await fetch(`/api/admin/send-justificante/${orderId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pdfs })
        })
        const data = await response.json()
        if (data.error) throw new Error(data.error)
        alert(`✅ ${files.length} justificante(s) enviado(s) a ${data.email}`)
        await fetchOrders()
      } catch (err) {
        alert('Error: ' + err.message)
      }
    }
    input.click()
  }

  const updateNruaStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/admin/nrua-status/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      await fetchNruaRequests()
    } catch (err) {
      alert('Error al actualizar estado NRUA: ' + err.message)
    }
  }

  const sendNruaJustificante = async (reqId) => {
    const nruaNumber = prompt('Introduce el número NRUA asignado (opcional):')
    if (nruaNumber === null) return // user cancelled

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.pdf'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return
      try {
        const pdfBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
        const response = await fetch(`/api/admin/send-nrua-justificante/${reqId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pdfBase64, pdfName: file.name, nruaNumber: nruaNumber || null })
        })
        const data = await response.json()
        if (data.error) throw new Error(data.error)
        alert(`✅ Justificante NRUA enviado a ${data.email}`)
        await fetchNruaRequests()
      } catch (err) {
        alert('Error: ' + err.message)
      }
    }
    input.click()
  }

  const sendPaymentReminder = async (orderId) => {
    try {
      const response = await fetch(`/api/admin/send-payment-reminder/${orderId}`, { method: 'POST' })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      alert(`✅ Recordatorio de pago enviado a ${data.email}`)
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

  const startEditingStays = (orderId, stays) => {
    setEditingStays(prev => ({ ...prev, [orderId]: JSON.parse(JSON.stringify(stays)) }))
  }

  const updateEditingStay = (orderId, idx, field, value) => {
    setEditingStays(prev => {
      const updated = { ...prev }
      updated[orderId] = [...updated[orderId]]
      updated[orderId][idx] = { ...updated[orderId][idx], [field]: value }
      return updated
    })
  }

  const saveStays = async (orderId) => {
    try {
      const response = await fetch(`/api/admin/update-stays/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stays: editingStays[orderId] })
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setEditingStays(prev => {
        const updated = { ...prev }
        delete updated[orderId]
        return updated
      })
      await fetchOrders()
      alert('✅ Estancias guardadas')
    } catch (err) {
      alert('Error al guardar estancias: ' + err.message)
    }
  }

  const cancelEditingStays = (orderId) => {
    setEditingStays(prev => {
      const updated = { ...prev }
      delete updated[orderId]
      return updated
    })
  }

  const deleteEditingStay = (orderId, idx) => {
    setEditingStays(prev => {
      const updated = { ...prev }
      updated[orderId] = updated[orderId].filter((_, i) => i !== idx)
      return updated
    })
  }

  const isCheckoutYearInvalid = (stay) => {
    const checkOut = stay.fecha_salida || stay.checkOut
    const checkIn = stay.fecha_entrada || stay.checkIn
    if (!checkOut || !checkIn) return false
    const parseYear = (dateStr) => {
      if (!dateStr) return null
      if (dateStr.includes('/')) {
        const parts = dateStr.split('/')
        return parts.length === 3 ? parseInt(parts[2]) : null
      }
      if (dateStr.includes('-')) {
        const parts = dateStr.split('-')
        return parts[0].length === 4 ? parseInt(parts[0]) : parseInt(parts[2])
      }
      return null
    }
    const checkInYear = parseYear(checkIn)
    const checkOutYear = parseYear(checkOut)
    if (!checkInYear || !checkOutYear) return false
    return checkOutYear > checkInYear
  }

  const deleteOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/admin/delete-order/${orderId}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      await fetchOrders()
    } catch (err) {
      alert('Error al eliminar: ' + err.message)
    }
  }

  const sendNruaEmail = async (reqId) => {
    const nrua = nruaNumbers[reqId]
    if (!nrua || !nrua.trim()) {
      alert('Introduce primero el número NRUA provisional')
      return
    }
    try {
      const response = await fetch(`/api/admin/send-nrua/${reqId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nrua: nrua.trim() })
      })
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      alert(`✅ Número NRUA enviado a ${data.email}`)
      fetchNruaRequests()
    } catch (err) {
      alert('Error: ' + err.message)
    }
  }
  
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const styles = {
    page: { minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif' },
    header: { backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
    headerTitle: { fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 },
    container: { maxWidth: '1200px', margin: '0 auto', padding: '0 24px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' },
    statCard: { backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    statNumber: { fontSize: '32px', fontWeight: 'bold', margin: 0 },
    statLabel: { fontSize: '14px', color: '#6b7280', margin: 0 },
    filterBar: { display: 'flex', gap: '8px', marginBottom: '16px' },
    filterBtn: { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
    filterActive: { backgroundColor: '#f97316', color: 'white' },
    filterInactive: { backgroundColor: 'white', color: '#4b5563' },
    orderCard: { backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px', overflow: 'hidden' },
    orderHeader: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid #e5e7eb' },
    orderHeaderLeft: { display: 'flex', alignItems: 'center', gap: '16px' },
    orderId: { fontSize: '18px', fontWeight: '600', color: '#1f2937' },
    badge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' },
    badgePending: { backgroundColor: '#fef3c7', color: '#92400e' },
    badgeCompleted: { backgroundColor: '#dbeafe', color: '#1e40af' },
    badgeEnviado: { backgroundColor: '#d1fae5', color: '#065f46' },
    orderEmail: { color: '#4b5563' },
    orderHeaderRight: { display: 'flex', alignItems: 'center', gap: '16px' },
    orderDate: { fontSize: '14px', color: '#6b7280' },
    orderAmount: { fontWeight: '600', color: '#f97316', fontSize: '18px' },
    orderDetails: { padding: '20px', backgroundColor: '#f9fafb' },
    detailsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' },
    sectionTitle: { fontWeight: '600', marginBottom: '12px', color: '#374151', fontSize: '16px' },
    detailRow: { marginBottom: '8px', fontSize: '14px' },
    detailLabel: { color: '#6b7280' },
    detailValue: { color: '#1f2937' },
    downloadBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', marginBottom: '8px', width: '100%' },
    staysTable: { width: '100%', borderCollapse: 'collapse', fontSize: '14px', marginTop: '12px' },
    tableHeader: { backgroundColor: '#f3f4f6', textAlign: 'left' },
    tableCell: { padding: '10px 12px', borderBottom: '1px solid #e5e7eb' },
    actionsBar: { marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    btnPrimary: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
    btnSuccess: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
    btnSecondary: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
    loginContainer: { minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    loginBox: { backgroundColor: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' },
    loginTitle: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' },
    input: { width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box' },
    loginBtn: { width: '100%', padding: '12px', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
    refreshBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
    logoutBtn: { background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '14px' }
  }

  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h1 style={styles.loginTitle}>🔐 Admin DedosFácil</h1>
          <form onSubmit={handleLogin}>
            <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Contraseña" style={styles.input} autoFocus />
            <button type="submit" style={styles.loginBtn}>Entrar</button>
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

  const filteredN2 = filteredOrders.filter(order => {
    if (!n2Search) return true
    const q = n2Search.toLowerCase()
    return (
      (order.email || '').toLowerCase().includes(q) ||
      (order.name || '').toLowerCase().includes(q) ||
      (order.nrua || '').toLowerCase().includes(q) ||
      (order.address || '').toLowerCase().includes(q) ||
      (order.province || '').toLowerCase().includes(q) ||
      (order.phone || '').toLowerCase().includes(q) ||
      String(order.id || '').includes(q)
    )
  })

  const filteredNrua = nruaRequests.filter(req => {
    if (!nruaSearch) return true
    const q = nruaSearch.toLowerCase()
    return (
      (req.email || '').toLowerCase().includes(q) ||
      (req.name || '').toLowerCase().includes(q) ||
      (req.surname || '').toLowerCase().includes(q) ||
      (req.catastral_ref || '').toLowerCase().includes(q) ||
      (req.cru || '').toLowerCase().includes(q) ||
      (req.property_address || '').toLowerCase().includes(q) ||
      (req.property_municipality || '').toLowerCase().includes(q) ||
      (req.id_number || '').toLowerCase().includes(q) ||
      String(req.order_id || '').includes(q)
    )
  })

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>📋 Panel Admin - DedosFácil</h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={() => { fetchOrders(); fetchNruaRequests() }} style={styles.refreshBtn}>🔄 Actualizar</button>
          <button onClick={() => { localStorage.removeItem('adminAuth'); setIsAuthenticated(false) }} style={styles.logoutBtn}>Cerrar sesión</button>
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
            <p style={{ ...styles.statNumber, color: '#2563eb' }}>{orders.filter(o => o.status === 'completed').length}</p>
            <p style={styles.statLabel}>Pagados</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#10b981' }}>{orders.filter(o => o.status === 'enviado').length}</p>
            <p style={styles.statLabel}>Enviados</p>
          </div>
          <div style={styles.statCard}>
            <p style={{ ...styles.statNumber, color: '#f59e0b' }}>{orders.filter(o => o.status === 'pending').length}</p>
            <p style={styles.statLabel}>Pendientes</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '2px solid #e5e7eb' }}>
          <button onClick={() => setActiveTab('n2')} style={{ padding: '12px 24px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600', borderBottom: activeTab === 'n2' ? '3px solid #f97316' : '3px solid transparent', color: activeTab === 'n2' ? '#f97316' : '#6b7280', background: 'none' }}>
            📄 Modelo N2 ({orders.length})
          </button>
          <button onClick={() => setActiveTab('nrua')} style={{ padding: '12px 24px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600', borderBottom: activeTab === 'nrua' ? '3px solid #3B82F6' : '3px solid transparent', color: activeTab === 'nrua' ? '#3B82F6' : '#6b7280', background: 'none' }}>
            🔑 Solicitudes NRUA ({nruaRequests.length})
          </button>
          <button onClick={() => setActiveTab('affiliates')} style={{ padding: '12px 24px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: '600', borderBottom: activeTab === 'affiliates' ? '3px solid #10b981' : '3px solid transparent', color: activeTab === 'affiliates' ? '#10b981' : '#6b7280', background: 'none' }}>
            🤝 Afiliados ({affiliates.length})
          </button>
        </div>

        {/* ===================== TAB N2 ===================== */}
        {activeTab === 'n2' && (<>
          <div style={styles.filterBar}>
            {[{ key: 'all', label: 'Todos' }, { key: 'completed', label: 'Pagados' }, { key: 'enviado', label: 'Enviados' }, { key: 'pending', label: 'Pendientes' }].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{ ...styles.filterBtn, ...(filter === f.key ? styles.filterActive : styles.filterInactive) }}>{f.label}</button>
            ))}
          </div>
          <div style={{ marginBottom: '16px' }}>
            <input type="text" placeholder="🔍 Buscar por email, nombre, NRUA, dirección, teléfono, nº pedido..." value={n2Search} onChange={e => setN2Search(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
            {n2Search && <p style={{ fontSize: '13px', color: '#6b7280', margin: '8px 0 0' }}>{filteredN2.length} resultado(s)</p>}
          </div>
          {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>⚠️ {error}</div>}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}><p style={{ color: '#6b7280' }}>⏳ Cargando pedidos...</p></div>
          ) : (
            <div>
              {filteredN2.length === 0 ? (
                <div style={{ ...styles.orderCard, padding: '32px', textAlign: 'center', color: '#6b7280' }}>No hay pedidos {filter !== 'all' ? 'con este filtro' : ''}</div>
              ) : (
                filteredN2.map(order => (
                  <div key={order.id} style={styles.orderCard}>
                    <div style={styles.orderHeader} onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                      <div style={styles.orderHeaderLeft}>
                        <span style={styles.orderId}>#{order.id}</span>
                        <span style={getBadgeStyle(order.status)}>{getStatusLabel(order.status)}</span>
                        <span style={styles.orderEmail}>{order.email}</span>
                      </div>
                      <div style={styles.orderHeaderRight}>
                        <span style={styles.orderDate}>{new Date(order.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        <span style={styles.orderAmount}>{(order.amount / 100).toFixed(0)}€</span>
                        <button onClick={(e) => { e.stopPropagation(); if (window.confirm(`¿Eliminar pedido #${order.id}?`)) { deleteOrder(order.id) } }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px 8px', borderRadius: '4px', opacity: 0.4 }} onMouseEnter={e => e.target.style.opacity = 1} onMouseLeave={e => e.target.style.opacity = 0.4} title="Eliminar pedido">🗑️</button>
                        <span>{expandedOrder === order.id ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {expandedOrder === order.id && (
                      <div style={styles.orderDetails}>
                        <div style={styles.detailsGrid}>
                          <div>
                            <h3 style={styles.sectionTitle}>📋 Datos del cliente</h3>
                            <p style={styles.detailRow}><span style={styles.detailLabel}>Nombre: </span><span style={styles.detailValue}>{order.name || '-'}</span></p>
                            <p style={styles.detailRow}><span style={styles.detailLabel}>Email: </span><span style={styles.detailValue}>{order.email}</span></p>
                            <p style={styles.detailRow}><span style={styles.detailLabel}>Teléfono: </span><span style={styles.detailValue}>{order.phone || '-'}</span></p>
                            <div style={{ ...styles.detailRow, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={styles.detailLabel}>NRUA: </span>
                              <input style={{ fontFamily: 'monospace', fontSize: '13px', padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', flex: 1, maxWidth: '400px' }} defaultValue={order.nrua || ''} onBlur={(e) => { if (e.target.value !== (order.nrua || '')) { updateNrua(order.id, e.target.value) } }} onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur() }} />
                            </div>
                            <p style={styles.detailRow}><span style={styles.detailLabel}>Dirección: </span><span style={styles.detailValue}>{order.address || '-'}</span></p>
                            <p style={styles.detailRow}><span style={styles.detailLabel}>Provincia: </span><span style={styles.detailValue}>{order.province || '-'}</span></p>
                          </div>
                          <div>
                            <h3 style={styles.sectionTitle}>📁 Archivos</h3>
                            {order.has_airbnb && <button onClick={() => downloadFile(order.id, 'airbnb')} style={styles.downloadBtn}>⬇️ Descargar Airbnb</button>}
                            {order.has_booking && <button onClick={() => downloadFile(order.id, 'booking')} style={styles.downloadBtn}>⬇️ Descargar Booking</button>}
                            {order.has_other && <button onClick={() => downloadFile(order.id, 'other')} style={styles.downloadBtn}>⬇️ Descargar Otro</button>}
                            {order.has_nrua_photo && <button onClick={() => downloadFile(order.id, 'nruaPhoto')} style={styles.downloadBtn}>📷 Foto NRUA ({order.nrua_photo_name})</button>}
                            {!order.has_airbnb && !order.has_booking && !order.has_other && !order.has_nrua_photo && <p style={{ color: '#9ca3af', fontSize: '14px' }}>Sin archivos</p>}
                          </div>
                        </div>

                        {order.stays_count > 0 && (
                          <div style={{ marginTop: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <h3 style={styles.sectionTitle}>🏠 Estancias extraídas ({order.stays_count})</h3>
                              {!editingStays[order.id] ? (
                                <button onClick={() => startEditingStays(order.id, order.extracted_stays || [])} style={{ padding: '6px 14px', backgroundColor: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>✏️ Editar estancias</button>
                              ) : (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button onClick={() => saveStays(order.id)} style={{ padding: '6px 14px', backgroundColor: '#D1FAE5', color: '#065F46', border: '1px solid #6EE7B7', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>💾 Guardar</button>
                                  <button onClick={() => cancelEditingStays(order.id)} style={{ padding: '6px 14px', backgroundColor: '#FEE2E2', color: '#991B1B', border: '1px solid #FCA5A5', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>✕ Cancelar</button>
                                </div>
                              )}
                            </div>
                            <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                              <table style={styles.staysTable}>
                                <thead style={styles.tableHeader}>
                                  <tr>
                                    <th style={styles.tableCell}>#</th>
                                    <th style={styles.tableCell}>Entrada</th>
                                    <th style={styles.tableCell}>Salida</th>
                                    <th style={styles.tableCell}>Huéspedes</th>
                                    <th style={styles.tableCell}>Finalidad</th>
                                    <th style={styles.tableCell}>Fuente</th>
                                    {editingStays[order.id] && <th style={styles.tableCell}></th>}
                                  </tr>
                                </thead>
                                <tbody>
                                  {(editingStays[order.id] || order.extracted_stays || []).map((stay, idx) => {
                                    const isEditing = !!editingStays[order.id]
                                    const invalidYear = isCheckoutYearInvalid(stay)
                                    const checkOutValue = stay.fecha_salida || stay.checkOut || ''
                                    const checkInValue = stay.fecha_entrada || stay.checkIn || ''
                                    return (
                                      <tr key={idx} style={invalidYear ? { backgroundColor: '#FEF9C3' } : {}}>
                                        <td style={{ ...styles.tableCell, color: '#9ca3af', fontSize: '12px' }}>{idx + 1}</td>
                                        <td style={styles.tableCell}>
                                          {isEditing ? <input type="text" value={checkInValue} onChange={e => updateEditingStay(order.id, idx, stay.fecha_entrada !== undefined ? 'fecha_entrada' : 'checkIn', e.target.value)} style={{ padding: '4px 6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', width: '100px' }} /> : checkInValue}
                                        </td>
                                        <td style={{ ...styles.tableCell, ...(invalidYear ? { fontWeight: '600', color: '#92400E' } : {}) }}>
                                          {isEditing ? (
                                            <div>
                                              <input type="text" value={checkOutValue} onChange={e => updateEditingStay(order.id, idx, stay.fecha_salida !== undefined ? 'fecha_salida' : 'checkOut', e.target.value)} style={{ padding: '4px 6px', border: invalidYear ? '2px solid #F59E0B' : '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', width: '100px', backgroundColor: invalidYear ? '#FEF9C3' : 'white' }} />
                                              {invalidYear && <div style={{ fontSize: '11px', color: '#B45309', marginTop: '2px' }}>⚠️ Año incorrecto</div>}
                                            </div>
                                          ) : (
                                            <span>{checkOutValue}{invalidYear && <span style={{ marginLeft: '6px', fontSize: '11px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '1px 6px', borderRadius: '4px' }}>⚠️ año distinto</span>}</span>
                                          )}
                                        </td>
                                        <td style={styles.tableCell}>
                                          {isEditing ? <input type="text" value={stay.huespedes || stay.guests || ''} onChange={e => updateEditingStay(order.id, idx, stay.huespedes !== undefined ? 'huespedes' : 'guests', e.target.value)} style={{ padding: '4px 6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', width: '50px', textAlign: 'center' }} /> : (stay.huespedes || stay.guests || '-')}
                                        </td>
                                        <td style={styles.tableCell}>
                                          {isEditing ? <input type="text" value={stay.finalidad || stay.purpose || ''} onChange={e => updateEditingStay(order.id, idx, stay.finalidad !== undefined ? 'finalidad' : 'purpose', e.target.value)} style={{ padding: '4px 6px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px', width: '80px' }} /> : (stay.finalidad || stay.purpose || 'Vacacional')}
                                        </td>
                                        <td style={styles.tableCell}>{stay.plataforma || stay.source || '-'}</td>
                                        {isEditing && <td style={styles.tableCell}><button onClick={() => deleteEditingStay(order.id, idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }} title="Eliminar fila">🗑️</button></td>}
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Actions N2 */}
                        <div style={styles.actionsBar}>
                          <div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {order.stays_count > 0 && <button onClick={() => downloadN2Csv(order.id)} style={styles.btnPrimary}>📄 CSV para N2</button>}
                              <button onClick={() => downloadAuthorizationPdf(order.id)} style={styles.btnSecondary}>📋 Autorización PDF</button>
                              {order.status === 'enviado' && <button onClick={() => sendReviewEmail(order.id)} style={{ ...styles.btnSecondary, backgroundColor: '#f59e0b' }}>⭐ Reenviar valoración</button>}
                            </div>
                          </div>
                          {order.status === 'pending' && <button onClick={() => sendPaymentReminder(order.id)} style={{ ...styles.btnPrimary, backgroundColor: '#f59e0b' }}>💳 Enviar recordatorio pago</button>}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {order.status === 'completed' && <button onClick={() => sendJustificante(order.id)} style={styles.btnSuccess}>📧 Enviar justificante</button>}
                            {order.status === 'enviado' && <button onClick={() => updateStatus(order.id, 'completed')} disabled={updatingStatus === order.id} style={{ ...styles.btnSecondary, opacity: updatingStatus === order.id ? 0.5 : 1 }}>Desmarcar Enviado</button>}
                            <button onClick={() => { if (window.confirm(`¿Seguro que quieres eliminar el pedido #${order.id}?`)) { deleteOrder(order.id) } }} style={{ padding: '10px 16px', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>🗑️ Eliminar</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </>)}

        {/* ===================== TAB NRUA ===================== */}
        {activeTab === 'nrua' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <input type="text" placeholder="🔍 Buscar por email, nombre, CRU, referencia catastral, dirección, NIF/NIE, nº pedido..." value={nruaSearch} onChange={e => setNruaSearch(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
              {nruaSearch && <p style={{ fontSize: '13px', color: '#6b7280', margin: '8px 0 0' }}>{filteredNrua.length} resultado(s)</p>}
            </div>
            {filteredNrua.length === 0 ? (
              <div style={{ ...styles.orderCard, padding: '32px', textAlign: 'center', color: '#6b7280' }}>No hay solicitudes NRUA</div>
            ) : (
              filteredNrua.map(req => (
                <div key={req.id} style={styles.orderCard}>
                  <div style={styles.orderHeader} onClick={() => setExpandedOrder(expandedOrder === `nrua-${req.id}` ? null : `nrua-${req.id}`)}>
                    <div style={styles.orderHeaderLeft}>
                      <span style={styles.orderId}>#{req.order_id}</span>
                      <span style={{ ...styles.badge, ...(req.status === 'completed' ? styles.badgeCompleted : req.status === 'enviado' ? styles.badgeEnviado : styles.badgePending) }}>
                        {req.status === 'pending' ? 'Pendiente' : req.status === 'completed' ? 'Pagado' : req.status === 'enviado' ? 'Enviado' : req.status}
                      </span>
                      <span style={{ ...styles.badge, backgroundColor: '#DBEAFE', color: '#1E40AF' }}>NRUA</span>
                      <span style={styles.orderEmail}>{req.email}</span>
                    </div>
                    <div style={styles.orderHeaderRight}>
                      <span style={styles.orderDate}>{new Date(req.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      <span style={{ ...styles.orderAmount, color: '#3B82F6' }}>149€</span>
                      <span>{expandedOrder === `nrua-${req.id}` ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {expandedOrder === `nrua-${req.id}` && (
                    <div style={styles.orderDetails}>
                      <div style={styles.detailsGrid}>
                        {/* Solicitante */}
                        <div>
                          <h3 style={styles.sectionTitle}>👤 Solicitante</h3>
                          <p style={styles.detailRow}><span style={styles.detailLabel}>Tipo: </span><span style={styles.detailValue}>{req.person_type === 'physical' ? 'Persona física' : 'Persona jurídica'}</span></p>
                          <p style={styles.detailRow}><span style={styles.detailLabel}>Nombre: </span><span style={styles.detailValue}>{req.person_type === 'physical' ? `${req.name || ''} ${req.surname || ''}` : req.company_name || '-'}</span></p>
                          <p style={styles.detailRow}><span style={styles.detailLabel}>{req.id_type || 'NIE'}: </span><span style={{ ...styles.detailValue, fontFamily: 'monospace' }}>{req.id_number || '-'}</span></p>
                          <p style={styles.detailRow}><span style={styles.detailLabel}>Email: </span><span style={styles.detailValue}>{req.email || '-'}</span></p>
                          <p style={styles.detailRow}><span style={styles.detailLabel}>Teléfono: </span><span style={styles.detailValue}>{req.phone || '-'}</span></p>
                          <p style={styles.detailRow}><span style={styles.detailLabel}>Dirección: </span><span style={styles.detailValue}>{req.address || '-'}, {req.postal_code || ''} {req.municipality || ''}, {req.province || ''}</span></p>
                          <p style={styles.detailRow}><span style={styles.detailLabel}>País: </span><span style={styles.detailValue}>{req.country || '-'}</span></p>
                        </div>
                        {/* Propiedad */}
                        <div>
                          <h3 style={styles.sectionTitle}>🏠 Propiedad</h3>
                          <p style={styles.detailRow}><span style={styles.detailLabel}>Dirección: </span><span style={styles.detailValue}>{req.property_address || '-'}{req.property_extra ? `, ${req.property_extra}` : ''}</span></p>
                          <p style={styles.detailRow}><span style={styles.detailLabel}>Municipio: </span><span style={styles.detailValue}>{req.property_municipality || '-'}, {req.property_province || '-'} ({req.property_postal_code || '-'})</span></p>
                          <p style={styles.detailRow}><span style={styles.detailLabel}>Ref. Catastral: </span><span style={{ ...styles.detailValue, fontFamily: 'monospace' }}>{req.catastral_ref || '-'}</span></p>
                          <p style={styles.detailRow}><span style={styles.detailLabel}>CRU: </span><span style={{ ...styles.detailValue, fontFamily: 'monospace' }}>{req.cru || 'No proporcionado'}</span></p>
                          <p style={styles.detailRow}><span style={styles.detailLabel}>Tipo: </span><span style={styles.detailValue}>{req.unit_type === 'complete' ? 'Finca completa' : 'Habitación'} / {req.category === 'tourist' ? 'Turístico' : 'No turístico'}</span></p>
                          <p style={styles.detailRow}><span style={styles.detailLabel}>Residencia: </span><span style={styles.detailValue}>{req.residence_type === 'primary' ? 'Principal' : req.residence_type === 'secondary' ? 'Secundaria' : 'Otros'}</span></p>
                          <p style={styles.detailRow}><span style={styles.detailLabel}>Máx. huéspedes: </span><span style={styles.detailValue}>{req.max_guests || '-'}</span></p>
                          <p style={styles.detailRow}><span style={styles.detailLabel}>Equipamiento UE: </span><span style={styles.detailValue}>{req.equipped === 'yes' ? '✅ Sí' : '❌ No'}</span></p>
                          <p style={styles.detailRow}><span style={styles.detailLabel}>Licencia turística: </span><span style={styles.detailValue}>{req.has_license === 'yes' ? `✅ ${req.license_number || '-'}` : '❌ No tiene'}</span></p>
                        </div>
                      </div>

                      {/* Autorización */}
                      <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#F0F4FF', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                        <h3 style={{ margin: '0 0 8px', fontSize: '14px', color: '#1E40AF' }}>📋 Autorización</h3>
                        <p style={{ margin: '4px 0', fontSize: '13px', color: '#374151' }}>✅ Aceptada: {req.authorization_timestamp ? new Date(req.authorization_timestamp).toLocaleString('es-ES') : '-'}</p>
                        <p style={{ margin: '4px 0', fontSize: '13px', color: '#374151' }}>IP: {req.authorization_ip || '-'} | GDPR: {req.gdpr_accepted ? '✅' : '❌'} | Idioma: {req.lang || '-'}</p>
                      </div>

                      {/* ✅ CAMPO NRUA PROVISIONAL — correctamente dentro del map de req */}
                      <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#F0FDF4', borderRadius: '8px', border: '1px solid #6EE7B7' }}>
                        <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#065F46' }}>🔑 Número NRUA Provisional</h3>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="Ej: ES-14-RU-00001234"
                            value={nruaNumbers[req.id] ?? (req.provisional_nrua || '')}
                            onChange={e => setNruaNumbers(prev => ({ ...prev, [req.id]: e.target.value }))}
                            style={{ flex: 1, padding: '10px 14px', border: '1px solid #6EE7B7', borderRadius: '8px', fontSize: '14px', fontFamily: 'monospace' }}
                          />
                          <button
                            onClick={() => sendNruaEmail(req.id)}
                            style={{ padding: '10px 20px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap' }}
                          >
                            📨 Enviar número NRUA
                          </button>
                        </div>
                        {req.provisional_nrua && (
                          <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#065F46' }}>
                            ✅ Último enviado: <strong style={{ fontFamily: 'monospace' }}>{req.provisional_nrua}</strong>
                          </p>
                        )}
                      </div>

                      {/* Actions NRUA */}
                      <div style={{ ...styles.actionsBar, marginTop: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {req.status === 'completed' && (
                            <button
                              onClick={() => sendNruaJustificante(req.id)}
                              style={styles.btnSuccess}
                            >
                              📧 Enviar justificante NRUA
                            </button>
                          )}
                          {req.status === 'enviado' && (
                            <button
                              onClick={() => updateNruaStatus(req.id, 'completed')}
                              style={styles.btnSecondary}
                            >
                              Desmarcar Enviado
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if (!window.confirm('¿Eliminar esta solicitud NRUA?')) return
                              try {
                                await fetch(`/api/admin/nrua-requests/${req.id}`, { method: 'DELETE' })
                                fetchNruaRequests()
                              } catch (err) { console.error(err) }
                            }}
                            style={{ padding: '6px 12px', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
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

        {/* ===================== TAB AFILIADOS ===================== */}
        {activeTab === 'affiliates' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>🤝 Gestión de Afiliados</h3>
              <button onClick={() => setShowAffForm(!showAffForm)} style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                {showAffForm ? '✕ Cerrar' : '+ Nuevo afiliado'}
              </button>
            </div>

            {showAffForm && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 16px' }}>Crear nuevo afiliado</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input placeholder="Nombre" value={newAffiliate.name} onChange={e => setNewAffiliate(p => ({ ...p, name: e.target.value }))} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  <input placeholder="Email" value={newAffiliate.email} onChange={e => setNewAffiliate(p => ({ ...p, email: e.target.value }))} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  <input placeholder="Código (ej: MARIA10)" value={newAffiliate.code} onChange={e => setNewAffiliate(p => ({ ...p, code: e.target.value.toUpperCase() }))} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  <input placeholder="Contraseña" value={newAffiliate.password} onChange={e => setNewAffiliate(p => ({ ...p, password: e.target.value }))} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  <div>
                    <label style={{ fontSize: '13px', color: '#6b7280' }}>Comisión %</label>
                    <input type="number" value={newAffiliate.commission_percent} onChange={e => setNewAffiliate(p => ({ ...p, commission_percent: parseInt(e.target.value) }))} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%' }} />
                  </div>
                  <div>
                    <button onClick={createAffiliate} style={{ padding: '10px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', marginTop: '18px' }}>✅ Crear afiliado</button>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>El afiliado podrá compartir dos enlaces: uno con 10% y otro con 20% de descuento.</p>
              </div>
            )}

            {affiliates.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>No hay afiliados registrados.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                      {['Nombre','Código','Comisión','Referidos','Ventas','Comisión total','Actividad','Estado','Acciones'].map(h => (
                        <th key={h} style={{ padding: '10px', textAlign: 'left', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {affiliates.map(aff => (
                      <tr key={aff.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px 10px' }}>
                          <div><strong>{aff.name}</strong></div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{aff.email}</div>
                          {aff.payment_info && <div style={{ fontSize: '11px', color: '#10b981', marginTop: '2px' }}>💰 {aff.payment_info}</div>}
                        </td>
                        <td style={{ padding: '12px 10px' }}><code style={{ backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>{aff.code}</code></td>
                        <td style={{ padding: '12px 10px' }}>{aff.commission_percent}%</td>
                        <td style={{ padding: '12px 10px' }}>{aff.total_referrals || 0}</td>
                        <td style={{ padding: '12px 10px', color: '#10b981', fontWeight: '600' }}>{aff.completed_referrals || 0}</td>
                        <td style={{ padding: '12px 10px', color: '#f59e0b', fontWeight: '600' }}>{((aff.total_commission || 0) / 100).toFixed(0)}€</td>
                        <td style={{ padding: '12px 10px', fontSize: '12px' }}>
                          <div>🖱️ {aff.link_clicks || 0} clics</div>
                          <div>🔑 {aff.login_count || 0} logins</div>
                          {aff.last_login && <div style={{ color: '#6b7280' }}>Último: {new Date(aff.last_login).toLocaleDateString('es-ES')}</div>}
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500', backgroundColor: aff.active ? '#D1FAE5' : '#FEE2E2', color: aff.active ? '#065F46' : '#991B1B' }}>
                            {aff.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => toggleAffiliate(aff.id)} style={{ padding: '4px 12px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', background: 'white' }}>{aff.active ? '⏸️ Desactivar' : '▶️ Activar'}</button>
                            <button onClick={() => deleteAffiliate(aff.id)} style={{ padding: '4px 12px', border: '1px solid #fca5a5', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', background: '#FEF2F2', color: '#DC2626' }}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
