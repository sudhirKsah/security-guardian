import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Animated,
} from 'react-native';
import { ClipboardCheck, TriangleAlert as AlertTriangle, Shield, Info, X, Check } from 'lucide-react-native';
import ClipboardHistoryItem from '@/components/clipboard/ClipboardHistoryItem';
import { usePermissions } from '@/hooks/usePermissions';

export default function ClipboardScreen() {
  const [monitoringEnabled, setMonitoringEnabled] = useState(false);
  const [clipboardHistory, setClipboardHistory] = useState([
    {
      id: '1',
      content: 'https://phishing-example.com/login/verify',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'malicious',
      type: 'url',
      details: 'Known phishing domain',
    },
    {
      id: '2',
      content: 'https://www.example.com/product/checkout',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      status: 'safe',
      type: 'url',
      details: 'Legitimate domain',
    },
    {
      id: '3',
      content: 'Your verification code is: 123456',
      timestamp: new Date(Date.now() - 1000 * 60 * 240),
      status: 'safe',
      type: 'text',
      details: 'No sensitive data detected',
    },
  ]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(null);
  const alertAnimation = new Animated.Value(0);
  const { permissionStatus, requestClipboardPermission } = usePermissions();

  useEffect(() => {
    // This would be where you'd implement the actual clipboard monitoring
    // For now, we're just simulating it with state

    // Check if permission is granted before enabling
    if (permissionStatus.clipboard === 'granted' && monitoringEnabled) {
      // Start clipboard monitoring simulation
      const interval = setInterval(() => {
        // Simulate a random clipboard event
        if (Math.random() > 0.8) {
          simulateClipboardEvent();
        }
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [monitoringEnabled, permissionStatus.clipboard]);

  const simulateClipboardEvent = () => {
    const isMalicious = Math.random() > 0.7;
    const newItem = {
      id: Date.now().toString(),
      content: isMalicious 
        ? 'https://malicious-site-' + Math.floor(Math.random() * 1000) + '.com/login' 
        : 'https://legitimate-site.com/page/' + Math.floor(Math.random() * 100),
      timestamp: new Date(),
      status: isMalicious ? 'malicious' : 'safe',
      type: 'url',
      details: isMalicious ? 'Suspected phishing domain' : 'No threats detected',
    };

    setClipboardHistory(prev => [newItem, ...prev]);

    if (isMalicious) {
      showAlert(newItem);
    }
  };

  const showAlert = (item) => {
    setCurrentAlert(item);
    setAlertVisible(true);
    
    Animated.sequence([
      Animated.timing(alertAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(5000),
      Animated.timing(alertAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAlertVisible(false);
    });
  };

  const dismissAlert = () => {
    Animated.timing(alertAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setAlertVisible(false);
    });
  };

  const toggleMonitoring = () => {
    if (!monitoringEnabled && permissionStatus.clipboard !== 'granted') {
      requestClipboardPermission();
      return;
    }
    
    setMonitoringEnabled(!monitoringEnabled);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.monitoringStatus}>
            <View style={[
              styles.statusIndicator, 
              monitoringEnabled ? styles.statusActive : styles.statusInactive
            ]} />
            <Text style={styles.monitoringText}>
              {monitoringEnabled ? 'Monitoring Active' : 'Monitoring Inactive'}
            </Text>
          </View>
          <Switch
            value={monitoringEnabled}
            onValueChange={toggleMonitoring}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#D1D1D6"
          />
        </View>

        <View style={styles.infoCard}>
          <ClipboardCheck size={22} color="#007AFF" style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Clipboard Protection</Text>
            <Text style={styles.infoDescription}>
              When enabled, any content copied to your clipboard will be automatically
              scanned for phishing URLs, malicious content, or sensitive information.
            </Text>
          </View>
        </View>

        {permissionStatus.clipboard !== 'granted' && (
          <View style={styles.permissionWarning}>
            <AlertTriangle size={20} color="#FF9500" />
            <Text style={styles.permissionWarningText}>
              Clipboard permission is required to enable monitoring.
            </Text>
            <TouchableOpacity 
              style={styles.permissionButton}
              onPress={requestClipboardPermission}
            >
              <Text style={styles.permissionButtonText}>Grant</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clipboard History</Text>
          <Text style={styles.sectionDescription}>
            Recent items that have been copied to your clipboard
          </Text>

          {clipboardHistory.length > 0 ? (
            <View style={styles.historyList}>
              {clipboardHistory.map((item) => (
                <ClipboardHistoryItem key={item.id} item={item} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No clipboard history yet
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
              <Shield size={20} color="#34C759" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Real-time Protection</Text>
              <Text style={styles.featureDescription}>
                Continuously monitors your clipboard for any copied content
              </Text>
            </View>
          </View>
          
          <View style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
              <ClipboardCheck size={20} color="#007AFF" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>URL Scanning</Text>
              <Text style={styles.featureDescription}>
                Detects phishing links and warns you before you visit them
              </Text>
            </View>
          </View>
          
          <View style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(255, 149, 0, 0.1)' }]}>
              <Info size={20} color="#FF9500" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Sensitive Data Detection</Text>
              <Text style={styles.featureDescription}>
                Identifies personal information and credentials in clipboard content
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {alertVisible && currentAlert && (
        <Animated.View 
          style={[
            styles.alertContainer,
            {
              transform: [
                {
                  translateY: alertAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0],
                  }),
                },
              ],
              opacity: alertAnimation,
            },
          ]}
        >
          <View style={styles.alertContent}>
            <View style={styles.alertIconContainer}>
              <AlertTriangle size={24} color="#FFFFFF" />
            </View>
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>Malicious Content Detected!</Text>
              <Text style={styles.alertMessage} numberOfLines={2}>
                {currentAlert.content}
              </Text>
              <Text style={styles.alertDetail}>{currentAlert.details}</Text>
            </View>
            <TouchableOpacity style={styles.alertCloseButton} onPress={dismissAlert}>
              <X size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.alertActions}>
            <TouchableOpacity style={styles.alertAction} onPress={dismissAlert}>
              <X size={16} color="#FFFFFF" />
              <Text style={styles.alertActionText}>Dismiss</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.alertAction}>
              <Check size={16} color="#FFFFFF" />
              <Text style={styles.alertActionText}>Details</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  monitoringStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusActive: {
    backgroundColor: '#34C759',
  },
  statusInactive: {
    backgroundColor: '#8E8E93',
  },
  monitoringText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  infoDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#3C3C43',
    lineHeight: 20,
  },
  permissionWarning: {
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionWarningText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#3C3C43',
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
  permissionButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  sectionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
  },
  historyList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E8E93',
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#3C3C43',
  },
  alertContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 40 : 16,
  },
  alertIconContainer: {
    marginRight: 12,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  alertMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 2,
  },
  alertDetail: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  alertCloseButton: {
    padding: 4,
  },
  alertActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  alertAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  alertActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});