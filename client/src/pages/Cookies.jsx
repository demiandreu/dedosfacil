import React from 'react'
import { ArrowLeft } from 'lucide-react'

function Cookies() {
  return (
    <div className="legal-page">
      <div className="legal-header">
        <a href="/" className="logo">
          <span className="logo-icon">DF</span>
          <span className="logo-text">DedosFácil</span>
        </a>
      </div>
      
      <div className="legal-container">
        <a href="/" className="back-link"><ArrowLeft size={18} /> Volver al inicio</a>
        
        <h1>Política de Cookies</h1>
        <p className="legal-updated">Última actualización: 1 de febrero de 2026</p>

        <section>
          <h2>1. ¿Qué son las cookies?</h2>
          <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en su dispositivo (ordenador, tablet o móvil) cuando los visita. Estas cookies permiten que el sitio web recuerde sus acciones y preferencias durante un período de tiempo, para que no tenga que volver a introducirlos cada vez que visite el sitio o navegue de una página a otra.</p>
        </section>

        <section>
          <h2>2. ¿Quién es el responsable del uso de cookies?</h2>
          <ul>
            <li><strong>Titular:</strong> Rental Connect Solutions Tmi</li>
            <li><strong>Y-tunnus:</strong> 3502814-5</li>
            <li><strong>Dirección:</strong> Telttakuja 3D 39, 00770 Helsinki, Uusimaa, Finlandia</li>
            <li><strong>Email:</strong> support@dedosfacil.es</li>
          </ul>
        </section>

        <section>
          <h2>3. Tipos de cookies que utilizamos</h2>
          
          <h3>3.1 Cookies técnicas (necesarias)</h3>
          <p>Son esenciales para el funcionamiento del sitio web y no pueden ser desactivadas. Permiten funciones básicas como la navegación y el acceso a áreas seguras.</p>
          <table className="cookies-table">
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Finalidad</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>session_id</td>
                <td>Mantener la sesión del usuario durante la navegación</td>
                <td>Sesión</td>
              </tr>
              <tr>
                <td>csrf_token</td>
                <td>Seguridad - Prevención de ataques CSRF</td>
                <td>Sesión</td>
              </tr>
              <tr>
                <td>cookies_accepted</td>
                <td>Recordar la aceptación de cookies</td>
                <td>1 año</td>
              </tr>
            </tbody>
          </table>

          <h3>3.2 Cookies de preferencias</h3>
          <p>Permiten recordar información que cambia la forma en que el sitio web se comporta o se ve, como su idioma preferido.</p>
          <table className="cookies-table">
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Finalidad</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>lang</td>
                <td>Recordar el idioma seleccionado por el usuario</td>
                <td>1 año</td>
              </tr>
            </tbody>
          </table>

          <h3>3.3 Cookies de análisis</h3>
          <p>Nos ayudan a entender cómo los visitantes interactúan con el sitio web, recopilando información de forma anónima.</p>
          <table className="cookies-table">
            <thead>
              <tr>
                <th>Cookie</th>
                <th>Proveedor</th>
                <th>Finalidad</th>
                <th>Duración</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>_ga</td>
                <td>Google Analytics</td>
                <td>Distinguir usuarios únicos</td>
                <td>2 años</td>
              </tr>
              <tr>
                <td>_ga_*</td>
                <td>Google Analytics</td>
                <td>Mantener el estado de la sesión</td>
                <td>2 años</td>
              </tr>
            </tbody>
          </table>

          <h3>3.4 Cookies de terceros</h3>
          <p>Servicios de terceros que utilizamos pueden establecer sus propias cookies:</p>
          <table className="cookies-table">
            <thead>
              <tr>
                <th>Servicio</th>
                <th>Finalidad</th>
                <th>Más información</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Stripe</td>
                <td>Procesamiento seguro de pagos</td>
                <td><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Política de Stripe</a></td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2>4. ¿Cómo gestionar las cookies?</h2>
          
          <h3>4.1 A través de nuestro banner de cookies</h3>
          <p>Al acceder a nuestro sitio web por primera vez, verá un banner donde puede aceptar o configurar las cookies según sus preferencias.</p>

          <h3>4.2 A través de su navegador</h3>
          <p>Puede configurar su navegador para bloquear o eliminar cookies. A continuación, le indicamos cómo hacerlo en los navegadores más comunes:</p>
          <ul>
            <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
            <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
            <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
            <li><strong>Edge:</strong> Configuración → Privacidad → Cookies</li>
          </ul>
          <p><strong>Nota:</strong> Si desactiva las cookies, es posible que algunas funcionalidades del sitio web no funcionen correctamente.</p>
        </section>

        <section>
          <h2>5. Base legal</h2>
          <p>El uso de cookies se basa en:</p>
          <ul>
            <li><strong>Cookies técnicas:</strong> Interés legítimo, ya que son necesarias para el funcionamiento del sitio</li>
            <li><strong>Cookies de análisis y preferencias:</strong> Consentimiento del usuario</li>
          </ul>
        </section>

        <section>
          <h2>6. Actualizaciones de esta política</h2>
          <p>Podemos actualizar esta Política de Cookies periódicamente. Le recomendamos que revise esta página regularmente para estar informado sobre cualquier cambio. La fecha de la última actualización se indica al principio de este documento.</p>
        </section>

        <section>
          <h2>7. Contacto</h2>
          <p>Si tiene preguntas sobre nuestra Política de Cookies, puede contactarnos en:</p>
          <ul>
            <li><strong>Email:</strong> support@dedosfacil.es</li>
          </ul>
        </section>
      </div>

      <footer className="legal-footer">
        <p>© 2026 DedosFácil - Rental Connect Solutions Tmi. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default Cookies
