import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { X, TriangleAlert as AlertTriangle, Info, ChartBar as BarChart } from 'lucide-react-native';

interface AudioRecord {
  id: string;
  name: string;
  duration: string;
  date: string;
  analyzed: boolean;
  emotion: string | null;
}

interface EmotionResultModalProps {
  visible: boolean;
  onClose: () => void;
  audio: AudioRecord | null;
}

export default function EmotionResultModal({ 
  visible, 
  onClose, 
  audio 
}: EmotionResultModalProps) {
  if (!audio) return null;

  const getEmotionColor = (emotion: string | null) => {
    if (!emotion) return '#8E8E93';
    
    switch (emotion.toLowerCase()) {
      case 'stressed':
      case 'angry':
        return '#FF9500';
      case 'suspicious':
      case 'fearful':
      case 'scam':
        return '#FF3B30';
      case 'calm':
      case 'normal':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  const getEmotionDescription = (emotion: string | null) => {
    if (!emotion) return '';
    
    switch (emotion.toLowerCase()) {
      case 'stressed':
        return 'The speaker shows signs of stress in their voice, indicating possible pressure or urgency. This could be legitimate concern or artificially created urgency common in scam calls.';
      case 'angry':
        return 'The speaker displays anger or aggression, which could be used to intimidate or pressure the recipient into compliance. Be cautious of aggressive tactics.';
      case 'suspicious':
        return 'The voice patterns contain elements that match known scam call characteristics. Exercise extreme caution with this caller.';
      case 'fearful':
        return 'The speaker appears to be conveying fear or creating fear in the listener. This is a common manipulation tactic in scam calls.';
      case 'calm':
        return 'The speaker maintains a calm, measured tone throughout the conversation. This suggests normal communication without manipulation tactics.';
      case 'normal':
        return 'No concerning emotion patterns detected. The conversation appears to follow normal speech patterns.';
      default:
        return 'Analysis complete, but the emotional pattern is unclear or mixed.';
    }
  };

  const getActionRecommendation = (emotion: string | null) => {
    if (!emotion) return '';
    
    switch (emotion.toLowerCase()) {
      case 'stressed':
      case 'angry':
      case 'suspicious':
      case 'fearful':
      case 'scam':
        return 'Exercise caution with this caller. Do not share personal or financial information. Consider blocking this number if the call was unsolicited.';
      case 'calm':
      case 'normal':
        return 'No immediate concerns with this call based on voice analysis. Still maintain normal caution with personal information.';
      default:
        return 'Consider the context of the call and use normal caution when interacting with this caller.';
    }
  };

  const getRiskLevel = (emotion: string | null) => {
    if (!emotion) return 'Unknown';
    
    switch (emotion.toLowerCase()) {
      case 'suspicious':
      case 'scam':
        return 'High';
      case 'stressed':
      case 'angry':
      case 'fearful':
        return 'Moderate';
      case 'calm':
      case 'normal':
        return 'Low';
      default:
        return 'Unknown';
    }
  };

  // Emotion confidence scores (simulated)
  const emotionScores = {
    suspicious: audio.emotion === 'suspicious' ? 0.82 : 0.12,
    stressed: audio.emotion === 'stressed' ? 0.75 : 0.18,
    normal: audio.emotion === 'normal' ? 0.91 : 0.32,
    angry: audio.emotion === 'angry' ? 0.68 : 0.08,
    fearful: audio.emotion === 'fearful' ? 0.71 : 0.09,
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Voice Analysis Results</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#000000" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollView}>
            <View style={styles.audioInfo}>
              <Text style={styles.audioName}>{audio.name}</Text>
              <View style={styles.audioMeta}>
                <Text style={styles.audioMetaText}>Duration: {audio.duration}</Text>
                <Text style={styles.audioMetaDot}>•</Text>
                <Text style={styles.audioMetaText}>Recorded: {audio.date}</Text>
              </View>
            </View>
            
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Detected Emotion</Text>
              </View>
              
              <View style={[
                styles.emotionBadge,
                { backgroundColor: `${getEmotionColor(audio.emotion)}15` }
              ]}>
                <AlertTriangle size={20} color={getEmotionColor(audio.emotion)} />
                <Text style={[
                  styles.emotionText,
                  { color: getEmotionColor(audio.emotion) }
                ]}>
                  {audio.emotion ? audio.emotion.charAt(0).toUpperCase() + audio.emotion.slice(1) : 'Unknown'}
                </Text>
              </View>
              
              <Text style={styles.emotionDescription}>
                {getEmotionDescription(audio.emotion)}
              </Text>
            </View>
            
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Analysis Breakdown</Text>
                <BarChart size={20} color="#007AFF" />
              </View>
              
              <View style={styles.confidenceContainer}>
                {Object.entries(emotionScores).map(([emotion, score]) => (
                  <View key={emotion} style={styles.confidenceItem}>
                    <Text style={styles.confidenceLabel}>
                      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}:
                    </Text>
                    <View style={styles.confidenceBarContainer}>
                      <View 
                        style={[
                          styles.confidenceBar,
                          {
                            width: `${score * 100}%`,
                            backgroundColor: getEmotionColor(emotion)
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.confidenceScore}>{Math.round(score * 100)}%</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Risk Assessment</Text>
              </View>
              
              <View style={styles.riskContainer}>
                <View style={[
                  styles.riskBadge,
                  { 
                    backgroundColor: 
                      getRiskLevel(audio.emotion) === 'High' ? 'rgba(255, 59, 48, 0.1)' :
                      getRiskLevel(audio.emotion) === 'Moderate' ? 'rgba(255, 149, 0, 0.1)' :
                      'rgba(52, 199, 89, 0.1)'
                  }
                ]}>
                  <Text style={[
                    styles.riskText,
                    {
                      color:
                        getRiskLevel(audio.emotion) === 'High' ? '#FF3B30' :
                        getRiskLevel(audio.emotion) === 'Moderate' ? '#FF9500' :
                        '#34C759'
                    }
                  ]}>
                    {getRiskLevel(audio.emotion)} Risk
                  </Text>
                </View>
              </View>
              
              <View style={styles.recommendationContainer}>
                <Info size={20} color="#007AFF" />
                <Text style={styles.recommendationText}>
                  {getActionRecommendation(audio.emotion)}
                </Text>
              </View>
            </View>
          </ScrollView>
          
          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  audioInfo: {
    marginBottom: 20,
  },
  audioName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    marginBottom: 8,
  },
  audioMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioMetaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  audioMetaDot: {
    marginHorizontal: 6,
    color: '#8E8E93',
  },
  resultCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  emotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  emotionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    marginLeft: 6,
  },
  emotionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 22,
    color: '#3C3C43',
  },
  confidenceContainer: {
    marginTop: 8,
  },
  confidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  confidenceLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    width: 90,
  },
  confidenceBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#E9E9EB',
    borderRadius: 6,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  confidenceBar: {
    height: '100%',
    borderRadius: 6,
  },
  confidenceScore: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    width: 40,
    textAlign: 'right',
  },
  riskContainer: {
    marginBottom: 16,
  },
  riskBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  riskText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  recommendationContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  recommendationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#3C3C43',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  doneButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});