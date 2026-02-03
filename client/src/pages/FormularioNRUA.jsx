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
      subtitle: "Sube tus archivos de Airbnb, Booking u otras plataformas",
      airbnbFile: "Archivo Airbnb",
      bookingFile: "Archivo Booking", 
      otherFile: "Otro archivo (VRBO, PDF, etc.)",
      dragOrClick: "Arrastra o haz clic",
      duplicateWarning: "⚠️ Posible duplicado - misma fecha de entrada",
      removeFile: "Quitar",
      filesUploaded: "archivo(s) subido(s)",
      processing: "Extrayendo datos... (puede tardar 1-2 minutos)",
      formatHelp: "¿Qué formato debe tener mi archivo?",
      formatInfo: "Acepta archivos CSV o Excel exportados de Airbnb, Booking, VRBO u otras plataformas. El archivo debe contener columnas con fechas de entrada y salida. Formatos de fecha aceptados: DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY.",
      extractBtn: "🔍 Extraer estancias",
      reviewTitle: "Revisa tus estancias",
      reviewInstructions: "Verifica las fechas y añade el número de huéspedes para cada estancia:",
      changeFile: "Cambiar archivos",
      checkIn: "Entrada",
      checkOut: "Salida",
      guests: "Huéspedes",
      purpose: "Finalidad",
      source: "Fuente",
      purposes: {
        vacation: "Vacacional/Turístico",
        work: "Laboral",
        study: "Estudios",
        medical: "Tratamiento médico",
        other: "Otros"
      },
      addStay: "Añadir estancia",
      staysFound: "estancia(s)",
      noFile: "¿No tienes el archivo?",
      manual: "Quiero introducir las estancias manualmente",
      noActivity: "No tuve ningún alquiler en 2025",
      applyToAll: "Aplicar a todos",
      defaultGuests: "Huéspedes por defecto:",
      defaultPurpose: "Finalidad por defecto:",
      downloadCsv: "Descargar CSV para N2",
      downloadCsvHelp: "Importa este archivo en la aplicación N2 del Registro"
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
      subtitle: "Upload your files from Airbnb, Booking or other platforms",
      airbnbFile: "Airbnb file",
      bookingFile: "Booking file",
      otherFile: "Other file (VRBO, PDF, etc.)",
      dragOrClick: "Drag or click",
      duplicateWarning: "⚠️ Possible duplicate - same check-in date",
      removeFile: "Remove",
      filesUploaded: "file(s) uploaded",
      processing: "Extracting data... (may take 1-2 minutes)",
      formatHelp: "What format should my file have?",
      formatInfo: "Accepts CSV or Excel files exported from Airbnb, Booking, VRBO or other platforms. The file must contain columns with check-in and check-out dates. Accepted date formats: DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY.",
      extractBtn: "🔍 Extract stays",
      reviewTitle: "Review your stays",
      reviewInstructions: "Verify dates and add the number of guests for each stay:",
      changeFile: "Change files",
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Guests",
      purpose: "Purpose",
      source: "Source",
      purposes: {
        vacation: "Vacation/Tourist",
        work: "Work",
        study: "Studies",
        medical: "Medical treatment",
        other: "Other"
      },
      addStay: "Add stay",
      staysFound: "stay(s)",
      noFile: "Don't have the file?",
      manual: "I want to enter stays manually",
      noActivity: "I had no rentals in 2025",
      applyToAll: "Apply to all",
      defaultGuests: "Default guests:",
      defaultPurpose: "Default purpose:",
      downloadCsv: "Download CSV for N2",
      downloadCsvHelp: "Import this file in the Registry's N2 application"
    },
    step4: {
      title: "Summary and payment",
      summary: "Order summary",
      plan: "Selected plan",
      plans: [
  { id: 1, name: "1 Property", price: 69, priceStr: "€69" },
  { id: 3, name: "3 Properties", price: 199, priceStr: "€199", popular: true },
  { id: 10, name: "10 Properties", price: 399, priceStr: "€399" }
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
      subtitle: "Uploadez vos fichiers d'Airbnb, Booking ou autres",
      airbnbFile: "Fichier Airbnb",
      bookingFile: "Fichier Booking",
      otherFile: "Autre fichier (VRBO, PDF, etc.)",
      dragOrClick: "Glisser ou cliquer",
      duplicateWarning: "⚠️ Doublon possible - même date d'arrivée",
      removeFile: "Supprimer",
      filesUploaded: "fichier(s) téléchargé(s)",
      processing: "Extraction des données... (peut prendre 1-2 minutes)",
      formatHelp: "Quel format doit avoir mon fichier?",
      formatInfo: "Accepte les fichiers CSV ou Excel exportés d'Airbnb, Booking, VRBO ou autres. Le fichier doit contenir des colonnes avec dates d'arrivée et de départ. Formats de date acceptés: DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY.",
      extractBtn: "🔍 Extraire les séjours",
      reviewTitle: "Vérifiez vos séjours",
      reviewInstructions: "Vérifiez les dates et ajoutez le nombre de voyageurs:",
      changeFile: "Changer de fichiers",
      checkIn: "Arrivée",
      checkOut: "Départ",
      guests: "Voyageurs",
      purpose: "Finalité",
      source: "Source",
      purposes: {
        vacation: "Vacances/Tourisme",
        work: "Travail",
        study: "Études",
        medical: "Traitement médical",
        other: "Autre"
      },
      addStay: "Ajouter un séjour",
      staysFound: "séjour(s)",
      noFile: "Pas de fichier?",
      manual: "Je veux entrer les séjours manuellement",
      noActivity: "Je n'ai pas eu de locations en 2025",
      applyToAll: "Appliquer à tous",
      defaultGuests: "Voyageurs par défaut:",
      defaultPurpose: "Finalité par défaut:",
      downloadCsv: "Télécharger CSV pour N2",
      downloadCsvHelp: "Importez ce fichier dans l'application N2 du Registre"
    },
    step4: {
      title: "Résumé et paiement",
      summary: "Résumé de votre commande",
      plan: "Plan sélectionné",
      plans: [
    { id: 1, name: "1 Property", price: 69, priceStr: "€69" },
  { id: 3, name: "3 Properties", price: 199, priceStr: "€199", popular: true },
  { id: 10, name: "10 Properties", price: 399, priceStr: "€399" }
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
      subtitle: "Laden Sie Ihre Dateien von Airbnb, Booking oder anderen hoch",
      airbnbFile: "Airbnb-Datei",
      bookingFile: "Booking-Datei",
      otherFile: "Andere Datei (VRBO, PDF, etc.)",
      dragOrClick: "Ziehen oder klicken",
      duplicateWarning: "⚠️ Mögliches Duplikat - gleiches Check-in-Datum",
      removeFile: "Entfernen",
      filesUploaded: "Datei(en) hochgeladen",
      processing: "Daten werden extrahiert... (kann 1-2 Minuten dauern)",
      formatHelp: "Welches Format sollte meine Datei haben?",
      formatInfo: "Akzeptiert CSV- oder Excel-Dateien von Airbnb, Booking, VRBO oder anderen. Die Datei muss Spalten mit Check-in und Check-out Daten enthalten. Akzeptierte Datumsformate: DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY.",
      extractBtn: "🔍 Aufenthalte extrahieren",
      reviewTitle: "Überprüfen Sie Ihre Aufenthalte",
      reviewInstructions: "Überprüfen Sie die Daten und fügen Sie die Gästezahl hinzu:",
      changeFile: "Dateien ändern",
      checkIn: "Check-in",
      checkOut: "Check-out",
      guests: "Gäste",
      purpose: "Zweck",
      source: "Quelle",
      purposes: {
        vacation: "Urlaub/Tourismus",
        work: "Arbeit",
        study: "Studium",
        medical: "Medizinische Behandlung",
        other: "Sonstiges"
      },
      addStay: "Aufenthalt hinzufügen",
      staysFound: "Aufenthalt(e)",
      noFile: "Keine Datei?",
      manual: "Ich möchte Aufenthalte manuell eingeben",
      noActivity: "Ich hatte 2025 keine Vermietungen",
      applyToAll: "Auf alle anwenden",
      defaultGuests: "Standard-Gäste:",
      defaultPurpose: "Standard-Zweck:",
   downloadCsv: "CSV für N2 herunterladen",
      downloadCsvHelp: "Importieren Sie diese Datei in die N2-Anwendung des Registers"
    },
    step4: {
      title: "Zusammenfassung und Zahlung",
      summary: "Ihre Bestellübersicht",
      plan: "Ausgewählter Plan",
      plans: [
        { id: 1, name: "1 Immobilie", price: 79, priceStr: "79€" },
        { id: 3, name: "3 Immobilien", price: 199, priceStr: "199€", popular: true },
        { id: 10, name: "10 Immobilien", price: 449, priceStr: "449€" }
      ],
      termsLabel: "Ich akzeptiere die",
      terms: "Nutzungsbedingungen",
      termsAnd: "und die",
      privacy: "Datenschutzrichtlinie",
      payBtn: "Bezahlen",
      secure: "🔒 Sichere Zahlung mit Stripe",
      delivery: "Sie erhalten die Bestätigung in 24-48h"
    },
    nav: { back: "Zurück", next: "Weiter" },
    errors: { required: "Erforderlich", invalidEmail: "Ungültige E-Mail", missingGuests: "Gästezahl für alle Aufenthalte hinzufügen" }
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
  const [acceptAuthorization, setAcceptAuthorization] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [noActivity, setNoActivity] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({
    airbnb: null,
    booking: null,
    other: null
  })
  const [fileProcessed, setFileProcessed] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
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
        if (extractedStays.length === 0 && fileProcessed) {
          e.file = t.errors.required
        } else if (extractedStays.length > 0) {
          const missingGuests = extractedStays.some(s => !s.guests || parseInt(s.guests) < 1)
          const missingPurpose = extractedStays.some(s => !s.purpose)
          if (missingGuests || missingPurpose) {
            e.stays = 'Completa huéspedes y finalidad para todas las estancias'
          }
        }
      }
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 4)) }
  const back = () => setStep(s => Math.max(s - 1, 1))

  // File handling functions
  const handleFileUpload = (type) => (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [type]: file }))
      setManualMode(false)
      setNoActivity(false)
    }
  }

  const handleFileDrop = (type) => (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setUploadedFiles(prev => ({ ...prev, [type]: file }))
      setManualMode(false)
      setNoActivity(false)
    }
  }

  const removeFile = (type) => {
    setUploadedFiles(prev => ({ ...prev, [type]: null }))
  }

  const processAllFiles = async () => {
    const hasFiles = uploadedFiles.airbnb || uploadedFiles.booking || uploadedFiles.other
    if (!hasFiles) return
    
    setIsProcessing(true)
    setFileProcessed(false)
    
    try {
      const formData = new FormData()
      if (uploadedFiles.airbnb) formData.append('airbnb', uploadedFiles.airbnb)
      if (uploadedFiles.booking) formData.append('booking', uploadedFiles.booking)
      if (uploadedFiles.other) formData.append('other', uploadedFiles.other)
      
      const response = await fetch('/api/process-csv', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      
      if (data.success) {
        let allStays = []
        
        if (data.airbnb?.estancias) {
          allStays = [...allStays, ...data.airbnb.estancias.map(s => ({
            checkIn: s.fecha_entrada?.split('/').reverse().join('-') || '',
            checkOut: s.fecha_salida?.split('/').reverse().join('-') || '',
            guests: '',
            purpose: '',
            source: 'Airbnb'
          }))]
        }
        
        if (data.booking?.estancias) {
          allStays = [...allStays, ...data.booking.estancias.map(s => ({
            checkIn: s.fecha_entrada?.split('/').reverse().join('-') || '',
            checkOut: s.fecha_salida?.split('/').reverse().join('-') || '',
            guests: '',
            purpose: '',
            source: 'Booking'
          }))]
        }
        
        if (data.other?.estancias) {
          allStays = [...allStays, ...data.other.estancias.map(s => ({
            checkIn: s.fecha_entrada?.split('/').reverse().join('-') || '',
            checkOut: s.fecha_salida?.split('/').reverse().join('-') || '',
            guests: '',
            purpose: '',
            source: 'Otro'
          }))]
        }
        
        allStays.sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))
        
        // Detectar duplicados
        allStays = allStays.map((stay, index) => {
          const isDuplicate = allStays.some((other, otherIndex) => 
            otherIndex !== index && 
            other.checkIn === stay.checkIn &&
            other.source !== stay.source
          )
          return { ...stay, isDuplicate }
        })
        
        setExtractedStays(allStays)
      } else {
        alert('Error al procesar los archivos. Intenta de nuevo.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar los archivos. Intenta de nuevo.')
    }
    
    setFileProcessed(true)
    setIsProcessing(false)
  }

  const resetFiles = () => {
    setUploadedFiles({ airbnb: null, booking: null, other: null })
    setFileProcessed(false)
    setExtractedStays([])
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
  setExtractedStays(prev => {
    // Primero eliminar la estancia
    const filtered = prev.filter((_, i) => i !== index)
    
    // Luego recalcular duplicados
    return filtered.map((stay, idx) => {
      const isDuplicate = filtered.some((other, otherIdx) => 
        otherIdx !== idx && 
        other.checkIn === stay.checkIn &&
        other.source !== stay.source
      )
      return { ...stay, isDuplicate }
    })
  })
}

  const addEmptyStay = () => {
    setExtractedStays(prev => [...prev, { checkIn: '', checkOut: '', guests: '', purpose: '', source: 'Manual' }])
    if (manualMode && extractedStays.length === 0) {
      setManualMode(false)
    }
  }

  const downloadN2Csv = () => {
    if (!form.nrua || extractedStays.length === 0) {
      alert('Necesitas el código NRUA y al menos una estancia')
      return
    }
    
    const incomplete = extractedStays.some(s => !s.checkIn || !s.checkOut || !s.guests || !s.purpose)
    if (incomplete) {
      alert('Completa todos los campos de cada estancia')
      return
    }
    
    const formatDate = (dateStr) => {
      if (!dateStr) return ''
      const [year, month, day] = dateStr.split('-')
      return `${day}/${month}/${year}`
    }
    
    const lines = extractedStays.map(stay => 
      `${form.nrua};${formatDate(stay.checkIn)};${formatDate(stay.checkOut)};${stay.guests};${stay.purpose}`
    )
    
    const csvContent = lines.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `nrua_${form.nrua.replace(/[^a-zA-Z0-9]/g, '_')}_2025.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

const handlePay = async () => {
if (!acceptTerms || !acceptAuthorization) return
  
  try {
    // Convertir archivos a base64
    const fileToBase64 = (file) => {
      return new Promise((resolve) => {
        if (!file) return resolve(null)
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
    }
    
    const airbnbBase64 = await fileToBase64(uploadedFiles.airbnb)
    const bookingBase64 = await fileToBase64(uploadedFiles.booking)
    const otherBase64 = await fileToBase64(uploadedFiles.other)
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plan: selectedPlan.toString(),
        email: form.email,
        // Datos del formulario
        formData: {
          name: form.name,
          phone: form.phone,
          nrua: form.nrua,
          address: form.address,
          province: form.province
        },
        // Archivos en base64
        files: {
          airbnb: airbnbBase64,
          airbnbName: uploadedFiles.airbnb?.name || null,
          booking: bookingBase64,
          bookingName: uploadedFiles.booking?.name || null,
          other: otherBase64,
          otherName: uploadedFiles.other?.name || null
        },
        // Estancias extraídas
        stays: extractedStays,
        noActivity: noActivity
      })
    })
  
    const data = await response.json()
    
    if (data.url) {
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
  const hasAnyFile = uploadedFiles.airbnb || uploadedFiles.booking || uploadedFiles.other

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

              {/* Multi Upload Section */}
              {!manualMode && !noActivity && extractedStays.length === 0 && (
                <div className="multi-upload-section">
                  
                  {/* Airbnb Upload */}
                  <div 
                    className={`upload-zone-mini ${uploadedFiles.airbnb ? 'has-file' : ''}`}
                    onDrop={handleFileDrop('airbnb')}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => document.getElementById('airbnbInput').click()}
                  >
                    <input type="file" id="airbnbInput" accept=".csv,.xlsx,.xls" onChange={handleFileUpload('airbnb')} hidden />
                    <div className="upload-zone-content">
                      <span className="upload-icon">🏠</span>
                      <strong>{t.step3.airbnbFile}</strong>
                      {uploadedFiles.airbnb ? (
                        <div className="file-info">
                          <span className="file-name">{uploadedFiles.airbnb.name}</span>
                          <button className="btn-remove" onClick={(e) => { e.stopPropagation(); removeFile('airbnb'); }}>×</button>
                        </div>
                      ) : (
                        <span className="upload-hint">{t.step3.dragOrClick}</span>
                      )}
                    </div>
                  </div>

                  {/* Booking Upload */}
                  <div 
                    className={`upload-zone-mini ${uploadedFiles.booking ? 'has-file' : ''}`}
                    onDrop={handleFileDrop('booking')}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => document.getElementById('bookingInput').click()}
                  >
                    <input type="file" id="bookingInput" accept=".csv,.xlsx,.xls" onChange={handleFileUpload('booking')} hidden />
                    <div className="upload-zone-content">
                      <span className="upload-icon">🅱️</span>
                      <strong>{t.step3.bookingFile}</strong>
                      {uploadedFiles.booking ? (
                        <div className="file-info">
                          <span className="file-name">{uploadedFiles.booking.name}</span>
                          <button className="btn-remove" onClick={(e) => { e.stopPropagation(); removeFile('booking'); }}>×</button>
                        </div>
                      ) : (
                        <span className="upload-hint">{t.step3.dragOrClick}</span>
                      )}
                    </div>
                  </div>

                  {/* Other Upload */}
                  <div 
                    className={`upload-zone-mini ${uploadedFiles.other ? 'has-file' : ''}`}
                    onDrop={handleFileDrop('other')}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => document.getElementById('otherInput').click()}
                  >
                    <input type="file" id="otherInput" accept=".csv,.xlsx,.xls,.pdf" onChange={handleFileUpload('other')} hidden />
                    <div className="upload-zone-content">
                      <span className="upload-icon">📄</span>
                      <strong>{t.step3.otherFile}</strong>
                      {uploadedFiles.other ? (
                        <div className="file-info">
                          <span className="file-name">{uploadedFiles.other.name}</span>
                          <button className="btn-remove" onClick={(e) => { e.stopPropagation(); removeFile('other'); }}>×</button>
                        </div>
                      ) : (
                        <span className="upload-hint">{t.step3.dragOrClick}</span>
                      )}
                    </div>
                  </div>

                  {/* Process Button */}
               {hasAnyFile && !fileProcessed && (
  <button 
    className="btn btn-extract btn-process"
    onClick={processAllFiles}
    disabled={isProcessing}
  >
    {isProcessing ? `⏳ ${t.step3.processing}` : t.step3.extractBtn}
  </button>
)}
                  <details className="format-help">
                    <summary>{t.step3.formatHelp}</summary>
                    <p>{t.step3.formatInfo}</p>
                  </details>
                </div>
              )}

              {/* Lista editable de estancias */}
              {extractedStays.length > 0 && (
                <div className="stays-editor">
                  <div className="stays-header">
                    <h4>{t.step3.reviewTitle}</h4>
                    <button className="btn btn-secondary btn-small" onClick={resetFiles}>
                      {t.step3.changeFile}
                    </button>
                  </div>
                  <p className="stays-instructions">{t.step3.reviewInstructions}</p>

                  {/* Aplicar a todos */}
                  <div className="apply-to-all">
                    <div className="apply-group">
                      <label>{t.step3.defaultGuests}</label>
                      <input type="number" min="1" max="20" id="defaultGuests" placeholder="2" />
                      <button 
                        className="btn btn-small"
                        onClick={() => {
                          const val = document.getElementById('defaultGuests').value
                          if (val) setExtractedStays(prev => prev.map(s => ({ ...s, guests: val })))
                        }}
                      >
                        {t.step3.applyToAll}
                      </button>
                    </div>
                    <div className="apply-group">
                      <label>{t.step3.defaultPurpose}</label>
                      <select id="defaultPurpose">
                        <option value="">--</option>
                        <option value="1">{t.step3.purposes.vacation}</option>
                        <option value="2">{t.step3.purposes.work}</option>
                        <option value="3">{t.step3.purposes.study}</option>
                        <option value="4">{t.step3.purposes.medical}</option>
                        <option value="5">{t.step3.purposes.other}</option>
                      </select>
                      <button 
                        className="btn btn-small"
                        onClick={() => {
                          const val = document.getElementById('defaultPurpose').value
                          if (val) setExtractedStays(prev => prev.map(s => ({ ...s, purpose: val })))
                        }}
                      >
                        {t.step3.applyToAll}
                      </button>
                    </div>
                  </div>
                  
                  <div className="stays-table">
                    <div className="stays-table-header">
                      <span>{t.step3.checkIn}</span>
                      <span>{t.step3.checkOut}</span>
                      <span>{t.step3.guests} *</span>
                      <span>{t.step3.purpose} *</span>
                      <span>{t.step3.source}</span>
                      <span></span>
                    </div>
                    {extractedStays.map((stay, i) => (
                      <div key={i} className={`stays-table-row ${stay.isDuplicate ? 'duplicate-warning' : ''}`}>
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
                        <select
                          value={stay.purpose || ''}
                          onChange={e => updateStay(i, 'purpose', e.target.value)}
                          className={!stay.purpose ? 'needs-input' : ''}
                        >
                          <option value="">--</option>
                          <option value="1">{t.step3.purposes.vacation}</option>
                          <option value="2">{t.step3.purposes.work}</option>
                          <option value="3">{t.step3.purposes.study}</option>
                          <option value="4">{t.step3.purposes.medical}</option>
                          <option value="5">{t.step3.purposes.other}</option>
                        </select>
                        <span className="source-badge">{stay.source || '-'}</span>
                        <button className="btn-icon-small" onClick={() => removeStay(i)}>×</button>
                        {stay.isDuplicate && <span className="duplicate-badge" title={t.step3.duplicateWarning}>⚠️</span>}
                      </div>
                    ))}
                  </div>
                  
                  <button className="btn btn-secondary btn-small add-stay-btn" onClick={addEmptyStay}>
                    + {t.step3.addStay}
                  </button>
                  
                  <p className="stays-count">{extractedStays.length} {t.step3.staysFound}</p>

                  <div className="download-n2-section">
                    <button 
                      className="btn btn-secondary" 
                      onClick={downloadN2Csv}
                      disabled={extractedStays.some(s => !s.guests || !s.purpose)}
                    >
                      📥 {t.step3.downloadCsv}
                    </button>
                    <span className="help-text">{t.step3.downloadCsvHelp}</span>
                  </div>
                </div>
              )}

              {/* Opciones manuales */}
              {extractedStays.length === 0 && !isProcessing && (
                <div className="manual-options">
                  <p className="manual-title">{t.step3.noFile}</p>
                  
                  <label className="checkbox-label">
                    <input type="checkbox" checked={noActivity} onChange={e => { setNoActivity(e.target.checked); setManualMode(false); resetFiles() }} />
                    <span>{t.step3.noActivity}</span>
                  </label>
                  
                  <label className="checkbox-label">
                    <input type="checkbox" checked={manualMode} onChange={e => { setManualMode(e.target.checked); setNoActivity(false); resetFiles() }} />
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

              {/* Authorization Checkbox */}
<div className="authorization-box">
  <label className="checkbox-label authorization">
    <input 
      type="checkbox" 
      checked={acceptAuthorization} 
      onChange={e => setAcceptAuthorization(e.target.checked)} 
    />
    <span>
      <strong>Autorizo a Rental Connect Solutions Tmi</strong> a presentar el Modelo Informativo de Arrendamientos de Corta Duración (NRUA) correspondiente al ejercicio 2025 ante el Registro de la Propiedad en mi nombre, conforme al artículo 10.4 del Real Decreto 1312/2024.
    </span>
  </label>
</div>
              {/* Terms */}
              <label className="checkbox-label terms">
                <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} />
                <span>{t.step4.termsLabel} <a href="/terminos">{t.step4.terms}</a> {t.step4.termsAnd} <a href="/privacidad">{t.step4.privacy}</a></span>
              </label>

              {/* Pay Button */}
              <button className="btn btn-primary btn-large btn-pay" onClick={handlePay} disabled={!acceptTerms || !acceptAuthorization}>
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
         {step < 4 && (
  <button 
    className="btn btn-primary" 
    onClick={next}
    disabled={isProcessing || (step === 3 && hasAnyFile && !fileProcessed && extractedStays.length === 0)}
  >
    {isProcessing ? '⏳ Procesando... espera' : t.nav.next}
    {!isProcessing && <ArrowRight size={18} />}
  </button>
)}
        </div>
      </div>
    </div>
  )
}

export default FormularioNRUA
