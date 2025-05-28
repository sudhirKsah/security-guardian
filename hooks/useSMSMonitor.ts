
import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { startReadSMS } from '@maniac-tech/react-native-expo-read-sms';
import { analyzeSMS } from '@/utils/api';

interface SMSMonitorResult {
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  scanMessage: (sender: string, message: string) => Promise<void>;
  lastDetection: {
    sender: string;
    message: string;
    isMalicious: boolean;
    type?: string;
    details?: string;
  } | null;
}

export function useSMSMonitor(): SMSMonitorResult {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastDetection, setLastDetection] = useState<{
    sender: string;
    message: string;
    isMalicious: boolean;
    type?: string;
    details?: string;
  } | null>(null);

  const onSMSReceived = useCallback(async (sender: string, message: string) => {
    console.log('Received SMS:', { sender, message });
    try {
      const analysis = await analyzeSMS(message);
      console.log('SMS Analysis Result:', analysis);
      setLastDetection({
        sender,
        message,
        isMalicious: analysis.isMalicious,
        type: analysis.type,
        details: analysis.details,
      });
    } catch (error) {
      console.error('Error analyzing SMS:', error);
      setLastDetection({
        sender,
        message,
        isMalicious: false,
        details: 'Failed to analyze message',
      });
    }
  }, []);

  const startMonitoring = useCallback(() => {
    if (Platform.OS === 'android') {
      console.log('Starting SMS monitoring...');
      startReadSMS(
        (status: string, sms: [string, string], error?: string) => {
          if (status === 'success' && sms) {
            const [sender, message] = sms;
            onSMSReceived(sender, message);
          } else {
            console.log('SMS monitoring status:', status, error);
          }
        },
        (status: string, sms?: [string, string], error?: string) => {
          console.error('Error reading SMS:', status, error);
        }
      );
      setIsMonitoring(true);
    } else {
      console.log('SMS monitoring is not available on this platform');
      setIsMonitoring(false);
    }
  }, [onSMSReceived]);

  const stopMonitoring = useCallback(() => {
    console.log('Stopping SMS monitoring...');
    setIsMonitoring(false);
  }, []);

  const scanMessage = useCallback(async (sender: string, message: string) => {
    console.log('Manually scanning message:', { sender, message });
    await onSMSReceived(sender, message);
  }, [onSMSReceived]);

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    scanMessage,
    lastDetection,
  };
}