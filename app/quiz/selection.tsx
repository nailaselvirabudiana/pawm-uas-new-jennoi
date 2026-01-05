import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, ChevronLeft, ClipboardList } from 'lucide-react-native';
import React from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48 - 15) / 2; // (Layar - Padding Horizontal - Gap) / 2

export default function QuizSelectionScreen() {
  const router = useRouter();
  const { course } = useLocalSearchParams<{ course?: string | string[] }>();
  const courseName = Array.isArray(course) ? course[0] : course;

  const getCourseData = () => {
    if (courseName === 'Ejaan') {
      return {
        title: 'Ejaan',
        level: 'Beginner',
        colors: ['#FACC15', '#FB923C'] as [string, string],
        topics: [
          { name: 'Huruf Kapital', subtitle: 'Penggunaan Huruf Kapital', icon: '📄', bgColor: '#FFEDD5', textColor: '#EA580C' },
          { name: 'Penulisan Kata', subtitle: 'Kata Dasar & Berimbuhan', icon: '✏️', bgColor: '#FCE7F3', textColor: '#DB2777' },
          { name: 'Tanda Baca', subtitle: 'Titik, Koma, dll', icon: '📐', bgColor: '#DBEAFE', textColor: '#2563EB' },
          { name: 'Gabungan Kata', subtitle: 'Kata Majemuk', icon: '🔗', bgColor: '#DCFCE7', textColor: '#16A34A' },
          { name: 'Penulisan Angka', subtitle: 'Bilangan & Lambang', icon: '🔢', bgColor: '#F3E8FF', textColor: '#9333EA' },
          { name: 'Singkatan', subtitle: 'Akronim & Abbreviasi', icon: '📝', bgColor: '#E0E7FF', textColor: '#4F46E5' },
        ],
      };
    } else if (courseName === 'Tata Kata') {
      return {
        title: 'Tata Kata',
        level: 'Advanced',
        colors: ['#F472B6', '#EC4899'] as [string, string],
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
        colors: ['#60A5FA', '#6366F1'] as [string, string],
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={courseData.colors}
          style={styles.headerGradient}
        >
          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.headerIconButton}>
              <ChevronLeft size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Quiz</Text>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={() =>
                router.push({
                  pathname: '/course/[id]',
                  params: { id: courseData.title },
                })
              }
            >
              <BookOpen size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{courseData.title}</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{courseData.level}</Text>
            </View>
          </View>

          <View style={styles.topicInfoRow}>
            <ClipboardList size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.topicCountText}>
              {courseData.topics.length} Topik Kuis Tersedia
            </Text>
          </View>
        </LinearGradient>

        {/* Topics Section */}
        <View style={styles.topicsContainer}>
          <Text style={styles.sectionTitle}>Pilih Topik Kuis</Text>
          
          <View style={styles.grid}>
            {courseData.topics.map((topic, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => router.push({
                  pathname: "/quiz/play",
                  params: { topic: topic.name, course: courseData.title }
                })}
                style={styles.card}
              >
                <View style={[styles.iconWrapper, { backgroundColor: topic.bgColor }]}>
                  <Text style={styles.topicEmoji}>{topic.icon}</Text>
                </View>
                <Text numberOfLines={1} style={styles.topicName}>
                  {topic.name}
                </Text>
                <Text numberOfLines={2} style={styles.topicSubtitle}>
                  {topic.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  heroContent: {
    marginTop: 10,
  },
  heroTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  levelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  topicInfoRow: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicCountText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginLeft: 8,
  },
  topicsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  topicEmoji: {
    fontSize: 24,
  },
  topicName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  topicSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 14,
  },
  bottomSpacer: {
    height: 80,
  },
});