import React, { useState, useEffect } from 'react'
import { 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  User, 
  Home, 
  CreditCard,
  Check,
  FileText,
  AlertCircle
} from 'lucide-react'

const translations = {
  es: {
    title: "Presenta tu NRUA",
    steps: ["Tus datos", "Propiedad", "Reservas", "Pago"],
    step1: {
      title: "Datos de contacto",
      subtitle: "Para enviarte el justificante",
      name: "Nombre completo",
      email: "Email",
      phone: "Teléfono (WhatsApp)",
      namePh: "Ej: Juan García",
      emailPh: "tu@email.com",
      phonePh: "+34 600 000 000"
    },
    step2: {
      title: "Datos de la propiedad",
      subtitle: "Información de tu vivienda turística",
      nrua: "Código NRUA",
      nruaPh: "NRUA-2024-000123",
      nruaHelp: "Está en tu licencia de vivienda turística",
      address: "Dirección completa",
      addressPh: "Calle, número, piso, ciudad",
      province: "Provincia",
      selectProvince: "Selecciona..."
    },
    step3: {
      title: "Historial de reservas",
      subtitle: "Sube tu archivo de Airbnb, Booking, VRBO u otra plataforma",
      uploadTitle: "Arrastra tu archivo aquí",
      uploadOr: "o haz clic para seleccionar",
      uploadHelp: "Acepta CSV, PDF o Excel de Airbnb, Booking, VRBO u otras plataformas",
      uploaded: "Archivo:",
      processing: "Extrayendo datos...",
      reviewTitle: "Revisa tus estancias",
      reviewInstructions: "Verifica las fechas y añade el número de huéspedes para cada estancia:",
      changeFile: "Cambiar archivo",
      checkIn: "Entrada",
      checkOut: "Salida",
      guests: "Huéspedes",
      addStay: "Añadir estancia",
      staysFound: "estancia(s)",
      noFile: "¿No tienes el archivo?",
      manual: "Quiero introducir las estancias manualmente",
      noActivity: "No tuve ningún alquiler en 2025"
    },
    step4: {
      title: "Resumen y pago",
      summary: "Resumen de tu pedido",
      plan: "Plan seleccionado",
      plans: [
        { id: 1, name: "1 Propiedad", price: 79, priceStr: "79€" },
        { id: 3, name: "3 Propiedades", price: 199, priceStr: "199€", popular: true },
        { id: 10, name: "10 Propiedades", price: 449, priceStr: "449€" }
      ],
      termsLabel: "Acepto los",
      terms: "términos y condiciones",
      termsAnd: "y la",
      privacy: "política de privacidad",
      payBtn: "Pagar",
      secure: "🔒 Pago seguro con Stripe",
      delivery: "Recibirás el justificante en 24-48h"
    },
    nav: { back: "Atrás", next: "Siguiente" },
    errors: { required: "Obligatorio", invalidEmail: "Email no válido", missingGuests: "Añade el número de huéspedes para todas las estancias" }
  },
  en: {
    title: "Submit your NRUA",
    steps: ["Your info", "Property", "Bookings", "Payment"],
    step1: {
      title: "Contact details",
      subtitle: "To send you the certificate",
      name: "Full name",
      email: "Email",
      phone: "Phone (WhatsApp)",
      namePh: "E.g: John Smith",
      emailPh: "your@email.com",
      phonePh: "+34 600 000 000"
    },
    step2: {
      title: "Property details",
      subtitle: "Your tourist rental information",
      nrua: "NRUA Code",
      nruaPh: "NRUA-2024-000123",
      nruaHelp: "Found on your tourist rental license",
      address: "Full address",
      addressPh: "Street, number, floor, city",
      province: "Province",
      selectProvince: "Select..."
    },
    step3: {
      title: "Booking history",
      subtitle: "Upload your file from Airbnb, Booking, VRBO or other platform",
      uploadTitle: "Drag your file here",
      uploadOr: "or click to select",
      uploadHelp: "Accepts CSV, PDF or Excel from Airbnb, Booking, VRBO or other platforms",
      uploaded: "File:",
      processing: "Extracting data...",
      reviewTitle: "Review your stays",
      reviewInstructions: "Verify dates and add the number of guests for each stay:",
      changeFile: "Change file",
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Guests",
      addStay: "Add stay",
      staysFound: "stay(s)",
      noFile: "Don't have the file?",
      manual: "I want to enter stays manually",
      noActivity: "I had no rentals in 2025"
    },
    step4: {
      title: "Summary and payment",
      summary: "Order summary",
      plan: "Selected plan",
      plans: [
        { id: 1, name: "1 Property", price: 79, priceStr: "€79" },
        { id: 3, name: "3 Properties", price: 199, priceStr: "€199", popular: true },
        { id: 10, name: "10 Properties", price: 449, priceStr: "€449" }
      ],
      termsLabel: "I accept the",
      terms: "terms and conditions",
      termsAnd: "and the",
      privacy: "privacy policy",
      payBtn: "Pay",
      secure: "🔒 Secure payment with Stripe",
      delivery: "You'll receive the certificate in 24-48h"
    },
    nav: { back: "Back", next: "Next" },
    errors: { required: "Required", invalidEmail: "Invalid email", missingGuests: "Add the number of guests for all stays" }
  },
  fr: {
    title: "Déposez votre NRUA",
    steps: ["Vos infos", "Propriété", "Réservations", "Paiement"],
    step1: {
      title: "Coordonnées",
      subtitle: "Pour vous envoyer le certificat",
      name: "Nom complet",
      email: "Email",
      phone: "Téléphone (WhatsApp)",
      namePh: "Ex: Jean Dupont",
      emailPh: "votre@email.com",
      phonePh: "+34 600 000 000"
    },
    step2: {
      title: "Détails de la propriété",
      subtitle: "Informations sur votre location",
      nrua: "Code NRUA",
      nruaPh: "NRUA-2024-000123",
      nruaHelp: "Sur votre licence de location touristique",
      address: "Adresse complète",
      addressPh: "Rue, numéro, étage, ville",
      province: "Province",
      selectProvince: "Sélectionnez..."
    },
    step3: {
      title: "Historique des réservations",
      subtitle: "Uploadez votre fichier d'Airbnb, Booking, VRBO ou autre",
      uploadTitle: "Glissez votre fichier ici",
      uploadOr: "ou cliquez pour sélectionner",
      uploadHelp: "Accepte CSV, PDF ou Excel d'Airbnb, Booking, VRBO ou autres",
      uploaded: "Fichier:",
      processing: "Extraction des données...",
      reviewTitle: "Vérifiez vos séjours",
      reviewInstructions: "Vérifiez les dates et ajoutez le nombre de voyageurs:",
      changeFile: "Changer de fichier",
      checkIn: "Arrivée",
      checkOut: "Départ",
      guests: "Voyageurs",
      addStay: "Ajouter un séjour",
      staysFound: "séjour(s)",
      noFile: "Pas de fichier?",
      manual: "Je veux entrer les séjours manuellement",
      noActivity: "Je n'ai pas eu de locations en 2025"
    },
    step4: {
      title: "Résumé et paiement",
      summary: "Résumé de votre commande",
      plan: "Plan sélectionné",
      plans: [
        { id: 1, name: "1 Propriété", price: 79, priceStr: "79€" },
        { id: 3, name: "3 Propriétés", price: 199, priceStr: "199€", popular: true },
        { id: 10, name: "10 Propriétés", price: 449, priceStr: "449€" }
      ],
      termsLabel: "J'accepte les",
      terms: "conditions générales",
      termsAnd: "et la",
      privacy: "politique de confidentialité",
      payBtn: "Payer",
      secure: "🔒 Paiement sécurisé avec Stripe",
      delivery: "Vous recevrez le certificat en 24-48h"
    },
    nav: { back: "Retour", next: "Suivant" },
    errors: { required: "Obligatoire", invalidEmail: "Email invalide", missingGuests: "Ajoutez le nombre de voyageurs pour tous les séjours" }
  },
  de: {
    title: "NRUA einreichen",
    steps: ["Ihre Daten", "Immobilie", "Buchungen", "Zahlung"],
    step1: {
      title: "Kontaktdaten",
      subtitle: "Um Ihnen die Bescheinigung zu senden",
      name: "Vollständiger Name",
      email: "E-Mail",
      phone: "Telefon (WhatsApp)",
      namePh: "Z.B: Max Mustermann",
      emailPh: "ihre@email.com",
      phonePh: "+34 600 000 000"
    },
    step2: {
      title: "Immobiliendetails",
      subtitle: "Informationen zu Ihrer Ferienunterkunft",
      nrua: "NRUA-Code",
      nruaPh: "NRUA-2024-000123",
      nruaHelp: "Auf Ihrer Ferienvermietungslizenz",
      address: "Vollständige Adresse",
      addressPh: "Straße, Nummer, Etage, Stadt",
      province: "Provinz",
      selectProvince: "Auswählen..."
    },
    step3: {
      title: "Buchungsverlauf",
      subtitle: "Laden Sie Ihre Datei von Airbnb, Booking, VRBO oder anderen hoch",
      uploadTitle: "Datei hierher ziehen",
      uploadOr: "oder klicken zum Auswählen",
      uploadHelp: "Akzeptiert CSV, PDF oder Excel von Airbnb, Booking, VRBO oder anderen",
      uploaded: "Datei:",
      processing: "Daten werden extrahiert...",
      reviewTitle: "Überprüfen Sie Ihre Aufenthalte",
      reviewInstructions: "Überprüfen Sie die Daten und fügen Sie die Gästezahl hinzu:",
      changeFile: "Datei ändern",
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Gäste",
      addStay: "Aufenthalt hinzufügen",
      staysFound: "Aufenthalt(e)",
      noFile: "Keine Datei?",
      manual: "Ich möchte Aufenthalte manuell eingeben",
      noActivity: "Ich hatte 2025 keine Vermietungen"
    },
    step4: {
      title: "Zusammenfassung und Zahlung",
      summary: "Bestellübersicht",
      plan: "Ausgewählter Plan",
      plans: [
        { id: 1, name: "1 Immobilie", price: 79, priceStr: "79€" },
        { id: 3, name: "3 Immobilien", price: 199, priceStr: "199€", popular: true },
        { id: 10, name: "10 Immobilien", price: 449, priceStr: "449€" }
      ],
      termsLabel: "Ich akzeptiere die",
      terms: "AGB",
      termsAnd: "und die",
      privacy: "Datenschutzrichtlinie",
      payBtn: "Bezahlen",
      secure: "🔒 Sichere Zahlung mit Stripe",
      delivery: "Sie erhalten die Bescheinigung in 24-48h"
    },
    nav: { back: "Zurück", next: "Weiter" },
    errors: { required: "Erforderlich", invalidEmail: "Ungültige E-Mail", missingGuests: "Fügen Sie die Gästezahl für alle Aufenthalte hinzu" }
  }
}

