//frontend/src/uploader/CreateCourseScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext.jsx';
import { courseAPI } from '../../services/api.jsx';

const CreateCourseScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { courseData, isEdit } = route.params || {};

  const [title, setTitle] = useState(courseData?.title || '');
  const [description, setDescription] = useState(courseData?.description || '');
  const [category, setCategory] = useState(courseData?.category || '');
  const [level, setLevel] = useState(courseData?.level || '');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showLevelPicker, setShowLevelPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = ['Programming', 'Web Development', 'Mobile Development', 'Data Science', 'Design', 'Business', 'Other'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter course title');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Validation Error', 'Please enter course description');
      return false;
    }
    if (!category) {
      Alert.alert('Validation Error', 'Please select a category');
      return false;
    }
    if (!level) {
      Alert.alert('Validation Error', 'Please select a level');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const coursePayload = {
        title: title.trim(),
        description: description.trim(),
        category,
        level,
      };

      if (isEdit && courseData?._id) {
        await courseAPI.updateCourse(courseData._id, coursePayload);
        Alert.alert('Success', 'Course updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await courseAPI.createCourse(coursePayload);
        Alert.alert('Success', 'Course created successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Course Title *</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            placeholder="e.g., Complete JavaScript Bootcamp"
            placeholderTextColor={theme.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Description *</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
            placeholder="Describe what students will learn..."
            placeholderTextColor={theme.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Category *</Text>
          <TouchableOpacity
            style={[styles.picker, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <Text style={[styles.pickerText, { color: category ? theme.text : theme.textSecondary }]}>
              {category || 'Select category'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
          {showCategoryPicker && (
            <View style={[styles.pickerOptions, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.pickerOption, category === cat && { backgroundColor: theme.primary + '20' }]}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text style={[styles.pickerOptionText, { color: category === cat ? theme.primary : theme.text }]}>
                    {cat}
                  </Text>
                  {category === cat && <Ionicons name="checkmark" size={20} color={theme.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.text }]}>Level *</Text>
          <TouchableOpacity
            style={[styles.picker, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={() => setShowLevelPicker(!showLevelPicker)}
          >
            <Text style={[styles.pickerText, { color: level ? theme.text : theme.textSecondary }]}>
              {level || 'Select level'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
          {showLevelPicker && (
            <View style={[styles.pickerOptions, { backgroundColor: theme.card, borderColor: theme.border }]}>
              {levels.map((lv) => (
                <TouchableOpacity
                  key={lv}
                  style={[styles.pickerOption, level === lv && { backgroundColor: theme.primary + '20' }]}
                  onPress={() => {
                    setLevel(lv);
                    setShowLevelPicker(false);
                  }}
                >
                  <Text style={[styles.pickerOptionText, { color: level === lv ? theme.primary : theme.text }]}>
                    {lv}
                  </Text>
                  {level === lv && <Ionicons name="checkmark" size={20} color={theme.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: theme.surface }]}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Text style={[styles.cancelButtonText, { color: theme.text }]}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.primary }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name={isEdit ? "save" : "add-circle"} size={20} color="#FFFFFF" />
                <Text style={styles.submitButtonText}>
                  {isEdit ? 'Update Course' : 'Create Course'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { flex: 1, padding: 20 },
  section: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  input: { padding: 14, borderRadius: 10, fontSize: 16, borderWidth: 1 },
  textArea: { padding: 14, borderRadius: 10, fontSize: 16, borderWidth: 1, minHeight: 120 },
  picker: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 10, borderWidth: 1 },
  pickerText: { fontSize: 16 },
  pickerOptions: { marginTop: 8, borderRadius: 10, borderWidth: 1, elevation: 3 },
  pickerOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: 0.5, borderBottomColor: '#E5E7EB' },
  pickerOptionText: { fontSize: 16 },
  buttonContainer: { flexDirection: 'row', gap: 12, marginTop: 10, marginBottom: 30 },
  cancelButton: { flex: 1, padding: 16, borderRadius: 10, alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '600' },
  submitButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 10, gap: 8 },
  submitButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

export default CreateCourseScreen;
