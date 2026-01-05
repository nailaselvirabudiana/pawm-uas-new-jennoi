import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Question {
  id: string;
  course: string;
  topic: string;
  type: 'multiple-choice' | 'true-false' | 'drag-drop';
  question: string;
  options?: string[];
  drag_items?: string[];
  correct_answer: any;
  created_at: string;
}

export function useQuestions(course?: string, topic?: string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, [course, topic]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('questions').select('*');

      if (course) {
        query = query.eq('course', course);
      }
      if (topic) {
        query = query.eq('topic', topic);
      }

      const { data, error: fetchError } = await query.order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setQuestions(data || []);
    } catch (err: any) {
      console.error('Error fetching questions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getQuestionById = async (questionId: string): Promise<Question | null> => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questionId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching question:', err);
      return null;
    }
  };

  return { questions, loading, error, refetch: fetchQuestions, getQuestionById };
}