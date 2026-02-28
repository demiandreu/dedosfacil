-- Blog seed data: 7 categories in 4 languages + 1 test article

-- ============================================
-- CATEGORIES
-- ============================================

INSERT INTO blog_categories (slug) VALUES
  ('registros-licencias'),
  ('impuestos-modelos'),
  ('normativa-comunidades'),
  ('plataformas-digitales'),
  ('novedades-legales'),
  ('guias-extranjeros'),
  ('preguntas-frecuentes')
ON CONFLICT (slug) DO NOTHING;

-- Category translations: Spanish
INSERT INTO blog_category_translations (category_id, lang, name, description) VALUES
  ((SELECT id FROM blog_categories WHERE slug = 'registros-licencias'), 'es', 'Registros y licencias', 'NRUA, VUD, licencias turísticas y registros obligatorios'),
  ((SELECT id FROM blog_categories WHERE slug = 'impuestos-modelos'), 'es', 'Impuestos y modelos', 'Modelo N2, 210, 179, IRNR y obligaciones fiscales'),
  ((SELECT id FROM blog_categories WHERE slug = 'normativa-comunidades'), 'es', 'Normativa por comunidad autónoma', 'Regulación de alquiler turístico en cada comunidad'),
  ((SELECT id FROM blog_categories WHERE slug = 'plataformas-digitales'), 'es', 'Plataformas digitales', 'Airbnb, Booking, Vrbo: guías y novedades'),
  ((SELECT id FROM blog_categories WHERE slug = 'novedades-legales'), 'es', 'Novedades legales', 'Últimos cambios en la legislación de alquiler turístico'),
  ((SELECT id FROM blog_categories WHERE slug = 'guias-extranjeros'), 'es', 'Guías para propietarios extranjeros', 'Todo lo que necesitas saber si eres propietario no residente'),
  ((SELECT id FROM blog_categories WHERE slug = 'preguntas-frecuentes'), 'es', 'Preguntas frecuentes', 'Respuestas a las dudas más comunes')
ON CONFLICT (category_id, lang) DO NOTHING;

-- Category translations: English
INSERT INTO blog_category_translations (category_id, lang, name, description) VALUES
  ((SELECT id FROM blog_categories WHERE slug = 'registros-licencias'), 'en', 'Registrations & Licenses', 'NRUA, VUD, tourist licenses and mandatory registrations'),
  ((SELECT id FROM blog_categories WHERE slug = 'impuestos-modelos'), 'en', 'Taxes & Forms', 'Form N2, 210, 179, IRNR and fiscal obligations'),
  ((SELECT id FROM blog_categories WHERE slug = 'normativa-comunidades'), 'en', 'Regional Regulations', 'Tourist rental regulation by autonomous community'),
  ((SELECT id FROM blog_categories WHERE slug = 'plataformas-digitales'), 'en', 'Digital Platforms', 'Airbnb, Booking, Vrbo: guides and updates'),
  ((SELECT id FROM blog_categories WHERE slug = 'novedades-legales'), 'en', 'Legal Updates', 'Latest changes in tourist rental legislation'),
  ((SELECT id FROM blog_categories WHERE slug = 'guias-extranjeros'), 'en', 'Guides for Foreign Owners', 'Everything you need to know as a non-resident owner'),
  ((SELECT id FROM blog_categories WHERE slug = 'preguntas-frecuentes'), 'en', 'FAQ', 'Answers to the most common questions')
ON CONFLICT (category_id, lang) DO NOTHING;

