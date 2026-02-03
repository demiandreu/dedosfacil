import React, { useState, useEffect } from 'react'
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  Shield, 
  ArrowRight,
  X,
  Check,
  HelpCircle,
  Mail,
  AlertTriangle,
  Home,
  Download
} from 'lucide-react'

const translations = {
  es: {
    urgentBanner: {
      text: "⚠️ URGENTE: Solo quedan",
      days: "días",
      text2: "para presentar. Si no lo haces, pierdes tu licencia.",
      cta: "Empezar ahora →"
    },
    nav: { howItWorks: "Cómo funciona", pricing: "Precios", faq: "FAQ", startNow: "Empezar ahora" },
    hero: {
      badge: "Plazo límite: 2 de marzo",
      title: "¿Tienes un piso en",
      titleHighlight: "Airbnb o Booking?",
      subtitle: "Estás obligado a presentar el Depósito de Arrendamientos (NRUA) antes del 2 de marzo.",
      subtitleBold: " Si no lo haces, te revocan la licencia y no puedes seguir alquilando.",
      cta: "Presentar mi NRUA",
      priceFrom: "Desde",
      trust1: "Sin programa N2", trust2: "100% Legal", trust3: "24-48h"
    },
    warning: {
      title: "⚠️ Si no presentas antes del 2 de marzo:",
      items: [
        "Te revocan el NRUA = No puedes anunciar en Airbnb, Booking, VRBO...",
        "Pierdes tu fuente de ingresos inmediatamente",
        "Proceso largo y costoso para recuperar la licencia"
      ]
    },
    problem: {
      title: "😤 El problema: Programa N2",
      subtitle: "El Gobierno te obliga a usar un programa que SOLO funciona en Windows",
      items: [
        "Solo funciona en Windows (si tienes Mac, no puedes)",
        "Descargar e instalar programa N2",
        "Entender códigos NRUA y CRU",
        "Generar archivos XBRL",
        "Certificado digital obligatorio",
        "Errores incomprensibles"
      ]
    },
    solution: {
      title: "😊 Nuestra solución: Tú subes, nosotros presentamos",
      items: [
        "Funciona desde cualquier dispositivo",
        "Descargas CSV de Airbnb/Booking (2 min)",
        "Nos lo envías y nosotros hacemos todo",
        "Sin certificado digital",
        "Recibes justificante oficial en 24-48h"
      ]
    },
    howItWorks: {
      title: "¿Cómo funciona?",
      subtitle: "3 pasos y listo. Tú tardas 5 minutos.",
      step1: "Descarga tu historial",
      step1desc: "Entra en Airbnb o Booking y descarga el CSV de reservas de 2025.",
      step2: "Súbelo y paga",
      step2desc: "Rellena tus datos, sube el archivo y paga de forma segura.",
      step3: "Recibe tu justificante",
      step3desc: "En 24-48h te enviamos el justificante oficial por email."
    },
    download: {
      title: "📥 ¿Cómo descargo mis reservas?",
      airbnb: {
        title: "Desde Airbnb:",
        steps: ["Entra en airbnb.com → Tu cuenta", "Ve a 'Historial de transacciones'", "Haz clic en 'Exportar CSV'", "Guarda el archivo"]
      },
      booking: {
        title: "Desde Booking:",
        steps: ["Entra en Extranet de Booking", "Ve a 'Reservas' → 'Historial'", "Haz clic en 'Exportar'", "Guarda el archivo CSV"]
      },
      other: "¿Usas VRBO u otra plataforma? Descarga el PDF o informe de reservas y súbelo igualmente.",
      noFile: "¿No tienes archivo? No te preocupes, también puedes rellenar las estancias manualmente en el formulario."
    },
    pricing: {
      title: "Precios claros",
      note: "* Tasas del Registro no incluidas",
      plans: [
        { name: "1 Propiedad", price: "79€", features: ["1 NRUA", "Presentación oficial", "Justificante", "Soporte email", "Entrega 48h"] },
        { name: "3 Propiedades", price: "199€", period: "ahorra 38€", features: ["Hasta 3 NRUA", "Presentación oficial", "Justificante", "Soporte prioritario", "Entrega 24h"], popular: true },
        { name: "10 Propiedades", price: "449€", period: "ahorra 341€", features: ["Hasta 10 NRUA", "Gestión completa", "Soporte telefónico", "Entrega prioritaria"] }
      ],
      select: "Seleccionar",
      popular: "Más popular"
    },
    faq: {
      title: "Preguntas frecuentes",
      items: [
        { q: "¿Qué es el NRUA?", a: "Es el Número de Registro Único de Arrendamientos. Si alquilas tu piso en Airbnb, Booking u otra plataforma, tienes que informar cada año de todas las estancias. El plazo es el 2 de marzo." },
        { q: "¿Qué pasa si no presento?", a: "Te revocan el NRUA. Esto significa que no puedes seguir anunciando tu piso en ninguna plataforma. Pierdes tu fuente de ingresos." },
        { q: "¿Es legal que lo hagáis vosotros?", a: "Sí, 100% legal. La normativa permite que lo presente el titular o quien gestione el alquiler. Actuamos como gestores autorizados." },
        { q: "¿Qué datos necesitáis?", a: "Tu código NRUA (está en tu licencia) y el historial de reservas de 2025 (CSV de Airbnb o Booking)." },
        { q: "¿Y si no tuve alquileres en 2025?", a: "También hay que presentar marcando 'sin actividad'. Nosotros nos encargamos igualmente." }
      ]
    },
    cta: {
      title: "No pierdas tu licencia",
      subtitle: "Quedan pocos días. Presenta tu NRUA ahora.",
      button: "Empezar ahora",
      daysLeft: "días restantes"
    },
    footer: {
      slogan: "Trámites registrales sin complicaciones",
      legal: "Legal", legalNotice: "Aviso legal", privacy: "Privacidad", cookies: "Cookies",
      contact: "Contacto",
      copyright: "© 2026 DedosFácil. Todos los derechos reservados.",
      cuentas: "¿Necesitas depositar Cuentas Anuales? ",
      cuentasLink: "Más info"
    }
  },
  en: {
    urgentBanner: {
      text: "⚠️ URGENT: Only",
      days: "days left",
      text2: "to submit. If you don't, you lose your license.",
      cta: "Start now →"
    },
    nav: { howItWorks: "How it works", pricing: "Pricing", faq: "FAQ", startNow: "Start now" },
    hero: {
      badge: "Deadline: March 2nd",
      title: "Do you have a property on",
      titleHighlight: "Airbnb or Booking?",
      subtitle: "You must submit the Rental Declaration (NRUA) before March 2nd.",
      subtitleBold: " If you don't, your license will be revoked and you can't rent anymore.",
      cta: "Submit my NRUA",
      priceFrom: "From",
      trust1: "No N2 software", trust2: "100% Legal", trust3: "24-48h"
    },
    warning: {
      title: "⚠️ If you don't submit before March 2nd:",
      items: [
        "NRUA revoked = You can't advertise on Airbnb, Booking, VRBO...",
        "You lose your income source immediately",
        "Long and expensive process to recover your license"
      ]
    },
    problem: {
      title: "😤 The problem: N2 Software",
      subtitle: "The Government requires you to use a program that ONLY works on Windows",
      items: [
        "Only works on Windows (if you have Mac, you can't)",
        "Download and install N2 software",
        "Understand NRUA and CRU codes",
        "Generate XBRL files",
        "Digital certificate required",
        "Incomprehensible errors"
      ]
    },
    solution: {
      title: "😊 Our solution: You upload, we submit",
      items: [
        "Works from any device",
        "Download CSV from Airbnb/Booking (2 min)",
        "Send it to us and we do everything",
        "No digital certificate needed",
        "Receive official certificate in 24-48h"
      ]
    },
    howItWorks: {
      title: "How does it work?",
      subtitle: "3 steps and done. Takes you 5 minutes.",
      step1: "Download your history",
      step1desc: "Go to Airbnb or Booking and download the 2025 reservations CSV.",
      step2: "Upload and pay",
      step2desc: "Fill in your details, upload the file and pay securely.",
      step3: "Receive your certificate",
      step3desc: "In 24-48h we send you the official certificate by email."
    },
    download: {
      title: "📥 How do I download my reservations?",
      airbnb: {
        title: "From Airbnb:",
        steps: ["Go to airbnb.com → Your account", "Go to 'Transaction history'", "Click 'Export CSV'", "Save the file"]
      },
      booking: {
        title: "From Booking:",
        steps: ["Go to Booking Extranet", "Go to 'Reservations' → 'History'", "Click 'Export'", "Save the CSV file"]
      },
      other: "Using VRBO or another platform? Download the PDF or booking report and upload it anyway.",
      noFile: "Don't have a file? Don't worry, you can also fill in the stays manually in the form."
    },
    pricing: {
      title: "Clear pricing",
      note: "* Registry fees not included",
      plans: [
        { name: "1 Property", price: "€79", features: ["1 NRUA", "Official submission", "Certificate", "Email support", "48h delivery"] },
        { name: "3 Properties", price: "€199", period: "save €38", features: ["Up to 3 NRUA", "Official submission", "Certificate", "Priority support", "24h delivery"], popular: true },
        { name: "10 Properties", price: "€449", period: "save €341", features: ["Up to 10 NRUA", "Full management", "Phone support", "Priority delivery"] }
      ],
      select: "Select",
      popular: "Most popular"
    },
    faq: {
      title: "FAQ",
      items: [
        { q: "What is NRUA?", a: "It's the Unique Rental Registration Number. If you rent your property on Airbnb, Booking or another platform, you must report all stays every year. Deadline is March 2nd." },
        { q: "What happens if I don't submit?", a: "Your NRUA gets revoked. This means you can't advertise your property on any platform. You lose your income." },
        { q: "Is it legal for you to do this?", a: "Yes, 100% legal. The regulation allows submission by the owner or property manager. We act as authorized agents." },
        { q: "What data do you need?", a: "Your NRUA code (on your license) and the 2025 reservation history (CSV from Airbnb or Booking)." },
        { q: "What if I had no rentals in 2025?", a: "You still need to submit marking 'no activity'. We take care of it." }
      ]
    },
    cta: {
      title: "Don't lose your license",
      subtitle: "Few days left. Submit your NRUA now.",
      button: "Start now",
      daysLeft: "days remaining"
    },
    footer: {
      slogan: "Registry procedures without hassle",
      legal: "Legal", legalNotice: "Legal notice", privacy: "Privacy", cookies: "Cookies",
      contact: "Contact",
      copyright: "© 2026 DedosFácil. All rights reserved.",
      cuentas: "Need to file Annual Accounts? ",
      cuentasLink: "More info"
    }
  },
  fr: {
    urgentBanner: {
      text: "⚠️ URGENT: Plus que",
      days: "jours",
      text2: "pour déposer. Sinon, vous perdez votre licence.",
      cta: "Commencer →"
    },
    nav: { howItWorks: "Comment ça marche", pricing: "Tarifs", faq: "FAQ", startNow: "Commencer" },
    hero: {
      badge: "Date limite: 2 mars",
      title: "Vous avez un bien sur",
      titleHighlight: "Airbnb ou Booking?",
      subtitle: "Vous devez déposer la Déclaration de Location (NRUA) avant le 2 mars.",
      subtitleBold: " Sinon, votre licence sera révoquée et vous ne pourrez plus louer.",
      cta: "Déposer mon NRUA",
      priceFrom: "À partir de",
      trust1: "Sans logiciel N2", trust2: "100% Légal", trust3: "24-48h"
    },
    warning: {
      title: "⚠️ Si vous ne déposez pas avant le 2 mars:",
      items: [
        "NRUA révoqué = Impossible de publier sur Airbnb, Booking, VRBO...",
        "Vous perdez votre source de revenus immédiatement",
        "Processus long et coûteux pour récupérer votre licence"
      ]
    },
    problem: {
      title: "😤 Le problème: Logiciel N2",
      subtitle: "Le Gouvernement vous oblige à utiliser un logiciel qui ne fonctionne QUE sur Windows",
      items: [
        "Fonctionne uniquement sur Windows (pas sur Mac)",
        "Télécharger et installer le logiciel N2",
        "Comprendre les codes NRUA et CRU",
        "Générer des fichiers XBRL",
        "Certificat numérique obligatoire",
        "Erreurs incompréhensibles"
      ]
    },
    solution: {
      title: "😊 Notre solution: Vous uploadez, nous déposons",
      items: [
        "Fonctionne depuis n'importe quel appareil",
        "Téléchargez le CSV d'Airbnb/Booking (2 min)",
        "Envoyez-le nous et nous faisons tout",
        "Sans certificat numérique",
        "Recevez le certificat officiel en 24-48h"
      ]
    },
    howItWorks: {
      title: "Comment ça marche?",
      subtitle: "3 étapes et c'est fait. Vous en avez pour 5 minutes.",
      step1: "Téléchargez votre historique",
      step1desc: "Allez sur Airbnb ou Booking et téléchargez le CSV des réservations 2025.",
      step2: "Uploadez et payez",
      step2desc: "Remplissez vos données, uploadez le fichier et payez en sécurité.",
      step3: "Recevez votre certificat",
      step3desc: "En 24-48h nous vous envoyons le certificat officiel par email."
    },
    download: {
      title: "📥 Comment télécharger mes réservations?",
      airbnb: {
        title: "Depuis Airbnb:",
        steps: ["Allez sur airbnb.com → Votre compte", "Allez dans 'Historique des transactions'", "Cliquez sur 'Exporter CSV'", "Enregistrez le fichier"]
      },
      booking: {
        title: "Depuis Booking:",
        steps: ["Allez sur l'Extranet Booking", "Allez dans 'Réservations' → 'Historique'", "Cliquez sur 'Exporter'", "Enregistrez le fichier CSV"]
      },
      other: "Vous utilisez VRBO ou autre? Téléchargez le PDF ou rapport de réservations et uploadez-le.",
      noFile: "Pas de fichier? Pas de souci, vous pouvez aussi remplir les séjours manuellement."
    },
    pricing: {
      title: "Tarifs clairs",
      note: "* Frais de Registre non inclus",
      plans: [
        { name: "1 Propriété", price: "79€", features: ["1 NRUA", "Dépôt officiel", "Certificat", "Support email", "Livraison 48h"] },
        { name: "3 Propriétés", price: "199€", period: "économisez 38€", features: ["Jusqu'à 3 NRUA", "Dépôt officiel", "Certificat", "Support prioritaire", "Livraison 24h"], popular: true },
        { name: "10 Propriétés", price: "449€", period: "économisez 341€", features: ["Jusqu'à 10 NRUA", "Gestion complète", "Support téléphonique", "Livraison prioritaire"] }
      ],
      select: "Choisir",
      popular: "Le plus populaire"
    },
    faq: {
      title: "FAQ",
      items: [
        { q: "Qu'est-ce que le NRUA?", a: "C'est le Numéro d'Enregistrement Unique des Locations. Si vous louez sur Airbnb, Booking ou autre, vous devez déclarer tous les séjours chaque année. Date limite: 2 mars." },
        { q: "Que se passe-t-il si je ne dépose pas?", a: "Votre NRUA est révoqué. Vous ne pouvez plus publier votre bien sur aucune plateforme. Vous perdez vos revenus." },
        { q: "Est-ce légal que vous le fassiez?", a: "Oui, 100% légal. La réglementation permet le dépôt par le propriétaire ou le gestionnaire. Nous agissons comme mandataires autorisés." },
        { q: "Quelles données avez-vous besoin?", a: "Votre code NRUA (sur votre licence) et l'historique des réservations 2025 (CSV d'Airbnb ou Booking)." },
        { q: "Et si je n'ai pas eu de locations en 2025?", a: "Il faut quand même déposer en indiquant 'sans activité'. Nous nous en chargeons." }
      ]
    },
    cta: {
      title: "Ne perdez pas votre licence",
      subtitle: "Il reste peu de jours. Déposez votre NRUA maintenant.",
      button: "Commencer",
      daysLeft: "jours restants"
    },
    footer: {
      slogan: "Démarches sans complications",
      legal: "Légal", legalNotice: "Mentions légales", privacy: "Confidentialité", cookies: "Cookies",
      contact: "Contact",
      copyright: "© 2026 DedosFácil. Tous droits réservés.",
      cuentas: "Besoin de déposer des Comptes Annuels? ",
      cuentasLink: "Plus d'infos"
    }
  },
  de: {
    urgentBanner: {
      text: "⚠️ DRINGEND: Nur noch",
      days: "Tage",
      text2: "zum Einreichen. Sonst verlieren Sie Ihre Lizenz.",
      cta: "Jetzt starten →"
    },
    nav: { howItWorks: "So geht's", pricing: "Preise", faq: "FAQ", startNow: "Jetzt starten" },
    hero: {
      badge: "Frist: 2. März",
      title: "Haben Sie eine Immobilie auf",
      titleHighlight: "Airbnb oder Booking?",
      subtitle: "Sie müssen die Vermietungserklärung (NRUA) vor dem 2. März einreichen.",
      subtitleBold: " Sonst wird Ihre Lizenz widerrufen und Sie können nicht mehr vermieten.",
      cta: "Mein NRUA einreichen",
      priceFrom: "Ab",
      trust1: "Ohne N2-Software", trust2: "100% Legal", trust3: "24-48h"
    },
    warning: {
      title: "⚠️ Wenn Sie nicht vor dem 2. März einreichen:",
      items: [
        "NRUA widerrufen = Keine Werbung auf Airbnb, Booking, VRBO möglich...",
        "Sie verlieren sofort Ihre Einnahmequelle",
        "Langer und teurer Prozess zur Wiederherstellung"
      ]
    },
    problem: {
      title: "😤 Das Problem: N2-Software",
      subtitle: "Die Regierung verlangt eine Software, die NUR auf Windows funktioniert",
      items: [
        "Funktioniert nur auf Windows (nicht auf Mac)",
        "N2-Software herunterladen und installieren",
        "NRUA- und CRU-Codes verstehen",
        "XBRL-Dateien generieren",
        "Digitales Zertifikat erforderlich",
        "Unverständliche Fehler"
      ]
    },
    solution: {
      title: "😊 Unsere Lösung: Sie laden hoch, wir reichen ein",
      items: [
        "Funktioniert von jedem Gerät",
        "CSV von Airbnb/Booking herunterladen (2 Min)",
        "An uns senden und wir machen alles",
        "Ohne digitales Zertifikat",
        "Offizielle Bescheinigung in 24-48h"
      ]
    },
    howItWorks: {
      title: "Wie funktioniert es?",
      subtitle: "3 Schritte und fertig. Dauert 5 Minuten.",
      step1: "Verlauf herunterladen",
      step1desc: "Gehen Sie zu Airbnb oder Booking und laden Sie die 2025 Reservierungen als CSV herunter.",
      step2: "Hochladen und bezahlen",
      step2desc: "Füllen Sie Ihre Daten aus, laden Sie die Datei hoch und bezahlen Sie sicher.",
      step3: "Bescheinigung erhalten",
      step3desc: "In 24-48h senden wir Ihnen die offizielle Bescheinigung per E-Mail."
    },
    download: {
      title: "📥 Wie lade ich meine Reservierungen herunter?",
      airbnb: {
        title: "Von Airbnb:",
        steps: ["Gehen Sie zu airbnb.com → Ihr Konto", "Gehen Sie zu 'Transaktionsverlauf'", "Klicken Sie auf 'CSV exportieren'", "Speichern Sie die Datei"]
      },
      booking: {
        title: "Von Booking:",
        steps: ["Gehen Sie zum Booking Extranet", "Gehen Sie zu 'Reservierungen' → 'Verlauf'", "Klicken Sie auf 'Exportieren'", "Speichern Sie die CSV-Datei"]
      },
      other: "Sie nutzen VRBO oder andere? Laden Sie das PDF oder den Buchungsbericht herunter und laden Sie es hoch.",
      noFile: "Keine Datei? Kein Problem, Sie können die Aufenthalte auch manuell im Formular eingeben."
    },
    pricing: {
      title: "Klare Preise",
      note: "* Registergebühren nicht enthalten",
      plans: [
        { name: "1 Immobilie", price: "79€", features: ["1 NRUA", "Offizielle Einreichung", "Bescheinigung", "E-Mail-Support", "48h Lieferung"] },
        { name: "3 Immobilien", price: "199€", period: "sparen 38€", features: ["Bis zu 3 NRUA", "Offizielle Einreichung", "Bescheinigung", "Prioritäts-Support", "24h Lieferung"], popular: true },
        { name: "10 Immobilien", price: "449€", period: "sparen 341€", features: ["Bis zu 10 NRUA", "Vollständige Verwaltung", "Telefon-Support", "Prioritäts-Lieferung"] }
      ],
      select: "Auswählen",
      popular: "Am beliebtesten"
    },
    faq: {
      title: "FAQ",
      items: [
        { q: "Was ist NRUA?", a: "Es ist die einheitliche Vermietungsregistrierungsnummer. Wenn Sie auf Airbnb, Booking oder anderen Plattformen vermieten, müssen Sie jährlich alle Aufenthalte melden. Frist: 2. März." },
        { q: "Was passiert, wenn ich nicht einreiche?", a: "Ihr NRUA wird widerrufen. Sie können Ihre Immobilie auf keiner Plattform mehr bewerben. Sie verlieren Ihr Einkommen." },
        { q: "Ist es legal, dass Sie das machen?", a: "Ja, 100% legal. Die Vorschrift erlaubt die Einreichung durch Eigentümer oder Verwalter. Wir handeln als autorisierte Vertreter." },
        { q: "Welche Daten brauchen Sie?", a: "Ihren NRUA-Code (auf Ihrer Lizenz) und den 2025 Reservierungsverlauf (CSV von Airbnb oder Booking)." },
        { q: "Was wenn ich 2025 keine Vermietungen hatte?", a: "Trotzdem einreichen mit 'keine Aktivität'. Wir kümmern uns darum." }
      ]
    },
    cta: {
      title: "Verlieren Sie nicht Ihre Lizenz",
      subtitle: "Nur noch wenige Tage. Reichen Sie Ihr NRUA jetzt ein.",
      button: "Jetzt starten",
      daysLeft: "Tage verbleibend"
    },
    footer: {
      slogan: "Registerverfahren ohne Komplikationen",
      legal: "Rechtliches", legalNotice: "Impressum", privacy: "Datenschutz", cookies: "Cookies",
      contact: "Kontakt",
      copyright: "© 2026 DedosFácil. Alle Rechte vorbehalten.",
      cuentas: "Müssen Sie einen Jahresabschluss einreichen? ",
      cuentasLink: "Mehr Info"
    }
  }
}

