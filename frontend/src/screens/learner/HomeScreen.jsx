import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { courseAPI, userAPI, progressAPI } from '../../services/api.jsx';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [lastProgress, setLastProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, progressRes] = await Promise.all([
        userAPI.getStats(),
        progressAPI.getAllProgress()
      ]);

      setStats(statsRes.data.stats);
      
      const allProgress = progressRes.data.progress || [];
      if (allProgress.length > 0) {
        const sorted = allProgress.sort((a, b) => 
          new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt)
        );
        setLastProgress(sorted[0]);
      }

      const profile = await userAPI.getProfile();
      const enrolled = profile.data.user.enrolledCourses || [];
      
      const coursesData = await Promise.all(
        enrolled.slice(0, 5).map(courseId => 
          courseAPI.getCourse(courseId).catch(() => null)
        )
      );

      setEnrolledCourses(coursesData.filter(c => c !== null).map(c => c.data.course));
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleContinueLearning = () => {
    if (lastProgress && lastProgress.courseId) {
      navigation.navigate('CourseDetail', { 
        courseId: lastProgress.courseId._id || lastProgress.courseId 
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 100 }} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.text }]}>
          Hello, {user?.fullName}! 👋
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Ready to learn today?
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Ionicons name="book" size={24} color={theme.primary} />
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {stats?.enrolledCoursesCount || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Enrolled</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Ionicons name="checkmark-circle" size={24} color={theme.success} />
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {stats?.completedCoursesCount || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Completed</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Ionicons name="flame" size={24} color={theme.warning} />
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {stats?.currentStreak || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Streak</Text>
        </View>
      </View>

      {lastProgress && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Continue Learning</Text>
          <TouchableOpacity
            style={[styles.continueCard, { backgroundColor: theme.card }]}
            onPress={handleContinueLearning}
          >
            <View style={styles.continueContent}>
              <Ionicons name="play-circle" size={40} color={theme.primary} />
              <View style={styles.continueText}>
                <Text style={[styles.continueTitle, { color: theme.text }]}>
                  {lastProgress.courseId?.title || 'Continue Course'}
                </Text>
                <Text style={[styles.continueSubtitle, { color: theme.textSecondary }]}>
                  {lastProgress.completionPercentage || 0}% completed
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>My Courses</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Courses')}>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {enrolledCourses.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: theme.surface }]}>
            <Ionicons name="school-outline" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No enrolled courses yet
            </Text>
            <TouchableOpacity
              style={[styles.browseButton, { backgroundColor: theme.primary }]}
              onPress={() => navigation.navigate('Courses')}
            >
              <Text style={styles.browseButtonText}>Browse Courses</Text>
            </TouchableOpacity>
          </View>
        ) : (
          enrolledCourses.map((course) => (
            <TouchableOpacity
              key={course._id}
              style={[styles.courseCard, { backgroundColor: theme.card }]}
              onPress={() => navigation.navigate('CourseDetail', { courseId: course._id })}
            >
              <View style={[styles.courseThumbnail, { backgroundColor: theme.primary }]}>
                <Ionicons name="book" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.courseInfo}>
                <Text style={[styles.courseTitle, { color: theme.text }]} numberOfLines={2}>
                  {course.title}
                </Text>
                <Text style={[styles.courseLevel, { color: theme.textSecondary }]}>
                  {course.level}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          ))
        )}
      </View>

      <TouchableOpacity
        style={[styles.exploreButton, { backgroundColor: theme.primary }]}
        onPress={() => navigation.navigate('Courses')}
      >
        <Text style={styles.exploreText}>Explore All Courses</Text>
        <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 10 },
  greeting: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, marginTop: 5 },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 10 },
  statCard: { flex: 1, padding: 15, borderRadius: 12, marginHorizontal: 5, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  statNumber: { fontSize: 24, fontWeight: 'bold', marginTop: 8 },
  statLabel: { fontSize: 12, marginTop: 4 },
  section: { marginTop: 25, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold' },
  seeAll: { fontSize: 14, fontWeight: '600' },
  continueCard: { padding: 15, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', elevation: 2 },
  continueContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  continueText: { marginLeft: 15, flex: 1 },
  continueTitle: { fontSize: 16, fontWeight: '600' },
  continueSubtitle: { fontSize: 14, marginTop: 4 },
  courseCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10, marginBottom: 12, elevation: 1 },
  courseThumbnail: { width: 50, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  courseInfo: { flex: 1, marginLeft: 12 },
  courseTitle: { fontSize: 15, fontWeight: '600' },
  courseLevel: { fontSize: 13, marginTop: 4 },
  emptyCard: { padding: 40, borderRadius: 12, alignItems: 'center' },
  emptyText: { fontSize: 16, marginTop: 10, marginBottom: 15 },
  browseButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  browseButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  exploreButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: 20, marginTop: 10, padding: 15, borderRadius: 10, elevation: 2 },
  exploreText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginRight: 8 },
});

export default HomeScreen;
