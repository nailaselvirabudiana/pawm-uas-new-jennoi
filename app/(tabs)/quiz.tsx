import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuizTabScreen() {
  const router = useRouter();

  const courses = [
    {
      name: 'Ejaan',
      level: 'Beginner',
      colors: ['#FACC15', '#FB923C'] as const, // from-yellow-400 to-orange-400
      icon: '✏️',
    },
    {
      name: 'Tata Kata',
      level: 'Advanced',
      colors: ['#F472B6', '#EC4899'] as const, // from-pink-400 to-pink-500
      icon: '📝',
    },
    {
      name: 'Tata Kalimat',
      level: 'Intermediate',
      colors: ['#60A5FA', '#6366F1'] as const, // from-blue-400 to-indigo-500
      icon: '📖',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-100 flex-row items-center gap-x-4">
        <TouchableOpacity onPress={() => router.replace("/(tabs)/dashboard")}>
          <ChevronLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text className="text-gray-900 text-xl font-bold">Quiz</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="px-6 py-6"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text className="text-gray-900 text-2xl font-bold mb-1">Pilih Materi Kuis</Text>
        <Text className="text-gray-600 text-base mb-6">Uji pemahaman Anda dengan kuis</Text>

        <View className="gap-y-4">
          {courses.map((course, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => router.push({
                pathname: "/quiz/selection",
                params: { course: course.name }
              })}
              className="shadow-lg"
            >
              <LinearGradient
                colors={course.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-[28px] p-6"
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <View className="flex-row items-center gap-x-3 mb-3">
                      <Text className="text-4xl">{course.icon}</Text>
                      <Text className="text-white text-2xl font-bold">{course.name}</Text>
                    </View>
                    <View className="bg-white/30 self-start px-4 py-1.5 rounded-full">
                      <Text className="text-white text-xs font-bold tracking-wider uppercase">
                        {course.level}
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}