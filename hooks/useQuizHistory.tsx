import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import { useEffect, useState } from 'react';

export interface QuizHistory {
  id: string;
  user_id: string;
  course: string;
  topic: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  duration: string | null;
  completed_at: string;
}

export interface QuizAnswer {
  id: string;
  quiz_history_id: string;
  question_id: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  created_at: string;
}

export function useQuizHistory() {
  const { user } = useAuth();
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchQuizHistory();
    } else {
      setQuizHistory([]);
      setLoading(false);
    }
  }, [user]);

  const fetchQuizHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quiz_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      setQuizHistory(data || []);
    } catch (error) {
      console.log('Error fetching quiz history:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveQuizResult = async (
    course: string,
    topic: string,
    score: number,
    totalQuestions: number,
    correctAnswers: number,
    duration: string | null,
    answers: Array<{
      question_id: string;
      user_answer: string;
      correct_answer: string;
      is_correct: boolean;
    }>
  ) => {
    try {
      if (!user) throw new Error('User not authenticated');

      // Save quiz history
      const { data: historyData, error: historyError } = await supabase
        .from('quiz_history')
        .insert({
          user_id: user.id,
          course,
          topic,
          score,
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          duration,
        })
        .select()
        .single();

      if (historyError) throw historyError;

      // Save quiz answers
      const answersToInsert = answers.map(answer => ({
        quiz_history_id: historyData.id,
        question_id: answer.question_id,
        user_answer: answer.user_answer,
        correct_answer: answer.correct_answer,
        is_correct: answer.is_correct,
      }));

      const { error: answersError } = await supabase
        .from('quiz_answers')
        .insert(answersToInsert);

      if (answersError) throw answersError;

      await fetchQuizHistory();
      return historyData;
    } catch (error) {
      console.log('Error saving quiz result:', error);
      throw error;
    }
  };

  const getQuizAnswers = async (quizHistoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('quiz_answers')
        .select('*')
        .eq('quiz_history_id', quizHistoryId)
        .order('question_id', { ascending: true });

      if (error) throw error;
      return data as QuizAnswer[];
    } catch (error) {
      console.log('Error fetching quiz answers:', error);
      return [];
    }
  };

  const getCategoryStats = (course: string, topic: string) => {
    const categoryQuizzes = quizHistory.filter(
      q => q.course === course && q.topic === topic
    );
    if (categoryQuizzes.length === 0) return null;

    const totalScore = categoryQuizzes.reduce((sum, q) => sum + q.score, 0);
    const avgScore = totalScore / categoryQuizzes.length;
    const bestScore = Math.max(...categoryQuizzes.map(q => q.score));
    
    return {
      totalAttempts: categoryQuizzes.length,
      averageScore: Math.round(avgScore),
      bestScore,
      lastAttempt: categoryQuizzes[0],
    };
  };

  const getQuizDetail = async (quizHistoryId: string) => {
    try {
      // 1. Ambil data quiz history
      const { data: historyData, error: historyError } = await supabase
        .from('quiz_history')
        .select('*')
        .eq('id', quizHistoryId)
        .single();

      if (historyError) throw historyError;

      // 2. Ambil semua jawaban dari quiz ini
      const { data: answersData, error: answersError } = await supabase
        .from('quiz_answers')
        .select('*')
        .eq('quiz_history_id', quizHistoryId);

      if (answersError) throw answersError;

      // 3. Ambil detail pertanyaan untuk setiap jawaban
      const detailedAnswers = await Promise.all(
        answersData.map(async (answer) => {
          const { data: questionData } = await supabase
            .from('questions')
            .select('*')
            .eq('id', answer.question_id)
            .single();

          return {
            questionId: answer.question_id,
            question: questionData?.question || '',
            type: questionData?.type || 'multiple-choice',
            userAnswer: JSON.parse(answer.user_answer),
            correctAnswer: JSON.parse(answer.correct_answer),
            isCorrect: answer.is_correct,
            explanation: questionData?.explanation || 'Tidak ada pembahasan tersedia.',
            options: questionData?.options || null,
            dragItems: questionData?.drag_items || null,
          };
        })
      );

      return {
        ...historyData,
        answers: detailedAnswers,
      };
    } catch (error) {
      console.error('Error fetching quiz detail:', error);
      return null;
    }
  };

  return {
    quizHistory,
    loading,
    saveQuizResult,
    getQuizAnswers,
    getQuizDetail,
    getCategoryStats,
    refreshHistory: fetchQuizHistory,
  };
}