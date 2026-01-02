import { LinearGradient } from 'expo-linear-gradient'; // Gunakan versi Expo
import { useRouter } from 'expo-router'; // Hook untuk navigasi Expo
import { BookOpen } from 'lucide-react-native';
import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Komponen utama harus EXPORT DEFAULT
export default function Dashboard() {
  const router = useRouter();

  // Data dummy (biasanya ini datang dari props atau global state)
  const courseProgress = { 'Ejaan': 0, 'Tata Kata': 0, 'Tata Kalimat': 0 };

  const courses = [
    {
      title: 'Ejaan',
      level: 'Beginner',
      colors: ['#FACC15', '#FB923C'] as [string, string],
      icon: '✏️',
      progress: courseProgress['Ejaan'] || 0,
    },
    {
      title: 'Tata Kata',
      level: 'Advanced',
      colors: ['#F472B6', '#EC4899'] as [string, string],
      icon: '📝',
      progress: courseProgress['Tata Kata'] || 0,
    },
    {
      title: 'Tata Kalimat',
      level: 'Intermediate',
      colors: ['#60A5FA', '#6366F1'] as [string, string],
      icon: '📖',
      progress: courseProgress['Tata Kalimat'] || 0,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.iconBox}>
              <BookOpen size={24} color="white" />
            </View>
            <Text style={styles.logoText}>TaBa</Text>
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.paddingContainer}>
          <View style={styles.profileRow}>
            <LinearGradient 
              colors={['#60A5FA', '#C084FC']} 
              style={styles.avatar} 
            />
            <View>
              <Text style={styles.subtitle}>Logged in user</Text>
              <Text style={styles.userName}>Jennoi</Text>
            </View>
          </View>

          <Text style={styles.welcomeText}>Welcome back!</Text>

          {/* Today's Challenge Card */}
          <LinearGradient 
            colors={['#FDF2F8', '#F5F3FF']} 
            style={styles.challengeCard}
          >
            <View style={styles.badge}>
              <Text style={styles.badgeText}>reminder</Text>
            </View>
            <Text style={styles.challengeTitle}>Today's challenge</Text>
            <Text style={styles.challengeDesc}>Pelajari materi baru</Text>
            <View style={styles.decoCircle} />
          </LinearGradient>

          {/* Your Courses */}
          <Text style={styles.sectionTitle}>Your courses</Text>
          <View style={styles.courseGrid}>
            {courses.map((course) => (
              <TouchableOpacity 
                key={course.title}
                style={styles.courseCardWrapper}
                onPress={() =>
                  router.push({
                    pathname: '../course/[id]',
                    params: { id: course.title },
                  })
                }
              >
                <LinearGradient colors={course.colors} style={styles.courseCard}>
                  <View>
                    <Text style={styles.courseIcon}>{course.icon}</Text>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <Text style={styles.courseLevel}>{course.level}</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${course.progress}%` }]} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48 - 16) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 40 },
  header: { paddingVertical: 16, alignItems: 'center' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox: { width: 40, height: 40, backgroundColor: '#2563EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 20, color: '#1E3A8A', fontWeight: 'bold' },
  paddingContainer: { paddingHorizontal: 24 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  subtitle: { fontSize: 14, color: '#6B7280' },
  userName: { fontSize: 16, color: '#111827', fontWeight: '500' },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 24 },
  challengeCard: { padding: 24, borderRadius: 20, marginBottom: 24, overflow: 'hidden' },
  badge: { backgroundColor: '#E9D5FF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, alignSelf: 'flex-start', marginBottom: 12 },
  badgeText: { color: '#7E22CE', fontSize: 12, fontWeight: '500' },
  challengeTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  challengeDesc: { fontSize: 14, color: '#9333EA' },
  decoCircle: { position: 'absolute', right: -20, bottom: -20, width: 100, height: 100, borderRadius: 50, backgroundColor: '#8B5CF6', opacity: 0.1 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 16 },
  courseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  courseCardWrapper: { width: cardWidth },
  courseCard: { borderRadius: 20, padding: 16, height: cardWidth, justifyContent: 'space-between' },
  courseIcon: { fontSize: 24, marginBottom: 8 },
  courseTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  courseLevel: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: 'white', borderRadius: 3 },
});