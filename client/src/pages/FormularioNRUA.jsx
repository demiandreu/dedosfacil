import React, { useState } from 'react'
import { 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  User, 
  Home, 
  Calendar, 
  CreditCard,
  Check,
  AlertTriangle,
  Upload
} from 'lucide-react'

// ============================================
// TRANSLATIONS
// ============================================
const translations = {
  es: {
    title: "Presenta tu Depósito de Arrendamientos",
    subtitle: "Completa el formulario y nosotros nos encargamos del resto",
    steps: ["Tus datos", "Propiedad", "Estancias", "Pago"],
    step1: {
      title: "Datos de contacto",
      subtitle: "Necesitamos tus datos para enviarte el justificante",
      name: "Nombre completo",
      email: "Email",
      phone: "Teléfono",
      namePlaceholder: "Ej: Juan García López",
      emailPlaceholder: "tu@email.com",
      phonePlaceholder: "+34 600 000 000"
    },
    step2: {
      title: "Datos de la propiedad",
      subtitle: "Introduce el código NRUA de tu vivienda turística",
      nrua: "Código NRUA",
      nruaPlaceholder: "Ej: NRUA-2024-000123",
      nruaHelp: "Lo encontrarás en tu licencia de vivienda turística",
      address: "Dirección de la propiedad",
      addressPlaceholder: "Calle, número, piso, ciudad",
      province: "Provincia",
      selectProvince: "Selecciona provincia"
    },
    step3: {
      title: "Estancias de 2025",
      subtitle: "Añade todas las estancias que has tenido este año",
      noStays: "No has añadido ninguna estancia todavía",
      noStaysHelp: "Si no has tenido ningún alquiler en 2025, marca la casilla de abajo",
      noActivity: "No he tenido ninguna actividad en 2025",
      addStay: "Añadir estancia",
      checkIn: "Entrada",
      checkOut: "Salida",
      guests: "Huéspedes",
      purpose: "Finalidad",
      purposes: {
        vacation: "Vacacional",
        work: "Laboral",
        other: "Otro"
      },
      stayCount: "estancia(s) añadida(s)",
      importTitle: "¿Tienes muchas reservas?",
      importText: "Puedes descargar el historial de Airbnb o Booking y enviárnoslo por email a",
      deleteConfirm: "¿Eliminar esta estancia?"
    },
    step4: {
      title: "Selecciona tu plan",
      subtitle: "Elige el plan que mejor se adapte a ti",
      plans: [
        { name: "1 Propiedad", price: "79€", features: ["1 NRUA", "Presentación oficial", "Justificante", "Soporte email", "48h entrega"] },
        { name: "Pack 3", price: "199€", features: ["Hasta 3 propiedades", "Presentación oficial", "Justificante", "Soporte prioritario", "24h entrega"], popular: true },
        { name: "Pack 10", price: "449€", features: ["Hasta 10 propiedades", "Gestión completa", "Soporte telefónico", "Entrega prioritaria"] }
      ],
      termsLabel: "Acepto los",
      terms: "términos y condiciones",
      termsAnd: "y la",
      privacy: "política de privacidad",
      payButton: "Pagar y enviar",
      secure: "Pago 100% seguro con Stripe"
    },
    nav: {
      back: "Atrás",
      next: "Siguiente",
      submit: "Enviar"
    },
    validation: {
      required: "Este campo es obligatorio",
      invalidEmail: "Email no válido",
      invalidPhone: "Teléfono no válido",
      minStays: "Añade al menos una estancia o marca 'sin actividad'"
    }
  },
  en: {
    title: "Submit your Rental Declaration",
    subtitle: "Complete the form and we'll take care of the rest",
    steps: ["Your info", "Property", "Stays", "Payment"],
    step1: {
      title: "Contact information",
      subtitle: "We need your details to send you the certificate",
      name: "Full name",
      email: "Email",
      phone: "Phone",
      namePlaceholder: "E.g: John Smith",
      emailPlaceholder: "your@email.com",
      phonePlaceholder: "+34 600 000 000"
    },
    step2: {
      title: "Property details",
      subtitle: "Enter your tourist rental NRUA code",
      nrua: "NRUA Code",
      nruaPlaceholder: "E.g: NRUA-2024-000123",
      nruaHelp: "You'll find it on your tourist rental license",
      address: "Property address",
      addressPlaceholder: "Street, number, floor, city",
      province: "Province",
      selectProvince: "Select province"
    },
    step3: {
      title: "2025 Stays",
      subtitle: "Add all the stays you've had this year",
      noStays: "You haven't added any stays yet",
      noStaysHelp: "If you had no rentals in 2025, check the box below",
      noActivity: "I had no activity in 2025",
      addStay: "Add stay",
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Guests",
      purpose: "Purpose",
      purposes: {
        vacation: "Vacation",
        work: "Work",
        other: "Other"
      },
      stayCount: "stay(s) added",
      importTitle: "Have many bookings?",
      importText: "You can download your Airbnb or Booking history and email it to",
      deleteConfirm: "Delete this stay?"
    },
    step4: {
      title: "Select your plan",
      subtitle: "Choose the plan that suits you best",
      plans: [
        { name: "1 Property", price: "€79", features: ["1 NRUA", "Official submission", "Certificate", "Email support", "48h delivery"] },
        { name: "Pack 3", price: "€199", features: ["Up to 3 properties", "Official submission", "Certificate", "Priority support", "24h delivery"], popular: true },
        { name: "Pack 10", price: "€449", features: ["Up to 10 properties", "Full management", "Phone support", "Priority delivery"] }
      ],
      termsLabel: "I accept the",
      terms: "terms and conditions",
      termsAnd: "and the",
      privacy: "privacy policy",
      payButton: "Pay and submit",
      secure: "100% secure payment with Stripe"
    },
    nav: {
      back: "Back",
      next: "Next",
      submit: "Submit"
    },
    validation: {
      required: "This field is required",
      invalidEmail: "Invalid email",
      invalidPhone: "Invalid phone",
      minStays: "Add at least one stay or check 'no activity'"
    }
  },
  fr: {
    title: "Déposez votre Déclaration de Location",
    subtitle: "Remplissez le formulaire et nous nous occupons du reste",
    steps: ["Vos infos", "Propriété", "Séjours", "Paiement"],
    step1: {
      title: "Coordonnées",
      subtitle: "Nous avons besoin de vos données pour vous envoyer le certificat",
      name: "Nom complet",
      email: "Email",
      phone: "Téléphone",
      namePlaceholder: "Ex: Jean Dupont",
      emailPlaceholder: "votre@email.com",
      phonePlaceholder: "+34 600 000 000"
    },
    step2: {
      title: "Détails de la propriété",
      subtitle: "Entrez le code NRUA de votre location touristique",
      nrua: "Code NRUA",
      nruaPlaceholder: "Ex: NRUA-2024-000123",
      nruaHelp: "Vous le trouverez sur votre licence de location touristique",
      address: "Adresse de la propriété",
      addressPlaceholder: "Rue, numéro, étage, ville",
      province: "Province",
      selectProvince: "Sélectionnez la province"
    },
    step3: {
      title: "Séjours 2025",
      subtitle: "Ajoutez tous les séjours que vous avez eus cette année",
      noStays: "Vous n'avez pas encore ajouté de séjour",
      noStaysHelp: "Si vous n'avez pas eu de locations en 2025, cochez la case ci-dessous",
      noActivity: "Je n'ai eu aucune activité en 2025",
      addStay: "Ajouter un séjour",
      checkIn: "Arrivée",
      checkOut: "Départ",
      guests: "Voyageurs",
      purpose: "Motif",
      purposes: {
        vacation: "Vacances",
        work: "Travail",
        other: "Autre"
      },
      stayCount: "séjour(s) ajouté(s)",
      importTitle: "Beaucoup de réservations ?",
      importText: "Vous pouvez télécharger votre historique Airbnb ou Booking et nous l'envoyer à",
      deleteConfirm: "Supprimer ce séjour ?"
    },
    step4: {
      title: "Choisissez votre plan",
      subtitle: "Sélectionnez le plan qui vous convient",
      plans: [
        { name: "1 Propriété", price: "79€", features: ["1 NRUA", "Dépôt officiel", "Certificat", "Support email", "Livraison 48h"] },
        { name: "Pack 3", price: "199€", features: ["Jusqu'à 3 propriétés", "Dépôt officiel", "Certificat", "Support prioritaire", "Livraison 24h"], popular: true },
        { name: "Pack 10", price: "449€", features: ["Jusqu'à 10 propriétés", "Gestion complète", "Support téléphonique", "Livraison prioritaire"] }
      ],
      termsLabel: "J'accepte les",
      terms: "conditions générales",
      termsAnd: "et la",
      privacy: "politique de confidentialité",
      payButton: "Payer et envoyer",
      secure: "Paiement 100% sécurisé avec Stripe"
    },
    nav: {
      back: "Retour",
      next: "Suivant",
      submit: "Envoyer"
    },
    validation: {
      required: "Ce champ est obligatoire",
      invalidEmail: "Email invalide",
      invalidPhone: "Téléphone invalide",
      minStays: "Ajoutez au moins un séjour ou cochez 'sans activité'"
    }
  },
  de: {
    title: "Reichen Sie Ihre Vermietungserklärung ein",
    subtitle: "Füllen Sie das Formular aus und wir kümmern uns um den Rest",
    steps: ["Ihre Daten", "Immobilie", "Aufenthalte", "Zahlung"],
    step1: {
      title: "Kontaktdaten",
      subtitle: "Wir benötigen Ihre Daten, um Ihnen die Bescheinigung zu senden",
      name: "Vollständiger Name",
      email: "E-Mail",
      phone: "Telefon",
      namePlaceholder: "Z.B: Max Mustermann",
      emailPlaceholder: "ihre@email.com",
      phonePlaceholder: "+34 600 000 000"
    },
    step2: {
      title: "Immobiliendetails",
      subtitle: "Geben Sie den NRUA-Code Ihrer Ferienunterkunft ein",
      nrua: "NRUA-Code",
      nruaPlaceholder: "Z.B: NRUA-2024-000123",
      nruaHelp: "Sie finden ihn auf Ihrer Ferienvermietungslizenz",
      address: "Adresse der Immobilie",
      addressPlaceholder: "Straße, Nummer, Etage, Stadt",
      province: "Provinz",
      selectProvince: "Provinz auswählen"
    },
    step3: {
      title: "Aufenthalte 2025",
      subtitle: "Fügen Sie alle Aufenthalte hinzu, die Sie dieses Jahr hatten",
      noStays: "Sie haben noch keine Aufenthalte hinzugefügt",
      noStaysHelp: "Wenn Sie 2025 keine Vermietungen hatten, aktivieren Sie das Kästchen unten",
      noActivity: "Ich hatte 2025 keine Aktivität",
      addStay: "Aufenthalt hinzufügen",
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Gäste",
      purpose: "Zweck",
      purposes: {
        vacation: "Urlaub",
        work: "Arbeit",
        other: "Andere"
      },
      stayCount: "Aufenthalt(e) hinzugefügt",
      importTitle: "Viele Buchungen?",
      importText: "Sie können Ihren Airbnb- oder Booking-Verlauf herunterladen und uns per E-Mail senden an",
      deleteConfirm: "Diesen Aufenthalt löschen?"
    },
    step4: {
      title: "Wählen Sie Ihren Plan",
      subtitle: "Wählen Sie den Plan, der am besten zu Ihnen passt",
      plans: [
        { name: "1 Immobilie", price: "79€", features: ["1 NRUA", "Offizielle Einreichung", "Bescheinigung", "E-Mail-Support", "48h Lieferung"] },
        { name: "3er-Paket", price: "199€", features: ["Bis zu 3 Immobilien", "Offizielle Einreichung", "Bescheinigung", "Prioritäts-Support", "24h Lieferung"], popular: true },
        { name: "10er-Paket", price: "449€", features: ["Bis zu 10 Immobilien", "Vollständige Verwaltung", "Telefon-Support", "Prioritäts-Lieferung"] }
      ],
      termsLabel: "Ich akzeptiere die",
      terms: "AGB",
      termsAnd: "und die",
      privacy: "Datenschutzrichtlinie",
      payButton: "Bezahlen und absenden",
      secure: "100% sichere Zahlung mit Stripe"
    },
    nav: {
      back: "Zurück",
      next: "Weiter",
      submit: "Absenden"
    },
    validation: {
      required: "Dieses Feld ist erforderlich",
      invalidEmail: "Ungültige E-Mail",
      invalidPhone: "Ungültige Telefonnummer",
      minStays: "Fügen Sie mindestens einen Aufenthalt hinzu oder markieren Sie 'keine Aktivität'"
    }
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
  const [noActivity, setNoActivity] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nrua: '',
    address: '',
    province: '',
    stays: []
  })
  
  const [newStay, setNewStay] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    purpose: 'vacation'
  })
  
  const [errors, setErrors] = useState({})
  
  const t = translations[lang]

  // Detect browser language on mount
  React.useEffect(() => {
    const browserLang = navigator.language.slice(0, 2)
    if (['es', 'en', 'fr', 'de'].includes(browserLang)) {
      setLang(browserLang)
    }
  }, [])

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateStep = (stepNum) => {
    const newErrors = {}
    
    if (stepNum === 1) {
      if (!formData.name.trim()) newErrors.name = t.validation.required
      if (!formData.email.trim()) newErrors.email = t.validation.required
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t.validation.invalidEmail
      if (!formData.phone.trim()) newErrors.phone = t.validation.required
    }
    
    if (stepNum === 2) {
      if (!formData.nrua.trim()) newErrors.nrua = t.validation.required
      if (!formData.address.trim()) newErrors.address = t.validation.required
      if (!formData.province) newErrors.province = t.validation.required
    }
    
    if (stepNum === 3) {
      if (formData.stays.length === 0 && !noActivity) {
        newErrors.stays = t.validation.minStays
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1))
  }

  const addStay = () => {
    if (newStay.checkIn && newStay.checkOut) {
      setFormData(prev => ({
        ...prev,
        stays: [...prev.stays, { ...newStay, id: Date.now() }]
      }))
      setNewStay({ checkIn: '', checkOut: '', guests: 1, purpose: 'vacation' })
      if (errors.stays) setErrors(prev => ({ ...prev, stays: null }))
    }
  }

  const removeStay = (id) => {
    setFormData(prev => ({
      ...prev,
      stays: prev.stays.filter(s => s.id !== id)
    }))
  }

  const handleSubmit = async () => {
    if (!acceptTerms) return
    
    // TODO: Integrate with Stripe and backend
    const payload = {
      ...formData,
      noActivity,
      selectedPlan,
      lang
    }
    
    console.log('Submitting:', payload)
    alert('¡Formulario enviado! Integrar con Stripe.')
  }

  return (
    <div className="form-page">
      {/* Language Selector */}
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
          {t.steps.map((stepName, i) => (
            <div key={i} className={`progress-step ${step > i + 1 ? 'completed' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="step-circle">
                {step > i + 1 ? <Check size={16} /> : i + 1}
              </div>
              <span className="step-label">{stepName}</span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="form-content">
          {/* Step 1: Contact Info */}
          {step === 1 && (
            <div className="form-step">
              <div className="step-header">
                <User size={32} className="step-icon" />
                <h2>{t.step1.title}</h2>
                <p>{t.step1.subtitle}</p>
              </div>
              
              <div className="form-fields">
                <div className={`form-group ${errors.name ? 'error' : ''}`}>
                  <label>{t.step1.name}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder={t.step1.namePlaceholder}
                  />
                  {errors.name && <span className="error-msg">{errors.name}</span>}
                </div>
                
                <div className={`form-group ${errors.email ? 'error' : ''}`}>
                  <label>{t.step1.email}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder={t.step1.emailPlaceholder}
                  />
                  {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>
                
                <div className={`form-group ${errors.phone ? 'error' : ''}`}>
                  <label>{t.step1.phone}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder={t.step1.phonePlaceholder}
                  />
                  {errors.phone && <span className="error-msg">{errors.phone}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Property */}
          {step === 2 && (
            <div className="form-step">
              <div className="step-header">
                <Home size={32} className="step-icon" />
                <h2>{t.step2.title}</h2>
                <p>{t.step2.subtitle}</p>
              </div>
              
              <div className="form-fields">
                <div className={`form-group ${errors.nrua ? 'error' : ''}`}>
                  <label>{t.step2.nrua}</label>
                  <input
                    type="text"
                    value={formData.nrua}
                    onChange={(e) => updateField('nrua', e.target.value)}
                    placeholder={t.step2.nruaPlaceholder}
                  />
                  <span className="help-text">{t.step2.nruaHelp}</span>
                  {errors.nrua && <span className="error-msg">{errors.nrua}</span>}
                </div>
                
                <div className={`form-group ${errors.address ? 'error' : ''}`}>
                  <label>{t.step2.address}</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder={t.step2.addressPlaceholder}
                  />
                  {errors.address && <span className="error-msg">{errors.address}</span>}
                </div>
                
                <div className={`form-group ${errors.province ? 'error' : ''}`}>
                  <label>{t.step2.province}</label>
                  <select
                    value={formData.province}
                    onChange={(e) => updateField('province', e.target.value)}
                  >
                    <option value="">{t.step2.selectProvince}</option>
                    {provinces.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  {errors.province && <span className="error-msg">{errors.province}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Stays */}
          {step === 3 && (
            <div className="form-step">
              <div className="step-header">
                <Calendar size={32} className="step-icon" />
                <h2>{t.step3.title}</h2>
                <p>{t.step3.subtitle}</p>
              </div>
              
              {/* Stays List */}
              <div className="stays-list">
                {formData.stays.length === 0 && !noActivity ? (
                  <div className="no-stays">
                    <p>{t.step3.noStays}</p>
                    <span>{t.step3.noStaysHelp}</span>
                  </div>
                ) : (
                  formData.stays.map((stay, i) => (
                    <div key={stay.id} className="stay-item">
                      <div className="stay-info">
                        <span className="stay-number">#{i + 1}</span>
                        <span>{stay.checkIn} → {stay.checkOut}</span>
                        <span>{stay.guests} 👤</span>
                        <span>{t.step3.purposes[stay.purpose]}</span>
                      </div>
                      <button className="btn-icon" onClick={() => removeStay(stay.id)}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              {/* No Activity Checkbox */}
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={noActivity}
                  onChange={(e) => setNoActivity(e.target.checked)}
                />
                <span>{t.step3.noActivity}</span>
              </label>
              
              {/* Add Stay Form */}
              {!noActivity && (
                <div className="add-stay-form">
                  <div className="stay-fields">
                    <div className="form-group">
                      <label>{t.step3.checkIn}</label>
                      <input
                        type="date"
                        value={newStay.checkIn}
                        onChange={(e) => setNewStay(prev => ({ ...prev, checkIn: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.step3.checkOut}</label>
                      <input
                        type="date"
                        value={newStay.checkOut}
                        onChange={(e) => setNewStay(prev => ({ ...prev, checkOut: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.step3.guests}</label>
                      <input
                        type="number"
                        min="1"
                        value={newStay.guests}
                        onChange={(e) => setNewStay(prev => ({ ...prev, guests: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t.step3.purpose}</label>
                      <select
                        value={newStay.purpose}
                        onChange={(e) => setNewStay(prev => ({ ...prev, purpose: e.target.value }))}
                      >
                        <option value="vacation">{t.step3.purposes.vacation}</option>
                        <option value="work">{t.step3.purposes.work}</option>
                        <option value="other">{t.step3.purposes.other}</option>
                      </select>
                    </div>
                  </div>
                  <button className="btn btn-secondary" onClick={addStay}>
                    <Plus size={18} />
                    {t.step3.addStay}
                  </button>
                </div>
              )}
              
              {errors.stays && <span className="error-msg">{errors.stays}</span>}
              
              {/* Import Tip */}
              <div className="import-tip">
                <Upload size={20} />
                <div>
                  <strong>{t.step3.importTitle}</strong>
                  <p>{t.step3.importText} <a href="mailto:info@dedosfacil.es">info@dedosfacil.es</a></p>
                </div>
              </div>
              
              {formData.stays.length > 0 && (
                <p className="stays-count">{formData.stays.length} {t.step3.stayCount}</p>
              )}
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <div className="form-step">
              <div className="step-header">
                <CreditCard size={32} className="step-icon" />
                <h2>{t.step4.title}</h2>
                <p>{t.step4.subtitle}</p>
              </div>
              
              {/* Plans */}
              <div className="plans-grid">
                {t.step4.plans.map((plan, i) => (
                  <div
                    key={i}
                    className={`plan-card ${selectedPlan === i ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                    onClick={() => setSelectedPlan(i)}
                  >
                    {plan.popular && <div className="popular-badge">⭐</div>}
                    <h3>{plan.name}</h3>
                    <div className="plan-price">{plan.price}</div>
                    <ul>
                      {plan.features.map((f, j) => (
                        <li key={j}><Check size={16} />{f}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              {/* Terms */}
              <label className="checkbox-label terms">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <span>
                  {t.step4.termsLabel} <a href="/terminos">{t.step4.terms}</a> {t.step4.termsAnd} <a href="/privacidad">{t.step4.privacy}</a>
                </span>
              </label>
              
              {/* Pay Button */}
              <button
                className="btn btn-primary btn-large btn-pay"
                onClick={handleSubmit}
                disabled={!acceptTerms}
              >
                {t.step4.payButton}
                <ArrowRight size={20} />
              </button>
              
              <p className="secure-text">🔒 {t.step4.secure}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="form-nav">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={prevStep}>
              <ArrowLeft size={18} />
              {t.nav.back}
            </button>
          )}
          {step < 4 && (
            <button className="btn btn-primary" onClick={nextStep}>
              {t.nav.next}
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormularioNRUA
