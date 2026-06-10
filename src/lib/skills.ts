// Canonical skill, category and RIASEC definitions.
// Shared by the seed, the scoring engine and the report renderer.

export type SkillKey =
  | "confidence"
  | "emotional"
  | "aggressive"
  | "environment"
  | "attitude"
  | "time"
  | "vision"
  | "decision"
  | "regard"
  | "computer"
  | "spoken"
  | "numeric";

export interface SkillDef {
  key: SkillKey;
  en: string;
  pa: string;
  definition: string;
  value: string;
  potential: string;
}

export const SKILLS: SkillDef[] = [
  {
    key: "confidence",
    en: "Confidence",
    pa: "ਆਤਮ-ਵਿਸ਼ਵਾਸ",
    definition:
      "The ability to perform tasks effectively and handle challenges with self-belief.",
    value: "Helps you take action and trust yourself.",
    potential:
      "Takes initiative, takes responsibility, adapts to challenges. Self-confidence, courage, initiative and independence.",
  },
  {
    key: "emotional",
    en: "Emotional",
    pa: "ਭਾਵਨਾਤਮਕ",
    definition:
      "Emotional control covers psycho-physical reactions to events and the ability to stay composed instead of being disturbed by them.",
    value:
      "Helps you stay calm and control emotions. Provides strong coping mechanisms and mental strength under pressure.",
    potential: "Maintains stability, manages stress, responds calmly.",
  },
  {
    key: "aggressive",
    en: "Aggressive",
    pa: "ਦ੍ਰਿੜ੍ਹਤਾ",
    definition:
      "Taking initiative when necessary and being willing to work decisively to achieve your goals while standing firm.",
    value: "Ability to stand firm and protect personal or professional interests.",
    potential: "Acts decisively, drives results, stands firm when needed.",
  },
  {
    key: "environment",
    en: "Environment",
    pa: "ਵਾਤਾਵਰਨ ਅਨੁਕੂਲਤਾ",
    definition:
      "Environment Adaptability is the ability to adjust effectively to new surroundings, cultures, people or changing situations.",
    value: "Helps you adjust to different situations.",
    potential:
      "Adapts well to change, situationally aware, flexible, with willingness to learn.",
  },
  {
    key: "attitude",
    en: "Attitude",
    pa: "ਰਵੱਈਆ",
    definition:
      "Attitude represents a person's overall mindset and approach toward life, challenges, responsibilities and people.",
    value: "Creates a positive and responsible mindset and continuous improvement.",
    potential:
      "Positive outlook, accountability, solution-oriented, optimism and constructive thinking.",
  },
  {
    key: "time",
    en: "Time Management",
    pa: "ਸਮਾਂ ਪ੍ਰਬੰਧਨ",
    definition:
      "The ability to plan, organize and prioritize tasks effectively within available time limits to achieve goals efficiently.",
    value: "Helps you finish work on time.",
    potential:
      "Meets deadlines, prioritizes tasks, punctuality and efficient workflow.",
  },
  {
    key: "vision",
    en: "Vision",
    pa: "ਦੂਰ-ਦ੍ਰਿਸ਼ਟੀ",
    definition:
      "Vision refers to clarity about long-term goals, ambitions and life direction that provides motivation and focus.",
    value: "Helps you set clear goals for the future.",
    potential:
      "Goal-focused, future-oriented, strategic thinking and future planning.",
  },
  {
    key: "decision",
    en: "Decision",
    pa: "ਫ਼ੈਸਲਾ ਲੈਣਾ",
    definition:
      "Decision Making is the ability to analyze situations, evaluate alternatives and choose the most appropriate course of action.",
    value:
      "Helps choose the right action at the right time and supports effective leadership.",
    potential:
      "Logical thinking, responsible judgment and problem-solving ability.",
  },
  {
    key: "regard",
    en: "Regard",
    pa: "ਸਤਿਕਾਰ",
    definition:
      "Regard refers to the level of empathy, respect and consideration shown toward others in personal and professional interactions.",
    value: "Helps you respect rules and people.",
    potential:
      "Ethical conduct, respect for rules and people, empathy and mutual understanding.",
  },
  {
    key: "computer",
    en: "Computer",
    pa: "ਕੰਪਿਊਟਰ",
    definition: "Comfort and competence in using digital tools and technology.",
    value: "Helps you work faster using technology.",
    potential: "Efficient use of digital tools and quick learning.",
  },
  {
    key: "spoken",
    en: "Spoken",
    pa: "ਜ਼ੁਬਾਨੀ ਪ੍ਰਗਟਾਵਾ",
    definition:
      "Spoken Communication measures how clearly, confidently and effectively a person expresses thoughts and ideas verbally.",
    value: "Helps you express ideas clearly.",
    potential: "Clear communication and effective expression of ideas.",
  },
  {
    key: "numeric",
    en: "Numeric",
    pa: "ਸੰਖਿਆਤਮਕ",
    definition:
      "Numeric Ability refers to skill in understanding numbers, performing calculations and applying logical reasoning to data.",
    value: "Helps you understand numbers and data.",
    potential: "Works well with numbers, careful checking and quantitative reasoning.",
  },
];