-- Category translations: French
INSERT INTO blog_category_translations (category_id, lang, name, description) VALUES
  ((SELECT id FROM blog_categories WHERE slug = 'registros-licencias'), 'fr', 'Enregistrements et licences', 'NRUA, VUD, licences touristiques et enregistrements obligatoires'),
  ((SELECT id FROM blog_categories WHERE slug = 'impuestos-modelos'), 'fr', 'Impôts et formulaires', 'Formulaire N2, 210, 179, IRNR et obligations fiscales'),
  ((SELECT id FROM blog_categories WHERE slug = 'normativa-comunidades'), 'fr', 'Réglementation par communauté autonome', 'Réglementation de la location touristique dans chaque communauté'),
  ((SELECT id FROM blog_categories WHERE slug = 'plataformas-digitales'), 'fr', 'Plateformes numériques', 'Airbnb, Booking, Vrbo : guides et actualités'),
  ((SELECT id FROM blog_categories WHERE slug = 'novedades-legales'), 'fr', 'Actualités juridiques', 'Derniers changements dans la législation sur la location touristique'),
  ((SELECT id FROM blog_categories WHERE slug = 'guias-extranjeros'), 'fr', 'Guides pour propriétaires étrangers', 'Tout ce que vous devez savoir en tant que propriétaire non-résident'),
  ((SELECT id FROM blog_categories WHERE slug = 'preguntas-frecuentes'), 'fr', 'Questions fréquentes', 'Réponses aux questions les plus courantes')
ON CONFLICT (category_id, lang) DO NOTHING;

-- Category translations: German
INSERT INTO blog_category_translations (category_id, lang, name, description) VALUES
  ((SELECT id FROM blog_categories WHERE slug = 'registros-licencias'), 'de', 'Registrierungen & Lizenzen', 'NRUA, VUD, Touristenlizenzen und Pflichtregistrierungen'),
  ((SELECT id FROM blog_categories WHERE slug = 'impuestos-modelos'), 'de', 'Steuern & Formulare', 'Formular N2, 210, 179, IRNR und steuerliche Pflichten'),
  ((SELECT id FROM blog_categories WHERE slug = 'normativa-comunidades'), 'de', 'Regionale Vorschriften', 'Touristenvermietungsregelung nach autonomer Gemeinschaft'),
  ((SELECT id FROM blog_categories WHERE slug = 'plataformas-digitales'), 'de', 'Digitale Plattformen', 'Airbnb, Booking, Vrbo: Anleitungen und Neuigkeiten'),
  ((SELECT id FROM blog_categories WHERE slug = 'novedades-legales'), 'de', 'Rechtliche Neuigkeiten', 'Aktuelle Änderungen im Touristenvermietungsrecht'),
  ((SELECT id FROM blog_categories WHERE slug = 'guias-extranjeros'), 'de', 'Leitfäden für ausländische Eigentümer', 'Alles was Sie als nicht-ansässiger Eigentümer wissen müssen'),
  ((SELECT id FROM blog_categories WHERE slug = 'preguntas-frecuentes'), 'de', 'Häufig gestellte Fragen', 'Antworten auf die häufigsten Fragen')
ON CONFLICT (category_id, lang) DO NOTHING;

-- ============================================
-- TEST ARTICLE
-- ============================================

INSERT INTO blog_posts (category_id, author, status, published_at)
VALUES (
  (SELECT id FROM blog_categories WHERE slug = 'novedades-legales'),
  'DedosFácil',
  'published',
  '2025-03-15 10:00:00'
);

