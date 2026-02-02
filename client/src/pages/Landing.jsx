import React, { useState, useEffect } from 'react'
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
  Mail,
  AlertTriangle,
  Home,
  Building
} from 'lucide-react'

function Landing() {
  const [activeService, setActiveService] = useState('nrua') // Default to NRUA (urgent!)
  const [daysLeft, setDaysLeft] = useState(28)

  useEffect(() => {
    // Calculate days until March 2, 2026
    const deadline = new Date('2026-03-02')
    const today = new Date()
    const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
    setDaysLeft(diff > 0 ? diff : 0)
  }, [])

  return (
    <div className="landing">
      {/* URGENT BANNER - Only for NRUA */}
      <div className="urgent-banner">
        <AlertTriangle size={20} />
        <span>
          <strong>⚠️ URGENTE:</strong> Solo quedan <strong>{daysLeft} días</strong> para presentar el Depósito de Arrendamientos (NRUA). 
          Si no lo haces, <strong>pierdes tu licencia de Airbnb/Booking</strong>.
        </span>
        <a href="#empezar" className="banner-cta">Empezar ahora →</a>
      </div>

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <span className="logo-icon">DF</span>
            <span className="logo-text">DedosFácil</span>
          </div>
          <nav className="nav">
            <a href="#servicios">Servicios</a>
            <a href="#como-funciona">Cómo funciona</a>
            <a href="#precios">Precios</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a href="#empezar" className="btn btn-primary">Empezar ahora</a>
        </div>
      </header>

      {/* Hero with Service Selector */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            {/* Service Selector Tabs */}
            <div className="service-selector" id="servicios">
              <button 
                className={`service-tab ${activeService === 'nrua' ? 'active urgent' : ''}`}
                onClick={() => setActiveService('nrua')}
              >
                <Home size={20} />
                <span>Alquiler Turístico</span>
                <span className="tab-badge urgent">¡URGENTE!</span>
              </button>
              <button 
                className={`service-tab ${activeService === 'cuentas' ? 'active' : ''}`}
                onClick={() => setActiveService('cuentas')}
              >
                <Building size={20} />
                <span>Cuentas Anuales</span>
                <span className="tab-badge">Julio 2026</span>
              </button>
            </div>

            {activeService === 'nrua' ? (
              /* NRUA Content */
              <>
                <div className="hero-badge urgent">
                  <AlertTriangle size={16} />
                  <span>Plazo: 2 de marzo · {daysLeft} días</span>
                </div>
                <h1>
                  Presenta tu <span className="gradient-text">Depósito de Arrendamientos</span> sin complicaciones
                </h1>
                <p className="hero-subtitle">
                  ¿Tienes un piso en Airbnb o Booking? Estás obligado a presentar el informe anual de alquileres (NRUA).
                  <strong> Si no lo haces, te revocan la licencia.</strong>
                </p>
                <div className="hero-cta">
                  <a href="#empezar" className="btn btn-primary btn-large btn-urgent">
                    Salvar mi licencia
                    <ArrowRight size={20} />
                  </a>
                  <span className="hero-price">Desde <strong>79€</strong></span>
                </div>
                <div className="hero-trust">
                  <div className="trust-item">
                    <CheckCircle size={18} />
                    <span>Sin programa N2</span>
                  </div>
                  <div className="trust-item">
                    <Shield size={18} />
                    <span>100% Legal</span>
                  </div>
                  <div className="trust-item">
                    <Clock size={18} />
                    <span>24-48h entrega</span>
                  </div>
                </div>
              </>
            ) : (
              /* Cuentas Anuales Content */
              <>
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
              </>
            )}
          </div>
          <div className="hero-visual">
            <div className={`hero-card ${activeService === 'nrua' ? 'urgent-card' : ''}`}>
              <div className="card-header">
                <X size={12} className="card-dot red" />
                <X size={12} className="card-dot yellow" />
                <X size={12} className="card-dot green" />
              </div>
              <div className="card-content">
                <div className="card-icon">
                  {activeService === 'nrua' ? <Home size={48} /> : <FileText size={48} />}
                </div>
                <div className="card-status">
                  <Check size={24} className="status-check" />
                  <span>{activeService === 'nrua' ? 'NRUA presentado' : 'Cuentas depositadas'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-bg"></div>
      </section>

      {/* Warning Box - Only for NRUA */}
      {activeService === 'nrua' && (
        <section className="warning-section">
          <div className="container">
            <div className="warning-box">
              <AlertTriangle size={32} />
              <div className="warning-content">
                <h3>⚠️ Consecuencias de NO presentar:</h3>
                <ul>
                  <li><X size={16} /> <strong>Revocación del NRUA</strong> = No puedes anunciar en Airbnb, Booking, VRBO...</li>
                  <li><X size={16} /> Pierdes tu fuente de ingresos inmediatamente</li>
                  <li><X size={16} /> Proceso largo y costoso para recuperar la licencia</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Problema / Solución */}
      <section className="problem-solution">
        <div className="container">
          <div className="comparison">
            <div className="comparison-item problem">
              <h3>😤 El problema</h3>
              <ul>
                {activeService === 'nrua' ? (
                  <>
                    <li><X size={18} /> Descargar e instalar programa N2</li>
                    <li><X size={18} /> Entender códigos NRUA y CRU</li>
                    <li><X size={18} /> Introducir cada estancia manualmente</li>
                    <li><X size={18} /> Generar archivos XBRL</li>
                    <li><X size={18} /> Certificado digital obligatorio</li>
                    <li><X size={18} /> Errores incomprensibles</li>
                  </>
                ) : (
                  <>
                    <li><X size={18} /> Descargar programa D2 (difícil de encontrar)</li>
                    <li><X size={18} /> Instalarlo en Windows</li>
                    <li><X size={18} /> Entender formularios complicados</li>
                    <li><X size={18} /> Certificado digital obligatorio</li>
                    <li><X size={18} /> Errores técnicos constantes</li>
                    <li><X size={18} /> Horas perdidas</li>
                  </>
                )}
              </ul>
            </div>
            <div className="comparison-item solution">
              <h3>😊 Nuestra solución</h3>
              <ul>
                <li><Check size={18} /> Todo online, sin descargas</li>
                <li><Check size={18} /> Formulario simple en español</li>
                <li><Check size={18} /> No necesitas certificado digital</li>
                <li><Check size={18} /> Nosotros generamos todo</li>
                <li><Check size={18} /> Presentamos por ti</li>
                <li><Check size={18} /> Listo en 24-48 horas</li>
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
              <h3>Envíanos tus datos</h3>
              <p>
                {activeService === 'nrua' 
                  ? 'Tu NRUA y las fechas de cada estancia (check-in, check-out, huéspedes).'
                  : 'Excel, PDF o rellena el formulario. Nuestra IA extrae los datos automáticamente.'
                }
              </p>
            </div>
            
            <div className="step-arrow">→</div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon">
                <CheckCircle size={32} />
              </div>
              <h3>Revisamos y preparamos</h3>
              <p>Verificamos que todo esté correcto y preparamos el archivo oficial.</p>
            </div>
            
            <div className="step-arrow">→</div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon">
                <FileText size={32} />
              </div>
              <h3>Recibe el justificante</h3>
              <p>Presentamos en el Registro. En 24-48h tienes tu justificante oficial.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Precios */}
      <section className="pricing" id="precios">
        <div className="container">
          <h2>Precios claros, sin sorpresas</h2>
          <p className="section-subtitle">
            {activeService === 'nrua' 
              ? 'Depósito de Arrendamientos (NRUA)'
              : 'Depósito de Cuentas Anuales'
            }
          </p>
          
          {activeService === 'nrua' ? (
            /* NRUA Pricing */
            <div className="pricing-cards">
              <div className="pricing-card">
                <h3>1 Propiedad</h3>
                <div className="price">
                  <span className="amount">79€</span>
                  <span className="period">por depósito</span>
                </div>
                <ul>
                  <li><Check size={18} /> 1 CRU / NRUA</li>
                  <li><Check size={18} /> Presentación en Registro</li>
                  <li><Check size={18} /> Justificante oficial</li>
                  <li><Check size={18} /> Soporte por email</li>
                  <li><Check size={18} /> Entrega en 48h</li>
                </ul>
                <a href="#empezar" className="btn btn-secondary">Seleccionar</a>
              </div>
              
              <div className="pricing-card featured">
                <div className="popular-badge">Más popular</div>
                <h3>Pack 3 Propiedades</h3>
                <div className="price">
                  <span className="amount">199€</span>
                  <span className="period">ahorra 38€</span>
                </div>
                <ul>
                  <li><Check size={18} /> Hasta 3 propiedades</li>
                  <li><Check size={18} /> Presentación en Registro</li>
                  <li><Check size={18} /> Justificante oficial</li>
                  <li><Check size={18} /> Soporte prioritario</li>
                  <li><Check size={18} /> Entrega en 24h</li>
                </ul>
                <a href="#empezar" className="btn btn-primary">Seleccionar</a>
              </div>
              
              <div className="pricing-card">
                <h3>Pack 10 Propiedades</h3>
                <div className="price">
                  <span className="amount">449€</span>
                  <span className="period">ahorra 341€</span>
                </div>
                <ul>
                  <li><Check size={18} /> Hasta 10 propiedades</li>
                  <li><Check size={18} /> Presentación en Registro</li>
                  <li><Check size={18} /> Gestión completa</li>
                  <li><Check size={18} /> Soporte telefónico</li>
                  <li><Check size={18} /> Entrega prioritaria</li>
                </ul>
                <a href="#empezar" className="btn btn-secondary">Seleccionar</a>
              </div>
            </div>
          ) : (
            /* Cuentas Anuales Pricing */
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
          )}
          
          <p className="pricing-note">
            {activeService === 'nrua'
              ? '* Tasas del Registro de la Propiedad no incluidas'
              : '* Las tasas del Registro Mercantil (65-85€) se pagan aparte directamente al Registro'
            }
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="container">
          <h2>Preguntas frecuentes</h2>
          
          <div className="faq-list">
            {activeService === 'nrua' ? (
              /* NRUA FAQ */
              <>
                <div className="faq-item">
                  <div className="faq-question">
                    <HelpCircle size={20} />
                    <span>¿Qué es el NRUA y por qué debo presentar esto?</span>
                  </div>
                  <p className="faq-answer">
                    El NRUA (Número de Registro Único de Arrendamientos) es obligatorio desde 2025 para alquileres turísticos. 
                    Cada año debes informar de todas las estancias. Si no lo haces antes del 2 de marzo, te revocan el NRUA 
                    y no puedes anunciar en plataformas como Airbnb o Booking.
                  </p>
                </div>
                
                <div className="faq-item">
                  <div className="faq-question">
                    <HelpCircle size={20} />
                    <span>¿Qué datos necesito para presentar?</span>
                  </div>
                  <p className="faq-answer">
                    Tu código NRUA, y por cada estancia del año 2025: fecha de entrada, fecha de salida, 
                    número de huéspedes y finalidad (vacacional, laboral, etc.). Si usas Airbnb o Booking, 
                    puedes descargar el historial de reservas.
                  </p>
                </div>
                
                <div className="faq-item">
                  <div className="faq-question">
                    <HelpCircle size={20} />
                    <span>¿Podéis presentarlo por mí legalmente?</span>
                  </div>
                  <p className="faq-answer">
                    Sí, 100% legal. La normativa permite que lo presente el titular "o quien acredite la gestión del mismo". 
                    Actuamos como gestores autorizados, igual que una gestoría tradicional.
                  </p>
                </div>
                
                <div className="faq-item">
                  <div className="faq-question">
                    <HelpCircle size={20} />
                    <span>¿Qué pasa si mi piso no tuvo ningún alquiler en 2025?</span>
                  </div>
                  <p className="faq-answer">
                    También debes presentar el depósito marcando "sin actividad". 
                    Nosotros nos encargamos de todo igualmente.
                  </p>
                </div>
              </>
            ) : (
              /* Cuentas Anuales FAQ */
              <>
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
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className={`cta-final ${activeService === 'nrua' ? 'urgent' : ''}`} id="empezar">
        <div className="container">
          {activeService === 'nrua' ? (
            <>
              <div className="cta-countdown">
                <span className="countdown-number">{daysLeft}</span>
                <span className="countdown-label">días restantes</span>
              </div>
              <h2>No pierdas tu licencia de alquiler turístico</h2>
              <p>Presenta el Depósito de Arrendamientos antes del 2 de marzo</p>
              <a href="/formulario-nrua" className="btn btn-primary btn-large btn-urgent">
                Empezar ahora
                <ArrowRight size={20} />
              </a>
            </>
          ) : (
            <>
              <h2>¿Listo para olvidarte del D2?</h2>
              <p>Empieza ahora y ten tus cuentas depositadas en 24-48 horas</p>
              <a href="/formulario" className="btn btn-primary btn-large">
                Empezar ahora
                <ArrowRight size={20} />
              </a>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo">
                <span className="logo-icon">DF</span>
                <span className="logo-text">DedosFácil</span>
              </div>
              <p>Trámites registrales sin complicaciones</p>
            </div>
            <div className="footer-links">
              <h4>Servicios</h4>
              <a href="#" onClick={() => setActiveService('nrua')}>Depósito Arrendamientos (NRUA)</a>
              <a href="#" onClick={() => setActiveService('cuentas')}>Cuentas Anuales (D2)</a>
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
            <p>© 2026 DedosFácil. Todos los derechos reservados.</p>
            <p className="disclaimer">
              Este servicio es de preparación y presentación documental. 
              No somos el Registro Mercantil ni el Registro de la Propiedad.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