export const SKILL_MAP: Record<SkillKey, SkillDef> = Object.fromEntries(
  SKILLS.map((s) => [s.key, s])
) as Record<SkillKey, SkillDef>;

// ---------------------------------------------------------------------------
// Skill status thresholds (raw, out of 25)
// ---------------------------------------------------------------------------
export type StatusKey = "highly" | "dominant" | "less" | "attention";

export const STATUS_LABEL: Record<StatusKey, string> = {
  highly: "Highly Dominant",
  dominant: "Dominant",
  less: "Less Dominant",
  attention: "Need Attention",
};

export const STATUS_COLOR: Record<StatusKey, string> = {
  highly: "#16a34a",
  dominant: "#3366ff",
  less: "#f59e0b",
  attention: "#ef4444",
};

export function skillStatus(scoreOf25: number): StatusKey {
  if (scoreOf25 >= 20) return "highly";
  if (scoreOf25 >= 16) return "dominant";
  if (scoreOf25 >= 11) return "less";
  return "attention";
}

// RIASEC + category percentages use a percentage-based band.
export function pctStatus(pct: number): StatusKey {
  if (pct >= 85) return "highly";
  if (pct >= 65) return "dominant";
  if (pct >= 35) return "less";
  return "attention";
}

// ---------------------------------------------------------------------------
// Report categories (scored out of 100)
// ---------------------------------------------------------------------------
export interface CategoryDef {
  key: string;
  label: string;
  skills: SkillKey[];
  blurb: string;
}

export const CATEGORIES: CategoryDef[] = [
  {
    key: "behaviour",
    label: "Behaviour",
    skills: ["emotional", "aggressive"],
    blurb:
      "Behaviour reflects how a person reacts and conducts themselves emotionally and assertively in different situations.",
  },
  {
    key: "stability",
    label: "Stability",
    skills: ["time", "numeric"],
    blurb:
      "Stability shows consistency in managing time and handling structured, data-driven tasks reliably.",
  },
  {
    key: "personality",
    label: "Personality",
    skills: ["attitude", "regard"],
    blurb:
      "Personality captures mindset and respect for people and rules that shape day-to-day conduct.",
  },
  {
    key: "lifestyle",
    label: "Life Style",
    skills: ["environment", "spoken"],
    blurb:
      "Life Style reflects adaptability to surroundings and the ability to communicate within them.",
  },
  {
    key: "future",
    label: "Future",
    skills: ["confidence", "vision"],
    blurb:
      "Future readiness combines self-belief with clear long-term direction and goal setting.",
  },
  {
    key: "creative",
    label: "Creative",
    skills: ["computer", "decision"],
    blurb:
      "Creative problem solving blends digital fluency with sound, original decision making.",
  },
  {
    key: "academic",
    label: "Academic",
    skills: ["computer", "numeric", "vision"],
    blurb:
      "Academic skills support learning: numerical, analytical and knowledge-seeking abilities.",
  },
  {
    key: "identity",
    label: "Identity",
    skills: ["confidence", "attitude", "decision"],
    blurb:
      "Identity is the understanding of who a person is — confidence, values and the choices they make.",
  },
  {
    key: "intrapersonal",
    label: "Intrapersonal",
    skills: ["emotional", "regard", "aggressive"],
    blurb:
      "Intrapersonal skills are the abilities to understand and manage yourself and your reactions.",
  },
  {
    key: "nextgen",
    label: "NextGen Skills",
    skills: ["environment", "spoken", "time"],
    blurb:
      "NextGen skills are future-focused abilities: adaptability, communication and self-organization.",
  },
];

// ---------------------------------------------------------------------------
// RIASEC career types and their skill formulas (from the sample report)
// ---------------------------------------------------------------------------
export interface RiasecDef {
  key: string;
  label: string;
  skills: SkillKey[];
  color: string;
}

