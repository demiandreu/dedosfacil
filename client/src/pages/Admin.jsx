import React, { useState, useEffect } from 'react'
import { 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  X
} from 'lucide-react'

const Admin = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [filter, setFilter] = useState('all') // all, completed, pending, enviado
  const [adminPassword, setAdminPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(null)

  // Simple password protection
  const ADMIN_PASSWORD = 'dedos2026' // Cambia esto

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

      // Decode base64 and download
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

      // Download CSV
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
      
      // Refresh orders
      await fetchOrders()
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      enviado: 'bg-green-100 text-green-800'
    }
    const labels = {
      pending: 'Pendiente pago',
      completed: 'Pagado',
      enviado: 'Enviado'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100'}`}>
        {labels[status] || status}
      </span>
    )
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h1 className="text-2xl font-bold text-center mb-6">🔐 Admin DedosFácil</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full p-3 border rounded-lg mb-4"
              autoFocus
            />
            <button 
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">📋 Panel Admin - DedosFácil</h1>
          <div className="flex gap-4 items-center">
            <button 
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <RefreshCw size={18} />
              Actualizar
            </button>
            <button 
              onClick={() => { localStorage.removeItem('adminAuth'); setIsAuthenticated(false) }}
              className="text-sm text-gray-500 hover:text-red-500"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-gray-800">{orders.length}</div>
            <div className="text-sm text-gray-500">Total pedidos</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-500">Pagados</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">
              {orders.filter(o => o.status === 'enviado').length}
            </div>
            <div className="text-sm text-gray-500">Enviados</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-3xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-500">Pendientes</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {['all', 'completed', 'enviado', 'pending'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'completed' ? 'Pagados' : f === 'enviado' ? 'Enviados' : 'Pendientes'}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
            <p className="text-gray-500">Cargando pedidos...</p>
          </div>
        ) : (
          /* Orders list */
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-8 rounded-lg text-center text-gray-500">
                No hay pedidos {filter !== 'all' ? 'con este filtro' : ''}
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                  {/* Order header */}
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-semibold text-gray-800">
                        #{order.id}
                      </div>
                      {getStatusBadge(order.status)}
                      <div className="text-gray-600">{order.email}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="font-semibold text-orange-600">
                        {(order.amount / 100).toFixed(0)}€
                      </div>
                      {expandedOrder === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expandedOrder === order.id && (
                    <div className="border-t p-4 bg-gray-50">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Client info */}
                        <div>
                          <h3 className="font-semibold mb-2 text-gray-700">📋 Datos del cliente</h3>
                          <div className="space-y-1 text-sm">
                            <p><span className="text-gray-500">Nombre:</span> {order.name || '-'}</p>
                            <p><span className="text-gray-500">Email:</span> {order.email}</p>
                            <p><span className="text-gray-500">Teléfono:</span> {order.phone || '-'}</p>
                            <p><span className="text-gray-500">NRUA:</span> <span className="font-mono">{order.nrua || '-'}</span></p>
                            <p><span className="text-gray-500">Dirección:</span> {order.address || '-'}</p>
                            <p><span className="text-gray-500">Provincia:</span> {order.province || '-'}</p>
                          </div>
                        </div>

                        {/* Files */}
                        <div>
                          <h3 className="font-semibold mb-2 text-gray-700">📁 Archivos</h3>
                          <div className="space-y-2">
                            {order.has_airbnb && (
                              <button
                                onClick={() => downloadFile(order.id, 'airbnb')}
                                className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 text-sm w-full"
                              >
                                <Download size={16} className="text-pink-500" />
                                <span>Descargar Airbnb</span>
                              </button>
                            )}
                            {order.has_booking && (
                              <button
                                onClick={() => downloadFile(order.id, 'booking')}
                                className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 text-sm w-full"
                              >
                                <Download size={16} className="text-blue-500" />
                                <span>Descargar Booking</span>
                              </button>
                            )}
                            {order.has_other && (
                              <button
                                onClick={() => downloadFile(order.id, 'other')}
                                className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg hover:bg-gray-50 text-sm w-full"
                              >
                                <Download size={16} className="text-gray-500" />
                                <span>Descargar Otro</span>
                              </button>
                            )}
                            {!order.has_airbnb && !order.has_booking && !order.has_other && (
                              <p className="text-sm text-gray-400">Sin archivos</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stays */}
                      {order.stays_count > 0 && (
                        <div className="mt-4">
                          <h3 className="font-semibold mb-2 text-gray-700">
                            🏠 Estancias extraídas ({order.stays_count})
                          </h3>
                          <div className="bg-white rounded-lg border overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="px-3 py-2 text-left">Entrada</th>
                                  <th className="px-3 py-2 text-left">Salida</th>
                                  <th className="px-3 py-2 text-left">Huéspedes</th>
                                  <th className="px-3 py-2 text-left">Finalidad</th>
                                  <th className="px-3 py-2 text-left">Fuente</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(order.extracted_stays || []).slice(0, 10).map((stay, idx) => (
                                  <tr key={idx} className="border-t">
                                    <td className="px-3 py-2">{stay.fecha_entrada || stay.checkIn}</td>
                                    <td className="px-3 py-2">{stay.fecha_salida || stay.checkOut}</td>
                                    <td className="px-3 py-2">{stay.huespedes || stay.guests || '-'}</td>
                                    <td className="px-3 py-2">{stay.finalidad || stay.purpose || 'Vacacional'}</td>
                                    <td className="px-3 py-2">{stay.plataforma || stay.source || '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {order.stays_count > 10 && (
                              <div className="text-center py-2 text-sm text-gray-500 border-t">
                                ... y {order.stays_count - 10} estancias más
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <div className="flex gap-2">
                          {order.stays_count > 0 && (
                            <button
                              onClick={() => downloadN2Csv(order.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium"
                            >
                              <FileText size={16} />
                              Descargar CSV para N2
                            </button>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {order.status === 'completed' && (
                            <button
                              onClick={() => updateStatus(order.id, 'enviado')}
                              disabled={updatingStatus === order.id}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium disabled:opacity-50"
                            >
                              {updatingStatus === order.id ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <CheckCircle size={16} />
                              )}
                              Marcar como Enviado
                            </button>
                          )}
                          {order.status === 'enviado' && (
                            <button
                              onClick={() => updateStatus(order.id, 'completed')}
                              disabled={updatingStatus === order.id}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-medium disabled:opacity-50"
                            >
                              Desmarcar Enviado
                            </button>
                          )}
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
