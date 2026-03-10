import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Placeholder screens - will be implemented
import DashboardScreen from '../screens/learner/DashboardScreen';
import CoursesScreen from '../screens/learner/CoursesScreen';
import ProgressScreen from '../screens/learner/ProgressScreen';
import ProfileScreen from '../screens/learner/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function LearnerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: 'gray',
        headerShown: false
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 24, color }}>🏠</Text>
          )
        }}
      />
      <Tab.Screen 
        name="Courses" 
        component={CoursesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 24, color }}>📚</Text>
          )
        }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 24, color }}>📊</Text>
          )
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 24, color }}>👤</Text>
          )
        }}
      />
    </Tab.Navigator>
  );
}
