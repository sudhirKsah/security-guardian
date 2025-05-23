// import React, { useState, useRef } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Animated,
//   Platform,
// } from 'react-native';
// import { WebView } from 'react-native-webview';
// import { Globe, Search, ShieldCheck, TriangleAlert as AlertTriangle, X, ChevronLeft, ChevronRight, RefreshCw, Lock, Share2 } from 'lucide-react-native';
// import SafeBrowsingAlert from '@/components/browser/SafeBrowsingAlert';

// export default function BrowserScreen() {
//   const [url, setUrl] = useState('');
//   const [currentUrl, setCurrentUrl] = useState('');
//   const [inputUrl, setInputUrl] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [securityStatus, setSecurityStatus] = useState('unknown'); // 'safe', 'suspicious', 'dangerous', 'unknown'
//   const [alertVisible, setAlertVisible] = useState(false);
//   const [canGoBack, setCanGoBack] = useState(false);
//   const [canGoForward, setCanGoForward] = useState(false);
//   const webViewRef = useRef(null);
//   const headerAnimation = useRef(new Animated.Value(1)).current;
//   const securityDetailsAnimation = useRef(new Animated.Value(0)).current;

//   const loadUrl = () => {
//     let processedUrl = inputUrl.trim();
    
//     // Add https:// if not present
//     if (processedUrl && !processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
//       processedUrl = 'https://' + processedUrl;
//     }
    
//     if (processedUrl) {
//       setUrl(processedUrl);
//       setCurrentUrl(processedUrl);
//       checkUrlSecurity(processedUrl);
//     }
//   };

//   const checkUrlSecurity = (url) => {
//     // This would be replaced with an actual security check
//     // For now we'll just simulate different security states
    
//     setLoading(true);
    
//     setTimeout(() => {
//       setLoading(false);
      
//       // Simulate phishing detection for specific URLs
//       if (url.includes('phishing') || url.includes('malicious') || Math.random() < 0.2) {
//         setSecurityStatus('dangerous');
//         setAlertVisible(true);
//       } else if (url.includes('suspicious') || Math.random() < 0.2) {
//         setSecurityStatus('suspicious');
//       } else {
//         setSecurityStatus('safe');
//       }
//     }, 1000);
//   };

//   const handleNavigationStateChange = (navState) => {
//     setCurrentUrl(navState.url);
//     setCanGoBack(navState.canGoBack);
//     setCanGoForward(navState.canGoForward);
    
//     // Security check on navigation
//     if (navState.url !== url) {
//       checkUrlSecurity(navState.url);
//     }
//   };

//   const goBack = () => {
//     webViewRef.current?.goBack();
//   };

//   const goForward = () => {
//     webViewRef.current?.goForward();
//   };

//   const reload = () => {
//     webViewRef.current?.reload();
//   };

//   const toggleSecurityDetails = () => {
//     Animated.timing(securityDetailsAnimation, {
//       toValue: securityDetailsAnimation._value === 0 ? 1 : 0,
//       duration: 300,
//       useNativeDriver: false,
//     }).start();
//   };

//   const getSecurityStatusColor = () => {
//     switch (securityStatus) {
//       case 'safe':
//         return '#34C759';
//       case 'suspicious':
//         return '#FF9500';
//       case 'dangerous':
//         return '#FF3B30';
//       default:
//         return '#8E8E93';
//     }
//   };

//   const getSecurityStatusText = () => {
//     switch (securityStatus) {
//       case 'safe':
//         return 'Secure';
//       case 'suspicious':
//         return 'Suspicious';
//       case 'dangerous':
//         return 'Dangerous';
//       default:
//         return 'Unknown';
//     }
//   };

//   const getSecurityStatusIcon = () => {
//     switch (securityStatus) {
//       case 'safe':
//         return <Lock size={16} color="#34C759" />;
//       case 'suspicious':
//         return <AlertTriangle size={16} color="#FF9500" />;
//       case 'dangerous':
//         return <AlertTriangle size={16} color="#FF3B30" />;
//       default:
//         return <Globe size={16} color="#8E8E93" />;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Animated.View style={styles.header}>
//         <View style={styles.urlBar}>
//           <View style={styles.securityIndicator}>
//             {getSecurityStatusIcon()}
//           </View>
//           <TextInput
//             style={styles.urlInput}
//             value={inputUrl}
//             onChangeText={setInputUrl}
//             placeholder="Search or enter website name"
//             placeholderTextColor="#8E8E93"
//             autoCapitalize="none"
//             autoCorrect={false}
//             keyboardType="url"
//             returnKeyType="go"
//             onSubmitEditing={loadUrl}
//           />
//           <TouchableOpacity style={styles.searchButton} onPress={loadUrl}>
//             <Search size={18} color="#007AFF" />
//           </TouchableOpacity>
//         </View>
        
