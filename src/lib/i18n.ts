// Report language modes + bilingual helpers.

export type ReportLang = "en" | "pa" | "both";

export function normalizeLang(v: unknown): ReportLang {
  return v === "en" || v === "pa" || v === "both" ? v : "both";
}

// Pick a plain string for the chosen mode. Punjabi falls back to English when
// no translation is supplied. In "both" mode returns "EN / PA" (or just EN).
export function pick(en: string, pa: string | undefined | null, lang: ReportLang): string {
  const p = (pa || "").trim();
  if (lang === "en") return en;
  if (lang === "pa") return p || en;
  return p ? `${en} / ${p}` : en;
}

export const LANG_LABEL: Record<ReportLang, string> = {
  en: "English",
  pa: "ਪੰਜਾਬੀ (Punjabi)",
  both: "Bilingual (English + Punjabi)",
};

// UI / section strings used across the reports. pa falls back to en if empty.
export const UI: Record<string, { en: string; pa: string }> = {
  // statuses
  highly: { en: "Highly Dominant", pa: "ਬਹੁਤ ਪ੍ਰਬਲ" },
  dominant: { en: "Dominant", pa: "ਪ੍ਰਬਲ" },
  less: { en: "Less Dominant", pa: "ਘੱਟ ਪ੍ਰਬਲ" },
  attention: { en: "Need Attention", pa: "ਧਿਆਨ ਲੋੜੀਂਦਾ" },
  high: { en: "High Dominant", pa: "ਬਹੁਤ ਪ੍ਰਬਲ" },

  // common labels
  score: { en: "Score", pa: "ਅੰਕ" },
  percent: { en: "Percent", pa: "ਪ੍ਰਤੀਸ਼ਤ" },
  rank: { en: "Rank", pa: "ਦਰਜਾ" },
  status: { en: "Status", pa: "ਸਥਿਤੀ" },
  skill: { en: "Skill", pa: "ਹੁਨਰ" },
  date: { en: "Date", pa: "ਮਿਤੀ" },
  reportDate: { en: "Report Date", pa: "ਰਿਪੋਰਟ ਮਿਤੀ" },

  // student profile labels
  name: { en: "Name", pa: "ਨਾਮ" },
  fatherName: { en: "Father Name", pa: "ਪਿਤਾ ਦਾ ਨਾਮ" },
  motherName: { en: "Mother Name", pa: "ਮਾਤਾ ਦਾ ਨਾਮ" },
  mobile: { en: "Mobile", pa: "ਮੋਬਾਈਲ" },
  otherMobile: { en: "Other Mobile", pa: "ਹੋਰ ਮੋਬਾਈਲ" },
  dob: { en: "Date of Birth", pa: "ਜਨਮ ਮਿਤੀ" },
  classCourse: { en: "Class / Course", pa: "ਕਲਾਸ / ਕੋਰਸ" },
  qualification: { en: "Qualification", pa: "ਯੋਗਤਾ" },
  category: { en: "Category", pa: "ਸ਼੍ਰੇਣੀ" },
  school: { en: "School", pa: "ਸਕੂਲ" },
  email: { en: "Email", pa: "ਈਮੇਲ" },
  contact: { en: "Contact No", pa: "ਸੰਪਰਕ ਨੰ." },
  city: { en: "City", pa: "ਸ਼ਹਿਰ" },
  address: { en: "Address", pa: "ਪਤਾ" },
  aim: { en: "Aim / Goal", pa: "ਟੀਚਾ" },
  venue: { en: "Venue", pa: "ਸਥਾਨ" },

  // section headings
  studentProfile: { en: "Student Profile", pa: "ਵਿਦਿਆਰਥੀ ਪ੍ਰੋਫਾਈਲ" },
  welcome: { en: "Welcome", pa: "ਜੀ ਆਇਆਂ ਨੂੰ" },
  coreSkills: { en: "12 Core Life Skills", pa: "12 ਮੁੱਖ ਜੀਵਨ ਹੁਨਰ" },
  softSkillTheory: { en: "Theory of Soft Skills", pa: "ਸਾਫਟ ਸਕਿੱਲ ਸਿਧਾਂਤ" },
  categories: { en: "Skill Categories", pa: "ਹੁਨਰ ਸ਼੍ਰੇਣੀਆਂ" },
  riasecTitle: { en: "RIASEC Career Interests", pa: "RIASEC ਕਰੀਅਰ ਰੁਚੀਆਂ" },
  careerSuggestions: { en: "Career Suggestions", pa: "ਕਰੀਅਰ ਸੁਝਾਅ" },
  potentialOfSkills: { en: "Potential of Skills", pa: "ਹੁਨਰਾਂ ਦੀ ਸਮਰੱਥਾ" },
  miTheory: { en: "Multiple Intelligence Theory", pa: "ਬਹੁ-ਬੁੱਧੀ ਸਿਧਾਂਤ" },
  mackenzie: { en: "Mackenzie's Theory", pa: "ਮੈਕੈਂਜ਼ੀ ਸਿਧਾਂਤ" },
  gardner: { en: "Gardner's Multiple Intelligences", pa: "ਗਾਰਡਨਰ ਦੀਆਂ ਬਹੁ-ਬੁੱਧੀਆਂ" },
  big5: { en: "The Big 5 Personality Test", pa: "ਬਿਗ 5 ਸ਼ਖਸੀਅਤ ਟੈਸਟ" },
  counsellor: { en: "Counsellor Recommendation", pa: "ਕਾਊਂਸਲਰ ਸਿਫ਼ਾਰਸ਼" },
  finalReco: { en: "Final Counsellor Recommendation", pa: "ਅੰਤਿਮ ਕਾਊਂਸਲਰ ਸਿਫ਼ਾਰਸ਼" },
  recommendations: { en: "Recommendations", pa: "ਸਿਫ਼ਾਰਸ਼ਾਂ" },
  suggestedStream: { en: "Suggested Stream Selection", pa: "ਸੁਝਾਏ ਸਟਰੀਮ ਦੀ ਚੋਣ" },
  focusAreas: { en: "Focus Areas for Improvement", pa: "ਸੁਧਾਰ ਲਈ ਧਿਆਨ ਖੇਤਰ" },
  intelligenceType: { en: "Intelligence Type", pa: "ਬੁੱਧੀ ਦੀ ਕਿਸਮ" },
  overallSkillIndex: { en: "Overall Skill Index", pa: "ਕੁੱਲ ਹੁਨਰ ਸੂਚਕ" },
  topInterest: { en: "Top Career Interest", pa: "ਮੁੱਖ ਕਰੀਅਰ ਰੁਚੀ" },
  topStrengths: { en: "Top Strengths", pa: "ਮੁੱਖ ਖੂਬੀਆਂ" },
  definition: { en: "Definition", pa: "ਪਰਿਭਾਸ਼ਾ" },
  value: { en: "Value", pa: "ਮਹੱਤਵ" },
  potential: { en: "Student Potential", pa: "ਵਿਦਿਆਰਥੀ ਸਮਰੱਥਾ" },
  recommendation: { en: "Recommendation", pa: "ਸਿਫ਼ਾਰਸ਼" },
  careerFields: { en: "Career fields", pa: "ਕਰੀਅਰ ਖੇਤਰ" },
  typicalTraits: { en: "Typical traits", pa: "ਆਮ ਗੁਣ" },
  completeSnapshot: { en: "Complete Skill Snapshot", pa: "ਪੂਰਾ ਹੁਨਰ ਝਲਕ" },
  congratulations: { en: "Congratulations!", pa: "ਵਧਾਈਆਂ!" },
  thanksMsg: { en: "We wish you success in unlocking your full potential!", pa: "ਅਸੀਂ ਤੁਹਾਡੀ ਪੂਰੀ ਸਮਰੱਥਾ ਖੋਲ੍ਹਣ ਵਿੱਚ ਸਫਲਤਾ ਦੀ ਕਾਮਨਾ ਕਰਦੇ ਹਾਂ!" },
  learningStyle: { en: "Learning style", pa: "ਸਿੱਖਣ ਦਾ ਢੰਗ" },
  roles: { en: "Roles", pa: "ਭੂਮਿਕਾਵਾਂ" },
  personality: { en: "Personality", pa: "ਸ਼ਖਸੀਅਤ" },
  environment: { en: "Environment", pa: "ਵਾਤਾਵਰਨ" },
  values: { en: "Values", pa: "ਕਦਰਾਂ" },
  aptitudes: { en: "Aptitudes", pa: "ਯੋਗਤਾਵਾਂ" },
};

