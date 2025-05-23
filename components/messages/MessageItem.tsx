import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, MessageSquare, MessageCircle } from 'lucide-react-native';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isMalicious: boolean;
  maliciousType?: string;
  source: 'SMS' | 'WhatsApp';
}

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Less than a minute
    if (diff < 60 * 1000) {
      return 'Just now';
    }
    
    // Less than an hour
    if (diff < 60 * 60 * 1000) {
      const minutes = Math.floor(diff / (60 * 1000));
      return `${minutes}m ago`;
    }
    
    // Less than a day
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      return `${hours}h ago`;
    }
    
    // Format as date
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const getStatusIcon = () => {
    if (message.isMalicious) {
      return <AlertTriangle size={16} color="#FF3B30" />;
    } else {
      return <CheckCircle size={16} color="#34C759" />;
    }
  };

  const getSourceIcon = () => {
    if (message.source === 'SMS') {
      return <MessageSquare size={20} color="#007AFF" />;
    } else {
      return <MessageCircle size={20} color="#25D366" />;
    }
  };

  const highlightPhishingLinks = (text: string) => {
    // Simple regex to detect URLs
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/g;
    
    if (!urlRegex.test(text)) return <Text style={styles.messageContent}>{text}</Text>;
    
    const parts = text.split(urlRegex);
    const matches = text.match(urlRegex) || [];
    
    return (
      <Text style={styles.messageContent}>
        {parts.map((part, i) => {
          // Check if this part is a URL match
          const isMatch = matches.includes(part);
          
          // If it's a URL and the message is malicious, highlight it
          if (isMatch && message.isMalicious) {
            return (
              <Text key={i} style={styles.highlightedLink}>
                {part}
              </Text>
            );
          }
          
          // Otherwise just render the text
          return <Text key={i}>{part}</Text>;
        })}
      </Text>
    );
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.sourceContainer}>
          {getSourceIcon()}
          <Text style={styles.sender}>{message.sender}</Text>
        </View>
        <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
      </View>
      
      {highlightPhishingLinks(message.content)}
      
      <View style={styles.footer}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: message.isMalicious ? 'rgba(255, 59, 48, 0.1)' : 'rgba(52, 199, 89, 0.1)' }
        ]}>
          {getStatusIcon()}
          <Text style={[
            styles.statusText,
            { color: message.isMalicious ? '#FF3B30' : '#34C759' }
          ]}>
            {message.isMalicious ? 'Malicious' : 'Safe'}
          </Text>
        </View>
        {message.isMalicious && message.maliciousType && (
          <Text style={styles.typeText}>
            Type: {message.maliciousType.charAt(0).toUpperCase() + message.maliciousType.slice(1)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sender: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    marginLeft: 6,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8E8E93',
  },
  messageContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    marginBottom: 12,
    color: '#3C3C43',
    lineHeight: 22,
  },
  highlightedLink: {
    color: '#FF3B30',
    textDecorationLine: 'underline',
    fontFamily: 'Inter-Medium',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  typeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8E8E93',
  },
});