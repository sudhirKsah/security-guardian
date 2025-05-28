
import { useState, useEffect, useCallback } from 'react';
import * as Clipboard from 'expo-clipboard';
import { Platform } from 'react-native';
import { analyzeURL, analyzeSMS } from '@/utils/api';

interface ClipboardMonitorResult {
  isMonitoring: boolean;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  lastDetection: {
    content: string;
    isMalicious: boolean;
    type?: string;
    details?: string;
  } | null;
}

export function useClipboardMonitor(): ClipboardMonitorResult {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastDetection, setLastDetection] = useState<{
    content: string;
    isMalicious: boolean;
    type?: string;
    details?: string;
  } | null>(null);
  const [monitorInterval, setMonitorInterval] = useState<NodeJS.Timeout | null>(null);
  const [lastContent, setLastContent] = useState<string | null>(null);

  const checkClipboard = useCallback(async () => {
    try {
      const content = await Clipboard.getStringAsync();
      if (!content || content === lastContent) return; // Skip if no content or unchanged

      setLastContent(content);

      // Check if the content is a URL
      const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/;
      if (urlRegex.test(content)) {
        const analysis = await analyzeURL(content);
        setLastDetection({
          content,
          isMalicious: analysis.isMalicious,
          type: analysis.type,
          details: analysis.details,
        });
      } else {
        // Analyze as text (might still contain URLs)
        const analysis = await analyzeSMS(content);
        setLastDetection({
          content,
          isMalicious: analysis.isMalicious,
          type: analysis.type,
          details: analysis.details,
        });
      }
    } catch (error) {
      console.error('Error checking clipboard:', error);
    }
  }, [lastContent]);

  const startMonitoring = useCallback(() => {
    if (Platform.OS === 'web') {
      // Web platform: Listen for copy events
      const handler = () => {
        checkClipboard();
      };
      document.addEventListener('copy', handler);
      document.addEventListener('cut', handler);
      setIsMonitoring(true);
      return () => {
        document.removeEventListener('copy', handler);
        document.removeEventListener('cut', handler);
      };
    } else {
      // Mobile: Poll the clipboard every 2 seconds
      checkClipboard(); // Initial check
      const interval = setInterval(checkClipboard, 2000);
      setMonitorInterval(interval);
      setIsMonitoring(true);
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [checkClipboard]);

  const stopMonitoring = useCallback(() => {
    if (Platform.OS === 'web') {
      // Web cleanup handled in startMonitoring return
    } else if (monitorInterval) {
      clearInterval(monitorInterval);
      setMonitorInterval(null);
    }
    setIsMonitoring(false);
    setLastContent(null);
  }, [monitorInterval]);

  useEffect(() => {
    return () => {
      if (monitorInterval) {
        clearInterval(monitorInterval);
      }
    };
  }, [monitorInterval]);

  return {
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    lastDetection,
  };
}