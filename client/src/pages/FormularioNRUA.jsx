import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
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
      nrua: "Número NRUA (Ventanilla Única)",
nruaPh: "ESFCTU0000430240001151320000...",
nruaHelp: "Es el número largo que empieza por 'ES' de la Ventanilla Única Digital. Si aún no lo tienes, solicítalo en registradores.org",
   nruaPhoto: "📷 Foto o captura del NRUA (recomendado)",
nruaPhotoHelp: "Sube una foto o screenshot del documento donde aparece tu NRUA. Nos ayuda a verificar el número y evitar errores de escritura.",
nruaPhotoDrag: "Arrastra o haz clic para subir imagen",
      address: "Dirección completa",
      addressPh: "Calle, número, piso, ciudad",
      province: "Provincia",
      selectProvince: "Selecciona..."
    },
    step3: {
      title: "Historial de reservas",
     subtitle: "Sube de 1 a 3 archivos a la vez (uno por plataforma). El sistema los combinará en un único informe. Revisa el resultado: si una reserva aparece en varias plataformas, elimina las duplicadas.",
     airbnbFile: "Archivo Airbnb",
airbnbHelp: "Descárgalo desde Reservas completadas → Exportar",
airbnbUrl: "https://es-l.airbnb.com/hosting/reservations/completed",
bookingFile: "Archivo Booking",
bookingHelp: "Descárgalo desde Reservas → Exportar a Excel",
bookingUrl: "https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/search_reservations.html",
      vrboFile: "Archivo VRBO",
vrboHelp: "Descárgalo desde Bandeja de entrada → Filtros → Descargar",
vrboUrl: "https://www.vrbo.com/es-es/supply/inbox",
otherFile: "Otro (Channel Manager...)",
otherHelp: "CSV o Excel con fechas de entrada/salida y huéspedes",
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
      downloadCsvHelp: "Importa este archivo en la aplicación N2 del Registro",
      dateAdjusted: "reserva(s) tenían fecha de salida en 2026. Se ajustó automáticamente al 31/12/2025.",
      dateAdjustedTag: "Salida ajustada"
    },
    step4: {
      title: "Resumen y pago",
      summary: "Resumen de tu pedido",
      plan: "Plan seleccionado",
     plans: [
        { id: 1, name: "1 Propiedad", price: 99, priceStr: "99€" },
        { id: 3, name: "3 Propiedades", price: 259, priceStr: "259€", popular: true },
        { id: 10, name: "10 Propiedades", price: 799, priceStr: "799€" }
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
     nrua: "NRUA Number (Single Window)",
nruaPh: "ESFCTU0000430240001151320000...",
nruaHelp: "The long number starting with 'ES' from the Digital Single Window. If you don't have it, apply at registradores.org",
   nruaPhoto: "📷 NRUA photo or screenshot (recommended)",
nruaPhotoHelp: "Upload a photo or screenshot of the document showing your NRUA. Helps us verify the number and avoid typos.",
nruaPhotoDrag: "Drag or click to upload image",
      address: "Full address",
      addressPh: "Street, number, floor, city",
      province: "Province",
      selectProvince: "Select..."
    },
    step3: {
      title: "Booking history",
      subtitle: "Upload 1 to 3 files at once (one per platform). The system will merge them into a single report. Review the result: if a booking appears on multiple platforms, delete the duplicates.",
     airbnbFile: "Airbnb file",
airbnbHelp: "Download from Completed reservations → Export",
airbnbUrl: "https://es-l.airbnb.com/hosting/reservations/completed",
      vrboFile: "VRBO file",
vrboHelp: "Download from Inbox → Filters → Download",
vrboUrl: "https://www.vrbo.com/es-es/supply/inbox",
otherFile: "Other (Channel Manager...)",
bookingFile: "Booking file",
bookingHelp: "Download from Reservations → Export to Excel",
bookingUrl: "https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/search_reservations.html",
otherHelp: "CSV or Excel with check-in/check-out dates and guests",
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
      downloadCsvHelp: "Import this file in the Registry's N2 application",
      dateAdjusted: "booking(s) had a check-out date in 2026. Automatically adjusted to 31/12/2025.",
      dateAdjustedTag: "Check-out adjusted"
    },
    step4: {
      title: "Summary and payment",
      summary: "Order summary",
      plan: "Selected plan",
    plans: [
  { id: 1, name: "1 Property", price: 99, priceStr: "€99" },
        { id: 3, name: "3 Properties", price: 259, priceStr: "€259", popular: true },
        { id: 10, name: "10 Properties", price: 799, priceStr: "€799" }
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
     nrua: "Numéro NRUA (Guichet Unique)",
nruaPh: "ESFCTU0000430240001151320000...",
nruaHelp: "Le numéro long commençant par 'ES' du Guichet Unique Numérique. Si vous ne l'avez pas, demandez-le sur registradores.org",
     nruaPhoto: "📷 Photo ou capture du NRUA (recommandé)",
nruaPhotoHelp: "Téléchargez une photo ou capture du document montrant votre NRUA. Cela nous aide à vérifier le numéro et éviter les erreurs.",
nruaPhotoDrag: "Glisser ou cliquer pour télécharger",
      address: "Adresse complète",
      addressPh: "Rue, numéro, étage, ville",
      province: "Province",
      selectProvince: "Sélectionnez..."
    },
    step3: {
      title: "Historique des réservations",
      subtitle: "Uploadez de 1 à 3 fichiers à la fois (un par plateforme). Le système les combinera en un seul rapport. Vérifiez le résultat : si une réservation apparaît sur plusieurs plateformes, supprimez les doublons.",
     airbnbFile: "Fichier Airbnb",
airbnbHelp: "Téléchargez depuis Réservations terminées → Exporter",
airbnbUrl: "https://es-l.airbnb.com/hosting/reservations/completed",
bookingFile: "Fichier Booking",
bookingHelp: "Téléchargez depuis Réservations → Exporter en Excel",
bookingUrl: "https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/search_reservations.html",
      vrboFile: "Fichier VRBO",
vrboHelp: "Téléchargez depuis Boîte de réception → Filtres → Télécharger",
vrboUrl: "https://www.vrbo.com/es-es/supply/inbox",
otherFile: "Autre (Channel Manager...)",
otherHelp: "CSV ou Excel avec dates d'arrivée/départ et voyageurs",
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
      downloadCsvHelp: "Importez ce fichier dans l'application N2 du Registre",
      dateAdjusted: "réservation(s) avaient une date de départ en 2026. Ajustée automatiquement au 31/12/2025.",
      dateAdjustedTag: "Départ ajusté"
    },
    step4: {
      title: "Résumé et paiement",
      summary: "Résumé de votre commande",
      plan: "Plan sélectionné",
    plans: [
    { id: 1, name: "1 Propriété", price: 99, priceStr: "99€" },
        { id: 3, name: "3 Propriétés", price: 259, priceStr: "259€", popular: true },
        { id: 10, name: "10 Propriétés", price: 799, priceStr: "799€" }
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
    nrua: "NRUA-Nummer (Einheitliche Anlaufstelle)",
nruaPh: "ESFCTU0000430240001151320000...",
nruaHelp: "Die lange Nummer, die mit 'ES' beginnt, vom Digitalen Einheitlichen Fenster. Falls nicht vorhanden, beantragen Sie sie auf registradores.org",
    nruaPhoto: "📷 NRUA-Foto oder Screenshot (empfohlen)",
nruaPhotoHelp: "Laden Sie ein Foto oder Screenshot des Dokuments mit Ihrer NRUA-Nummer hoch. Hilft uns, die Nummer zu überprüfen und Tippfehler zu vermeiden.",
nruaPhotoDrag: "Ziehen oder klicken zum Hochladen",
      address: "Vollständige Adresse",
      addressPh: "Straße, Nummer, Etage, Stadt",
      province: "Provinz",
      selectProvince: "Auswählen..."
    },
    step3: {
      title: "Buchungsverlauf",
      subtitle: "Laden Sie 1 bis 3 Dateien gleichzeitig hoch (eine pro Plattform). Das System kombiniert sie zu einem Bericht. Prüfen Sie das Ergebnis: falls eine Buchung auf mehreren Plattformen erscheint, löschen Sie Duplikate.",
     airbnbFile: "Airbnb-Datei",
airbnbHelp: "Von Abgeschlossene Buchungen → Exportieren herunterladen",
airbnbUrl: "https://es-l.airbnb.com/hosting/reservations/completed",
bookingFile: "Booking-Datei",
bookingHelp: "Von Reservierungen → Als Excel exportieren herunterladen",
bookingUrl: "https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/search_reservations.html",
      vrboFile: "VRBO-Datei",
vrboHelp: "Von Posteingang → Filter → Herunterladen",
vrboUrl: "https://www.vrbo.com/es-es/supply/inbox",
otherFile: "Andere (Channel Manager...)",
otherHelp: "CSV oder Excel mit Check-in/Check-out und Gästen",
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
      downloadCsvHelp: "Importieren Sie diese Datei in die N2-Anwendung des Registers",
      dateAdjusted: "Buchung(en) hatten ein Check-out-Datum in 2026. Automatisch auf 31/12/2025 angepasst.",
      dateAdjustedTag: "Check-out angepasst"
    },
    step4: {
      title: "Zusammenfassung und Zahlung",
      summary: "Ihre Bestellübersicht",
      plan: "Ausgewählter Plan",
     plans: [
        { id: 1, name: "1 Immobilie", price: 99, priceStr: "99€" },
        { id: 3, name: "3 Immobilien", price: 259, priceStr: "259€", popular: true },
        { id: 10, name: "10 Immobilien", price: 799, priceStr: "799€" }
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
  const [acceptGdpr, setAcceptGdpr] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [noActivity, setNoActivity] = useState(false)
const [uploadedFiles, setUploadedFiles] = useState({
  airbnb: null,
  booking: null,
  vrbo: null,
  other: null
})
  const [nruaFile, setNruaFile] = useState(null)
  const [fileProcessed, setFileProcessed] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedStays, setExtractedStays] = useState([])
  const [dateAdjustedCount, setDateAdjustedCount] = useState(0)
  const [errors, setErrors] = useState({})
  const [lightboxImage, setLightboxImage] = useState(null)
  const [affiliateDiscount, setAffiliateDiscount] = useState(null)
  const [affiliateCode, setAffiliateCode] = useState(null)
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    nrua: '', address: '', province: '',
    manualStays: ''
  })
  
  const t = translations[lang]

useEffect(() => {
  const code = localStorage.getItem('dedosfacil-ref')
  const urlDiscount = localStorage.getItem('dedosfacil-ref-discount')
  if (code) {
    fetch(`/api/affiliate/validate/${code}`)
      .then(r => r.json())
      .then(data => {
        if (data.valid) {
          const disc = urlDiscount === '10' || urlDiscount === '20' ? parseInt(urlDiscount) : data.defaultDiscount
          setAffiliateDiscount(disc)
          setAffiliateCode(code)
        }
      })
      .catch(() => {})
  }
}, [])
  
useEffect(() => {
  const dataToSave = {
    step,
    form,
    selectedPlan,
    noActivity,
    manualMode,
    extractedStays,
    fileProcessed,
    acceptTerms,
    acceptAuthorization,
    lang
  };
  localStorage.setItem('nrua_form_progress', JSON.stringify(dataToSave));
}, [step, form, selectedPlan, noActivity, manualMode, extractedStays, fileProcessed, acceptTerms, acceptAuthorization, lang]);

// Restaurar progreso al cargar
useEffect(() => {
  try {
    const saved = localStorage.getItem('nrua_form_progress');
    if (saved) {
      const data = JSON.parse(saved);
      if (data.form) setForm(data.form);
      if (data.step) setStep(data.step);
      if (data.selectedPlan) setSelectedPlan(data.selectedPlan);
      if (data.noActivity) setNoActivity(data.noActivity);
      if (data.manualMode) setManualMode(data.manualMode);
      if (data.extractedStays?.length) setExtractedStays(data.extractedStays);
      if (data.fileProcessed) setFileProcessed(data.fileProcessed);
      if (data.acceptTerms) setAcceptTerms(data.acceptTerms);
      if (data.acceptAuthorization) setAcceptAuthorization(data.acceptAuthorization);
      if (data.lang) setLang(data.lang);
    }
  } catch (e) {
    console.error('Error restoring form:', e);
  }
}, []);

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
      if (!acceptGdpr) e.gdpr = t.errors.required
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

 const next = () => {
  if (validate()) {
    if (step === 1 && selectedPlan > 1) {
      setStep(4)
    } else {
      setStep(s => Math.min(s + 1, 4))
    }
  }
   }  
 const back = () => {
  if (step === 4 && selectedPlan > 1) {
    setStep(1)
  } else {
    setStep(s => Math.max(s - 1, 1))
  }
}

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
   const hasFiles = uploadedFiles.airbnb || uploadedFiles.booking || uploadedFiles.vrbo || uploadedFiles.other
    if (!hasFiles) return
    
    setIsProcessing(true)
    setFileProcessed(false)
    
    try {
      const formData = new FormData()
      if (uploadedFiles.airbnb) formData.append('airbnb', uploadedFiles.airbnb)
      if (uploadedFiles.booking) formData.append('booking', uploadedFiles.booking)
      if (uploadedFiles.vrbo) formData.append('vrbo', uploadedFiles.vrbo)
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
    guests: s.huespedes?.toString() || '',
    purpose: '1',
    source: 'Airbnb'
  }))]
}

