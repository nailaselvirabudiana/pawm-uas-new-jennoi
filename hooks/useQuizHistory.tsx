import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface QuizHistoryItem {
  id: string;
  topic: string;
  course: string;
  score: number;
  date: string;
  time: string;
  duration: string;
  totalQuestions: number;
  correctAnswers: number;
  completed_at: string;
}

export function useQuizHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('quiz_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false });

      if (error) throw error;

      const formatted = data.map((item) => ({
        id: item.id,
        topic: item.topic,
        course: item.course,
        score: item.score,
        date: new Date(item.completed_at).toLocaleDateString('id-ID'),
        time: new Date(item.completed_at).toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        duration: item.duration || '-',
        totalQuestions: item.total_questions,
        correctAnswers: item.correct_answers,
        completed_at: item.completed_at,
      }));

      setHistory(formatted);
    } catch (error) {
      console.error('Error fetching quiz history:', error);
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
    answers: Array<{
      questionId: number;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
    }>
  ) => {
    try {
      if (!user) throw new Error('No user');

      // Insert quiz history
      const { data: quizHistory, error: historyError } = await supabase
        .from('quiz_history')
        .insert({
          user_id: user.id,
          course,
          topic,
          score,
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          duration: '-', // You can calculate this
        })
        .select()
        .single();

      if (historyError) throw historyError;

      // Insert detailed answers
      const answersData = answers.map((ans) => ({
        quiz_history_id: quizHistory.id,
        question_id: ans.questionId,
        user_answer: ans.userAnswer,
        correct_answer: ans.correctAnswer,
        is_correct: ans.isCorrect,
      }));

      const { error: answersError } = await supabase
        .from('quiz_answers')
        .insert(answersData);

      if (answersError) throw answersError;

      await fetchHistory();
    } catch (error) {
      console.error('Error saving quiz result:', error);
      throw error;
    }
  };

  return {
    history,
    loading,
    saveQuizResult,
    refreshHistory: fetchHistory,
  };
}