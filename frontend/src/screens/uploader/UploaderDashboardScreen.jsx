import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext.jsx';
import { uploaderAPI } from '../../services/api.jsx';

const UploaderDashboardScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await uploaderAPI.getStats();
      setStats(response.data.stats);
    } catch (error) {
      console.log('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Instructor Dashboard</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Overview of your teaching activity
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <View style={[styles.statIcon, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="book" size={28} color={theme.primary} />
          </View>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {stats?.totalCourses || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Courses</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <View style={[styles.statIcon, { backgroundColor: theme.success + '20' }]}>
            <Ionicons name="people" size={28} color={theme.success} />
          </View>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {stats?.totalStudents || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Students</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <View style={[styles.statIcon, { backgroundColor: theme.warning + '20' }]}>
            <Ionicons name="checkmark-circle" size={28} color={theme.warning} />
          </View>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {stats?.publishedCourses || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Published</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <View style={[styles.statIcon, { backgroundColor: theme.textSecondary + '20' }]}>
            <Ionicons name="document-text" size={28} color={theme.textSecondary} />
          </View>
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {stats?.draftCourses || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Drafts</Text>
        </View>
      </View>

      <View style={[styles.earningsCard, { backgroundColor: theme.card }]}>
        <View style={styles.earningsHeader}>
          <Ionicons name="cash" size={32} color={theme.success} />
          <Text style={[styles.earningsLabel, { color: theme.textSecondary }]}>Total Earnings</Text>
        </View>
        <Text style={[styles.earningsAmount, { color: theme.success }]}>
          ${(stats?.totalRevenue || 0).toFixed(2)}
        </Text>
      </View>

      <View style={styles.quickActions}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('CreateCourse')}
        >
          <Ionicons name="add-circle" size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Create New Course</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border }]}
          onPress={() => navigation.navigate('ManageCourses')}
        >
          <Ionicons name="folder-open" size={24} color={theme.primary} />
          <Text style={[styles.actionButtonText, { color: theme.text }]}>Manage Courses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Earnings')}
        >
          <Ionicons name="trending-up" size={24} color={theme.success} />
          <Text style={[styles.actionButtonText, { color: theme.text }]}>View Earnings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 10 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 16, marginTop: 5 },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 15, marginTop: 15, gap: 10 },
  statCard: { flex: 1, padding: 20, borderRadius: 15, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  statIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statNumber: { fontSize: 32, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 13, textAlign: 'center' },
  earningsCard: { margin: 20, marginTop: 25, padding: 25, borderRadius: 15, elevation: 3 },
  earningsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  earningsLabel: { fontSize: 16, marginLeft: 10 },
  earningsAmount: { fontSize: 42, fontWeight: 'bold' },
  quickActions: { paddingHorizontal: 20, paddingBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  actionButton: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 12, marginBottom: 12, elevation: 2 },
  actionButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginLeft: 12 },
});

export default UploaderDashboardScreen;
