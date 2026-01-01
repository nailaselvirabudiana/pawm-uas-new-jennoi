/*migrasi dari CourseList.tsx*/
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

// Interface disesuaikan dengan kebutuhan mobile
interface CourseListProps {
  courseProgress: { [key: string]: number };
}

export default function CourseListScreen({ courseProgress = {} }: CourseListProps) {
  const router = useRouter();

  const courses = [
    {
      title: 'Ejaan',
      level: 'Beginner',
      colors: ['#FACC15', '#FB923C'] as const, // from-yellow-400 to-orange-400
      icon: '✏️',
      progress: courseProgress['Ejaan'] || 0,
      description: 'Pelajari aturan ejaan bahasa Indonesia yang baik dan benar',
    },
    {
      title: 'Tata Kata',
      level: 'Advanced',
      colors: ['#F472B6', '#EC4899'] as const, // from-pink-400 to-pink-500
      icon: '📝',
      progress: courseProgress['Tata Kata'] || 0,
      description: 'Memahami jenis-jenis kata dan pembentukannya',
    },
    {
      title: 'Tata Kalimat',
      level: 'Intermediate',
      colors: ['#60A5FA', '#6366F1'] as const, // from-blue-400 to-indigo-500
      icon: '📖',
      progress: courseProgress['Tata Kalimat'] || 0,
      description: 'Pelajari struktur dan pola kalimat bahasa Indonesia',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-gray-900 font-semibold text-lg">Courses</Text>
          <View className="w-6" /> 
        </View>

        <Text className="text-gray-900 text-3xl font-bold mb-1">Pilih Materi</Text>
        <Text className="text-gray-600 text-base mb-6">Pelajari materi Tata Bahasa Indonesia</Text>

        {/* Course Cards */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          className="space-y-4"
        >
          {courses.map((course, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: '../course/[id]',
                  params: { id: course.title },
                })
              }
              className="mb-4"
            >
              <LinearGradient
                colors={course.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-3xl p-6 shadow-md"
              >
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-x-3 mb-2">
                      <Text className="text-3xl">{course.icon}</Text>
                      <View>
                        <Text className="text-white text-2xl font-bold">{course.title}</Text>
                        <View className="bg-white/30 self-start px-3 py-1 rounded-full mt-1">
                          <Text className="text-white text-xs font-medium">
                            {course.level}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text className="text-white/90 text-sm mt-3 leading-5">
                      {course.description}
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View className="flex-row items-center gap-x-3 mt-2">
                  <View className="flex-1 bg-white/30 h-2 rounded-full overflow-hidden">
                    <View 
                      className="bg-white h-full rounded-full" 
                      style={{ width: `${course.progress}%` }} 
                    />
                  </View>
                  <Text className="text-white text-xs font-bold">{course.progress}%</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}