export const RIASEC: RiasecDef[] = [
  {
    key: "realistic",
    label: "Realistic",
    skills: ["aggressive", "environment", "time", "decision", "regard"],
    color: "#ef4444",
  },
  {
    key: "investigative",
    label: "Investigative",
    skills: ["time", "vision", "decision", "computer", "numeric"],
    color: "#3366ff",
  },
  {
    key: "artistic",
    label: "Artistic",
    skills: ["confidence", "emotional", "environment", "attitude", "spoken"],
    color: "#a855f7",
  },
  {
    key: "social",
    label: "Social",
    skills: ["confidence", "emotional", "environment", "regard", "spoken"],
    color: "#16a34a",
  },
  {
    key: "enterprising",
    label: "Enterprising",
    skills: ["confidence", "aggressive", "attitude", "vision", "decision"],
    color: "#f59e0b",
  },
  {
    key: "conventional",
    label: "Conventional",
    skills: ["attitude", "time", "regard", "computer", "numeric"],
    color: "#0ea5e9",
  },
];

// Default RIASEC career-field + trait content (admin-editable via CareerSuggestion).
export const RIASEC_CONTENT: Record<
  string,
  { fields: string; traits: string; formula: string }
> = {
  realistic: {
    fields:
      "Computer engineering, mechanical work, surveying, pharmacy technician, carpentry, animal training, furniture design.",
    traits:
      "Mechanical and athletic abilities; likes to work outdoors and with tools and machines; practical, honest, persistent.",
    formula: "Aggressive + Environment + Time Management + Decision + Regard",
  },
  investigative: {
    fields:
      "Biology, chemistry, physics, computer science, medical technician, psychology, geography, research.",
    traits:
      "Math and science abilities; likes to work alone and solve problems; analytical, curious, independent, precise.",
    formula: "Time Management + Vision + Decision + Computer + Numeric",
  },
  artistic: {
    fields:
      "Music, stage direction, interior decoration, acting, writing, painting, design, journalism.",
    traits:
      "Artistic skills; enjoys creating original work; imaginative, expressive, independent, original.",
    formula: "Confidence + Emotional + Environment + Attitude + Spoken",
  },
  social: {
    fields:
      "Education, counseling, nursing, sports medicine, therapy, special education, health and nutrition.",
    traits:
      "Likes to help, teach and counsel people; cooperative, friendly, generous, understanding, warm.",
    formula: "Confidence + Emotional + Environment + Regard + Spoken",
  },
  enterprising: {
    fields:
      "Marketing, business, sales, hospitality, advertising, entrepreneurship, financial planning, law, real estate.",
    traits:
      "Leadership and public-speaking abilities; likes to influence people; ambitious, energetic, self-confident, sociable.",
    formula: "Confidence + Aggressive + Attitude + Vision + Decision",
  },
  conventional: {
    fields:
      "Accounting, office management, court reporting, desktop publishing, computer operation, business communication.",
    traits:
      "Clerical and math abilities; likes to organize things; careful, efficient, orderly, persistent, practical.",
    formula: "Attitude + Time Management + Regard + Computer + Numeric",
  },
};

// Improvement recommendation per skill status (used on per-skill report pages).
export function recommendation(skill: SkillDef, status: StatusKey): string {
  switch (status) {
    case "highly":
      return `Your ${skill.en.toLowerCase()} is a clear strength — keep using it and mentor others while staying open to feedback.`;
    case "dominant":
      return `Your ${skill.en.toLowerCase()} is well developed; consistency across new and unfamiliar situations will strengthen it further.`;
    case "less":
      return `You show ${skill.en.toLowerCase()} in some areas; focused practice and clearer routines will help it grow.`;
    case "attention":
      return `${skill.en} needs attention — start with small, regular steps and guidance to build this ability steadily.`;
  }
}

export const SCORE_OPTIONS = [
  { value: 1, en: "Totally Disagree", pa: "ਪੂਰੀ ਤਰ੍ਹਾਂ ਅਸਹਿਮਤ" },
  { value: 2, en: "Slightly Disagree", pa: "ਥੋੜ੍ਹਾ ਅਸਹਿਮਤ" },
  { value: 3, en: "Neutral", pa: "ਨਿਰਪੱਖ" },
  { value: 4, en: "Slightly Agree", pa: "ਥੋੜ੍ਹਾ ਸਹਿਮਤ" },
  { value: 5, en: "Totally Agree", pa: "ਪੂਰੀ ਤਰ੍ਹਾਂ ਸਹਿਮਤ" },
];
