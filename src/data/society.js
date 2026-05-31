// Central data source for AUSSS leadership and committees.
// Replace placeholder names/initials with real members as needed.
//
// ── Provenance convention for `activities` ───────────────────────────────
// Each activity carries a `scope`:
//   'AUSSS'        → verified from AUSSS's own public channels.
//   'IFMSA-Egypt'  → documented IFMSA-Egypt national campaign that runs
//                     through local committees (incl. Ain Shams). It is
//                     labelled as such in the UI, NOT presented as an
//                     AUSSS-exclusive project. Keep this honest.

export const executiveBoard = [
  {
    name: 'Amr Hesham',
    photo: '/assets/team/amr-hesham.jpg',
    role: 'President',
    email: 'the.president.ausss@gmail.com',
    candidature: '/assets/eb-candidatures/amr-hesham-candidature.pdf',
    tier: 'lead',
    blurb:
      'Sets the strategic vision of the society and represents AUSSS to national and international partners.',
  },
  {
    name: 'Sara Galal',
    photo: '/assets/team/sara-galal.jpg',
    role: 'Vice President, Internal Affairs',
    email: 'vpi.ausss@gmail.com',
    candidature: '/assets/eb-candidatures/sara-galal-candidature.pdf',
    tier: 'vp',
    blurb: 'Oversees committees, member development, and internal operations.',
  },
  {
    name: 'Mark Karam',
    photo: '/assets/team/mark-karam.jpg',
    role: 'Vice President, External Affairs',
    email: 'vpe.ausss@gmail.com',
    candidature: '/assets/eb-candidatures/mark-karam-candidature.pdf',
    tier: 'vp',
    blurb: 'Leads partnerships and inter-university relations.',
  },
  {
    name: 'Alyaa Ashraf',
    photo: '/assets/team/alyaa-ashraf.jpg',
    role: 'Secretary General',
    email: 'ausss.secgen@gmail.com',
    candidature: '/assets/eb-candidatures/alyaa-ashraf-candidature.pdf',
    tier: 'officer',
    blurb: 'Manages records, governance documentation, and board coordination.',
  },
]

