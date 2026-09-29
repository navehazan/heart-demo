import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BPReading } from './src/lib/bloodPressure';
import { demoLabs, demoReadings } from './src/lib/demoData';
import { LabResult } from './src/lib/labs';
import { usePersistentState } from './src/lib/storage';
import { BloodPressureScreen } from './src/screens/BloodPressureScreen';
import { LabsScreen } from './src/screens/LabsScreen';
import { colors } from './src/theme';

type Tab = 'bp' | 'labs';

export default function App() {
  const [tab, setTab] = useState<Tab>('bp');
  const [readings, setReadings, readingsLoaded] = usePersistentState<BPReading[]>('bp-readings', demoReadings);
  const [labs, setLabs, labsLoaded] = usePersistentState<LabResult[]>('lab-results', demoLabs);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.title}>♥ HeartTrack</Text>
          <Text style={styles.subtitle}>Your heart health at a glance</Text>
        </View>

        <View style={styles.tabs}>
          {(
            [
              ['bp', 'Blood Pressure'],
              ['labs', 'Lab Results'],
            ] as const
          ).map(([key, label]) => (
            <Pressable key={key} onPress={() => setTab(key)} style={[styles.tab, tab === key && styles.tabActive]}>
              <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>{label}</Text>
            </Pressable>
          ))}
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {readingsLoaded && labsLoaded ? (
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
              {tab === 'bp' ? (
                <BloodPressureScreen readings={readings} onChange={setReadings} />
              ) : (
                <LabsScreen results={labs} onChange={setLabs} />
              )}
              <Text style={styles.disclaimer}>Demo app — not medical advice.</Text>
            </ScrollView>
          ) : (
            <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  title: { fontSize: 28, fontWeight: '800', color: colors.primary },
  subtitle: { fontSize: 14, color: colors.muted, marginTop: 2 },
  tabs: { flexDirection: 'row', marginHorizontal: 16, marginVertical: 10, backgroundColor: colors.border, borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: 'center' },
  tabActive: { backgroundColor: colors.card },
  tabText: { color: colors.muted, fontWeight: '600' },
  tabTextActive: { color: colors.text },
  content: { padding: 16, paddingBottom: 40 },
  disclaimer: { textAlign: 'center', color: colors.muted, fontSize: 12, marginTop: 4 },
});
