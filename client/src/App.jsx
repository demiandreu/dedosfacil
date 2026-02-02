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
              <p>Excel, PDF o rellena el formulario. Nuestra IA extrae los datos automáticamente.</p>
            </div>
            
            <div className="step-arrow">→</div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">
                <CheckCircle size={32} />
              </div>
              <h3>Revisa y confirma</h3>
              <p>Verificamos que todo esté correcto. Tú solo confirmas.</p>
            </div>
            
            <div className="step-arrow">→</div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">
                <FileText size={32} />
              </div>
              <h3>Recibe el justificante</h3>
              <p>Nosotros presentamos en el Registro. En 24-48h tienes tu justificante.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Precios */}
      <section className="pricing" id="precios">
        <div className="container">
          <h2>Precios claros, sin sorpresas</h2>
          <p className="section-subtitle">Elige el plan que mejor se adapte a ti</p>
          
          <div className="pricing-cards">
            <div className="pricing-card">
              <h3>Básico</h3>
              <div className="price">
                <span className="amount">99€</span>
                <span className="period">por depósito</span>
              </div>
              <ul>
                <li><Check size={18} /> Presentación en Registro Mercantil</li>
                <li><Check size={18} /> Justificante de depósito</li>
                <li><Check size={18} /> Soporte por email</li>
                <li><Check size={18} /> Entrega en 48h</li>
              </ul>
              <a href="#empezar" className="btn btn-secondary">Seleccionar</a>
            </div>
            
            <div className="pricing-card featured">
              <div className="popular-badge">Más popular</div>
              <h3>Estándar</h3>
              <div className="price">
                <span className="amount">149€</span>
                <span className="period">por depósito</span>
              </div>
              <ul>
                <li><Check size={18} /> Todo lo del plan Básico</li>
                <li><Check size={18} /> Revisión por experto contable</li>
                <li><Check size={18} /> Corrección de errores</li>
                <li><Check size={18} /> Soporte prioritario</li>
                <li><Check size={18} /> Entrega en 24h</li>
              </ul>
              <a href="#empezar" className="btn btn-primary">Seleccionar</a>
            </div>
            
            <div className="pricing-card">
              <h3>Urgente</h3>
              <div className="price">
                <span className="amount">199€</span>
                <span className="period">por depósito</span>
              </div>
              <ul>
                <li><Check size={18} /> Todo lo del plan Estándar</li>
                <li><Check size={18} /> Procesamiento inmediato</li>
                <li><Check size={18} /> Soporte telefónico</li>
                <li><Check size={18} /> Entrega el mismo día</li>
              </ul>
              <a href="#empezar" className="btn btn-secondary">Seleccionar</a>
            </div>
          </div>
          
          <p className="pricing-note">
            * Las tasas del Registro Mercantil (65-85€) se pagan aparte directamente al Registro
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="container">
          <h2>Preguntas frecuentes</h2>
          
          <div className="faq-list">
            <div className="faq-item">
              <div className="faq-question">
                <HelpCircle size={20} />
                <span>¿Es legal que presentéis las cuentas por mí?</span>
              </div>
              <p className="faq-answer">
                Sí, 100% legal. Actuamos como presentadores autorizados, igual que hacen las gestorías tradicionales. 
                El administrador de la sociedad firma el certificado de aprobación de cuentas.
              </p>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                <HelpCircle size={20} />
                <span>¿Qué documentos necesito?</span>
              </div>
              <p className="faq-answer">
                Balance de situación, cuenta de pérdidas y ganancias, y memoria. 
                Puedes subirlos en Excel o PDF, o rellenar nuestro formulario directamente.
              </p>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                <HelpCircle size={20} />
                <span>¿Cuál es el plazo para presentar las cuentas?</span>
              </div>
              <p className="faq-answer">
                El plazo termina el 30 de julio para empresas con ejercicio cerrado a 31 de diciembre. 
                Si no presentas, la hoja registral de tu empresa queda cerrada y puedes recibir sanciones.
              </p>
            </div>
            
            <div className="faq-item">
              <div className="faq-question">
                <HelpCircle size={20} />
                <span>¿Qué pasa si el Registro encuentra errores?</span>
              </div>
              <p className="faq-answer">
                Nos encargamos de subsanar cualquier defecto sin coste adicional. 
                Te mantenemos informado en todo momento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-final" id="empezar">
        <div className="container">
          <h2>¿Listo para olvidarte del D2?</h2>
          <p>Empieza ahora y ten tus cuentas depositadas en 24-48 horas</p>
          <a href="/formulario" className="btn btn-primary btn-large">
            Empezar ahora
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-icon">D2</span>
                <span className="logo-text">DedosFácil</span>
              </div>
              <p>Depósito de cuentas anuales sin complicaciones</p>
            </div>
            <div className="footer-links">
              <h4>Legal</h4>
              <a href="/aviso-legal">Aviso legal</a>
              <a href="/privacidad">Política de privacidad</a>
              <a href="/cookies">Cookies</a>
            </div>
            <div className="footer-contact">
              <h4>Contacto</h4>
              <a href="mailto:info@dedosfacil.es">
                <Mail size={16} />
                info@dedosfacil.es
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 DedosFácil. Todos los derechos reservados.</p>
            <p className="disclaimer">
              Este servicio es de preparación y presentación documental. 
              No somos el Registro Mercantil.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
