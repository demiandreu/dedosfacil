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
      text2: "para presentar el Modelo N2. Si no lo haces, pierdes tu licencia.",
      cta: "Empezar ahora →"
    },
    nav: { howItWorks: "Cómo funciona", pricing: "Precios", faq: "FAQ", startNow: "Empezar ahora" },
    hero: {
      badge: "Plazo límite: 2 de marzo",
      title: "Presenta tu Modelo N2",
      titleHighlight: "en 10 minutos",
      subtitle: "Cumple con el Depósito de Arrendamientos obligatorio antes del 2 de marzo.",
      subtitleBold: " Sin descargar programas. Sin certificado digital. Nosotros lo presentamos por ti.",
      cta: "Presentar ahora",
      priceFrom: "Desde",
      trust1: "Sin programa N2", trust2: "Sin certificado digital", trust3: "100% Legal", trust4: "24-48h"
    },
    warning: {
      title: "⚠️ Si no presentas el Modelo N2 antes del 2 de marzo:",
      items: [
        "Te revocan el NRUA = No puedes anunciar en Airbnb, Booking, VRBO...",
        "Pierdes tu fuente de ingresos inmediatamente",
        "Proceso largo y costoso para recuperar la licencia"
      ]
    },
    problem: {
      title: "😤 El problema: Hacerlo tú mismo",
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
      title: "😊 Con DedosFácil: Tú subes, nosotros presentamos",
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
      step1: "Descarga tu CSV",
      step1desc: "Exporta tus reservas de 2025 desde Airbnb o Booking.",
      step2: "Súbelo a DedosFácil",
      step2desc: "Rellena tus datos, sube el archivo y paga de forma segura.",
      step3: "Recibe tu justificante",
      step3desc: "En 24-48h te enviamos el comprobante oficial por email."
    },
    download: {
      title: "📥 ¿Cómo descargo mis reservas?",
      airbnb: {
        title: "Desde Airbnb:",
        steps: [
          "1. Entra en airbnb.com → Menú → Anuncios",
          "2. Haz clic en 'Reservas completadas'",
          "3. Filtra por año 2025",
          "4. Haz clic en 'Exportar'"
        ],
        url: "https://es-l.airbnb.com/hosting/reservations/completed"
      },
      booking: {
        title: "Desde Booking:",
        steps: [
          "1. Entra en Extranet de Booking",
          "2. Ve a 'Reservas' → busca reservas",
          "3. Filtra por fechas 2025",
          "4. Haz clic en 'Exportar'"
        ],
        url: "https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/search_reservations.html"
      },
      other: "¿Usas VRBO u otra plataforma? Descarga el CSV o Excel de reservas y súbelo igualmente.",
      noFile: "¿No tienes archivo? No te preocupes, puedes rellenar las estancias manualmente en el formulario."
    },
    pricing: {
      title: "Precios claros",
      note: "* Tasas del Registro (27€/NRUA) no incluidas",
   plans: [
        { name: "1 Propiedad", price: "79€", features: ["1 NRUA", "Presentación oficial", "Justificante", "Soporte email", "Entrega 48h"] },
        { name: "3 Propiedades", price: "199€", period: "ahorra 38€", features: ["Hasta 3 NRUA", "Presentación oficial", "Justificante", "Soporte prioritario", "Entrega 24h"], popular: true },
        { name: "10 Propiedades", price: "629€", period: "ahorra 161€", features: ["Hasta 10 NRUA", "Gestión completa", "Soporte telefónico", "Entrega prioritaria"] }
      ],
      select: "Seleccionar",
      popular: "Más popular"
    },
    reviews: {
      title: "Lo que dicen nuestros clientes",
      subtitle: "Valoraciones reales de propietarios como tú",
      noReviews: "Sé el primero en valorarnos",
      rating: "de 5"
    },
    faq: {
      title: "Preguntas frecuentes",
      items: [
        { q: "¿Qué es el Modelo N2?", a: "Es el Depósito de Arrendamientos obligatorio. Si tienes un NRUA (licencia para alquilar en Airbnb, Booking, etc.), debes presentar cada año un informe con todas las estancias. El plazo para 2025 es el 2 de marzo de 2026." },
        { q: "¿Qué pasa si no presento el Modelo N2?", a: "Te revocan el NRUA automáticamente. Esto significa que no puedes seguir anunciando tu piso en ninguna plataforma. Pierdes tu fuente de ingresos." },
        { q: "¿Es legal que lo hagáis vosotros?", a: "Sí, 100% legal. El artículo 10.4 del Real Decreto 1312/2024 permite que lo presente el titular o quien acredite la gestión del alquiler. Actuamos como gestores autorizados con tu autorización expresa." },
        { q: "¿Qué datos necesitáis?", a: "Tu número NRUA completo (el código largo que empieza por ES de la Ventanilla Única) y el historial de reservas de 2025 (CSV de Airbnb o Booking)." },
        { q: "¿Y si no tuve alquileres en 2025?", a: "También hay que presentar el Modelo N2 marcando 'sin actividad'. Si no lo haces, te revocan el NRUA igualmente. Nosotros nos encargamos." }
      ]
    },
    cta: {
      title: "No pierdas tu licencia",
      subtitle: "Quedan pocos días. Presenta tu Modelo N2 ahora.",
      button: "Empezar ahora",
      daysLeft: "días restantes"
    },
    footer: {
      slogan: "Presentación del Modelo N2 sin complicaciones",
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
      text2: "to submit Form N2. If you don't, you lose your license.",
      cta: "Start now →"
    },
    nav: { howItWorks: "How it works", pricing: "Pricing", faq: "FAQ", startNow: "Start now" },
    hero: {
      badge: "Deadline: March 2nd",
      title: "Submit your Form N2",
      titleHighlight: "in 10 minutes",
      subtitle: "Comply with the mandatory Rental Declaration before March 2nd.",
      subtitleBold: " No software to download. No digital certificate. We submit it for you.",
      cta: "Submit now",
      priceFrom: "From",
      trust1: "No N2 software", trust2: "No digital certificate", trust3: "100% Legal", trust4: "24-48h"
    },
    warning: {
      title: "⚠️ If you don't submit Form N2 before March 2nd:",
      items: [
        "NRUA revoked = You can't advertise on Airbnb, Booking, VRBO...",
        "You lose your income source immediately",
        "Long and expensive process to recover your license"
      ]
    },
    problem: {
      title: "😤 The problem: Doing it yourself",
      subtitle: "The Government requires you to use a program that ONLY works on Windows",
      items: [
        "Only works on Windows (Mac users can't)",
        "Download and install N2 software",
        "Understand NRUA and CRU codes",
        "Generate XBRL files",
        "Digital certificate required",
        "Incomprehensible errors"
      ]
    },
    solution: {
      title: "😊 With DedosFácil: You upload, we submit",
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
      step1: "Download your CSV",
      step1desc: "Export your 2025 reservations from Airbnb or Booking.",
      step2: "Upload to DedosFácil",
      step2desc: "Fill in your details, upload the file and pay securely.",
      step3: "Receive your certificate",
      step3desc: "In 24-48h we send you the official receipt by email."
    },
    download: {
      title: "📥 How do I download my reservations?",
      airbnb: {
        title: "From Airbnb:",
        steps: [
          "1. Go to airbnb.com → Menu → Listings",
          "2. Click 'Completed reservations'",
          "3. Filter by year 2025",
          "4. Click 'Export'"
        ],
        url: "https://es-l.airbnb.com/hosting/reservations/completed"
      },
      booking: {
        title: "From Booking:",
        steps: [
          "1. Go to Booking Extranet",
          "2. Go to 'Reservations' → search",
          "3. Filter by 2025 dates",
          "4. Click 'Export'"
        ],
        url: "https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/search_reservations.html"
      },
      other: "Using VRBO or another platform? Download the CSV or Excel with your reservations and upload it.",
      noFile: "No file? No worries, you can fill in stays manually in the form."
    },
    pricing: {
      title: "Clear pricing",
      note: "* Registry fees (27€/NRUA) not included",
      plans: [
     { name: "1 Immobilie", price: "79€", features: ["1 NRUA", "Offizielle Einreichung", "Bescheinigung", "E-Mail-Support", "Lieferung 48h"] },
        { name: "3 Immobilien", price: "199€", period: "sparen Sie 38€", features: ["Bis zu 3 NRUA", "Offizielle Einreichung", "Bescheinigung", "Prioritäts-Support", "Lieferung 24h"], popular: true },
        { name: "10 Immobilien", price: "629€", period: "sparen Sie 161€", features: ["Bis zu 10 NRUA", "Komplette Verwaltung", "Telefon-Support", "Priori
      ],
      select: "Select",
      popular: "Most popular"
    },
    reviews: {
      title: "What our customers say",
      subtitle: "Real reviews from property owners like you",
      noReviews: "Be the first to review us",
      rating: "out of 5"
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        { q: "What is Form N2?", a: "It's the mandatory Rental Declaration. If you have an NRUA (license to rent on Airbnb, Booking, etc.), you must submit an annual report with all stays. The deadline for 2025 is March 2nd, 2026." },
        { q: "What happens if I don't submit Form N2?", a: "Your NRUA is automatically revoked. This means you can't advertise your property on any platform. You lose your income source." },
        { q: "Is it legal for you to do this?", a: "Yes, 100% legal. Article 10.4 of Royal Decree 1312/2024 allows submission by the owner or anyone who manages the rental. We act as authorized managers with your express authorization." },
        { q: "What data do you need?", a: "Your complete NRUA number (the long code starting with ES from the Single Window) and the 2025 reservation history (CSV from Airbnb or Booking)." },
        { q: "What if I had no rentals in 2025?", a: "You still need to submit Form N2 marking 'no activity'. If you don't, your NRUA is revoked anyway. We take care of it." }
      ]
    },
    cta: {
      title: "Don't lose your license",
      subtitle: "Few days left. Submit your Form N2 now.",
      button: "Start now",
      daysLeft: "days left"
    },
    footer: {
      slogan: "Form N2 submission without complications",
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
      text2: "pour déposer le Formulaire N2. Sinon, vous perdez votre licence.",
      cta: "Commencer →"
    },
    nav: { howItWorks: "Comment ça marche", pricing: "Tarifs", faq: "FAQ", startNow: "Commencer" },
    hero: {
      badge: "Date limite: 2 mars",
      title: "Déposez votre Formulaire N2",
      titleHighlight: "en 10 minutes",
      subtitle: "Respectez le Dépôt de Locations obligatoire avant le 2 mars.",
      subtitleBold: " Sans télécharger de logiciel. Sans certificat numérique. Nous le déposons pour vous.",
      cta: "Déposer maintenant",
      priceFrom: "À partir de",
      trust1: "Sans logiciel N2", trust2: "Sans certificat numérique", trust3: "100% Légal", trust4: "24-48h"
    },
    warning: {
      title: "⚠️ Si vous ne déposez pas le Formulaire N2 avant le 2 mars:",
      items: [
        "NRUA révoqué = Vous ne pouvez plus publier sur Airbnb, Booking, VRBO...",
        "Vous perdez votre source de revenus immédiatement",
        "Processus long et coûteux pour récupérer votre licence"
      ]
    },
    problem: {
      title: "😤 Le problème: Le faire vous-même",
      subtitle: "Le Gouvernement vous oblige à utiliser un programme qui fonctionne UNIQUEMENT sur Windows",
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
      title: "😊 Avec DedosFácil: Vous téléchargez, nous déposons",
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
      subtitle: "3 étapes et c'est fait. Ça vous prend 5 minutes.",
      step1: "Téléchargez votre CSV",
      step1desc: "Exportez vos réservations 2025 depuis Airbnb ou Booking.",
      step2: "Téléchargez sur DedosFácil",
      step2desc: "Remplissez vos données, téléchargez le fichier et payez en toute sécurité.",
      step3: "Recevez votre certificat",
      step3desc: "En 24-48h nous vous envoyons le reçu officiel par email."
    },
    download: {
      title: "📥 Comment télécharger mes réservations?",
      airbnb: {
        title: "Depuis Airbnb:",
        steps: [
          "1. Allez sur airbnb.com → Menu → Annonces",
          "2. Cliquez sur 'Réservations terminées'",
          "3. Filtrez par année 2025",
          "4. Cliquez sur 'Exporter'"
        ],
        url: "https://es-l.airbnb.com/hosting/reservations/completed"
      },
      booking: {
        title: "Depuis Booking:",
        steps: [
          "1. Allez sur Extranet Booking",
          "2. Allez à 'Réservations' → rechercher",
          "3. Filtrez par dates 2025",
          "4. Cliquez sur 'Exporter'"
        ],
        url: "https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/search_reservations.html"
      },
      other: "Vous utilisez VRBO ou une autre plateforme? Téléchargez le CSV ou Excel de réservations.",
      noFile: "Pas de fichier? Pas de souci, vous pouvez saisir les séjours manuellement."
    },
    pricing: {
      title: "Tarifs clairs",
      note: "* Frais de Registre (27€/NRUA) non inclus",
     plans: [
        { name: "1 Propriété", price: "79€", features: ["1 NRUA", "Dépôt officiel", "Certificat", "Support email", "Livraison 48h"] },
        { name: "3 Propriétés", price: "199€", period: "économisez 38€", features: ["Jusqu'à 3 NRUA", "Dépôt officiel", "Certificat", "Support prioritaire", "Livraison 24h"], popular: true },
        { name: "10 Propriétés", price: "629€", period: "économisez 161€", features: ["Jusqu'à 10 NRUA", "Gestion complète", "Support téléphonique", "Livraison prioritaire"] }
      ],
      select: "Sélectionner",
      popular: "Le plus populaire"
    },
    reviews: {
      title: "Ce que disent nos clients",
      subtitle: "Avis réels de propriétaires comme vous",
      noReviews: "Soyez le premier à nous évaluer",
      rating: "sur 5"
    },
    faq: {
      title: "Questions fréquentes",
      items: [
        { q: "Qu'est-ce que le Formulaire N2?", a: "C'est le Dépôt de Locations obligatoire. Si vous avez un NRUA (licence pour louer sur Airbnb, Booking, etc.), vous devez soumettre un rapport annuel avec tous les séjours. La date limite pour 2025 est le 2 mars 2026." },
        { q: "Que se passe-t-il si je ne dépose pas le Formulaire N2?", a: "Votre NRUA est automatiquement révoqué. Cela signifie que vous ne pouvez plus publier votre propriété sur aucune plateforme. Vous perdez votre source de revenus." },
        { q: "Est-ce légal que vous le fassiez?", a: "Oui, 100% légal. L'article 10.4 du Décret Royal 1312/2024 permet le dépôt par le propriétaire ou toute personne qui gère la location. Nous agissons comme gestionnaires autorisés avec votre autorisation expresse." },
        { q: "Quelles données avez-vous besoin?", a: "Votre numéro NRUA complet (le long code commençant par ES du Guichet Unique) et l'historique des réservations 2025 (CSV d'Airbnb ou Booking)." },
        { q: "Et si je n'ai pas eu de locations en 2025?", a: "Vous devez quand même déposer le Formulaire N2 en indiquant 'sans activité'. Sinon, votre NRUA est révoqué de toute façon. Nous nous en occupons." }
      ]
    },
    cta: {
      title: "Ne perdez pas votre licence",
      subtitle: "Il reste peu de jours. Déposez votre Formulaire N2 maintenant.",
      button: "Commencer",
      daysLeft: "jours restants"
    },
    footer: {
      slogan: "Dépôt du Formulaire N2 sans complications",
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
      text2: "um Formular N2 einzureichen. Sonst verlieren Sie Ihre Lizenz.",
      cta: "Jetzt starten →"
    },
    nav: { howItWorks: "So funktioniert's", pricing: "Preise", faq: "FAQ", startNow: "Jetzt starten" },
    hero: {
      badge: "Frist: 2. März",
      title: "Reichen Sie Ihr Formular N2 ein",
      titleHighlight: "in 10 Minuten",
      subtitle: "Erfüllen Sie die obligatorische Mietmeldung vor dem 2. März.",
      subtitleBold: " Keine Software herunterladen. Kein digitales Zertifikat. Wir reichen es für Sie ein.",
      cta: "Jetzt einreichen",
      priceFrom: "Ab",
      trust1: "Ohne N2-Software", trust2: "Ohne digitales Zertifikat", trust3: "100% Legal", trust4: "24-48h"
    },
    warning: {
      title: "⚠️ Wenn Sie Formular N2 nicht vor dem 2. März einreichen:",
      items: [
        "NRUA widerrufen = Sie können nicht mehr auf Airbnb, Booking, VRBO inserieren...",
        "Sie verlieren sofort Ihre Einkommensquelle",
        "Langer und teurer Prozess zur Wiedererlangung Ihrer Lizenz"
      ]
    },
    problem: {
      title: "😤 Das Problem: Es selbst machen",
      subtitle: "Die Regierung verlangt ein Programm, das NUR unter Windows funktioniert",
      items: [
        "Funktioniert nur unter Windows (Mac-Nutzer können nicht)",
        "N2-Software herunterladen und installieren",
        "NRUA- und CRU-Codes verstehen",
        "XBRL-Dateien generieren",
        "Digitales Zertifikat erforderlich",
        "Unverständliche Fehler"
      ]
    },
    solution: {
      title: "😊 Mit DedosFácil: Sie laden hoch, wir reichen ein",
      items: [
        "Funktioniert von jedem Gerät",
        "CSV von Airbnb/Booking herunterladen (2 Min)",
        "Senden Sie es uns und wir erledigen alles",
        "Kein digitales Zertifikat nötig",
        "Offizielle Bescheinigung in 24-48h erhalten"
      ]
    },
    howItWorks: {
      title: "Wie funktioniert es?",
      subtitle: "3 Schritte und fertig. Dauert 5 Minuten.",
      step1: "CSV herunterladen",
      step1desc: "Exportieren Sie Ihre 2025-Buchungen von Airbnb oder Booking.",
      step2: "Bei DedosFácil hochladen",
      step2desc: "Füllen Sie Ihre Daten aus, laden Sie die Datei hoch und bezahlen Sie sicher.",
      step3: "Bescheinigung erhalten",
      step3desc: "In 24-48h senden wir Ihnen die offizielle Quittung per E-Mail."
    },
    download: {
      title: "📥 Wie lade ich meine Buchungen herunter?",
      airbnb: {
        title: "Von Airbnb:",
        steps: [
          "1. Gehen Sie zu airbnb.com → Menü → Inserate",
          "2. Klicken Sie auf 'Abgeschlossene Buchungen'",
          "3. Filtern Sie nach Jahr 2025",
          "4. Klicken Sie auf 'Exportieren'"
        ],
        url: "https://es-l.airbnb.com/hosting/reservations/completed"
      },
      booking: {
        title: "Von Booking:",
        steps: [
          "1. Gehen Sie zum Booking Extranet",
          "2. Gehen Sie zu 'Reservierungen' → suchen",
          "3. Filtern Sie nach 2025",
          "4. Klicken Sie auf 'Exportieren'"
        ],
        url: "https://admin.booking.com/hotel/hoteladmin/extranet_ng/manage/search_reservations.html"
      },
      other: "Sie nutzen VRBO oder eine andere Plattform? Laden Sie die CSV oder Excel mit Buchungen hoch.",
      noFile: "Keine Datei? Kein Problem, Sie können Aufenthalte manuell eingeben."
    },
    pricing: {
      title: "Klare Preise",
      note: "* Registergebühren (27€/NRUA) nicht enthalten",
    plans: [
        { name: "1 Immobilie", price: "79€", features: ["1 NRUA", "Offizielle Einreichung", "Bescheinigung", "E-Mail-Support", "Lieferung 48h"] },
        { name: "3 Immobilien", price: "199€", period: "sparen Sie 38€", features: ["Bis zu 3 NRUA", "Offizielle Einreichung", "Bescheinigung", "Prioritäts-Support", "Lieferung 24h"], popular: true },
        { name: "10 Immobilien", price: "629€", period: "sparen Sie 161€", features: ["Bis zu 10 NRUA", "Komplette Verwaltung", "Telefon-Support", "Prioritätslieferung"] }
      ],
      select: "Auswählen",
      popular: "Am beliebtesten"
    },
    reviews: {
      title: "Was unsere Kunden sagen",
      subtitle: "Echte Bewertungen von Eigentümern wie Ihnen",
      noReviews: "Seien Sie der Erste, der uns bewertet",
      rating: "von 5"
    },
    faq: {
      title: "Häufig gestellte Fragen",
      items: [
        { q: "Was ist Formular N2?", a: "Es ist die obligatorische Mietmeldung. Wenn Sie eine NRUA haben (Lizenz zur Vermietung auf Airbnb, Booking usw.), müssen Sie jährlich einen Bericht mit allen Aufenthalten einreichen. Die Frist für 2025 ist der 2. März 2026." },
        { q: "Was passiert, wenn ich Formular N2 nicht einreiche?", a: "Ihre NRUA wird automatisch widerrufen. Das bedeutet, Sie können Ihre Immobilie auf keiner Plattform mehr inserieren. Sie verlieren Ihre Einkommensquelle." },
        { q: "Ist es legal, dass Sie das machen?", a: "Ja, 100% legal. Artikel 10.4 des Königlichen Dekrets 1312/2024 erlaubt die Einreichung durch den Eigentümer oder jeden, der die Vermietung verwaltet. Wir handeln als autorisierte Verwalter mit Ihrer ausdrücklichen Genehmigung." },
        { q: "Welche Daten benötigen Sie?", a: "Ihre vollständige NRUA-Nummer (der lange Code, der mit ES beginnt, vom Einheitlichen Fenster) und den Buchungsverlauf 2025 (CSV von Airbnb oder Booking)." },
        { q: "Was, wenn ich 2025 keine Vermietungen hatte?", a: "Sie müssen trotzdem Formular N2 mit 'keine Aktivität' einreichen. Andernfalls wird Ihre NRUA trotzdem widerrufen. Wir kümmern uns darum." }
      ]
    },
    cta: {
      title: "Verlieren Sie nicht Ihre Lizenz",
      subtitle: "Nur noch wenige Tage. Reichen Sie jetzt Ihr Formular N2 ein.",
      button: "Jetzt starten",
      daysLeft: "Tage übrig"
    },
    footer: {
      slogan: "Formular N2 Einreichung ohne Komplikationen",
      legal: "Rechtliches", legalNotice: "Impressum", privacy: "Datenschutz", cookies: "Cookies",
      contact: "Kontakt",
      copyright: "© 2026 DedosFácil. Alle Rechte vorbehalten.",
      cuentas: "Müssen Sie Jahresabschlüsse einreichen? ",
      cuentasLink: "Mehr Info"
    }
  }
  
}

