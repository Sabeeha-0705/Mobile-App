//frontend/src/screens/learner/VideoPlayerScreen.jsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { WebView } from 'react-native-webview';

import { useTheme } from '../../context/ThemeContext.jsx';
import { progressAPI } from '../../services/api.jsx';

const { width } = Dimensions.get('window');

const VideoPlayerScreen = ({ route, navigation }) => {

  const { videoId, courseId, videoUrl, videoTitle } = route.params;

  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  // Detect YouTube
  const isYoutube =
    videoUrl.includes("youtube.com") ||
    videoUrl.includes("youtu.be");

  // Convert to embed URL
  const getYoutubeEmbedUrl = (url) => {

    let id = "";

    if (url.includes("watch?v=")) {
      id = url.split("watch?v=")[1];
    }

    if (url.includes("youtu.be/")) {
      id = url.split("youtu.be/")[1];
    }

    if (id.includes("&")) {
      id = id.split("&")[0];
    }

    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`;

  };

  // Open YouTube App fallback
  const openYoutube = () => {
    Linking.openURL(videoUrl);
  };

  const handleVideoComplete = async () => {

    if (completed) return;

    try {

      await progressAPI.markVideoComplete({
        courseId,
        videoId,
        watchTime: 0
      });

      setCompleted(true);

      Alert.alert(
        'Success',
        'Lesson completed!',
        [
          { text: 'Continue', onPress: () => navigation.goBack() }
        ]
      );

    } catch (error) {

      console.log('Error marking complete:', error);

    }

  };

  return (

    <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* VIDEO PLAYER */}

      <View style={styles.videoContainer}>

        {isYoutube ? (

          <WebView
            style={styles.video}
            javaScriptEnabled
            domStorageEnabled
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
            startInLoadingState
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            source={{
              uri: getYoutubeEmbedUrl(videoUrl)
            }}
          />

        ) : (

          <Video
            source={{ uri: videoUrl }}
            style={styles.video}
            useNativeControls
            resizeMode="contain"
            shouldPlay
            onLoadStart={() => setLoading(true)}
            onLoad={() => setLoading(false)}
          />

        )}

        {loading && (

          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
          </View>

        )}

      </View>

      {/* If YouTube blocked → open YouTube */}

      {isYoutube && (

        <TouchableOpacity
          style={styles.youtubeButton}
          onPress={openYoutube}
        >
          <Ionicons name="logo-youtube" size={20} color="#fff" />
          <Text style={styles.youtubeText}>
            Watch on YouTube
          </Text>
        </TouchableOpacity>

      )}

      {/* CONTENT */}

      <View style={styles.content}>

        <Text style={[styles.title, { color: theme.text }]}>
          {videoTitle}
        </Text>

        <TouchableOpacity
          style={[
            styles.completeButton,
            { backgroundColor: completed ? theme.success : theme.primary }
          ]}
          onPress={handleVideoComplete}
          disabled={completed}
        >

          <Ionicons
            name={completed ? "checkmark-circle" : "checkmark"}
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.completeButtonText}>
            {completed ? 'Completed' : 'Mark as Complete'}
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.surface }]}
          onPress={() => navigation.goBack()}
        >

          <Text style={[styles.backButtonText, { color: theme.text }]}>
            Back to Course
          </Text>

        </TouchableOpacity>

      </View>

    </View>

  );

};

const styles = StyleSheet.create({

  container: {
    flex: 1
  },

  videoContainer: {
    width: width,
    height: width * 9 / 16,
    backgroundColor: '#000'
  },

  video: {
    width: '100%',
    height: '100%'
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },

  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
    padding: 12,
    marginHorizontal: 20,
    borderRadius: 8,
    marginTop: 10
  },

  youtubeText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8
  },

  content: {
    padding: 20
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },

  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15
  },

  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8
  },

  backButton: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center'
  },

  backButtonText: {
    fontSize: 16,
    fontWeight: '600'
  }

});

export default VideoPlayerScreen;