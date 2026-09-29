# ♥ HeartTrack

A small React Native (Expo) app for tracking heart health: blood pressure readings and cholesterol / glucose lab results, each classified against clinical guidelines.

## Features

**Blood Pressure**
- Log systolic / diastolic / pulse with input validation
- Automatic classification per the 2017 ACC/AHA guideline (Normal → Hypertensive Crisis), with color coding and short advice
- 7-day average and a trend chart of the last 10 readings (custom-built with plain `View`s, no chart library)
- Full history; long-press a reading to delete it

**Lab Results**
- Total Cholesterol, LDL, HDL, Triglycerides, Fasting Glucose
- Latest value per test, rated against adult reference ranges (NCEP ATP III / ADA)

Data is persisted on-device with AsyncStorage and seeded with demo data on first launch.

## Tech stack

- Expo SDK 57 · React Native 0.86 · React 19 · TypeScript
- `@react-native-async-storage/async-storage` for persistence
- `react-native-safe-area-context` for notch / safe-area handling

## Getting started

```bash
npm install
npx expo start
```

Then scan the QR code with **Expo Go** (Android / iOS), or press `a` to open an Android emulator. No development build is needed: every dependency is included in Expo Go.

Typecheck: `npx tsc --noEmit`

## Project structure

```
App.tsx                    # Root: header, tab switcher, loads persisted state
src/
  lib/                     # Pure logic (no UI)
    bloodPressure.ts       # BP types, classifyBP, averageBP, validateBP
    labs.ts                # Lab definitions, reference ranges, latestByKey
    storage.ts             # usePersistentState hook (AsyncStorage)
    demoData.ts            # Seed data for first launch
  screens/
    BloodPressureScreen.tsx
    LabsScreen.tsx
  components/
    BPChart.tsx            # Range-bar trend chart
    ui.tsx                 # Card, Badge, Button, NumberField, formatDate
  theme.ts                 # Color tokens
```

## Design decisions

- **Logic kept apart from UI.** The medical rules are pure functions in `src/lib`, so they are easy to unit-test and reuse.
- **Single source of state.** `App.tsx` owns the data and passes it to the screens via props (`readings` + `onChange`). The screens stay presentational.
- **Minimal dependencies.** Simple state-based tabs and a hand-built chart keep the app light and Expo Go-compatible.

## Possible next steps

- Unit tests for `classifyBP` / lab classification
- Expo Router with file-based routes as the number of screens grows
- Lab history charts, reminders (`expo-notifications`), export to PDF / share with a doctor

---

*Demo project, not medical advice.*