export function ui(key: keyof typeof UI | string, lang: ReportLang): string {
  const e = UI[key as string];
  if (!e) return String(key);
  return pick(e.en, e.pa, lang);
}

// ---- Punjabi content (keyed by lib keys; English used as fallback elsewhere) ----

// Employee 12-skill definitions
export const SKILL_DEF_PA: Record<string, string> = {
  confidence: "ਕੰਮ ਨੂੰ ਅਸਰਦਾਰ ਢੰਗ ਨਾਲ ਕਰਨ ਅਤੇ ਚੁਣੌਤੀਆਂ ਨੂੰ ਆਤਮ-ਵਿਸ਼ਵਾਸ ਨਾਲ ਸੰਭਾਲਣ ਦੀ ਯੋਗਤਾ।",
  emotional: "ਘਟਨਾਵਾਂ ਪ੍ਰਤੀ ਭਾਵਨਾਵਾਂ ਨੂੰ ਕਾਬੂ ਕਰਨ ਅਤੇ ਦਬਾਅ ਹੇਠ ਸ਼ਾਂਤ ਰਹਿਣ ਦੀ ਯੋਗਤਾ।",
  aggressive: "ਜ਼ਰੂਰਤ ਵੇਲੇ ਪਹਿਲ ਕਰਨ ਅਤੇ ਆਪਣੇ ਟੀਚਿਆਂ ਲਈ ਦ੍ਰਿੜ੍ਹਤਾ ਨਾਲ ਡਟੇ ਰਹਿਣ ਦੀ ਯੋਗਤਾ।",
  environment: "ਨਵੇਂ ਮਾਹੌਲ, ਲੋਕਾਂ ਜਾਂ ਬਦਲਦੇ ਹਾਲਾਤਾਂ ਅਨੁਸਾਰ ਆਪਣੇ ਆਪ ਨੂੰ ਢਾਲਣ ਦੀ ਯੋਗਤਾ।",
  attitude: "ਜੀਵਨ, ਚੁਣੌਤੀਆਂ ਅਤੇ ਜ਼ਿੰਮੇਵਾਰੀਆਂ ਪ੍ਰਤੀ ਵਿਅਕਤੀ ਦੀ ਸਮੁੱਚੀ ਸੋਚ ਅਤੇ ਪਹੁੰਚ।",
  time: "ਉਪਲਬਧ ਸਮੇਂ ਅੰਦਰ ਕੰਮਾਂ ਨੂੰ ਯੋਜਨਾਬੱਧ ਤਰੀਕੇ ਨਾਲ ਪੂਰਾ ਕਰਨ ਦੀ ਯੋਗਤਾ।",
  vision: "ਲੰਮੇ ਸਮੇਂ ਦੇ ਟੀਚਿਆਂ ਅਤੇ ਜੀਵਨ ਦੀ ਦਿਸ਼ਾ ਬਾਰੇ ਸਪਸ਼ਟਤਾ।",
  decision: "ਹਾਲਾਤਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਕੇ ਸਹੀ ਫ਼ੈਸਲਾ ਲੈਣ ਦੀ ਯੋਗਤਾ।",
  regard: "ਦੂਜਿਆਂ ਪ੍ਰਤੀ ਹਮਦਰਦੀ, ਸਤਿਕਾਰ ਅਤੇ ਨਿਯਮਾਂ ਦੀ ਪਾਲਣਾ।",
  computer: "ਡਿਜੀਟਲ ਸੰਦਾਂ ਅਤੇ ਤਕਨਾਲੋਜੀ ਨੂੰ ਵਰਤਣ ਵਿੱਚ ਸਹੂਲਤ ਅਤੇ ਮੁਹਾਰਤ।",
  spoken: "ਵਿਚਾਰਾਂ ਨੂੰ ਸਪਸ਼ਟ ਅਤੇ ਆਤਮ-ਵਿਸ਼ਵਾਸ ਨਾਲ ਜ਼ੁਬਾਨੀ ਪ੍ਰਗਟ ਕਰਨ ਦੀ ਯੋਗਤਾ।",
  numeric: "ਅੰਕੜਿਆਂ ਨੂੰ ਸਮਝਣ, ਗਣਨਾ ਕਰਨ ਅਤੇ ਤਰਕ ਲਾਉਣ ਦੀ ਯੋਗਤਾ।",
};

