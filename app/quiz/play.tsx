import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, GripVertical, MoreVertical } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useQuizHistory } from '@/hooks/useQuizHistory';
import { useQuestions, Question } from '@/hooks/useQuestions';

const { width } = Dimensions.get('window');

export default function QuizPlayScreen() {
  const router = useRouter();
  const { topic, course } = useLocalSearchParams<{ topic?: string | string[]; course?: string | string[] }>();
  
  const { saveQuizResult } = useQuizHistory();
  
  const topicName = Array.isArray(topic) ? topic[0] : topic;
  const courseName = Array.isArray(course) ? course[0] : course;
  
  const { questions, loading } = useQuestions(courseName, topicName);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [dragData, setDragData] = useState<string[]>([]);

  const renderDragItem = useCallback(({ item, drag, isActive }: RenderItemParams<string>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          activeOpacity={1}
          style={[
            styles.dragItem,
            isActive ? styles.dragItemActive : styles.dragItemInactive
          ]}
        >
          <GripVertical size={20} color={isActive ? "#6366F1" : "#94A3B8"} />
          <Text style={[styles.dragText, isActive && { color: '#4338CA' }]}>{item}</Text>
          <View style={[styles.dragHandleIndicator, isActive && { backgroundColor: '#6366F1' }]} />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  }, []);

  useEffect(() => {
    if (questions.length > 0 && questions[currentIdx]?.type === 'drag-drop') {
      const dragItems = questions[currentIdx].drag_items || [];
      setDragData(dragItems);
      const questionId = questions[currentIdx].id;
      setSelectedAnswers((prev: any) => ({ ...prev, [questionId]: dragItems }));
    }
  }, [currentIdx, questions]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={{ color: 'white', marginTop: 10 }}>Memuat soal...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
          Belum ada soal untuk topik ini
        </Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQ = questions[currentIdx];

  const handleSelect = (ans: any) => {
    setSelectedAnswers((prev: any) => ({ ...prev, [currentQ.id]: ans }));
  };

  const next = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      let score = 0;
      const answers: any[] = [];
      
      questions.forEach(q => {
        const isCorrect = JSON.stringify(selectedAnswers[q.id]) === JSON.stringify(q.correct_answer);
        if (isCorrect) score += (100 / questions.length);
        
        answers.push({
          question_id: q.id,
          user_answer: JSON.stringify(selectedAnswers[q.id]),
          correct_answer: JSON.stringify(q.correct_answer),
          is_correct: isCorrect
        });
      });

      const correctCount = answers.filter(a => a.is_correct).length;
      
      try {
        await saveQuizResult(
          String(courseName),
          String(topicName),
          Math.round(score),
          questions.length,
          correctCount,
          null,
          answers
        );
      } catch (error) {
        console.log('Error saving quiz:', error);
      }

      router.push({
        pathname: "/quiz/result",
        params: {
          score: Math.round(score),
          topic: topicName,
          course: courseName,
        },
      });
    }
  };

  // Get options for current question
  const getOptions = () => {
    if (currentQ.type === 'true-false') {
      return ['Benar', 'Salah'];
    }
    return currentQ.options || [];
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <LinearGradient colors={['#6366F1', '#4338CA']} style={styles.gradient}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <ChevronLeft color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{topicName}</Text>
              <MoreVertical color="white" />
            </View>

            <View style={styles.quizInfo}>
              <Text style={styles.progressText}>Soal {currentIdx + 1}/{questions.length}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{currentQ.type.replace('-', ' ')}</Text>
              </View>
            </View>

            <Text style={styles.questionText}>{currentQ.question}</Text>

            <View style={styles.card}>
              {currentQ.type !== 'drag-drop' ? (
                <View style={{ gap: 12 }}>
                  {getOptions().map((opt: string, i: number) => (
                    <TouchableOpacity 
                      key={i} 
                      onPress={() => handleSelect(opt)}
                      style={[styles.optBtn, selectedAnswers[currentQ.id] === opt && styles.optBtnActive]}
                    >
                      <View style={[styles.radio, selectedAnswers[currentQ.id] === opt && styles.radioActive]}>
                        {selectedAnswers[currentQ.id] === opt && <View style={styles.radioInner} />}
                      </View>
                      <Text style={[styles.optText, selectedAnswers[currentQ.id] === opt && styles.optTextActive]}>
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={{ flex: 1 }}>
                  <Text style={styles.dragHint}>Tahan dan geser item untuk mengurutkan</Text>
                  <DraggableFlatList
                    data={dragData}
                    onDragEnd={({ data }) => {
                      setDragData(data);
                      handleSelect(data);
                    }}
                    keyExtractor={(item) => item}
                    renderItem={renderDragItem}
                    containerStyle={{ flex: 1 }}
                  />
                </View>
              )}

              <TouchableOpacity 
                onPress={next} 
                disabled={!selectedAnswers[currentQ.id]}
                style={[styles.nextBtn, !selectedAnswers[currentQ.id] && { opacity: 0.5 }]}
              >
                <Text style={styles.nextBtnText}>
                  {currentIdx === questions.length - 1 ? 'Selesai' : 'Lanjut'}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </GestureHandlerRootView>
  );
}

// ...existing styles...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4338CA' },
  gradient: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    alignItems: 'center' 
  },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  quizInfo: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 25, 
    marginBottom: 15 
  },
  progressText: { color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  badge: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12 
  },
  badgeText: { 
    color: 'white', 
    fontSize: 10, 
    fontWeight: 'bold', 
    textTransform: 'uppercase' 
  },
  questionText: { 
    color: 'white', 
    fontSize: 22, 
    fontWeight: 'bold', 
    paddingHorizontal: 25, 
    marginBottom: 20, 
    lineHeight: 30 
  },
  card: { 
    flex: 1, 
    backgroundColor: 'white', 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    padding: 25, 
    paddingBottom: 40 
  },
  optBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 18, 
    borderRadius: 20, 
    borderWidth: 1.5, 
    borderColor: '#F1F5F9' 
  },
  optBtnActive: { borderColor: '#6366F1', backgroundColor: '#EEF2FF' },
  radio: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: '#CBD5E1', 
    marginRight: 12, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  radioActive: { borderColor: '#6366F1' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#6366F1' },
  optText: { color: '#475569', fontSize: 15 },
  optTextActive: { color: '#6366F1', fontWeight: 'bold' },
  
  dragHint: { 
    textAlign: 'center', 
    color: '#94A3B8', 
    fontSize: 12, 
    marginBottom: 15, 
    fontStyle: 'italic' 
  },
  dragItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 18, 
    borderRadius: 20, 
    marginBottom: 12, 
    borderWidth: 1.5,
  },
  dragItemInactive: { 
    backgroundColor: '#F8FAFC', 
    borderColor: '#E2E8F0' 
  },
  dragItemActive: { 
    backgroundColor: '#EEF2FF', 
    borderColor: '#6366F1',
    ...Platform.select({
      ios: { 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4 
      },
      android: { elevation: 3 }
    })
  },
  dragText: { 
    color: '#1E293B', 
    fontSize: 15, 
    fontWeight: '500', 
    flex: 1, 
    marginLeft: 10 
  },
  dragHandleIndicator: { 
    width: 4, 
    height: 20, 
    borderRadius: 2, 
    backgroundColor: '#E2E8F0' 
  },

  nextBtn: { 
    backgroundColor: '#6366F1', 
    padding: 18, 
    borderRadius: 20, 
    alignItems: 'center', 
    marginTop: 10 
  },
  nextBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});