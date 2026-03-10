import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext.jsx';
import { ThemeProvider } from './src/context/ThemeContext.jsx';
import AppNavigator from './src/navigation/AppNavigator.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}
