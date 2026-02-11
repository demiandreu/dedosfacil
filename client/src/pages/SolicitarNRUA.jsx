import React, { useState, useEffect } from 'react'
import { 
  ArrowRight, 
  ArrowLeft, 
  User, 
  Home, 
  CreditCard,
  FileText,
  Shield,
  CheckCircle,
  Mail,
  AlertTriangle
} from 'lucide-react'

const translations = {
  es: {
    title: "Solicitar número NRUA",
    subtitle: "Te ayudamos a obtener tu Número de Registro de Alquiler",
    steps: ["Tus datos", "Propiedad", "Autorización", "Pago"],
    hero: {
      badge: "Servicio de gestión NRUA",
      title: "¿No tienes número NRUA?",
      titleHighlight: "Nosotros lo gestionamos",
      subtitle: "Sin el NRUA no puedes presentar el Modelo N2 ni alquilar legalmente en plataformas como Airbnb o Booking.",
      subtitleBold: " Nosotros tramitamos la solicitud por ti ante el Registro de la Propiedad.",
      cta: "Solicitar NRUA",
      price: "149€",
      trust1: "Gestión completa", trust2: "Sin desplazamientos", trust3: "Entrega 5-10 días", trust4: "100% Legal"
    },
    step1: {
      title: "Datos del solicitante",
      subtitle: "Información del propietario o representante legal",
      personType: "Tipo de persona",
      personPhysical: "Persona física",
      personLegal: "Persona jurídica",
      name: "Nombre *",
      namePh: "Ej: Juan",
      surname: "Apellidos *",
      surnamePh: "Ej: García López",
      companyName: "Razón social *",
      companyNamePh: "Ej: Vacaciones Costa SL",
      idType: "Tipo de identificación *",
      idNumber: "Número de identificación *",
      idNumberPh: "Ej: X1234567A",
      country: "País de residencia *",
      countryPh: "Ej: España",
      address: "Dirección completa *",
      addressPh: "Calle, número, piso, puerta",
      postalCode: "Código postal *",
      postalCodePh: "Ej: 08001",
      province: "Provincia *",
      selectProvince: "Selecciona...",
      municipality: "Municipio *",
      municipalityPh: "Ej: Barcelona",
      email: "Correo electrónico *",
      emailPh: "tu@email.com",
      emailHelp: "A este email enviaremos tu número NRUA una vez obtenido",
      phone: "Teléfono de contacto en España *",
      phonePh: "+34 600 000 000"
    },
    step2: {
      title: "Datos de la propiedad",
      subtitle: "Información del inmueble que se destinará al alquiler",
      propertyAddress: "Dirección completa del inmueble *",
      propertyAddressPh: "Tipo de vía, nombre, número",
      propertyExtra: "Información adicional (portal, bloque, escalera, planta, puerta)",
      propertyExtraPh: "Ej: Bloque 2, Escalera A, 3º 2ª",
      propertyPostalCode: "Código postal *",
      propertyPostalCodePh: "Ej: 43840",
      propertyProvince: "Provincia *",
      propertyMunicipality: "Municipio *",
      propertyMunicipalityPh: "Ej: Salou",
      catastralRef: "Referencia catastral *",
      catastralRefPh: "Ej: 1234567AB1234C0001XY",
      catastralHelp: "Puedes consultarla en la Sede Electrónica del Catastro (sedecatastro.gob.es)",
      cru: "CRU (Código Registral Único) *",
      cruPh: "Consulta en el Registro de la Propiedad",
      cruHelp: "Es el código que identifica la finca en el Registro de la Propiedad. Si no lo conoces, déjalo en blanco y lo buscaremos nosotros.",
      unitType: "Tipo de unidad *",
      unitComplete: "Finca completa",
      unitRoom: "Habitación",
      category: "Categoría del arrendamiento *",
      categoryTourist: "Turístico",
      categoryNonTourist: "No turístico",
      residenceType: "Tipo de residencia del arrendador *",
      residencePrimary: "Principal",
      residenceSecondary: "Secundaria",
      residenceOther: "Otros",
      maxGuests: "Número máximo de arrendatarios *",
      maxGuestsPh: "Ej: 6",
      equipped: "¿La unidad cuenta con equipamiento adecuado según el Reglamento (UE) 2024/1028? *",
      equippedYes: "Sí",
      equippedNo: "No",
      hasLicense: "¿Tiene licencia turística de la CCAA? *",
      licenseNumber: "Número de licencia turística *",
      licenseNumberPh: "Ej: HUTT-012345",
      licenseHelp: "En Cataluña: HUTx-XXXXXX (HUTB, HUTT, HUTG, HUTL...)"
    },
    step3: {
      title: "Autorización de representación",
      subtitle: "Para presentar la solicitud ante el Registro de la Propiedad en tu nombre",
      authText: "Autorizo a",
     authPerson: "nuestra representante autorizada ante el Registro de la Propiedad",
      authText2: "para que, en mi nombre y representación, presente la solicitud de asignación del Número de Registro de Alquiler (NRUA) ante el Registro de la Propiedad correspondiente, conforme al Reglamento (UE) 2024/1028 del Parlamento Europeo y del Consejo.",
      authDetails: "Esta autorización incluye:",
      authItems: [
        "Presentar la solicitud y documentación necesaria ante el Registro de la Propiedad",
        "Recibir las comunicaciones relacionadas con la solicitud",
        "Realizar las gestiones necesarias hasta la obtención del número NRUA"
      ],
      authConfirm: "Confirmo que he leído y acepto esta autorización de representación *",
      gdprTitle: "Protección de datos",
      gdprText: "Acepto el tratamiento de mis datos personales por parte de Rental Connect Solutions Tmi y su representante autorizada, con la finalidad exclusiva de gestionar la solicitud del número NRUA ante el Registro de la Propiedad.",
      gdprLink: "política de privacidad",
      gdprConfirm: "Acepto el tratamiento de datos personales *"
    },
    step4: {
      title: "Resumen y pago",
      summary: "Resumen de tu solicitud",
      service: "Servicio",
      serviceName: "Solicitud de número NRUA",
      applicant: "Solicitante",
      property: "Dirección del inmueble",
      representative: "Representante",
     representativeName: "Representante autorizada de DedosFácil",
      total: "Total",
      price: "149€",
      includes: "Incluye gestión completa + tasas del Registro",
      termsLabel: "Acepto los",
      terms: "términos y condiciones",
      termsAnd: "y la",
      privacy: "política de privacidad",
      payBtn: "Pagar 149€",
      secure: "🔒 Pago seguro con Stripe",
      delivery: "Recibirás tu número NRUA en 5-10 días laborables",
      n2Upsell: "💡 Una vez obtengas tu NRUA, podremos presentar tu Modelo N2 desde 79€"
    },
    nav: { back: "Atrás", next: "Siguiente" },
    errors: { required: "Obligatorio", invalidEmail: "Email no válido" },
    whyNrua: {
      title: "¿Qué es el NRUA y por qué lo necesitas?",
      items: [
        { q: "Es tu licencia para alquilar", a: "El NRUA (Número de Registro Único de Alquiler) es obligatorio para anunciar tu vivienda en Airbnb, Booking, VRBO y cualquier plataforma de alquiler vacacional." },
        { q: "Obligatorio desde julio 2025", a: "Según el Reglamento (UE) 2024/1028, todas las viviendas de uso turístico deben tener un NRUA asignado por el Registro de la Propiedad." },
        { q: "Sin él no puedes alquilar legalmente", a: "Las plataformas están obligadas a verificar el NRUA. Sin número válido, no podrás publicar tu anuncio." },
        { q: "Además necesitas presentar el Modelo N2", a: "Una vez tengas el NRUA, cada año debes presentar el Modelo N2 con tus estancias. También te ayudamos con eso." }
      ]
    }
  },
  en: {
    title: "Request NRUA number",
    subtitle: "We help you get your Rental Registration Number",
    steps: ["Your info", "Property", "Authorization", "Payment"],
    hero: {
      badge: "NRUA management service",
      title: "Don't have an NRUA number?",
      titleHighlight: "We handle it for you",
      subtitle: "Without the NRUA you can't submit Form N2 or legally rent on platforms like Airbnb or Booking.",
      subtitleBold: " We process the application for you at the Property Registry.",
      cta: "Request NRUA",
      price: "€149",
      trust1: "Full management", trust2: "No travel needed", trust3: "Delivery 5-10 days", trust4: "100% Legal"
    },
    step1: {
      title: "Applicant details",
      subtitle: "Owner or legal representative information",
      personType: "Person type",
      personPhysical: "Individual",
      personLegal: "Company",
      name: "First name *",
      namePh: "E.g: John",
      surname: "Last name *",
      surnamePh: "E.g: Smith",
      companyName: "Company name *",
      companyNamePh: "E.g: Costa Holidays SL",
      idType: "ID type *",
      idNumber: "ID number *",
      idNumberPh: "E.g: X1234567A",
      country: "Country of residence *",
      countryPh: "E.g: Spain",
      address: "Full address *",
      addressPh: "Street, number, floor, door",
      postalCode: "Postal code *",
      postalCodePh: "E.g: 08001",
      province: "Province *",
      selectProvince: "Select...",
      municipality: "Municipality *",
      municipalityPh: "E.g: Barcelona",
      email: "Email *",
      emailPh: "your@email.com",
      emailHelp: "We'll send your NRUA number to this email once obtained",
      phone: "Phone number in Spain *",
      phonePh: "+34 600 000 000"
    },
    step2: {
      title: "Property details",
      subtitle: "Information about the property to be rented",
      propertyAddress: "Full property address *",
      propertyAddressPh: "Street type, name, number",
      propertyExtra: "Additional info (building, block, staircase, floor, door)",
      propertyExtraPh: "E.g: Block 2, Staircase A, 3rd 2nd",
      propertyPostalCode: "Postal code *",
      propertyPostalCodePh: "E.g: 43840",
      propertyProvince: "Province *",
      propertyMunicipality: "Municipality *",
      propertyMunicipalityPh: "E.g: Salou",
      catastralRef: "Cadastral reference *",
      catastralRefPh: "E.g: 1234567AB1234C0001XY",
      catastralHelp: "You can look it up at the Electronic Cadastre Office (sedecatastro.gob.es)",
      cru: "CRU (Unique Registry Code) *",
      cruPh: "Check at the Property Registry",
      cruHelp: "The code identifying the property in the Registry. If unknown, leave blank and we'll look it up.",
      unitType: "Unit type *",
      unitComplete: "Full property",
      unitRoom: "Room",
      category: "Rental category *",
      categoryTourist: "Tourist",
      categoryNonTourist: "Non-tourist",
      residenceType: "Landlord's residence type *",
      residencePrimary: "Primary",
      residenceSecondary: "Secondary",
      residenceOther: "Other",
      maxGuests: "Maximum number of tenants *",
      maxGuestsPh: "E.g: 6",
      equipped: "Is the unit adequately equipped per EU Regulation 2024/1028? *",
      equippedYes: "Yes",
      equippedNo: "No",
      hasLicense: "Do you have a tourist license from the regional government? *",
      licenseNumber: "Tourist license number *",
      licenseNumberPh: "E.g: HUTT-012345",
      licenseHelp: "In Catalonia: HUTx-XXXXXX (HUTB, HUTT, HUTG, HUTL...)"
    },
    step3: {
      title: "Authorization",
      subtitle: "To submit the application at the Property Registry on your behalf",
      authText: "I authorize",
     authPerson: "our authorized representative at the Property Registry",
      authText2: "to, on my behalf and representation, submit the application for the assignment of the Rental Registration Number (NRUA) at the corresponding Property Registry, in accordance with EU Regulation 2024/1028.",
      authDetails: "This authorization includes:",
      authItems: [
        "Submitting the application and necessary documentation at the Property Registry",
        "Receiving communications related to the application",
        "Carrying out the necessary procedures until the NRUA number is obtained"
      ],
      authConfirm: "I confirm that I have read and accept this authorization *",
      gdprTitle: "Data protection",
      gdprText: "I accept the processing of my personal data by Rental Connect Solutions Tmi and its authorized representative, solely for the purpose of managing the NRUA number application at the Property Registry.",
      gdprLink: "privacy policy",
      gdprConfirm: "I accept the data processing *"
    },
    step4: {
      title: "Summary and payment",
      summary: "Application summary",
      service: "Service",
      serviceName: "NRUA number application",
      applicant: "Applicant",
      property: "Property address",
      representative: "Representative",
      representativeName: "DedosFácil authorized representative",
      total: "Total",
      price: "€149",
      includes: "Includes full management + Registry fees",
      termsLabel: "I accept the",
      terms: "terms and conditions",
      termsAnd: "and the",
      privacy: "privacy policy",
      payBtn: "Pay €149",
      secure: "🔒 Secure payment with Stripe",
      delivery: "You'll receive your NRUA number in 5-10 business days",
      n2Upsell: "💡 Once you get your NRUA, we can submit your Form N2 from €79"
    },
    nav: { back: "Back", next: "Next" },
    errors: { required: "Required", invalidEmail: "Invalid email" },
    whyNrua: {
      title: "What is the NRUA and why do you need it?",
      items: [
        { q: "It's your license to rent", a: "The NRUA (Unique Rental Registration Number) is mandatory to list your property on Airbnb, Booking, VRBO and any vacation rental platform." },
        { q: "Mandatory since July 2025", a: "According to EU Regulation 2024/1028, all tourist properties must have an NRUA assigned by the Property Registry." },
        { q: "Without it you can't rent legally", a: "Platforms are required to verify the NRUA. Without a valid number, you won't be able to publish your listing." },
        { q: "You also need to file Form N2", a: "Once you have the NRUA, you must file Form N2 annually with your stays. We help with that too." }
      ]
    }
  },
  fr: {
    title: "Demander le numéro NRUA",
    subtitle: "Nous vous aidons à obtenir votre numéro d'enregistrement locatif",
    steps: ["Vos infos", "Propriété", "Autorisation", "Paiement"],
    hero: {
      badge: "Service de gestion NRUA",
      title: "Vous n'avez pas de numéro NRUA?",
      titleHighlight: "Nous nous en occupons",
      subtitle: "Sans le NRUA vous ne pouvez pas déposer le Formulaire N2 ni louer légalement sur Airbnb ou Booking.",
      subtitleBold: " Nous traitons la demande pour vous auprès du Registre de la Propriété.",
      cta: "Demander NRUA",
      price: "149€",
      trust1: "Gestion complète", trust2: "Sans déplacement", trust3: "Livraison 5-10 jours", trust4: "100% Légal"
    },
    step1: {
      title: "Données du demandeur",
      subtitle: "Informations du propriétaire ou représentant légal",
      personType: "Type de personne",
      personPhysical: "Personne physique",
      personLegal: "Personne morale",
      name: "Prénom *",
      namePh: "Ex: Jean",
      surname: "Nom *",
      surnamePh: "Ex: Dupont",
      companyName: "Raison sociale *",
      companyNamePh: "Ex: Vacances Costa SL",
      idType: "Type d'identification *",
      idNumber: "Numéro d'identification *",
      idNumberPh: "Ex: X1234567A",
      country: "Pays de résidence *",
      countryPh: "Ex: Espagne",
      address: "Adresse complète *",
      addressPh: "Rue, numéro, étage, porte",
      postalCode: "Code postal *",
      postalCodePh: "Ex: 08001",
      province: "Province *",
      selectProvince: "Sélectionnez...",
      municipality: "Commune *",
      municipalityPh: "Ex: Barcelone",
      email: "Email *",
      emailPh: "votre@email.com",
      emailHelp: "Nous enverrons votre numéro NRUA à cet email",
      phone: "Téléphone en Espagne *",
      phonePh: "+34 600 000 000"
    },
    step2: {
      title: "Données de la propriété",
      subtitle: "Informations sur le bien à louer",
      propertyAddress: "Adresse complète du bien *",
      propertyAddressPh: "Type de voie, nom, numéro",
      propertyExtra: "Infos complémentaires (bâtiment, bloc, escalier, étage, porte)",
      propertyExtraPh: "Ex: Bloc 2, Escalier A, 3ème 2ème",
      propertyPostalCode: "Code postal *",
      propertyPostalCodePh: "Ex: 43840",
      propertyProvince: "Province *",
      propertyMunicipality: "Commune *",
      propertyMunicipalityPh: "Ex: Salou",
      catastralRef: "Référence cadastrale *",
      catastralRefPh: "Ex: 1234567AB1234C0001XY",
      catastralHelp: "Consultable au Bureau Électronique du Cadastre (sedecatastro.gob.es)",
      cru: "CRU (Code Registral Unique) *",
      cruPh: "Consultez au Registre de la Propriété",
      cruHelp: "Le code identifiant le bien au Registre. Si inconnu, laissez vide et nous le rechercherons.",
      unitType: "Type d'unité *",
      unitComplete: "Bien complet",
      unitRoom: "Chambre",
      category: "Catégorie de location *",
      categoryTourist: "Touristique",
      categoryNonTourist: "Non touristique",
      residenceType: "Type de résidence du bailleur *",
      residencePrimary: "Principale",
      residenceSecondary: "Secondaire",
      residenceOther: "Autre",
      maxGuests: "Nombre maximum de locataires *",
      maxGuestsPh: "Ex: 6",
      equipped: "L'unité est-elle équipée selon le Règlement (UE) 2024/1028? *",
      equippedYes: "Oui",
      equippedNo: "Non",
      hasLicense: "Avez-vous une licence touristique régionale? *",
      licenseNumber: "Numéro de licence touristique *",
      licenseNumberPh: "Ex: HUTT-012345",
      licenseHelp: "En Catalogne: HUTx-XXXXXX (HUTB, HUTT, HUTG, HUTL...)"
    },
    step3: {
      title: "Autorisation de représentation",
      subtitle: "Pour déposer la demande au Registre de la Propriété en votre nom",
      authText: "J'autorise",
      authPerson: "Mme Sechina Irina",
      authText2: "à présenter, en mon nom et représentation, la demande d'attribution du Numéro d'Enregistrement Locatif (NRUA) au Registre de la Propriété correspondant, conformément au Règlement (UE) 2024/1028.",
      authDetails: "Cette autorisation comprend:",
      authItems: [
        "Déposer la demande et la documentation nécessaire au Registre",
        "Recevoir les communications liées à la demande",
        "Effectuer les démarches nécessaires jusqu'à l'obtention du NRUA"
      ],
      authConfirm: "Je confirme avoir lu et accepter cette autorisation *",
      gdprTitle: "Protection des données",
      gdprText: "J'accepte le traitement de mes données personnelles par Rental Connect Solutions Tmi et son représentant autorisé, dans le seul but de gérer la demande de NRUA.",
      gdprLink: "politique de confidentialité",
      gdprConfirm: "J'accepte le traitement des données *"
    },
    step4: {
      title: "Résumé et paiement",
      summary: "Résumé de votre demande",
      service: "Service",
      serviceName: "Demande de numéro NRUA",
      applicant: "Demandeur",
      property: "Adresse du bien",
      representative: "Représentant",
      representativeName: "Représentante autorisée de DedosFácil",
      total: "Total",
      price: "149€",
      includes: "Gestion complète + frais de Registre inclus",
      termsLabel: "J'accepte les",
      terms: "conditions générales",
      termsAnd: "et la",
      privacy: "politique de confidentialité",
      payBtn: "Payer 149€",
      secure: "🔒 Paiement sécurisé avec Stripe",
      delivery: "Vous recevrez votre NRUA en 5-10 jours ouvrables",
      n2Upsell: "💡 Une fois votre NRUA obtenu, nous pouvons déposer votre N2 dès 79€"
    },
    nav: { back: "Retour", next: "Suivant" },
    errors: { required: "Obligatoire", invalidEmail: "Email invalide" },
    whyNrua: {
      title: "Qu'est-ce que le NRUA et pourquoi en avez-vous besoin?",
      items: [
        { q: "C'est votre licence pour louer", a: "Le NRUA est obligatoire pour publier votre bien sur Airbnb, Booking, VRBO et toute plateforme de location." },
        { q: "Obligatoire depuis juillet 2025", a: "Selon le Règlement (UE) 2024/1028, tous les biens touristiques doivent avoir un NRUA." },
        { q: "Sans lui, pas de location légale", a: "Les plateformes doivent vérifier le NRUA. Sans numéro valide, impossible de publier." },
        { q: "Vous devez aussi déposer le N2", a: "Avec le NRUA, vous devez déposer le N2 chaque année. Nous vous aidons aussi." }
      ]
    }
  },
  de: {
    title: "NRUA-Nummer beantragen",
    subtitle: "Wir helfen Ihnen, Ihre Mietregistrierungsnummer zu erhalten",
    steps: ["Ihre Daten", "Immobilie", "Vollmacht", "Zahlung"],
    hero: {
      badge: "NRUA-Verwaltungsservice",
      title: "Keine NRUA-Nummer?",
      titleHighlight: "Wir kümmern uns darum",
      subtitle: "Ohne NRUA können Sie kein Formular N2 einreichen und nicht legal auf Airbnb oder Booking vermieten.",
      subtitleBold: " Wir bearbeiten den Antrag für Sie beim Grundbuchamt.",
      cta: "NRUA beantragen",
      price: "149€",
      trust1: "Komplette Verwaltung", trust2: "Keine Reisen nötig", trust3: "Lieferung 5-10 Tage", trust4: "100% Legal"
    },
    step1: {
      title: "Antragstellerdaten",
      subtitle: "Eigentümer oder gesetzlicher Vertreter",
      personType: "Personentyp",
      personPhysical: "Natürliche Person",
      personLegal: "Juristische Person",
      name: "Vorname *",
      namePh: "Z.B: Max",
      surname: "Nachname *",
      surnamePh: "Z.B: Mustermann",
      companyName: "Firmenname *",
      companyNamePh: "Z.B: Costa Urlaub GmbH",
      idType: "Ausweistyp *",
      idNumber: "Ausweisnummer *",
      idNumberPh: "Z.B: X1234567A",
      country: "Wohnsitzland *",
      countryPh: "Z.B: Spanien",
      address: "Vollständige Adresse *",
      addressPh: "Straße, Nummer, Etage, Tür",
      postalCode: "Postleitzahl *",
      postalCodePh: "Z.B: 08001",
      province: "Provinz *",
      selectProvince: "Auswählen...",
      municipality: "Gemeinde *",
      municipalityPh: "Z.B: Barcelona",
      email: "E-Mail *",
      emailPh: "ihre@email.com",
      emailHelp: "An diese E-Mail senden wir Ihre NRUA-Nummer",
      phone: "Telefon in Spanien *",
      phonePh: "+34 600 000 000"
    },
    step2: {
      title: "Immobiliendaten",
      subtitle: "Informationen zur Mietimmobilie",
      propertyAddress: "Vollständige Immobilienadresse *",
      propertyAddressPh: "Straßentyp, Name, Nummer",
      propertyExtra: "Zusatzinfo (Gebäude, Block, Treppe, Etage, Tür)",
      propertyExtraPh: "Z.B: Block 2, Treppe A, 3. OG rechts",
      propertyPostalCode: "Postleitzahl *",
      propertyPostalCodePh: "Z.B: 43840",
      propertyProvince: "Provinz *",
      propertyMunicipality: "Gemeinde *",
      propertyMunicipalityPh: "Z.B: Salou",
      catastralRef: "Katasterreferenz *",
      catastralRefPh: "Z.B: 1234567AB1234C0001XY",
      catastralHelp: "Nachschlagbar beim Elektronischen Katasteramt (sedecatastro.gob.es)",
      cru: "CRU (Einzigartiger Registercode) *",
      cruPh: "Beim Grundbuchamt nachfragen",
      cruHelp: "Der Code zur Identifizierung der Immobilie. Falls unbekannt, leer lassen.",
      unitType: "Einheitstyp *",
      unitComplete: "Gesamte Immobilie",
      unitRoom: "Zimmer",
      category: "Mietkategorie *",
      categoryTourist: "Touristisch",
      categoryNonTourist: "Nicht-touristisch",
      residenceType: "Wohnsitztyp des Vermieters *",
      residencePrimary: "Hauptwohnsitz",
      residenceSecondary: "Zweitwohnsitz",
      residenceOther: "Sonstiges",
      maxGuests: "Maximale Mieterzahl *",
      maxGuestsPh: "Z.B: 6",
      equipped: "Ist die Einheit gemäß EU-Verordnung 2024/1028 ausgestattet? *",
      equippedYes: "Ja",
      equippedNo: "Nein",
      hasLicense: "Haben Sie eine touristische Lizenz? *",
      licenseNumber: "Touristische Lizenznummer *",
      licenseNumberPh: "Z.B: HUTT-012345",
      licenseHelp: "In Katalonien: HUTx-XXXXXX (HUTB, HUTT, HUTG, HUTL...)"
    },
    step3: {
      title: "Vollmacht",
      subtitle: "Zur Antragstellung beim Grundbuchamt in Ihrem Namen",
      authText: "Ich bevollmächtige",
      authPerson: "unsere autorisierte Vertreterin beim Grundbuchamt",
      authText2: "in meinem Namen den Antrag auf Zuweisung der NRUA-Nummer beim Grundbuchamt einzureichen, gemäß EU-Verordnung 2024/1028.",
      authDetails: "Diese Vollmacht umfasst:",
      authItems: [
        "Einreichen des Antrags und der Dokumentation beim Grundbuchamt",
        "Empfang von Mitteilungen bezüglich des Antrags",
        "Durchführung aller Schritte bis zur Erhalt der NRUA-Nummer"
      ],
      authConfirm: "Ich bestätige, dass ich diese Vollmacht gelesen habe und akzeptiere *",
      gdprTitle: "Datenschutz",
      gdprText: "Ich akzeptiere die Verarbeitung meiner Daten durch Rental Connect Solutions Tmi zur Beantragung der NRUA-Nummer.",
      gdprLink: "Datenschutzrichtlinie",
      gdprConfirm: "Ich akzeptiere die Datenverarbeitung *"
    },
    step4: {
      title: "Zusammenfassung und Zahlung",
      summary: "Ihre Antragsübersicht",
      service: "Service",
      serviceName: "NRUA-Nummernantrag",
      applicant: "Antragsteller",
      property: "Immobilienadresse",
      representative: "Vertreterin",
      representativeName: "Autorisierte Vertreterin von DedosFácil",
      total: "Gesamt",
      price: "149€",
      includes: "Komplette Verwaltung + Registergebühren inklusive",
      termsLabel: "Ich akzeptiere die",
      terms: "Nutzungsbedingungen",
      termsAnd: "und die",
      privacy: "Datenschutzrichtlinie",
      payBtn: "149€ bezahlen",
      secure: "🔒 Sichere Zahlung mit Stripe",
      delivery: "Sie erhalten Ihre NRUA in 5-10 Werktagen",
      n2Upsell: "💡 Mit Ihrer NRUA können wir Ihr N2 ab 79€ einreichen"
    },
    nav: { back: "Zurück", next: "Weiter" },
    errors: { required: "Erforderlich", invalidEmail: "Ungültige E-Mail" },
    whyNrua: {
      title: "Was ist die NRUA und warum brauchen Sie sie?",
      items: [
        { q: "Ihre Vermietungslizenz", a: "Die NRUA ist obligatorisch für Inserate auf Airbnb, Booking, VRBO und allen Plattformen." },
        { q: "Pflicht seit Juli 2025", a: "Laut EU-Verordnung 2024/1028 müssen alle touristischen Immobilien eine NRUA haben." },
        { q: "Ohne sie kein legales Vermieten", a: "Plattformen müssen die NRUA prüfen. Ohne gültige Nummer kein Inserat." },
        { q: "Sie müssen auch das N2 einreichen", a: "Mit der NRUA müssen Sie jährlich das N2 einreichen. Dabei helfen wir auch." }
      ]
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

function SolicitarNRUA() {
  const [lang, setLang] = useState('es')
  const [step, setStep] = useState(0) // 0 = hero/info, 1-4 = form steps
  const [acceptAuth, setAcceptAuth] = useState(false)
  const [acceptGdpr, setAcceptGdpr] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [errors, setErrors] = useState({})
  const [personType, setPersonType] = useState('physical')
  const [hasLicense, setHasLicense] = useState('yes')

  const [form, setForm] = useState({
    name: '', surname: '', companyName: '',
    idType: 'NIE', idNumber: '',
    country: 'España', address: '', postalCode: '', province: '', municipality: '',
    email: '', phone: '',
    // Property
    propertyAddress: '', propertyExtra: '', propertyPostalCode: '',
    propertyProvince: '', propertyMunicipality: '',
    catastralRef: '', cru: '',
    unitType: 'complete', category: 'tourist',
    residenceType: 'secondary', maxGuests: '',
    equipped: 'yes', licenseNumber: ''
  })

  const t = translations[lang]

  useEffect(() => {
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

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  const validate = () => {
    const e = {}
    if (step === 1) {
      if (personType === 'physical') {
        if (!form.name.trim()) e.name = t.errors.required
        if (!form.surname.trim()) e.surname = t.errors.required
      } else {
        if (!form.companyName.trim()) e.companyName = t.errors.required
      }
      if (!form.idNumber.trim()) e.idNumber = t.errors.required
      if (!form.address.trim()) e.address = t.errors.required
      if (!form.postalCode.trim()) e.postalCode = t.errors.required
      if (!form.province) e.province = t.errors.required
      if (!form.municipality.trim()) e.municipality = t.errors.required
      if (!form.email.trim()) e.email = t.errors.required
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.errors.invalidEmail
      if (!form.phone.trim()) e.phone = t.errors.required
    }
    if (step === 2) {
      if (!form.propertyAddress.trim()) e.propertyAddress = t.errors.required
      if (!form.propertyPostalCode.trim()) e.propertyPostalCode = t.errors.required
      if (!form.propertyProvince) e.propertyProvince = t.errors.required
      if (!form.propertyMunicipality.trim()) e.propertyMunicipality = t.errors.required
      if (!form.catastralRef.trim()) e.catastralRef = t.errors.required
      if (!form.maxGuests.trim()) e.maxGuests = t.errors.required
      if (hasLicense === 'yes' && !form.licenseNumber.trim()) e.licenseNumber = t.errors.required
    }
    if (step === 3) {
      if (!acceptAuth) e.auth = t.errors.required
      if (!acceptGdpr) e.gdpr = t.errors.required
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (step === 0) { setStep(1); return }
    if (!validate()) return
    setStep(s => Math.min(s + 1, 4))
    window.scrollTo(0, 0)
  }

  const back = () => {
    setStep(s => Math.max(s - 1, 0))
    window.scrollTo(0, 0)
  }

  const handlePay = async () => {
    if (!acceptTerms) return
    try {
      const API = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${API}/api/create-checkout-nrua`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form,
          personType,
          hasLicense,
          lang,
          affiliateCode: localStorage.getItem('dedosfacil-ref') || null,
          affiliateDiscount: parseInt(localStorage.getItem('dedosfacil-ref-discount')) || null
        })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Error creating payment session')
    } catch (err) {
      console.error('Payment error:', err)
      alert('Error connecting to payment server')
    }
  }

  // Hero / Info page (step 0)
  if (step === 0) {
    return (
      <div className="landing solicitar-nrua-landing">
        {/* Language Selector */}
        <div className="lang-selector">
          {['es', 'en', 'fr', 'de'].map(l => (
            <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => changeLang(l)}>
              {l === 'es' ? '🇪🇸' : l === 'en' ? '🇬🇧' : l === 'fr' ? '🇫🇷' : '🇩🇪'}
            </button>
          ))}
        </div>

        {/* Header */}
        <header className="header">
          <div className="container">
            <div className="logo">
              <a href="/" style={{display:'flex',alignItems:'center',gap:'8px',textDecoration:'none',color:'inherit'}}>
                <span className="logo-icon">DF</span>
                <span className="logo-text">DedosFácil</span>
              </a>
            </div>
            <nav className="nav">
              <a href="/">{lang === 'es' ? 'Modelo N2' : lang === 'en' ? 'Form N2' : lang === 'fr' ? 'Formulaire N2' : 'Formular N2'}</a>
            </nav>
            <button className="btn btn-primary" onClick={() => setStep(1)}>
              {t.hero.cta} <ArrowRight size={18} />
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="hero">
          <div className="container">
            <div className="hero-content" style={{maxWidth:'700px'}}>
              <div className="hero-badge" style={{background:'#DBEAFE',color:'#1E40AF'}}>
                <Shield size={16} />
                <span>{t.hero.badge}</span>
              </div>
              <h1>{t.hero.title} <span className="gradient-text">{t.hero.titleHighlight}</span></h1>
              <p className="hero-subtitle">{t.hero.subtitle}<strong>{t.hero.subtitleBold}</strong></p>
              <div className="hero-cta">
                <button className="btn btn-primary btn-large" onClick={() => setStep(1)}>
                  {t.hero.cta} <ArrowRight size={20} />
                </button>
                <span className="hero-price"><strong>{t.hero.price}</strong></span>
              </div>
              <div className="hero-trust">
                <div className="trust-item"><CheckCircle size={18} /><span>{t.hero.trust1}</span></div>
                <div className="trust-item"><Shield size={18} /><span>{t.hero.trust2}</span></div>
                <div className="trust-item"><FileText size={18} /><span>{t.hero.trust3}</span></div>
                <div className="trust-item guarantee"><Shield size={18} /><span>{t.hero.trust4}</span></div>
              </div>
            </div>
            <div className="hero-bg"></div>
          </div>
        </section>

        {/* Why NRUA */}
        <section className="faq" id="faq">
          <div className="container">
            <h2>{t.whyNrua.title}</h2>
            <div className="faq-list">
              {t.whyNrua.items.map((item, i) => (
                <div key={i} className="faq-item">
                  <div className="faq-question"><AlertTriangle size={20} /><span>{item.q}</span></div>
                  <p className="faq-answer">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-final" style={{background:'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)'}}>
          <div className="container">
            <h2 style={{color:'white'}}>{t.hero.title.replace('?','')}</h2>
            <p style={{color:'rgba(255,255,255,0.9)'}}>{t.hero.subtitle}</p>
            <button className="btn btn-primary btn-large" style={{background:'white',color:'#1E40AF'}} onClick={() => setStep(1)}>
              {t.hero.cta} — {t.hero.price} <ArrowRight size={20} />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-brand">
                <div className="logo"><span className="logo-icon">DF</span><span className="logo-text">DedosFácil</span></div>
              </div>
              <div className="footer-links">
                <h4>Legal</h4>
                <a href="/aviso-legal">{lang === 'es' ? 'Aviso legal' : 'Legal notice'}</a>
                <a href="/privacidad">{lang === 'es' ? 'Privacidad' : 'Privacy'}</a>
                <a href="/cookies">Cookies</a>
              </div>
              <div className="footer-contact">
                <h4>{lang === 'es' ? 'Contacto' : 'Contact'}</h4>
                <a href="mailto:support@dedosfacil.es"><Mail size={16} />support@dedosfacil.es</a>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© 2026 DedosFácil. {lang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // Form steps (1-4)
  return (
    <div className="formulario-page solicitar-nrua-form">
      {/* Header */}
      <header className="form-header">
        <a href="/" className="logo">
          <span className="logo-icon">DF</span>
          <span className="logo-text">DedosFácil</span>
        </a>
        <div className="lang-mini">
          {['es', 'en', 'fr', 'de'].map(l => (
            <button key={l} className={`lang-btn-mini ${lang === l ? 'active' : ''}`} onClick={() => changeLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <div className="form-container">
        {/* Progress */}
        <div className="progress-bar">
          {t.steps.map((s, i) => (
            <div key={i} className={`progress-step ${step > i + 1 ? 'completed' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="step-dot">{step > i + 1 ? '✓' : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="form-card">
          {/* Step 1: Datos del solicitante */}
          {step === 1 && (
            <div className="form-step">
              <div className="step-header">
                <User size={32} className="step-icon" />
                <h2>{t.step1.title}</h2>
                <p>{t.step1.subtitle}</p>
              </div>
              <div className="form-fields">
                {/* Person Type */}
                <div className="form-group">
                  <label>{t.step1.personType}</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input type="radio" name="personType" checked={personType === 'physical'} onChange={() => setPersonType('physical')} />
                      <span>{t.step1.personPhysical}</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="personType" checked={personType === 'legal'} onChange={() => setPersonType('legal')} />
                      <span>{t.step1.personLegal}</span>
                    </label>
                  </div>
                </div>

                {personType === 'physical' ? (
                  <>
                    <div className="form-row">
                      <div className={`form-group ${errors.name ? 'error' : ''}`}>
                        <label>{t.step1.name}</label>
                        <input value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder={t.step1.namePh} />
                        {errors.name && <span className="error-msg">{errors.name}</span>}
                      </div>
                      <div className={`form-group ${errors.surname ? 'error' : ''}`}>
                        <label>{t.step1.surname}</label>
                        <input value={form.surname} onChange={e => updateForm('surname', e.target.value)} placeholder={t.step1.surnamePh} />
                        {errors.surname && <span className="error-msg">{errors.surname}</span>}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={`form-group ${errors.companyName ? 'error' : ''}`}>
                    <label>{t.step1.companyName}</label>
                    <input value={form.companyName} onChange={e => updateForm('companyName', e.target.value)} placeholder={t.step1.companyNamePh} />
                    {errors.companyName && <span className="error-msg">{errors.companyName}</span>}
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label>{t.step1.idType}</label>
                    <select value={form.idType} onChange={e => updateForm('idType', e.target.value)}>
                      <option value="NIF">NIF</option>
                      <option value="NIE">NIE</option>
                      <option value="Pasaporte">{lang === 'es' ? 'Pasaporte' : 'Passport'}</option>
                    </select>
                  </div>
                  <div className={`form-group ${errors.idNumber ? 'error' : ''}`}>
                    <label>{t.step1.idNumber}</label>
                    <input value={form.idNumber} onChange={e => updateForm('idNumber', e.target.value)} placeholder={t.step1.idNumberPh} />
                    {errors.idNumber && <span className="error-msg">{errors.idNumber}</span>}
                  </div>
                </div>

                <div className={`form-group ${errors.address ? 'error' : ''}`}>
                  <label>{t.step1.address}</label>
                  <input value={form.address} onChange={e => updateForm('address', e.target.value)} placeholder={t.step1.addressPh} />
                  {errors.address && <span className="error-msg">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className={`form-group ${errors.postalCode ? 'error' : ''}`}>
                    <label>{t.step1.postalCode}</label>
                    <input value={form.postalCode} onChange={e => updateForm('postalCode', e.target.value)} placeholder={t.step1.postalCodePh} />
                    {errors.postalCode && <span className="error-msg">{errors.postalCode}</span>}
                  </div>
                  <div className={`form-group ${errors.province ? 'error' : ''}`}>
                    <label>{t.step1.province}</label>
                    <select value={form.province} onChange={e => updateForm('province', e.target.value)}>
                      <option value="">{t.step1.selectProvince}</option>
                      {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {errors.province && <span className="error-msg">{errors.province}</span>}
                  </div>
                </div>

                <div className={`form-group ${errors.municipality ? 'error' : ''}`}>
                  <label>{t.step1.municipality}</label>
                  <input value={form.municipality} onChange={e => updateForm('municipality', e.target.value)} placeholder={t.step1.municipalityPh} />
                  {errors.municipality && <span className="error-msg">{errors.municipality}</span>}
                </div>

                <div className={`form-group ${errors.email ? 'error' : ''}`}>
                  <label>{t.step1.email}</label>
                  <input type="email" value={form.email} onChange={e => updateForm('email', e.target.value)} placeholder={t.step1.emailPh} />
                  <span className="help-text">{t.step1.emailHelp}</span>
                  {errors.email && <span className="error-msg">{errors.email}</span>}
                </div>

                <div className={`form-group ${errors.phone ? 'error' : ''}`}>
                  <label>{t.step1.phone}</label>
                  <input value={form.phone} onChange={e => updateForm('phone', e.target.value)} placeholder={t.step1.phonePh} />
                  {errors.phone && <span className="error-msg">{errors.phone}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Datos de la propiedad */}
          {step === 2 && (
            <div className="form-step">
              <div className="step-header">
                <Home size={32} className="step-icon" />
                <h2>{t.step2.title}</h2>
                <p>{t.step2.subtitle}</p>
              </div>
              <div className="form-fields">
                <div className={`form-group ${errors.propertyAddress ? 'error' : ''}`}>
                  <label>{t.step2.propertyAddress}</label>
                  <input value={form.propertyAddress} onChange={e => updateForm('propertyAddress', e.target.value)} placeholder={t.step2.propertyAddressPh} />
                  {errors.propertyAddress && <span className="error-msg">{errors.propertyAddress}</span>}
                </div>

                <div className="form-group">
                  <label>{t.step2.propertyExtra}</label>
                  <input value={form.propertyExtra} onChange={e => updateForm('propertyExtra', e.target.value)} placeholder={t.step2.propertyExtraPh} />
                </div>

                <div className="form-row">
                  <div className={`form-group ${errors.propertyPostalCode ? 'error' : ''}`}>
                    <label>{t.step2.propertyPostalCode}</label>
                    <input value={form.propertyPostalCode} onChange={e => updateForm('propertyPostalCode', e.target.value)} placeholder={t.step2.propertyPostalCodePh} />
                    {errors.propertyPostalCode && <span className="error-msg">{errors.propertyPostalCode}</span>}
                  </div>
                  <div className={`form-group ${errors.propertyProvince ? 'error' : ''}`}>
                    <label>{t.step2.propertyProvince}</label>
                    <select value={form.propertyProvince} onChange={e => updateForm('propertyProvince', e.target.value)}>
                      <option value="">{t.step1.selectProvince}</option>
                      {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {errors.propertyProvince && <span className="error-msg">{errors.propertyProvince}</span>}
                  </div>
                </div>

                <div className={`form-group ${errors.propertyMunicipality ? 'error' : ''}`}>
                  <label>{t.step2.propertyMunicipality}</label>
                  <input value={form.propertyMunicipality} onChange={e => updateForm('propertyMunicipality', e.target.value)} placeholder={t.step2.propertyMunicipalityPh} />
                  {errors.propertyMunicipality && <span className="error-msg">{errors.propertyMunicipality}</span>}
                </div>

                <div className={`form-group ${errors.catastralRef ? 'error' : ''}`}>
                  <label>{t.step2.catastralRef}</label>
                  <input value={form.catastralRef} onChange={e => updateForm('catastralRef', e.target.value)} placeholder={t.step2.catastralRefPh} />
                  <span className="help-text">{t.step2.catastralHelp}</span>
                  {errors.catastralRef && <span className="error-msg">{errors.catastralRef}</span>}
                </div>

                <div className="form-group">
                  <label>{t.step2.cru}</label>
                  <input value={form.cru} onChange={e => updateForm('cru', e.target.value)} placeholder={t.step2.cruPh} />
                  <span className="help-text">{t.step2.cruHelp}</span>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t.step2.unitType}</label>
                    <select value={form.unitType} onChange={e => updateForm('unitType', e.target.value)}>
                      <option value="complete">{t.step2.unitComplete}</option>
                      <option value="room">{t.step2.unitRoom}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t.step2.category}</label>
                    <select value={form.category} onChange={e => updateForm('category', e.target.value)}>
                      <option value="tourist">{t.step2.categoryTourist}</option>
                      <option value="non-tourist">{t.step2.categoryNonTourist}</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t.step2.residenceType}</label>
                    <select value={form.residenceType} onChange={e => updateForm('residenceType', e.target.value)}>
                      <option value="primary">{t.step2.residencePrimary}</option>
                      <option value="secondary">{t.step2.residenceSecondary}</option>
                      <option value="other">{t.step2.residenceOther}</option>
                    </select>
                  </div>
                  <div className={`form-group ${errors.maxGuests ? 'error' : ''}`}>
                    <label>{t.step2.maxGuests}</label>
                    <input type="number" min="1" max="50" value={form.maxGuests} onChange={e => updateForm('maxGuests', e.target.value)} placeholder={t.step2.maxGuestsPh} />
                    {errors.maxGuests && <span className="error-msg">{errors.maxGuests}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label>{t.step2.equipped}</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input type="radio" name="equipped" checked={form.equipped === 'yes'} onChange={() => updateForm('equipped', 'yes')} />
                      <span>{t.step2.equippedYes}</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="equipped" checked={form.equipped === 'no'} onChange={() => updateForm('equipped', 'no')} />
                      <span>{t.step2.equippedNo}</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>{t.step2.hasLicense}</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input type="radio" name="hasLicense" checked={hasLicense === 'yes'} onChange={() => setHasLicense('yes')} />
                      <span>{t.step2.equippedYes}</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="hasLicense" checked={hasLicense === 'no'} onChange={() => setHasLicense('no')} />
                      <span>{t.step2.equippedNo}</span>
                    </label>
                  </div>
                </div>

                {hasLicense === 'yes' && (
                  <div className={`form-group ${errors.licenseNumber ? 'error' : ''}`}>
                    <label>{t.step2.licenseNumber}</label>
                    <input value={form.licenseNumber} onChange={e => updateForm('licenseNumber', e.target.value)} placeholder={t.step2.licenseNumberPh} />
                    <span className="help-text">{t.step2.licenseHelp}</span>
                    {errors.licenseNumber && <span className="error-msg">{errors.licenseNumber}</span>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Autorización */}
          {step === 3 && (
            <div className="form-step">
              <div className="step-header">
                <FileText size={32} className="step-icon" />
                <h2>{t.step3.title}</h2>
                <p>{t.step3.subtitle}</p>
              </div>
              <div className="form-fields">
                <div className="authorization-document">
                  <div className="auth-doc-header">
                    <Shield size={24} />
                    <h3>{t.step3.title}</h3>
                  </div>
                  <div className="auth-doc-body">
                    <p>
                      {t.step3.authText} <strong>{t.step3.authPerson}</strong>, {t.step3.authText2}
                    </p>
                    <p className="auth-details-title"><strong>{t.step3.authDetails}</strong></p>
                    <ul className="auth-items-list">
                      {t.step3.authItems.map((item, i) => (
                        <li key={i}><CheckCircle size={16} /> {item}</li>
                      ))}
                    </ul>
                    <div className="auth-signatory">
                      <p><strong>{lang === 'es' ? 'Interesado/a:' : 'Applicant:'}</strong> {personType === 'physical' ? `${form.name} ${form.surname}` : form.companyName}</p>
                      <p><strong>{form.idType}:</strong> {form.idNumber}</p>
                      <p><strong>{lang === 'es' ? 'Fecha:' : 'Date:'}</strong> {new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-GB')}</p>
                    </div>
                  </div>
                </div>

                <div className={`form-group ${errors.auth ? 'error' : ''}`}>
                  <label className="checkbox-label authorization">
                    <input type="checkbox" checked={acceptAuth} onChange={e => setAcceptAuth(e.target.checked)} />
                    <span><strong>{t.step3.authConfirm}</strong></span>
                  </label>
                  {errors.auth && <span className="error-msg" style={{marginLeft:'32px'}}>{errors.auth}</span>}
                </div>

                <div className="gdpr-section">
                  <h4>{t.step3.gdprTitle}</h4>
                  <div className={`form-group ${errors.gdpr ? 'error' : ''}`}>
                    <label className="checkbox-label">
                      <input type="checkbox" checked={acceptGdpr} onChange={e => setAcceptGdpr(e.target.checked)} />
                      <span>{t.step3.gdprText} <a href="/privacidad">{t.step3.gdprLink}</a></span>
                    </label>
                    {errors.gdpr && <span className="error-msg" style={{marginLeft:'32px'}}>{errors.gdpr}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Resumen y pago */}
          {step === 4 && (
            <div className="form-step">
              <div className="step-header">
                <CreditCard size={32} className="step-icon" />
                <h2>{t.step4.title}</h2>
              </div>

              <div className="order-summary">
                <h4>{t.step4.summary}</h4>
                <div className="summary-row">
                  <span>{t.step4.service}:</span>
                  <strong>{t.step4.serviceName}</strong>
                </div>
                <div className="summary-row">
                  <span>{t.step4.applicant}:</span>
                  <strong>{personType === 'physical' ? `${form.name} ${form.surname}` : form.companyName}</strong>
                </div>
                <div className="summary-row">
                  <span>{t.step4.property}:</span>
                  <strong>{form.propertyAddress}{form.propertyExtra ? `, ${form.propertyExtra}` : ''}, {form.propertyMunicipality}</strong>
                </div>
                <div className="summary-row">
                  <span>{t.step4.representative}:</span>
                  <strong>{t.step4.representativeName}</strong>
                </div>
                <div className="summary-row total">
                  <span>{t.step4.total}:</span>
                  <strong>{t.step4.price}</strong>
                </div>
                <p className="summary-includes">{t.step4.includes}</p>
              </div>

              {/* N2 Upsell */}
              <div className="n2-upsell-box">
                <p>{t.step4.n2Upsell}</p>
              </div>

              {/* Terms */}
              <label className="checkbox-label terms">
                <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} />
                <span>{t.step4.termsLabel} <a href="/aviso-legal">{t.step4.terms}</a> {t.step4.termsAnd} <a href="/privacidad">{t.step4.privacy}</a></span>
              </label>

              {/* Pay Button */}
              <button className="btn btn-primary btn-large btn-pay" onClick={handlePay} disabled={!acceptTerms}>
                {t.step4.payBtn}
                <ArrowRight size={20} />
              </button>

              <p className="secure-text">{t.step4.secure}</p>
              <p className="delivery-text">{t.step4.delivery}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="form-nav">
          {step > 0 && <button className="btn btn-secondary" onClick={back}><ArrowLeft size={18} />{t.nav.back}</button>}
          {step < 4 && (
            <button className="btn btn-primary" onClick={next}>
              {t.nav.next} <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SolicitarNRUA
