import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext.jsx';
import { uploaderAPI } from '../../services/api.jsx';

const EarningsScreen = () => {
  const { theme } = useTheme();
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await uploaderAPI.getEarnings();
      setEarningsData(response.data);
    } catch (error) {
      console.log('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEarnings();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 100 }} />
      </View>
    );
  }

  const totalEarnings = earningsData?.totalEarnings || 0;
  const earnings = earningsData?.earnings || [];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Ionicons name="wallet" size={48} color={theme.success} />
        <Text style={[styles.headerTitle, { color: theme.text }]}>Total Earnings</Text>
        <Text style={[styles.totalAmount, { color: theme.success }]}>
          ${totalEarnings.toFixed(2)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Earnings Breakdown</Text>

        {earnings.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: theme.surface }]}>
            <Ionicons name="cash-outline" size={64} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No earnings yet
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              Create paid courses to start earning
            </Text>
          </View>
        ) : (
          earnings.map((item, index) => (
            <View key={index} style={[styles.earningCard, { backgroundColor: theme.card }]}>
              <View style={styles.earningHeader}>
                <View style={[styles.courseIcon, { backgroundColor: theme.primary + '20' }]}>
                  <Ionicons name="book" size={24} color={theme.primary} />
                </View>
                <View style={styles.earningInfo}>
                  <Text style={[styles.courseName, { color: theme.text }]} numberOfLines={2}>
                    {item.courseName}
                  </Text>
                  <View style={styles.earningMeta}>
                    <Ionicons name="people" size={14} color={theme.textSecondary} />
                    <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                      {item.enrollments} students
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.earningDetails}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Price</Text>
                  <Text style={[styles.detailValue, { color: theme.text }]}>
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Revenue</Text>
                  <Text style={[styles.revenueValue, { color: theme.success }]}>
                    ${item.revenue.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {earnings.length > 0 && (
        <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Total Courses
            </Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              {earnings.length}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Total Students
            </Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              {earnings.reduce((sum, item) => sum + item.enrollments, 0)}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={[styles.summaryLabel, { color: theme.text }]}>
              Total Revenue
            </Text>
            <Text style={[styles.summaryTotalValue, { color: theme.success }]}>
              ${totalEarnings.toFixed(2)}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', padding: 30, paddingTop: 20 },
  headerTitle: { fontSize: 20, fontWeight: '600', marginTop: 15, marginBottom: 10 },
  totalAmount: { fontSize: 48, fontWeight: 'bold' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  emptyState: { padding: 40, borderRadius: 15, alignItems: 'center', marginTop: 20 },
  emptyText: { fontSize: 18, fontWeight: '600', marginTop: 15 },
  emptySubtext: { fontSize: 14, marginTop: 5, textAlign: 'center' },
  earningCard: { padding: 16, borderRadius: 12, marginBottom: 15, elevation: 2 },
  earningHeader: { flexDirection: 'row', marginBottom: 15 },
  courseIcon: { width: 48, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  earningInfo: { flex: 1, marginLeft: 12 },
  courseName: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  earningMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 13 },
  earningDetails: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 15, fontWeight: '500' },
  revenueValue: { fontSize: 16, fontWeight: 'bold' },
  summaryCard: { margin: 20, marginTop: 0, padding: 20, borderRadius: 12, elevation: 3 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 15 },
  summaryValue: { fontSize: 15, fontWeight: '500' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingTop: 12, marginTop: 4, marginBottom: 0 },
  summaryTotalValue: { fontSize: 20, fontWeight: 'bold' },
});

export default EarningsScreen;
