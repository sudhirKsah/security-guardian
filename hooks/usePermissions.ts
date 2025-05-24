// import { useState, useEffect, useCallback } from 'react';
// import { Platform, Alert } from 'react-native';

// type PermissionStatus = 'granted' | 'denied' | 'never_ask_again' | 'unavailable' | 'undetermined';

// interface PermissionStatuses {
//   clipboard: PermissionStatus;
//   sms: PermissionStatus;
//   storage: PermissionStatus;
//   camera: PermissionStatus;
//   microphone: PermissionStatus;
// }

// export function usePermissions() {
//   const [permissionStatus, setPermissionStatus] = useState<PermissionStatuses>({
//     clipboard: 'undetermined',
//     sms: 'undetermined',
//     storage: 'undetermined',
//     camera: 'undetermined',
//     microphone: 'undetermined',
//   });

//   useEffect(() => {
//     // Check initial permissions on component mount
//     checkAllPermissions();
//   }, []);

//   const checkAllPermissions = useCallback(async () => {
//     // This would be replaced with actual permission checks
//     // For now, we'll just simulate permission checks
    
//     if (Platform.OS === 'web') {
//       // On web, some permissions may not be available or work differently
//       setPermissionStatus({
//         clipboard: 'granted', // Web has clipboard API available without explicit permission
//         sms: 'unavailable', // SMS API is not available on web
//         storage: 'unavailable', // File system access is limited on web
//         camera: 'undetermined', // Camera requires user action
//         microphone: 'undetermined', // Microphone requires user action
//       });
//     } else {
//       // For native platforms, we'd use the Permissions API
//       // Since this is a placeholder, we'll set everything as undetermined
//       setPermissionStatus({
//         clipboard: 'undetermined',
//         sms: 'undetermined',
//         storage: 'undetermined',
//         camera: 'undetermined',
//         microphone: 'undetermined',
//       });
//     }
//   }, []);

//   const requestClipboardPermission = useCallback(async () => {
//     // This would be replaced with an actual permission request
//     // For now, we'll just simulate a permission request

//     if (Platform.OS === 'web') {
//       setPermissionStatus(prev => ({ ...prev, clipboard: 'granted' }));
//     } else {
//       // Simulate a successful permission request
//       Alert.alert(
//         'Permission Required',
//         'Security Guardian needs access to your clipboard to detect malicious content.',
//         [
//           { 
//             text: 'Cancel', 
//             style: 'cancel' 
//           },
//           {
//             text: 'Allow',
//             onPress: () => {
//               setPermissionStatus(prev => ({ ...prev, clipboard: 'granted' }));
//             }
//           }
//         ]
//       );
//     }
//   }, []);

//   const requestSMSPermission = useCallback(async () => {
//     // This would be replaced with an actual permission request
//     // For now, we'll just simulate a permission request

//     if (Platform.OS === 'web') {
//       setPermissionStatus(prev => ({ ...prev, sms: 'unavailable' }));
//       Alert.alert(
//         'Unavailable on Web',
//         'SMS scanning is not available on web platforms. Please use the mobile app for this feature.',
//         [{ text: 'OK' }]
//       );
//     } else {
//       // Simulate a successful permission request
//       Alert.alert(
//         'Permission Required',
//         'Security Guardian needs access to your SMS messages to detect malicious content.',
//         [
//           { 
//             text: 'Cancel', 
//             style: 'cancel' 
//           },
//           {
//             text: 'Allow',
//             onPress: () => {
//               setPermissionStatus(prev => ({ ...prev, sms: 'granted' }));
//             }
//           }
//         ]
//       );
//     }
//   }, []);

//   const requestStoragePermission = useCallback(async () => {
//     // This would be replaced with an actual permission request
//     // For now, we'll just simulate a permission request

//     if (Platform.OS === 'web') {
//       setPermissionStatus(prev => ({ ...prev, storage: 'unavailable' }));
//     } else {
//       // Simulate a successful permission request
//       Alert.alert(
//         'Permission Required',
//         'Security Guardian needs access to your storage to save and analyze audio files.',
//         [
//           { 
//             text: 'Cancel', 
//             style: 'cancel' 
//           },
//           {
//             text: 'Allow',
//             onPress: () => {
//               setPermissionStatus(prev => ({ ...prev, storage: 'granted' }));
//             }
//           }
//         ]
//       );
//     }
//   }, []);

