import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, CheckCircle, ChevronLeft, MoreVertical } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

export default function CourseContent() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const { updateProgress, courseProgress } = useCourseProgress();
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [updating, setUpdating] = useState(false);

  const courseName = Array.isArray(id) ? id[0] : id || 'Ejaan';

  // Check if already completed when component mounts or courseProgress changes
  useEffect(() => {
    const progress = courseProgress[courseName] || 0;
    console.log(`Course ${courseName} progress:`, progress);
    
    if (progress >= 100) {
      setIsCompleted(true);
    }
  }, [courseProgress, courseName]);

  const handleCompleteReading = async () => {
    if (isCompleted || updating) {
      console.log('Already completed or updating');
      return;
    }
    
    setUpdating(true);
    try {
      console.log('Completing course:', courseName);
      
      // Update progress to 100%
      await updateProgress(courseName, 100);
      
      setIsCompleted(true);
      
      Alert.alert(
        "Materi Selesai! 🎉", 
        `Bagus! Kamu telah menyelesaikan materi ${courseData.title}.`,
        [
          {
            text: "Kerjakan Quiz",
            onPress: () => {
              router.push('/(tabs)/quiz');
            }
          },
          {
            text: "Lanjut Belajar",
            style: "cancel"
          }
        ]
      );
    } catch (error) {
      console.error('Error updating progress:', error);
      Alert.alert('Error', 'Gagal menyimpan progress. Silakan coba lagi.');
    } finally {
      setUpdating(false);
    }
  };

  const getCourseData = () => {
    switch (courseName) {
      case 'Ejaan':
        return {
          title: 'Ejaan',
          colors: ['#FACC15', '#FB923C'] as [string, string],
          sections: [
            {
              title: 'Penggunaan Huruf Kapital',
              content: 'Huruf kapital digunakan pada awal kalimat, nama orang, nama tempat, dan nama organisasi.\n\nContoh:\n• Saya tinggal di Jakarta.\n• Budi adalah teman saya.\n• Dia bekerja di Universitas Indonesia.\n\nHuruf kapital juga digunakan untuk:\n1. Nama hari, bulan, dan hari besar\n2. Nama geografi\n3. Nama lembaga/organisasi',
            },
            {
              title: 'Penulisan Kata',
              content: 'Kata dasar ditulis terpisah dari imbuhan. Penulisan kata depan "di", "ke", "dari" ditulis terpisah dari kata yang mengikutinya.\n\nContoh:\n• di rumah, ke sekolah, dari pasar\n\nSedangkan "di-" sebagai awalan kata kerja pasif ditulis serangkai.\n\nContoh:\n• dibaca, ditulis, dikerjakan',
            },
            {
              title: 'Penggunaan Tanda Baca',
              content: 'Titik (.): mengakhiri kalimat berita\nKoma (,): memisahkan unsur dalam kalimat\nTanda tanya (?): mengakhiri kalimat tanya\nTanda seru (!): mengakhiri kalimat perintah\nTanda petik ("..."): mengapit kutipan langsung',
            },
          ],
        };

      case 'Tata Kata':
        return {
          title: 'Tata Kata',
          colors: ['#F472B6', '#EC4899'] as [string, string],
          sections: [
            {
              title: 'Pengantar Tata Kata',
              content: 'Tata kata atau morfologi membahas pembentukan kata. Kata dapat dibedakan berdasarkan bentuknya (dasar, berimbuhan, ulang, majemuk) dan jenisnya (kata benda, kerja, sifat, dll).',
            },
            {
              title: 'Jenis-jenis Kata',
              content: 'a. Kata Benda (Nomina): buku, rumah, Jakarta.\nb. Kata Kerja (Verba): membaca, menulis, berjalan.\nc. Kata Sifat (Adjektiva): cepat, tinggi, cantik.\nd. Kata Bilangan (Numeralia): satu, kedua, banyak.\ne. Kata Ganti (Pronomina): saya, kamu, mereka.',
            },
            {
              title: 'Proses Pembentukan Kata',
              content: '1. Afiksasi (pengimbuhan): baca → membaca\n2. Reduplikasi (pengulangan): rumah → rumah-rumah\n3. Komposisi (pemajemukan): mata hari, rumah sakit',
            },
          ],
        };

      case 'Tata Kalimat':
        return {
          title: 'Tata Kalimat',
          colors: ['#60A5FA', '#6366F1'] as [string, string],
          sections: [
            {
              title: 'Pengantar Kalimat',
              content: 'Kalimat adalah satuan bahasa terkecil yang mengungkapkan pikiran yang utuh. Terdiri dari Subjek (S), Predikat (P), Objek (O), dan Keterangan (K).',
            },
            {
              title: 'Pola Kalimat',
              content: '1. S - P: Andi tidur.\n2. S - P - O: Andi membaca buku.\n3. S - P - K: Andi tidur di kamar.\n4. S - P - O - K: Andi membaca buku di perpustakaan.',
            },
            {
              title: 'Jenis-jenis Kalimat',
              content: '1. Kalimat Berita: Menyampaikan informasi (akhir titik).\n2. Kalimat Tanya: Menanyakan sesuatu (akhir tanda tanya).\n3. Kalimat Perintah: Memberikan perintah (akhir tanda seru).\n4. Kalimat Seru: Ungkapan perasaan kuat.',
            },
          ],
        };

      default:
        return {
          title: 'Materi',
          colors: ['#94A3B8', '#64748B'] as [string, string],
          sections: [{ title: 'Not Found', content: 'Materi tidak ditemukan.' }],
        };
    }
  };

  const courseData = getCourseData();
  const currentProgress = courseProgress[courseName] || 0;

  return (
    <View style={styles.container}>
      {/* Header dengan Gradient */}
      <LinearGradient colors={courseData.colors} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerLabel}>Materi</Text>
            <TouchableOpacity style={styles.navButton}>
              <MoreVertical size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitleText}>{courseData.title}</Text>
            {isCompleted && <CheckCircle size={32} color="white" />}
          </View>
          {currentProgress > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${currentProgress}%` }]} />
              </View>
              <Text style={styles.progressText}>{Math.round(currentProgress)}% selesai</Text>
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>

      {/* Konten Scroll */}
      <ScrollView 
        style={styles.contentScroll} 
        contentContainerStyle={styles.contentPadding}
        showsVerticalScrollIndicator={false}
      >
        {courseData.sections.map((section, index) => (
          <View key={index} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        {/* Kartu Status Penyelesaian */}
        <View style={[
          styles.statusCard, 
          { borderColor: isCompleted ? '#22C55E' : '#3B82F6' }
        ]}>
          <View style={styles.statusRow}>
            <View style={styles.statusIconBox}>
              {isCompleted ? (
                <CheckCircle size={28} color="#16A34A" />
              ) : (
                <BookOpen size={28} color="#2563EB" />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>
                {isCompleted ? 'Selamat! 🎉' : 'Selesai Membaca?'}
              </Text>
              <Text style={styles.statusDesc}>
                {isCompleted 
                  ? 'Anda telah menyelesaikan materi ini. Uji pemahaman Anda dengan mengerjakan kuis!'
                  : 'Klik tombol di bawah setelah selesai membaca semua materi.'}
              </Text>
              
              {!isCompleted && (
                <TouchableOpacity 
                  onPress={handleCompleteReading} 
                  activeOpacity={0.8}
                  disabled={updating}
                >
                  <LinearGradient colors={courseData.colors} style={styles.completeButton}>
                    {updating ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text style={styles.completeButtonText}>Selesai Membaca Materi</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {isCompleted && (
                <TouchableOpacity 
                  onPress={() => router.push({
                    pathname: '/quiz/selection',
                    params: { course: courseName }
                  })}
                  activeOpacity={0.8}
                >
                  <LinearGradient colors={['#10B981', '#059669']} style={styles.completeButton}>
                    <Text style={styles.completeButtonText}>Kerjakan Kuis 📝</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.9,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginBottom: 16,
  },
  headerTitleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  progressContainer: {
    marginTop: 8,
    paddingHorizontal: 5,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.95,
  },
  contentScroll: {
    flex: 1,
  },
  contentPadding: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
  },
  sectionContent: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },
  statusCard: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 5,
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 15,
  },
  statusIconBox: {
    marginTop: 2,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
  },
  statusDesc: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 18,
    lineHeight: 20,
  },
  completeButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
});