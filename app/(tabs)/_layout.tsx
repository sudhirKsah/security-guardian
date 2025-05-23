import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Shield, Mic, ClipboardCheck, MessageSquare, Globe } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Shield size={size} color={color} />,
          headerTitle: 'Security Guardian',
          headerTitleStyle: styles.headerTitle,
          headerStyle: styles.header,
        }}
      />
      <Tabs.Screen
        name="audio"
        options={{
          title: 'Voice Analysis',
          tabBarIcon: ({ color, size }) => <Mic size={size} color={color} />,
          headerTitle: 'Voice Emotion Analysis',
          headerTitleStyle: styles.headerTitle,
          headerStyle: styles.header,
        }}
      />
      <Tabs.Screen
        name="clipboard"
        options={{
          title: 'Clipboard',
          tabBarIcon: ({ color, size }) => <ClipboardCheck size={size} color={color} />,
          headerTitle: 'Clipboard Monitor',
          headerTitleStyle: styles.headerTitle,
          headerStyle: styles.header,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />,
          headerTitle: 'Message Scanner',
          headerTitleStyle: styles.headerTitle,
          headerStyle: styles.header,
        }}
      />
      <Tabs.Screen
        name="browser"
        options={{
          title: 'Browser',
          tabBarIcon: ({ color, size }) => <Globe size={size} color={color} />,
          headerTitle: 'Secure Browser',
          headerTitleStyle: styles.headerTitle,
          headerStyle: styles.header,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    height: 60,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginBottom: 5,
  },
  header: {
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#000000',
  },
});