//   const requestCameraPermission = useCallback(async () => {
//     // This would be replaced with an actual permission request
//     // For now, we'll just simulate a permission request

//     Alert.alert(
//       'Permission Required',
//       'Security Guardian needs access to your camera.',
//       [
//         { 
//           text: 'Cancel', 
//           style: 'cancel' 
//         },
//         {
//           text: 'Allow',
//           onPress: () => {
//             setPermissionStatus(prev => ({ ...prev, camera: 'granted' }));
//           }
//         }
//       ]
//     );
//   }, []);

//   const requestMicrophonePermission = useCallback(async () => {
//     // This would be replaced with an actual permission request
//     // For now, we'll just simulate a permission request

//     Alert.alert(
//       'Permission Required',
//       'Security Guardian needs access to your microphone to record audio for analysis.',
//       [
//         { 
//           text: 'Cancel', 
//           style: 'cancel' 
//         },
//         {
//           text: 'Allow',
//           onPress: () => {
//             setPermissionStatus(prev => ({ ...prev, microphone: 'granted' }));
//           }
//         }
//       ]
//     );
//   }, []);

//   const requestAllPermissions = useCallback(async () => {
//     // Request all permissions in sequence
//     await requestClipboardPermission();
//     await requestSMSPermission();
//     await requestStoragePermission();
//     await requestCameraPermission();
//     await requestMicrophonePermission();
//   }, [
//     requestClipboardPermission,
//     requestSMSPermission,
//     requestStoragePermission,
//     requestCameraPermission,
//     requestMicrophonePermission
//   ]);

//   return {
//     permissionStatus,
//     requestClipboardPermission,
//     requestSMSPermission,
//     requestStoragePermission,
//     requestCameraPermission,
//     requestMicrophonePermission,
//     requestAllPermissions,
//   };
// }













// import { useState, useEffect, useCallback } from 'react';
// import { Platform } from 'react-native';
// import * as Clipboard from 'expo-clipboard';
// import * as SMS from 'expo-sms';
// import * as FileSystem from 'expo-file-system';
// import { Audio } from 'expo-av';
// import { checkIfHasSMSPermission, requestReadSMSPermission } from '@maniac-tech/react-native-expo-read-sms';

// type PermissionStatus = 'granted' | 'denied' | 'never_ask_again' | 'unavailable' | 'undetermined';

// interface PermissionStatuses {
//   clipboard: PermissionStatus;
//   sms: PermissionStatus;
//   storage: PermissionStatus;
//   microphone: PermissionStatus;
// }

// export function usePermissions() {
//   const [permissionStatus, setPermissionStatus] = useState<PermissionStatuses>({
//     clipboard: 'undetermined',
//     sms: 'undetermined',
//     storage: 'undetermined',
//     microphone: 'undetermined',
//   });

//   const checkClipboardPermission = async () => {
//     if (Platform.OS === 'web') {
//       try {
//         const result = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
//         return result.state as PermissionStatus;
//       } catch {
//         return 'unavailable';
//       }
//     }
//     return 'granted';
//   };

//   const checkSMSPermission = async () => {
//     if (Platform.OS === 'web' || Platform.OS === 'ios') return 'unavailable';

//     try {
//       const { hasReceiveSmsPermission, hasReadSmsPermission } = await checkIfHasSMSPermission();
//       if (hasReceiveSmsPermission && hasReadSmsPermission) {
//         return 'granted';
//       }
//       return 'denied';
//     } catch (error) {
//       console.error('Error checking SMS permissions:', error);
//       return 'unavailable';
//     }
//   };

//   const checkStoragePermission = async () => {
//     if (Platform.OS === 'web') {
//       try {
//         const result = await navigator.permissions.query({ name: 'persistent-storage' as PermissionName });
//         return result.state as PermissionStatus;
//       } catch {
//         return 'unavailable';
//       }
//     }

