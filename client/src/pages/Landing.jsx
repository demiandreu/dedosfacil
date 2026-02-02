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

// ============================================
// TRANSLATIONS - 4 LANGUAGES
// ============================================
const translations = {
  // ==================== ESPAÑOL ====================
  es: {
    urgentBanner: {
      urgent: "⚠️ URGENTE:",
      only: "Solo quedan",
      days: "días",
      message: "para presentar el Depósito de Arrendamientos (NRUA).",
      consequence: "Si no lo haces, pierdes tu licencia de Airbnb/Booking.",
      cta: "Empezar ahora →"
    },
    nav: { services: "Servicios", howItWorks: "Cómo funciona", pricing: "Precios", faq: "FAQ", startNow: "Empezar ahora" },
    serviceTabs: { touristRental: "Alquiler Turístico", urgent: "¡URGENTE!", annualAccounts: "Cuentas Anuales", july: "Julio 2026" },
    nruaHero: {
      badge: "Plazo: 2 de marzo",
      title: "Presenta tu",
      titleHighlight: "Depósito de Arrendamientos",
      title2: "sin complicaciones",
      subtitle: "¿Tienes un piso en Airbnb o Booking? Estás obligado a presentar el informe anual de alquileres (NRUA).",
      subtitleBold: " Si no lo haces, te revocan la licencia.",
      cta: "Salvar mi licencia",
      priceFrom: "Desde",
      trust1: "Sin programa N2", trust2: "100% Legal", trust3: "24-48h entrega",
      cardStatus: "NRUA presentado"
    },
    cuentasHero: {
      badge: "Sin programa D2 · Sin instalaciones",
      title: "Deposita tus",
      titleHighlight: "Cuentas Anuales",
      title2: "en 10 minutos",
      subtitle: "Olvídate del programa D2 y sus complicaciones. Nosotros nos encargamos de todo. Tú solo subes tus datos y listo.",
      cta: "Empezar ahora",
      priceFrom: "Desde",
      trust1: "100% Legal", trust2: "Datos seguros", trust3: "24-48h entrega",
      cardStatus: "Cuentas depositadas"
    },
    warning: {
      title: "⚠️ Consecuencias de NO presentar:",
      items: [
        { bold: "Revocación del NRUA", text: " = No puedes anunciar en Airbnb, Booking, VRBO..." },
        { bold: "", text: "Pierdes tu fuente de ingresos inmediatamente" },
        { bold: "", text: "Proceso largo y costoso para recuperar la licencia" }
      ]
    },
    problem: {
      title: "😤 El problema",
      nrua: ["Descargar e instalar programa N2", "Entender códigos NRUA y CRU", "Introducir cada estancia manualmente", "Generar archivos XBRL", "Certificado digital obligatorio", "Errores incomprensibles"],
      cuentas: ["Descargar programa D2 (difícil de encontrar)", "Instalarlo en Windows", "Entender formularios complicados", "Certificado digital obligatorio", "Errores técnicos constantes", "Horas perdidas"]
    },
    solution: {
      title: "😊 Nuestra solución",
      items: ["Todo online, sin descargas", "Formulario simple", "No necesitas certificado digital", "Nosotros generamos todo", "Presentamos por ti", "Listo en 24-48 horas"]
    },
    howItWorks: {
      title: "¿Cómo funciona?",
      subtitle: "3 pasos simples y ya está",
      step1: "Envíanos tus datos",
      step1nrua: "Tu NRUA y las fechas de cada estancia (check-in, check-out, huéspedes).",
      step1cuentas: "Excel, PDF o rellena el formulario. Nuestra IA extrae los datos automáticamente.",
      step2: "Revisamos y preparamos",
      step2desc: "Verificamos que todo esté correcto y preparamos el archivo oficial.",
      step3: "Recibe el justificante",
      step3desc: "Presentamos en el Registro. En 24-48h tienes tu justificante oficial."
    },
    pricing: {
      title: "Precios claros, sin sorpresas",
      nruaSubtitle: "Depósito de Arrendamientos (NRUA)",
      cuentasSubtitle: "Depósito de Cuentas Anuales",
      popular: "Más popular",
      select: "Seleccionar",
      nruaNote: "* Tasas del Registro de la Propiedad no incluidas",
      cuentasNote: "* Las tasas del Registro Mercantil (65-85€) se pagan aparte",
      nrua: [
        { name: "1 Propiedad", price: "79€", period: "por depósito", features: ["1 CRU / NRUA", "Presentación en Registro", "Justificante oficial", "Soporte por email", "Entrega en 48h"] },
        { name: "Pack 3 Propiedades", price: "199€", period: "ahorra 38€", features: ["Hasta 3 propiedades", "Presentación en Registro", "Justificante oficial", "Soporte prioritario", "Entrega en 24h"], popular: true },
        { name: "Pack 10 Propiedades", price: "449€", period: "ahorra 341€", features: ["Hasta 10 propiedades", "Presentación en Registro", "Gestión completa", "Soporte telefónico", "Entrega prioritaria"] }
      ],
      cuentas: [
        { name: "Básico", price: "99€", period: "por depósito", features: ["Presentación en Registro Mercantil", "Justificante de depósito", "Soporte por email", "Entrega en 48h"] },
        { name: "Estándar", price: "149€", period: "por depósito", features: ["Todo lo del plan Básico", "Revisión por experto contable", "Corrección de errores", "Soporte prioritario", "Entrega en 24h"], popular: true },
        { name: "Urgente", price: "199€", period: "por depósito", features: ["Todo lo del plan Estándar", "Procesamiento inmediato", "Soporte telefónico", "Entrega el mismo día"] }
      ]
    },
    faq: {
      title: "Preguntas frecuentes",
      nrua: [
        { q: "¿Qué es el NRUA y por qué debo presentar esto?", a: "El NRUA (Número de Registro Único de Arrendamientos) es obligatorio desde 2025 para alquileres turísticos. Cada año debes informar de todas las estancias. Si no lo haces antes del 2 de marzo, te revocan el NRUA y no puedes anunciar en plataformas como Airbnb o Booking." },
        { q: "¿Qué datos necesito para presentar?", a: "Tu código NRUA, y por cada estancia del año 2025: fecha de entrada, fecha de salida, número de huéspedes y finalidad (vacacional, laboral, etc.)." },
        { q: "¿Podéis presentarlo por mí legalmente?", a: "Sí, 100% legal. La normativa permite que lo presente el titular \"o quien acredite la gestión del mismo\". Actuamos como gestores autorizados." },
        { q: "¿Qué pasa si mi piso no tuvo ningún alquiler en 2025?", a: "También debes presentar el depósito marcando \"sin actividad\". Nosotros nos encargamos de todo igualmente." }
      ],
      cuentas: [
        { q: "¿Es legal que presentéis las cuentas por mí?", a: "Sí, 100% legal. Actuamos como presentadores autorizados. El administrador de la sociedad firma el certificado de aprobación de cuentas." },
        { q: "¿Qué documentos necesito?", a: "Balance de situación, cuenta de pérdidas y ganancias, y memoria. Puedes subirlos en Excel o PDF." },
        { q: "¿Cuál es el plazo para presentar las cuentas?", a: "El plazo termina el 30 de julio para empresas con ejercicio cerrado a 31 de diciembre." },
        { q: "¿Qué pasa si el Registro encuentra errores?", a: "Nos encargamos de subsanar cualquier defecto sin coste adicional." }
      ]
    },
    cta: {
      daysLeft: "días restantes",
      nruaTitle: "No pierdas tu licencia de alquiler turístico",
      nruaSubtitle: "Presenta el Depósito de Arrendamientos antes del 2 de marzo",
      cuentasTitle: "¿Listo para olvidarte del D2?",
      cuentasSubtitle: "Empieza ahora y ten tus cuentas depositadas en 24-48 horas",
      button: "Empezar ahora"
    },
    footer: {
      slogan: "Trámites registrales sin complicaciones",
      services: "Servicios", service1: "Depósito Arrendamientos (NRUA)", service2: "Cuentas Anuales (D2)",
      legal: "Legal", legalNotice: "Aviso legal", privacy: "Política de privacidad", cookies: "Cookies",
      contact: "Contacto",
      copyright: "© 2026 DedosFácil. Todos los derechos reservados.",
      disclaimer: "Este servicio es de preparación y presentación documental. No somos el Registro Mercantil ni el Registro de la Propiedad."
    }
  },

  // ==================== ENGLISH ====================
  en: {
    urgentBanner: {
      urgent: "⚠️ URGENT:",
      only: "Only",
      days: "days left",
      message: "to submit the Short-Term Rental Declaration (NRUA).",
      consequence: "If you don't, you lose your Airbnb/Booking license.",
      cta: "Start now →"
    },
    nav: { services: "Services", howItWorks: "How it works", pricing: "Pricing", faq: "FAQ", startNow: "Start now" },
    serviceTabs: { touristRental: "Tourist Rental", urgent: "URGENT!", annualAccounts: "Annual Accounts", july: "July 2026" },
    nruaHero: {
      badge: "Deadline: March 2nd",
      title: "Submit your",
      titleHighlight: "Rental Declaration",
      title2: "hassle-free",
      subtitle: "Do you have a property on Airbnb or Booking in Spain? You must submit the annual rental report (NRUA).",
      subtitleBold: " If you don't, your license will be revoked.",
      cta: "Save my license",
      priceFrom: "From",
      trust1: "No N2 software", trust2: "100% Legal", trust3: "24-48h delivery",
      cardStatus: "NRUA submitted"
    },
    cuentasHero: {
      badge: "No D2 software · No installations",
      title: "File your",
      titleHighlight: "Annual Accounts",
      title2: "in 10 minutes",
      subtitle: "Forget about the D2 program and its complications. We take care of everything. You just upload your data.",
      cta: "Start now",
      priceFrom: "From",
      trust1: "100% Legal", trust2: "Secure data", trust3: "24-48h delivery",
      cardStatus: "Accounts filed"
    },
    warning: {
      title: "⚠️ Consequences of NOT filing:",
      items: [
        { bold: "NRUA Revocation", text: " = You cannot advertise on Airbnb, Booking, VRBO..." },
        { bold: "", text: "You lose your income source immediately" },
        { bold: "", text: "Long and expensive process to recover your license" }
      ]
    },
    problem: {
      title: "😤 The problem",
      nrua: ["Download and install N2 software", "Understand NRUA and CRU codes", "Enter each stay manually", "Generate XBRL files", "Digital certificate required", "Incomprehensible errors"],
      cuentas: ["Download D2 software (hard to find)", "Install it on Windows", "Understand complicated forms", "Digital certificate required", "Constant technical errors", "Hours wasted"]
    },
    solution: {
      title: "😊 Our solution",
      items: ["Everything online, no downloads", "Simple form", "No digital certificate needed", "We generate everything", "We submit for you", "Ready in 24-48 hours"]
    },
    howItWorks: {
      title: "How does it work?",
      subtitle: "3 simple steps and you're done",
      step1: "Send us your data",
      step1nrua: "Your NRUA and the dates of each stay (check-in, check-out, guests).",
      step1cuentas: "Excel, PDF or fill out the form. Our AI extracts the data automatically.",
      step2: "We review and prepare",
      step2desc: "We verify everything is correct and prepare the official file.",
      step3: "Receive your certificate",
      step3desc: "We submit to the Registry. In 24-48h you have your official certificate."
    },
    pricing: {
      title: "Clear pricing, no surprises",
      nruaSubtitle: "Short-Term Rental Declaration (NRUA)",
      cuentasSubtitle: "Annual Accounts Filing",
      popular: "Most popular",
      select: "Select",
      nruaNote: "* Property Registry fees not included",
      cuentasNote: "* Commercial Registry fees (€65-85) paid separately",
      nrua: [
        { name: "1 Property", price: "€79", period: "per filing", features: ["1 CRU / NRUA", "Registry submission", "Official certificate", "Email support", "48h delivery"] },
        { name: "3 Properties Pack", price: "€199", period: "save €38", features: ["Up to 3 properties", "Registry submission", "Official certificate", "Priority support", "24h delivery"], popular: true },
        { name: "10 Properties Pack", price: "€449", period: "save €341", features: ["Up to 10 properties", "Registry submission", "Full management", "Phone support", "Priority delivery"] }
      ],
      cuentas: [
        { name: "Basic", price: "€99", period: "per filing", features: ["Commercial Registry filing", "Filing certificate", "Email support", "48h delivery"] },
        { name: "Standard", price: "€149", period: "per filing", features: ["Everything in Basic", "Expert accountant review", "Error correction", "Priority support", "24h delivery"], popular: true },
        { name: "Urgent", price: "€199", period: "per filing", features: ["Everything in Standard", "Immediate processing", "Phone support", "Same day delivery"] }
      ]
    },
    faq: {
      title: "Frequently asked questions",
      nrua: [
        { q: "What is NRUA and why do I need to file this?", a: "The NRUA has been mandatory since 2025 for tourist rentals in Spain. Every year you must report all stays. If you don't do it before March 2nd, your NRUA is revoked." },
        { q: "What information do I need to file?", a: "Your NRUA code, and for each stay in 2025: check-in date, check-out date, number of guests, and purpose (vacation, work, etc.)." },
        { q: "Can you legally file it on my behalf?", a: "Yes, 100% legal. The regulations allow submission by the owner \"or whoever proves management of the property\"." },
        { q: "What if my property had no rentals in 2025?", a: "You still need to file the declaration marking \"no activity\". We take care of everything." }
      ],
      cuentas: [
        { q: "Is it legal for you to file the accounts for me?", a: "Yes, 100% legal. We act as authorized presenters. The company administrator signs the approval certificate." },
        { q: "What documents do I need?", a: "Balance sheet, profit and loss statement, and notes. You can upload them in Excel or PDF." },
        { q: "What is the deadline to file the accounts?", a: "The deadline is July 30th for companies with fiscal year ending December 31st." },
        { q: "What if the Registry finds errors?", a: "We take care of correcting any defects at no additional cost." }
      ]
    },
    cta: {
      daysLeft: "days remaining",
      nruaTitle: "Don't lose your tourist rental license",
      nruaSubtitle: "Submit the Rental Declaration before March 2nd",
      cuentasTitle: "Ready to forget about D2?",
      cuentasSubtitle: "Start now and have your accounts filed in 24-48 hours",
      button: "Start now"
    },
    footer: {
      slogan: "Registry procedures without hassle",
      services: "Services", service1: "Rental Declaration (NRUA)", service2: "Annual Accounts (D2)",
      legal: "Legal", legalNotice: "Legal notice", privacy: "Privacy policy", cookies: "Cookies",
      contact: "Contact",
      copyright: "© 2026 DedosFácil. All rights reserved.",
      disclaimer: "This is a document preparation and submission service. We are not the Commercial Registry or Property Registry."
    }
  },

  // ==================== FRANÇAIS ====================
  fr: {
    urgentBanner: {
      urgent: "⚠️ URGENT :",
      only: "Plus que",
      days: "jours",
      message: "pour déposer la Déclaration de Location (NRUA).",
      consequence: "Sinon, vous perdez votre licence Airbnb/Booking.",
      cta: "Commencer →"
    },
    nav: { services: "Services", howItWorks: "Comment ça marche", pricing: "Tarifs", faq: "FAQ", startNow: "Commencer" },
    serviceTabs: { touristRental: "Location Touristique", urgent: "URGENT !", annualAccounts: "Comptes Annuels", july: "Juillet 2026" },
    nruaHero: {
      badge: "Date limite : 2 mars",
      title: "Déposez votre",
      titleHighlight: "Déclaration de Location",
      title2: "sans complications",
      subtitle: "Vous avez un appartement sur Airbnb ou Booking en Espagne ? Vous devez déposer le rapport annuel (NRUA).",
      subtitleBold: " Sinon, votre licence sera révoquée.",
      cta: "Sauver ma licence",
      priceFrom: "À partir de",
      trust1: "Sans logiciel N2", trust2: "100% Légal", trust3: "Livraison 24-48h",
      cardStatus: "NRUA déposé"
    },
    cuentasHero: {
      badge: "Sans logiciel D2 · Sans installation",
      title: "Déposez vos",
      titleHighlight: "Comptes Annuels",
      title2: "en 10 minutes",
      subtitle: "Oubliez le programme D2 et ses complications. Nous nous occupons de tout.",
      cta: "Commencer",
      priceFrom: "À partir de",
      trust1: "100% Légal", trust2: "Données sécurisées", trust3: "Livraison 24-48h",
      cardStatus: "Comptes déposés"
    },
    warning: {
      title: "⚠️ Conséquences de NE PAS déposer :",
      items: [
        { bold: "Révocation du NRUA", text: " = Impossible de publier sur Airbnb, Booking, VRBO..." },
        { bold: "", text: "Vous perdez votre source de revenus immédiatement" },
        { bold: "", text: "Processus long et coûteux pour récupérer votre licence" }
      ]
    },
    problem: {
      title: "😤 Le problème",
      nrua: ["Télécharger et installer le logiciel N2", "Comprendre les codes NRUA et CRU", "Saisir chaque séjour manuellement", "Générer des fichiers XBRL", "Certificat numérique obligatoire", "Erreurs incompréhensibles"],
      cuentas: ["Télécharger le logiciel D2", "L'installer sur Windows", "Comprendre des formulaires compliqués", "Certificat numérique obligatoire", "Erreurs techniques constantes", "Des heures perdues"]
    },
    solution: {
      title: "😊 Notre solution",
      items: ["Tout en ligne, sans téléchargement", "Formulaire simple", "Pas besoin de certificat", "Nous générons tout", "Nous déposons pour vous", "Prêt en 24-48 heures"]
    },
    howItWorks: {
      title: "Comment ça marche ?",
      subtitle: "3 étapes simples et c'est fait",
      step1: "Envoyez-nous vos données",
      step1nrua: "Votre NRUA et les dates de chaque séjour (arrivée, départ, voyageurs).",
      step1cuentas: "Excel, PDF ou remplissez le formulaire. Notre IA extrait les données.",
      step2: "Nous vérifions et préparons",
      step2desc: "Nous vérifions que tout est correct et préparons le fichier officiel.",
      step3: "Recevez votre certificat",
      step3desc: "Nous déposons au Registre. En 24-48h vous avez votre certificat."
    },
    pricing: {
      title: "Tarifs clairs, sans surprises",
      nruaSubtitle: "Déclaration de Location (NRUA)",
      cuentasSubtitle: "Dépôt des Comptes Annuels",
      popular: "Le plus populaire",
      select: "Sélectionner",
      nruaNote: "* Frais du Registre non inclus",
      cuentasNote: "* Frais du Registre du Commerce (65-85€) payés séparément",
      nrua: [
        { name: "1 Propriété", price: "79€", period: "par dépôt", features: ["1 CRU / NRUA", "Dépôt au Registre", "Certificat officiel", "Support email", "Livraison 48h"] },
        { name: "Pack 3 Propriétés", price: "199€", period: "économisez 38€", features: ["Jusqu'à 3 propriétés", "Dépôt au Registre", "Certificat officiel", "Support prioritaire", "Livraison 24h"], popular: true },
        { name: "Pack 10 Propriétés", price: "449€", period: "économisez 341€", features: ["Jusqu'à 10 propriétés", "Dépôt au Registre", "Gestion complète", "Support téléphonique", "Livraison prioritaire"] }
      ],
      cuentas: [
        { name: "Basique", price: "99€", period: "par dépôt", features: ["Dépôt au Registre du Commerce", "Certificat de dépôt", "Support email", "Livraison 48h"] },
        { name: "Standard", price: "149€", period: "par dépôt", features: ["Tout du plan Basique", "Révision comptable", "Correction des erreurs", "Support prioritaire", "Livraison 24h"], popular: true },
        { name: "Urgent", price: "199€", period: "par dépôt", features: ["Tout du plan Standard", "Traitement immédiat", "Support téléphonique", "Livraison le jour même"] }
      ]
    },
    faq: {
      title: "Questions fréquentes",
      nrua: [
        { q: "Qu'est-ce que le NRUA ?", a: "Le NRUA est obligatoire depuis 2025 pour les locations touristiques en Espagne. Si vous ne déposez pas avant le 2 mars, votre licence est révoquée." },
        { q: "Quelles informations dois-je fournir ?", a: "Votre code NRUA, et pour chaque séjour : dates d'arrivée/départ, nombre de voyageurs et motif." },
        { q: "Pouvez-vous déposer légalement pour moi ?", a: "Oui, 100% légal. La réglementation permet le dépôt par le propriétaire ou son mandataire." },
        { q: "Et si je n'ai pas eu de locations en 2025 ?", a: "Vous devez quand même déposer en indiquant \"sans activité\"." }
      ],
      cuentas: [
        { q: "Est-ce légal que vous déposiez pour moi ?", a: "Oui, 100% légal. Nous agissons comme présentateurs autorisés." },
        { q: "Quels documents dois-je fournir ?", a: "Bilan, compte de résultat et annexe. En Excel ou PDF." },
        { q: "Quelle est la date limite ?", a: "Le 30 juillet pour les entreprises clôturant au 31 décembre." },
        { q: "Et si le Registre trouve des erreurs ?", a: "Nous corrigeons tout défaut sans frais supplémentaires." }
      ]
    },
    cta: {
      daysLeft: "jours restants",
      nruaTitle: "Ne perdez pas votre licence de location",
      nruaSubtitle: "Déposez la Déclaration avant le 2 mars",
      cuentasTitle: "Prêt à oublier D2 ?",
      cuentasSubtitle: "Commencez et ayez vos comptes déposés en 24-48h",
      button: "Commencer"
    },
    footer: {
      slogan: "Démarches sans complications",
      services: "Services", service1: "Déclaration Location (NRUA)", service2: "Comptes Annuels (D2)",
      legal: "Légal", legalNotice: "Mentions légales", privacy: "Confidentialité", cookies: "Cookies",
      contact: "Contact",
      copyright: "© 2026 DedosFácil. Tous droits réservés.",
      disclaimer: "Service de préparation de documents. Nous ne sommes pas le Registre du Commerce."
    }
  },

  // ==================== DEUTSCH ====================
  de: {
    urgentBanner: {
      urgent: "⚠️ DRINGEND:",
      only: "Nur noch",
      days: "Tage",
      message: "um die Vermietungserklärung (NRUA) einzureichen.",
      consequence: "Sonst verlieren Sie Ihre Airbnb/Booking-Lizenz.",
      cta: "Jetzt starten →"
    },
    nav: { services: "Dienste", howItWorks: "So funktioniert's", pricing: "Preise", faq: "FAQ", startNow: "Jetzt starten" },
    serviceTabs: { touristRental: "Ferienvermietung", urgent: "DRINGEND!", annualAccounts: "Jahresabschluss", july: "Juli 2026" },
    nruaHero: {
      badge: "Frist: 2. März",
      title: "Reichen Sie Ihre",
      titleHighlight: "Vermietungserklärung",
      title2: "problemlos ein",
      subtitle: "Haben Sie eine Immobilie auf Airbnb oder Booking in Spanien? Sie müssen den Jahresbericht (NRUA) einreichen.",
      subtitleBold: " Sonst wird Ihre Lizenz widerrufen.",
      cta: "Meine Lizenz retten",
      priceFrom: "Ab",
      trust1: "Ohne N2-Software", trust2: "100% Legal", trust3: "24-48h Lieferung",
      cardStatus: "NRUA eingereicht"
    },
    cuentasHero: {
      badge: "Ohne D2-Software · Keine Installation",
      title: "Reichen Sie Ihren",
      titleHighlight: "Jahresabschluss",
      title2: "in 10 Minuten ein",
      subtitle: "Vergessen Sie das D2-Programm. Wir kümmern uns um alles.",
      cta: "Jetzt starten",
      priceFrom: "Ab",
      trust1: "100% Legal", trust2: "Sichere Daten", trust3: "24-48h Lieferung",
      cardStatus: "Abschluss eingereicht"
    },
    warning: {
      title: "⚠️ Folgen bei NICHT-Einreichung:",
      items: [
        { bold: "NRUA-Widerruf", text: " = Keine Werbung auf Airbnb, Booking möglich..." },
        { bold: "", text: "Sie verlieren sofort Ihre Einnahmequelle" },
        { bold: "", text: "Langer und teurer Prozess zur Wiederherstellung" }
      ]
    },
    problem: {
      title: "😤 Das Problem",
      nrua: ["N2-Software herunterladen und installieren", "NRUA- und CRU-Codes verstehen", "Jeden Aufenthalt manuell eingeben", "XBRL-Dateien generieren", "Digitales Zertifikat erforderlich", "Unverständliche Fehler"],
      cuentas: ["D2-Software herunterladen", "Unter Windows installieren", "Komplizierte Formulare verstehen", "Digitales Zertifikat erforderlich", "Ständige technische Fehler", "Stunden verschwendet"]
    },
    solution: {
      title: "😊 Unsere Lösung",
      items: ["Alles online, kein Download", "Einfaches Formular", "Kein Zertifikat nötig", "Wir erstellen alles", "Wir reichen für Sie ein", "Fertig in 24-48 Stunden"]
    },
    howItWorks: {
      title: "Wie funktioniert es?",
      subtitle: "3 einfache Schritte und fertig",
      step1: "Senden Sie uns Ihre Daten",
      step1nrua: "Ihre NRUA und die Daten jedes Aufenthalts (Check-in, Check-out, Gäste).",
      step1cuentas: "Excel, PDF oder Formular ausfüllen. Unsere KI extrahiert die Daten.",
      step2: "Wir prüfen und bereiten vor",
      step2desc: "Wir prüfen alles und bereiten die offizielle Datei vor.",
      step3: "Erhalten Sie Ihre Bescheinigung",
      step3desc: "Wir reichen beim Register ein. In 24-48h haben Sie Ihre Bescheinigung."
    },
    pricing: {
      title: "Klare Preise, keine Überraschungen",
      nruaSubtitle: "Vermietungserklärung (NRUA)",
      cuentasSubtitle: "Jahresabschluss-Einreichung",
      popular: "Am beliebtesten",
      select: "Auswählen",
      nruaNote: "* Grundbuchgebühren nicht enthalten",
      cuentasNote: "* Handelsregistergebühren (65-85€) werden separat bezahlt",
      nrua: [
        { name: "1 Immobilie", price: "79€", period: "pro Einreichung", features: ["1 CRU / NRUA", "Registereinreichung", "Offizielle Bescheinigung", "E-Mail-Support", "48h Lieferung"] },
        { name: "3er-Paket", price: "199€", period: "sparen 38€", features: ["Bis zu 3 Immobilien", "Registereinreichung", "Offizielle Bescheinigung", "Prioritäts-Support", "24h Lieferung"], popular: true },
        { name: "10er-Paket", price: "449€", period: "sparen 341€", features: ["Bis zu 10 Immobilien", "Registereinreichung", "Vollständige Verwaltung", "Telefon-Support", "Prioritäts-Lieferung"] }
      ],
      cuentas: [
        { name: "Basis", price: "99€", period: "pro Einreichung", features: ["Handelsregister-Einreichung", "Einreichungsbescheinigung", "E-Mail-Support", "48h Lieferung"] },
        { name: "Standard", price: "149€", period: "pro Einreichung", features: ["Alles aus Basis", "Buchhalter-Prüfung", "Fehlerkorrektur", "Prioritäts-Support", "24h Lieferung"], popular: true },
        { name: "Dringend", price: "199€", period: "pro Einreichung", features: ["Alles aus Standard", "Sofortige Bearbeitung", "Telefon-Support", "Lieferung am selben Tag"] }
      ]
    },
    faq: {
      title: "Häufig gestellte Fragen",
      nrua: [
        { q: "Was ist NRUA?", a: "NRUA ist seit 2025 für Ferienvermietungen in Spanien obligatorisch. Ohne Einreichung bis 2. März wird Ihre Lizenz widerrufen." },
        { q: "Welche Informationen brauche ich?", a: "Ihren NRUA-Code und für jeden Aufenthalt: Check-in/Check-out-Daten, Gästezahl und Zweck." },
        { q: "Können Sie legal für mich einreichen?", a: "Ja, 100% legal. Die Vorschriften erlauben Einreichung durch den Eigentümer oder Verwalter." },
        { q: "Was wenn ich 2025 keine Vermietungen hatte?", a: "Sie müssen trotzdem einreichen und \"keine Aktivität\" angeben." }
      ],
      cuentas: [
        { q: "Ist es legal, dass Sie für mich einreichen?", a: "Ja, 100% legal. Wir handeln als autorisierte Einreicher." },
        { q: "Welche Dokumente brauche ich?", a: "Bilanz, Gewinn- und Verlustrechnung und Anhang. Als Excel oder PDF." },
        { q: "Was ist die Frist?", a: "Der 30. Juli für Unternehmen mit Geschäftsjahresende am 31. Dezember." },
        { q: "Was wenn das Register Fehler findet?", a: "Wir korrigieren alle Mängel ohne zusätzliche Kosten." }
      ]
    },
    cta: {
      daysLeft: "Tage verbleibend",
      nruaTitle: "Verlieren Sie nicht Ihre Ferienvermietungslizenz",
      nruaSubtitle: "Reichen Sie die Erklärung vor dem 2. März ein",
      cuentasTitle: "Bereit, D2 zu vergessen?",
      cuentasSubtitle: "Starten Sie und Ihr Abschluss ist in 24-48h eingereicht",
      button: "Jetzt starten"
    },
    footer: {
      slogan: "Registerverfahren ohne Komplikationen",
      services: "Dienste", service1: "Vermietungserklärung (NRUA)", service2: "Jahresabschluss (D2)",
      legal: "Rechtliches", legalNotice: "Impressum", privacy: "Datenschutz", cookies: "Cookies",
      contact: "Kontakt",
      copyright: "© 2026 DedosFácil. Alle Rechte vorbehalten.",
      disclaimer: "Dokumentenvorbereitungsservice. Wir sind nicht das Handelsregister."
    }
  }
}

