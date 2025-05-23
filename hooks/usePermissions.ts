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















import { useState, useEffect, useCallback } from 'react';
import { Platform, Alert, PermissionsAndroid, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';

type PermissionStatus = 'granted' | 'denied' | 'never_ask_again' | 'unavailable' | 'undetermined';

interface PermissionStatuses {
  sms: PermissionStatus;
  notifications: PermissionStatus;
  storage: PermissionStatus;
  camera: PermissionStatus;
  microphone: PermissionStatus;
}

export function usePermissions() {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatuses>({
    sms: 'undetermined',
    notifications: 'undetermined',
    storage: 'undetermined',
    camera: 'undetermined',
    microphone: 'undetermined',
  });

  // Check all permissions on mount
  useEffect(() => {
    checkAllPermissions();
  }, []);

  const checkAllPermissions = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        // Check SMS permissions
        const hasReadSMS = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
        const hasReceiveSMS = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECEIVE_SMS);
        const smsStatus = (hasReadSMS && hasReceiveSMS) ? 'granted' : 'undetermined';

        // Check storage permission
        const hasStorage = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        const storageStatus = hasStorage ? 'granted' : 'undetermined';

        // Check camera permission
        const hasCamera = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
        const cameraStatus = hasCamera ? 'granted' : 'undetermined';

        // Check microphone permission
        const hasMicrophone = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
        const microphoneStatus = hasMicrophone ? 'granted' : 'undetermined';

        // Check notification permission
        const notificationSettings = await Notifications.getPermissionsAsync();
        const notificationStatus = notificationSettings.granted ? 'granted' : 'undetermined';

        setPermissionStatus({
          sms: smsStatus,
          notifications: notificationStatus,
          storage: storageStatus,
          camera: cameraStatus,
          microphone: microphoneStatus,
        });
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    } else if (Platform.OS === 'ios') {
      // iOS doesn't allow SMS reading
      const notificationSettings = await Notifications.getPermissionsAsync();
      const notificationStatus = notificationSettings.granted ? 'granted' : 'undetermined';

      setPermissionStatus({
        sms: 'unavailable',
        notifications: notificationStatus,
        storage: 'unavailable',
        camera: 'undetermined',
        microphone: 'undetermined',
      });
    }
  }, []);

  const requestSMSPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      Alert.alert(
        'Not Available on iOS',
        'SMS reading is not available on iOS due to platform restrictions. This feature is only available on Android devices.',
        [{ text: 'OK' }]
      );
      setPermissionStatus(prev => ({ ...prev, sms: 'unavailable' }));
      return false;
    }

    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      ]);

      const hasReadSMS = granted[PermissionsAndroid.PERMISSIONS.READ_SMS] === PermissionsAndroid.RESULTS.GRANTED;
      const hasReceiveSMS = granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] === PermissionsAndroid.RESULTS.GRANTED;
      
      if (hasReadSMS && hasReceiveSMS) {
        setPermissionStatus(prev => ({ ...prev, sms: 'granted' }));
        return true;
      } else if (
        granted[PermissionsAndroid.PERMISSIONS.READ_SMS] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
      ) {
        setPermissionStatus(prev => ({ ...prev, sms: 'never_ask_again' }));
        Alert.alert(
          'Permission Required',
          'SMS permissions are required for message monitoring. Please enable them in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      } else {
        setPermissionStatus(prev => ({ ...prev, sms: 'denied' }));
        return false;
      }
    } catch (error) {
      console.error('Error requesting SMS permission:', error);
      setPermissionStatus(prev => ({ ...prev, sms: 'denied' }));
      return false;
    }
  }, []);

  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      
      setPermissionStatus(prev => ({ 
        ...prev, 
        notifications: granted ? 'granted' : 'denied' 
      }));
      
      if (!granted) {
        Alert.alert(
          'Notifications Disabled',
          'Enable notifications to receive alerts about malicious content.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
      
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  const requestStoragePermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      setPermissionStatus(prev => ({ ...prev, storage: 'unavailable' }));
      return false;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to storage to save analysis reports.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      const success = granted === PermissionsAndroid.RESULTS.GRANTED;
      setPermissionStatus(prev => ({ 
        ...prev, 
        storage: success ? 'granted' : 'denied' 
      }));
      
      return success;
    } catch (error) {
      console.error('Error requesting storage permission:', error);
      return false;
    }
  }, []);

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to camera.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        const success = granted === PermissionsAndroid.RESULTS.GRANTED;
        setPermissionStatus(prev => ({ 
          ...prev, 
          camera: success ? 'granted' : 'denied' 
        }));
        
        return success;
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        return false;
      }
    } else {
      // For iOS, permissions are handled by the system when camera is accessed
      setPermissionStatus(prev => ({ ...prev, camera: 'granted' }));
      return true;
    }
  }, []);

  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to microphone for audio analysis.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        const success = granted === PermissionsAndroid.RESULTS.GRANTED;
        setPermissionStatus(prev => ({ 
          ...prev, 
          microphone: success ? 'granted' : 'denied' 
        }));
        
        return success;
      } catch (error) {
        console.error('Error requesting microphone permission:', error);
        return false;
      }
    } else {
      // For iOS, permissions are handled by the system when microphone is accessed
      setPermissionStatus(prev => ({ ...prev, microphone: 'granted' }));
      return true;
    }
  }, []);

  const requestAllPermissions = useCallback(async () => {
    await requestNotificationPermission();
    await requestSMSPermission();
    await requestStoragePermission();
    await requestCameraPermission();
    await requestMicrophonePermission();
  }, [
    requestNotificationPermission,
    requestSMSPermission,
    requestStoragePermission,
    requestCameraPermission,
    requestMicrophonePermission,
  ]);

  return {
    permissionStatus,
    requestSMSPermission,
    requestNotificationPermission,
    requestStoragePermission,
    requestCameraPermission,
    requestMicrophonePermission,
    requestAllPermissions,
    checkAllPermissions,
  };
}