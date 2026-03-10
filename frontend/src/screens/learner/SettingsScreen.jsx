import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout }
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.profileCard, { backgroundColor: theme.card }]}>
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>{user?.fullName?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={[styles.userName, { color: theme.text }]}>{user?.fullName}</Text>
        <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user?.email}</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.card }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={22} color={theme.text} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.card }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={22} color={theme.text} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>Notifications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('Certificates')}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="ribbon" size={22} color={theme.text} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>My Certificates</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.card }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle" size={22} color={theme.text} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme.card }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="shield-checkmark" size={22} color={theme.text} />
            <Text style={[styles.settingLabel, { color: theme.text }]}>Privacy Policy</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.card }]}
          onPress={handleLogout}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="log-out" size={22} color={theme.error} />
            <Text style={[styles.settingLabel, { color: theme.error }]}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={[styles.version, { color: theme.textSecondary }]}>Version 2.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileCard: { alignItems: 'center', padding: 30, margin: 15, borderRadius: 15, elevation: 2 },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' },
  userName: { fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  userEmail: { fontSize: 14 },
  section: { marginTop: 15, paddingHorizontal: 15 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 1 },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingLabel: { fontSize: 16, marginLeft: 15, fontWeight: '500' },
  version: { textAlign: 'center', marginTop: 30, fontSize: 12 },
});

export default SettingsScreen;