function Landing() {
  const [lang, setLang] = useState('es')
  const [daysLeft, setDaysLeft] = useState(27)
  const t = translations[lang]

  useEffect(() => {
    const deadline = new Date('2026-03-02')
    const today = new Date()
    const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
    setDaysLeft(diff > 0 ? diff : 0)
    
    const browserLang = navigator.language.slice(0, 2)
    if (['es', 'en', 'fr', 'de'].includes(browserLang)) setLang(browserLang)
  }, [])

  return (
    <div className="landing">
      {/* Language Selector */}
      <div className="lang-selector">
        {['es', 'en', 'fr', 'de'].map(l => (
          <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>
            {l === 'es' ? '🇪🇸' : l === 'en' ? '🇬🇧' : l === 'fr' ? '🇫🇷' : '🇩🇪'}
          </button>
        ))}
      </div>

      {/* URGENT BANNER */}
      <div className="urgent-banner">
        <AlertTriangle size={20} />
        <span>
          {t.urgentBanner.text} <strong>{daysLeft} {t.urgentBanner.days}</strong> {t.urgentBanner.text2}
        </span>
        <a href="/formulario" className="banner-cta">{t.urgentBanner.cta}</a>
      </div>

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <span className="logo-icon">DF</span>
            <span className="logo-text">DedosFácil</span>
          </div>
          <nav className="nav">
            <a href="#como-funciona">{t.nav.howItWorks}</a>
            <a href="#precios">{t.nav.pricing}</a>
            <a href="#faq">{t.nav.faq}</a>
          </nav>
          <a href="/formulario" className="btn btn-primary">{t.nav.startNow}</a>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge urgent">
              <AlertTriangle size={16} />
              <span>{t.hero.badge} · {daysLeft} {t.urgentBanner.days}</span>
            </div>
            <h1>{t.hero.title} <span className="gradient-text">{t.hero.titleHighlight}</span></h1>
            <p className="hero-subtitle">{t.hero.subtitle}<strong>{t.hero.subtitleBold}</strong></p>
            <div className="hero-cta">
              <a href="/formulario" className="btn btn-primary btn-large btn-urgent">{t.hero.cta}<ArrowRight size={20} /></a>
              <span className="hero-price">{t.hero.priceFrom} <strong>79€</strong></span>
            </div>
            <div className="hero-trust">
              <div className="trust-item"><CheckCircle size={18} /><span>{t.hero.trust1}</span></div>
              <div className="trust-item"><Shield size={18} /><span>{t.hero.trust2}</span></div>
              <div className="trust-item"><Clock size={18} /><span>{t.hero.trust3}</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card urgent-card">
              <div className="card-header"><X size={12} className="card-dot red" /><X size={12} className="card-dot yellow" /><X size={12} className="card-dot green" /></div>
              <div className="card-content">
                <div className="card-icon"><Home size={48} /></div>
                <div className="card-status"><Check size={24} className="status-check" /><span>NRUA ✓</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-bg"></div>
      </section>

      {/* Warning */}
      <section className="warning-section">
        <div className="container">
          <div className="warning-box">
            <AlertTriangle size={32} />
            <div className="warning-content">
              <h3>{t.warning.title}</h3>
              <ul>{t.warning.items.map((item, i) => (<li key={i}><X size={16} />{item}</li>))}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="problem-solution">
        <div className="container">
          <div className="comparison">
            <div className="comparison-item problem">
              <h3>{t.problem.title}</h3>
              <p className="problem-subtitle">{t.problem.subtitle}</p>
              <ul>{t.problem.items.map((item, i) => (<li key={i}><X size={18} />{item}</li>))}</ul>
            </div>
            <div className="comparison-item solution">
              <h3>{t.solution.title}</h3>
              <ul>{t.solution.items.map((item, i) => (<li key={i}><Check size={18} />{item}</li>))}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works" id="como-funciona">
        <div className="container">
          <h2>{t.howItWorks.title}</h2>
          <p className="section-subtitle">{t.howItWorks.subtitle}</p>
          <div className="steps">
            <div className="step"><div className="step-number">1</div><div className="step-icon"><Download size={32} /></div><h3>{t.howItWorks.step1}</h3><p>{t.howItWorks.step1desc}</p></div>
            <div className="step-arrow">→</div>
            <div className="step"><div className="step-number">2</div><div className="step-icon"><Upload size={32} /></div><h3>{t.howItWorks.step2}</h3><p>{t.howItWorks.step2desc}</p></div>
            <div className="step-arrow">→</div>
            <div className="step"><div className="step-number">3</div><div className="step-icon"><FileText size={32} /></div><h3>{t.howItWorks.step3}</h3><p>{t.howItWorks.step3desc}</p></div>
          </div>
        </div>
      </section>

      {/* Download Instructions */}
      <section className="download-section">
        <div className="container">
          <h2>{t.download.title}</h2>
          <div className="download-cards">
            <div className="download-card">
              <h4>{t.download.airbnb.title}</h4>
              <ol>{t.download.airbnb.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
            </div>
            <div className="download-card">
              <h4>{t.download.booking.title}</h4>
              <ol>{t.download.booking.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
            </div>
          </div>
          <p className="download-other">{t.download.other}</p>
          <p className="download-note">{t.download.noFile}</p>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="precios">
        <div className="container">
          <h2>{t.pricing.title}</h2>
          <div className="pricing-cards">
            {t.pricing.plans.map((plan, i) => (
              <div key={i} className={`pricing-card ${plan.popular ? 'featured' : ''}`}>
                {plan.popular && <div className="popular-badge">{t.pricing.popular}</div>}
                <h3>{plan.name}</h3>
                <div className="price"><span className="amount">{plan.price}</span>{plan.period && <span className="period">{plan.period}</span>}</div>
                <ul>{plan.features.map((f, j) => (<li key={j}><Check size={18} />{f}</li>))}</ul>
                <a href="/formulario" className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>{t.pricing.select}</a>
              </div>
            ))}
          </div>
          <p className="pricing-note">{t.pricing.note}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="container">
          <h2>{t.faq.title}</h2>
          <div className="faq-list">
            {t.faq.items.map((item, i) => (
              <div key={i} className="faq-item">
                <div className="faq-question"><HelpCircle size={20} /><span>{item.q}</span></div>
                <p className="faq-answer">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-final urgent" id="empezar">
        <div className="container">
          <div className="cta-countdown"><span className="countdown-number">{daysLeft}</span><span className="countdown-label">{t.cta.daysLeft}</span></div>
          <h2>{t.cta.title}</h2>
          <p>{t.cta.subtitle}</p>
          <a href="/formulario" className="btn btn-primary btn-large">{t.cta.button}<ArrowRight size={20} /></a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand"><div className="logo"><span className="logo-icon">DF</span><span className="logo-text">DedosFácil</span></div><p>{t.footer.slogan}</p></div>
            <div className="footer-links"><h4>{t.footer.legal}</h4><a href="/aviso-legal">{t.footer.legalNotice}</a><a href="/privacidad">{t.footer.privacy}</a><a href="/cookies">{t.footer.cookies}</a></div>
            <div className="footer-contact"><h4>{t.footer.contact}</h4><a href="mailto:info@dedosfacil.es"><Mail size={16} />info@dedosfacil.es</a></div>
          </div>
          <div className="footer-bottom">
            <p>{t.footer.copyright}</p>
            <p className="footer-cuentas">{t.footer.cuentas}<a href="/cuentas-anuales">{t.footer.cuentasLink}</a></p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