//         <TouchableOpacity 
//           style={[
//             styles.securityStatus, 
//             { backgroundColor: `${getSecurityStatusColor()}10` }
//           ]}
//           onPress={toggleSecurityDetails}
//         >
//           <View style={styles.securityStatusContent}>
//             {getSecurityStatusIcon()}
//             <Text 
//               style={[
//                 styles.securityStatusText, 
//                 { color: getSecurityStatusColor() }
//               ]}
//             >
//               {getSecurityStatusText()}
//             </Text>
//           </View>
//         </TouchableOpacity>
//       </Animated.View>
      
//       <Animated.View 
//         style={[
//           styles.securityDetails,
//           {
//             height: securityDetailsAnimation.interpolate({
//               inputRange: [0, 1],
//               outputRange: [0, 120]
//             }),
//             opacity: securityDetailsAnimation
//           }
//         ]}
//       >
//         <View style={styles.securityDetailsContent}>
//           <View style={styles.securityDetailHeader}>
//             <ShieldCheck size={20} color={getSecurityStatusColor()} />
//             <Text style={styles.securityDetailTitle}>Security Details</Text>
//             <TouchableOpacity 
//               style={styles.securityDetailClose}
//               onPress={toggleSecurityDetails}
//             >
//               <X size={18} color="#8E8E93" />
//             </TouchableOpacity>
//           </View>
          
//           <Text style={styles.securityDetailText}>
//             {securityStatus === 'safe' && (
//               "This website is secure. The connection is encrypted and your data is protected."
//             )}
//             {securityStatus === 'suspicious' && (
//               "This website appears suspicious. Be careful about sharing personal information."
//             )}
//             {securityStatus === 'dangerous' && (
//               "Warning! This website has been flagged as potentially dangerous. We recommend not proceeding."
//             )}
//             {securityStatus === 'unknown' && (
//               "The security status of this website is unknown. Proceed with caution."
//             )}
//           </Text>
//         </View>
//       </Animated.View>
      
//       {url ? (
//         <WebView
//           ref={webViewRef}
//           source={{ uri: url }}
//           style={styles.webView}
//           onNavigationStateChange={handleNavigationStateChange}
//           onLoadStart={() => setLoading(true)}
//           onLoadEnd={() => setLoading(false)}
//         />
//       ) : (
//         <View style={styles.emptyState}>
//           <View style={styles.emptyStateContent}>
//             <Globe size={60} color="#007AFF" />
//             <Text style={styles.emptyStateTitle}>Safe Browsing</Text>
//             <Text style={styles.emptyStateDescription}>
//               Enter a website URL in the search bar above to browse securely.
//               The built-in security scanner will check for phishing and malicious content.
//             </Text>
            
//             <View style={styles.featuresList}>
//               <View style={styles.featureItem}>
//                 <ShieldCheck size={20} color="#34C759" />
//                 <Text style={styles.featureText}>Real-time phishing detection</Text>
//               </View>
//               <View style={styles.featureItem}>
//                 <AlertTriangle size={20} color="#FF9500" />
//                 <Text style={styles.featureText}>Malicious content warnings</Text>
//               </View>
//               <View style={styles.featureItem}>
//                 <Lock size={20} color="#007AFF" />
//                 <Text style={styles.featureText}>Privacy protection</Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       )}
      
//       {url && (
//         <View style={styles.toolbar}>
//           <TouchableOpacity 
//             style={[styles.toolbarButton, !canGoBack && styles.toolbarButtonDisabled]} 
//             onPress={goBack}
//             disabled={!canGoBack}
//           >
//             <ChevronLeft size={22} color={canGoBack ? "#007AFF" : "#C7C7CC"} />
//           </TouchableOpacity>
          
//           <TouchableOpacity 
//             style={[styles.toolbarButton, !canGoForward && styles.toolbarButtonDisabled]} 
//             onPress={goForward}
//             disabled={!canGoForward}
//           >
//             <ChevronRight size={22} color={canGoForward ? "#007AFF" : "#C7C7CC"} />
//           </TouchableOpacity>
          
//           <TouchableOpacity style={styles.toolbarButton} onPress={reload}>
//             <RefreshCw size={22} color="#007AFF" />
//           </TouchableOpacity>
          
//           <TouchableOpacity style={styles.toolbarButton}>
//             <Share2 size={22} color="#007AFF" />
//           </TouchableOpacity>
//         </View>
//       )}
      