//     try {
//       const { granted } = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
//       return granted ? 'granted' : 'denied';
//     } catch {
//       return 'unavailable';
//     }
//   };

//   const checkMicrophonePermission = async () => {
//     if (Platform.OS === 'web') {
//       try {
//         const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
//         return result.state as PermissionStatus;
//       } catch {
//         return 'unavailable';
//       }
//     }

//     try {
//       const { status } = await Audio.getPermissionsAsync();
//       return status as PermissionStatus;
//     } catch {
//       return 'unavailable';
//     }
//   };

//   const checkAllPermissions = useCallback(async () => {
//     const [clipboard, sms, storage, microphone] = await Promise.all([
//       checkClipboardPermission(),
//       checkSMSPermission(),
//       checkStoragePermission(),
//       checkMicrophonePermission(),
//     ]);

//     setPermissionStatus({
//       clipboard,
//       sms,
//       storage,
//       microphone,
//     });
//   }, []);

//   const requestClipboardPermission = async () => {
//     if (Platform.OS === 'web') {
//       try {
//         const result = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
//         if (result.state === 'granted') {
//           setPermissionStatus(prev => ({ ...prev, clipboard: 'granted' }));
//         } else {
//           setPermissionStatus(prev => ({ ...prev, clipboard: 'denied' }));
//         }
//       } catch {
//         setPermissionStatus(prev => ({ ...prev, clipboard: 'unavailable' }));
//       }
//     } else {
//       setPermissionStatus(prev => ({ ...prev, clipboard: 'granted' }));
//     }
//   };

//   const requestSMSPermission = async () => {
//     if (Platform.OS === 'web' || Platform.OS === 'ios') {
//       setPermissionStatus(prev => ({ ...prev, sms: 'unavailable' }));
//       return false;
//     }

//     try {
//       const granted = await requestReadSMSPermission();
//       setPermissionStatus(prev => ({ ...prev, sms: granted ? 'granted' : 'denied' }));
//       return granted;
//     } catch (error) {
//       console.error('Error requesting SMS permissions:', error);
//       setPermissionStatus(prev => ({ ...prev, sms: 'unavailable' }));
//       return false;
//     }
//   };

//   const requestStoragePermission = async () => {
//     if (Platform.OS === 'web') {
//       try {
//         const result = await navigator.permissions.query({ name: 'persistent-storage' as PermissionName });
//         setPermissionStatus(prev => ({ ...prev, storage: result.state as PermissionStatus }));
//       } catch {
//         setPermissionStatus(prev => ({ ...prev, storage: 'unavailable' }));
//       }
//     } else {
//       try {
//         const { granted } = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
//         setPermissionStatus(prev => ({ ...prev, storage: granted ? 'granted' : 'denied' }));
//       } catch {
//         setPermissionStatus(prev => ({ ...prev, storage: 'unavailable' }));
//       }
//     }
//   };

//   const requestMicrophonePermission = async () => {
//     if (Platform.OS === 'web') {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         stream.getTracks().forEach(track => track.stop());
//         setPermissionStatus(prev => ({ ...prev, microphone: 'granted' }));
//       } catch {
//         setPermissionStatus(prev => ({ ...prev, microphone: 'denied' }));
//       }
//     } else {
//       try {
//         const { status } = await Audio.requestPermissionsAsync();
//         setPermissionStatus(prev => ({ ...prev, microphone: status as PermissionStatus }));
//       } catch {
//         setPermissionStatus(prev => ({ ...prev, microphone: 'unavailable' }));
//       }
//     }
//   };

//   const requestAllPermissions = useCallback(async () => {
//     await Promise.all([
//       requestClipboardPermission(),
//       requestSMSPermission(),
//       requestStoragePermission(),
//       requestMicrophonePermission(),
//     ]);
//   }, []);

//   useEffect(() => {
//     checkAllPermissions();
//   }, [checkAllPermissions]);

//   return {
//     permissionStatus,
//     requestClipboardPermission,
//     requestSMSPermission,
//     requestStoragePermission,
//     requestMicrophonePermission,
//     requestAllPermissions,
//   };
// }



















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
