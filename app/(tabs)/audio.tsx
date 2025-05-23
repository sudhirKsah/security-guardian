// import React, { useState } from 'react';
// import { 
//   StyleSheet, 
//   Text, 
//   View, 
//   TouchableOpacity, 
//   ScrollView,
//   ActivityIndicator,
//   Image
// } from 'react-native';
// import { Mic, Upload, Play, Pause, TriangleAlert as AlertTriangle, Info } from 'lucide-react-native';
// import AudioRecordItem from '@/components/audio/AudioRecordItem';
// import EmotionResultModal from '@/components/audio/EmotionResultModal';

// export default function AudioScreen() {
//   const [recording, setRecording] = useState(false);
//   const [analyzing, setAnalyzing] = useState(false);
//   const [selectedAudio, setSelectedAudio] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [audioRecords] = useState([
//     {
//       id: '1',
//       name: 'Unknown Caller (555-123-4567)',
//       duration: '1:42',
//       date: '2 hours ago',
//       analyzed: true,
//       emotion: 'stressed'
//     },
//     {
//       id: '2',
//       name: 'Bank Call (555-987-6543)',
//       duration: '3:18',
//       date: 'Yesterday',
//       analyzed: true,
//       emotion: 'suspicious'
//     },
//     {
//       id: '3',
//       name: 'Recorded Call',
//       duration: '0:58',
//       date: '3 days ago',
//       analyzed: false,
//       emotion: null
//     }
//   ]);

//   const handleSelectAudio = (audio) => {
//     setSelectedAudio(audio);
//     if (audio.analyzed) {
//       setModalVisible(true);
//     }
//   };

//   const handleAnalyzeAudio = () => {
//     if (!selectedAudio) return;
    
//     setAnalyzing(true);
    
//     // Simulate analysis with a timeout
//     setTimeout(() => {
//       setAnalyzing(false);
//       // Simulate updating the audio record
//       const updatedAudio = {...selectedAudio, analyzed: true, emotion: 'suspicious'};
//       setSelectedAudio(updatedAudio);
//       setModalVisible(true);
//     }, 2000);
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
//         <View style={styles.section}>
//           <View style={styles.sectionHeader}>
//             <Text style={styles.sectionTitle}>Voice Analysis</Text>
//             <TouchableOpacity style={styles.infoButton}>
//               <Info size={20} color="#007AFF" />
//             </TouchableOpacity>
//           </View>
//           <Text style={styles.description}>
//             Upload or record audio to analyze the emotional state of the speaker. 
//             This can help identify potential scams or suspicious calls.
//           </Text>
          
//           <View style={styles.uploadArea}>
//             <Image
//               source={{ uri: 'https://images.pexels.com/photos/3811816/pexels-photo-3811816.jpeg' }}
//               style={styles.uploadImage}
//             />
//             <Text style={styles.uploadTitle}>Upload Audio File</Text>
//             <Text style={styles.uploadDescription}>
//               Supported formats: MP3, WAV, M4A
//             </Text>
//             <TouchableOpacity style={styles.uploadButton}>
//               <Upload size={20} color="#FFFFFF" />
//               <Text style={styles.uploadButtonText}>Select File</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.divider} />

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Record Audio</Text>
          
//           <View style={styles.recordContainer}>
//             <TouchableOpacity 
//               style={[styles.recordButton, recording && styles.recordingActive]}
//               onPress={() => setRecording(!recording)}
//             >
//               <Mic size={32} color={recording ? "#FF3B30" : "#FFFFFF"} />
//             </TouchableOpacity>
//             <Text style={styles.recordText}>
//               {recording ? 'Recording... Tap to stop' : 'Tap to start recording'}
//             </Text>
//           </View>

//           {recording && (
//             <View style={styles.recordingInfo}>
//               <View style={styles.recordingDot} />
//               <Text style={styles.recordingTimer}>00:32</Text>
//             </View>
//           )}
//         </View>

//         <View style={styles.divider} />

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Recent Recordings</Text>
          
//           {audioRecords.map(audio => (
//             <AudioRecordItem 
//               key={audio.id} 
//               audio={audio}
//               selected={selectedAudio?.id === audio.id}
//               onSelect={() => handleSelectAudio(audio)}
//             />
//           ))}
//         </View>

//         {selectedAudio && (
//           <View style={styles.selectedAudioActions}>
//             <View style={styles.audioInfo}>
//               <Text style={styles.audioName} numberOfLines={1}>
//                 {selectedAudio.name}
//               </Text>
//               <Text style={styles.audioDuration}>{selectedAudio.duration}</Text>
//             </View>
            
//             <View style={styles.actionButtons}>
//               <TouchableOpacity style={styles.playButton}>
//                 <Play size={16} color="#FFFFFF" />
//                 <Text style={styles.actionButtonText}>Play</Text>
//               </TouchableOpacity>
              
