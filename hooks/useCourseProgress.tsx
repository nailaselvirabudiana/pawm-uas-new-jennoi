import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface CourseProgress {
  course_name: string;
  progress: number;
  completed: boolean;
  last_accessed: string;
}

export function useCourseProgress() {
  const { user } = useAuth();
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      const progressMap: Record<string, number> = {};
      data.forEach((item) => {
        progressMap[item.course_name] = item.progress;
      });

      setCourseProgress(progressMap);
    } catch (error) {
      console.error('Error fetching course progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (courseName: string, progress: number) => {
    try {
      if (!user) throw new Error('No user');

      const { error } = await supabase
        .from('course_progress')
        .upsert({
          user_id: user.id,
          course_name: courseName,
          progress,
          completed: progress >= 100,
          last_accessed: new Date().toISOString(),
        }, {
          onConflict: 'user_id,course_name'
        });

      if (error) throw error;

      await fetchProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  };

  return {
    courseProgress,
    loading,
    updateProgress,
    refreshProgress: fetchProgress,
  };
}