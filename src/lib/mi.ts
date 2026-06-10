// Multiple Intelligences (Howard Gardner) engine for the School Student test
// (Class 9–10). 70 statements scored 1–4, mapped to 8 intelligences.
// Produces the report parameters used by the student MI report format.

export type IntKey =
  | "linguistic"
  | "logical"
  | "musical"
  | "kinesthetic"
  | "spatial"
  | "interpersonal"
  | "intrapersonal"
  | "naturalist";

export interface IntelligenceDef {
  key: IntKey;
  en: string;
  pa: string;
  short: string; // short label for charts
  domain: "analytical" | "interactive" | "introspective";
  description: string;
  learningStyle: string;
  roles: string;
}

export const INTELLIGENCES: IntelligenceDef[] = [
  {
    key: "linguistic",
    en: "Verbal–Linguistic",
    pa: "ਭਾਸ਼ਾਈ",
    short: "Linguistic",
    domain: "interactive",
    description:
      "Words and language, written and spoken; retention, interpretation and explanation of ideas and information via language.",
    learningStyle: "Words and language",
    roles: "Writers, lawyers, journalists, teachers, poets, editors, translators, presenters.",
  },
  {
    key: "logical",
    en: "Logical–Mathematical",
    pa: "ਤਰਕ–ਗਣਿਤ",
    short: "Logical",
    domain: "analytical",
    description:
      "Logical thinking, detecting patterns, scientific reasoning and deduction; performing calculations and understanding cause and effect.",
    learningStyle: "Numbers and logic",
    roles: "Scientists, engineers, computer experts, accountants, analysts, researchers.",
  },
  {
    key: "musical",
    en: "Musical",
    pa: "ਸੰਗੀਤਕ",
    short: "Musical",
    domain: "analytical",
    description:
      "Musical ability, awareness, appreciation and use of sound; recognition of tonal and rhythmic patterns.",
    learningStyle: "Music, sounds, rhythm",
    roles: "Musicians, singers, composers, DJs, producers, voice coaches.",
  },
  {
    key: "kinesthetic",
    en: "Bodily–Kinesthetic",
    pa: "ਸਰੀਰਕ–ਗਤੀ",
    short: "Kinesthetic",
    domain: "interactive",
    description:
      "Body movement control, manual dexterity, physical agility and balance; eye and body coordination.",
    learningStyle: "Physical experience and movement",
    roles: "Dancers, actors, athletes, surgeons, crafts-people, chefs, adventurers.",
  },
  {
    key: "spatial",
    en: "Spatial–Visual",
    pa: "ਦ੍ਰਿਸ਼ਟੀ–ਸਥਾਨਿਕ",
    short: "Spatial",
    domain: "introspective",
    description:
      "Visual and spatial perception; interpretation and creation of visual images; pictorial imagination and expression.",
    learningStyle: "Pictures, shapes, images, 3D space",
    roles: "Artists, designers, architects, photographers, sculptors, inventors.",
  },
  {
    key: "interpersonal",
    en: "Interpersonal",
    pa: "ਅੰਤਰ–ਵਿਅਕਤੀਗਤ",
    short: "Interpersonal",
    domain: "interactive",
    description:
      "Perception of other people's feelings; ability to relate to others; interpretation of behaviour and communication.",
    learningStyle: "Human contact, cooperation, teamwork",
    roles: "Therapists, HR professionals, leaders, counsellors, teachers, sales people.",
  },
  {
    key: "intrapersonal",
    en: "Intrapersonal",
    pa: "ਆਤਮ–ਚੇਤਨਾ",
    short: "Intrapersonal",
    domain: "introspective",
    description:
      "Self-awareness, self-reflection, personal objectivity; the capability to understand oneself and one's relationship to others.",
    learningStyle: "Self-study and reflection",
    roles: "Self-aware roles, planners, researchers, entrepreneurs, writers.",
  },
  {
    key: "naturalist",
    en: "Naturalist",
    pa: "ਪ੍ਰਕਿਰਤੀਵਾਦੀ",
    short: "Naturalist",
    domain: "analytical",
    description:
      "Exploring nature, making collections, observing natural changes and patterns through keen sensory observation.",
    learningStyle: "Observing the natural world",
    roles: "Veterinarians, botanists, farmers, environmentalists, nature guides, scientists.",
  },
];

