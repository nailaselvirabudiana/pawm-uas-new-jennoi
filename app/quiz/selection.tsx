// migrasi dari QuizSelection.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, ChevronLeft, ClipboardList } from 'lucide-react-native';
import React from 'react';
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuizSelectionScreen() {
  const router = useRouter();
  const { course } = useLocalSearchParams(); // Mengambil parameter kursus dari URL

  const getCourseData = () => {
    if (course === 'Ejaan') {
      return {
        title: 'Ejaan',
        level: 'Beginner',
        colors: ['#FACC15', '#FB923C'] as const,
        topics: [
          { name: 'Huruf Kapital', subtitle: 'Penggunaan Huruf Kapital', icon: '📄', bgColor: '#FFEDD5', textColor: '#EA580C' },
          { name: 'Penulisan Kata', subtitle: 'Kata Dasar & Berimbuhan', icon: '✏️', bgColor: '#FCE7F3', textColor: '#DB2777' },
          { name: 'Tanda Baca', subtitle: 'Titik, Koma, dll', icon: '📐', bgColor: '#DBEAFE', textColor: '#2563EB' },
          { name: 'Gabungan Kata', subtitle: 'Kata Majemuk', icon: '🔗', bgColor: '#DCFCE7', textColor: '#16A34A' },
          { name: 'Penulisan Angka', subtitle: 'Bilangan & Lambang', icon: '🔢', bgColor: '#F3E8FF', textColor: '#9333EA' },
          { name: 'Singkatan', subtitle: 'Akronim & Abbreviasi', icon: '📝', bgColor: '#E0E7FF', textColor: '#4F46E5' },
        ],
      };
    } else if (course === 'Tata Kata') {
      return {
        title: 'Tata Kata',
        level: 'Advanced',
        colors: ['#F472B6', '#EC4899'] as const,
        topics: [
          { name: 'Pengantar Tata Kata', subtitle: 'Dasar Morfologi', icon: '📚', bgColor: '#FCE7F3', textColor: '#DB2777' },
          { name: 'Kata Benda', subtitle: 'Nomina', icon: '📦', bgColor: '#F3E8FF', textColor: '#9333EA' },
          { name: 'Kata Kerja', subtitle: 'Verba', icon: '⚡', bgColor: '#DBEAFE', textColor: '#2563EB' },
          { name: 'Kata Sifat', subtitle: 'Adjektiva', icon: '⭐', bgColor: '#FEF9C3', textColor: '#CA8A04' },
        ],
      };
    } else {
      return {
        title: 'Tata Kalimat',
        level: 'Intermediate',
        colors: ['#60A5FA', '#6366F1'] as const,
        topics: [
          { name: 'Pengantar Kalimat', subtitle: 'Dasar Sintaksis', icon: '📖', bgColor: '#DBEAFE', textColor: '#2563EB' },
          { name: 'Pola Kalimat', subtitle: 'S-P-O-K', icon: '📝', bgColor: '#E0E7FF', textColor: '#4F46E5' },
          { name: 'Kalimat Aktif', subtitle: 'Transitif', icon: '➡️', bgColor: '#DCFCE7', textColor: '#16A34A' },
          { name: 'Kalimat Majemuk', subtitle: 'Setara & Bertingkat', icon: '🔀', bgColor: '#FCE7F3', textColor: '#DB2777' },
        ],
      };
    }
  };

  const courseData = getCourseData();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={courseData.colors}
          className="px-6 pt-4 pb-8 rounded-b-[40px]"
        >
          <View className="flex-row items-center justify-between mb-6">
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white font-semibold text-lg">Quiz</Text>
            <TouchableOpacity>
              <BookOpen size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View>
            <Text className="text-white text-3xl font-bold mb-2">{courseData.title}</Text>
            <View className="bg-white/30 self-start px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-medium">{courseData.level}</Text>
            </View>
          </View>

          <View className="mt-6 flex-row items-center gap-x-2">
            <ClipboardList size={16} color="rgba(255,255,255,0.8)" />
            <Text className="text-white/80 text-sm">
              {courseData.topics.length} Topik Kuis Tersedia
            </Text>
          </View>
        </LinearGradient>

        {/* Topics Grid */}
        <View className="px-6 py-8">
          <Text className="text-gray-900 text-xl font-bold mb-6">Pilih Topik Kuis</Text>
          
          <View className="flex-row flex-wrap justify-between">
            {courseData.topics.map((topic, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => router.push({
                  pathname: "/quiz/play",
                  params: { topic: topic.name, course: courseData.title }
                })}
                style={{ width: '47%' }}
                className="bg-white rounded-[32px] p-5 mb-5 shadow-sm border border-gray-100 items-start"
              >
                <View 
                  style={{ backgroundColor: topic.bgColor }}
                  className="w-12 h-12 rounded-2xl items-center justify-center mb-4"
                >
                  <Text className="text-2xl">{topic.icon}</Text>
                </View>
                <Text 
                  numberOfLines={1} 
                  className="text-gray-900 font-bold text-sm mb-1"
                >
                  {topic.name}
                </Text>
                <Text 
                  numberOfLines={2} 
                  className="text-gray-500 text-[10px] leading-4"
                >
                  {topic.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Spacer untuk Bottom Nav */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}