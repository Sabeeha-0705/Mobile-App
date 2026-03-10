//frontend/src/screens/auth/RoleSelectionScreen.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';

const RoleSelectionScreen = ({ route, navigation }) => {

  const { fullName, email, password } = route.params;
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleContinue = async () => {

    if (!selectedRole) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    try {

      setLoading(true);

      const res = await api.post('/auth/register', {
        fullName,
        email,
        password,
        role: selectedRole
      });

      if (res.data.success) {

        await AsyncStorage.setItem('token', res.data.token);

        Alert.alert('Success', 'Account created successfully');

        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }]
        });

      } else {

        Alert.alert('Registration Failed', res.data.message);

      }

    } catch (err) {

      Alert.alert(
        'Registration Failed',
        err.response?.data?.message || 'Something went wrong'
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>

      <Text style={[styles.title, { color: theme.text }]}>
        Choose Your Role
      </Text>

      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        How do you want to use Eduoding?
      </Text>

      <TouchableOpacity
        style={[
          styles.roleCard,
          { borderColor: selectedRole === 'learner' ? theme.primary : theme.border }
        ]}
        onPress={() => setSelectedRole('learner')}
      >
        <Ionicons name="school" size={50} color={theme.primary} />
        <Text style={styles.roleTitle}>Learner</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.roleCard,
          { borderColor: selectedRole === 'uploader' ? theme.primary : theme.border }
        ]}
        onPress={() => setSelectedRole('uploader')}
      >
        <Ionicons name="create" size={50} color={theme.primary} />
        <Text style={styles.roleTitle}>Instructor</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleContinue}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Continue'}
        </Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  subtitle: {
    textAlign: 'center',
    marginBottom: 30
  },

  roleCard: {
    padding: 25,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 20,
    alignItems: 'center'
  },

  roleTitle: {
    fontSize: 20,
    marginTop: 10
  },

  button: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center'
  },

  buttonText: {
    color: '#fff',
    fontSize: 18
  }

});

export default RoleSelectionScreen;