export const INT_MAP: Record<IntKey, IntelligenceDef> = Object.fromEntries(
  INTELLIGENCES.map((i) => [i.key, i])
) as Record<IntKey, IntelligenceDef>;

// Default question order -> intelligence (admin-editable thereafter).
export const STUDENT_QUESTION_MAP: Record<number, IntKey> = {
  1: "intrapersonal", 2: "musical", 3: "kinesthetic", 4: "musical", 5: "logical",
  6: "linguistic", 7: "kinesthetic", 8: "linguistic", 9: "linguistic", 10: "logical",
  11: "logical", 12: "intrapersonal", 13: "musical", 14: "linguistic", 15: "kinesthetic",
  16: "intrapersonal", 17: "logical", 18: "musical", 19: "interpersonal", 20: "logical",
  21: "spatial", 22: "kinesthetic", 23: "linguistic", 24: "naturalist", 25: "musical",
  26: "spatial", 27: "interpersonal", 28: "intrapersonal", 29: "logical", 30: "naturalist",
  31: "linguistic", 32: "logical", 33: "linguistic", 34: "kinesthetic", 35: "kinesthetic",
  36: "interpersonal", 37: "spatial", 38: "kinesthetic", 39: "musical", 40: "logical",
  41: "intrapersonal", 42: "kinesthetic", 43: "interpersonal", 44: "spatial", 45: "spatial",
  46: "interpersonal", 47: "kinesthetic", 48: "spatial", 49: "logical", 50: "intrapersonal",
  51: "musical", 52: "linguistic", 53: "kinesthetic", 54: "logical", 55: "intrapersonal",
  56: "intrapersonal", 57: "intrapersonal", 58: "interpersonal", 59: "spatial", 60: "linguistic",
  61: "spatial", 62: "interpersonal", 63: "interpersonal", 64: "musical", 65: "interpersonal",
  66: "musical", 67: "naturalist", 68: "spatial", 69: "intrapersonal", 70: "interpersonal",
};

// 1–4 agreement scale (with Punjabi)
export const STUDENT_SCALE = [
  { value: 1, en: "Mostly Disagree", pa: "ਜ਼ਿਆਦਾਤਰ ਅਸਹਿਮਤ" },
  { value: 2, en: "Slightly Disagree", pa: "ਥੋੜ੍ਹਾ ਅਸਹਿਮਤ" },
  { value: 3, en: "Slightly Agree", pa: "ਥੋੜ੍ਹਾ ਸਹਿਮਤ" },
  { value: 4, en: "Mostly Agree", pa: "ਜ਼ਿਆਦਾਤਰ ਸਹਿਮਤ" },
];

export type MIStatus = "high" | "dominant" | "less" | "attention";
export const MI_STATUS_LABEL: Record<MIStatus, string> = {
  high: "High Dominant",
  dominant: "Dominant",
  less: "Less Dominant",
  attention: "Need Attention",
};
export const MI_STATUS_COLOR: Record<MIStatus, string> = {
  high: "#15803d",
  dominant: "#1d4ed8",
  less: "#b45309",
  attention: "#b91c1c",
};
// Bands applied to the intelligence's share-of-total percentage.
export function miStatus(percent: number): MIStatus {
  if (percent >= 13) return "high";
  if (percent >= 9) return "dominant";
  if (percent >= 7) return "less";
  return "attention";
}

