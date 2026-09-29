import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, Button, Card, formatDate, NumberField, SectionTitle } from '../components/ui';
import { LAB_KEYS, LabKey, LabResult, LABS, latestByKey } from '../lib/labs';
import { newId } from '../lib/storage';
import { colors } from '../theme';

type Props = {
  results: LabResult[];
  onChange: (results: LabResult[]) => void;
};

export function LabsScreen({ results, onChange }: Props) {
  const [selected, setSelected] = useState<LabKey>('ldl');
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const latest = latestByKey(results);

  const addResult = () => {
    const v = Number(value);
    if (!value || !Number.isFinite(v) || v <= 0 || v > 1000) {
      setError('Enter a value between 1 and 1000 mg/dL.');
      return;
    }
    setError(null);
    onChange([...results, { id: newId(), key: selected, value: v, takenAt: new Date().toISOString() }]);
    setValue('');
  };

  return (
    <View>
      {LAB_KEYS.map((key) => {
        const lab = LABS[key];
        const result = latest[key];
        const status = result && lab.classify(result.value);
        return (
          <Card key={key}>
            <View style={styles.labHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.labName}>{lab.name}</Text>
                <Text style={styles.muted}>{lab.description}</Text>
              </View>
              {result ? (
                <View style={styles.valueBox}>
                  <Text style={styles.value}>{result.value}</Text>
                  <Text style={styles.unit}>mg/dL</Text>
                </View>
              ) : (
                <Text style={styles.muted}>—</Text>
              )}
            </View>
            {result && status && (
              <View style={styles.footer}>
                <Badge label={status.label} color={status.color} />
                <Text style={styles.muted}>{formatDate(result.takenAt)}</Text>
              </View>
            )}
          </Card>
        );
      })}

      <Card>
        <SectionTitle>Add lab result</SectionTitle>
        <View style={styles.chips}>
          {LAB_KEYS.map((key) => (
            <Pressable key={key} onPress={() => setSelected(key)} style={[styles.chip, selected === key && styles.chipActive]}>
              <Text style={[styles.chipText, selected === key && styles.chipTextActive]}>{LABS[key].name}</Text>
            </Pressable>
          ))}
        </View>
        <NumberField label={`${LABS[selected].name} (mg/dL)`} placeholder="e.g. 110" value={value} onChangeText={setValue} maxLength={4} />
        {error && <Text style={styles.error}>{error}</Text>}
        <Button title="Save result" onPress={addResult} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  labHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  labName: { fontSize: 17, fontWeight: '700', color: colors.text },
  muted: { color: colors.muted, fontSize: 13, marginTop: 2 },
  valueBox: { alignItems: 'flex-end' },
  value: { fontSize: 28, fontWeight: '800', color: colors.text },
  unit: { fontSize: 11, color: colors.muted },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: { borderRadius: 999, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 6 },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontSize: 13 },
  chipTextActive: { color: '#fff', fontWeight: '700' },
  error: { color: '#D1453B', marginTop: 10 },
});
