// import React, { useEffect, useState } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Modal,
//   TouchableOpacity,
//   Animated,
//   SafeAreaView,
//   Dimensions,
// } from 'react-native';
// import { TriangleAlert as AlertTriangle, ShieldOff, X, CircleArrowLeft as ArrowLeftCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

// interface SafeBrowsingAlertProps {
//   visible: boolean;
//   onClose: () => void;
//   url: string;
// }

// export default function SafeBrowsingAlert({ visible, onClose, url }: SafeBrowsingAlertProps) {
//   const [animation] = useState(new Animated.Value(0));
//   const [riskDetails] = useState({
//     type: 'phishing',
//     confidence: 'high',
//     details: 'This website has been detected as a phishing attempt that may try to steal your personal information.',
//     threats: [
//       'Personal data theft',
//       'Financial information theft',
//       'Credential harvesting',
//     ],
//   });
  
//   useEffect(() => {
//     if (visible) {
//       Animated.timing(animation, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(animation, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [visible, animation]);

//   const { height } = Dimensions.get('window');
  
//   const slideUp = animation.interpolate({
//     inputRange: [0, 1],
//     outputRange: [height, 0],
//   });

//   const getShortUrl = (url: string) => {
//     try {
//       const urlObject = new URL(url);
//       return urlObject.hostname;
//     } catch (e) {
//       return url;
//     }
//   };

//   if (!visible) return null;

//   return (
//     <Modal transparent visible={visible} animationType="none">
//       <Animated.View 
//         style={[
//           styles.overlay,
//           {
//             opacity: animation,
//           }
//         ]}
//       >
//         <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        
//         <Animated.View
//           style={[
//             styles.alertContainer,
//             {
//               transform: [{ translateY: slideUp }],
//             }
//           ]}
//         >
//           <SafeAreaView style={styles.safeArea}>
//             <View style={styles.warningHeader}>
//               <AlertTriangle size={60} color="#FFFFFF" />
//               <Text style={styles.warningTitle}>Security Warning</Text>
//               <Text style={styles.warningSubtitle}>
//                 Dangerous Website Detected
//               </Text>
//             </View>
            
//             <View style={styles.contentContainer}>
//               <View style={styles.urlContainer}>
//                 <ShieldOff size={18} color="#FF3B30" />
//                 <Text style={styles.urlText} numberOfLines={1}>
//                   {getShortUrl(url)}
//                 </Text>
//               </View>
              
//               <Text style={styles.warningDescription}>
//                 {riskDetails.details}
//               </Text>
              
//               <View style={styles.threatsList}>
//                 <Text style={styles.threatsTitle}>Detected Threats:</Text>
//                 {riskDetails.threats.map((threat, index) => (
//                   <View key={index} style={styles.threatItem}>
//                     <AlertCircle size={16} color="#FF3B30" />
//                     <Text style={styles.threatText}>{threat}</Text>
//                   </View>
//                 ))}
//               </View>
              
//               <View style={styles.actionButtons}>
//                 <TouchableOpacity 
//                   style={styles.goBackButton}
//                   onPress={onClose}
//                 >
//                   <ArrowLeftCircle size={20} color="#FFFFFF" />
//                   <Text style={styles.goBackText}>Go Back (Safe)</Text>
//                 </TouchableOpacity>
                
//                 <TouchableOpacity 
//                   style={styles.closeButton}
//                   onPress={onClose}
//                 >
//                   <X size={20} color="#FFFFFF" />
//                   <Text style={styles.closeText}>Close Warning</Text>
//                 </TouchableOpacity>
//               </View>
              
//               <Text style={styles.disclaimer}>
//                 Security Guardian has identified this site as potentially dangerous.
//                 Proceeding may put your personal information at risk.
//               </Text>
//             </View>
//           </SafeAreaView>
//         </Animated.View>
//       </Animated.View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//   },
//   backdrop: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   alertContainer: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: '#FFFFFF',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     overflow: 'hidden',
//     maxHeight: '90%',
//   },
//   safeArea: {
//     flex: 1,
//   },
//   warningHeader: {
//     backgroundColor: '#FF3B30',
//     padding: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   warningTitle: {
//     fontFamily: 'Inter-Bold',
//     fontSize: 24,
//     color: '#FFFFFF',
//     marginTop: 16,
//     marginBottom: 4,
//   },
//   warningSubtitle: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 16,
//     color: 'rgba(255, 255, 255, 0.9)',
//   },
//   contentContainer: {
//     padding: 20,
//   },
//   urlContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255, 59, 48, 0.1)',
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 8,
//     marginBottom: 16,
//   },
//   urlText: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 15,
//     color: '#FF3B30',
//     marginLeft: 8,
//     flex: 1,
//   },
//   warningDescription: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 16,
//     color: '#000000',
//     marginBottom: 20,
//     lineHeight: 24,
//   },
//   threatsList: {
//     marginBottom: 24,
//   },
//   threatsTitle: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 16,
//     marginBottom: 8,
//   },
//   threatItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   threatText: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 15,
//     marginLeft: 8,
//     color: '#3C3C43',
//   },
//   actionButtons: {
//     marginBottom: 20,
//   },
//   goBackButton: {
//     backgroundColor: '#007AFF',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   goBackText: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 16,
//     color: '#FFFFFF',
//     marginLeft: 8,
//   },
//   closeButton: {
//     backgroundColor: '#8E8E93',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//   },
//   closeText: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 16,
//     color: '#FFFFFF',
//     marginLeft: 8,
//   },
//   disclaimer: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 13,
//     color: '#8E8E93',
//     textAlign: 'center',
//     lineHeight: 18,
//   },
// });














