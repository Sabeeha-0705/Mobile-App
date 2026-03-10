import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Placeholder screens
import UploaderDashboardScreen from '../screens/uploader/UploaderDashboardScreen';
import MyCoursesScreen from '../screens/uploader/MyCoursesScreen';
import CreateCourseScreen from '../screens/uploader/CreateCourseScreen';
import EarningsScreen from '../screens/uploader/EarningsScreen';

const Tab = createBottomTabNavigator();

export default function UploaderTabNavigator() {
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
        component={UploaderDashboardScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏠</Text>
        }}
      />
      <Tab.Screen 
        name="MyCourses" 
        component={MyCoursesScreen}
        options={{
          tabBarLabel: 'My Courses',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📚</Text>
        }}
      />
      <Tab.Screen 
        name="Create" 
        component={CreateCourseScreen}
        options={{
          tabBarLabel: 'Create',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>➕</Text>
        }}
      />
      <Tab.Screen 
        name="Earnings" 
        component={EarningsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>💰</Text>
        }}
      />
    </Tab.Navigator>
  );
}
