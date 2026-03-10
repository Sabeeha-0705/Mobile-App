// FILE: SplashScreen.js
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export const SplashScreen = () => (
  <View style={styles.splash}>
    <Text style={styles.logo}>Eduoding</Text>
    <Text style={styles.tagline}>Learn. Code. Succeed.</Text>
    <ActivityIndicator size="large" color="#FFFFFF" style={{ marginTop: 30 }} />
  </View>
);

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tagline: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 10,
  },
});

export default SplashScreen;
