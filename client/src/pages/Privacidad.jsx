import React from 'react'
import { ArrowLeft } from 'lucide-react'

function Privacidad() {
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
        
        <h1>Política de Privacidad</h1>
        <p className="legal-updated">Última actualización: 1 de febrero de 2026</p>

        <section>
          <h2>1. Responsable del tratamiento</h2>
          <ul>
            <li><strong>Identidad:</strong> Rental Connect Solutions Tmi</li>
            <li><strong>Y-tunnus:</strong> 3502814-5</li>
            <li><strong>Dirección:</strong> Telttakuja 3D 39, 00770 Helsinki, Uusimaa, Finlandia</li>
            <li><strong>Email:</strong> support@dedosfacil.es</li>
            <li><strong>Responsable:</strong> Demi Almeri</li>
          </ul>
        </section>

        <section>
          <h2>2. Datos que recopilamos</h2>
          <p>En función de los servicios solicitados, podemos recopilar los siguientes datos personales:</p>
          
          <h3>2.1 Datos de identificación y contacto</h3>
          <ul>
            <li>Nombre completo</li>
            <li>Dirección de correo electrónico</li>
            <li>Número de teléfono</li>
          </ul>

          <h3>2.2 Datos de la propiedad</h3>
          <ul>
            <li>Número NRUA (Número de Registro Único de Alquiler)</li>
            <li>Dirección completa del inmueble</li>
            <li>Provincia</li>
          </ul>

          <h3>2.3 Datos de arrendamientos</h3>
          <ul>
            <li>Fechas de entrada y salida de huéspedes</li>
            <li>Número de huéspedes por estancia</li>
            <li>Finalidad del arrendamiento (vacacional, laboral, estudios, etc.)</li>
          </ul>
          <p><strong>Nota importante:</strong> No recopilamos datos personales de los huéspedes. El Modelo N2 es un listado anonimizado que solo incluye fechas, número de ocupantes y finalidad.</p>

          <h3>2.4 Datos de navegación</h3>
          <ul>
            <li>Dirección IP</li>
            <li>Tipo de navegador</li>
            <li>Páginas visitadas</li>
            <li>Fecha y hora de acceso</li>
          </ul>
        </section>

        <section>
          <h2>3. Finalidad del tratamiento</h2>
          <p>Los datos personales se tratan para las siguientes finalidades:</p>
          <ul>
            <li><strong>Prestación del servicio:</strong> Gestionar y presentar el Modelo N2 ante el Registro de la Propiedad en nombre del usuario</li>
            <li><strong>Comunicaciones:</strong> Enviar confirmaciones de pago, justificantes y comunicaciones relacionadas con el servicio contratado</li>
            <li><strong>Facturación:</strong> Emitir facturas y gestionar los pagos</li>
            <li><strong>Atención al cliente:</strong> Responder a consultas y solicitudes</li>
            <li><strong>Cumplimiento legal:</strong> Cumplir con las obligaciones legales aplicables</li>
          </ul>
        </section>

        <section>
          <h2>4. Base legal del tratamiento</h2>
          <ul>
            <li><strong>Ejecución de contrato:</strong> El tratamiento es necesario para la prestación de los servicios contratados (Art. 6.1.b RGPD)</li>
            <li><strong>Consentimiento:</strong> Para el envío de comunicaciones comerciales, cuando el usuario lo autorice expresamente (Art. 6.1.a RGPD)</li>
            <li><strong>Obligación legal:</strong> Para el cumplimiento de obligaciones legales, como la conservación de facturas (Art. 6.1.c RGPD)</li>
            <li><strong>Interés legítimo:</strong> Para la mejora de nuestros servicios y la prevención del fraude (Art. 6.1.f RGPD)</li>
          </ul>
        </section>

        <section>
          <h2>5. Destinatarios de los datos</h2>
          <p>Los datos personales podrán ser comunicados a:</p>
          <ul>
            <li><strong>Registro de la Propiedad:</strong> Para la presentación del Modelo N2, según lo solicitado por el usuario</li>
            <li><strong>Proveedores de servicios:</strong>
              <ul>
                <li>Stripe (procesamiento de pagos)</li>
                <li>Resend (envío de emails transaccionales)</li>
                <li>Render (alojamiento web)</li>
              </ul>
            </li>
            <li><strong>Administraciones públicas:</strong> Cuando exista obligación legal</li>
          </ul>
          <p>Todos los proveedores han firmado acuerdos de procesamiento de datos que garantizan el cumplimiento del RGPD.</p>
        </section>

        <section>
          <h2>6. Transferencias internacionales</h2>
          <p>Algunos de nuestros proveedores de servicios pueden estar ubicados fuera del Espacio Económico Europeo. En estos casos, nos aseguramos de que existan garantías adecuadas, como:</p>
          <ul>
            <li>Decisiones de adecuación de la Comisión Europea</li>
            <li>Cláusulas contractuales tipo aprobadas por la Comisión Europea</li>
            <li>Certificación bajo el Marco de Privacidad de Datos UE-EE.UU.</li>
          </ul>
        </section>

        <section>
          <h2>7. Plazo de conservación</h2>
          <p>Los datos personales se conservarán durante los siguientes plazos:</p>
          <ul>
            <li><strong>Datos de clientes:</strong> Durante la relación contractual y 5 años adicionales para atender posibles responsabilidades</li>
            <li><strong>Datos fiscales:</strong> 4 años (obligación tributaria)</li>
            <li><strong>Datos de navegación:</strong> 12 meses</li>
            <li><strong>Documentación de autorización:</strong> 5 años desde la presentación del Modelo N2</li>
          </ul>
        </section>

        <section>
          <h2>8. Derechos del usuario</h2>
          <p>El usuario tiene derecho a:</p>
          <ul>
            <li><strong>Acceso:</strong> Conocer qué datos personales estamos tratando</li>
            <li><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos</li>
            <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos cuando ya no sean necesarios</li>
            <li><strong>Limitación:</strong> Solicitar la limitación del tratamiento en determinadas circunstancias</li>
            <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado y de uso común</li>
            <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos en determinadas circunstancias</li>
          </ul>
          <p>Para ejercer estos derechos, puede enviar un email a <strong>support@dedosfacil.es</strong> indicando el derecho que desea ejercer y acompañando copia de su documento de identidad.</p>
          <p>Asimismo, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) si considera que sus derechos no han sido debidamente atendidos.</p>
        </section>

        <section>
          <h2>9. Medidas de seguridad</h2>
          <p>Hemos implementado medidas técnicas y organizativas apropiadas para proteger sus datos personales, incluyendo:</p>
          <ul>
            <li>Cifrado de datos en tránsito (HTTPS/TLS)</li>
            <li>Cifrado de datos en reposo</li>
            <li>Control de acceso basado en roles</li>
            <li>Copias de seguridad periódicas</li>
            <li>Monitorización de seguridad</li>
          </ul>
        </section>

        <section>
          <h2>10. Modificaciones</h2>
          <p>Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Cualquier cambio será publicado en esta página con la fecha de actualización correspondiente.</p>
        </section>

        <section>
          <h2>11. Contacto</h2>
          <p>Para cualquier consulta relacionada con esta Política de Privacidad o el tratamiento de sus datos personales, puede contactar con nosotros en:</p>
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

export default Privacidad
