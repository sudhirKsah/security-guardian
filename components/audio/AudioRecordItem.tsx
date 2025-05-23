import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Play, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react-native';

interface AudioRecord {
  id: string;
  name: string;
  duration: string;
  date: string;
  analyzed: boolean;
  emotion: string | null;
}

interface AudioRecordItemProps {
  audio: AudioRecord;
  selected: boolean;
  onSelect: () => void;
}

export default function AudioRecordItem({ audio, selected, onSelect }: AudioRecordItemProps) {
  const getEmotionColor = (emotion: string | null) => {
    if (!emotion) return '#8E8E93';
    
    switch (emotion.toLowerCase()) {
      case 'stressed':
      case 'angry':
      case 'suspicious':
        return '#FF9500';
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

  const getEmotionIcon = (emotion: string | null) => {
    if (!emotion) return null;
    
    switch (emotion.toLowerCase()) {
      case 'stressed':
      case 'angry':
      case 'suspicious':
      case 'fearful':
      case 'scam':
        return <AlertTriangle size={16} color={getEmotionColor(emotion)} />;
      case 'calm':
      case 'normal':
        return <CheckCircle size={16} color={getEmotionColor(emotion)} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.container, selected && styles.selectedContainer]}
      onPress={onSelect}
    >
      <View style={styles.playButton}>
        <Play size={16} color="#007AFF" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {audio.name}
        </Text>
        <View style={styles.metaContainer}>
          <Text style={styles.duration}>{audio.duration}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.date}>{audio.date}</Text>
        </View>
      </View>
      {audio.analyzed ? (
        <View style={[
          styles.emotionBadge,
          { backgroundColor: `${getEmotionColor(audio.emotion)}15` }
        ]}>
          {getEmotionIcon(audio.emotion)}
          <Text style={[
            styles.emotionText,
            { color: getEmotionColor(audio.emotion) }
          ]}>
            {audio.emotion ? audio.emotion.charAt(0).toUpperCase() + audio.emotion.slice(1) : 'Unknown'}
          </Text>
        </View>
      ) : (
        <View style={styles.notAnalyzedBadge}>
          <Text style={styles.notAnalyzedText}>Not Analyzed</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    borderColor: '#007AFF',
    borderWidth: 1,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    marginBottom: 4,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8E8E93',
  },
  dot: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8E8E93',
    marginHorizontal: 4,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8E8E93',
  },
  emotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  emotionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  notAnalyzedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
    marginLeft: 8,
  },
  notAnalyzedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#8E8E93',
  },
});