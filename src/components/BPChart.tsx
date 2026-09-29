import { StyleSheet, Text, View } from 'react-native';
import { BPReading, classifyBP } from '../lib/bloodPressure';
import { colors } from '../theme';
import { formatDate } from './ui';

const MIN = 50;
const MAX = 190;
const HEIGHT = 150;

const toY = (value: number) => ((Math.min(Math.max(value, MIN), MAX) - MIN) / (MAX - MIN)) * HEIGHT;

// Each reading is a vertical range bar from diastolic to systolic, colored by category.
export function BPChart({ readings }: { readings: BPReading[] }) {
  const recent = readings.slice(-10);

  if (recent.length === 0) {
    return <Text style={styles.empty}>No readings yet — add your first one below.</Text>;
  }

  return (
    <View>
      <View style={styles.chart}>
        <View style={[styles.guide, { bottom: toY(130) }]}>
          <Text style={styles.guideLabel}>130</Text>
        </View>
        <View style={[styles.guide, { bottom: toY(80) }]}>
          <Text style={styles.guideLabel}>80</Text>
        </View>
        {recent.map((r) => {
          const { color } = classifyBP(r.systolic, r.diastolic);
          return (
            <View key={r.id} style={styles.column}>
              <View
                style={[
                  styles.bar,
                  { backgroundColor: color, bottom: toY(r.diastolic), height: Math.max(toY(r.systolic) - toY(r.diastolic), 4) },
                ]}
              />
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        {recent.map((r) => (
          <Text key={r.id} style={styles.dateLabel} numberOfLines={1}>
            {formatDate(r.takenAt).split(' ')[1]}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { height: HEIGHT, flexDirection: 'row', paddingLeft: 28 },
  column: { flex: 1, alignItems: 'center' },
  bar: { position: 'absolute', width: 12, borderRadius: 6 },
  guide: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  guideLabel: { position: 'absolute', left: 0, top: -8, fontSize: 10, color: colors.muted },
  labels: { flexDirection: 'row', paddingLeft: 28, marginTop: 6 },
  dateLabel: { flex: 1, textAlign: 'center', fontSize: 10, color: colors.muted },
  empty: { color: colors.muted, textAlign: 'center', paddingVertical: 24 },
});