-- Spanish version
INSERT INTO blog_post_translations (post_id, lang, slug, title, excerpt, content, meta_title, meta_description)
VALUES (
  (SELECT id FROM blog_posts ORDER BY id DESC LIMIT 1),
  'es',
  'cambios-impuesto-turistico-espana-abril-2025',
  'Cambios en el impuesto turístico en España a partir de abril 2025: todo lo que necesita saber el propietario',
  'El gobierno español ha introducido cambios significativos en la tributación del alquiler turístico que entran en vigor en abril de 2025. Te explicamos cómo afectan a tu propiedad vacacional.',
  '<h2>Nuevas obligaciones fiscales para propietarios de alquiler turístico</h2>
<p>A partir del 1 de abril de 2025, los propietarios de viviendas de alquiler turístico en España se enfrentan a un panorama fiscal renovado. El Real Decreto 1312/2024 y sus modificaciones posteriores han establecido un nuevo marco normativo que afecta directamente a miles de propietarios en todo el territorio nacional.</p>

<h3>¿Qué ha cambiado exactamente?</h3>
<p>Los principales cambios se centran en tres áreas fundamentales:</p>
<ul>
  <li><strong>Modelo N2 obligatorio:</strong> Todos los propietarios con vivienda de uso turístico deben presentar el depósito de arrendamientos ante el Registro de la Propiedad. El plazo límite para la primera declaración es el 2 de marzo de 2026.</li>
  <li><strong>Registro NRUA actualizado:</strong> Se ha reforzado la obligatoriedad del Número de Registro Único Autonómico (NRUA), sin el cual no se puede publicitar la vivienda en plataformas como Airbnb, Booking o Vrbo.</li>
  <li><strong>Nuevas retenciones fiscales:</strong> Las plataformas digitales están ahora obligadas a practicar retenciones del IRNR (Impuesto sobre la Renta de No Residentes) directamente a los propietarios no residentes.</li>
</ul>

<h3>Impacto en propietarios residentes</h3>
<p>Si resides en España y alquilas una o varias propiedades vacacionales, debes tener en cuenta que la tributación de los ingresos por alquiler turístico se integra en tu declaración de la renta (IRPF). Las deducciones aplicables se han modificado: ahora puedes deducir hasta un 60% de los gastos directamente relacionados con la actividad, incluyendo suministros, limpieza, plataformas de gestión y seguros.</p>
<p>Además, el Modelo 179 de declaración informativa trimestral se mantiene vigente. Las plataformas digitales deben comunicar a la Agencia Tributaria todos los alquileres realizados, incluyendo datos del inmueble, días de ocupación e ingresos obtenidos.</p>

<h3>Impacto en propietarios no residentes</h3>
<p>Para los propietarios que no residen en España —un grupo cada vez más numeroso, especialmente procedentes de países nórdicos, Reino Unido y Alemania—, los cambios son aún más significativos. El IRNR (Modelo 210) debe presentarse trimestralmente, y las nuevas disposiciones establecen que las plataformas pueden actuar como agentes de retención.</p>
<p>Esto significa que, en muchos casos, Airbnb o Booking descontarán directamente el porcentaje correspondiente de impuestos antes de transferir los ingresos al propietario. La tasa aplicable para residentes de la UE es del 19%, mientras que para residentes de países fuera de la UE se eleva al 24%.</p>

<h3>Plazos importantes a recordar</h3>
<p>Estos son los plazos clave que todo propietario debe marcar en su calendario:</p>
<ul>
  <li><strong>2 de marzo de 2026:</strong> Fecha límite para la presentación del primer Modelo N2</li>
  <li><strong>Trimestral:</strong> Declaración del Modelo 210 para no residentes (20 de abril, julio, octubre y enero)</li>
  <li><strong>Anual:</strong> Renovación del NRUA en las comunidades autónomas que lo requieran</li>
</ul>

<h3>¿Cómo prepararse?</h3>
<p>Desde DedosFácil recomendamos seguir estos pasos:</p>
<ol>
  <li>Verificar que tu propiedad tiene el NRUA en vigor</li>
  <li>Recopilar todas las reservas del año 2025 desde tu plataforma</li>
  <li>Presentar el Modelo N2 antes del plazo límite</li>
  <li>Consultar con un asesor fiscal sobre las deducciones aplicables</li>
</ol>
<p>No cumplir con estas obligaciones puede resultar en la revocación de tu licencia turística y sanciones económicas que pueden superar los 30.000€ en los casos más graves.</p>

<h3>DedosFácil te ayuda</h3>
<p>Sabemos que la normativa puede resultar abrumadora, especialmente si no estás familiarizado con el sistema fiscal español. Por eso, en DedosFácil nos encargamos de todo el proceso: desde la obtención del NRUA hasta la presentación del Modelo N2. Solo necesitas descargar el CSV de reservas de tu plataforma y nosotros hacemos el resto.</p>',
  'Cambios impuesto turístico España 2025 | DedosFácil',
  'Descubre los cambios en el impuesto turístico en España desde abril 2025. Modelo N2, NRUA, IRNR: todo lo que necesitas saber como propietario.'
);