if (data.booking?.estancias) {
  allStays = [...allStays, ...data.booking.estancias.map(s => ({
    checkIn: s.fecha_entrada?.split('/').reverse().join('-') || '',
    checkOut: s.fecha_salida?.split('/').reverse().join('-') || '',
    guests: s.huespedes?.toString() || '',
    purpose: '1',
    source: 'Booking'
  }))]
}

        if (data.vrbo?.estancias) {
  allStays = [...allStays, ...data.vrbo.estancias.map(s => ({
    checkIn: s.fecha_entrada?.split('/').reverse().join('-') || '',
    checkOut: s.fecha_salida?.split('/').reverse().join('-') || '',
    guests: s.huespedes?.toString() || '',
    purpose: '1',
    source: 'VRBO'
  }))]
}

if (data.other?.estancias) {
  allStays = [...allStays, ...data.other.estancias.map(s => ({
    checkIn: s.fecha_entrada?.split('/').reverse().join('-') || '',
    checkOut: s.fecha_salida?.split('/').reverse().join('-') || '',
    guests: s.huespedes?.toString() || '',
    purpose: '1',
    source: 'Otro'
  }))]
}
        
        allStays.sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))
        
        // Detectar y corregir estancias con salida en 2026+
        let adjustedCount = 0
        allStays = allStays.map(stay => {
          if (!stay.checkOut) return stay
          const checkOutYear = new Date(stay.checkOut).getFullYear()
          if (checkOutYear > 2025) {
            adjustedCount++
            return { ...stay, checkOut: '2025-12-31', originalCheckOut: stay.checkOut, dateAdjusted: true }
          }
          return stay
        })
        setDateAdjustedCount(adjustedCount)

       // Detectar duplicados y solapamientos
