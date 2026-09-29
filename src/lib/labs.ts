export type LabKey = 'totalCholesterol' | 'ldl' | 'hdl' | 'triglycerides' | 'glucose';

export type LabResult = {
  id: string;
  key: LabKey;
  value: number; // mg/dL
  takenAt: string;
};

export type LabStatus = { label: string; color: string };

type LabDefinition = {
  name: string;
  description: string;
  classify: (value: number) => LabStatus;
};

const GOOD = '#2E9E6B';
const WARN = '#D4A017';
const BAD = '#D1453B';

// Adult reference ranges (mg/dL), per NCEP ATP III / ADA.
export const LABS: Record<LabKey, LabDefinition> = {
  totalCholesterol: {
    name: 'Total Cholesterol',
    description: 'Overall cholesterol in your blood.',
    classify: (v) =>
      v < 200 ? { label: 'Desirable', color: GOOD } : v < 240 ? { label: 'Borderline', color: WARN } : { label: 'High', color: BAD },
  },
  ldl: {
    name: 'LDL',
    description: '"Bad" cholesterol — builds up in arteries.',
    classify: (v) =>
      v < 100
        ? { label: 'Optimal', color: GOOD }
        : v < 130
          ? { label: 'Near optimal', color: GOOD }
          : v < 160
            ? { label: 'Borderline', color: WARN }
            : { label: 'High', color: BAD },
  },
  hdl: {
    name: 'HDL',
    description: '"Good" cholesterol — higher is better.',
    classify: (v) =>
      v >= 60 ? { label: 'Protective', color: GOOD } : v >= 40 ? { label: 'Normal', color: WARN } : { label: 'Low', color: BAD },
  },
  triglycerides: {
    name: 'Triglycerides',
    description: 'A type of fat in the blood.',
    classify: (v) =>
      v < 150 ? { label: 'Normal', color: GOOD } : v < 200 ? { label: 'Borderline', color: WARN } : { label: 'High', color: BAD },
  },
  glucose: {
    name: 'Fasting Glucose',
    description: 'Blood sugar after 8+ hours without food.',
    classify: (v) =>
      v < 70
        ? { label: 'Low', color: WARN }
        : v < 100
          ? { label: 'Normal', color: GOOD }
          : v < 126
            ? { label: 'Prediabetes', color: WARN }
            : { label: 'Diabetes range', color: BAD },
  },
};

export const LAB_KEYS = Object.keys(LABS) as LabKey[];

export function latestByKey(results: LabResult[]): Partial<Record<LabKey, LabResult>> {
  const latest: Partial<Record<LabKey, LabResult>> = {};
  for (const r of results) {
    const current = latest[r.key];
    if (!current || r.takenAt > current.takenAt) latest[r.key] = r;
  }
  return latest;
}
