
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Dimensions,
} from 'react-native';
import { MessageSquare, Scan, Lock } from 'lucide-react-native';
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const messageInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const checkPermissionsAndStartMonitoring = async () => {
      if (Platform.OS !== 'android') return;

      if (permissionStatus.sms === 'undetermined' || permissionStatus.sms === 'denied') {
        const granted = await requestSMSPermission();
        if (!granted) {
          Alert.alert(
            'Permission Required',
            'SMS permissions are required to monitor incoming messages for potential threats.',
            [{ text: 'OK' }]
          );
        }
      }
      if (permissionStatus.sms === 'granted') {
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

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
      // Scroll to the message input when keyboard appears
      setTimeout(() => {
        messageInputRef.current?.measure((x, y, width, height, pageX, pageY) => {
          scrollViewRef.current?.scrollTo({ y: pageY + height, animated: true });
        });
      }, 100);
    });

    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  const handleScanMessage = async () => {
    if (!senderInput || !messageInput) {
      Alert.alert('Error', 'Please enter both sender and message content.');
      return;
    }

    await scanMessage(senderInput, messageInput);
    setSenderInput('');
    setMessageInput('');
    Keyboard.dismiss();
  };

  const handleRequestPermission = async () => {
    const granted = await requestSMSPermission();
    if (granted) {
      startMonitoring();
    } else {
      Alert.alert(
        'Permission Denied',
        'SMS permissions are required to monitor incoming messages. Please grant permissions to proceed.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Message Scanner</Text>
      </View>

      {Platform.OS === 'android' && (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionHeader}>Permission Status</Text>
          <View style={styles.permissionRow}>
            <Text style={styles.permissionLabel}>READ_SMS:</Text>
            <Text style={styles.permissionValue}>
              {permissionStatus.hasReadSmsPermission ? 'Granted' : 'Denied'}
            </Text>
          </View>
          <View style={styles.permissionRow}>
            <Text style={styles.permissionLabel}>RECEIVE_SMS:</Text>
            <Text style={styles.permissionValue}>
              {permissionStatus.hasReceiveSmsPermission ? 'Granted' : 'Denied'}
            </Text>
          </View>
          {(!permissionStatus.hasReadSmsPermission || !permissionStatus.hasReceiveSmsPermission) && (
            <TouchableOpacity style={styles.permissionButton} onPress={handleRequestPermission}>
              <Lock size={20} color="#FFFFFF" />
              <Text style={styles.permissionButtonText}>Grant SMS Permission</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {(Platform.OS !== 'android' || (Platform.OS === 'android' && permissionStatus.sms !== 'granted')) && (
          <View style={[styles.inputContainer, { paddingBottom: keyboardHeight }]}>
            <TextInput
              style={styles.input}
              placeholder="Sender (e.g., number or name)"
              value={senderInput}
              onChangeText={setSenderInput}
            />
            <TextInput
              ref={messageInputRef}
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
      </ScrollView>

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
          keyboardShouldPersistTaps="handled"
        />
      )}
    </KeyboardAvoidingView>
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
  permissionContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  permissionHeader: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 12,
  },
  permissionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  permissionLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#3C3C43',
  },
  permissionValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#3C3C43',
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  permissionButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  scrollContainer: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: 20,
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
    paddingBottom: 20,
  },
});