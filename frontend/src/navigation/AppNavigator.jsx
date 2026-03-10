//frontend/src/navigation/AppNavigator.jsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Common
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';

// Learner Screens
import HomeScreen from '../screens/learner/HomeScreen';
import CoursesScreen from '../screens/learner/CoursesScreen';
import CourseDetailScreen from '../screens/learner/CourseDetailScreen';
import VideoPlayerScreen from '../screens/learner/VideoPlayerScreen';
import ProgressScreen from '../screens/learner/ProgressScreen';
import ChatbotScreen from '../screens/learner/ChatbotScreen';
import SettingsScreen from '../screens/learner/SettingsScreen';
import QuizScreen from '../screens/learner/QuizScreen';
import CertificatesScreen from "../screens/learner/CertificatesScreen";
import NotesScreen from "../screens/learner/NotesScreen";

// Coding Practice
import LanguagesScreen from "../screens/learner/LanguagesScreen";
import ProblemListScreen from "../screens/learner/ProblemListScreen";
import ProblemDetailScreen from "../screens/learner/ProblemDetailScreen";
import CodeEditorScreen from "../screens/learner/CodeEditorScreen";
import LeaderboardScreen from "../screens/learner/LeaderboardScreen";

// Uploader
import UploaderDashboardScreen from '../screens/uploader/UploaderDashboardScreen';
import ManageCoursesScreen from '../screens/uploader/ManageCoursesScreen';
import CreateCourseScreen from '../screens/uploader/CreateCourseScreen';
import EarningsScreen from '../screens/uploader/EarningsScreen';
import ManageVideosScreen from '../screens/uploader/ManageVideosScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();



/* ================= LEARNER TAB NAVIGATION ================= */

const LearnerTabs = () => {

  const { theme } = useTheme();

  return (

    <Tab.Navigator
      screenOptions={({ route }) => ({

        tabBarIcon: ({ focused, color, size }) => {

          let icon;

          if (route.name === 'Home') icon = focused ? 'home' : 'home-outline';
          else if (route.name === 'Courses') icon = focused ? 'book' : 'book-outline';
          else if (route.name === 'CodePractice') icon = focused ? 'code' : 'code-outline';
          else if (route.name === 'Progress') icon = focused ? 'analytics' : 'analytics-outline';
          else if (route.name === 'Chatbot') icon = focused ? 'chatbubbles' : 'chatbubbles-outline';
          else if (route.name === 'Settings') icon = focused ? 'settings' : 'settings-outline';

          return <Ionicons name={icon} size={size} color={color} />;

        },

        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,

      })}
    >

      <Tab.Screen name="Home" component={HomeScreen} />

      <Tab.Screen name="Courses" component={CoursesScreen} />

      {/* 🔥 CODE PRACTICE TAB */}
      <Tab.Screen
        name="CodePractice"
        component={LanguagesScreen}
        options={{ title: "Code Practice" }}
      />

      <Tab.Screen name="Progress" component={ProgressScreen} />

      <Tab.Screen name="Chatbot" component={ChatbotScreen} />

      <Tab.Screen name="Settings" component={SettingsScreen} />

    </Tab.Navigator>

  );

};



/* ================= UPLOADER TAB NAVIGATION ================= */

const UploaderTabs = () => {

  const { theme } = useTheme();

  return (

    <Tab.Navigator
      screenOptions={({ route }) => ({

        tabBarIcon: ({ focused, color, size }) => {

          let icon;

          if (route.name === 'Dashboard') icon = focused ? 'grid' : 'grid-outline';
          else if (route.name === 'ManageCourses') icon = focused ? 'folder' : 'folder-outline';
          else if (route.name === 'Earnings') icon = focused ? 'cash' : 'cash-outline';
          else if (route.name === 'Settings') icon = focused ? 'settings' : 'settings-outline';

          return <Ionicons name={icon} size={size} color={color} />;

        },

        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,

      })}
    >

      <Tab.Screen name="Dashboard" component={UploaderDashboardScreen} />
      <Tab.Screen name="ManageCourses" component={ManageCoursesScreen} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />

    </Tab.Navigator>

  );

};



/* ================= ROOT NAVIGATOR ================= */

const AppNavigator = () => {

  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <SplashScreen />;

  return (

    <NavigationContainer>

      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {!isAuthenticated && (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
          </>
        )}

        {isAuthenticated && user?.role === 'learner' && (
          <>
            <Stack.Screen name="Main" component={LearnerTabs} />

            <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
            <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
            <Stack.Screen name="Quiz" component={QuizScreen} />
            <Stack.Screen name="Certificate" component={CertificatesScreen} />
            <Stack.Screen name="Notes" component={NotesScreen} />

            {/* Coding Practice Stack */}
            <Stack.Screen name="Problems" component={ProblemListScreen} />
            <Stack.Screen name="ProblemDetail" component={ProblemDetailScreen} />
            <Stack.Screen name="CodeEditor" component={CodeEditorScreen} />
            <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />

          </>
        )}

        {isAuthenticated && user?.role === 'uploader' && (
          <>
            <Stack.Screen name="Main" component={UploaderTabs} />
            <Stack.Screen name="CreateCourse" component={CreateCourseScreen} />
            <Stack.Screen name="ManageVideos" component={ManageVideosScreen} />
          </>
        )}

      </Stack.Navigator>

    </NavigationContainer>

  );

};

export default AppNavigator;