// Category labels (employee + student categories)
export const CATEGORY_PA: Record<string, string> = {
  behaviour: "ਵਿਹਾਰ", stability: "ਸਥਿਰਤਾ", personality: "ਸ਼ਖਸੀਅਤ", lifestyle: "ਜੀਵਨ ਸ਼ੈਲੀ",
  future: "ਭਵਿੱਖ", creative: "ਰਚਨਾਤਮਕ", academic: "ਅਕਾਦਮਿਕ", identity: "ਪਛਾਣ",
  intrapersonal: "ਅੰਤਰ-ਆਤਮਿਕ", nextgen: "ਨੈਕਸਟਜੈਨ ਹੁਨਰ",
};

// Student 8 intelligences — descriptions
export const INT_DESC_PA: Record<string, string> = {
  linguistic: "ਸ਼ਬਦਾਂ ਅਤੇ ਭਾਸ਼ਾ — ਲਿਖਤੀ ਤੇ ਜ਼ੁਬਾਨੀ; ਵਿਚਾਰਾਂ ਨੂੰ ਯਾਦ ਰੱਖਣ, ਸਮਝਣ ਤੇ ਪ੍ਰਗਟ ਕਰਨ ਦੀ ਯੋਗਤਾ।",
  logical: "ਤਰਕਪੂਰਨ ਸੋਚ, ਪੈਟਰਨ ਪਛਾਣਨਾ, ਵਿਗਿਆਨਕ ਤਰਕ ਅਤੇ ਗਣਨਾ ਕਰਨ ਦੀ ਯੋਗਤਾ।",
  musical: "ਸੰਗੀਤਕ ਯੋਗਤਾ, ਆਵਾਜ਼ ਦੀ ਸਮਝ ਅਤੇ ਤਾਲ ਤੇ ਸੁਰ ਦੇ ਪੈਟਰਨ ਪਛਾਣਨਾ।",
  kinesthetic: "ਸਰੀਰਕ ਹਰਕਤ 'ਤੇ ਕਾਬੂ, ਹੱਥਾਂ ਦੀ ਚੁਸਤੀ, ਚੁਸਤੀ ਅਤੇ ਸੰਤੁਲਨ।",
  spatial: "ਦ੍ਰਿਸ਼ਟੀ ਅਤੇ ਸਥਾਨਿਕ ਸਮਝ; ਚਿੱਤਰਾਂ ਦੀ ਕਲਪਨਾ ਅਤੇ ਰਚਨਾ।",
  interpersonal: "ਦੂਜਿਆਂ ਦੀਆਂ ਭਾਵਨਾਵਾਂ ਨੂੰ ਸਮਝਣ ਅਤੇ ਲੋਕਾਂ ਨਾਲ ਜੁੜਨ ਦੀ ਯੋਗਤਾ।",
  intrapersonal: "ਆਤਮ-ਚੇਤਨਾ, ਆਤਮ-ਚਿੰਤਨ ਅਤੇ ਆਪਣੇ ਆਪ ਨੂੰ ਸਮਝਣ ਦੀ ਯੋਗਤਾ।",
  naturalist: "ਕੁਦਰਤ ਨੂੰ ਘੋਖਣਾ, ਸੰਗ੍ਰਹਿ ਬਣਾਉਣਾ ਅਤੇ ਕੁਦਰਤੀ ਬਦਲਾਅ ਨੂੰ ਧਿਆਨ ਨਾਲ ਵੇਖਣਾ।",
};