function Landing() {
  const [lang, setLang] = useState('es')
  const [daysLeft, setDaysLeft] = useState(27)
  const t = translations[lang]
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setReviews(data) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const deadline = new Date('2026-03-02')
    const today = new Date()
    const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
    setDaysLeft(diff > 0 ? diff : 0)
    
    const saved = localStorage.getItem('dedosfacil-lang')
    if (saved && ['es', 'en', 'fr', 'de'].includes(saved)) {
      setLang(saved)
    } else {
      const browserLang = navigator.language.slice(0, 2)
      if (['es', 'en', 'fr', 'de'].includes(browserLang)) setLang(browserLang)
    }
  }, [])

  const changeLang = (l) => {
    setLang(l)
    localStorage.setItem('dedosfacil-lang', l)
  }

  return (
    <div className="landing">
      {/* Language Selector */}
      <div className="lang-selector">
        {['es', 'en', 'fr', 'de'].map(l => (
          <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => changeLang(l)}>
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
  <div className="video-container">
    <iframe 
      width="100%" 
      height="315" 
      src="https://www.youtube.com/embed/ftETjWOIG5w" 
      title="Depósito de Arrendamientos - Registradores de España"
      frameBorder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowFullScreen
      style={{ borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
    ></iframe>
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

     {/* Reviews */}
      <section className="reviews-section" id="reviews">
        <div className="container">
          <h2>{t.reviews.title}</h2>
          <p className="section-subtitle">{t.reviews.subtitle}</p>
          {reviews.length > 0 ? (
            <>
              <div className="reviews-summary">
                <span className="reviews-avg">
                  {'⭐'.repeat(Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length))}
                </span>
                <span className="reviews-score">
                  {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} {t.reviews.rating}
                </span>
                <span className="reviews-count">({reviews.length})</span>
              </div>
              <div className="reviews-grid">
                {reviews.slice(0, 6).map((review, i) => (
                  <div key={i} className="review-card">
                    <div className="review-stars">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} style={{ fontSize: '18px' }}>{s <= review.rating ? '⭐' : '☆'}</span>
                      ))}
                    </div>
                    {review.comment && <p className="review-comment">"{review.comment}"</p>}
                    <div className="review-author">
                      <div className="review-avatar">{review.name?.charAt(0)?.toUpperCase() || '?'}</div>
                      <div>
                        <strong className="review-name">{review.name}</strong>
                        <span className="review-date">
                          {new Date(review.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="no-reviews">{t.reviews.noReviews}</p>
          )}
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
            <div className="footer-contact"><h4>{t.footer.contact}</h4><a href="mailto:support@dedosfacil.es"><Mail size={16} />support@dedosfacil.es</a></div>
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
