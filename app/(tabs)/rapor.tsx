/*migrasi dari Rapor.tsx*/
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
import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Interface Data
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

  // Konversi gradien web ke HEX untuk React Native
  const getGradeColors = (score: number): readonly [string, string, ...string[]] => {
    if (score >= 90) return ['#4ADE80', '#10B981']; // green
    if (score >= 80) return ['#60A5FA', '#06B6D4']; // blue
    if (score >= 70) return ['#FACC15', '#FB923C']; // orange
    if (score >= 60) return ['#FB923C', '#F87171']; // red-orange
    return ['#F87171', '#EC4899']; // red-pink
  };

  const getStatusBadge = (score: number) => {
    const isPassed = score >= 70;
    return (
      <View className={`px-3 py-1 rounded-full ${isPassed ? 'bg-green-100' : 'bg-red-100'}`}>
        <Text className={`text-[10px] font-bold ${isPassed ? 'text-green-700' : 'text-red-700'}`}>
          {isPassed ? 'LULUS' : 'GAGAL'}
        </Text>
      </View>
    );
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
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        
        {/* Header Section */}
        <LinearGradient
          colors={['#A78BFA', '#6366F1']}
          className="px-6 pt-6 pb-10 rounded-b-[40px] shadow-lg"
        >
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white font-semibold text-lg">Rapor Kuis</Text>
            <View className="w-6" />
          </View>

          <Text className="text-white text-3xl font-bold mb-1">Riwayat Kuis</Text>
          <Text className="text-white/80 text-base mb-6">Lihat hasil kuis yang pernah dikerjakan</Text>

          {/* Stats Grid */}
          <View className="flex-row justify-between gap-x-2">
            {[
              { icon: <ClipboardList size={20} color="white" />, val: stats.total, label: 'Total' },
              { icon: <Award size={20} color="white" />, val: stats.passed, label: 'Lulus' },
              { icon: <BarChart3 size={20} color="white" />, val: stats.avgScore, label: 'Rerata' },
            ].map((item, i) => (
              <View key={i} className="flex-1 bg-white/20 rounded-2xl p-3 items-center border border-white/30">
                {item.icon}
                <Text className="text-white text-xl font-bold mt-1">{item.val}</Text>
                <Text className="text-white/80 text-[10px] uppercase tracking-tighter">{item.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Quiz History List */}
        <View className="px-6 py-8">
          {quizHistory.length === 0 ? (
            <View className="items-center py-20">
              <View className="bg-gray-100 p-6 rounded-full mb-4">
                <ClipboardList size={48} color="#CBD5E1" />
              </View>
              <Text className="text-gray-900 text-lg font-bold mb-1">Belum Ada Riwayat</Text>
              <Text className="text-gray-500 text-center mb-6 px-10">
                Kerjakan kuis untuk melihat riwayat hasil belajar Anda di sini.
              </Text>
              <TouchableOpacity 
                onPress={() => router.push("/quiz/selection")}
                className="bg-indigo-500 px-8 py-4 rounded-2xl shadow-md"
              >
                <Text className="text-white font-bold">Mulai Kuis Pertama</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="gap-y-4">
              {quizHistory.map((quiz) => (
                <TouchableOpacity
                  key={quiz.id}
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push({
                      pathname: '/quiz/result',
                      params: { score: quiz.score, topic: quiz.topic },
                    })
                  }
                  className="bg-white rounded-[28px] p-5 shadow-sm border border-gray-100"
                >
                  <View className="flex-row justify-between mb-4">
                    <View className="flex-1 pr-4">
                      <Text className="text-gray-900 font-bold text-lg mb-1">{quiz.topic}</Text>
                      <Text className="text-gray-500 text-sm">{quiz.course}</Text>
                    </View>
                    <LinearGradient
                      colors={getGradeColors(quiz.score)}
                      className="rounded-2xl px-3 py-2 items-center justify-center min-w-[55px]"
                    >
                      <Text className="text-white text-xl font-bold">{Math.round(quiz.score)}</Text>
                      <Text className="text-white text-[8px] font-bold">NILAI</Text>
                    </LinearGradient>
                  </View>

                  <View className="flex-row items-center gap-x-4 mb-4">
                    <View className="flex-row items-center gap-x-1">
                      <Calendar size={14} color="#94A3B8" />
                      <Text className="text-gray-400 text-xs">{quiz.date}</Text>
                    </View>
                    <View className="flex-row items-center gap-x-1">
                      <Clock size={14} color="#94A3B8" />
                      <Text className="text-gray-400 text-xs">{quiz.time}</Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="flex-row items-center gap-x-3 mb-4">
                    <View className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <View 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${quiz.score}%`,
                          backgroundColor: getGradeColors(quiz.score)[0]
                        }} 
                      />
                    </View>
                    <Text className="text-gray-500 text-[10px] font-bold">
                      {quiz.correctAnswers}/{quiz.totalQuestions}
                    </Text>
                  </View>

                  <View className="flex-row justify-between items-center pt-2 border-t border-gray-50">
                    {getStatusBadge(quiz.score)}
                    <View className="flex-row items-center">
                      <Text className="text-indigo-600 text-xs font-bold mr-1">Detail</Text>
                      <ChevronRight size={14} color="#4F46E5" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}