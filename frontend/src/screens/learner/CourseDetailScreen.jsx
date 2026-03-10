//frontend/src/screens/learner/CourseDetailScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext.jsx';
import { courseAPI, userAPI, progressAPI, videoAPI, certificateAPI } from '../../services/api.jsx';

const CourseDetailScreen = ({ route, navigation }) => {

  const { courseId } = route.params;
  const { theme } = useTheme();

  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [progress, setProgress] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling,setEnrolling]=useState(false)

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {

    try {

      const [courseRes, profileRes, videoRes] = await Promise.all([
        courseAPI.getCourse(courseId),
        userAPI.getProfile(),
        videoAPI.getCourseVideos(courseId)
      ]);

      setCourse(courseRes.data.course);
      setVideos(videoRes.data.videos || []);

      const enrolledCourses = profileRes.data.user.enrolledCourses || [];

      const enrolled = enrolledCourses.some(
        c => c === courseId || c._id === courseId
      );

      setIsEnrolled(enrolled);

      if (enrolled) {

        const progressRes = await progressAPI.getProgress(courseId);
        setProgress(progressRes.data.progress);

      }

    } catch (error) {

      console.log(error);
      Alert.alert('Error', 'Failed to load course');

    } finally {

      setLoading(false);

    }

  };

  const handleEnroll = async()=>{

    try{

      setEnrolling(true)

      await userAPI.enrollCourse(courseId)

      setIsEnrolled(true)

      Alert.alert("Success","Course Enrolled")

      fetchCourseData()

    }catch(err){

      Alert.alert("Error","Enroll failed")

    }finally{

      setEnrolling(false)

    }

  }

  const handleStartLearning = () => {

    if (videos.length > 0) {

      navigation.navigate('VideoPlayer', {

        videoId: videos[0]._id,
        courseId: courseId,
        videoUrl: videos[0].videoUrl,
        videoTitle: videos[0].title

      });

    }

  };

  const completedVideos = progress?.completedVideos || []

  const isVideoCompleted = (videoId) => {

    return completedVideos.some(v =>

      v.videoId === videoId ||
      v.videoId?._id === videoId

    )

  }

 const allVideosCompleted =
videos.length === 0 || completedVideos.length === videos.length

  const quizPassed = progress?.quizScore?.passed

  const handleGenerateCertificate = async () => {

  try{

    const res = await certificateAPI.generateCertificate(courseId)

    const url = res.data.certificateUrl

    navigation.navigate("Certificate", { url })

  }catch(err){

    Alert.alert("Error","Certificate generation failed")

  }

}

  if (loading) {

    return (
      <View style={[styles.container,{backgroundColor:theme.background}]}>
        <ActivityIndicator size="large" color={theme.primary}/>
      </View>
    );

  }

  return (

    <View style={[styles.container,{backgroundColor:theme.background}]}>

      <ScrollView>

        <View style={[styles.header,{backgroundColor:theme.primary}]}>
          <Text style={styles.headerTitle}>{course.title}</Text>
          <Text style={styles.headerDesc}>{course.description}</Text>
        </View>

        <View style={styles.content}>

          <Text style={[styles.sectionTitle,{color:theme.text}]}>
            Course Content
          </Text>

          {videos.map((video,index)=>{

            const completed = isVideoCompleted(video._id)

            return(

            <TouchableOpacity
              key={video._id}
              style={[styles.videoItem,{backgroundColor:theme.card}]}
              disabled={!isEnrolled}
              onPress={()=>navigation.navigate("VideoPlayer",{
                videoId:video._id,
                courseId:courseId,
                videoUrl:video.videoUrl,
                videoTitle:video.title
              })}
            >

              <Ionicons
                name={completed ? "checkmark-circle" : "play-circle"}
                size={26}
                color={completed ? theme.success : theme.primary}
              />

              <View style={{marginLeft:10}}>
                <Text style={{color:theme.text,fontSize:15}}>
                  {index+1}. {video.title}
                </Text>
                <Text style={{color:theme.textSecondary,fontSize:12}}>
                  {video.duration}
                </Text>
              </View>

            </TouchableOpacity>

          )})}

        </View>

      </ScrollView>

      {!isEnrolled ? (

        <TouchableOpacity
          style={[styles.startBtn,{backgroundColor:theme.primary}]}
          onPress={handleEnroll}
        >
          {enrolling
          ? <ActivityIndicator color="#fff"/>
          : <Text style={styles.startText}>Enroll Course</Text>}
        </TouchableOpacity>

      ) : allVideosCompleted && !quizPassed ? (

        <TouchableOpacity
          style={[styles.startBtn,{backgroundColor:theme.warning}]}
          onPress={()=>navigation.navigate("Quiz",{courseId})}
        >
          <Text style={styles.startText}>Start Quiz</Text>
        </TouchableOpacity>

      ) : quizPassed ? (

        <TouchableOpacity
          style={[styles.startBtn,{backgroundColor:theme.success}]}
          onPress={handleGenerateCertificate}
        >
          <Text style={styles.startText}>Get Certificate</Text>
        </TouchableOpacity>

      ) : (

        <TouchableOpacity
          style={[styles.startBtn,{backgroundColor:theme.success}]}
          onPress={handleStartLearning}
        >
          <Text style={styles.startText}>Start Learning</Text>
        </TouchableOpacity>

      )}

    </View>

  );

};

const styles=StyleSheet.create({

container:{flex:1},

header:{padding:20},

headerTitle:{color:"#fff",fontSize:22,fontWeight:"bold"},

headerDesc:{color:"#fff",marginTop:6},

content:{padding:20},

sectionTitle:{fontSize:18,fontWeight:"bold",marginBottom:10},

videoItem:{
flexDirection:"row",
alignItems:"center",
padding:12,
borderRadius:10,
marginBottom:10
},

startBtn:{
padding:16,
alignItems:"center"
},

startText:{
color:"#fff",
fontSize:16,
fontWeight:"600"
}

});

export default CourseDetailScreen;