import type { BPReading } from './bloodPressure';
import type { LabResult } from './labs';

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

export const demoReadings = (): BPReading[] =>
  [
    [138, 88, 76],
    [135, 86, 74],
    [131, 84, 72],
    [128, 82, 70],
    [126, 81, 71],
    [124, 79, 68],
    [121, 78, 67],
  ].map(([systolic, diastolic, pulse], i) => ({
    id: `demo-bp-${i}`,
    systolic,
    diastolic,
    pulse,
    takenAt: daysAgo(12 - i * 2),
  }));

export const demoLabs = (): LabResult[] => [
  { id: 'demo-lab-1', key: 'totalCholesterol', value: 212, takenAt: daysAgo(20) },
  { id: 'demo-lab-2', key: 'ldl', value: 138, takenAt: daysAgo(20) },
  { id: 'demo-lab-3', key: 'hdl', value: 47, takenAt: daysAgo(20) },
  { id: 'demo-lab-4', key: 'triglycerides', value: 145, takenAt: daysAgo(20) },
  { id: 'demo-lab-5', key: 'glucose', value: 96, takenAt: daysAgo(20) },
];
