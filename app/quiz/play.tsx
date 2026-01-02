import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, MoreVertical } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// --- DATABASE SEMUA SOAL ---
const ALL_QUIZ_DATA: any = {
  // --- EJAAN ---
  'Huruf Kapital': [
    { id: 1, type: 'multiple-choice', question: 'Manakah penulisan huruf kapital yang benar?', options: ['saya tinggal di jakarta', 'Saya tinggal di Jakarta', 'saya Tinggal di jakarta', 'Saya Tinggal Di Jakarta'], correctAnswer: 'Saya tinggal di Jakarta' },
    { id: 2, type: 'true-false', question: 'Nama hari dan bulan ditulis dengan huruf kapital di awal kata.', correctAnswer: 'Benar' },
    { id: 3, type: 'drag-drop', question: 'Urutkan kata sesuai penggunaan huruf kapital yang benar (Kapital di urutan atas):', dragItems: ['universitas indonesia', 'Presiden Jokowi', 'jakarta', 'Hari Senin'], correctAnswer: ['Presiden Jokowi', 'Hari Senin', 'universitas indonesia', 'jakarta'] },
  ],
  'Penulisan Kata': [
    { id: 4, type: 'multiple-choice', question: 'Penulisan kata yang benar adalah...', options: ['mem-baca', 'membaca', 'Membaca', 'memBaca'], correctAnswer: 'membaca' },
    { id: 5, type: 'true-false', question: 'Kata "di rumah" ditulis terpisah, sedangkan "dirumahkan" ditulis serangkai.', correctAnswer: 'Benar' },
    { id: 6, type: 'drag-drop', question: 'Urutkan proses pembentukan kata dari yang paling sederhana:', dragItems: ['pembelajaran', 'belajar', 'ajar', 'pelajaran'], correctAnswer: ['ajar', 'belajar', 'pelajaran', 'pembelajaran'] },
  ],
  'Tanda Baca': [
    { id: 7, type: 'multiple-choice', question: 'Tanda baca tepat untuk "Apakah kamu sudah makan"', options: ['Titik (.)', 'Koma (,)', 'Tanda Tanya (?)', 'Tanda Seru (!)'], correctAnswer: 'Tanda Tanya (?)' },
    { id: 8, type: 'true-false', question: 'Tanda koma (,) digunakan untuk memisahkan anak kalimat dari induk kalimat.', correctAnswer: 'Benar' },
    { id: 9, type: 'drag-drop', question: 'Urutkan tanda baca sesuai kekuatan jeda (Terlemah ke Terkuat):', dragItems: ['Titik (.)', 'Koma (,)', 'Titik Koma (;)', 'Titik Dua (:)'], correctAnswer: ['Koma (,)', 'Titik Koma (;)', 'Titik Dua (:)', 'Titik (.)'] },
  ],
  // --- TATA KATA ---
  'Kata Benda': [
    { id: 10, type: 'multiple-choice', question: 'Kata yang termasuk kata benda adalah...', options: ['Berlari', 'Buku', 'Cantik', 'Dengan'], correctAnswer: 'Buku' },
    { id: 11, type: 'true-false', question: 'Kata benda selalu dapat diberi artikel "sang", "si", atau "para".', correctAnswer: 'Salah' },
    { id: 12, type: 'drag-drop', question: 'Kelompokkan kata benda dari konkret ke abstrak:', dragItems: ['kebahagiaan', 'meja', 'air', 'kebebasan'], correctAnswer: ['meja', 'air', 'kebahagiaan', 'kebebasan'] },
  ],
  'Kata Kerja': [
    { id: 13, type: 'multiple-choice', question: 'Kata kerja yang tepat adalah...', options: ['Rumah', 'Menulis', 'Merah', 'Karena'], correctAnswer: 'Menulis' },
    { id: 14, type: 'true-false', question: 'Kata kerja transitif memerlukan objek untuk melengkapi maknanya.', correctAnswer: 'Benar' },
    { id: 15, type: 'drag-drop', question: 'Urutkan kata kerja dari yang paling aktif:', dragItems: ['tidur', 'memukul', 'berlari', 'membaca'], correctAnswer: ['memukul', 'membaca', 'berlari', 'tidur'] },
  ],
  'Kata Sifat': [
    { id: 16, type: 'multiple-choice', question: 'Kata sifat yang menunjukkan warna adalah...', options: ['Besar', 'Cepat', 'Merah', 'Banyak'], correctAnswer: 'Merah' },
    { id: 17, type: 'true-false', question: 'Kata sifat dapat diberi awalan "ter-" untuk tingkat superlatif.', correctAnswer: 'Benar' },
    { id: 18, type: 'drag-drop', question: 'Urutkan kata sifat dari tingkat biasa ke superlatif:', dragItems: ['terpintar', 'pintar', 'lebih pintar', 'paling pintar'], correctAnswer: ['pintar', 'lebih pintar', 'paling pintar', 'terpintar'] },
  ],
  // --- TATA KALIMAT ---
  'Pola Kalimat': [
    { id: 19, type: 'multiple-choice', question: 'Pola kalimat "Andi membaca buku" adalah...', options: ['S-P', 'S-P-O', 'S-P-K', 'S-P-O-K'], correctAnswer: 'S-P-O' },
    { id: 20, type: 'true-false', question: 'Setiap kalimat lengkap harus memiliki subjek dan predikat.', correctAnswer: 'Benar' },
    { id: 21, type: 'drag-drop', question: 'Susun menjadi kalimat S-P-O-K yang benar:', dragItems: ['di taman', 'Ani', 'membaca', 'buku'], correctAnswer: ['Ani', 'membaca', 'buku', 'di taman'] },
  ],
  'Kalimat Aktif': [
    { id: 22, type: 'multiple-choice', question: 'Ciri kalimat aktif transitif adalah...', options: ['Tidak ada objek', 'Memiliki objek', 'Ada kata "oleh"', 'Predikat "di-"'], correctAnswer: 'Memiliki objek' },
    { id: 23, type: 'true-false', question: 'Kalimat aktif selalu menggunakan awalan "me-" pada predikat.', correctAnswer: 'Salah' },
    { id: 24, type: 'drag-drop', question: 'Susun menjadi kalimat aktif yang benar:', dragItems: ['bola', 'menendang', 'Rudi', 'ke gawang'], correctAnswer: ['Rudi', 'menendang', 'bola', 'ke gawang'] },
  ],
  'Kalimat Majemuk': [
    { id: 25, type: 'multiple-choice', question: 'Kata hubung kalimat majemuk setara adalah...', options: ['karena', 'dan', 'jika', 'agar'], correctAnswer: 'dan' },
    { id: 26, type: 'true-false', question: 'Kalimat majemuk bertingkat memiliki hubungan setara antar klausa.', correctAnswer: 'Salah' },
    { id: 27, type: 'drag-drop', question: 'Urutkan kata hubung dari sebab-akibat ke tujuan:', dragItems: ['agar', 'sehingga', 'karena', 'supaya'], correctAnswer: ['karena', 'sehingga', 'agar', 'supaya'] },
  ],
};

