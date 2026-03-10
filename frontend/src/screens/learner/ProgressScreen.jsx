import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext.jsx';
import { userAPI, progressAPI } from '../../services/api.jsx';

const ProgressScreen = () => {

  const { theme } = useTheme();

  const [stats, setStats] = useState(null);
  const [allProgress, setAllProgress] = useState([]);
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

      setStats(statsRes.data.stats || {});
      setAllProgress(progressRes.data.progress || []);

    } catch (err) {

      console.log("Progress fetch error:", err);

    } finally {

      setLoading(false);

    }

  };

  const onRefresh = async () => {

    setRefreshing(true);
    await fetchData();
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

      {/* HEADER */}

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Learning Progress
        </Text>
        <Text style={{ color: theme.textSecondary }}>
          Track your achievements
        </Text>
      </View>

      {/* STATS */}

      <View style={styles.statsRow}>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Ionicons name="book" size={28} color={theme.primary} />
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {stats?.enrolledCoursesCount || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Enrolled
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Ionicons name="checkmark-circle" size={28} color={theme.success} />
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {stats?.completedCoursesCount || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Completed
          </Text>
        </View>

      </View>

      <View style={styles.statsRow}>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Ionicons name="flame" size={28} color={theme.warning} />
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {stats?.currentStreak || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Day Streak
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card }]}>
          <Ionicons name="trophy" size={28} color="#FFD700" />
          <Text style={[styles.statNumber, { color: theme.text }]}>
            {stats?.longestStreak || 0}
          </Text>
          <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
            Best Streak
          </Text>
        </View>

      </View>

      {/* COURSE PROGRESS */}

      <View style={styles.section}>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Course Progress
        </Text>

        {allProgress.length === 0 ? (

          <View style={[styles.emptyCard, { backgroundColor: theme.surface }]}>
            <Ionicons name="school-outline" size={48} color={theme.textSecondary} />
            <Text style={{ color: theme.textSecondary, marginTop: 10 }}>
              No progress yet
            </Text>
          </View>

        ) : (

          allProgress.map((prog) => {

            const percent = Math.round(prog.completionPercentage || 0);

            return (

              <View key={prog._id} style={[styles.progressCard, { backgroundColor: theme.card }]}>

                <Text style={[styles.progressTitle, { color: theme.text }]}>
                  {prog.courseId?.title || "Course"}
                </Text>

                <View style={[styles.progressBarBg, { backgroundColor: theme.surface }]}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        backgroundColor: theme.primary,
                        width: `${percent}%`
                      }
                    ]}
                  />
                </View>

                <Text style={{ color: theme.textSecondary }}>
                  {percent}% completed
                </Text>

              </View>

            );

          })

        )}

      </View>

    </ScrollView>

  );

};

const styles = StyleSheet.create({

  container: {
    flex: 1
  },

  header: {
    padding: 20
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "bold"
  },

  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 10
  },

  statCard: {
    flex: 1,
    padding: 18,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
    elevation: 2
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8
  },

  statLabel: {
    fontSize: 12,
    marginTop: 4
  },

  section: {
    padding: 20
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15
  },

  progressCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 12
  },

  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8
  },

  progressBarBg: {
    height: 8,
    borderRadius: 5,
    marginBottom: 6
  },

  progressBarFill: {
    height: 8,
    borderRadius: 5
  },

  emptyCard: {
    padding: 40,
    borderRadius: 10,
    alignItems: "center"
  }

});

export default ProgressScreen;