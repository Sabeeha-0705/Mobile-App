import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  Switch,
  Platform
} from 'react-native';

import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { videoAPI } from '../../services/api';

const ManageVideosScreen = ({ route }) => {

  const { theme } = useTheme();
  const { courseId, courseTitle } = route.params;

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {

    try {

      const res = await videoAPI.getCourseVideos(courseId);
      setVideos(res.data.videos || []);

    } catch {

      Alert.alert('Error', 'Failed to load videos');

    } finally {

      setLoading(false);

    }

  };


  const pickVideo = async () => {

    try {

      const result = await DocumentPicker.getDocumentAsync({
        type: 'video/*',
        copyToCacheDirectory: true
      });

      if (!result.canceled && result.assets.length > 0) {
        setVideoFile(result.assets[0]);
        setYoutubeUrl('');
      }

    } catch (error) {

      Alert.alert("Error", "Failed to pick video");

    }

  };


  const handleAddVideo = async () => {

    if (!title.trim()) {
      Alert.alert('Validation Error', 'Video title required');
      return;
    }

    if (!videoFile && !youtubeUrl.trim()) {
      Alert.alert('Validation Error', 'Upload video OR paste YouTube URL');
      return;
    }

    setSubmitting(true);

    try {

      const formData = new FormData();

      formData.append('title', title);
      formData.append('description', description);
      formData.append('courseId', courseId);
      formData.append('isPreview', isPreview);
      formData.append('youtubeUrl', youtubeUrl);

      if (videoFile) {

        const fileUri =
          Platform.OS === 'android'
            ? videoFile.uri
            : videoFile.uri.replace('file://', '');

        formData.append('video', {
          uri: fileUri,
          name: videoFile.name || "video.mp4",
          type: videoFile.mimeType || videoFile.type || "video/mp4"
        });

      }

      await videoAPI.createVideo(formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 600000
      });

      setTitle('');
      setDescription('');
      setVideoFile(null);
      setYoutubeUrl('');
      setIsPreview(false);

      fetchVideos();

      Alert.alert("Success", "Video added successfully");

    } catch (err) {

      console.log("UPLOAD ERROR:", err?.response?.data || err.message);

      Alert.alert(
        'Upload Failed',
        err?.response?.data?.message || 'Video upload failed'
      );

    } finally {

      setSubmitting(false);

    }

  };


  const handleDelete = (id) => {

    Alert.alert(
      'Delete Video',
      'Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },

        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {

            try {

              await videoAPI.deleteVideo(id);
              fetchVideos();

            } catch {

              Alert.alert('Error', 'Failed to delete video');

            }

          }
        }
      ]
    );

  };


  if (loading) {

    return (

      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>

    );

  }


  return (

    <View style={[styles.container, { backgroundColor: theme.background }]}>

      <Text style={[styles.heading, { color: theme.text }]}>
        {courseTitle}
      </Text>

      {/* ADD VIDEO FORM */}

      <View style={[styles.card, { backgroundColor: theme.card }]}>

        <TextInput
          placeholder="Video Title"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          placeholder="Description (optional)"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          value={description}
          onChangeText={setDescription}
        />

        {/* VIDEO PICKER */}

        <TouchableOpacity
          style={[styles.fileBtn, { borderColor: theme.border }]}
          onPress={pickVideo}
        >

          <Ionicons name="cloud-upload" size={20} color={theme.primary} />

          <Text style={{ color: theme.text }}>
            {videoFile ? videoFile.name : "Select Video File"}
          </Text>

        </TouchableOpacity>

        <Text style={{ textAlign: 'center', marginVertical: 10, color: theme.text }}>
          OR
        </Text>

        {/* YOUTUBE URL */}

        <TextInput
          placeholder="Paste YouTube URL"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          value={youtubeUrl}
          onChangeText={(text) => {
            setYoutubeUrl(text);
            if (text) setVideoFile(null);
          }}
        />

        <View style={styles.previewRow}>

          <Text style={{ color: theme.text }}>
            Preview Video
          </Text>

          <Switch
            value={isPreview}
            onValueChange={setIsPreview}
          />

        </View>

        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.primary }]}
          onPress={handleAddVideo}
          disabled={submitting}
        >

          {submitting ? (

            <ActivityIndicator color="#fff" />

          ) : (

            <>
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addText}>
                Add Video
              </Text>
            </>

          )}

        </TouchableOpacity>

      </View>


      {/* VIDEO LIST */}

      <FlatList
        data={videos}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item, index }) => (

          <View style={[styles.videoItem, { backgroundColor: theme.card }]}>

            <View>

              <Text style={[styles.videoTitle, { color: theme.text }]}>
                {index + 1}. {item.title}
              </Text>

              {item.isPreview && (
                <Text style={{ color: theme.primary, fontSize: 12 }}>
                  Preview
                </Text>
              )}

            </View>

            <TouchableOpacity
              onPress={() => handleDelete(item._id)}
            >

              <Ionicons
                name="trash"
                size={20}
                color={theme.warning}
              />

            </TouchableOpacity>

          </View>

        )}
      />

    </View>

  );

};

const styles = StyleSheet.create({

  container: { flex: 1, padding: 16 },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  heading: { fontSize: 22, fontWeight: '700', marginBottom: 10 },

  card: { padding: 16, borderRadius: 12, marginBottom: 16 },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10
  },

  fileBtn: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10
  },

  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },

  addBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 8,
    gap: 6
  },

  addText: {
    color: '#fff',
    fontWeight: '600'
  },

  videoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10
  },

  videoTitle: {
    fontSize: 16,
    fontWeight: '600'
  }

});

export default ManageVideosScreen;