// `group` controls placement: "Standing Committee" cards render in the
// upper tier, "Support Division" cards in the lower tier.
//
// Optional rich fields consumed by CommitteePage.jsx:
//   tagline  , short subtitle under the committee name
//   about    , string | string[]  → "Who we are"
//   whatWeDo , string[]            → "What we do"
//   activities, [{ title, blurb, type, scope }] → activity showcase
export const committees = [
  {
    name: 'Professional Exchange',
    abbr: 'SCOPE',
    color: '#0181c1',
    logo: '/assets/logos/SCOPE.png',
    group: 'Standing Committee',
    officer: 'Local Exchange Officer',
    tagline: 'Exchange the world, four-week clinical clerkships abroad.',
    // For committees with more than one officer, use `officers`
    // (order here = display order). Single-officer ones use
    // `officer` (title) + `officerAbbr` + `holder` (the person).
    officers: [
      { name: 'Reem Serry', abbr: 'LEO-Out', photo: '/assets/team/reem-serry.jpg', email: 'leolore.out.ausss@gmail.com' },
      { name: 'Ahmed Abdelfatah', abbr: 'LEO-In', photo: '/assets/team/ahmed-abdelfatah.jpg', email: 'leolore.in.ausss@gmail.com' },
    ],
    description:
      'Manages clinical clerkship exchanges and incoming/outgoing student logistics.',
    about: [
      'SCOPE, the Standing Committee on Professional Exchange, runs IFMSA’s flagship clinical exchange programme. Founded in 1951, it now moves over 13,000 medical students between more than 100 countries every year, making it one of the largest student-run exchange networks in the world.',
      'Through AUSSS, Ain Shams students complete a four-week clinical clerkship abroad, and we host incoming students here in Cairo, building cultural understanding and clinical perspective alongside future doctors from across the globe.',
    ],
    whatWeDo: [
      'Coordinate four-week clinical clerkships abroad on bilateral (student-swap) and unilateral contracts.',
      'Host incoming exchange students at Ain Shams teaching hospitals, each with a supervising physician and a full social programme.',
      'Prepare outgoing students with pre-departure orientation, documentation, and academic-recognition guidance.',
      'Run the Local Exchange Officer (LEO-In / LEO-Out) team and recruit at exchange fairs.',
    ],
    activities: [
      {
        title: 'Four-week clinical clerkships',
        blurb:
          'Specialties offered through IFMSA-Egypt include internal medicine, surgery, OB/GYN, tropical & emergency medicine, radiology, pathology, dermatology and ophthalmology, 5 hrs/day, with ≥80% attendance earning the official SCOPE certificate.',
        type: 'Exchange',
        scope: 'IFMSA-Egypt',
      },
      {
        title: 'Hosting at Ain Shams hospitals',
        blurb:
          'Ain Shams Specialized Hospital is a documented host venue for incoming IFMSA students, who observe surgeries and clinical rounds with local student support.',
        type: 'Exchange',
        scope: 'IFMSA-Egypt',
      },
      {
        title: 'National Weekends social programme',
        blurb:
          'Incoming students join IFMSA-Egypt national trips (Cairo, Alexandria, Dahab) alongside city social outings run by local contact persons.',
        type: 'Project',
        scope: 'IFMSA-Egypt',
      },
    ],
  },
  {
    name: 'Research Exchange',
    abbr: 'SCORE',
    color: '#2e4a9c',
    logo: '/assets/logos/SCORE.png',
    group: 'Standing Committee',
    officer: 'Local Officer on Research Exchange',
    officerAbbr: 'LORE',
    holder: 'Hassan Haitham',
    email: 'loreausss@gmail.com',
    photo: '/assets/team/hassan-haitham.jpg',
    tagline: 'Research clerkships across the world.',
    description:
      'Runs the IFMSA research exchange, placing students in international research clerkships, both incoming and outgoing.',
    about: [
      'SCORE, the Standing Committee on Research Exchange, gives future physicians the chance to experience scientific research abroad. Founded in 1991, it connects 65+ national organisations and over 3,000 research projects, placing more than 2,400 students a year in international research clerkships.',
      'AUSSS coordinates incoming and outgoing research exchanges through the Local Officer on Research Exchange (LORE), pairing students with a mentor and a structured project from literature review to final report.',
    ],
    whatWeDo: [
      'Place outgoing students in four-week-plus international research projects under an assigned mentor.',
      'Host incoming research-exchange students at Ain Shams research units.',
      'Guide students through the SCORE Research Projects Database, proposals, and academic recognition.',
      'Run research-skills sessions on literature review, data collection, scientific writing and ethics.',
    ],
    activities: [
      {
        title: 'International research clerkships',
        blurb:
          'Four-to-eight-week clinical or preclinical research projects under a mentor; ≥80% attendance earns the official SCORE certificate. Project types span basic-lab, clinical, and Global Action Projects.',
        type: 'Exchange',
        scope: 'IFMSA-Egypt',
      },
      {
        title: 'Shared exchange social programme',
        blurb:
          'SCORE exchange students join the same IFMSA-Egypt National Weekends and city social programme as SCOPE.',
        type: 'Project',
        scope: 'IFMSA-Egypt',
      },
    ],
  },
  {
    name: 'Medical Education',
    abbr: 'SCOME',
    color: '#100016',
    logo: '/assets/logos/SCOME.png',
    group: 'Standing Committee',
    officer: 'Local Officer on Medical Education',
    officerAbbr: 'LOME',
    holder: 'Sama ElKady',
    email: 'ausss.lome@gmail.com',
    photo: '/assets/team/sama-elkady.jpg',
    tagline: 'Students shaping medical education.',
    description:
      'Runs skills workshops, evidence-based medicine sessions, and curriculum advocacy.',
    about: [
      'SCOME, the Standing Committee on Medical Education, is the platform where medical students contribute to and shape the development of medical education. One of IFMSA’s original 1951 committees, it treats students as full stakeholders and the first quality-check of their own curriculum.',
      'At AUSSS, SCOME runs skills training, evidence-based-medicine sessions and peer-teaching, carrying the Local Officer on Medical Education (LOME) into national medical-education projects.',
    ],
    whatWeDo: [
      'Run clinical-skills and study-skills workshops and peer-teaching sessions.',
      'Deliver evidence-based-medicine (EBM) training and awareness.',
      'Advocate for student voice in curriculum and quality of medical education.',
      'Develop trainers through the Training Medical Education Trainers (TMET) pathway.',
    ],
    activities: [
      {
        title: 'AUSSS SCOME content & sessions',
        blurb:
          'AUSSS produces dedicated SCOME educational content and runs sessions under its Local Officer on Medical Education (LOME).',
        type: 'Workshop',
        scope: 'AUSSS',
      },
      {
        title: 'Evidence-Based Medicine (EBM) project',
        blurb:
          'IFMSA-Egypt national train-the-trainer programme, cascaded locally to roughly 2,000 students.',
        type: 'Project',
        scope: 'IFMSA-Egypt',
      },
      {
        title: 'Basic & Advanced Life Support (BLS/ALS)',
        blurb:
          'Recurring SCOME competency-training series run across IFMSA-Egypt local committees.',
        type: 'Workshop',
        scope: 'IFMSA-Egypt',
      },
      {
        title: 'CleoApaTrain (TMET)',
        blurb:
          'IFMSA-Egypt’s recurring national Training Medical Education Trainers workshop.',
        type: 'Workshop',
        scope: 'IFMSA-Egypt',
      },
    ],
  },
  {
    name: 'Human Rights & Peace',
    abbr: 'SCORP',
    color: '#5f903f',
    logo: '/assets/logos/SCORP.png',
    group: 'Standing Committee',
    officer: 'Local Officer on Human Rights & Peace',
    officerAbbr: 'LORP',
    holder: 'Wafaa Rasool',
    email: 'lorpausss@gmail.com',
    photo: '/assets/team/wafaa-rasool.jpg',
    tagline: 'Medicine in the service of human rights and peace.',
    description: 'Advocates for ethics in medicine and humanitarian engagement.',
    about: [
      'SCORP, the Standing Committee on Human Rights and Peace, empowers medical students to promote and protect human rights and peace through advocacy, awareness and capacity building. Founded in 1983, it works on human rights, peace, refugees and displaced persons, ethics in healthcare, disaster response and vulnerable populations.',
      'AUSSS members carry this into campus advocacy, community outreach, and medical-ethics campaigns.',
    ],
    whatWeDo: [
      'Run human-rights and medical-ethics awareness campaigns on campus and in the community.',
      'Advocate for vulnerable and marginalised groups in healthcare.',
      'Support refugee and community outreach and charity drives.',
      'Develop human-rights trainers through the TNHRT pathway.',
    ],
    activities: [
      {
        title: 'Together Against Stigma (TAS)',
        blurb:
          'IFMSA-Egypt’s flagship SCORP project, national workshops, online campaigns and local actions on medical ethics, patient and healthcare-worker rights, vulnerable groups, and discrimination against female health workers.',
        type: 'Campaign',
        scope: 'IFMSA-Egypt',
      },
    ],
  },
  {
    name: 'Public Health',
    abbr: 'SCOPH',
    color: '#f47d3b',
    logo: '/assets/logos/SCOPH.png',
    group: 'Standing Committee',
    officer: 'Local Public Health Officer',
    officerAbbr: 'LPO',
    holder: 'Shahi Ezzeldin',
    email: 'lpoausss@gmail.com',
    photo: '/assets/team/shahi-ezzeldin.jpg',
    tagline: 'Building healthier communities.',
    description:
      'Leads community screening campaigns and health-awareness initiatives.',
    about: [
      'SCOPH, the Standing Committee on Public Health, develops medical students as advocates for public health through campaigns, community-based learning, capacity building and advocacy. Its global streams include STOP TB, One Health, NCDs & healthy lifestyles, mental health, and climate change & health.',
      'AUSSS SCOPH runs awareness campaigns, screening drives and peer-education content, led by the Local Public Health Officer (LPO).',
    ],
    whatWeDo: [
      'Run community screening and health-awareness campaigns.',
      'Produce myth-busting public-health education for social channels.',
      'Mark world health days (World TB Day, World Diabetes Day, AMR Week).',
      'Deliver mental-health and healthy-lifestyle workshops.',
    ],
    activities: [
      {
        title: '“Myth or Fact? Diabetes” reel series',
        blurb:
          'AUSSS multi-part myth-versus-fact educational reels correcting common diabetes misconceptions.',
        type: 'Campaign',
        scope: 'AUSSS',
      },
      {
        title: '“Normal Sadness & Grief” mental-health workshop',
        blurb:
          'AUSSS × OSSS joint mental-health workshop facilitated by the two societies’ Mental Health Coordinators.',
        type: 'Workshop',
        scope: 'AUSSS',
      },
      {
        title: 'First Aid programme',
        blurb:
          'AUSSS runs a First Aid programme with a dedicated Local Coordinator.',
        type: 'Workshop',
        scope: 'AUSSS',
      },
      {
        title: 'Eyes on Diabetes, World Diabetes Day',
        blurb:
          'IFMSA-Egypt national WDD screening campaign (blood glucose, blood pressure, fundus exam) across local committees.',
        type: 'Campaign',
        scope: 'IFMSA-Egypt',
      },
      {
        title: 'World Antimicrobial Awareness Week',
        blurb:
          'IFMSA-Egypt AMR advocacy (“Save the Cure” / #WAAW), physical campaigns reaching thousands of students and the public.',
        type: 'Campaign',
        scope: 'IFMSA-Egypt',
      },
    ],
  },
  {
    name: 'Sexual & Reproductive Health & Rights',
    abbr: 'SCORA',
    color: '#bd202a',
    logo: '/assets/logos/SCORA.png',
    group: 'Standing Committee',
    officer: 'Local Officer on SRHR & HIV/AIDS',
    officerAbbr: 'LORA',
    holder: 'Noha Khalil',
    email: 'loraausss@gmail.com',
    photo: '/assets/team/noha-khalil.jpg',
    tagline: 'Peer education for sexual & reproductive health and rights.',
    description:
      'Delivers peer education on sexual & reproductive health and rights, including HIV & AIDS, gender, and bodily autonomy.',
    about: [
      'SCORA, the Standing Committee on Sexual and Reproductive Health and Rights including HIV and AIDS, equips members to advocate for SRHR in a culturally respectful way. Its focus areas span comprehensive sexuality education, maternal health, gender, gender-based violence, and HIV & STIs.',
      'AUSSS SCORA members, “SCORAngels”, run peer education and culturally sensitive awareness content and campaigns.',
    ],
    whatWeDo: [
      'Deliver peer education on sexual and reproductive health and rights.',
      'Run myth-busting and consent-awareness campaigns.',
      'Mark World AIDS Day and the International AIDS Candlelight Memorial.',
      'Support family-planning and anti-FGM awareness.',
    ],
    activities: [
      {
        title: '“Myth vs Fact: Contraception” carousel',
        blurb:
          'AUSSS educational content correcting contraception myths, including the myth that contraception causes infertility.',
        type: 'Campaign',
        scope: 'AUSSS',
      },
      {
        title: '“Consent is empowerment” campaign',
        blurb:
          'AUSSS campaign on informed, voluntary, ongoing consent, that silence is not consent and “no” must be respected.',
        type: 'Campaign',
        scope: 'AUSSS',
      },
      {
        title: 'Family Planning & Anti-FGM projects',
        blurb:
          'IFMSA-Egypt SCORA national projects on family planning and ending female genital mutilation.',
        type: 'Project',
        scope: 'IFMSA-Egypt',
      },
      {
        title: 'World AIDS Day & Candlelight Memorial',
        blurb:
          'Red-ribbon SCORAngels awareness for World AIDS Day and the International AIDS Candlelight Memorial (third Sunday of May).',
        type: 'Awareness Day',
        scope: 'IFMSA-Egypt',
      },
    ],
  },
  {
    name: 'Projects Support Division',
    abbr: 'PSD',
    color: '#107A72',
    logo: '/assets/logos/PSD.png',
    group: 'Support Division',
    officer: 'Division Director',
    officerAbbr: 'PSDD',
    holder: 'Amr Kamel',
    email: 'psddausss@gmail.com',
    photo: '/assets/team/amr-kamel.jpg',
    tagline: 'Quality and impact across every project.',
    description:
      'Oversees the project lifecycle, quality, and impact assessment across committees.',
    about: [
      'The Projects Support Division (PSD) oversees the full project lifecycle at AUSSS, from planning and quality assurance to impact assessment, so every committee’s activities are well-run and measurable.',
    ],
    whatWeDo: [
      'Support committees through project planning, execution and evaluation.',
      'Set quality standards and assess the impact of activities.',
      'Maintain project documentation and institutional memory.',
    ],
    activities: [
      {
        title: 'AUSSS Projects Support Division',
        blurb:
          'AUSSS maintains a Projects Support Division led by a PSD Director coordinating the project lifecycle across committees.',
        type: 'Project',
        scope: 'AUSSS',
      },
    ],
  },
  {
    name: 'Publications Support Division',
    abbr: 'PNSD',
    color: '#9F1547',
    logo: '/assets/logos/PNSD.png',
    group: 'Support Division',
    officer: 'Division Director',
    officerAbbr: 'PNSDD',
    holder: 'Ahmed Serry',
    email: 'aussspnsdd@gmail.com',
    photo: '/assets/team/ahmed-serry.jpg',
    tagline: 'The voice and visual identity of AUSSS.',
    description:
      'Drives AUSSS promotion and corporate identity, publications, promotional materials, social-media strategy, and the society’s official online platforms.',
    about: [
      'The Publications Support Division (PNSD) drives AUSSS’s promotion and corporate identity, publications, promotional materials, social-media strategy, and the society’s official online platforms.',
    ],
    whatWeDo: [
      'Design publications, manuals and promotional materials.',
      'Run AUSSS’s social-media strategy and brand identity.',
      'Build and maintain the society’s official online platforms.',
    ],
  },
  {
    name: 'Capacity Building Support Division',
    abbr: 'CBSD',
    color: '#1E1E17',
    logo: '/assets/logos/CBSD.png',
    group: 'Support Division',
    officer: 'Division Director',
    officerAbbr: 'CBSDD',
    holder: 'Ahmed Ezzat',
    email: 'aussscbsdd@gmail.com',
    photo: '/assets/team/ahmed-ezzat.jpg',
    tagline: 'Trainers, leaders and lifelong skills.',
    description:
      'Certifies trainers and runs leadership, soft-skill, and member development tracks.',
    about: [
      'The Capacity Building Support Division (CBSD) certifies trainers and runs leadership, soft-skill and member-development tracks, feeding the IFMSA trainer pathways that power workshops across every committee.',
    ],
    whatWeDo: [
      'Certify and develop trainers through the IFMSA training pathways.',
      'Run leadership and soft-skill development tracks for members.',
      'Support committees with capacity-building sessions.',
    ],
    activities: [
      {
        title: 'National trainings (CleoApaTrain, PHLT, IPET)',
        blurb:
          'Capacity-building feeds IFMSA-Egypt’s national trainings such as CleoApaTrain, PHLT and IPET, developing certified trainers.',
        type: 'Workshop',
        scope: 'IFMSA-Egypt',
      },
    ],
  },
  {
    name: 'Research Support Division',
    abbr: 'RSD',
    color: '#F7B826',
    logo: '/assets/logos/RSD.png',
    group: 'Support Division',
    officer: 'Division Director',
    officerAbbr: 'RSDD',
    holder: 'Sayma Rahman',
    email: 'rsddausss@gmail.com',
    photo: '/assets/team/sayma-rahman.jpg',
    tagline: 'Methodology, training and scientific output.',
    description:
      'Supports research methodology, training, and scientific output across the society.',
    about: [
      'The Research Support Division (RSD) supports research methodology, training and scientific output across AUSSS, equipping members and committees to produce sound, ethical research.',
    ],
    whatWeDo: [
      'Run research-methodology and scientific-writing training.',
      'Support members and committees with study design and ethics.',
      'Promote scientific output across the society.',
    ],
  },
]