// Mackenzie domains
export const MACKENZIE = [
  {
    key: "analytical",
    label: "Analytical",
    members: ["logical", "musical", "naturalist"] as IntKey[],
    blurb:
      "The analytical domain consists of the logical, musical and naturalist intelligences — those that promote analysing and incorporating data in accumulating knowledge.",
  },
  {
    key: "interactive",
    label: "Interactive",
    members: ["linguistic", "interpersonal", "kinesthetic"] as IntKey[],
    blurb:
      "The interactive domain consists of the verbal, interpersonal and kinesthetic intelligences — those learners typically employ to express themselves and explore their environment.",
  },
  {
    key: "introspective",
    label: "Introspective",
    members: ["intrapersonal", "spatial"] as IntKey[],
    blurb:
      "The introspective domain consists of the intrapersonal and visual intelligences — those that promote learning through one's own experiences and beliefs.",
  },
];

// RIASEC derived from intelligences (score out of 10) + descriptive content.
export interface RiasecMI {
  key: string;
  label: string;
  members: IntKey[];
  tagline: string;
  personality: string;
  values: string;
  aptitudes: string;
  learning: string;
  environment: string;
}
export const RIASEC_MI: RiasecMI[] = [
  {
    key: "realistic", label: "Realistic", members: ["kinesthetic", "naturalist", "spatial"],
    tagline: "Hands-on knowledge, Building, Physical activity, Outdoors",
    personality: '"Realistic" types tend to be tough, genuine, natural and practical. They love action.',
    values: "Common sense, pragmatism and effort.",
    aptitudes: "Dexterity, comfortable with technical tasks, mechanical intelligence and physical stamina.",
    learning: "Learn through a concrete and practical approach by applying examples.",
    environment: "Comfortable in environments that allow concrete results and use of technical equipment; dislike being confined to an office.",
  },
  {
    key: "investigative", label: "Investigative", members: ["logical", "naturalist", "intrapersonal"],
    tagline: "Research, Learning, Science, Technology",
    personality: '"Investigative" types are curious about everything, constantly seeking to learn and understand. They are precise, intellectual and scientific.',
    values: "Intellectual curiosity, critical thinking and logic.",
    aptitudes: "Research, logical reasoning, learning and analytical capabilities.",
    learning: "Learn by theory and systematic research.",
    environment: "Comfortable in changing, thought-oriented environments that favour expertise over productivity.",
  },
  {
    key: "artistic", label: "Artistic", members: ["musical", "spatial", "linguistic"],
    tagline: "Feeling, Passion, Design, Creation",
    personality: '"Artistic" types tend to be intuitive, creative, idealistic and independent, attuned to art and aesthetics.',
    values: "Beauty, originality, imagination and freedom.",
    aptitudes: "Creativity, artistic expression and intuition.",
    learning: "Learn by intuition and experimental action.",
    environment: "Comfortable in nonconformist environments that favour informal communication and require creativity.",
  },
  {
    key: "social", label: "Social", members: ["interpersonal", "linguistic"],
    tagline: "Conveying, Understanding others, Communicating, Relationships",
    personality: '"Social" types are patient, understanding and attentive to others; kind, warm and welcoming.',
    values: "Altruism, cooperation and generosity.",
    aptitudes: "Empathy, listening and communication.",
    learning: "Learn by sharing with others and working as a team.",
    environment: "Comfortable in social environments encouraging personal contact, collaboration and communication.",
  },
  {
    key: "enterprising", label: "Enterprising", members: ["interpersonal", "logical", "kinesthetic"],
    tagline: "Taking action, Undertaking projects, Leading, Managing",
    personality: '"Enterprising" types tend to be open, dynamic, assertive and entrepreneurial.',
    values: "Risk taking, status and competition.",
    aptitudes: "Initiative, ability to lead and motivate others.",
    learning: "Learn by doing and putting themselves in the action.",
    environment: "Comfortable in competitive environments where they can take risks and move up quickly.",
  },
  {
    key: "conventional", label: "Conventional", members: ["logical", "intrapersonal"],
    tagline: "Planning, Structuring, Processing data, figures",
    personality: '"Conventional" types tend to be meticulous, perfectionist, conformist and rather introverted.',
    values: "Accuracy, stability and efficiency.",
    aptitudes: "Data analysis, attention to detail and ability to work with numbers.",
    learning: "Learn by following rules, instructions and established procedures.",
    environment: "Feel at home in structured, hierarchical environments with clearly defined rules.",
  },
];

