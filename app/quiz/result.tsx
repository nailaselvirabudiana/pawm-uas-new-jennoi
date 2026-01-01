// migrasi dari QuizResult.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Home, RotateCcw, Star, Trophy } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuizResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Mengambil data dari navigasi (dikirim dari play.tsx)
  const score = Number(params.score) || 0;
  const topic = params.topic as string || "Kuis";
  
  const getGrade = (score: number) => {
    if (score >= 90) return { grade: 'A', message: 'Excellent!', colors: ['#4ADE80', '#10B981'] as const };
    if (score >= 80) return { grade: 'B', message: 'Great Job!', colors: ['#60A5FA', '#06B6D4'] as const };
    if (score >= 70) return { grade: 'C', message: 'Good Work!', colors: ['#FACC15', '#FB923C'] as const };
    if (score >= 60) return { grade: 'D', message: 'Keep Practicing', colors: ['#FB923C', '#F87171'] as const };
    return { grade: 'E', message: 'Try Again', colors: ['#F87171', '#EC4899'] as const };
  };

  const result = getGrade(score);
  const isPassed = score >= 70;
  const starsCount = Math.ceil(score / 33.33); 

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={result.colors}
        className="flex-1 px-6 justify-center"
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 40 }}>
          
          {/* Trophy Icon */}
          <View className="items-center mb-8">
            <View className="relative">
              <View className="absolute inset-0 bg-white opacity-20 rounded-full scale-150 blur-xl" />
              <View className="bg-white/30 rounded-full p-8 border border-white/20">
                <Trophy size={80} color="white" />
              </View>
            </View>
          </View>

          {/* Main Score Card */}
          <View className="bg-white rounded-[40px] p-8 shadow-2xl mb-6">
            {/* Stars Section */}
            <View className="flex-row justify-center gap-x-2 mb-6">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  size={32}
                  color={s <= starsCount ? "#FACC15" : "#E2E8F0"}
                  fill={s <= starsCount ? "#FACC15" : "transparent"}
                />
              ))}
            </View>

            <Text className="text-center text-gray-900 text-3xl font-bold mb-1">{result.message}</Text>
            <Text className="text-center text-gray-500 text-base mb-8">Kuis {topic} selesai</Text>

            {/* Score Display Area */}
            <LinearGradient
              colors={result.colors}
              className="rounded-3xl p-8 mb-6 items-center"
            >
              <Text className="text-white/80 font-medium mb-1 text-base">Skor Anda</Text>
              <Text className="text-white text-7xl font-bold">{Math.round(score)}</Text>
              <Text className="text-white/90 text-xl mt-2 font-semibold">Nilai: {result.grade}</Text>
            </LinearGradient>

            {/* Stats Row */}
            <View className="flex-row gap-x-3 mb-6">
              <View className="flex-1 bg-gray-50 rounded-2xl p-4 items-center">
                <Text className="text-2xl font-bold text-gray-800">5</Text>
                <Text className="text-[10px] text-gray-500 uppercase font-bold">Soal</Text>
              </View>
              <View className="flex-1 bg-green-50 rounded-2xl p-4 items-center">
                <Text className="text-2xl font-bold text-green-600">{Math.round(score / 20)}</Text>
                <Text className="text-[10px] text-gray-500 uppercase font-bold">Benar</Text>
              </View>
              <View className="flex-1 bg-red-50 rounded-2xl p-4 items-center">
                <Text className="text-2xl font-bold text-red-600">{5 - Math.round(score / 20)}</Text>
                <Text className="text-[10px] text-gray-500 uppercase font-bold">Salah</Text>
              </View>
            </View>

            {/* Status Message */}
            <View className={`border-l-4 p-4 rounded-xl ${isPassed ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-500'}`}>
              <Text className="text-gray-700 text-sm leading-5">
                {isPassed
                  ? '🎉 Selamat! Anda lulus kuis ini. Terus tingkatkan kemampuan Anda!'
                  : '💪 Jangan menyerah! Pelajari materi kembali dan coba lagi.'}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-y-4">
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => router.push("/quiz/selection")}
              className="w-full bg-white flex-row items-center justify-center py-5 rounded-3xl shadow-lg gap-x-3"
            >
              <RotateCcw size={20} color="#1F2937" />
              <Text className="text-gray-900 font-bold text-lg">Kuis Lain</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => router.replace("/(tabs)/dashboard")}
              className="w-full bg-white/20 border border-white/30 flex-row items-center justify-center py-5 rounded-3xl gap-x-3"
            >
              <Home size={20} color="white" />
              <Text className="text-white font-bold text-lg">Kembali ke Beranda</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}