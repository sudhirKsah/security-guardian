import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { TriangleAlert as AlertTriangle, ShieldOff, X, CircleArrowLeft as ArrowLeftCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { PhishingAnalysisResult } from '@/utils/api';

interface SafeBrowsingAlertProps {
  visible: boolean;
  onClose: () => void;
  url: string;
  securityDetails?: PhishingAnalysisResult | null;
}

export default function SafeBrowsingAlert({ visible, onClose, url, securityDetails }: SafeBrowsingAlertProps) {
  const [animation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animation]);

  const { height } = Dimensions.get('window');
  
  const slideUp = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  const getShortUrl = (url: string) => {
    try {
      const urlObject = new URL(url);
      return urlObject.hostname;
    } catch (e) {
      return url;
    }
  };

  const getConfidenceLevel = () => {
    if (!securityDetails?.confidence) return 'Unknown';
    
    const confidence = securityDetails.confidence;
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    if (confidence >= 0.4) return 'Low';
    return 'Very Low';
  };

  const getThreatDescription = () => {
    return securityDetails?.details || 'This website has been detected as potentially malicious and may try to steal your personal information or compromise your device security.';
  };

  const getThreatType = () => {
    return securityDetails?.type || 'malicious';
  };

  const getGenericThreats = () => {
    const threatType = getThreatType().toLowerCase();
    
    if (threatType.includes('phishing')) {
      return [
        'Credential harvesting',
        'Personal data theft',
        'Financial information theft',
        'Identity theft',
      ];
    } else if (threatType.includes('malware')) {
      return [
        'Device infection',
        'Data corruption',
        'System compromise',
        'Privacy breach',
      ];
    } else if (threatType.includes('unwanted_software')) {
      return [
        'Unauthorized browser changes',
        'Unwanted ads',
        'Device slowdown',
        'Privacy invasion',
      ];
    } else {
      return [
        'Data security risks',
        'Privacy concerns',
        'Potential scams',
        'Suspicious behavior',
      ];
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: animation,
          }
        ]}
      >
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        
        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [{ translateY: slideUp }],
            }
          ]}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.warningHeader}>
              <AlertTriangle size={60} color="#FFFFFF" />
              <Text style={styles.warningTitle}>Security Warning</Text>
              <Text style={styles.warningSubtitle}>
                {getThreatType().charAt(0).toUpperCase() + getThreatType().slice(1)} Detected
              </Text>
            </View>
            
            <View style={styles.contentContainer}>
              <View style={styles.urlContainer}>
                <ShieldOff size={18} color="#FF3B30" />
                <Text style={styles.urlText} numberOfLines={1}>
                  {getShortUrl(url)}
                </Text>
              </View>
              
              <View style={styles.confidenceContainer}>
                <Text style={styles.confidenceLabel}>Threat Confidence: </Text>
                <Text style={[
                  styles.confidenceValue,
                  { 
                    color: securityDetails?.confidence >= 0.7 ? '#FF3B30' : 
                           securityDetails?.confidence >= 0.5 ? '#FF9500' : '#8E8E93'
                  }
                ]}>
                  {getConfidenceLevel()} ({Math.round((securityDetails?.confidence || 0) * 100)}%)
                </Text>
              </View>
              
              <Text style={styles.warningDescription}>
                {getThreatDescription()}
              </Text>
              
              <View style={styles.threatsList}>
                <Text style={styles.threatsTitle}>Potential Risks:</Text>
                {getGenericThreats().map((threat, index) => (
                  <View key={index} style={styles.threatItem}>
                    <AlertCircle size={16} color="#FF3B30" />
                    <Text style={styles.threatText}>{threat}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.goBackButton}
                  onPress={onClose}
                >
                  <ArrowLeftCircle size={20} color="#FFFFFF" />
                  <Text style={styles.goBackText}>Go Back (Safe)</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <X size={20} color="#FFFFFF" />
                  <Text style={styles.closeText}>Close Warning</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.disclaimer}>
                Security Guardian has analyzed this site using Google Safe Browsing and rule-based detection.
                Proceeding may put your personal information at risk.
              </Text>
            </View>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  alertContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  safeArea: {
    flex: 1,
  },
  warningHeader: {
    backgroundColor: '#FF3B30',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 4,
  },
  warningSubtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  contentContainer: {
    padding: 20,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  urlText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#FF3B30',
    marginLeft: 8,
    flex: 1,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  confidenceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3C3C43',
  },
  confidenceValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  warningDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000000',
    marginBottom: 20,
    lineHeight: 24,
  },
  threatsList: {
    marginBottom: 24,
  },
  threatsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
  threatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  threatText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    marginLeft: 8,
    color: '#3C3C43',
  },
  actionButtons: {
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  goBackText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: '#8E8E93',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  closeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  disclaimer: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
  },
});
