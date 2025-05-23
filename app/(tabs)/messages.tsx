// import React, { useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   Switch,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import { MessageSquare, TriangleAlert as AlertTriangle, MessageCircle, Shield, Info } from 'lucide-react-native';
// import MessageItem from '@/components/messages/MessageItem';
// import { usePermissions } from '@/hooks/usePermissions';

// export default function MessagesScreen() {
//   const [scanningEnabled, setScanningEnabled] = useState(false);
//   const [scanning, setScanning] = useState(false);
//   const [messages] = useState([
//     {
//       id: '1',
//       sender: '+1 555-123-4567',
//       content: 'Your account has been locked. Click on http://secure-bank-verify.com to verify your identity and restore access.',
//       timestamp: new Date(Date.now() - 1000 * 60 * 30),
//       isMalicious: true,
//       maliciousType: 'phishing',
//       source: 'SMS',
//     },
//     {
//       id: '2',
//       sender: 'WhatsApp: John',
//       content: 'Hey, check out this great deal! You won a free iPhone, claim it here: prize-claim-center.com',
//       timestamp: new Date(Date.now() - 1000 * 60 * 120),
//       isMalicious: true,
//       maliciousType: 'scam',
//       source: 'WhatsApp',
//     },
//     {
//       id: '3',
//       sender: '+1 555-987-6543',
//       content: 'Your verification code is 153782. This code expires in 10 minutes.',
//       timestamp: new Date(Date.now() - 1000 * 60 * 240),
//       isMalicious: false,
//       source: 'SMS',
//     },
//     {
//       id: '4',
//       sender: 'WhatsApp: Team Group',
//       content: 'Meeting tomorrow at 10am. Please prepare your presentation.',
//       timestamp: new Date(Date.now() - 1000 * 60 * 300),
//       isMalicious: false,
//       source: 'WhatsApp',
//     },
//   ]);
//   const { permissionStatus, requestSMSPermission } = usePermissions();

//   const toggleScanning = () => {
//     if (!scanningEnabled && permissionStatus.sms !== 'granted') {
//       requestSMSPermission();
//       return;
//     }
    
//     setScanningEnabled(!scanningEnabled);
//   };

//   const handleScanNow = () => {
//     setScanning(true);
    
//     // Simulate scanning process
//     setTimeout(() => {
//       setScanning(false);
//     }, 2000);
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
//         <View style={styles.header}>
//           <View style={styles.scanningStatus}>
//             <View style={[
//               styles.statusIndicator, 
//               scanningEnabled ? styles.statusActive : styles.statusInactive
//             ]} />
//             <Text style={styles.scanningText}>
//               {scanningEnabled ? 'Automatic Scanning Active' : 'Automatic Scanning Inactive'}
//             </Text>
//           </View>
//           <Switch
//             value={scanningEnabled}
//             onValueChange={toggleScanning}
//             trackColor={{ false: '#D1D1D6', true: '#34C759' }}
//             thumbColor="#FFFFFF"
//             ios_backgroundColor="#D1D1D6"
//           />
//         </View>

//         <View style={styles.infoCard}>
//           <MessageSquare size={22} color="#007AFF" style={styles.infoIcon} />
//           <View style={styles.infoContent}>
//             <Text style={styles.infoTitle}>Message Protection</Text>
//             <Text style={styles.infoDescription}>
//               When enabled, SMS and WhatsApp messages will be automatically
//               scanned for phishing links, scams, and other malicious content.
//             </Text>
//           </View>
//         </View>

//         {permissionStatus.sms !== 'granted' && (
//           <View style={styles.permissionWarning}>
//             <AlertTriangle size={20} color="#FF9500" />
//             <Text style={styles.permissionWarningText}>
//               SMS permission is required to enable message scanning.
//             </Text>
//             <TouchableOpacity 
//               style={styles.permissionButton}
//               onPress={requestSMSPermission}
//             >
//               <Text style={styles.permissionButtonText}>Grant</Text>
//             </TouchableOpacity>
//           </View>
//         )}