const provinces = [
  "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Barcelona",
  "Burgos", "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "Cuenca",
  "Girona", "Granada", "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Islas Baleares",
  "Jaén", "La Coruña", "La Rioja", "Las Palmas", "León", "Lleida", "Lugo", "Madrid", "Málaga",
  "Murcia", "Navarra", "Ourense", "Palencia", "Pontevedra", "Salamanca", "Santa Cruz de Tenerife",
  "Segovia", "Sevilla", "Soria", "Tarragona", "Teruel", "Toledo", "Valencia", "Valladolid",
  "Vizcaya", "Zamora", "Zaragoza"
]

function FormularioNRUA() {
  const [lang, setLang] = useState('es')
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState(1)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [noActivity, setNoActivity] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [fileProcessed, setFileProcessed] = useState(false)
  const [extractedStays, setExtractedStays] = useState([])
  const [errors, setErrors] = useState({})
  
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    nrua: '', address: '', province: '',
    manualStays: ''
  })
  
  const t = translations[lang]

  useEffect(() => {
    const browserLang = navigator.language.slice(0, 2)
    if (['es', 'en', 'fr', 'de'].includes(browserLang)) setLang(browserLang)
  }, [])

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  const validate = () => {
    const e = {}
    if (step === 1) {
      if (!form.name.trim()) e.name = t.errors.required
      if (!form.email.trim()) e.email = t.errors.required
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.errors.invalidEmail
      if (!form.phone.trim()) e.phone = t.errors.required
    }
    if (step === 2) {
      if (!form.nrua.trim()) e.nrua = t.errors.required
      if (!form.address.trim()) e.address = t.errors.required
      if (!form.province) e.province = t.errors.required
    }
    if (step === 3) {
      if (!noActivity) {
        if (extractedStays.length === 0) {
          e.file = t.errors.required
        } else {
          // Verificar que todas las estancias tengan huéspedes
          const missingGuests = extractedStays.some(s => !s.guests || parseInt(s.guests) < 1)
          if (missingGuests) {
            e.stays = t.errors.missingGuests || 'Añade el número de huéspedes para todas las estancias'
          }
        }
      }
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 4)) }
  const back = () => setStep(s => Math.max(s - 1, 1))

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    const validExtensions = ['.csv', '.pdf', '.xlsx', '.xls']
    if (file && validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      setUploadedFile(file)
      setManualMode(false)
      setNoActivity(false)
      // Simular extracción de datos (en producción usaría Claude API)
      simulateExtraction(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    const validExtensions = ['.csv', '.pdf', '.xlsx', '.xls']
    if (file && validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
      setUploadedFile(file)
      setManualMode(false)
      setNoActivity(false)
      simulateExtraction(file)
    }
  }

// Extraer datos del archivo usando Claude API
  const simulateExtraction = async (file) => {
    setFileProcessed(false)
    
    try {
      const formData = new FormData()
      formData.append('airbnb', file) // o 'booking' según el archivo
      
      const response = await fetch('/api/process-csv', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Combinar estancias de Airbnb y Booking
        let allStays = []
        
        if (data.airbnb?.estancias) {
          allStays = [...allStays, ...data.airbnb.estancias.map(s => ({
            checkIn: s.fecha_entrada?.split('/').reverse().join('-') || '',
            checkOut: s.fecha_salida?.split('/').reverse().join('-') || '',
            guests: ''
          }))]
        }
        
        if (data.booking?.estancias) {
          allStays = [...allStays, ...data.booking.estancias.map(s => ({
            checkIn: s.fecha_entrada?.split('/').reverse().join('-') || '',
            checkOut: s.fecha_salida?.split('/').reverse().join('-') || '',
            guests: ''
          }))]
        }
        
        setExtractedStays(allStays)
      } else {
        console.error('Error processing file:', data.error)
        alert('Error al procesar el archivo. Intenta de nuevo.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar el archivo. Intenta de nuevo.')
    }
    
    setFileProcessed(true)
  }

  const updateStay = (index, field, value) => {
    setExtractedStays(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
    if (errors.stays) setErrors(prev => ({ ...prev, stays: null }))
  }

  const removeStay = (index) => {
    setExtractedStays(prev => prev.filter((_, i) => i !== index))
  }

  const addEmptyStay = () => {
    setExtractedStays(prev => [...prev, { checkIn: '', checkOut: '', guests: '' }])
    if (manualMode && extractedStays.length === 0) {
      setManualMode(false)
    }
  }

  const resetFile = () => {
    setUploadedFile(null)
    setFileProcessed(false)
    setExtractedStays([])
  }

 const handlePay = async () => {
    if (!acceptTerms) return
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan.toString(),
          email: form.email
        })
      })
      
      const data = await response.json()
      
      if (data.url) {
        // Guardar datos en localStorage para después del pago
        localStorage.setItem('dedosfacil_form', JSON.stringify({
          ...form,
          stays: extractedStays,
          noActivity,
          plan: selectedPlan
        }))
        // Redirigir a Stripe
        window.location.href = data.url
      } else {
        alert('Error al crear sesión de pago')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Error al procesar el pago')
    }
  }

  const currentPlan = t.step4.plans.find(p => p.id === selectedPlan)

  return (
    <div className="form-page">
      {/* Lang Selector */}
      <div className="lang-selector">
        {['es', 'en', 'fr', 'de'].map(l => (
          <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>
            {l === 'es' ? '🇪🇸' : l === 'en' ? '🇬🇧' : l === 'fr' ? '🇫🇷' : '🇩🇪'}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="form-header">
        <a href="/" className="logo">
          <span className="logo-icon">DF</span>
          <span className="logo-text">DedosFácil</span>
        </a>
      </div>

      <div className="form-container">
        {/* Progress */}
        <div className="progress-bar">
          {t.steps.map((s, i) => (
            <div key={i} className={`progress-step ${step > i + 1 ? 'completed' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="step-circle">{step > i + 1 ? <Check size={16} /> : i + 1}</div>
              <span className="step-label">{s}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="form-content">
          {/* Step 1 */}
          {step === 1 && (
            <div className="form-step">
              <div className="step-header">
                <User size={32} className="step-icon" />
                <h2>{t.step1.title}</h2>
                <p>{t.step1.subtitle}</p>
              </div>
              <div className="form-fields">
                <div className={`form-group ${errors.name ? 'error' : ''}`}>
                  <label>{t.step1.name} *</label>
                  <input value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder={t.step1.namePh} />
                  {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>
                <div className={`form-group ${errors.email ? 'error' : ''}`}>
                  <label>{t.step1.email} *</label>
                  <input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder={t.step1.emailPh} />
                  {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>
                <div className={`form-group ${errors.phone ? 'error' : ''}`}>
                  <label>{t.step1.phone} *</label>
                  <input type="tel" value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder={t.step1.phonePh} />
                  {errors.phone && <span className="error-msg">{errors.phone}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="form-step">
              <div className="step-header">
                <Home size={32} className="step-icon" />
                <h2>{t.step2.title}</h2>
                <p>{t.step2.subtitle}</p>
              </div>
              <div className="form-fields">
                <div className={`form-group ${errors.nrua ? 'error' : ''}`}>
                  <label>{t.step2.nrua} *</label>
                  <input value={form.nrua} onChange={e => updateForm('nrua', e.target.value)} placeholder={t.step2.nruaPh} />
                  <span className="help-text">{t.step2.nruaHelp}</span>
                  {errors.nrua && <span className="error-msg">{errors.nrua}</span>}
                </div>
                <div className={`form-group ${errors.address ? 'error' : ''}`}>
                  <label>{t.step2.address} *</label>
                  <input value={form.address} onChange={e => updateForm('address', e.target.value)} placeholder={t.step2.addressPh} />
                  {errors.address && <span className="error-msg">{errors.address}</span>}
                </div>
                <div className={`form-group ${errors.province ? 'error' : ''}`}>
                  <label>{t.step2.province} *</label>
                  <select value={form.province} onChange={e => updateForm('province', e.target.value)}>
                    <option value="">{t.step2.selectProvince}</option>
                    {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  {errors.province && <span className="error-msg">{errors.province}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="form-step">
              <div className="step-header">
                <Upload size={32} className="step-icon" />
                <h2>{t.step3.title}</h2>
                <p>{t.step3.subtitle}</p>
              </div>

              {/* Upload Zone - solo si no hay estancias extraídas */}
              {!manualMode && !noActivity && extractedStays.length === 0 && (
                <div 
                  className={`upload-zone ${uploadedFile ? 'has-file' : ''} ${errors.file ? 'error' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <input type="file" id="fileInput" accept=".csv,.pdf,.xlsx,.xls" onChange={handleFile} hidden />
                  {uploadedFile && !fileProcessed ? (
                    <div className="uploaded-file">
                      <FileText size={32} />
                      <p>{t.step3.uploaded} <strong>{uploadedFile.name}</strong></p>
                      <p className="processing">{t.step3.processing}</p>
                    </div>
                  ) : (
                    <>
                      <Upload size={48} />
                      <p><strong>{t.step3.uploadTitle}</strong></p>
                      <p>{t.step3.uploadOr}</p>
                      <span className="help-text">{t.step3.uploadHelp}</span>
                    </>
                  )}
                </div>
              )}

              {/* Lista editable de estancias */}
              {extractedStays.length > 0 && (
                <div className="stays-editor">
                  <div className="stays-header">
                    <h4>{t.step3.reviewTitle}</h4>
                    <button className="btn btn-secondary btn-small" onClick={resetFile}>
                      {t.step3.changeFile}
                    </button>
                  </div>
                  <p className="stays-instructions">{t.step3.reviewInstructions}</p>
                  
                  <div className="stays-table">
                    <div className="stays-table-header">
                      <span>{t.step3.checkIn}</span>
                      <span>{t.step3.checkOut}</span>
                      <span>{t.step3.guests} *</span>
                      <span></span>
                    </div>
                    {extractedStays.map((stay, i) => (
                      <div key={i} className="stays-table-row">
                        <input 
                          type="date" 
                          value={stay.checkIn} 
                          onChange={e => updateStay(i, 'checkIn', e.target.value)}
                        />
                        <input 
                          type="date" 
                          value={stay.checkOut} 
                          onChange={e => updateStay(i, 'checkOut', e.target.value)}
                        />
                        <input 
                          type="number" 
                          min="1" 
                          max="20"
                          value={stay.guests} 
                          onChange={e => updateStay(i, 'guests', e.target.value)}
                          className={!stay.guests || stay.guests < 1 ? 'needs-input' : ''}
                        />
                        <button className="btn-icon-small" onClick={() => removeStay(i)}>×</button>
                      </div>
                    ))}
                  </div>
                  
                  <button className="btn btn-secondary btn-small add-stay-btn" onClick={addEmptyStay}>
                    + {t.step3.addStay}
                  </button>
                  
                  <p className="stays-count">{extractedStays.length} {t.step3.staysFound}</p>
                </div>
              )}

              {/* Opciones manuales */}
              {extractedStays.length === 0 && (
                <div className="manual-options">
                  <p className="manual-title">{t.step3.noFile}</p>
                  
                  <label className="checkbox-label">
                    <input type="checkbox" checked={noActivity} onChange={e => { setNoActivity(e.target.checked); setManualMode(false); setUploadedFile(null); setExtractedStays([]) }} />
                    <span>{t.step3.noActivity}</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input type="checkbox" checked={manualMode} onChange={e => { setManualMode(e.target.checked); setNoActivity(false); setUploadedFile(null); setExtractedStays([]) }} />
                    <span>{t.step3.manual}</span>
                  </label>

                  {manualMode && (
                    <div className="manual-entry">
                      <button className="btn btn-primary" onClick={addEmptyStay}>
                        + {t.step3.addStay}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {errors.file && <span className="error-msg">{errors.file}</span>}
              {errors.stays && <span className="error-msg">{errors.stays}</span>}
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="form-step">
              <div className="step-header">
                <CreditCard size={32} className="step-icon" />
                <h2>{t.step4.title}</h2>
              </div>

              {/* Plan Selection */}
              <div className="plans-grid compact">
                {t.step4.plans.map(plan => (
                  <div 
                    key={plan.id} 
                    className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.popular && <div className="popular-badge">⭐</div>}
                    <h3>{plan.name}</h3>
                    <div className="plan-price">{plan.priceStr}</div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="order-summary">
                <h4>{t.step4.summary}</h4>
                <div className="summary-row"><span>{t.step4.plan}:</span><strong>{currentPlan?.name}</strong></div>
                <div className="summary-row"><span>NRUA:</span><strong>{form.nrua}</strong></div>
                <div className="summary-row"><span>{t.step2.address}:</span><strong>{form.address}</strong></div>
                <div className="summary-row total"><span>Total:</span><strong>{currentPlan?.priceStr}</strong></div>
              </div>

              {/* Terms */}
              <label className="checkbox-label terms">
                <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} />
                <span>{t.step4.termsLabel} <a href="/terminos">{t.step4.terms}</a> {t.step4.termsAnd} <a href="/privacidad">{t.step4.privacy}</a></span>
              </label>

              {/* Pay Button */}
              <button className="btn btn-primary btn-large btn-pay" onClick={handlePay} disabled={!acceptTerms}>
                {t.step4.payBtn} {currentPlan?.priceStr}
                <ArrowRight size={20} />
              </button>

              <p className="secure-text">{t.step4.secure}</p>
              <p className="delivery-text">{t.step4.delivery}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="form-nav">
          {step > 1 && <button className="btn btn-secondary" onClick={back}><ArrowLeft size={18} />{t.nav.back}</button>}
          {step < 4 && <button className="btn btn-primary" onClick={next}>{t.nav.next}<ArrowRight size={18} /></button>}
        </div>
      </div>
    </div>
  )
}

export default FormularioNRUA
