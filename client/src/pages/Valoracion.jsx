import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const Valoracion = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!rating) return setError('Selecciona una valoración')
    if (!name.trim()) return setError('Escribe tu nombre')
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, name: name.trim(), rating, comment: comment.trim() })
      })
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
      } else {
        setSubmitted(true)
      }
    } catch (err) {
      setError('Error al enviar. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!orderId) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p>Enlace no válido</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h2 style={styles.title}>¡Gracias por tu valoración!</h2>
          <p style={styles.subtitle}>Tu opinión nos ayuda a mejorar.</p>
          <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '16px' }}>
            {[1,2,3,4,5].map(i => (
              <span key={i} style={{ fontSize: '32px' }}>{i <= rating ? '⭐' : '☆'}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>DF</span>
          <span style={styles.logoText}>DedosFácil</span>
        </div>
        
        <h2 style={styles.title}>¿Qué te ha parecido nuestro servicio?</h2>
        <p style={styles.subtitle}>Tu valoración nos ayuda a mejorar</p>

        {/* Stars */}
        <div style={styles.starsRow}>
          {[1,2,3,4,5].map(i => (
            <button
              key={i}
              onClick={() => setRating(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              style={styles.starBtn}
            >
              <span style={{ fontSize: '40px', transition: 'transform 0.2s', transform: (hover || rating) >= i ? 'scale(1.1)' : 'scale(1)' }}>
                {(hover || rating) >= i ? '⭐' : '☆'}
              </span>
            </button>
          ))}
        </div>
        <p style={styles.ratingLabel}>
          {rating === 1 && '😞 Malo'}
          {rating === 2 && '😐 Regular'}
          {rating === 3 && '🙂 Bien'}
          {rating === 4 && '😊 Muy bien'}
          {rating === 5 && '🤩 Excelente'}
        </p>

        {/* Name */}
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Tu nombre"
          style={styles.input}
        />

        {/* Comment */}
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Cuéntanos tu experiencia (opcional)"
          rows={3}
          style={{ ...styles.input, resize: 'vertical' }}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button onClick={handleSubmit} disabled={loading} style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}>
          {loading ? '⏳ Enviando...' : '✅ Enviar valoración'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '480px',
    width: '100%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '24px'
  },
  logoIcon: {
    backgroundColor: '#f97316',
    color: 'white',
    fontWeight: 'bold',
    padding: '6px 10px',
    borderRadius: '8px',
    fontSize: '16px'
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937'
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1f2937',
    margin: '0 0 8px 0'
  },
  subtitle: {
    color: '#6b7280',
    margin: '0 0 24px 0'
  },
  starsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  starBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px'
  },
  ratingLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#374151',
    minHeight: '24px',
    marginBottom: '24px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '12px',
    boxSizing: 'border-box',
    fontFamily: 'inherit'
  },
  btn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px'
  },
  error: {
    color: '#dc2626',
    fontSize: '14px',
    margin: '0 0 12px 0'
  }
}

export default Valoracion
