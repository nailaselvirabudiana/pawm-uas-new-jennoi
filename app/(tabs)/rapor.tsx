import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Award,
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface QuizHistoryItem {
  id: string;
  topic: string;
  course: string;
  score: number;
  date: string;
  time: string;
  duration: string;
  totalQuestions: number;
  correctAnswers: number;
}

interface RaporProps {
  quizHistory?: QuizHistoryItem[];
}

export default function RaporScreen({ quizHistory = [] }: RaporProps) {
  const router = useRouter();

  const getGradeColors = (score: number): [string, string] => {
    if (score >= 90) return ['#4ADE80', '#10B981'];
    if (score >= 80) return ['#60A5FA', '#06B6D4'];
    if (score >= 70) return ['#FACC15', '#FB923C'];
    if (score >= 60) return ['#FB923C', '#F87171'];
    return ['#F87171', '#EC4899'];
  };

  const calculateStats = () => {
    const total = quizHistory.length;
    const passed = quizHistory.filter(q => q.score >= 70).length;
    const avgScore = total > 0 
      ? Math.round(quizHistory.reduce((sum, q) => sum + q.score, 0) / total)
      : 0;
    return { total, passed, avgScore };
  };

  const stats = calculateStats();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.flex1}>
        
        {/* Header Section */}
        <LinearGradient
          colors={['#A78BFA', '#6366F1']}
          style={styles.headerGradient}
        >
          <View style={styles.headerNav}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitleText}>Rapor Kuis</Text>
            <View style={{ width: 24 }} />
          </View>

          <Text style={styles.heroTitle}>Riwayat Kuis</Text>
          <Text style={styles.heroSubtitle}>Lihat hasil kuis yang pernah dikerjakan</Text>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {[
              { icon: <ClipboardList size={20} color="white" />, val: stats.total, label: 'TOTAL' },
              { icon: <Award size={20} color="white" />, val: stats.passed, label: 'LULUS' },
              { icon: <BarChart3 size={20} color="white" />, val: stats.avgScore, label: 'RERATA' },
            ].map((item, i) => (
              <View key={i} style={styles.statBox}>
                {item.icon}
                <Text style={styles.statValText}>{item.val}</Text>
                <Text style={styles.statLabelText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Quiz History List */}
        <View style={styles.historySection}>
          {quizHistory.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <ClipboardList size={48} color="#CBD5E1" />
              </View>
              <Text style={styles.emptyTitle}>Belum Ada Riwayat</Text>
              <Text style={styles.emptyDesc}>
                Kerjakan kuis untuk melihat riwayat hasil belajar Anda di sini.
              </Text>
              <TouchableOpacity 
                onPress={() => router.push("/quiz/selection")}
                style={styles.startBtn}
              >
                <Text style={styles.startBtnText}>Mulai Kuis Pertama</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cardGap}>
              {quizHistory.map((quiz) => (
                <TouchableOpacity
                  key={quiz.id}
                  activeOpacity={0.8}
                  onPress={() => router.push({
                    pathname: '/quiz/result',
                    params: { score: quiz.score, topic: quiz.topic },
                  })}
                  style={styles.quizCard}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.flex1}>
                      <Text style={styles.quizTopicText}>{quiz.topic}</Text>
                      <Text style={styles.courseNameText}>{quiz.course}</Text>
                    </View>
                    <LinearGradient
                      colors={getGradeColors(quiz.score)}
                      style={styles.scoreBadge}
                    >
                      <Text style={styles.scoreValueText}>{Math.round(quiz.score)}</Text>
                      <Text style={styles.scoreLabelText}>NILAI</Text>
                    </LinearGradient>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Calendar size={14} color="#94A3B8" />
                      <Text style={styles.infoText}>{quiz.date}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Clock size={14} color="#94A3B8" />
                      <Text style={styles.infoText}>{quiz.time}</Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressRow}>
                    <View style={styles.progressBarBg}>
                      <View 
                        style={[
                          styles.progressBarFill, 
                          { 
                            width: `${quiz.score}%`,
                            backgroundColor: getGradeColors(quiz.score)[0]
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.progressFraction}>
                      {quiz.correctAnswers + "/" + quiz.totalQuestions}
                    </Text>
                  </View>

                  <View style={styles.cardFooter}>
                    <View style={[
                      styles.statusBadge, 
                      { backgroundColor: quiz.score >= 70 ? '#DCFCE7' : '#FEE2E2' }
                    ]}>
                      <Text style={[
                        styles.statusBadgeText, 
                        { color: quiz.score >= 70 ? '#15803D' : '#B91C1C' }
                      ]}>
                        {quiz.score >= 70 ? 'LULUS' : 'GAGAL'}
                      </Text>
                    </View>
                    <View style={styles.detailBtn}>
                      <Text style={styles.detailBtnText}>Detail</Text>
                      <ChevronRight size={14} color="#4F46E5" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  flex1: { flex: 1 },
  headerGradient: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
      android: { elevation: 10 },
    }),
  },
  headerNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitleText: { color: 'white', fontWeight: '600', fontSize: 18 },
  heroTitle: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  heroSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 16, marginBottom: 24 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { 
    flex: 1, 
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    borderRadius: 20, 
    padding: 12, 
    alignItems: 'center', 
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  statValText: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  statLabelText: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  
  historySection: { paddingHorizontal: 24, paddingVertical: 32 },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyIconBox: { backgroundColor: '#F1F5F9', padding: 24, borderRadius: 100, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#64748B', textAlign: 'center', paddingHorizontal: 40, lineHeight: 20, marginBottom: 24 },
  startBtn: { backgroundColor: '#6366F1', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 20 },
  startBtnText: { color: 'white', fontWeight: 'bold' },

  cardGap: { gap: 16 },
  quizCard: {
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  quizTopicText: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  courseNameText: { fontSize: 14, color: '#64748B', marginTop: 2 },
  scoreBadge: { borderRadius: 16, padding: 8, alignItems: 'center', minWidth: 60 },
  scoreValueText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  scoreLabelText: { color: 'white', fontSize: 8, fontWeight: 'bold' },

  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  infoText: { fontSize: 12, color: '#94A3B8', marginLeft: 4 },

  progressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  progressBarBg: { flex: 1, height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressFraction: { fontSize: 10, color: '#64748B', fontWeight: 'bold', marginLeft: 12 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F8FAFC' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99 },
  statusBadgeText: { fontSize: 10, fontWeight: 'bold' },
  detailBtn: { flexDirection: 'row', alignItems: 'center' },
  detailBtnText: { color: '#4F46E5', fontSize: 12, fontWeight: 'bold', marginRight: 4 }
});