//               {!selectedAudio.analyzed ? (
//                 <TouchableOpacity 
//                   style={styles.analyzeButton}
//                   onPress={handleAnalyzeAudio}
//                   disabled={analyzing}
//                 >
//                   {analyzing ? (
//                     <ActivityIndicator size="small" color="#FFFFFF" />
//                   ) : (
//                     <>
//                       <AlertTriangle size={16} color="#FFFFFF" />
//                       <Text style={styles.actionButtonText}>Analyze</Text>
//                     </>
//                   )}
//                 </TouchableOpacity>
//               ) : (
//                 <TouchableOpacity 
//                   style={styles.resultsButton}
//                   onPress={() => setModalVisible(true)}
//                 >
//                   <Info size={16} color="#FFFFFF" />
//                   <Text style={styles.actionButtonText}>View Results</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           </View>
//         )}
//       </ScrollView>

//       <EmotionResultModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         audio={selectedAudio}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F2F2F7',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   contentContainer: {
//     padding: 16,
//     paddingBottom: 100,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   sectionTitle: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 18,
//     color: '#000000',
//   },
//   infoButton: {
//     padding: 4,
//   },
//   description: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 14,
//     color: '#3C3C43',
//     marginBottom: 16,
//     lineHeight: 20,
//   },
//   uploadArea: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 20,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   uploadImage: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginBottom: 16,
//   },
//   uploadTitle: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 16,
//     color: '#000000',
//     marginBottom: 8,
//   },
//   uploadDescription: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 14,
//     color: '#8E8E93',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   uploadButton: {
//     backgroundColor: '#007AFF',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 12,
//   },
//   uploadButtonText: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 15,
//     color: '#FFFFFF',
//     marginLeft: 8,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#C6C6C8',
//     marginVertical: 16,
//     opacity: 0.3,
//   },
//   recordContainer: {
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   recordButton: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   recordingActive: {
//     backgroundColor: '#FF3B30',
//   },
//   recordText: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 15,
//     color: '#3C3C43',
//   },
//   recordingInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 16,
//   },
//   recordingDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#FF3B30',
//     marginRight: 8,
//   },
//   recordingTimer: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 15,
//     color: '#FF3B30',
//   },
//   selectedAudioActions: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: '#FFFFFF',
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(0,0,0,0.1)',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   audioInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   audioName: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 16,
//     color: '#000000',
//     flex: 1,
//   },
//   audioDuration: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 14,
//     color: '#8E8E93',
//     marginLeft: 8,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   playButton: {
//     backgroundColor: '#34C759',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     flex: 1,
//     marginRight: 8,
//   },
//   analyzeButton: {
//     backgroundColor: '#FF9500',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     flex: 1,
//     marginLeft: 8,
//   },
//   resultsButton: {
//     backgroundColor: '#007AFF',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     flex: 1,
//     marginLeft: 8,
//   },
//   actionButtonText: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 15,
//     color: '#FFFFFF',
//     marginLeft: 8,
//   },
// });









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
import { Mic, Upload, FilePlus, AlertTriangle } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import AudioRecordItem from '@/components/audio/AudioRecordItem';
import EmotionResultModal from '@/components/audio/EmotionResultModal';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { usePermissions } from '@/hooks/usePermissions';
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
  const { permissionStatus, requestMicrophonePermission, requestStoragePermission } = usePermissions();
  const handleRecordingComplete = async (uri: string) => {
    const newRecord: AudioRecord = {
      id: Date.now().toString(),
      name: `Recording ${audioRecords.length + 1}`,
      duration,
      date: new Date().toLocaleDateString(),
      analyzed: false,
      emotion: null,
    };
    setAudioRecords([newRecord, ...audioRecords]);
    analyzeRecording(uri, newRecord);
  };

  const { isRecording, startRecording, stopRecording, duration, error } = useAudioRecorder({
    onRecordingComplete: handleRecordingComplete,
  });
  const [audioRecords, setAudioRecords] = useState<AudioRecord[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<AudioRecord | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const handleUpload = async () => {
    if (permissionStatus.storage !== 'granted') {
      await requestStoragePermission();
      if (permissionStatus.storage !== 'granted') {
        Alert.alert('Permission Denied', 'Storage permission is required to upload audio files.');
        return;
      }
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      const newRecord: AudioRecord = {
        id: Date.now().toString(),
        name: asset.name,
        duration: '00:00', // Duration not available for uploaded files
        date: new Date().toLocaleDateString(),
        analyzed: false,
        emotion: null,
      };
      setAudioRecords([newRecord, ...audioRecords]);
      analyzeRecording(asset.uri, newRecord);
    } catch (err) {
      Alert.alert('Error', 'Failed to upload audio file');
      console.error('Upload error:', err);
    }
  };

  const analyzeRecording = async (uri: string, record: AudioRecord) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeAudio(uri);
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
    } catch (err) {
      Alert.alert('Error', 'Failed to analyze audio');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectAudio = (audio: AudioRecord) => {
    if (audio.analyzed) {
      setSelectedAudio(audio);
      setIsModalVisible(true);
    } else {
      Alert.alert('Not Analyzed', 'This audio has not been analyzed yet.');
    }
  };

  const handleRecord = async () => {
    if (permissionStatus.microphone !== 'granted') {
      await requestMicrophonePermission();
      if (permissionStatus.microphone !== 'granted') {
        Alert.alert('Permission Denied', 'Microphone permission is required to record audio.');
        return;
      }
    }

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voice Analysis</Text>
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
          <Upload size={20} color="#007AFF" />
          <Text style={styles.uploadButtonText}>Upload Audio</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recordSection}>
        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.stopButton]}
          onPress={handleRecord}
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