//         <View style={styles.actionsContainer}>
//           <TouchableOpacity 
//             style={styles.scanButton}
//             onPress={handleScanNow}
//             disabled={scanning}
//           >
//             {scanning ? (
//               <ActivityIndicator size="small" color="#FFFFFF" />
//             ) : (
//               <>
//                 <Shield size={18} color="#FFFFFF" />
//                 <Text style={styles.scanButtonText}>Scan Messages Now</Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Recent Messages</Text>
//           <Text style={styles.sectionDescription}>
//             Messages that have been scanned for malicious content
//           </Text>

//           <View style={styles.filterTabs}>
//             <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
//               <Text style={styles.filterTabTextActive}>All</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.filterTab}>
//               <Text style={styles.filterTabText}>Malicious</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.filterTab}>
//               <Text style={styles.filterTabText}>Safe</Text>
//             </TouchableOpacity>
//           </View>

//           {messages.length > 0 ? (
//             <View style={styles.messagesList}>
//               {messages.map((message) => (
//                 <MessageItem key={message.id} message={message} />
//               ))}
//             </View>
//           ) : (
//             <View style={styles.emptyState}>
//               <Text style={styles.emptyStateText}>
//                 No messages have been scanned yet
//               </Text>
//             </View>
//           )}
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Supported Message Types</Text>
          
//           <View style={styles.featureCard}>
//             <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
//               <MessageSquare size={20} color="#34C759" />
//             </View>
//             <View style={styles.featureContent}>
//               <Text style={styles.featureTitle}>SMS Messages</Text>
//               <Text style={styles.featureDescription}>
//                 Scans text messages for phishing links and fraud attempts
//               </Text>
//             </View>
//           </View>
          
//           <View style={styles.featureCard}>
//             <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
//               <MessageCircle size={20} color="#007AFF" />
//             </View>
//             <View style={styles.featureContent}>
//               <Text style={styles.featureTitle}>WhatsApp Messages</Text>
//               <Text style={styles.featureDescription}>
//                 Monitors WhatsApp for scams and malicious content
//               </Text>
//             </View>
//           </View>
          
//           <View style={styles.tipContainer}>
//             <View style={styles.tipIconContainer}>
//               <Info size={20} color="#FF9500" />
//             </View>
//             <View style={styles.tipContent}>
//               <Text style={styles.tipTitle}>Security Tip</Text>
//               <Text style={styles.tipText}>
//                 Never click on links in messages asking for personal information or claiming
//                 you've won something unexpected.
//               </Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
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
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#FFFFFF',
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   scanningStatus: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusIndicator: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     marginRight: 8,
//   },
//   statusActive: {
//     backgroundColor: '#34C759',
//   },
//   statusInactive: {
//     backgroundColor: '#8E8E93',
//   },
//   scanningText: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 16,
//   },
//   infoCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     flexDirection: 'row',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   infoIcon: {
//     marginRight: 12,
//   },
//   infoContent: {
//     flex: 1,
//   },
//   infoTitle: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   infoDescription: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 14,
//     color: '#3C3C43',
//     lineHeight: 20,
//   },
//   permissionWarning: {
//     backgroundColor: 'rgba(255, 149, 0, 0.1)',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   permissionWarningText: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 14,
//     color: '#3C3C43',
//     flex: 1,
//     marginLeft: 8,
//     marginRight: 8,
//   },
//   permissionButton: {
//     backgroundColor: '#FF9500',
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//   },
//   permissionButtonText: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 14,
//     color: '#FFFFFF',
//   },
//   actionsContainer: {
//     marginBottom: 16,
//   },
//   scanButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },
//   scanButtonText: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 16,
//     color: '#FFFFFF',
//     marginLeft: 8,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 18,
//     marginBottom: 8,
//   },
//   sectionDescription: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 14,
//     color: '#8E8E93',
//     marginBottom: 16,
//   },
//   filterTabs: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   filterTab: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 16,
//     marginRight: 8,
//   },
//   filterTabActive: {
//     backgroundColor: 'rgba(0, 122, 255, 0.1)',
//   },
//   filterTabText: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 14,
//     color: '#8E8E93',
//   },
//   filterTabTextActive: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 14,
//     color: '#007AFF',
//   },
//   messagesList: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   emptyState: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   emptyStateText: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 16,
//     color: '#8E8E93',
//   },
//   featureCard: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     flexDirection: 'row',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   featureIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   featureContent: {
//     flex: 1,
//   },
//   featureTitle: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   featureDescription: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 14,
//     color: '#3C3C43',
//   },
//   tipContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 8,
//     flexDirection: 'row',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   tipIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255, 149, 0, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   tipContent: {
//     flex: 1,
//   },
//   tipTitle: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   tipText: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 14,
//     color: '#3C3C43',
//     lineHeight: 20,
//   },
// });












