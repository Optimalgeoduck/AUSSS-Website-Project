// Committee trait profiles for the Sorting quiz.
//
// The quiz measures eight trait axes and matches each respondent to the
// committee/division whose *centroid* (target profile) their own profile is
// most similar to. This is what keeps the quiz honest: questions measure the
// person, and the committees are placed in the same trait space rather than
// being asked about directly.
//
// Axes
//   RIASEC, Holland's six vocational-interest types (the backbone). Anchored
//   on the openpsychometrics RIASEC dataset (~145k respondents).
//   COM / OPN, two Big-Five facets (Agreeableness "Compassion" and Openness)
//   from the IPIP Big-Five markers (~1M respondents), used to separate the six
//   "helping" committees, which all load on Social.
//
// Centroid design is grounded in each committee's real mission (society.js) and
// the validated interest×personality structure from Hurtado Rúa, Stead & Poklar
// (2019): Artistic–Openness r=.48, Enterprising–Extraversion r=.41,
// Social–Extraversion r=.31, Investigative–Openness r=.28, Social–Agreeableness
// r=.19. Values are on the quiz's normalised axis scale (roughly −1…+2), not a
// clinical metric, see scoreAnswers() in sortingQuiz.js.

export const AXES = ['R', 'I', 'A', 'S', 'E', 'C', 'COM', 'OPN']

// Friendly, non-clinical descriptions for the result-screen profile readout.
// `riasec: true` marks the six interest axes (shown as "your top interests").
export const AXIS_INFO = {
  R: { name: 'Realistic', label: 'the Maker', riasec: true, blurb: 'hands-on, practical, building real things' },
  I: { name: 'Investigative', label: 'the Investigator', riasec: true, blurb: 'curious, analytical, drawn to how things work' },
  A: { name: 'Artistic', label: 'the Creator', riasec: true, blurb: 'expressive, original, drawn to making things' },
  S: { name: 'Social', label: 'the Helper', riasec: true, blurb: 'warm, drawn to teaching, guiding and caring for people' },
  E: { name: 'Enterprising', label: 'the Organiser', riasec: true, blurb: 'driven, persuasive, drawn to leading and making things happen' },
  C: { name: 'Conventional', label: 'the Steward', riasec: true, blurb: 'orderly, dependable, drawn to structure and follow-through' },
  COM: { name: 'Compassion', label: 'a tender heart', riasec: false, blurb: 'feels others’ emotions and stands up for the vulnerable' },
  OPN: { name: 'Openness', label: 'an open mind', riasec: false, blurb: 'curious, imaginative and at home with the new and unfamiliar' },
}

// Each committee's target profile. Omitted axes default to 0. Negative Realistic
// across the board reflects that no AUSSS group is a hands-on/mechanical role, 
// R mainly pulls poor fits away. Provenance per group cites its mission line.
export const COMMITTEE_PROFILES = {
  // Signature axes are bold; each near-twin also carries a NEGATIVE weight on
  // its twin's signature axis so the two pull genuinely apart (e.g. SCORE is
  // anti-Conventional, RSD is anti-Openness).
  //
  // Professional Exchange, travel, new cultures, hosting → Openness + Social.
  // Anti-Conventional; lighter Compassion than SCORA keeps them apart.
  SCOPE: { OPN: 1.6, S: 1.1, E: 0.7, COM: 0.3, I: 0.2, C: -0.4 },
  // Research Exchange, international research clerkships → Investigative +
  // Openness (discovery, the world). Anti-Conventional separates it from RSD.
  SCORE: { I: 2.0, OPN: 1.3, S: 0.2, C: -0.5, R: -0.3 },
  // Medical Education, peer teaching, skills, curriculum → Social +
  // Investigative (teaching knowledge). The Investigative pull separates it
  // from the other Social committees.
  SCOME: { S: 1.4, I: 1.3, C: 0.5, COM: 0.4, E: 0.3, A: -0.2 },
  // Human Rights & Peace, advocacy for refugees, ethics, the overlooked →
  // Compassion + Social. Lower Openness/Artistic than SCORA keeps them apart.
  SCORP: { COM: 2.0, S: 1.3, OPN: 0.4, C: -0.3, A: -0.2 },
  // Public Health, community screening and campaigns → Enterprising +
  // Conventional (mobilise + run logistics) + Compassion + Social. The
  // organising axes lead, separating it from SCORP; the Social/Compassion
  // warmth separates it from PSD. Anti-Openness separates it from CBSD.
  SCOPH: { E: 1.5, C: 1.2, COM: 1.0, S: 1.0, OPN: -0.2 },
  // SRHR, peer education on sensitive topics, consent, stigma → Openness
  // (comfort with the taboo) + Compassion + creative campaigning. Openness +
  // Artistic separate it from SCORP.
  SCORA: { OPN: 1.7, COM: 1.1, A: 0.9, S: 0.7, C: -0.3 },
  // Projects Support, project lifecycle, quality, documentation → Conventional
  // + Enterprising. Anti-Social/Compassion separates it from SCOPH.
  PSD: { C: 2.0, E: 1.2, S: -0.2, COM: -0.2 },
  // Publications, brand, design, social, the society's voice → Artistic +
  // Enterprising + Openness.
  PNSD: { A: 2.0, E: 1.0, OPN: 1.0, S: -0.2, COM: -0.2 },
  // Capacity Building, trainers, leadership, member development → Enterprising
  // + Social + Openness (lead/inspire/grow people). Anti-Conventional separates
  // it from SCOPH.
  CBSD: { E: 1.6, S: 1.2, OPN: 0.8, COM: 0.3, C: -0.4 },
  // Research Support, methodology, scientific writing, rigour → Investigative
  // + strong Conventional. Anti-Openness separates it from SCORE.
  RSD: { I: 1.6, C: 1.8, OPN: -0.4, R: -0.1 },
}