// NOTE: the Hero's "Members" figure is dynamic — it reads MEMBERS_META.count
// from src/data/members.generated.js (regenerated from the membership xlsx).

// --- Slug helpers (used by the per-committee routes) ---------------------
// A committee may set an explicit `slug`; otherwise it's derived from abbr.
export const slugFor = (c) =>
  (c.slug || c.abbr || c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')

export const committeeBySlug = (slug) =>
  committees.find((c) => slugFor(c) === String(slug).toLowerCase())

// --- Society-wide info --------------------------------------------------
// Paste the society's public Google Calendar address into `calendarId`
// (e.g. "abc123@group.calendar.google.com") OR a full embed src URL.
export const society = {
  // Official name per Constitution §1.1.
  name: "Ain Shams University Students' Scientific Society",
  calendarId: '', // e.g. 'xxxxx@group.calendar.google.com'
  // Public contact = Secretary General (handles correspondence &
  // member communication per Constitution §4.2.2 / §8).
  contactEmail: 'ausss.secgen@gmail.com',
  // Official handle is `ausss_ainshams` per Constitution §14.2.5.
  // Stored as a full URL because it is consumed directly as a link href.
  instagram: 'https://instagram.com/ausss_ainshams',
  timezone: 'Africa/Cairo',
}

// --- Official social channels (Constitution §14.2) ---------------------
// `key` selects the brand icon in the Social page / footer.
// Facebook: the Constitution names the page but not its URL, paste the
// real page URL into `href` below (currently a placeholder).
export const socials = [
  {
    key: 'instagram',
    name: 'Instagram',
    handle: '@ausss_ainshams',
    href: 'https://instagram.com/ausss_ainshams',
    blurb: 'Events, announcements and campaigns.',
  },
  {
    key: 'facebook',
    name: 'Facebook',
    handle: 'Ain Shams University Students’ Scientific Society – AUSSS',
    href: 'https://www.facebook.com/ausssofficial',
    blurb: 'Events, announcements and campaigns.',
  },
  {
    key: 'tiktok',
    name: 'TikTok',
    handle: '@ausss_ainshams',
    href: 'https://www.tiktok.com/@ausss_ainshams',
    blurb: 'Campaign highlights and behind-the-scenes.',
  },
]

// --- IFMSA page copy (editable) ----------------------------------------
export const ifmsa = {
  intro:
    'The International Federation of Medical Students’ Associations (IFMSA) is one of the world’s oldest and largest student-run organisations. Founded in 1951, it represents, connects, and engages over a million medical students through National Member Organisations across more than 130 countries.',
  membership:
    'AUSSS is an autonomous affiliate member of IFMSA-Egypt, the National Member Organisation representing Egyptian medical students within IFMSA. Through IFMSA-Egypt, AUSSS is connected to a global federation of over a million medical students.',
  points: [
    {
      title: 'Global standing committees',
      body: 'IFMSA organises its work through standing committees on Professional & Research Exchange, Medical Education, Public Health, Human Rights & Peace, and Sexual & Reproductive Health, mirrored locally at AUSSS.',
    },
    {
      title: 'International exchange',
      body: 'Members access clinical and research clerkships hosted by partner faculties worldwide through the IFMSA exchange network.',
    },
    {
      title: 'Advocacy & representation',
      body: 'IFMSA brings the student voice to the WHO, UN, and other global health partners, advocating on health policy and medical education.',
    },
  ],
  links: [
    { label: 'ifmsa.org', href: 'https://ifmsa.org' },
    { label: 'ifmsa-egypt.org.eg', href: 'https://www.ifmsa-egypt.org.eg' },
  ],
}

// --- IFMSA / IFMSA-Egypt scale (sourced from ifmsa.org & ifmsa-egypt.org.eg)
// Used by the /ifmsa lineage band. Figures are approximate, as published.
export const ifmsaScale = {
  ifmsa: [
    { value: '1.5M+', label: 'Medical students' },
    { value: '133+', label: 'National organisations' },
    { value: '123', label: 'Countries' },
    { value: '15,000', label: 'Exchanges / year' },
  ],
  egypt: [
    { value: '1969', label: 'IFMSA-Egypt founded' },
    { value: '80,000', label: 'Egyptian med students' },
    { value: '31', label: 'Local committees' },
    { value: 'Ain Shams', label: 'AUSSS local committee' },
  ],
  // The federation lineage, rendered as a logo chain.
  lineage: [
    {
      name: 'IFMSA',
      logo: '/assets/ifmsa/ifmsa-horizontal-white.png',
      note: 'Global federation · founded 1951',
      href: 'https://ifmsa.org',
    },
    {
      name: 'IFMSA-Egypt',
      logo: '/assets/ifmsa/ifmsa-egypt-horizontal-white.png',
      note: 'National Member Organisation · founded 1969',
      href: 'https://www.ifmsa-egypt.org.eg',
    },
    {
      name: 'AUSSS',
      logo: '/assets/brand/ausss-horizontal-white.png',
      note: 'Ain Shams local committee · autonomous affiliate',
      href: '/',
    },
  ],
}

// --- IFMSA history timeline (drives /ifmsa/history) --------------------
// Founding years, name changes and blurbs taken from each committee's own
// page on ifmsa.org/standing-committees. `accent` is a dark-bg-readable
// colour (SCOME's true brand #100016 is near-black, so it gets a lighter
// accent here). `renames` lists the committee's previous names in order.
export const ifmsaHistory = {
  founded: {
    year: '1951',
    body: 'The International Federation of Medical Students’ Associations is founded — one of the world’s oldest and largest student-run organisations. Its work is organised through standing committees, each owning a field of global health. They were not all born at once: the federation grew committee by committee over the following four decades.',
  },
  // Chronological — ordered by founding year.
  committees: [
    {
      abbr: 'SCOPE',
      year: '1951',
      name: 'Standing Committee on Professional Exchange',
      accent: '#0181c1',
      logo: '/assets/logos/SCOPE.png',
      body: 'IFMSA’s very first standing committee, born with the federation itself. It started with just 8 European countries; by 1952 already 463 students had completed a clinical placement abroad. Today it is one of the largest student-run exchange programmes in the world — roughly 13,000 students a year across 100+ National Member Organisations — and is called the backbone of the federation, its longest-running project.',
    },
    {
      abbr: 'SCOME',
      year: '1951',
      name: 'Standing Committee on Medical Education',
      accent: '#a78bfa',
      logo: '/assets/logos/SCOME.png',
      body: 'Also one of IFMSA’s original 1951 committees. From the start it has been the forum where medical students act as full stakeholders in their own education — reforming curricula, training educators, and carrying the student voice into medical-education systems as the first quality-check of their own training.',
    },
    {
      abbr: 'SCOPH',
      year: '1952',
      name: 'Standing Committee on Public Health',
      accent: '#f47d3b',
      logo: '/assets/logos/SCOPH.png',
      body: 'Founded by students determined to prevent ill-health and shape policy. Its focus widened over six decades from students’ own health to global public health — prevention, health promotion, and health-policy advocacy on issues from antimicrobial resistance to climate and mental health.',
      renames: [
        { year: '1952', name: 'Standing Committee on Students’ Health (SCOSH)' },
        { year: '1963', name: 'Standing Committee on Health (SCOH)' },
        { year: '1983', name: 'Standing Committee on Public Health (SCOPH)' },
      ],
    },
    {
      abbr: 'SCORP',
      year: '1983',
      name: 'Standing Committee on Human Rights and Peace',
      accent: '#5f903f',
      logo: '/assets/logos/SCORP.png',
      body: 'Founded as the global refugee crisis came into the spotlight. Members soon realised relief alone was not enough — sustainable solutions meant addressing the root causes of conflict and human-rights abuses. Today it empowers students to promote and protect human rights, peace, refugee health, medical ethics and humanitarian aid.',
      renames: [
        { year: '1983', name: 'Standing Committee on Refugees (SCOR)' },
        { year: '1995', name: 'Standing Committee on Refugees and Peace' },
        { year: '2005', name: 'Standing Committee on Human Rights and Peace (SCORP)' },
      ],
    },
    {
      abbr: 'SCORE',
      year: '1991',
      name: 'Standing Committee on Research Exchange',
      accent: '#5b73d8',
      logo: '/assets/logos/SCORE.png',
      body: 'The research counterpart to SCOPE, created to give future physicians an international research clerkship — basic-lab, clinical, or global-action projects. It now connects 65+ National Member Organisations and over 3,000 research projects, placing more than 2,400 students a year, each entirely coordinated by student volunteers.',
    },
    {
      abbr: 'SCORA',
      year: '1992',
      name: 'Standing Committee on Sexual & Reproductive Health and Rights incl. HIV & AIDS',
      accent: '#e0454f',
      logo: '/assets/logos/SCORA.png',
      body: 'Founded out of a will to act on HIV, sexually transmitted infections, and the stigma around them, supporting people living with HIV/AIDS. Its scope grew to cover comprehensive sexuality education, maternal health, gender and gender-based violence. Its members are known as “SCORAngels”.',
      renames: [
        { year: '1992', name: 'Standing Committee on AIDS / Reproductive Health' },
        { year: '2014', name: 'Standing Committee on Sexual & Reproductive Health incl. HIV/AIDS' },
        { year: '2019', name: 'Standing Committee on SRHR incl. HIV & AIDS (SCORA)' },
      ],
    },
  ],
}

// --- Exchange programme copy (drives /exchange) ------------------------
export const exchange = {
  intro:
    'Exchange is IFMSA’s flagship programme, and one of the biggest reasons students join. Through SCOPE and SCORE, AUSSS members complete a four-week clinical or research clerkship abroad, while we host incoming students here at Ain Shams.',
  tracks: [
    {
      abbr: 'SCOPE',
      name: 'Professional Exchange',
      slug: 'scope',
      color: '#0181c1',
      blurb: 'A four-week clinical clerkship in a hospital abroad.',
    },
    {
      abbr: 'SCORE',
      name: 'Research Exchange',
      slug: 'score',
      color: '#2e4a9c',
      blurb:
        'A four-to-eight-week research project under an international mentor.',
    },
  ],
  // Two directions, toggled in the UI.
  directions: {
    outgoing: {
      label: 'Going abroad (outgoing)',
      points: [
        'Pick a country and project from the IFMSA exchange portal.',
        'Apply through AUSSS and IFMSA-Egypt with the required documents.',
        'Travel for a four-week (SCOPE) or four-to-eight-week (SCORE) clerkship.',
        'Get lodging, at least one meal a day, and a supervising doctor or mentor.',
        'Earn an official certificate with ≥80% attendance.',
      ],
    },
    incoming: {
      label: 'Hosting in Cairo (incoming)',
      points: [
        'Welcome students from around the world to Ain Shams hospitals.',
        'Buddy up as a contact person and run the social programme.',
        'Join IFMSA-Egypt National Weekends (Cairo, Alexandria, Dahab).',
        'Share Egyptian medicine and culture with future colleagues abroad.',
      ],
    },
  },
  // AUSSS application process (per the society's own exchange flow).
  timeline: [
    { step: 'Exchange Exam Registration', body: 'Wait for the Exchange Exam registration to open, then apply.' },
    { step: 'Interview', body: 'Attend your exchange interview.' },
    { step: 'Get your contract', body: 'Selected applicants are assigned their exchange contract.' },
    { step: 'Prepare & travel', body: 'Complete pre-departure preparation, then travel for your clerkship abroad.' },
    { step: 'Certificate', body: 'Finish with ≥80% attendance and receive your official certificate.' },
  ],
  links: [
    { label: 'IFMSA exchange portal', href: 'https://exchange.ifmsa.org' },
    { label: 'Egypt explore page', href: 'https://exchange.ifmsa.org/explore-pages/national/view/6' },
  ],
}

// --- Alumni / exchange testimonials ------------------------------------
// Real quotes only, never invent. `quote` is verbatim from the student's
// written testimony (only obvious typos corrected, voice preserved).
// Shape: { quote, name, track, destination, year, photo?, gallery? }
export const testimonials = [
  {
    // Hidden until written consent is obtained from Sama to publish her
    // quote and photos. Flip `published: true` to re-enable on /exchange.
    published: false,
    name: 'Sama ElKady',
    track: 'SCOPE · Cardiology',
    destination: 'Oman',
    year: '2025',
    photo: '/assets/exchange/sama-02.jpg',
    gallery: [
      '/assets/exchange/sama-01.jpg',
      '/assets/exchange/sama-03.jpg',
      '/assets/exchange/sama-04.jpg',
      '/assets/exchange/sama-05.jpg',
    ],
    quote:
      'Reflecting back, the experience exceeded all expectations. I never thought I’d come back with so many good memories that can fill a whole travel journal. What stands out the most is how amazingly beautiful Oman is — mountains, trees, people’s smiles and cheerfulness. The kindness and hospitality of the people made Oman feel like a home away from home; every encounter, from hospital to the local markets, was filled with warmth and openness. The cardiology team welcomed me into their daily routine and taught me skills I never thought I’d have at my age. Each day brought new learning opportunities that allowed me to grow personally and professionally in ways I never anticipated. This exchange was an unforgettable journey that will stay with me, and I would totally do it again!',
  },
]