import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { MessageSquare, Scan } from 'lucide-react-native';
import MessageItem from '@/components/messages/MessageItem';
import { usePermissions } from '@/hooks/usePermissions';
import { useSMSMonitor } from '@/hooks/useSMSMonitor';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isMalicious: boolean;
  maliciousType?: string;
  source: 'SMS' | 'WhatsApp';
}

export default function MessagesScreen() {
  const { permissionStatus, requestSMSPermission } = usePermissions();
  const { isMonitoring, startMonitoring, scanMessage, lastDetection } = useSMSMonitor();
  const [messages, setMessages] = useState<Message[]>([]);
  const [senderInput, setSenderInput] = useState('');
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    const checkPermissionsAndStartMonitoring = async () => {
      if (permissionStatus.sms === 'undetermined' || permissionStatus.sms === 'denied') {
        await requestSMSPermission();
      }
      if (permissionStatus.sms === 'granted' && Platform.OS === 'android') {
        startMonitoring();
      }
    };
    checkPermissionsAndStartMonitoring();
  }, [permissionStatus.sms, requestSMSPermission, startMonitoring]);

  useEffect(() => {
    if (lastDetection) {
      setMessages((prev) => [
        {
          id: Date.now().toString(),
          sender: lastDetection.sender,
          content: lastDetection.message,
          timestamp: new Date(),
          isMalicious: lastDetection.isMalicious,
          maliciousType: lastDetection.type,
          source: 'SMS',
        },
        ...prev,
      ]);
    }
  }, [lastDetection]);

  const handleScanMessage = async () => {
    if (!senderInput || !messageInput) {
      Alert.alert('Error', 'Please enter both sender and message content.');
      return;
    }

    await scanMessage(senderInput, messageInput);
    setSenderInput('');
    setMessageInput('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Message Scanner</Text>
      </View>

      {(Platform.OS !== 'android' || permissionStatus.sms !== 'granted') && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Sender (e.g., number or name)"
            value={senderInput}
            onChangeText={setSenderInput}
          />
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Paste message content here"
            value={messageInput}
            onChangeText={setMessageInput}
            multiline
          />
          <TouchableOpacity style={styles.scanButton} onPress={handleScanMessage}>
            <Scan size={20} color="#FFFFFF" />
            <Text style={styles.scanButtonText}>Scan Message</Text>
          </TouchableOpacity>
        </View>
      )}

      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <MessageSquare size={40} color="#8E8E93" />
          <Text style={styles.emptyText}>No messages scanned yet</Text>
          <Text style={styles.emptySubtext}>
            {Platform.OS === 'android' && permissionStatus.sms === 'granted'
              ? 'Waiting for incoming SMS messages...'
              : 'Paste a message above to scan for potential threats.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageItem message={item} />}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
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
  inputContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 12,
  },
  scanButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
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
