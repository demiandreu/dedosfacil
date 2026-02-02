import React from 'react'
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  Shield, 
  Zap,
  ArrowRight,
  X,
  Check,
  HelpCircle,
  Mail
} from 'lucide-react'

function Landing() {
  return (
    <div className="landing">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <span className="logo-icon">D2</span>
            <span className="logo-text">DedosFácil</span>
          </div>
          <nav className="nav">
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#precios">Precios</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a href="#empezar" className="btn btn-primary">Empezar ahora</a>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap size={16} />
              <span>Sin programa D2 · Sin instalaciones</span>
            </div>
            <h1>
              Deposita tus <span className="gradient-text">Cuentas Anuales</span> en 10 minutos
            </h1>
            <p className="hero-subtitle">
              Olvídate del programa D2 y sus complicaciones. 
              Nosotros nos encargamos de todo. Tú solo subes tus datos y listo.
            </p>
            <div className="hero-cta">
              <a href="#empezar" className="btn btn-primary btn-large">
                Empezar ahora
                <ArrowRight size={20} />
              </a>
              <span className="hero-price">Desde <strong>99€</strong></span>
            </div>
            <div className="hero-trust">
              <div className="trust-item">
                <CheckCircle size={18} />
                <span>100% Legal</span>
              </div>
              <div className="trust-item">
                <Shield size={18} />
                <span>Datos seguros</span>
              </div>
              <div className="trust-item">
                <Clock size={18} />
                <span>24-48h entrega</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="card-header">
                <span className="card-dot red"></span>
                <span className="card-dot yellow"></span>
                <span className="card-dot green"></span>
              </div>
              <div className="card-content">
                <div className="card-icon">
                  <FileText size={48} />
                </div>
                <div className="card-status">
                  <Check size={24} className="status-check" />
                  <span>Cuentas depositadas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-bg"></div>
      </section>

      {/* Problema / Solución */}
      <section className="problem-solution">
        <div className="container">
          <div className="comparison">
            <div className="comparison-item problem">
              <h3>😤 El problema</h3>
              <ul>
                <li><X size={18} /> Descargar programa D2 (difícil de encontrar)</li>
                <li><X size={18} /> Instalarlo en Windows</li>
                <li><X size={18} /> Entender formularios complicados</li>
                <li><X size={18} /> Certificado digital obligatorio</li>
                <li><X size={18} /> Errores técnicos constantes</li>
                <li><X size={18} /> Horas perdidas</li>
              </ul>
            </div>
            <div className="comparison-item solution">
              <h3>😊 Nuestra solución</h3>
              <ul>
                <li><Check size={18} /> Todo online, sin descargas</li>
                <li><Check size={18} /> Funciona en cualquier dispositivo</li>
                <li><Check size={18} /> Formulario simple en español</li>
                <li><Check size={18} /> No necesitas certificado</li>
                <li><Check size={18} /> IA que detecta errores</li>
                <li><Check size={18} /> Listo en 10 minutos</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="how-it-works" id="como-funciona">
        <div className="container">
          <h2>¿Cómo funciona?</h2>
          <p className="section-subtitle">3 pasos simples y ya está</p>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon">
                <Upload size={32} />
              </div>
              <h3>Sube tus datos</h3>
              <p>Excel, PDF o rellena el formulario. Nuestra IA extrae los datos aut