// ============================================
// MAIN COMPONENT
// ============================================
function Landing() {
  const [lang, setLang] = useState('es')
  const [activeService, setActiveService] = useState('nrua')
  const [daysLeft, setDaysLeft] = useState(28)
  
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
          <strong>{t.urgentBanner.urgent}</strong> {t.urgentBanner.only} <strong>{daysLeft} {t.urgentBanner.days}</strong> {t.urgentBanner.message} <strong>{t.urgentBanner.consequence}</strong>
        </span>
        <a href="#empezar" className="banner-cta">{t.urgentBanner.cta}</a>
      </div>

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <span className="logo-icon">DF</span>
            <span className="logo-text">DedosFácil</span>
          </div>
          <nav className="nav">
            <a href="#servicios">{t.nav.services}</a>
            <a href="#como-funciona">{t.nav.howItWorks}</a>
            <a href="#precios">{t.nav.pricing}</a>
            <a href="#faq">{t.nav.faq}</a>
          </nav>
          <a href="#empezar" className="btn btn-primary">{t.nav.startNow}</a>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="service-selector" id="servicios">
              <button className={`service-tab ${activeService === 'nrua' ? 'active urgent' : ''}`} onClick={() => setActiveService('nrua')}>
                <Home size={20} /><span>{t.serviceTabs.touristRental}</span><span className="tab-badge urgent">{t.serviceTabs.urgent}</span>
              </button>
              <button className={`service-tab ${activeService === 'cuentas' ? 'active' : ''}`} onClick={() => setActiveService('cuentas')}>
                <Building size={20} /><span>{t.serviceTabs.annualAccounts}</span><span className="tab-badge">{t.serviceTabs.july}</span>
              </button>
            </div>

            {activeService === 'nrua' ? (
              <>
                <div className="hero-badge urgent"><AlertTriangle size={16} /><span>{t.nruaHero.badge} · {daysLeft} {t.urgentBanner.days}</span></div>
                <h1>{t.nruaHero.title} <span className="gradient-text">{t.nruaHero.titleHighlight}</span> {t.nruaHero.title2}</h1>
                <p className="hero-subtitle">{t.nruaHero.subtitle}<strong>{t.nruaHero.subtitleBold}</strong></p>
                <div className="hero-cta">
                  <a href="#empezar" className="btn btn-primary btn-large btn-urgent">{t.nruaHero.cta}<ArrowRight size={20} /></a>
                  <span className="hero-price">{t.nruaHero.priceFrom} <strong>79€</strong></span>
                </div>
                <div className="hero-trust">
                  <div className="trust-item"><CheckCircle size={18} /><span>{t.nruaHero.trust1}</span></div>
                  <div className="trust-item"><Shield size={18} /><span>{t.nruaHero.trust2}</span></div>
                  <div className="trust-item"><Clock size={18} /><span>{t.nruaHero.trust3}</span></div>
                </div>
              </>
            ) : (
              <>
                <div className="hero-badge"><Zap size={16} /><span>{t.cuentasHero.badge}</span></div>
                <h1>{t.cuentasHero.title} <span className="gradient-text">{t.cuentasHero.titleHighlight}</span> {t.cuentasHero.title2}</h1>
                <p className="hero-subtitle">{t.cuentasHero.subtitle}</p>
                <div className="hero-cta">
                  <a href="#empezar" className="btn btn-primary btn-large">{t.cuentasHero.cta}<ArrowRight size={20} /></a>
                  <span className="hero-price">{t.cuentasHero.priceFrom} <strong>99€</strong></span>
                </div>
                <div className="hero-trust">
                  <div className="trust-item"><CheckCircle size={18} /><span>{t.cuentasHero.trust1}</span></div>
                  <div className="trust-item"><Shield size={18} /><span>{t.cuentasHero.trust2}</span></div>
                  <div className="trust-item"><Clock size={18} /><span>{t.cuentasHero.trust3}</span></div>
                </div>
              </>
            )}
          </div>
          <div className="hero-visual">
            <div className={`hero-card ${activeService === 'nrua' ? 'urgent-card' : ''}`}>
              <div className="card-header"><X size={12} className="card-dot red" /><X size={12} className="card-dot yellow" /><X size={12} className="card-dot green" /></div>
              <div className="card-content">
                <div className="card-icon">{activeService === 'nrua' ? <Home size={48} /> : <FileText size={48} />}</div>
                <div className="card-status"><Check size={24} className="status-check" /><span>{activeService === 'nrua' ? t.nruaHero.cardStatus : t.cuentasHero.cardStatus}</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-bg"></div>
      </section>

      {/* Warning - NRUA only */}
      {activeService === 'nrua' && (
        <section className="warning-section">
          <div className="container">
            <div className="warning-box">
              <AlertTriangle size={32} />
              <div className="warning-content">
                <h3>{t.warning.title}</h3>
                <ul>{t.warning.items.map((item, i) => (<li key={i}><X size={16} /><strong>{item.bold}</strong>{item.text}</li>))}</ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Problem / Solution */}
      <section className="problem-solution">
        <div className="container">
          <div className="comparison">
            <div className="comparison-item problem">
              <h3>{t.problem.title}</h3>
              <ul>{(activeService === 'nrua' ? t.problem.nrua : t.problem.cuentas).map((item, i) => (<li key={i}><X size={18} />{item}</li>))}</ul>
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
            <div className="step"><div className="step-number">1</div><div className="step-icon"><Upload size={32} /></div><h3>{t.howItWorks.step1}</h3><p>{activeService === 'nrua' ? t.howItWorks.step1nrua : t.howItWorks.step1cuentas}</p></div>
            <div className="step-arrow">→</div>
            <div className="step"><div className="step-number">2</div><div className="step-icon"><CheckCircle size={32} /></div><h3>{t.howItWorks.step2}</h3><p>{t.howItWorks.step2desc}</p></div>
            <div className="step-arrow">→</div>
            <div className="step"><div className="step-number">3</div><div className="step-icon"><FileText size={32} /></div><h3>{t.howItWorks.step3}</h3><p>{t.howItWorks.step3desc}</p></div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="pricing" id="precios">
        <div className="container">
          <h2>{t.pricing.title}</h2>
          <p className="section-subtitle">{activeService === 'nrua' ? t.pricing.nruaSubtitle : t.pricing.cuentasSubtitle}</p>
          <div className="pricing-cards">
            {(activeService === 'nrua' ? t.pricing.nrua : t.pricing.cuentas).map((plan, i) => (
              <div key={i} className={`pricing-card ${plan.popular ? 'featured' : ''}`}>
                {plan.popular && <div className="popular-badge">{t.pricing.popular}</div>}
                <h3>{plan.name}</h3>
                <div className="price"><span className="amount">{plan.price}</span><span className="period">{plan.period}</span></div>
                <ul>{plan.features.map((f, j) => (<li key={j}><Check size={18} />{f}</li>))}</ul>
                <a href="#empezar" className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}>{t.pricing.select}</a>
              </div>
            ))}
          </div>
          <p className="pricing-note">{activeService === 'nrua' ? t.pricing.nruaNote : t.pricing.cuentasNote}</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="container">
          <h2>{t.faq.title}</h2>
          <div className="faq-list">
            {(activeService === 'nrua' ? t.faq.nrua : t.faq.cuentas).map((item, i) => (
              <div key={i} className="faq-item">
                <div className="faq-question"><HelpCircle size={20} /><span>{item.q}</span></div>
                <p className="faq-answer">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className={`cta-final ${activeService === 'nrua' ? 'urgent' : ''}`} id="empezar">
        <div className="container">
          {activeService === 'nrua' && (<div className="cta-countdown"><span className="countdown-number">{daysLeft}</span><span className="countdown-label">{t.cta.daysLeft}</span></div>)}
          <h2>{activeService === 'nrua' ? t.cta.nruaTitle : t.cta.cuentasTitle}</h2>
          <p>{activeService === 'nrua' ? t.cta.nruaSubtitle : t.cta.cuentasSubtitle}</p>
          <a href="/formulario" className="btn btn-primary btn-large">{t.cta.button}<ArrowRight size={20} /></a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand"><div className="logo"><span className="logo-icon">DF</span><span className="logo-text">DedosFácil</span></div><p>{t.footer.slogan}</p></div>
            <div className="footer-links"><h4>{t.footer.services}</h4><a href="#" onClick={() => setActiveService('nrua')}>{t.footer.service1}</a><a href="#" onClick={() => setActiveService('cuentas')}>{t.footer.service2}</a></div>
            <div className="footer-links"><h4>{t.footer.legal}</h4><a href="/aviso-legal">{t.footer.legalNotice}</a><a href="/privacidad">{t.footer.privacy}</a><a href="/cookies">{t.footer.cookies}</a></div>
            <div className="footer-contact"><h4>{t.footer.contact}</h4><a href="mailto:info@dedosfacil.es"><Mail size={16} />info@dedosfacil.es</a></div>
          </div>
          <div className="footer-bottom"><p>{t.footer.copyright}</p><p className="disclaimer">{t.footer.disclaimer}</p></div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
