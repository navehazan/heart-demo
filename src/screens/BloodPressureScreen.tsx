import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { BPChart } from '../components/BPChart';
import { Badge, Button, Card, formatDate, NumberField, SectionTitle } from '../components/ui';
import { averageBP, BPReading, classifyBP, validateBP } from '../lib/bloodPressure';
import { newId } from '../lib/storage';
import { colors } from '../theme';

type Props = {
  readings: BPReading[];
  onChange: (readings: BPReading[]) => void;
};

export function BloodPressureScreen({ readings, onChange }: Props) {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sorted = [...readings].sort((a, b) => a.takenAt.localeCompare(b.takenAt));
  const latest = sorted[sorted.length - 1];
  const weekAvg = averageBP(sorted.filter((r) => Date.now() - Date.parse(r.takenAt) < 7 * 86_400_000));
  const latestCategory = latest && classifyBP(latest.systolic, latest.diastolic);

  const addReading = () => {
    const s = Number(systolic);
    const d = Number(diastolic);
    const p = pulse ? Number(pulse) : undefined;
    const validationError = validateBP(systolic ? s : NaN, diastolic ? d : NaN, p);
    setError(validationError);
    if (validationError) return;

    onChange([...readings, { id: newId(), systolic: s, diastolic: d, pulse: p, takenAt: new Date().toISOString() }]);
    setSystolic('');
    setDiastolic('');
    setPulse('');
  };

  const confirmDelete = (reading: BPReading) =>
    Alert.alert('Delete reading?', `${reading.systolic}/${reading.diastolic} on ${formatDate(reading.takenAt)}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onChange(readings.filter((r) => r.id !== reading.id)) },
    ]);

  return (
    <View>
      <Card>
        <SectionTitle>Latest reading</SectionTitle>
        {latest && latestCategory ? (
          <>
            <View style={styles.row}>
              <Text style={styles.bigValue}>
                {latest.systolic}/{latest.diastolic}
              </Text>
              <Text style={styles.unit}>mmHg</Text>
              {latest.pulse ? <Text style={styles.pulse}>♥ {latest.pulse} bpm</Text> : null}
            </View>
            <Badge label={latestCategory.label} color={latestCategory.color} />
            <Text style={styles.advice}>{latestCategory.advice}</Text>
            {weekAvg && (
              <Text style={styles.muted}>
                7-day average: {weekAvg.systolic}/{weekAvg.diastolic}
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.muted}>No readings yet.</Text>
        )}
      </Card>

      <Card>
        <SectionTitle>Trend</SectionTitle>
        <BPChart readings={sorted} />
      </Card>

      <Card>
        <SectionTitle>Add reading</SectionTitle>
        <View style={styles.fields}>
          <NumberField label="Systolic" placeholder="120" value={systolic} onChangeText={setSystolic} maxLength={3} />
          <NumberField label="Diastolic" placeholder="80" value={diastolic} onChangeText={setDiastolic} maxLength={3} />
          <NumberField label="Pulse" placeholder="70" value={pulse} onChangeText={setPulse} maxLength={3} />
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        <Button title="Save reading" onPress={addReading} />
      </Card>

      <Card>
        <SectionTitle>History</SectionTitle>
        {[...sorted].reverse().map((r) => {
          const c = classifyBP(r.systolic, r.diastolic);
          return (
            <Pressable key={r.id} onLongPress={() => confirmDelete(r)} style={styles.historyRow}>
              <View style={[styles.dot, { backgroundColor: c.color }]} />
              <Text style={styles.historyValue}>
                {r.systolic}/{r.diastolic}
              </Text>
              <Text style={styles.muted}>{c.label}</Text>
              <Text style={[styles.muted, styles.historyDate]}>{formatDate(r.takenAt)}</Text>
            </Pressable>
          );
        })}
        {sorted.length > 0 && <Text style={styles.hint}>Long-press a reading to delete it.</Text>}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 8 },
  bigValue: { fontSize: 44, fontWeight: '800', color: colors.text },
  unit: { fontSize: 14, color: colors.muted, marginLeft: 6 },
  pulse: { marginLeft: 'auto', fontSize: 15, color: colors.primary, fontWeight: '600' },
  advice: { marginTop: 10, fontSize: 15, color: colors.text },
  muted: { color: colors.muted, marginTop: 4 },
  fields: { flexDirection: 'row', gap: 10 },
  error: { color: '#D1453B', marginTop: 10 },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.border, gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  historyValue: { fontSize: 16, fontWeight: '700', color: colors.text, width: 70 },
  historyDate: { marginLeft: 'auto', marginTop: 0 },
  hint: { fontSize: 12, color: colors.muted, marginTop: 10, textAlign: 'center' },
});