// Student intelligence short labels (chart/table)
export const INT_LABEL_PA: Record<string, string> = {
  linguistic: "ਭਾਸ਼ਾਈ", logical: "ਤਰਕ-ਗਣਿਤ", musical: "ਸੰਗੀਤਕ", kinesthetic: "ਸਰੀਰਕ-ਗਤੀ",
  spatial: "ਦ੍ਰਿਸ਼ਟੀ-ਸਥਾਨਿਕ", interpersonal: "ਅੰਤਰ-ਵਿਅਕਤੀਗਤ", intrapersonal: "ਆਤਮ-ਚੇਤਨਾ", naturalist: "ਪ੍ਰਕਿਰਤੀਵਾਦੀ",
};

export const RIASEC_LABEL_PA: Record<string, string> = {
  realistic: "ਯਥਾਰਥਵਾਦੀ", investigative: "ਖੋਜੀ", artistic: "ਕਲਾਤਮਕ",
  social: "ਸਮਾਜਿਕ", enterprising: "ਉੱਦਮੀ", conventional: "ਪਰੰਪਰਾਗਤ",
};

export const BIG5_LABEL_PA: Record<string, string> = {
  E: "ਬਹਿਰਮੁਖਤਾ", A: "ਸਹਿਮਤੀਸ਼ੀਲਤਾ", C: "ਜ਼ਿੰਮੇਵਾਰੀ", N: "ਭਾਵੁਕਤਾ", O: "ਖੁੱਲ੍ਹਾਪਣ",
};

export const DOMAIN_PA: Record<string, string> = {
  analytical: "ਵਿਸ਼ਲੇਸ਼ਣਾਤਮਕ", interactive: "ਪਰਸਪਰ", introspective: "ਅੰਤਰ-ਨਿਰੀਖਣ",
};
