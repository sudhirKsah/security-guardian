
import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { checkIfHasSMSPermission, requestReadSMSPermission } from '@maniac-tech/react-native-expo-read-sms';

type PermissionStatus = 'granted' | 'denied' | 'never_ask_again' | 'unavailable' | 'undetermined';

interface PermissionStatuses {
  clipboard: PermissionStatus;
  sms: PermissionStatus;
  storage: PermissionStatus;
  microphone: PermissionStatus;
  hasReadSmsPermission: boolean;
  hasReceiveSmsPermission: boolean;
}

export function usePermissions() {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatuses>({
    clipboard: 'undetermined',
    sms: 'undetermined',
    storage: 'undetermined',
    microphone: 'undetermined',
    hasReadSmsPermission: false,
    hasReceiveSmsPermission: false,
  });

  const checkClipboardPermission = async (): Promise<PermissionStatus> => {
    if (Platform.OS === 'web') {
      try {
        const result = await (navigator as any).permissions.query({ name: 'clipboard-read' });
        return result.state as PermissionStatus;
      } catch {
        return 'unavailable';
      }
    }
    return 'granted'; // mobile platforms assume access
  };

  const checkSMSPermission = async (): Promise<PermissionStatus> => {
    if (Platform.OS === 'web' || Platform.OS === 'ios') return 'unavailable';

    try {
      const { hasReceiveSmsPermission, hasReadSmsPermission } = await checkIfHasSMSPermission();
      setPermissionStatus(prev => ({
        ...prev,
        hasReadSmsPermission,
        hasReceiveSmsPermission,
      }));
      return (hasReceiveSmsPermission && hasReadSmsPermission) ? 'granted' : 'denied';
    } catch (error) {
      console.error('Error checking SMS permissions:', error);
      return 'unavailable';
    }
  };

  const checkStoragePermission = async (): Promise<PermissionStatus> => {
    if (Platform.OS === 'web') {
      try {
        const result = await (navigator as any).permissions.query({ name: 'persistent-storage' });
        return result.state as PermissionStatus;
      } catch {
        return 'unavailable';
      }
    }

    try {
      const result = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      return result.granted ? 'granted' : 'denied';
    } catch {
      return 'unavailable';
    }
  };

  const checkMicrophonePermission = async (): Promise<PermissionStatus> => {
    if (Platform.OS === 'web') {
      try {
        const result = await (navigator as any).permissions.query({ name: 'microphone' });
        return result.state as PermissionStatus;
      } catch {
        return 'unavailable';
      }
    }

    try {
      const { status } = await Audio.getPermissionsAsync();
      return status as PermissionStatus;
    } catch {
      return 'unavailable';
    }
  };

  const checkAllPermissions = useCallback(async () => {
    const [clipboard, sms, storage, microphone] = await Promise.all([
      checkClipboardPermission(),
      checkSMSPermission(),
      checkStoragePermission(),
      checkMicrophonePermission(),
    ]);

    setPermissionStatus(prev => ({
      ...prev,
      clipboard,
      sms,
      storage,
      microphone,
    }));
  }, []);

  const requestClipboardPermission = async () => {
    if (Platform.OS === 'web') {
      try {
        const result = await (navigator as any).permissions.query({ name: 'clipboard-read' });
        setPermissionStatus(prev => ({ ...prev, clipboard: result.state as PermissionStatus }));
      } catch {
        setPermissionStatus(prev => ({ ...prev, clipboard: 'unavailable' }));
      }
    } else {
      setPermissionStatus(prev => ({ ...prev, clipboard: 'granted' }));
    }
  };

  const requestSMSPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'web' || Platform.OS === 'ios') {
      setPermissionStatus(prev => ({ ...prev, sms: 'unavailable' }));
      return false;
    }

    try {
      const granted = await requestReadSMSPermission();
      const { hasReceiveSmsPermission, hasReadSmsPermission } = await checkIfHasSMSPermission();
      setPermissionStatus(prev => ({
        ...prev,
        sms: granted ? 'granted' : 'denied',
        hasReadSmsPermission,
        hasReceiveSmsPermission,
      }));
      return granted;
    } catch (error) {
      console.error('Error requesting SMS permissions:', error);
      setPermissionStatus(prev => ({ ...prev, sms: 'unavailable' }));
      return false;
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'web') {
      try {
        const result = await (navigator as any).permissions.query({ name: 'persistent-storage' });
        setPermissionStatus(prev => ({ ...prev, storage: result.state as PermissionStatus }));
      } catch {
        setPermissionStatus(prev => ({ ...prev, storage: 'unavailable' }));
      }
    } else {
      try {
        const result = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        setPermissionStatus(prev => ({ ...prev, storage: result.granted ? 'granted' : 'denied' }));
      } catch {
        setPermissionStatus(prev => ({ ...prev, storage: 'unavailable' }));
      }
    }
  };

  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'web') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setPermissionStatus(prev => ({ ...prev, microphone: 'granted' }));
      } catch {
        setPermissionStatus(prev => ({ ...prev, microphone: 'denied' }));
      }
    } else {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        setPermissionStatus(prev => ({ ...prev, microphone: status as PermissionStatus }));
      } catch {
        setPermissionStatus(prev => ({ ...prev, microphone: 'unavailable' }));
      }
    }
  };

  const requestAllPermissions = useCallback(async () => {
    await Promise.all([
      requestClipboardPermission(),
      requestSMSPermission(),
      requestStoragePermission(),
      requestMicrophonePermission(),
    ]);
  }, []);

  useEffect(() => {
    checkAllPermissions();
  }, [checkAllPermissions]);

  return {
    permissionStatus,
    requestClipboardPermission,
    requestSMSPermission,
    requestStoragePermission,
    requestMicrophonePermission,
    requestAllPermissions,
  };
}
