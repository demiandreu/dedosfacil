import React from 'react'
import { ArrowLeft } from 'lucide-react'

function AvisoLegal() {
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
        
        <h1>Aviso Legal</h1>
        <p className="legal-updated">Última actualización: 1 de febrero de 2026</p>

        <section>
          <h2>1. Datos identificativos</h2>
          <p>En cumplimiento del deber de información establecido en la Ley 34/2002 de Servicios de la Sociedad de la Información y el Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos:</p>
          <ul>
            <li><strong>Titular:</strong> Rental Connect Solutions Tmi</li>
            <li><strong>Y-tunnus (CIF finlandés):</strong> 3502814-5</li>
            <li><strong>Domicilio:</strong> Telttakuja 3D 39, 00770 Helsinki, Uusimaa, Finlandia</li>
            <li><strong>Email:</strong> support@dedosfacil.es</li>
            <li><strong>Responsable:</strong> Demi Almeri</li>
            <li><strong>Sitio web:</strong> https://dedosfacil.es</li>
          </ul>
        </section>

        <section>
          <h2>2. Objeto y ámbito de aplicación</h2>
          <p>El presente Aviso Legal regula el acceso y uso del sitio web dedosfacil.es (en adelante, "el Sitio Web"), así como los servicios de gestión y presentación del Modelo Informativo de Arrendamientos de Corta Duración (Modelo N2) ante el Registro de la Propiedad en España.</p>
          <p>El acceso al Sitio Web atribuye la condición de usuario e implica la aceptación plena y sin reservas de todas las disposiciones incluidas en este Aviso Legal.</p>
        </section>

        <section>
          <h2>3. Servicios ofrecidos</h2>
          <p>DedosFácil ofrece servicios de:</p>
          <ul>
            <li>Procesamiento de datos de arrendamientos de corta duración</li>
            <li>Generación del Modelo N2 en formato XBRL</li>
            <li>Presentación del Modelo N2 ante el Registro de la Propiedad competente</li>
            <li>Gestión de la documentación necesaria para el cumplimiento del Real Decreto 1312/2024</li>
          </ul>
          <p>Los servicios se prestan conforme al artículo 10.4 del Real Decreto 1312/2024, que permite la presentación del modelo informativo por el titular registral o por quien acredite la gestión del alquiler.</p>
        </section>

        <section>
          <h2>4. Condiciones de uso</h2>
          <p>El usuario se compromete a:</p>
          <ul>
            <li>Utilizar el Sitio Web y sus servicios de conformidad con la ley, la moral, el orden público y el presente Aviso Legal</li>
            <li>Proporcionar información veraz y actualizada</li>
            <li>No utilizar el Sitio Web para fines ilícitos o contrarios a lo establecido en este Aviso Legal</li>
            <li>No introducir virus informáticos, archivos defectuosos o cualquier otro software que pueda causar daños</li>
          </ul>
        </section>

        <section>
          <h2>5. Propiedad intelectual e industrial</h2>
          <p>Todos los contenidos del Sitio Web, incluyendo textos, imágenes, diseño gráfico, código fuente, logos, marcas y demás elementos, son propiedad de Rental Connect Solutions Tmi o de terceros que han autorizado su uso, y están protegidos por las leyes de propiedad intelectual e industrial.</p>
          <p>Queda prohibida la reproducción, distribución, comunicación pública o transformación de los contenidos sin autorización expresa del titular.</p>
        </section>

        <section>
          <h2>6. Exclusión de responsabilidad</h2>
          <p>Rental Connect Solutions Tmi no se hace responsable de:</p>
          <ul>
            <li>Errores u omisiones en los contenidos del Sitio Web</li>
            <li>La falta de disponibilidad o continuidad del Sitio Web</li>
            <li>La presencia de virus o elementos lesivos en los contenidos</li>
            <li>Los daños derivados del uso inadecuado del Sitio Web por parte del usuario</li>
            <li>Retrasos en la tramitación causados por el Registro de la Propiedad o terceros</li>
            <li>La veracidad de los datos proporcionados por el usuario</li>
          </ul>
          <p>El usuario es el único responsable de la veracidad y exactitud de los datos facilitados para la prestación de los servicios.</p>
        </section>

        <section>
          <h2>7. Enlaces a terceros</h2>
          <p>El Sitio Web puede contener enlaces a páginas web de terceros. Rental Connect Solutions Tmi no asume ninguna responsabilidad sobre el contenido, políticas de privacidad o prácticas de dichos sitios web.</p>
        </section>

        <section>
          <h2>8. Legislación aplicable y jurisdicción</h2>
          <p>Las relaciones entre Rental Connect Solutions Tmi y el usuario se regirán por la normativa española vigente. Para la resolución de cualquier controversia, las partes se someten a los Juzgados y Tribunales del domicilio del usuario, siempre que este tenga la condición de consumidor conforme a la normativa aplicable.</p>
        </section>

        <section>
          <h2>9. Modificaciones</h2>
          <p>Rental Connect Solutions Tmi se reserva el derecho de modificar el presente Aviso Legal en cualquier momento. Las modificaciones entrarán en vigor desde su publicación en el Sitio Web.</p>
        </section>

        <section>
          <h2>10. Contacto</h2>
          <p>Para cualquier consulta relacionada con este Aviso Legal, puede contactar con nosotros a través de:</p>
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

export default AvisoLegal
