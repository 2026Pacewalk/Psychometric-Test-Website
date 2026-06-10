import {
  SKILLS,
  SKILL_MAP,
  SkillKey,
  CATEGORIES,
  RIASEC,
  RIASEC_CONTENT,
  skillStatus,
  pctStatus,
  StatusKey,
  STATUS_LABEL,
} from "./skills";

export interface QuestionInput {
  id: string;
  order: number;
  skill: string;
  reverse: boolean;
}

export interface AnswerInput {
  questionId: string;
  value: number; // 1..5
}

export interface SkillResult {
  key: SkillKey;
  label: string;
  raw: number; // normalized out of 25
  rawSum: number; // sum of (possibly reversed) answers
  max: number; // max possible (count * 5)
  count: number;
  percent: number; // 0..100
  status: StatusKey;
  statusLabel: string;
}

export interface CategoryResult {
  key: string;
  label: string;
  percent: number;
  status: StatusKey;
  statusLabel: string;
  blurb: string;
  skills: SkillKey[];
}

export interface RiasecResult {
  key: string;
  label: string;
  scoreOf25: number;
  percent: number;
  status: StatusKey;
  statusLabel: string;
  color: string;
  fields: string;
  traits: string;
  formula: string;
}

export interface ReportData {
  skills: SkillResult[];
  categories: CategoryResult[];
  riasec: RiasecResult[];
  overallPercent: number;
  totalScore: number; // sum of normalized /25 (max 300)
  topRiasec: string[]; // top 3 riasec labels
  generatedAt: string;
}

const round1 = (n: number) => Math.round(n * 100) / 100;
const round = (n: number) => Math.round(n);

export function computeReport(
  questions: QuestionInput[],
  answers: AnswerInput[],
  generatedAt: string
): ReportData {
  const answerByQ = new Map<string, number>();
  for (const a of answers) answerByQ.set(a.questionId, a.value);

  // Accumulate per-skill sums.
  const acc: Record<string, { sum: number; count: number }> = {};
  for (const s of SKILLS) acc[s.key] = { sum: 0, count: 0 };

  for (const q of questions) {
    if (!acc[q.skill]) continue;
    const v = answerByQ.get(q.id);
    acc[q.skill].count += 1; // count every mapped question (max uses full count)
    if (typeof v === "number") {
      const scored = q.reverse ? 6 - v : v;
      acc[q.skill].sum += scored;
    }
  }

  const skills: SkillResult[] = SKILLS.map((s) => {
    const { sum, count } = acc[s.key];
    const max = count * 5;
    const normalized = max > 0 ? (sum / max) * 25 : 0;
    const percent = max > 0 ? (sum / max) * 100 : 0;
    const raw = round1(normalized);
    const status = skillStatus(raw);
    return {
      key: s.key,
      label: s.en,
      raw,
      rawSum: sum,
      max,
      count,
      percent: round1(percent),
      status,
      statusLabel: STATUS_LABEL[status],
    };
  });

  const skillPct: Record<string, number> = {};
  const skill25: Record<string, number> = {};
  for (const s of skills) {
    skillPct[s.key] = s.percent;
    skill25[s.key] = s.raw;
  }

  const categories: CategoryResult[] = CATEGORIES.map((c) => {
    const pct =
      c.skills.reduce((t, k) => t + (skillPct[k] ?? 0), 0) / c.skills.length;
    const status = pctStatus(pct);
    return {
      key: c.key,
      label: c.label,
      percent: round(pct),
      status,
      statusLabel: STATUS_LABEL[status],
      blurb: c.blurb,
      skills: c.skills,
    };
  });

  const riasec: RiasecResult[] = RIASEC.map((r) => {
    const score25 =
      r.skills.reduce((t, k) => t + (skill25[k] ?? 0), 0) / r.skills.length;
    const percent = (score25 / 25) * 100;
    const status = pctStatus(percent);
    const content = RIASEC_CONTENT[r.key];
    return {
      key: r.key,
      label: r.label,
      scoreOf25: round1(score25),
      percent: round(percent),
      status,
      statusLabel: STATUS_LABEL[status],
      color: r.color,
      fields: content.fields,
      traits: content.traits,
      formula: content.formula,
    };
  });

  const overallPercent = round1(
    skills.reduce((t, s) => t + s.percent, 0) / skills.length
  );
  const totalScore = round(skills.reduce((t, s) => t + s.raw, 0));
  const topRiasec = [...riasec]
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3)
    .map((r) => r.label);

  return {
    skills,
    categories,
    riasec,
    overallPercent,
    totalScore,
    topRiasec,
    generatedAt,
  };
}

// Counselor recommendation paragraph generated from results.
export function counselorRecommendation(data: ReportData): {
  summary: string;
  streams: string[];
  focus: string[];
} {
  const strengths = data.skills
    .filter((s) => s.status === "highly" || s.status === "dominant")
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 4)
    .map((s) => SKILL_MAP[s.key].en);
  const needs = data.skills
    .filter((s) => s.status === "attention" || s.status === "less")
    .sort((a, b) => a.percent - b.percent)
    .slice(0, 3)
    .map((s) => SKILL_MAP[s.key].en);

  const top = data.topRiasec;
  const streamMap: Record<string, string[]> = {
    Realistic: ["Science (Non-Medical)", "Polytechnic / Engineering", "ITI / Vocational"],
    Investigative: ["Science (Medical / Non-Medical)", "Research & Analytics", "Computer Applications"],
    Artistic: ["Arts & Humanities", "Design / Fine Arts", "Mass Communication"],
    Social: ["Arts (Psychology / Sociology)", "Education / B.Ed", "Healthcare & Nursing"],
    Enterprising: ["Commerce", "Business Administration", "Law / Public Administration"],
    Conventional: ["Commerce (Accounts)", "Computer Applications", "Office / Banking"],
  };
  const streams = Array.from(
    new Set(top.flatMap((t) => streamMap[t] ?? []))
  ).slice(0, 4);

  const summary = `Based on the assessment, the student shows clear strength in ${
    strengths.join(", ") || "several balanced areas"
  }. The dominant career interest profile is ${top.join(
    ", "
  )}. ${
    needs.length
      ? `Focused support is recommended for ${needs.join(", ")}.`
      : "All measured skills are well developed."
  } Recommended academic direction and counselling are summarised below.`;

  return { summary, streams, focus: needs };
}