//       <SafeBrowsingAlert 
//         visible={alertVisible}
//         onClose={() => setAlertVisible(false)}
//         url={currentUrl}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F2F2F7',
//   },
//   header: {
//     backgroundColor: '#FFFFFF',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,0.1)',
//   },
//   urlBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F2F2F7',
//     borderRadius: 10,
//     paddingHorizontal: 8,
//     height: 40,
//   },
//   securityIndicator: {
//     paddingHorizontal: 8,
//   },
//   urlInput: {
//     flex: 1,
//     height: 40,
//     fontFamily: 'Inter-Regular',
//     fontSize: 15,
//     color: '#000000',
//   },
//   searchButton: {
//     padding: 8,
//   },
//   securityStatus: {
//     marginTop: 8,
//     borderRadius: 8,
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     alignSelf: 'flex-start',
//   },
//   securityStatusContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   securityStatusText: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 12,
//     marginLeft: 4,
//   },
//   securityDetails: {
//     backgroundColor: '#FFFFFF',
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(0,0,0,0.1)',
//     overflow: 'hidden',
//   },
//   securityDetailsContent: {
//     padding: 12,
//   },
//   securityDetailHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   securityDetailTitle: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 15,
//     marginLeft: 8,
//     flex: 1,
//   },
//   securityDetailClose: {
//     padding: 4,
//   },
//   securityDetailText: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 14,
//     color: '#3C3C43',
//     lineHeight: 20,
//   },
//   webView: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyStateContent: {
//     maxWidth: 320,
//     alignItems: 'center',
//   },
//   emptyStateTitle: {
//     fontFamily: 'Inter-SemiBold',
//     fontSize: 22,
//     marginTop: 16,
//     marginBottom: 8,
//   },
//   emptyStateDescription: {
//     fontFamily: 'Inter-Regular',
//     fontSize: 15,
//     color: '#3C3C43',
//     textAlign: 'center',
//     lineHeight: 22,
//     marginBottom: 24,
//   },
//   featuresList: {
//     width: '100%',
//   },
//   featureItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     padding: 14,
//     borderRadius: 12,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   featureText: {
//     fontFamily: 'Inter-Medium',
//     fontSize: 15,
//     marginLeft: 12,
//   },
//   toolbar: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     height: 50,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(0,0,0,0.1)',
//     paddingHorizontal: 8,
//   },
//   toolbarButton: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   toolbarButtonDisabled: {
//     opacity: 0.5,
//   },
// });










import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
  Shield,
  ShieldOff,
  Lock,
  Unlock,
} from 'lucide-react-native';
import SafeBrowsingAlert from '@/components/browser/SafeBrowsingAlert';
import { analyzeURL } from '@/utils/api';

export default function BrowserScreen() {
  const webViewRef = useRef<WebView>(null);
  const [url, setUrl] = useState('https://www.google.com');
  const [inputUrl, setInputUrl] = useState('');
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSecure, setIsSecure] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const checkURL = async () => {
      setIsLoading(true);
      const analysis = await analyzeURL(url);
      setIsLoading(false);
      setShowAlert(analysis.isMalicious);
      setIsSecure(!analysis.isMalicious && url.startsWith('https://'));
    };
    checkURL();
  }, [url]);

  const handleGoBack = () => {
    if (canGoBack) {
      webViewRef.current?.goBack();
    }
  };

  const handleGoForward = () => {
    if (canGoForward) {
      webViewRef.current?.goForward();
    }
  };

  const handleRefresh = () => {
    webViewRef.current?.reload();
  };

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    setUrl(navState.url);
    setIsLoading(navState.loading);
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    let searchUrl = inputUrl.trim();

    // Add https:// if no protocol is specified
    if (!searchUrl.startsWith('http://') && !searchUrl.startsWith('https://')) {
      searchUrl = 'https://' + searchUrl;
    }

    setUrl(searchUrl);
    setInputUrl(searchUrl);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Secure Browser</Text>
      </View>

      <View style={styles.urlBar}>
        <View style={styles.securityIndicator}>
          {isSecure ? (
            <Lock size={16} color="#34C759" />
          ) : (
            <Unlock size={16} color="#FF3B30" />
          )}
        </View>
        <TextInput
          style={styles.urlInput}
          value={inputUrl}
          onChangeText={setInputUrl}
          placeholder="Enter URL or search"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.goButton} onPress={handleSearch}>
          <Text style={styles.goButtonText}>Go</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" />
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
          setIsLoading(false);
        }}
      />

      <SafeBrowsingAlert
        visible={showAlert}
        onClose={() => {
          setShowAlert(false);
          setUrl('https://www.google.com'); // Redirect to a safe page
          setInputUrl('https://www.google.com');
        }}
        url={url}
      />

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, !canGoBack && styles.disabledButton]}
          onPress={handleGoBack}
          disabled={!canGoBack}
        >
          <ArrowLeft size={24} color={canGoBack ? '#007AFF' : '#8E8E93'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, !canGoForward && styles.disabledButton]}
          onPress={handleGoForward}
          disabled={!canGoForward}
        >
          <ArrowRight size={24} color={canGoForward ? '#007AFF' : '#8E8E93'} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={handleRefresh}>
          <RefreshCcw size={24} color="#007AFF" />
        </TouchableOpacity>

        <View style={styles.statusContainer}>
          {isSecure ? (
            <Shield size={20} color="#34C759" />
          ) : (
            <ShieldOff size={20} color="#FF3B30" />
          )}
          <Text style={[
            styles.statusText,
            { color: isSecure ? '#34C759' : '#FF3B30' }
          ]}>
            {isSecure ? 'Secure' : 'Not Secure'}
          </Text>
        </View>
      </View>
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
  urlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  securityIndicator: {
    marginRight: 8,
  },
  urlInput: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 10,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
  },
  goButton: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  goButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  loadingContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  webview: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  controlButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 6,
  },
});