import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { TriangleAlert as AlertTriangle, ShieldOff, X, CircleArrowLeft as ArrowLeftCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { analyzeURL } from '@/utils/api';

interface SafeBrowsingAlertProps {
  visible: boolean;
  onClose: () => void;
  url: string;
}

export default function SafeBrowsingAlert({ visible, onClose, url }: SafeBrowsingAlertProps) {
  const [animation] = useState(new Animated.Value(0));
  const [riskDetails, setRiskDetails] = useState({
    type: '',
    confidence: '0',
    details: '',
    threats: [] as string[],
  });

  useEffect(() => {
    const fetchRiskDetails = async () => {
      if (!visible || !url) return;
      const analysis = await analyzeURL(url);
      if (analysis.isMalicious) {
        setRiskDetails({
          type: analysis.type || 'phishing',
          confidence: (analysis.confidence * 100).toFixed(0),
          details: analysis.details || 'This website may pose a security risk.',
          threats: analysis.details ? analysis.details.split('. ').filter((d: string) => d) : [],
        });
      }
    };
    fetchRiskDetails();
  }, [visible, url]);

  useEffect(() => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animation]);

  const { height } = Dimensions.get('window');

  const slideUp = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  const getShortUrl = (url: string) => {
    try {
      const urlObject = new URL(url);
      return urlObject.hostname;
    } catch (e) {
      return url;
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View 
        style={[
          styles.overlay,
          {
            opacity: animation,
          }
        ]}
      >
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        
        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [{ translateY: slideUp }],
            }
          ]}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.warningHeader}>
              <AlertTriangle size={60} color="#FFFFFF" />
              <Text style={styles.warningTitle}>Security Warning</Text>
              <Text style={styles.warningSubtitle}>
                Dangerous Website Detected
              </Text>
            </View>
            
            <View style={styles.contentContainer}>
              <View style={styles.urlContainer}>
                <ShieldOff size={18} color="#FF3B30" />
                <Text style={styles.urlText} numberOfLines={1}>
                  {getShortUrl(url)}
                </Text>
              </View>
              
              <Text style={styles.warningDescription}>
                {riskDetails.details}
              </Text>
              
              {riskDetails.threats.length > 0 && (
                <View style={styles.threatsList}>
                  <Text style={styles.threatsTitle}>Detected Threats:</Text>
                  {riskDetails.threats.map((threat, index) => (
                    <View key={index} style={styles.threatItem}>
                      <AlertCircle size={16} color="#FF3B30" />
                      <Text style={styles.threatText}>{threat}</Text>
                    </View>
                  ))}
                </View>
              )}
              
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.goBackButton}
                  onPress={onClose}
                >
                  <ArrowLeftCircle size={20} color="#FFFFFF" />
                  <Text style={styles.goBackText}>Go Back (Safe)</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <X size={20} color="#FFFFFF" />
                  <Text style={styles.closeText}>Close Warning</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.disclaimer}>
                Security Guardian has identified this site as potentially dangerous.
                Proceeding may put your personal information at risk.
              </Text>
            </View>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  alertContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  safeArea: {
    flex: 1,
  },
  warningHeader: {
    backgroundColor: '#FF3B30',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 4,
  },
  warningSubtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  contentContainer: {
    padding: 20,
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  urlText: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#FF3B30',
    marginLeft: 8,
    flex: 1,
  },
  warningDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000000',
    marginBottom: 20,
    lineHeight: 24,
  },
  threatsList: {
    marginBottom: 24,
  },
  threatsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
  threatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  threatText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    marginLeft: 8,
    color: '#3C3C43',
  },
  actionButtons: {
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
  },
  goBackText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  closeButton: {
    backgroundColor: '#8E8E93',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  closeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
  disclaimer: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
  },
});