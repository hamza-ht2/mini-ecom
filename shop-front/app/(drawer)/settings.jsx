import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native'
import React, { useState } from 'react'
import ThemedView from '../../components/ThemedView'
import { Ionicons } from '@expo/vector-icons'

const Settings = () => {
  const [notifications, setNotifications] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your app preferences</Text>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="notifications" size={24} color="#FF9500" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive push notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#ccc', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>
          </View>

          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail" size={24} color="#007AFF" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Email Alerts</Text>
                <Text style={styles.settingDescription}>Get email notifications</Text>
              </View>
              <Switch
                value={emailAlerts}
                onValueChange={setEmailAlerts}
                trackColor={{ false: '#ccc', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <TouchableOpacity 
            style={styles.settingCard}
            onPress={() => Alert.alert('Coming Soon', 'Dark mode will be available in a future update!')}
          >
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="moon" size={24} color="#5856D6" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Coming soon</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity 
            style={styles.settingCard}
            onPress={() => Alert.alert('Coming Soon', 'Language settings coming soon!')}
          >
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="language" size={24} color="#34C759" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Language</Text>
                <Text style={styles.settingDescription}>English</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingCard}
            onPress={() => Alert.alert('Coming Soon', 'Privacy settings coming soon!')}
          >
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="shield-checkmark" size={24} color="#007AFF" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Privacy</Text>
                <Text style={styles.settingDescription}>Manage your privacy</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingCard}
            onPress={() => Alert.alert('Coming Soon', 'Security settings coming soon!')}
          >
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed" size={24} color="#FF3B30" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Security</Text>
                <Text style={styles.settingDescription}>Password & authentication</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity 
            style={styles.settingCard}
            onPress={() => Alert.alert('Help Center', 'Visit our help center for assistance')}
          >
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="help-circle" size={24} color="#5856D6" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Help Center</Text>
                <Text style={styles.settingDescription}>Get help and support</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingCard}
            onPress={() => Alert.alert('About', 'Shop App v1.0.0\n© 2025')}
          >
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="information-circle" size={24} color="#007AFF" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>About</Text>
                <Text style={styles.settingDescription}>App version & info</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          
          <TouchableOpacity 
            style={[styles.settingCard, styles.dangerCard]}
            onPress={() => {
              Alert.alert(
                'Clear Cache',
                'Are you sure you want to clear the cache?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Clear', 
                    style: 'destructive',
                    onPress: () => Alert.alert('Success', 'Cache cleared!')
                  }
                ]
              )
            }}
          >
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="trash" size={24} color="#FF3B30" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, styles.dangerText]}>Clear Cache</Text>
                <Text style={styles.settingDescription}>Remove temporary data</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.settingCard, styles.dangerCard]}
            onPress={() => {
              Alert.alert(
                'Delete Account',
                'This action cannot be undone. Are you sure?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: () => Alert.alert('Coming Soon', 'Account deletion coming soon')
                  }
                ]
              )
            }}
          >
            <View style={styles.settingRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="warning" size={24} color="#FF3B30" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, styles.dangerText]}>Delete Account</Text>
                <Text style={styles.settingDescription}>Permanently delete your account</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#ccc" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  )
}

export default Settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    marginLeft: 15,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 3,
  },
  settingDescription: {
    fontSize: 13,
    color: '#999',
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  dangerText: {
    color: '#FF3B30',
  },
})