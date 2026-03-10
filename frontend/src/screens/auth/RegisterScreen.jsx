import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { sendOTP, verifyOTP } = useAuth();
  const { theme } = useTheme();

  const handleSendOTP = async () => {
    if (!email || !fullName) {
      Alert.alert('Error', 'Please enter your name and email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    const result = await sendOTP(email, fullName);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'OTP sent to your email. Please check your inbox.');
      setStep(2);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    const result = await verifyOTP(email, otp);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Email verified! Please set your password.');
      setStep(3);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleRegister = () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    navigation.navigate('RoleSelection', { fullName, email, password });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {step === 1 && 'Enter your details to get started'}
          {step === 2 && 'Enter the OTP sent to your email'}
          {step === 3 && 'Set a secure password'}
        </Text>

        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step >= 1 && { backgroundColor: theme.primary }]} />
          <View style={[styles.stepLine, step >= 2 && { backgroundColor: theme.primary }]} />
          <View style={[styles.stepDot, step >= 2 && { backgroundColor: theme.primary }]} />
          <View style={[styles.stepLine, step >= 3 && { backgroundColor: theme.primary }]} />
          <View style={[styles.stepDot, step >= 3 && { backgroundColor: theme.primary }]} />
        </View>

        {step === 1 && (
          <View style={styles.form}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
              placeholder="Full Name"
              placeholderTextColor={theme.textSecondary}
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
              placeholder="Email"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleSendOTP}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Send OTP</Text>}
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.form}>
            <Text style={[styles.otpText, { color: theme.text }]}>Code sent to {email}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
              placeholder="Enter 6-digit OTP"
              placeholderTextColor={theme.textSecondary}
              value={otp}
              onChangeText={setOTP}
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSendOTP}>
              <Text style={[styles.link, { color: theme.primary }]}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View style={styles.form}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
              placeholder="Password"
              placeholderTextColor={theme.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
              placeholder="Confirm Password"
              placeholderTextColor={theme.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleRegister}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.link, { color: theme.primary }]}>Already have an account? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 60 },
  backButton: { marginBottom: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 30 },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E5E7EB' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#E5E7EB', marginHorizontal: 8 },
  form: { marginBottom: 20 },
  input: { padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  button: { padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  otpText: { fontSize: 14, marginBottom: 15 },
  link: { textAlign: 'center', marginTop: 20, fontSize: 16 },
});

export default RegisterScreen;
