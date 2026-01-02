import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Home, RotateCcw, Star, Trophy } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Tambahkan import ini di bagian atas

export default function QuizResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string;
    score?: string;
    topic?: string;
    course?: string;
    fromHistory?: string;
  }>();
  
  const score = Number(params.score) || 0;
  const topic = (params.topic as string) || 'Kuis';
  const course = (params.course as string) || 'Materi';
  const recordId = (params.id as string) || '';
  const openedFromHistory = params.fromHistory === '1' || !!recordId;

  // Logika simpan otomatis
  useEffect(() => {
    if (openedFromHistory) return;

    const saveToLocal = async () => {
      try {
        const newRecord = {
          id: Date.now().toString(),
          topic: topic,
          course: course,
          score: score,
          date: new Date().toLocaleDateString('id-ID'),
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          totalQuestions: 5,
          correctAnswers: Math.round(score / 20),
        };

        const existingData = await AsyncStorage.getItem('quiz_history');
        const history = existingData ? JSON.parse(existingData) : [];
        await AsyncStorage.setItem('quiz_history', JSON.stringify([newRecord, ...history]));
      } catch (e) {
        console.error("Gagal simpan lokal", e);
      }
    };
    saveToLocal();
  }, [openedFromHistory, score, topic, course]);

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', message: 'Excellent!', colors: ['#4ADE80', '#10B981'] as [string, string] };
    if (score >= 80) return { grade: 'B', message: 'Great Job!', colors: ['#60A5FA', '#06B6D4'] as [string, string] };
    if (score >= 70) return { grade: 'C', message: 'Good Work!', colors: ['#FACC15', '#FB923C'] as [string, string] };
    return { grade: 'D', message: 'Keep Practicing', colors: ['#F87171', '#EC4899'] as [string, string] };
  };

  const result = getGrade(score);
  const isPassed = score >= 70;
  const starsCount = Math.ceil(score / 33.33);

  return (
    <View style={styles.container}>
      <LinearGradient colors={result.colors} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.trophyWrapper}>
              <View style={styles.trophyGlow} />
              <View style={styles.trophyCircle}><Trophy size={80} color="white" /></View>
            </View>

            <View style={styles.scoreCard}>
              <View style={styles.starsRow}>
                {[1, 2, 3].map((s) => (
                  <Star key={s} size={32} color={s <= starsCount ? "#FACC15" : "#E2E8F0"} fill={s <= starsCount ? "#FACC15" : "transparent"} />
                ))}
              </View>
              <Text style={styles.messageText}>{result.message}</Text>
              <Text style={styles.topicText}>{"Kuis " + topic + " selesai"}</Text>

              <LinearGradient colors={result.colors} style={styles.innerScoreBadge}>
                <Text style={styles.scoreLabel}>Skor Anda</Text>
                <Text style={styles.scoreValue}>{Math.round(score)}</Text>
                <Text style={styles.gradeLabel}>{"Nilai: " + result.grade}</Text>
              </LinearGradient>

              <View style={[styles.banner, { borderLeftColor: isPassed ? '#22C55E' : '#F97316', backgroundColor: isPassed ? '#F0FDF4' : '#FFF7ED' }]}>
                <Text style={styles.bannerText}>
                  {isPassed ? '🎉 Selamat! Anda lulus kuis ini.' : '💪 Jangan menyerah! Coba lagi.'}
                </Text>
              </View>
            </View>

            <View style={styles.actions}>
              {!!recordId && (
                <TouchableOpacity
                  onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: recordId } })}
                  style={styles.primaryBtn}
                >
                  <Text style={styles.primaryBtnText}>Lihat Pembahasan</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/quiz/selection',
                    params: course ? { course } : undefined,
                  })
                }
                style={styles.primaryBtn}
              >
                <RotateCcw size={22} color="#1F2937" /><Text style={styles.primaryBtnText}>Kuis Lain</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace("/(tabs)/dashboard")} style={styles.secondaryBtn}>
                <Home size={22} color="white" /><Text style={styles.secondaryBtnText}>Beranda</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingVertical: 40, paddingHorizontal: 24 },
  trophyWrapper: { alignItems: 'center', marginBottom: 30 },
  trophyGlow: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'white', opacity: 0.2, transform: [{ scale: 1.5 }] },
  trophyCircle: { backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: 100, padding: 30 },
  scoreCard: { backgroundColor: 'white', borderRadius: 40, padding: 24, marginBottom: 24, elevation: 10 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  messageText: { textAlign: 'center', fontSize: 28, fontWeight: 'bold', color: '#111827' },
  topicText: { textAlign: 'center', color: '#6B7280', marginBottom: 24 },
  innerScoreBadge: { borderRadius: 24, paddingVertical: 30, alignItems: 'center', marginBottom: 24 },
  scoreLabel: { color: 'white', opacity: 0.8 },
  scoreValue: { color: 'white', fontSize: 72, fontWeight: 'bold' },
  gradeLabel: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  banner: { padding: 16, borderRadius: 12, borderLeftWidth: 4 },
  bannerText: { fontSize: 13, color: '#374151' },
  actions: { gap: 16 },
  primaryBtn: { backgroundColor: 'white', flexDirection: 'row', padding: 18, borderRadius: 24, justifyContent: 'center', alignItems: 'center', gap: 12 },
  primaryBtnText: { fontWeight: 'bold', fontSize: 18, color: '#111827' },
  secondaryBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'white', flexDirection: 'row', padding: 18, borderRadius: 24, justifyContent: 'center', alignItems: 'center', gap: 12 },
  secondaryBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18 }
});