-- English version
INSERT INTO blog_post_translations (post_id, lang, slug, title, excerpt, content, meta_title, meta_description)
VALUES (
  (SELECT id FROM blog_posts ORDER BY id DESC LIMIT 1),
  'en',
  'spain-tourist-tax-changes-april-2025',
  'Changes to Spain''s Tourist Tax from April 2025: Everything Property Owners Need to Know',
  'The Spanish government has introduced significant changes to tourist rental taxation taking effect in April 2025. We explain how they affect your holiday property.',
  '<h2>New Tax Obligations for Tourist Rental Property Owners</h2>
<p>From 1 April 2025, owners of tourist rental properties in Spain face a renewed tax landscape. Royal Decree 1312/2024 and its subsequent amendments have established a new regulatory framework that directly affects thousands of property owners across the country.</p>

<h3>What Exactly Has Changed?</h3>
<p>The main changes focus on three key areas:</p>
<ul>
  <li><strong>Mandatory Form N2:</strong> All owners with tourist-use properties must file the rental deposit declaration with the Property Registry. The deadline for the first declaration is 2 March 2026.</li>
  <li><strong>Updated NRUA Registration:</strong> The requirement for the Unique Autonomous Registration Number (NRUA) has been strengthened — without it, you cannot advertise your property on platforms like Airbnb, Booking or Vrbo.</li>
  <li><strong>New Tax Withholdings:</strong> Digital platforms are now required to withhold IRNR (Non-Resident Income Tax) directly from non-resident property owners.</li>
</ul>

<h3>Impact on Resident Owners</h3>
<p>If you reside in Spain and rent out one or more holiday properties, you should be aware that tourist rental income is integrated into your income tax return (IRPF). The applicable deductions have been modified: you can now deduct up to 60% of expenses directly related to the activity, including utilities, cleaning, management platforms and insurance.</p>
<p>Additionally, the quarterly informative declaration Form 179 remains in force. Digital platforms must report all rentals to the Tax Agency, including property details, occupancy days and income earned.</p>

<h3>Impact on Non-Resident Owners</h3>
<p>For property owners who do not reside in Spain — an increasingly large group, especially from Nordic countries, the UK and Germany — the changes are even more significant. IRNR (Form 210) must be filed quarterly, and the new provisions establish that platforms can act as withholding agents.</p>
<p>This means that in many cases, Airbnb or Booking will directly deduct the corresponding tax percentage before transferring income to the owner. The applicable rate for EU residents is 19%, while for residents of countries outside the EU it rises to 24%.</p>

<h3>Important Deadlines to Remember</h3>
<p>These are the key deadlines every owner should mark on their calendar:</p>
<ul>
  <li><strong>2 March 2026:</strong> Deadline for filing the first Form N2</li>
  <li><strong>Quarterly:</strong> Form 210 declaration for non-residents (20 April, July, October and January)</li>
  <li><strong>Annual:</strong> NRUA renewal in autonomous communities that require it</li>
</ul>

<h3>How to Prepare?</h3>
<p>At DedosFácil, we recommend following these steps:</p>
<ol>
  <li>Verify that your property has a valid NRUA</li>
  <li>Collect all reservations from 2025 from your platform</li>
  <li>File Form N2 before the deadline</li>
  <li>Consult a tax advisor about applicable deductions</li>
</ol>
<p>Failure to comply with these obligations can result in the revocation of your tourist licence and fines that can exceed €30,000 in the most serious cases.</p>

<h3>DedosFácil Can Help</h3>
<p>We know the regulations can be overwhelming, especially if you''re not familiar with the Spanish tax system. That''s why at DedosFácil we take care of the entire process: from obtaining the NRUA to filing Form N2. You just need to download your reservation CSV from your platform and we do the rest.</p>',
  'Spain Tourist Tax Changes 2025 | DedosFácil',
  'Discover the changes to Spain''s tourist tax from April 2025. Form N2, NRUA, IRNR: everything you need to know as a property owner.'
);

