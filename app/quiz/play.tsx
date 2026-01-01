// migrasi dari Quiz.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MoreVertical } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function QuizPlayScreen() {
  const router = useRouter();
  const { topic, course } = useLocalSearchParams();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: any }>({});

  // Mock Data (Logika getQuizData tetap sama dengan versi TS Anda)
  const questions = [
    {
      id: 1,
      type: 'multiple-choice',
      question: 'Manakah penulisan huruf kapital yang benar?',
      options: ['saya tinggal di jakarta', 'Saya tinggal di Jakarta', 'saya Tinggal di jakarta'],
      correctAnswer: 'Saya tinggal di Jakarta',
    },
    {
      id: 2,
      type: 'true-false',
      question: 'Nama hari dan bulan ditulis dengan huruf kapital di awal kata.',
      correctAnswer: 'Benar',
    },
  ];

  const handleSelectAnswer = (questionId: number, answer: any) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answer });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Navigasi ke hasil kuis
      router.push({
        pathname: "/quiz/result",
        params: { score: 85, topic } // Kalkulasi skor dilakukan di sini
      });
    }
  };

  const question = questions[currentQuestion];

  return (
    <SafeAreaView className="flex-1 bg-[#4F46E5]">
      <LinearGradient
        colors={['#60A5FA', '#4F46E5']}
        className="flex-1 px-6 pt-4"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white font-bold">Kuis {topic}</Text>
          <MoreVertical size={24} color="white" />
        </View>

        {/* Info Kuis */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white/80 font-medium">
            Soal {currentQuestion + 1} dari {questions.length}
          </Text>
          <View className="bg-white/20 px-3 py-1 rounded-full">
            <Text className="text-white text-xs">
              {question.type === 'multiple-choice' ? 'Pilihan Ganda' : 'Benar/Salah'}
            </Text>
          </View>
        </View>

        <Text className="text-white text-2xl font-bold mb-8">
          {question.question}
        </Text>

        {/* Kartu Pertanyaan */}
        <View className="bg-white rounded-[40px] flex-1 mb-10 p-6 shadow-xl">
          <ScrollView showsVerticalScrollIndicator={false}>
            {question.type === 'multiple-choice' && (
              <View className="gap-y-4">
                {question.options?.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSelectAnswer(question.id, option)}
                    className={`p-5 rounded-3xl border-2 flex-row items-center gap-x-4 ${
                      selectedAnswers[question.id] === option 
                        ? 'border-indigo-600 bg-indigo-50' 
                        : 'border-gray-100'
                    }`}
                  >
                    <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                      selectedAnswers[question.id] === option ? 'border-indigo-600' : 'border-gray-300'
                    }`}>
                      {selectedAnswers[question.id] === option && <View className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                    </View>
                    <Text className="text-gray-800 text-base flex-1">{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {question.type === 'true-false' && (
              <View className="flex-row gap-x-4">
                {['Benar', 'Salah'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleSelectAnswer(question.id, option)}
                    className={`flex-1 p-8 rounded-3xl border-2 items-center ${
                      selectedAnswers[question.id] === option 
                        ? option === 'Benar' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                        : 'border-gray-100'
                    }`}
                  >
                    <Text className={`text-xl font-bold ${
                       selectedAnswers[question.id] === option 
                       ? option === 'Benar' ? 'text-green-600' : 'text-red-600'
                       : 'text-gray-400'
                    }`}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Catatan untuk Drag & Drop */}
            {question.type === 'drag-drop' && (
              <View className="items-center py-10">
                <Text className="text-gray-400 text-center italic">
                  Fitur Drag & Drop memerlukan library tambahan (react-native-draggable-flatlist). 
                  Untuk sekarang gunakan Pilihan Ganda.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Tombol Lanjut */}
          <TouchableOpacity 
            onPress={nextQuestion}
            className="bg-indigo-600 py-5 rounded-3xl items-center mt-4"
          >
            <Text className="text-white font-bold text-lg">
              {currentQuestion === questions.length - 1 ? 'Selesai' : 'Lanjut'}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}