import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Data Mock
const courseProgress: { [key: string]: number } = {
  'Ejaan': 0,
  'Tata Kata': 0,
  'Tata Kalimat': 0,
};

export default function CourseListScreen() {
  const router = useRouter();

  const courses = [
    {
      title: 'Ejaan',
      level: 'Beginner',
      colors: ['#FACC15', '#FB923C'] as [string, string],
      icon: '✏️',
      progress: courseProgress['Ejaan'] || 0,
      description: 'Pelajari aturan ejaan bahasa Indonesia yang baik dan benar sesuai PUEBI.',
    },
    {
      title: 'Tata Kata',
      level: 'Advanced',
      colors: ['#F472B6', '#EC4899'] as [string, string],
      icon: '📝',
      progress: courseProgress['Tata Kata'] || 0,
      description: 'Memahami jenis-jenis kata, proses imbuhan, dan pembentukan kata dasar.',
    },
    {
      title: 'Tata Kalimat',
      level: 'Intermediate',
      colors: ['#60A5FA', '#6366F1'] as [string, string],
      icon: '📖',
      progress: courseProgress['Tata Kalimat'] || 0,
      description: 'Pelajari struktur SPOK dan pola kalimat efektif dalam bahasa Indonesia.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <ChevronLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Semua Materi</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Hero Text */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Pilih Materi</Text>
          <Text style={styles.heroSubtitle}>Tingkatkan kemampuan tata bahasa Anda</Text>
        </View>

        {/* List Kursus */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollPadding}
        >
          {courses.map((course, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.9}
              onPress={() => router.push({
                pathname: "/course/[id]",
                params: { id: course.title }
              })}
              style={styles.cardWrapper}
            >
              <LinearGradient
                colors={course.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.iconText}>{course.icon}</Text>
                  </View>
                  <View style={styles.titleContainer}>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{course.level}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.description}>{course.description}</Text>

                {/* Progress Bar Section */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressLabelRow}>
                    <Text style={styles.progressLabel}>Progress Belajar</Text>
                    <Text style={styles.progressPercentage}>{course.progress}%</Text>
                  </View>
                  <View style={styles.progressBarBackground}>
                    <View 
                      style={[styles.progressBarFill, { width: `${course.progress}%` }]} 
                    />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  heroSection: {
    marginTop: 10,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  scrollPadding: {
    paddingBottom: 100,
  },
  cardWrapper: {
    marginBottom: 20,
    borderRadius: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cardGradient: {
    borderRadius: 32,
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    padding: 10,
    borderRadius: 18,
    marginRight: 14,
  },
  iconText: {
    fontSize: 28,
  },
  titleContainer: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  description: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  progressContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 14,
    borderRadius: 20,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '500',
  },
  progressPercentage: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
});