-- French version
INSERT INTO blog_post_translations (post_id, lang, slug, title, excerpt, content, meta_title, meta_description)
VALUES (
  (SELECT id FROM blog_posts ORDER BY id DESC LIMIT 1),
  'fr',
  'changements-taxe-touristique-espagne-avril-2025',
  'Changements de la taxe touristique en Espagne à partir d''avril 2025 : tout ce que le propriétaire doit savoir',
  'Le gouvernement espagnol a introduit des changements significatifs dans la fiscalité de la location touristique à partir d''avril 2025. Nous vous expliquons comment ils affectent votre propriété de vacances.',
  '<h2>Nouvelles obligations fiscales pour les propriétaires de locations touristiques</h2>
<p>À partir du 1er avril 2025, les propriétaires de biens locatifs touristiques en Espagne font face à un paysage fiscal renouvelé. Le Décret Royal 1312/2024 et ses modifications ultérieures ont établi un nouveau cadre réglementaire qui affecte directement des milliers de propriétaires sur tout le territoire national.</p>

<h3>Qu''est-ce qui a exactement changé ?</h3>
<p>Les principaux changements se concentrent sur trois domaines fondamentaux :</p>
<ul>
  <li><strong>Formulaire N2 obligatoire :</strong> Tous les propriétaires de logements à usage touristique doivent déposer la déclaration de dépôt de loyers auprès du Registre de la Propriété. La date limite pour la première déclaration est le 2 mars 2026.</li>
  <li><strong>Enregistrement NRUA mis à jour :</strong> L''obligation du Numéro d''Enregistrement Unique Autonome (NRUA) a été renforcée — sans celui-ci, vous ne pouvez pas publier votre logement sur des plateformes comme Airbnb, Booking ou Vrbo.</li>
  <li><strong>Nouvelles retenues fiscales :</strong> Les plateformes numériques sont désormais tenues de pratiquer des retenues d''IRNR (Impôt sur le Revenu des Non-Résidents) directement aux propriétaires non-résidents.</li>
</ul>

<h3>Impact sur les propriétaires résidents</h3>
<p>Si vous résidez en Espagne et louez un ou plusieurs biens de vacances, sachez que les revenus de location touristique sont intégrés dans votre déclaration d''impôt sur le revenu (IRPF). Les déductions applicables ont été modifiées : vous pouvez désormais déduire jusqu''à 60 % des dépenses directement liées à l''activité, y compris les charges, le ménage, les plateformes de gestion et les assurances.</p>
<p>De plus, la déclaration informative trimestrielle Formulaire 179 reste en vigueur. Les plateformes numériques doivent communiquer à l''Agence Fiscale toutes les locations réalisées, y compris les données du bien, les jours d''occupation et les revenus obtenus.</p>

<h3>Impact sur les propriétaires non-résidents</h3>
<p>Pour les propriétaires qui ne résident pas en Espagne — un groupe de plus en plus nombreux, notamment en provenance des pays nordiques, du Royaume-Uni et d''Allemagne — les changements sont encore plus significatifs. L''IRNR (Formulaire 210) doit être déposé trimestriellement, et les nouvelles dispositions établissent que les plateformes peuvent agir comme agents de retenue.</p>
<p>Cela signifie que, dans de nombreux cas, Airbnb ou Booking déduiront directement le pourcentage d''impôt correspondant avant de transférer les revenus au propriétaire. Le taux applicable pour les résidents de l''UE est de 19 %, tandis que pour les résidents de pays hors UE, il s''élève à 24 %.</p>

<h3>Dates limites importantes à retenir</h3>
<p>Voici les dates clés que tout propriétaire doit noter dans son calendrier :</p>
<ul>
  <li><strong>2 mars 2026 :</strong> Date limite pour le dépôt du premier Formulaire N2</li>
  <li><strong>Trimestriel :</strong> Déclaration du Formulaire 210 pour les non-résidents (20 avril, juillet, octobre et janvier)</li>
  <li><strong>Annuel :</strong> Renouvellement du NRUA dans les communautés autonomes qui l''exigent</li>
</ul>

<h3>Comment se préparer ?</h3>
<p>Chez DedosFácil, nous recommandons de suivre ces étapes :</p>
<ol>
  <li>Vérifier que votre propriété possède un NRUA en cours de validité</li>
  <li>Rassembler toutes les réservations de l''année 2025 depuis votre plateforme</li>
  <li>Déposer le Formulaire N2 avant la date limite</li>
  <li>Consulter un conseiller fiscal sur les déductions applicables</li>
</ol>
<p>Le non-respect de ces obligations peut entraîner la révocation de votre licence touristique et des amendes pouvant dépasser 30 000 € dans les cas les plus graves.</p>

<h3>DedosFácil vous aide</h3>
<p>Nous savons que la réglementation peut être accablante, surtout si vous n''êtes pas familier avec le système fiscal espagnol. C''est pourquoi, chez DedosFácil, nous nous occupons de tout le processus : de l''obtention du NRUA au dépôt du Formulaire N2. Il vous suffit de télécharger le CSV de réservations depuis votre plateforme et nous faisons le reste.</p>',
  'Changements taxe touristique Espagne 2025 | DedosFácil',
  'Découvrez les changements de la taxe touristique en Espagne à partir d''avril 2025. Formulaire N2, NRUA, IRNR : tout ce que vous devez savoir en tant que propriétaire.'
);