allStays = allStays.map((stay, index) => {
  const isDuplicate = allStays.some((other, otherIndex) => 
    otherIndex !== index && 
    other.checkIn === stay.checkIn
  )
  const isOverlapping = allStays.some((other, otherIndex) => {
    if (otherIndex === index) return false
    if (!stay.checkIn || !stay.checkOut || !other.checkIn || !other.checkOut) return false
    const stayStart = new Date(stay.checkIn)
    const stayEnd = new Date(stay.checkOut)
    const otherStart = new Date(other.checkIn)
    const otherEnd = new Date(other.checkOut)
    return stayStart < otherEnd && stayEnd > otherStart && !(stay.checkIn === other.checkIn && stay.checkOut === other.checkOut)
  })
  return { ...stay, isDuplicate, isOverlapping }
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
    setUploadedFiles({ airbnb: null, booking: null, vrbo: null, other: null })
    setFileProcessed(false)
    setExtractedStays([])
    setDateAdjustedCount(0)
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
    const filtered = prev.filter((_, i) => i !== index)
    
    return filtered.map((stay, idx) => {
      const isDuplicate = filtered.some((other, otherIdx) => 
        otherIdx !== idx && 
        other.checkIn === stay.checkIn
      )
      const isOverlapping = filtered.some((other, otherIdx) => {
        if (otherIdx === idx) return false
        if (!stay.checkIn || !stay.checkOut || !other.checkIn || !other.checkOut) return false
        const stayStart = new Date(stay.checkIn)
        const stayEnd = new Date(stay.checkOut)
        const otherStart = new Date(other.checkIn)
        const otherEnd = new Date(other.checkOut)
        return stayStart < otherEnd && stayEnd > otherStart && !(stay.checkIn === other.checkIn && stay.checkOut === other.checkOut)
      })
      return { ...stay, isDuplicate, isOverlapping }
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
    const nruaPhotoBase64 = await fileToBase64(nruaFile)
    
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
          otherName: uploadedFiles.other?.name || null,
          nruaPhoto: nruaPhotoBase64,
          nruaPhotoName: nruaFile?.name || null
        },
        // Estancias extraídas
        stays: extractedStays,
       noActivity: noActivity,
        gdprConsent: {
          accepted: acceptGdpr,
          timestamp: new Date().toISOString(),
          ip: null
       },
        affiliateCode: affiliateCode || null,
        affiliateDiscount: affiliateDiscount || null
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
  const hasAnyFile = uploadedFiles.airbnb || uploadedFiles.booking || uploadedFiles.vrbo || uploadedFiles.other

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
            {selectedPlan > 1 ? (
              <>
                <div className={`progress-step ${step > 1 ? 'completed' : 'active'}`}>
                  <div className="step-circle">{step > 1 ? <Check size={16} /> : 1}</div>
                  <span className="step-label">{t.steps[0]}</span>
                </div>
                <div className={`progress-step ${step === 4 ? 'active' : ''}`}>
                  <div className="step-circle">2</div>
                  <span className="step-label">{t.steps[3]}</span>
                </div>
              </>
            ) : (
              t.steps.map((s, i) => (
                <div key={i} className={`progress-step ${step > i + 1 ? 'completed' : ''} ${step === i + 1 ? 'active' : ''}`}>
                  <div className="step-circle">{step > i + 1 ? <Check size={16} /> : i + 1}</div>
                  <span className="step-label">{s}</span>
                </div>
              ))
            )}
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
                  {/* Plan Selection */}
              <div className="plan-select-mini" style={{marginTop: '24px'}}>
                <h4>{t.step4.plan}</h4>
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
                {selectedPlan > 1 && (
                  <p className="multi-info" style={{marginTop: '12px', padding: '12px', background: '#f0f7ff', borderRadius: '8px', fontSize: '14px'}}>
                    ℹ️ {lang === 'es' ? `Tras el pago, podrás añadir tus ${selectedPlan} propiedades desde "Mi cuenta"` :
                         lang === 'en' ? `After payment, you can add your ${selectedPlan} properties from "My account"` :
                         lang === 'fr' ? `Après paiement, ajoutez vos ${selectedPlan} propriétés depuis "Mon compte"` :
                         `Nach der Zahlung können Sie Ihre ${selectedPlan} Immobilien über "Mein Konto" hinzufügen`}
                  </p>
                )}
              </div>
                  {/* GDPR Consent */}
<div className="authorization-box" style={{marginTop: '16px'}}>
  <label className="checkbox-label authorization">
    <input 
      type="checkbox" 
      checked={acceptGdpr} 
      onChange={e => setAcceptGdpr(e.target.checked)} 
    />
    <span>
      {lang === 'es' ? 'Acepto el tratamiento de mis datos personales y de los datos contenidos en los archivos de reservas (Airbnb, Booking, etc.) por parte de Rental Connect Solutions Tmi, con la finalidad exclusiva de gestionar la presentación del Modelo N2 ante el Registro de la Propiedad. Ver ' :
       lang === 'en' ? 'I accept the processing of my personal data and the data contained in booking files (Airbnb, Booking, etc.) by Rental Connect Solutions Tmi, solely for the purpose of submitting Form N2 to the Property Registry. See ' :
       lang === 'fr' ? "J'accepte le traitement de mes données personnelles et des données contenues dans les fichiers de réservations (Airbnb, Booking, etc.) par Rental Connect Solutions Tmi, dans le seul but de déposer le Formulaire N2 au Registre de la Propriété. Voir " :
       'Ich akzeptiere die Verarbeitung meiner personenbezogenen Daten und der in den Buchungsdateien (Airbnb, Booking, etc.) enthaltenen Daten durch Rental Connect Solutions Tmi, ausschließlich zum Zweck der Einreichung des Formulars N2 beim Grundbuchamt. Siehe '}
      <a href="/privacidad">{t.step4.privacy}</a>
    </span>
  </label>
  {errors.gdpr && <span className="error-msg" style={{marginLeft: '32px'}}>{errors.gdpr}</span>}
</div>
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
  
  {/* CTA: No tiene NRUA */}
  <div className="nrua-cta-box">
    <span className="nrua-cta-icon">⚠️</span>
    <div className="nrua-cta-content">
      <strong>
        {lang === 'es' ? '¿No tienes tu número NRUA?' :
         lang === 'en' ? "Don't have your NRUA number?" :
         lang === 'fr' ? "Vous n'avez pas votre numéro NRUA ?" :
         'Haben Sie keine NRUA-Nummer?'}
      </strong>
      <p>
        {lang === 'es' ? 'No te preocupes. Te ayudamos a obtenerlo.' :
         lang === 'en' ? "Don't worry. We help you get it." :
         lang === 'fr' ? 'Pas de souci. Nous vous aidons à l\'obtenir.' :
         'Kein Problem. Wir helfen Ihnen, sie zu erhalten.'}
      </p>
      <a href="/solicitar-nrua" className="nrua-cta-link">
        {lang === 'es' ? 'Solicitar NRUA — 149€ →' :
         lang === 'en' ? 'Request NRUA — €149 →' :
         lang === 'fr' ? 'Demander NRUA — 149€ →' :
         'NRUA beantragen — 149€ →'}
      </a>
    </div>
  </div>
</div>

                {/* NRUA Photo Upload */}
                <div className="form-group">
                  <label>{t.step2.nruaPhoto}</label>
                  <div 
                    className={`upload-zone-mini nrua-photo-upload ${nruaFile ? 'has-file' : ''}`}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) setNruaFile(f); }}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => document.getElementById('nruaPhotoInput').click()}
                  >
                    <input 
                      type="file" 
                      id="nruaPhotoInput" 
                      accept="image/*,.pdf" 
                      onChange={e => { const f = e.target.files?.[0]; if (f) setNruaFile(f); }}
                      hidden 
                    />
                    <div className="upload-zone-content">
                      {nruaFile ? (
                        <div className="file-info">
                          {nruaFile.type.startsWith('image/') && (
                            <img 
                              src={URL.createObjectURL(nruaFile)} 
                              alt="NRUA preview" 
                              className="nrua-preview-thumb" 
                            />
                          )}
                          <span className="file-name">{nruaFile.name}</span>
                          <button className="btn-remove" onClick={e => { e.stopPropagation(); setNruaFile(null); }}>×</button>
                        </div>
                      ) : (
                        <>
                          <span className="upload-icon">📷</span>
                          <span className="upload-hint">{t.step2.nruaPhotoDrag}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="help-text">{t.step2.nruaPhotoHelp}</span>
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
<div className="upload-card-wrapper">
  <div 
    className={`upload-zone-mini ${uploadedFiles.airbnb ? 'has-file' : ''}`}
    onDrop={handleFileDrop('airbnb')}
    onDragOver={e => e.preventDefault()}
    onClick={() => document.getElementById('airbnbInput').click()}
  >
    <input type="file" id="airbnbInput" accept=".csv,.xlsx,.xls" onChange={handleFileUpload('airbnb')} hidden />
    <div className="upload-zone-content">
      <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" alt="Airbnb" className="platform-icon" />
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
  
  {!uploadedFiles.airbnb && (
    <details className="platform-help-details">
      <summary>📥 {t.step3.airbnbHelp}</summary>
      <div className="help-content">
        <p><strong>Paso 1:</strong> Filtra por fechas (1 ene - 31 dic 2025) y propiedad</p>
       <img src="/images/airbnbexplain1.png" alt="Filtrar reservas en Airbnb" className="help-screenshot clickable" onClick={(e) => { e.stopPropagation(); setLightboxImage('/images/airbnbexplain1.png'); }} />
        <p><strong>Paso 2:</strong> Exportar → Descarga el archivo CSV</p>
        <img src="/images/airbnbexplain2.png" alt="Descargar CSV en Airbnb" className="help-screenshot clickable" onClick={(e) => { e.stopPropagation(); setLightboxImage('/images/airbnbexplain2.png'); }} />
        <a href="https://www.airbnb.es/hosting/reservations/completed" target="_blank" rel="noopener noreferrer" className="btn btn-small btn-outline">
          🔗 Ir a mis reservas de Airbnb
        </a>
      </div>
    </details>
  )}
</div>

{/* Booking Upload */}
<div className="upload-card-wrapper">
  <div 
    className={`upload-zone-mini ${uploadedFiles.booking ? 'has-file' : ''}`}
    onDrop={handleFileDrop('booking')}
    onDragOver={e => e.preventDefault()}
    onClick={() => document.getElementById('bookingInput').click()}
  >
    <input type="file" id="bookingInput" accept=".csv,.xlsx,.xls" onChange={handleFileUpload('booking')} hidden />
    <div className="upload-zone-content">
      <img src="https://upload.wikimedia.org/wikipedia/commons/b/be/Booking.com_logo.svg" alt="Booking" className="platform-icon" />
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
  
  {!uploadedFiles.booking && (
    <details className="platform-help-details">
      <summary>📥 {t.step3.bookingHelp}</summary>
      <div className="help-content">
        <p><strong>Paso 1:</strong> Filtra por estado "OK" y fechas 2025</p>
        <p><strong>Paso 2:</strong> Haz clic en "Download"</p>
       <img src="/images/bookingexplain.png" alt="Descargar reservas en Booking" className="help-screenshot clickable" onClick={(e) => { e.stopPropagation(); setLightboxImage('/images/bookingexplain.png'); }} />
        <a href="https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/booking_reservations.html" target="_blank" rel="noopener noreferrer" className="btn btn-small btn-outline">
          🔗 Ir a mis reservas de Booking
        </a>
      </div>
    </details>
  )}
</div>

{/* VRBO Upload */}
<div className="upload-card-wrapper">
  <div 
    className={`upload-zone-mini ${uploadedFiles.vrbo ? 'has-file' : ''}`}
    onDrop={handleFileDrop('vrbo')}
    onDragOver={e => e.preventDefault()}
    onClick={() => document.getElementById('vrboInput').click()}
  >
    <input type="file" id="vrboInput" accept=".csv,.xlsx,.xls" onChange={handleFileUpload('vrbo')} hidden />
    <div className="upload-zone-content">
      <span className="upload-icon" style={{fontSize: '24px', fontWeight: 'bold', color: '#0e2658'}}>Vrbo</span>
      <strong>{t.step3.vrboFile}</strong>
      {uploadedFiles.vrbo ? (
        <div className="file-info">
          <span className="file-name">{uploadedFiles.vrbo.name}</span>
          <button className="btn-remove" onClick={(e) => { e.stopPropagation(); removeFile('vrbo'); }}>×</button>
        </div>
      ) : (
        <span className="upload-hint">{t.step3.dragOrClick}</span>
      )}
    </div>
  </div>
  
  {!uploadedFiles.vrbo && (
    <details className="platform-help-details">
      <summary>📥 {t.step3.vrboHelp}</summary>
      <div className="help-content">
        <p><strong>Paso 1:</strong> Ve a Bandeja de entrada → Filtros → Selecciona: Estancia reservada, Después de la estancia, Salida próxima, Estancia actual, Llegada hoy. Filtra fechas 1 ene – 31 dic 2025</p>
        <img src="/images/vrboexplain1.png" alt="Filtrar reservas en VRBO" className="help-screenshot clickable" onClick={(e) => { e.stopPropagation(); setLightboxImage('/images/vrboexplain1.png'); }} />
        <p><strong>Paso 2:</strong> Haz clic en "Descargar" (arriba a la derecha) → Confirma la descarga</p>
        <img src="/images/vrboexplain2.png" alt="Descargar reservas en VRBO" className="help-screenshot clickable" onClick={(e) => { e.stopPropagation(); setLightboxImage('/images/vrboexplain2.png'); }} />
        <a href="https://www.vrbo.com/es-es/supply/inbox" target="_blank" rel="noopener noreferrer" className="btn btn-small btn-outline">
          🔗 Ir a mis reservas de VRBO
        </a>
      </div>
    </details>
  )}
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
      <>
        <span className="upload-hint">{t.step3.dragOrClick}</span>
        <span className="upload-help-text-small">{t.step3.otherHelp}</span>
        <details className="format-help-inline" onClick={e => e.stopPropagation()}>
          <summary>📋 {t.step3.formatHelp}</summary>
          <p>{t.step3.formatInfo}</p>
        </details>
      </>
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

  </div>
)}

              {/* Lista editable de estancias */}
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

                  {/* Banner de aviso de fechas ajustadas */}
                  {dateAdjustedCount > 0 && (
                    <div className="date-adjusted-banner" style={{
                      background: '#fef3c7',
                      border: '1px solid #f59e0b',
                      borderRadius: '8px',
                      padding: '12px 16px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#92400e'
                    }}>
                      <AlertCircle size={18} style={{ flexShrink: 0 }} />
                      <span><strong>{dateAdjustedCount}</strong> {t.step3.dateAdjusted}</span>
                    </div>
                  )}

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
                     <div key={i} className={`stays-table-row ${stay.isDuplicate ? 'duplicate-warning' : ''} ${stay.isOverlapping ? 'overlap-warning' : ''} ${stay.dateAdjusted ? 'date-adjusted-row' : ''}`}>
                        <input 
                          type="date" 
                          value={stay.checkIn} 
                          onChange={e => updateStay(i, 'checkIn', e.target.value)}
                        />
                        <div style={{ position: 'relative' }}>
                          <input 
                            type="date" 
                            value={stay.checkOut} 
                            onChange={e => updateStay(i, 'checkOut', e.target.value)}
                            style={stay.dateAdjusted ? { borderColor: '#f59e0b', background: '#fffbeb' } : {}}
                          />
                          {stay.dateAdjusted && (
                            <span style={{
                              position: 'absolute',
                              top: '-8px',
                              right: '-4px',
                              background: '#f59e0b',
                              color: '#fff',
                              fontSize: '10px',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              whiteSpace: 'nowrap'
                            }}>{t.step3.dateAdjustedTag}</span>
                          )}
                        </div>
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
                        <button className="btn-delete-stay" onClick={() => removeStay(i)} title="Eliminar estancia">🗑️</button>
                        {stay.isDuplicate && <span className="duplicate-badge" title={t.step3.duplicateWarning}>⚠️</span>}
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

             {/* Plan Selection - only show for single property */}
              {selectedPlan === 1 && <div className="plans-grid compact">
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
              </div>}

              {/* Summary */}
              <div className="order-summary">
                <h4>{t.step4.summary}</h4>
                <div className="summary-row"><span>{t.step4.plan}:</span><strong>{currentPlan?.name}</strong></div>
              {selectedPlan === 1 ? (
                  <>
                    <div className="summary-row"><span>NRUA:</span><strong>{form.nrua}</strong></div>
                    <div className="summary-row"><span>{t.step2.address}:</span><strong>{form.address}</strong></div>
                  </>
                ) : (
                  <div className="summary-row">
                    <span>📋</span>
                    <strong>{lang === 'es' ? `Añadirás ${selectedPlan} propiedades después del pago` :
                             lang === 'en' ? `You'll add ${selectedPlan} properties after payment` :
                             lang === 'fr' ? `Vous ajouterez ${selectedPlan} propriétés après paiement` :
                             `Sie fügen ${selectedPlan} Immobilien nach der Zahlung hinzu`}</strong>
                  </div>
                )}
                {affiliateDiscount && (
                  <div className="summary-row" style={{color: '#10b981'}}>
                    <span>🎟️ Descuento afiliado ({affiliateDiscount}%):</span>
                    <strong>-{Math.round(currentPlan?.price * affiliateDiscount / 100)}€</strong>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total:</span>
                  <strong>
                    {affiliateDiscount ? (
                      <>{<span style={{textDecoration: 'line-through', color: '#9ca3af', marginRight: '8px'}}>{currentPlan?.priceStr}</span>}{Math.round(currentPlan?.price * (100 - affiliateDiscount) / 100)}€</>
                    ) : currentPlan?.priceStr}
                  </strong>
                </div>
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
                {t.step4.payBtn} {affiliateDiscount ? `${Math.round(currentPlan?.price * (100 - affiliateDiscount) / 100)}€` : currentPlan?.priceStr}
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

     {/* Lightbox Modal */}
{lightboxImage && createPortal(
  <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
      <img src={lightboxImage} alt="Vista ampliada" />
      <button className="lightbox-close" onClick={() => setLightboxImage(null)}>×</button>
    </div>
  </div>,
  document.body
)}
    </div>
  )
}
export default FormularioNRUA