export default function QuizPlayScreen() {
  const router = useRouter();
  const { topic } = useLocalSearchParams();
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<any>({});
  const [dragItems, setDragItems] = useState<string[]>([]);

  useEffect(() => {
    const data = ALL_QUIZ_DATA[topic as string] || ALL_QUIZ_DATA['Huruf Kapital'];
    setQuestions(data);
    if (data[0].type === 'drag-drop') setDragItems(data[0].dragItems);
  }, [topic]);

  useEffect(() => {
    if (questions[currentIdx]?.type === 'drag-drop') {
      setDragItems(questions[currentIdx].dragItems);
    }
  }, [currentIdx]);

  if (questions.length === 0) return null;
  const currentQ = questions[currentIdx];

  const handleSelect = (ans: any) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: ans });
  };

  const handleReorder = (index: number) => {
    const newOrder = [...dragItems];
    const item = newOrder.splice(index, 1)[0];
    newOrder.unshift(item); // Pindahkan ke paling atas
    setDragItems(newOrder);
    handleSelect(newOrder);
  };

  const next = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      let score = 0;
      questions.forEach(q => {
        const userAns = selectedAnswers[q.id];
        const isCorrect = JSON.stringify(userAns) === JSON.stringify(q.correctAnswer);
        if (isCorrect) score += (100 / questions.length);
      });
      router.push({ pathname: "/quiz/result", params: { score: Math.round(score), topic } });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#6366F1', '#4338CA']} style={styles.gradient}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}><ChevronLeft color="white" /></TouchableOpacity>
            <Text style={styles.headerTitle}>{topic}</Text>
            <MoreVertical color="white" />
          </View>

          <View style={styles.quizInfo}>
            <Text style={styles.progressText}>Soal {currentIdx + 1}/{questions.length}</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>{currentQ.type.replace('-', ' ')}</Text></View>
          </View>

          <Text style={styles.questionText}>{currentQ.question}</Text>

          <View style={styles.card}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {currentQ.type !== 'drag-drop' ? (
                <View style={{ gap: 12 }}>
                  {(currentQ.options || ['Benar', 'Salah']).map((opt: string, i: number) => (
                    <TouchableOpacity 
                      key={i} 
                      onPress={() => handleSelect(opt)}
                      style={[styles.optBtn, selectedAnswers[currentQ.id] === opt && styles.optBtnActive]}
                    >
                      <View style={[styles.radio, selectedAnswers[currentQ.id] === opt && styles.radioActive]}>
                        {selectedAnswers[currentQ.id] === opt && <View style={styles.radioInner} />}
                      </View>
                      <Text style={[styles.optText, selectedAnswers[currentQ.id] === opt && styles.optTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={{ gap: 10 }}>
                  <Text style={styles.dragHint}>Ketuk item untuk menaikkan urutan</Text>
                  {dragItems.map((item, i) => (
                    <TouchableOpacity key={i} onPress={() => handleReorder(i)} style={styles.dragItem}>
                      <Text style={styles.dragText}>{item}</Text>
                      <View style={styles.indexCircle}><Text style={styles.indexText}>{i + 1}</Text></View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>

            <TouchableOpacity 
              onPress={next} 
              disabled={!selectedAnswers[currentQ.id]}
              style={[styles.nextBtn, !selectedAnswers[currentQ.id] && { opacity: 0.5 }]}
            >
              <Text style={styles.nextBtnText}>{currentIdx === questions.length - 1 ? 'Selesai' : 'Lanjut'}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4338CA' },
  gradient: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  quizInfo: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 25, marginBottom: 15 },
  progressText: { color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  badge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  questionText: { color: 'white', fontSize: 22, fontWeight: 'bold', paddingHorizontal: 25, marginBottom: 25, lineHeight: 30 },
  card: { flex: 1, backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25 },
  optBtn: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 20, borderWidth: 1.5, borderColor: '#F1F5F9' },
  optBtnActive: { borderColor: '#6366F1', backgroundColor: '#EEF2FF' },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CBD5E1', marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: '#6366F1' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#6366F1' },
  optText: { color: '#475569', fontSize: 15 },
  optTextActive: { color: '#6366F1', fontWeight: 'bold' },
  dragHint: { textAlign: 'center', color: '#94A3B8', fontSize: 12, marginBottom: 10, fontStyle: 'italic' },
  dragItem: { backgroundColor: '#F8FAFC', padding: 16, borderRadius: 15, borderLeftWidth: 4, borderLeftColor: '#6366F1', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  dragText: { color: '#1E293B', fontWeight: '500' },
  indexCircle: { backgroundColor: '#6366F1', width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  indexText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  nextBtn: { backgroundColor: '#6366F1', padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 20 },
  nextBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});