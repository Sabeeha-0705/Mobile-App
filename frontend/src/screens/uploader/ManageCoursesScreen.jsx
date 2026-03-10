import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { uploaderAPI } from '../../services/api';

const ManageCoursesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchCourses);
    return unsubscribe;
  }, [navigation]);

  const fetchCourses = async () => {
    try {
      const res = await uploaderAPI.getCourses();
      setCourses(res.data.courses || []);
    } catch {
      Alert.alert('Error', 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await uploaderAPI.togglePublish(id);
      fetchCourses();
    } catch {
      Alert.alert('Error', 'Action failed');
    }
  };

  const handleEdit = (course) => {
    navigation.navigate('CreateCourse', {
      courseData: course,
      isEdit: true,
    });
  };

  // ✅ NEW: Add Videos navigation
  const handleAddVideos = (course) => {
    navigation.navigate('ManageVideos', {
      courseId: course._id,
      courseTitle: course.title,
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchCourses} />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          My Courses
        </Text>

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('CreateCourse')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {courses.map((course) => (
        <View
          key={course._id}
          style={[styles.card, { backgroundColor: theme.card }]}
        >
          <Text style={[styles.title, { color: theme.text }]}>
            {course.title}
          </Text>

          <View style={styles.meta}>
            <Text style={styles.badge}>{course.category}</Text>
            <Text style={styles.badge}>{course.level}</Text>
          </View>

          <Text
            style={{
              marginTop: 4,
              color: course.isPublished
                ? theme.success
                : theme.warning,
            }}
          >
            {course.isPublished ? 'Published' : 'Draft'}
          </Text>

          {/* 🔽 ACTION BUTTONS */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleEdit(course)}
            >
              <Ionicons name="create" size={16} />
              <Text>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleAddVideos(course)}
            >
              <Ionicons name="videocam" size={16} />
              <Text>Add Videos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleTogglePublish(course._id)}
            >
              <Text>{course.isPublished ? 'Unpublish' : 'Publish'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: { margin: 12, padding: 16, borderRadius: 12 },
  title: { fontSize: 18, fontWeight: '600' },
  meta: { flexDirection: 'row', gap: 8, marginVertical: 6 },
  badge: {
    fontSize: 12,
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    flexWrap: 'wrap',
  },
  btn: { flexDirection: 'row', gap: 6, alignItems: 'center' },
});

export default ManageCoursesScreen;