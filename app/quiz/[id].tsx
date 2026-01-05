import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react-native';
import { useQuizHistory } from '@/hooks/useQuizHistory';

const { width } = Dimensions.get('window');

interface QuizAnswer {
  questionId: number;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'drag-drop';
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  explanation: string;
  options?: string[];
}

interface QuizDetail {
  id: string;
  topic: string;
  course: string;
  score: number;
  completed_at: string;
  total_questions: number;
  correct_answers: number;
  answers: QuizAnswer[];
}

export default function QuizDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getQuizDetail } = useQuizHistory();
  
  const [quizData, setQuizData] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizDetail();
  }, [id]);

  const loadQuizDetail = async () => {
    try {
      setLoading(true);
      const data = await getQuizDetail(id as string);
      if (data) {
        // Format tanggal
        const date = new Date(data.completed_at);
        const formattedData = {
          ...data,
          date: date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        setQuizData(formattedData);
      }
    } catch (error) {
      console.error('Error loading quiz detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColors = (score: number): [string, string] => {
    if (score >= 90) return ['#4ADE80', '#10B981'];
    if (score >= 80) return ['#60A5FA', '#06B6D4'];
    if (score >= 70) return ['#FACC15', '#FB923C'];
    if (score >= 60) return ['#FB923C', '#F87171'];
    return ['#F87171', '#EC4899'];
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!quizData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ textAlign: 'center', color: '#64748B' }}>Data tidak ditemukan</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: '#6366F1' }}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentColors = getGradeColors(quizData.score);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.flex1}>
        
        {/* Header Section */}
        <LinearGradient colors={currentColors} style={styles.headerGradient}>
          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Detail Kuis</Text>
            <View style={{ width: 24 }} />
          </View>

          <Text style={styles.heroTitle}>{quizData.topic}</Text>
          <Text style={styles.heroSubtitle}>{quizData.course}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Calendar size={14} color="rgba(255,255,255,0.9)" />
              <Text style={styles.metaText}>{quizData.date}</Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={14} color="rgba(255,255,255,0.9)" />
              <Text style={styles.metaText}>{quizData.time}</Text>
            </View>
          </View>

          {/* Score Card Overlay */}
          <View style={styles.scoreCard}>
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreLabel}>Nilai Anda</Text>
              <Text style={styles.scoreValue}>{Math.round(quizData.score)}</Text>
            </View>
            <View style={styles.scoreDivider} />
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreLabel}>Jawaban Benar</Text>
              <Text style={styles.scoreValue}>
                {quizData.correct_answers}/{quizData.total_questions}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Answers List */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Pembahasan Soal</Text>
          
          {quizData.answers.map((answer, index) => (
            <View 
              key={answer.questionId} 
              style={[
                styles.questionCard, 
                { borderColor: answer.isCorrect ? '#DCFCE7' : '#FEE2E2' }
              ]}
            >
              {/* Card Header */}
              <View style={[
                styles.cardHeader, 
                { backgroundColor: answer.isCorrect ? '#F0FDF4' : '#FEF2F2' }
              ]}>
                <View style={styles.flexRowBetween}>
                  <Text style={styles.questionIndex}>Soal {index + 1}</Text>
                  <View style={styles.statusBadge}>
                    {answer.isCorrect ? (
                      <View style={styles.badgeInner}>
                        <CheckCircle size={16} color="#16A34A" />
                        <Text style={[styles.statusText, { color: '#16A34A' }]}>Benar</Text>
                      </View>
                    ) : (
                      <View style={styles.badgeInner}>
                        <XCircle size={16} color="#DC2626" />
                        <Text style={[styles.statusText, { color: '#DC2626' }]}>Salah</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.questionLabel}>{answer.question}</Text>
              </View>

              {/* Card Body */}
              <View style={styles.cardBody}>
                {/* Options Logic */}
                {(answer.type === 'multiple-choice' || answer.type === 'true-false') && (
                  <View style={styles.optionsList}>
                    {(answer.options || ['Benar', 'Salah']).map((option: string, idx: number) => {
                      const isUserAns = option === answer.userAnswer;
                      const isCorrectAns = option === answer.correctAnswer;
                      
                      let borderStyle = styles.optBorderDefault;
                      let bgStyle = styles.optBgDefault;
                      let textStyle = styles.optTextDefault;

                      if (isCorrectAns) {
                        borderStyle = styles.optBorderCorrect;
                        bgStyle = styles.optBgCorrect;
                        textStyle = styles.optTextCorrect;
                      } else if (isUserAns && !answer.isCorrect) {
                        borderStyle = styles.optBorderWrong;
                        bgStyle = styles.optBgWrong;
                        textStyle = styles.optTextWrong;
                      }

                      return (
                        <View key={idx} style={[styles.optionItem, borderStyle, bgStyle]}>
                          <Text style={textStyle}>{option}</Text>
                          {isCorrectAns && <CheckCircle size={14} color="#16A34A" />}
                          {isUserAns && !answer.isCorrect && <XCircle size={14} color="#DC2626" />}
                        </View>
                      );
                    })}
                  </View>
                )}

                {/* Drag Drop Review */}
                {answer.type === 'drag-drop' && (
                  <View style={styles.dragReview}>
                    <Text style={styles.reviewLabel}>Jawaban Anda:</Text>
                    <View style={[styles.dragBox, answer.isCorrect ? styles.optBgCorrect : styles.optBgWrong]}>
                      <Text style={answer.isCorrect ? styles.optTextCorrect : styles.optTextWrong}>
                        {Array.isArray(answer.userAnswer) ? answer.userAnswer.join(' → ') : answer.userAnswer}
                      </Text>
                    </View>
                    {!answer.isCorrect && (
                      <>
                        <Text style={[styles.reviewLabel, { marginTop: 10 }]}>Kunci Jawaban:</Text>
                        <View style={[styles.dragBox, styles.optBgCorrect]}>
                          <Text style={styles.optTextCorrect}>
                            {Array.isArray(answer.correctAnswer) ? answer.correctAnswer.join(' → ') : answer.correctAnswer}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                )}

                {/* Explanation Box */}
                <View style={styles.explanationBox}>
                  <Text style={styles.explanationTitle}>💡 Pembahasan:</Text>
                  <Text style={styles.explanationText}>{answer.explanation}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomBar}>
        <LinearGradient colors={['#A78BFA', '#6366F1']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.btnGradient}>
          <TouchableOpacity style={styles.btnAction} onPress={() => router.replace('/rapor')}>
            <Text style={styles.btnText}>Kembali ke Rapor</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 4, backgroundColor: '#F8FAFC' },
  flex1: { flex: 1 },
  headerGradient: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 140,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
  },
  navRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  heroTitle: { color: 'white', fontSize: 26, fontWeight: '800', marginBottom: 4 },
  heroSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 16, marginBottom: 16 },
  metaRow: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { color: 'white', fontSize: 12 },
  
  scoreCard: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15 },
      android: { elevation: 10 },
    })
  },
  scoreInfo: { flex: 1, alignItems: 'center' },
  scoreLabel: { color: '#64748B', fontSize: 11, marginBottom: 4 },
  scoreValue: { color: '#1E293B', fontSize: 28, fontWeight: 'bold' },
  scoreDivider: { width: 1, height: '100%', backgroundColor: '#E2E8F0' },

  contentSection: { paddingHorizontal: 24, paddingTop: 60 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 20 },
  
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    marginBottom: 20,
    borderWidth: 2,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 3 },
    }),
  },
  cardHeader: { padding: 16 },
  flexRowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  questionIndex: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  
  // --- PERBAIKAN PROPERTY YANG ERROR ---
  statusBadge: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  badgeInner: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  questionLabel: { fontSize: 16, color: '#1E293B', fontWeight: 'bold', lineHeight: 22 },
  
  cardBody: { padding: 16 },
  optionsList: { gap: 10, marginBottom: 16 },
  optionItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 12, 
    borderRadius: 12, 
    borderWidth: 1.5 
  },
  optBorderDefault: { borderColor: '#F1F5F9' },
  optBgDefault: { backgroundColor: 'transparent' },
  optTextDefault: { color: '#475569' },
  optBorderCorrect: { borderColor: '#22C55E' },
  optBgCorrect: { backgroundColor: '#F0FDF4' },
  optTextCorrect: { color: '#15803D', fontWeight: '600' },
  optBorderWrong: { borderColor: '#EF4444' },
  optBgWrong: { backgroundColor: '#FEF2F2' },
  optTextWrong: { color: '#B91C1C', fontWeight: '600' },

  dragReview: { marginBottom: 16 },
  reviewLabel: { fontSize: 12, color: '#64748B', marginBottom: 8 },
  dragBox: { padding: 12, borderRadius: 12, borderWidth: 1.5 },

  explanationBox: { 
    backgroundColor: '#EFF6FF', 
    padding: 16, 
    borderRadius: 12, 
    borderLeftWidth: 4, 
    borderLeftColor: '#3B82F6' 
  },
  explanationTitle: { fontSize: 13, fontWeight: 'bold', color: '#1E40AF', marginBottom: 4 },
  explanationText: { fontSize: 13, color: '#1E3A8A', lineHeight: 20 },

  bottomBar: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#F1F5F9' 
  },
  btnGradient: { borderRadius: 16 },
  btnAction: { paddingVertical: 16, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});