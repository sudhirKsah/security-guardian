
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Mic, Upload, FilePlus } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import AudioRecordItem from '@/components/audio/AudioRecordItem';
import EmotionResultModal from '@/components/audio/EmotionResultModal';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { analyzeAudio } from '@/utils/api';

interface AudioRecord {
  id: string;
  name: string;
  duration: string;
  date: string;
  analyzed: boolean;
  emotion: string | null;
}

export default function AudioScreen() {
  const [audioRecords, setAudioRecords] = useState<AudioRecord[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<AudioRecord | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [micPermission, setMicPermission] = useState<string | null>(null);

  const handleRecordingComplete = async (uri: string) => {
    console.log('Recording completed:', uri);
    const newRecord: AudioRecord = {
      id: Date.now().toString(),
      name: `Recording ${audioRecords.length + 1}`,
      duration,
      date: new Date().toLocaleDateString(),
      analyzed: false,
      emotion: null,
    };
    setAudioRecords(prev => [newRecord, ...prev]);
    analyzeRecording(uri, newRecord);
  };

  const { isRecording, startRecording, stopRecording, duration, error } = useAudioRecorder({
    onRecordingComplete: handleRecordingComplete,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Recording Error', error);
    }
  }, [error]);

  useEffect(() => {
    // Request microphone permission on mount
    (async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        setMicPermission(status);
        console.log('Microphone permission:', status);
      } catch (err) {
        console.error('Permission request failed:', err);
      }
    })();
  }, []);

  const handleUpload = async () => {
    try {
      console.log('Starting file picker...');
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a', 'audio/aac', 'audio/ogg'], 
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log('Document picker result:', result);

      if (result.canceled) {
        console.log('File selection canceled');
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        console.log('No assets in result');
        Alert.alert('Error', 'No file was selected. Please try again.');
        return;
      }

      const asset = result.assets[0];
      console.log('Selected file:', {
        name: asset.name,
        uri: asset.uri,
        size: asset.size,
        mimeType: asset.mimeType
      });

      // Validate file size (max 10MB)
      if (asset.size && asset.size > 10 * 1024 * 1024) {
        Alert.alert('Error', 'File size exceeds 10MB limit.');
        return;
      }

      // Validate file exists and is accessible
      let fileInfo;
      try {
        fileInfo = await FileSystem.getInfoAsync(asset.uri);
        console.log('File info:', fileInfo);
        
        if (!fileInfo.exists) {
          throw new Error('File does not exist');
        }
      } catch (fileError) {
        console.error('File access error:', fileError);
        Alert.alert('Error', 'Selected file is not accessible. Please try selecting a different file.');
        return;
      }

      // Get duration using Audio.Sound
      let durationStr = '00:00';
      try {
        const sound = new Audio.Sound();
        await sound.loadAsync({ uri: asset.uri });
        const status = await sound.getStatusAsync();
        
        if ('isLoaded' in status && status.isLoaded && status.durationMillis) {
          const durationMillis = status.durationMillis;
          const minutes = Math.floor(durationMillis / 60000);
          const seconds = Math.floor((durationMillis % 60000) / 1000);
          durationStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        await sound.unloadAsync();
      } catch (audioError) {
        console.warn('Could not get audio duration:', audioError);
        // Continue without duration - not critical
      }

      const newRecord: AudioRecord = {
        id: Date.now().toString(),
        name: asset.name || 'Uploaded Audio',
        duration: durationStr,
        date: new Date().toLocaleDateString(),
        analyzed: false,
        emotion: null,
      };
      
      console.log('Adding new record:', newRecord);
      setAudioRecords(prev => [newRecord, ...prev]);
      
      // Start analysis
      analyzeRecording(asset.uri, newRecord);
      
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert(
        'Upload Error', 
        'Failed to upload audio file. Please ensure the file is a valid audio format and try again.\n\nError: ' + (err?.message || 'Unknown error')
      );
    }
  };

  const analyzeRecording = async (uri: string, record: AudioRecord) => {
    console.log('Starting analysis for:', uri);
    setIsAnalyzing(true);
    
    try {
      const analysis = await analyzeAudio(uri);
      console.log('Analysis completed:', analysis);
      
      setAudioRecords((prev) =>
        prev.map((item) =>
          item.id === record.id
            ? {
                ...item,
                analyzed: true,
                emotion: analysis.emotion,
              }
            : item
        )
      );
    } catch (err: any) {
      console.error('Analysis error:', err);
      Alert.alert(
        'Analysis Error', 
        `Failed to analyze audio: ${err.message || 'Unknown error'}\n\nPlease check your internet connection and try again.`
      );
      
      // Remove the failed record or mark it as failed
      setAudioRecords((prev) =>
        prev.map((item) =>
          item.id === record.id
            ? {
                ...item,
                analyzed: true,
                emotion: 'Analysis Failed',
              }
            : item
        )
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectAudio = (audio: AudioRecord) => {
    if (audio.analyzed && audio.emotion && audio.emotion !== 'Analysis Failed') {
      setSelectedAudio(audio);
      setIsModalVisible(true);
    } else if (audio.emotion === 'Analysis Failed') {
      Alert.alert('Analysis Failed', 'This audio analysis failed. Please try uploading again.');
    } else {
      Alert.alert('Not Analyzed', 'This audio has not been analyzed yet.');
    }
  };

  const handleRecord = async () => {
    if (micPermission !== 'granted') {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        setMicPermission(status);
        console.log('Requested microphone permission:', status);
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Microphone permission is required to record audio.');
          return;
        }
      } catch (err) {
        console.error('Permission request failed:', err);
        Alert.alert('Permission Error', 'Failed to request microphone permission.');
        return;
      }
    }

    try {
      if (isRecording) {
        await stopRecording();
      } else {
        await startRecording();
      }
    } catch (err) {
      console.error('Recording operation failed:', err);
      Alert.alert('Recording Error', 'Failed to start/stop recording. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voice Analysis</Text>
        <TouchableOpacity 
          style={styles.uploadButton} 
          onPress={handleUpload}
          disabled={isAnalyzing}
        >
          <Upload size={20} color={isAnalyzing ? "#8E8E93" : "#007AFF"} />
          <Text style={[styles.uploadButtonText, isAnalyzing && styles.disabledText]}>
            Upload Audio
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recordSection}>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.stopButton]}
          onPress={handleRecord}
          disabled={isAnalyzing}
        >
          {isRecording ? (
            <View style={styles.stopIcon}>
              <View style={styles.stopSquare} />
            </View>
          ) : (
            <Mic size={24} color="#FFFFFF" />
          )}
        </TouchableOpacity>
        <Text style={styles.durationText}>{duration}</Text>
        {isAnalyzing && (
          <View style={styles.analyzingIndicator}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.analyzingText}>Analyzing...</Text>
          </View>
        )}
      </View>

      {audioRecords.length === 0 ? (
        <View style={styles.emptyState}>
          <FilePlus size={40} color="#8E8E93" />
          <Text style={styles.emptyText}>No audio recordings yet</Text>
          <Text style={styles.emptySubtext}>
            Record or upload an audio file to analyze voice patterns.
          </Text>
        </View>
      ) : (
        <FlatList
          data={audioRecords}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AudioRecordItem
              audio={item}
              selected={selectedAudio?.id === item.id}
              onSelect={() => handleSelectAudio(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <EmotionResultModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedAudio(null);
        }}
        audio={selectedAudio}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    fontWeight: '600',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
  },
  uploadButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#007AFF',
    marginLeft: 6,
  },
  disabledText: {
    color: '#8E8E93',
  },
  recordSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
  recordButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stopButton: {
    backgroundColor: '#FF9500',
  },
  stopIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopSquare: {
    width: 16,
    height: 16,
    backgroundColor: '#FFFFFF',
  },
  durationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#3C3C43',
  },
  analyzingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  analyzingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginTop: 16,
    color: '#8E8E93',
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginTop: 8,
    color: '#8E8E93',
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
  },
});