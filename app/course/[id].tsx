// course content aka materi
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, CheckCircle, ChevronLeft, MoreVertical } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Props disesuaikan karena state progress biasanya dikelola secara global atau via Storage
interface CourseContentProps {
  onUpdateProgress?: (course: string, progress: number) => void;
  currentProgress?: number;
}

export default function CourseContentScreen({ onUpdateProgress, currentProgress = 0 }: CourseContentProps) {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Mengambil ID materi dari URL (Ejaan, Tata Kata, dll)
  const course = id as string;

  const [isCompleted, setIsCompleted] = useState(currentProgress === 100);

  const handleCompleteReading = () => {
    if (!isCompleted) {
      setIsCompleted(true);
      if (onUpdateProgress) onUpdateProgress(course, 100);
      
      // Notifikasi versi Mobile
      Alert.alert(
        "Materi Selesai! 🎉",
        "Anda telah menyelesaikan materi ini. Siap untuk mengerjakan kuis?",
        [{ text: "Mantap!", onPress: () => console.log("Done") }]
      );
    }
  };

  const getCourseData = () => {
    if (course === 'Ejaan') {
      return {
        title: 'Ejaan',
        colors: ['#FACC15', '#FB923C'] as const,
        sections: [
          {
            title: 'Penggunaan Huruf Kapital',
            content: 'Huruf kapital digunakan pada awal kalimat, nama orang, nama tempat, dan nama organisasi.\n\nContoh:\n• Saya tinggal di Jakarta.\n• Budi adalah teman saya.\n• Dia bekerja di Universitas Indonesia.',
          },
          {
            title: 'Penulisan Kata',
            content: 'Kata ditulis sesuai dengan kaidah ejaan yang berlaku. Kata dasar ditulis terpisah dari imbuhan.\n\nContoh:\n• membaca (bukan mem-baca)\n• pembelajaran (bukan pe-lajaran)',
          },
          {
            title: 'Penggunaan Tanda Baca',
            content: 'Titik (.): mengakhiri kalimat berita\nKoma (,): memisahkan unsur dalam kalimat\nTanda tanya (?): mengakhiri kalimat tanya',
          }
        ],
      };
    } else if (course === 'Tata Kata') {
      return {
        title: 'Tata Kata',
        colors: ['#F472B6', '#EC4899'] as const,
        sections: [
          {
            title: 'Pengantar Tata Kata',
            content: 'Tata kata atau morfologi membahas pembentukan kata dan hubungan antar unsur dalam kata.',
          },
          {
            title: 'Jenis-jenis Kata',
            content: 'a. Kata Benda (Nomina)\nb. Kata Kerja (Verba)\nc. Kata Sifat (Adjektiva)',
          }
        ],
      };
    } else {
      return {
        title: 'Tata Kalimat',
        colors: ['#60A5FA', '#6366F1'] as const,
        sections: [
          {
            title: 'Pengantar Kalimat',
            content: 'Kalimat adalah satuan bahasa terkecil yang mengungkapkan pikiran yang utuh. Terdiri dari S-P-O-K.',
          }
        ],
      };
    }
  };

  const courseData = getCourseData();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with Gradient */}
      <LinearGradient
        colors={courseData.colors}
        className="px-6 pt-4 pb-8 rounded-b-[40px]"
      >
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-medium">Materi</Text>
          <TouchableOpacity>
            <MoreVertical size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-3xl font-bold">{courseData.title}</Text>
          {isCompleted && <CheckCircle size={32} color="white" />}
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView 
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {courseData.sections.map((section, index) => (
          <View key={index} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
            <Text className="text-gray-900 text-xl font-bold mb-4">{section.title}</Text>
            <Text className="text-gray-700 leading-6 text-base">{section.content}</Text>
          </View>
        ))}
        
        {/* Completion Message Card */}
        <View 
          className={`border-l-4 p-6 rounded-2xl mb-10 ${
            isCompleted ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-500'
          }`}
        >
          <View className="flex-row items-start">
            {isCompleted ? (
              <CheckCircle size={24} color="#059669" />
            ) : (
              <BookOpen size={24} color="#2563EB" />
            )}
            <View className="ml-3 flex-1">
              <Text className="text-gray-900 font-bold text-lg mb-1">
                {isCompleted ? 'Selamat! 🎉' : 'Selesai Membaca?'}
              </Text>
              <Text className="text-gray-700 text-sm mb-4">
                {isCompleted 
                  ? 'Anda telah menyelesaikan materi ini. Uji pemahaman Anda dengan mengerjakan kuis!'
                  : 'Klik tombol di bawah setelah selesai membaca semua materi.'
                }
              </Text>
              {!isCompleted && (
                <TouchableOpacity onPress={handleCompleteReading}>
                  <LinearGradient
                    colors={courseData.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-3 px-6 rounded-xl self-start"
                  >
                    <Text className="text-white font-bold">Selesai Membaca Materi</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}