export function riasecStatus(score10: number): string {
  if (score10 >= 6) return "Dominant";
  if (score10 >= 4) return "Average Dominant";
  return "Developing";
}

// Big Five (derived from intelligences), each scored 0–40.
export const BIG5 = [
  { key: "E", label: "Extroversion", members: ["interpersonal", "kinesthetic"] as IntKey[], invert: false,
    desc: "Seeking fulfilment from sources outside the self. High scorers are very social; low scorers prefer to work alone." },
  { key: "A", label: "Agreeableness", members: ["interpersonal", "intrapersonal"] as IntKey[], invert: false,
    desc: "How much individuals adjust their behaviour to suit others. High scorers are polite and like people." },
  { key: "C", label: "Conscientiousness", members: ["logical", "intrapersonal"] as IntKey[], invert: false,
    desc: "Being honest and hardworking. High scorers follow rules and stay organised." },
  { key: "N", label: "Neuroticism", members: ["intrapersonal"] as IntKey[], invert: true,
    desc: "The trait of being emotional. Lower scores indicate greater emotional stability." },
  { key: "O", label: "Openness", members: ["musical", "spatial", "linguistic", "naturalist"] as IntKey[], invert: false,
    desc: "Seeking new experience and intellectual pursuits. High scorers are imaginative and curious." },
];

// MI-based career clusters (match %), with intelligence weights.
export const CAREER_CLUSTERS: { label: string; members: IntKey[] }[] = [
  { label: "Music (Singing / Instruments / Composing)", members: ["musical", "kinesthetic"] },
  { label: "Medical (Doctor / Surgeon / Nurse)", members: ["naturalist", "logical", "interpersonal"] },
  { label: "Engineering & IT", members: ["logical", "spatial"] },
  { label: "Designing (Graphics / Fashion / Interior)", members: ["spatial", "musical"] },
  { label: "Management (HR / Finance / Operations)", members: ["interpersonal", "logical"] },
  { label: "Accounts & Audit", members: ["logical", "intrapersonal"] },
  { label: "Education / Teaching / Training", members: ["linguistic", "interpersonal"] },
  { label: "Sports (Player / Coach / Sports Mgmt)", members: ["kinesthetic", "interpersonal"] },
  { label: "Media & Mass Communication", members: ["linguistic", "interpersonal", "spatial"] },
  { label: "Acting / Modelling / Anchoring", members: ["kinesthetic", "linguistic", "interpersonal"] },
  { label: "Counselling / Psychology", members: ["interpersonal", "intrapersonal", "linguistic"] },
  { label: "Environment / Agriculture / Nature", members: ["naturalist", "logical"] },
];

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------
export interface MIQuestionInput { id: string; order: number; intelligence: string; reverse: boolean; }
export interface MIAnswerInput { questionId: string; value: number; }

