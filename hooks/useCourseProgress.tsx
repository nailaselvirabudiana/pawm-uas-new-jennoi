import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface CourseProgress {
  id: string;
  user_id: string;
  course_name: string;
  progress: number;
  completed: boolean;
  last_accessed: string;
  created_at: string;
}

export function useCourseProgress() {
  const { user } = useAuth();
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      console.log('User logged in, fetching progress for user:', user.id);
      fetchProgress();
      
      // Subscribe to realtime changes
      const subscription = supabase
        .channel('course_progress_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'course_progress',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Progress changed:', payload);
            
            // Update local state immediately from realtime event
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const newData = payload.new as CourseProgress;
              setCourseProgress(prev => ({
                ...prev,
                [newData.course_name]: newData.progress
              }));
            }
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } else {
      console.log('No user found, skipping progress fetch');
      setLoading(false);
      setCourseProgress({});
    }
  }, [user?.id]);

  const fetchProgress = async () => {
    if (!user?.id) {
      console.log('No user ID available for fetching progress');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching progress for user:', user.id);
      
      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      const progressMap: Record<string, number> = {};
      data?.forEach((item) => {
        progressMap[item.course_name] = item.progress;
      });

      console.log('Fetched progress:', progressMap);
      setCourseProgress(progressMap);
    } catch (error) {
      console.error('Error fetching course progress:', error);
      setCourseProgress({});
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (courseName: string, progress: number) => {
    if (!user?.id) {
      console.error('No user ID available for updating progress');
      throw new Error('User not logged in');
    }

    try {
      console.log('Updating progress:', { userId: user.id, courseName, progress });

      // Check if record exists
      const { data: existing } = await supabase
        .from('course_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_name', courseName)
        .maybeSingle();

      let result;
      
      if (existing) {
        // Update existing record
        result = await supabase
          .from('course_progress')
          .update({
            progress: progress,
            completed: progress >= 100,
            last_accessed: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .eq('course_name', courseName)
          .select()
          .single();
      } else {
        // Insert new record
        result = await supabase
          .from('course_progress')
          .insert({
            user_id: user.id,
            course_name: courseName,
            progress: progress,
            completed: progress >= 100,
            last_accessed: new Date().toISOString(),
          })
          .select()
          .single();
      }

      if (result.error) {
        console.error('Update/Insert error:', result.error);
        throw result.error;
      }

      console.log('Progress updated successfully:', result.data);

      // Immediately update local state
      setCourseProgress(prev => ({
        ...prev,
        [courseName]: progress
      }));

      return result.data;
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