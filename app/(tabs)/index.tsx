import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Shield, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Settings, ClipboardCheck, MessageSquare, Mic, Globe } from 'lucide-react-native';
import { Link } from 'expo-router';
import StatusCard from '@/components/dashboard/StatusCard';
import ThreatHistoryItem from '@/components/dashboard/ThreatHistoryItem';
import { usePermissions } from '@/hooks/usePermissions';

export default function Dashboard() {
  const { permissionStatus, requestAllPermissions } = usePermissions();
  const [securityScore, setSecurityScore] = useState(85);
  const [recentThreats] = useState([
    {
      id: '1',
      type: 'phishing',
      source: 'Clipboard',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      description: 'Potential phishing URL detected',
      severity: 'high',
    },
    {
      id: '2',
      type: 'spam',
      source: 'SMS',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      description: 'Suspicious SMS message detected',
      severity: 'medium',
    },
    {
      id: '3',
      type: 'suspicious',
      source: 'Voice Analysis',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      description: 'High stress levels detected in call',
      severity: 'low',
    },
  ]);

  useEffect(() => {
    // Calculate security score based on permissions granted
    const permissionsGranted = Object.values(permissionStatus).filter(
      (status) => status === 'granted'
    ).length;
    const totalPermissions = Object.keys(permissionStatus).length;
    const newScore = Math.round((permissionsGranted / totalPermissions) * 100);
    setSecurityScore(newScore > 0 ? newScore : 85); // Default to 85 if no permissions set
  }, [permissionStatus]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Shield size={24} color="#007AFF" />
        <Text style={styles.headerText}>Security Dashboard</Text>
        <Link href="/settings" asChild>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color="#007AFF" />
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.scoreContainer}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{securityScore}</Text>
        </View>
        <Text style={styles.scoreLabel}>Security Score</Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={requestAllPermissions}
        >
          <Text style={styles.permissionButtonText}>
            Grant Required Permissions
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Protection Status</Text>
      <View style={styles.statusGrid}>
        <StatusCard
          title="Clipboard Guard"
          icon={<ClipboardCheck size={22} color="#007AFF" />}
          isActive={permissionStatus.clipboard === 'granted'}
          description="Monitors clipboard for phishing links"
          permission={permissionStatus.clipboard}
        />
        <StatusCard
          title="Message Scanner"
          icon={<MessageSquare size={22} color="#007AFF" />}
          isActive={permissionStatus.sms === 'granted'}
          description="Scans messages for threats"
          permission={permissionStatus.sms}
        />
        <StatusCard
          title="Voice Analyzer"
          icon={<Mic size={22} color="#007AFF" />}
          isActive={true}
          description="Analyzes voice for emotions"
          permission="granted"
        />
        <StatusCard
          title="Safe Browser"
          icon={<Globe size={22} color="#007AFF" />}
          isActive={true}
          description="Secures web browsing"
          permission="granted"
        />
      </View>

      <Text style={styles.sectionTitle}>Recent Threats</Text>
      <View style={styles.threatsList}>
        {recentThreats.map((threat) => (
          <ThreatHistoryItem key={threat.id} threat={threat} />
        ))}
      </View>

      <TouchableOpacity style={styles.viewAllButton}>
        <Text style={styles.viewAllText}>View Full History</Text>
        <Clock size={16} color="#007AFF" />
      </TouchableOpacity>

      <View style={styles.tipContainer}>
        <View style={styles.tipIconContainer}>
          <AlertTriangle size={20} color="#FF9500" />
        </View>
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>Security Tip</Text>
          <Text style={styles.tipText}>
            Always verify the sender before responding to urgent requests for personal information
            or financial details.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    marginLeft: 8,
    flex: 1,
  },
  settingsButton: {
    padding: 8,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 8,
    borderColor: '#34C759',
  },
  scoreText: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#34C759',
  },
  scoreLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 8,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  permissionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 16,
    marginTop: 8,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  threatsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'transparent',
    marginBottom: 24,
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#007AFF',
    marginRight: 8,
  },
  tipContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 20,
  },
});