-- German version
INSERT INTO blog_post_translations (post_id, lang, slug, title, excerpt, content, meta_title, meta_description)
VALUES (
  (SELECT id FROM blog_posts ORDER BY id DESC LIMIT 1),
  'de',
  'aenderungen-touristensteuer-spanien-april-2025',
  'Änderungen der Touristensteuer in Spanien ab April 2025: Alles, was Immobilieneigentümer wissen müssen',
  'Die spanische Regierung hat bedeutende Änderungen bei der Besteuerung von Ferienvermietungen eingeführt, die ab April 2025 gelten. Wir erklären, wie sie Ihre Ferienimmobilie betreffen.',
  '<h2>Neue Steuerpflichten für Eigentümer von Ferienvermietungen</h2>
<p>Ab dem 1. April 2025 sehen sich Eigentümer von touristischen Mietimmobilien in Spanien mit einer erneuerten Steuerlandschaft konfrontiert. Das Königliche Dekret 1312/2024 und seine nachfolgenden Änderungen haben einen neuen Regulierungsrahmen geschaffen, der Tausende von Immobilieneigentümern im ganzen Land direkt betrifft.</p>

<h3>Was hat sich genau geändert?</h3>
<p>Die wichtigsten Änderungen konzentrieren sich auf drei Schlüsselbereiche:</p>
<ul>
  <li><strong>Pflichtformular N2:</strong> Alle Eigentümer von touristisch genutzten Immobilien müssen die Mietkautionserklärung beim Grundbuchamt einreichen. Die Frist für die erste Erklärung ist der 2. März 2026.</li>
  <li><strong>Aktualisierte NRUA-Registrierung:</strong> Die Anforderung der Einheitlichen Autonomen Registrierungsnummer (NRUA) wurde verschärft — ohne sie können Sie Ihre Immobilie nicht auf Plattformen wie Airbnb, Booking oder Vrbo bewerben.</li>
  <li><strong>Neue Steuereinbehalte:</strong> Digitale Plattformen sind nun verpflichtet, IRNR (Einkommensteuer für Nichtansässige) direkt von nicht-ansässigen Immobilieneigentümern einzubehalten.</li>
</ul>

<h3>Auswirkungen auf ansässige Eigentümer</h3>
<p>Wenn Sie in Spanien wohnen und eine oder mehrere Ferienimmobilien vermieten, sollten Sie wissen, dass Einkünfte aus touristischer Vermietung in Ihre Einkommensteuererklärung (IRPF) integriert werden. Die anwendbaren Abzüge wurden geändert: Sie können jetzt bis zu 60 % der direkt mit der Tätigkeit verbundenen Ausgaben abziehen, einschließlich Nebenkosten, Reinigung, Verwaltungsplattformen und Versicherungen.</p>
<p>Darüber hinaus bleibt die vierteljährliche Informationserklärung Formular 179 in Kraft. Digitale Plattformen müssen alle Vermietungen an die Steuerbehörde melden, einschließlich Immobiliendaten, Belegungstage und erzielter Einnahmen.</p>

<h3>Auswirkungen auf nicht-ansässige Eigentümer</h3>
<p>Für Immobilieneigentümer, die nicht in Spanien ansässig sind — eine zunehmend große Gruppe, insbesondere aus nordischen Ländern, Großbritannien und Deutschland — sind die Änderungen noch bedeutender. IRNR (Formular 210) muss vierteljährlich eingereicht werden, und die neuen Bestimmungen legen fest, dass Plattformen als Einbehaltungsagenten fungieren können.</p>
<p>Das bedeutet, dass in vielen Fällen Airbnb oder Booking den entsprechenden Steuerprozentsatz direkt abziehen, bevor sie die Einnahmen an den Eigentümer überweisen. Der anwendbare Steuersatz für EU-Bürger beträgt 19 %, während er für Bewohner von Ländern außerhalb der EU auf 24 % steigt.</p>

<h3>Wichtige Fristen zum Merken</h3>
<p>Dies sind die Schlüsselfristen, die jeder Eigentümer in seinem Kalender markieren sollte:</p>
<ul>
  <li><strong>2. März 2026:</strong> Frist für die Einreichung des ersten Formulars N2</li>
  <li><strong>Vierteljährlich:</strong> Erklärung des Formulars 210 für Nichtansässige (20. April, Juli, Oktober und Januar)</li>
  <li><strong>Jährlich:</strong> NRUA-Erneuerung in den autonomen Gemeinschaften, die dies verlangen</li>
</ul>

<h3>Wie bereitet man sich vor?</h3>
<p>Bei DedosFácil empfehlen wir folgende Schritte:</p>
<ol>
  <li>Überprüfen Sie, ob Ihre Immobilie einen gültigen NRUA hat</li>
  <li>Sammeln Sie alle Buchungen des Jahres 2025 von Ihrer Plattform</li>
  <li>Reichen Sie Formular N2 vor Ablauf der Frist ein</li>
  <li>Konsultieren Sie einen Steuerberater über anwendbare Abzüge</li>
</ol>
<p>Die Nichteinhaltung dieser Pflichten kann zum Entzug Ihrer Touristenlizenz und zu Geldstrafen führen, die in den schwersten Fällen 30.000 € überschreiten können.</p>

<h3>DedosFácil hilft Ihnen</h3>
<p>Wir wissen, dass die Vorschriften überwältigend sein können, besonders wenn Sie mit dem spanischen Steuersystem nicht vertraut sind. Deshalb kümmern wir uns bei DedosFácil um den gesamten Prozess: von der Beschaffung der NRUA bis zur Einreichung des Formulars N2. Sie müssen nur die Reservierungs-CSV von Ihrer Plattform herunterladen, und wir erledigen den Rest.</p>',
  'Änderungen Touristensteuer Spanien 2025 | DedosFácil',
  'Erfahren Sie alles über die Änderungen der Touristensteuer in Spanien ab April 2025. Formular N2, NRUA, IRNR: alles was Sie als Immobilieneigentümer wissen müssen.'
);
