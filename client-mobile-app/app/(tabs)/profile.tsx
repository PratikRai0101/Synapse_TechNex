import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://avatars.githubusercontent.com/u/14101776?s=200&v=4' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Synapse</Text>
        <Text style={styles.email}>user@synapse.com</Text>
      </View>

      {/* Profile Actions */}
      <View style={styles.actions}>
        <ProfileAction icon="wallet" label="My Portfolio" />
        <ProfileAction icon="bar-chart" label="Analytics" />
        <ProfileAction icon="settings" label="Settings" />
        <ProfileAction icon="help-circle" label="Help & Support" />
        <ProfileAction icon="log-out" label="Logout" />
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appVersion}>App Version 1.0.0</Text>
        <Text style={styles.copyright}>© 2025 Synapse TechNex</Text>
      </View>
    </ScrollView>
  );
}

function ProfileAction({ icon, label }: { icon: any; label: string }) {
  return (
    <TouchableOpacity style={styles.actionBtn}>
      <Ionicons name={icon} size={22} color="#111827" style={{ marginRight: 16 }} />
      <Text style={styles.actionLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#A1A1AA" style={{ marginLeft: 'auto' }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 32,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#111827',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 8,
  },
  actions: {
    width: '90%',
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingVertical: 8,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  actionLabel: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 24,
  },
  appVersion: {
    fontSize: 13,
    color: '#A1A1AA',
    marginBottom: 2,
  },
  copyright: {
    fontSize: 12,
    color: '#D1D5DB',
  },
});
