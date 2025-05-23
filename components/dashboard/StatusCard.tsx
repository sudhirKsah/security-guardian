import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface StatusCardProps {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  description: string;
  permission: string;
}

export default function StatusCard({ title, icon, isActive, description, permission }: StatusCardProps) {
  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[
          styles.iconContainer,
          isActive ? styles.activeIconContainer : styles.inactiveIconContainer
        ]}>
          {icon}
        </View>
        <View style={[
          styles.statusBadge,
          isActive ? styles.activeBadge : styles.inactiveBadge
        ]}>
          <Text style={[
            styles.statusText,
            isActive ? styles.activeStatusText : styles.inactiveStatusText
          ]}>
            {isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      
      {permission !== 'granted' && permission !== 'unavailable' && (
        <View style={styles.permissionWarning}>
          <AlertTriangle size={12} color="#FF9500" />
          <Text style={styles.permissionText}>Needs permission</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  inactiveIconContainer: {
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  inactiveBadge: {
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  activeStatusText: {
    color: '#34C759',
  },
  inactiveStatusText: {
    color: '#8E8E93',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
  },
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  permissionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#FF9500',
    marginLeft: 4,
  },
});