export interface IntResult {
  key: IntKey; label: string; short: string; score: number; max: number;
  count: number; percent: number; rank: number; status: MIStatus; statusLabel: string;
}
export interface MIReportData {
  intelligences: IntResult[];
  total: number;
  domains: { key: string; label: string; percent: number; blurb: string }[];
  riasec: { key: string; label: string; score10: number; status: string; tagline: string;
    personality: string; values: string; aptitudes: string; learning: string; environment: string }[];
  big5: { key: string; label: string; score: number; desc: string }[];
  careers: { label: string; match: number; top: boolean }[];
  topIntelligences: string[];
  generatedAt: string;
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function computeMIReport(
  questions: MIQuestionInput[],
  answers: MIAnswerInput[],
  generatedAt: string
): MIReportData {
  const ans = new Map<string, number>();
  for (const a of answers) ans.set(a.questionId, a.value);

  const acc: Record<string, { sum: number; count: number }> = {};
  for (const i of INTELLIGENCES) acc[i.key] = { sum: 0, count: 0 };
  for (const q of questions) {
    const k = (q.intelligence || "") as IntKey;
    if (!acc[k]) continue;
    acc[k].count += 1;
    const v = ans.get(q.id);
    if (typeof v === "number") acc[k].sum += q.reverse ? 5 - v : v;
  }

  const total = Object.values(acc).reduce((t, x) => t + x.sum, 0) || 1;

  let results: IntResult[] = INTELLIGENCES.map((i) => {
    const { sum, count } = acc[i.key];
    const percent = r2((sum / total) * 100);
    const status = miStatus(percent);
    return {
      key: i.key, label: i.en, short: i.short, score: sum, max: count * 4, count,
      percent, rank: 0, status, statusLabel: MI_STATUS_LABEL[status],
    };
  });
  // rank by score desc
  const sorted = [...results].sort((a, b) => b.score - a.score);
  sorted.forEach((r, i) => (r.rank = i + 1));

  const pct: Record<string, number> = {};
  for (const r of results) pct[r.key] = r.percent;

  const domains = MACKENZIE.map((d) => ({
    key: d.key,
    label: d.label,
    percent: r2(d.members.reduce((t, k) => t + (pct[k] || 0), 0)),
    blurb: d.blurb,
  }));

  const riasec = RIASEC_MI.map((r) => {
    const avg = r.members.reduce((t, k) => t + (pct[k] || 0), 0) / r.members.length;
    const score10 = r2(clamp(avg * 0.62, 0, 10));
    return {
      key: r.key, label: r.label, score10, status: riasecStatus(score10),
      tagline: r.tagline, personality: r.personality, values: r.values,
      aptitudes: r.aptitudes, learning: r.learning, environment: r.environment,
    };
  });

  const big5 = BIG5.map((b) => {
    const avg = b.members.reduce((t, k) => t + (pct[k] || 0), 0) / b.members.length;
    const raw = b.invert ? 40 - avg * 2.6 : avg * 2.6;
    return { key: b.key, label: b.label, score: Math.round(clamp(raw, 0, 40)), desc: b.desc };
  });

  let careers = CAREER_CLUSTERS.map((c) => {
    const avg = c.members.reduce((t, k) => t + (pct[k] || 0), 0) / c.members.length;
    return { label: c.label, match: Math.round(clamp(avg * 5.4, 25, 96)), top: false };
  }).sort((a, b) => b.match - a.match);
  careers.slice(0, 3).forEach((c) => (c.top = true));

  const topIntelligences = sorted.slice(0, 3).map((r) => r.label);

  return {
    intelligences: results,
    total,
    domains,
    riasec,
    big5,
    careers,
    topIntelligences,
    generatedAt,
  };
}

export function studentRecommendation(data: MIReportData) {
  const top = data.topIntelligences;
  const topR = [...data.riasec].sort((a, b) => b.score10 - a.score10).slice(0, 2).map((r) => r.label);
  const streamMap: Record<string, string[]> = {
    logical: ["Science (Non-Medical)", "Commerce with Maths"],
    naturalist: ["Science (Medical)", "Agriculture"],
    linguistic: ["Arts / Humanities", "Mass Communication"],
    musical: ["Fine Arts / Music", "Performing Arts"],
    spatial: ["Design / Fine Arts", "Architecture"],
    kinesthetic: ["Physical Education", "Vocational / Skill trades"],
    interpersonal: ["Arts (Psychology)", "Management / BBA"],
    intrapersonal: ["Arts (Psychology)", "Humanities"],
  };
  const topKey = data.intelligences.find((i) => i.label === top[0])?.key || "logical";
  const streams = Array.from(new Set(streamMap[topKey] || ["Arts", "Commerce", "Science"]));
  const summary = `The student's strongest intelligences are ${top.join(
    ", "
  )}, with a career interest profile leaning towards ${topR.join(
    " and "
  )}. Learning works best through approaches that suit these strengths.`;
  return { summary, streams, topR };
}
