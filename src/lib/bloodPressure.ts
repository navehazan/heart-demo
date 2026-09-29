export type BPReading = {
  id: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  takenAt: string; // ISO date
};

export type BPCategory = {
  key: 'normal' | 'elevated' | 'stage1' | 'stage2' | 'crisis';
  label: string;
  color: string;
  advice: string;
};

const CATEGORIES: Record<BPCategory['key'], BPCategory> = {
  normal: { key: 'normal', label: 'Normal', color: '#2E9E6B', advice: 'Great — keep up your healthy habits.' },
  elevated: { key: 'elevated', label: 'Elevated', color: '#D4A017', advice: 'Slightly high. Watch salt intake and stay active.' },
  stage1: { key: 'stage1', label: 'Hypertension Stage 1', color: '#E07B28', advice: 'Talk to your doctor about lifestyle changes.' },
  stage2: { key: 'stage2', label: 'Hypertension Stage 2', color: '#D1453B', advice: 'Consult your doctor about treatment.' },
  crisis: { key: 'crisis', label: 'Hypertensive Crisis', color: '#8E1B1B', advice: 'Seek medical care immediately.' },
};

// Based on the 2017 ACC/AHA blood pressure guideline.
export function classifyBP(systolic: number, diastolic: number): BPCategory {
  if (systolic > 180 || diastolic > 120) return CATEGORIES.crisis;
  if (systolic >= 140 || diastolic >= 90) return CATEGORIES.stage2;
  if (systolic >= 130 || diastolic >= 80) return CATEGORIES.stage1;
  if (systolic >= 120) return CATEGORIES.elevated;
  return CATEGORIES.normal;
}

export function averageBP(readings: BPReading[]) {
  if (readings.length === 0) return null;
  const sum = readings.reduce(
    (acc, r) => ({ s: acc.s + r.systolic, d: acc.d + r.diastolic }),
    { s: 0, d: 0 },
  );
  return {
    systolic: Math.round(sum.s / readings.length),
    diastolic: Math.round(sum.d / readings.length),
  };
}

export function validateBP(systolic: number, diastolic: number, pulse?: number): string | null {
  if (!Number.isFinite(systolic) || !Number.isFinite(diastolic)) return 'Enter both systolic and diastolic values.';
  if (systolic < 60 || systolic > 260) return 'Systolic should be between 60 and 260.';
  if (diastolic < 30 || diastolic > 160) return 'Diastolic should be between 30 and 160.';
  if (diastolic >= systolic) return 'Systolic must be higher than diastolic.';
  if (pulse !== undefined && (pulse < 30 || pulse > 220)) return 'Pulse should be between 30 and 220.';
  return null;
}
