import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Home, RotateCcw, Star, Trophy } from 'lucide-react-native';
import React from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function QuizResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ score?: string | string[]; topic?: string | string[]; course?: string | string[] }>();
  
  const scoreParam = Array.isArray(params.score) ? params.score[0] : params.score;
  const topicParam = Array.isArray(params.topic) ? params.topic[0] : params.topic;
  const courseParam = Array.isArray(params.course) ? params.course[0] : params.course;

  const score = Number(scoreParam) || 0;
  const topic = topicParam || 'Kuis';
  
  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', message: 'Excellent!', colors: ['#4ADE80', '#10B981'] as [string, string] };
    if (score >= 80) return { grade: 'B', message: 'Great Job!', colors: ['#60A5FA', '#06B6D4'] as [string, string] };
    if (score >= 70) return { grade: 'C', message: 'Good Work!', colors: ['#FACC15', '#FB923C'] as [string, string] };
    if (score >= 60) return { grade: 'D', message: 'Keep Practicing', colors: ['#FB923C', '#F87171'] as [string, string] };
    return { grade: 'E', message: 'Try Again', colors: ['#F87171', '#EC4899'] as [string, string] };
  };

  const result = getGrade(score);
  const isPassed = score >= 70;
  const starsCount = Math.ceil(score / 33.33); 

  return (
    <View style={styles.container}>
      <LinearGradient colors={result.colors} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
            
            {/* Trophy Section */}
            <View style={styles.trophyWrapper}>
              <View style={styles.trophyGlow} />
              <View style={styles.trophyCircle}>
                <Trophy size={80} color="white" />
              </View>
            </View>

            {/* Main Score Card */}
            <View style={styles.scoreCard}>
              {/* Stars Row */}
              <View style={styles.starsRow}>
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    size={32}
                    color={s <= starsCount ? "#FACC15" : "#E2E8F0"}
                    fill={s <= starsCount ? "#FACC15" : "transparent"}
                    style={styles.starIcon}
                  />
                ))}
              </View>

              <Text style={styles.messageText}>{result.message}</Text>
              <Text style={styles.topicText}>Kuis {topic} selesai</Text>

              {/* Central Score Display */}
              <LinearGradient
                colors={result.colors}
                style={styles.innerScoreBadge}
              >
                <Text style={styles.scoreLabel}>Skor Anda</Text>
                <Text style={styles.scoreValue}>{Math.round(score)}</Text>
                <Text style={styles.gradeLabel}>Nilai: {result.grade}</Text>
              </LinearGradient>

              {/* Stats Row */}
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>5</Text>
                  <Text style={styles.statLabel}>SOAL</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#F0FDF4' }]}>
                  <Text style={[styles.statNumber, { color: '#16A34A' }]}>{Math.round(score / 20)}</Text>
                  <Text style={styles.statLabel}>BENAR</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#FEF2F2' }]}>
                  <Text style={[styles.statNumber, { color: '#DC2626' }]}>{5 - Math.round(score / 20)}</Text>
                  <Text style={styles.statLabel}>SALAH</Text>
                </View>
              </View>

              {/* Motivational Banner */}
              <View style={[
                styles.banner, 
                { borderLeftColor: isPassed ? '#22C55E' : '#F97316', backgroundColor: isPassed ? '#F0FDF4' : '#FFF7ED' }
              ]}>
                <Text style={styles.bannerText}>
                  {isPassed
                    ? '🎉 Selamat! Anda lulus kuis ini. Terus tingkatkan kemampuan Anda!'
                    : '💪 Jangan menyerah! Pelajari materi kembali dan coba lagi.'}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() =>
                  courseParam
                    ? router.push({ pathname: '/quiz/selection', params: { course: courseParam } })
                    : router.push('/quiz/selection')
                }
                style={styles.primaryBtn}
              >
                <RotateCcw size={22} color="#1F2937" />
                <Text style={styles.primaryBtnText}>Kuis Lain</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => router.replace("/(tabs)/dashboard")}
                style={styles.secondaryBtn}
              >
                <Home size={22} color="white" />
                <Text style={styles.secondaryBtnText}>Kembali ke Beranda</Text>
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
  
  // Trophy Header
  trophyWrapper: { alignItems: 'center', marginBottom: 30 },
  trophyGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'white',
    opacity: 0.2,
    transform: [{ scale: 1.5 }],
  },
  trophyCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 100,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Score Card
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 24,
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
      android: { elevation: 15 },
    }),
  },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  starIcon: { marginHorizontal: 4 },
  messageText: { textAlign: 'center', color: '#111827', fontSize: 28, fontWeight: 'bold' },
  topicText: { textAlign: 'center', color: '#6B7280', fontSize: 16, marginBottom: 24 },

  innerScoreBadge: {
    borderRadius: 24,
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreLabel: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 16, fontWeight: '600' },
  scoreValue: { color: 'white', fontSize: 72, fontWeight: 'bold' },
  gradeLabel: { color: 'white', fontSize: 18, fontWeight: '600', marginTop: 4 },

  // Stats
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statBox: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 16, padding: 12, alignItems: 'center', marginHorizontal: 4 },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#1F2937' },
  statLabel: { fontSize: 10, color: '#6B7280', fontWeight: 'bold', marginTop: 2 },

  banner: { padding: 16, borderRadius: 16, borderLeftWidth: 4 },
  bannerText: { color: '#374151', fontSize: 13, lineHeight: 20 },

  // Buttons
  actions: { gap: 16 },
  primaryBtn: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 24,
    gap: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 5 },
    }),
  },
  primaryBtnText: { color: '#111827', fontWeight: 'bold', fontSize: 18 },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 24,
    gap: 12,
  },
  secondaryBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
});