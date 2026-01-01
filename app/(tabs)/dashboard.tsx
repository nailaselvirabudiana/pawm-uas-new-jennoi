/*migrasi dari Dashboard.tsx*/
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  BookOpen,
  Layout,
  LogOut,
  Target,
  Trophy
} from 'lucide-react-native';
import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DashboardProps {
  onLogout?: () => void;
  courseProgress?: { [key: string]: number };
}

export default function DashboardScreen({ 
  onLogout, 
  courseProgress = { 'Ejaan': 0, 'Tata Kata': 0, 'Tata Kalimat': 0 } 
}: DashboardProps) {
  const router = useRouter();

  // Menghitung rata-rata progres keseluruhan
  const totalProgress = Object.values(courseProgress).reduce((a, b) => a + b, 0);
  const averageProgress = Math.round(totalProgress / 3);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        
        {/* Header Section */}
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          className="px-6 pt-8 pb-12 rounded-b-[40px] shadow-lg"
        >
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-white/80 text-base">Selamat Datang,</Text>
              <Text className="text-white text-2xl font-bold">Pelajar TaBa! 👋</Text>
            </View>
            <TouchableOpacity 
              onPress={onLogout}
              className="bg-white/20 p-2 rounded-full"
            >
              <LogOut size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Overall Progress Card */}
          <View className="bg-white p-6 rounded-3xl shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-x-2">
                <Target size={20} color="#4F46E5" />
                <Text className="text-gray-800 font-semibold text-base">Total Progres</Text>
              </View>
              <Text className="text-indigo-600 font-bold text-lg">{averageProgress}%</Text>
            </View>
            <View className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
              <View 
                className="bg-indigo-500 h-full rounded-full" 
                style={{ width: `${averageProgress}%` }} 
              />
            </View>
          </View>
        </LinearGradient>

        {/* Menu Aksi Cepat */}
        <View className="px-6 -mt-6">
          <View className="flex-row gap-x-4">
            <TouchableOpacity 
              onPress={() => router.push("/course")}
              className="flex-1 bg-white p-4 rounded-2xl shadow-sm items-center border border-gray-100"
            >
              <View className="bg-blue-100 p-3 rounded-full mb-2">
                <BookOpen size={24} color="#2563EB" />
              </View>
              <Text className="text-gray-800 font-medium">Materi</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push("/quiz/selection")}
              className="flex-1 bg-white p-4 rounded-2xl shadow-sm items-center border border-gray-100"
            >
              <View className="bg-purple-100 p-3 rounded-full mb-2">
                <Trophy size={24} color="#7C3AED" />
              </View>
              <Text className="text-gray-800 font-medium">Kuis</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ringkasan Materi */}
        <View className="px-6 mt-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 text-lg font-bold">Lanjutkan Belajar</Text>
            <TouchableOpacity onPress={() => router.push("/course")}>
              <Text className="text-indigo-600 font-medium">Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {['Ejaan', 'Tata Kata', 'Tata Kalimat'].map((materi) => (
            <TouchableOpacity 
              key={materi}
              onPress={() =>
                router.push({
                  pathname: '../course/[id]',
                  params: { id: materi },
                })
              }
              className="bg-white p-4 rounded-2xl mb-4 flex-row items-center shadow-sm border border-gray-50"
            >
              <View className="w-12 h-12 bg-indigo-50 rounded-xl items-center justify-center mr-4">
                <Layout size={24} color="#4F46E5" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base mb-1">{materi}</Text>
                <View className="flex-row items-center gap-x-2">
                  <View className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <View 
                      className="bg-indigo-400 h-full rounded-full" 
                      style={{ width: `${courseProgress[materi] || 0}%` }} 
                    />
                  </View>
                  <Text className="text-gray-500 text-xs">{courseProgress[materi] || 0}%</Text>
                </View>
              </View>
              <ArrowRight size={18} color="#94A3B8" className="ml-2" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Spacer bawah */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}