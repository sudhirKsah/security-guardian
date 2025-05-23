import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Link, FileText } from 'lucide-react-native';

interface ClipboardItem {
  id: string;
  content: string;
  timestamp: Date;
  status: 'safe' | 'malicious';
  type: 'url' | 'text';
  details: string;
}

interface ClipboardHistoryItemProps {
  item: ClipboardItem;
}

export default function ClipboardHistoryItem({ item }: ClipboardHistoryItemProps) {
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
    if (item.status === 'safe') {
      return <CheckCircle size={16} color="#34C759" />;
    } else {
      return <AlertTriangle size={16} color="#FF3B30" />;
    }
  };

  const getTypeIcon = () => {
    if (item.type === 'url') {
      return <Link size={20} color="#007AFF" />;
    } else {
      return <FileText size={20} color="#8E8E93" />;
    }
  };

  const truncateContent = (content: string, maxLength: number = 40) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.typeContainer}>
          {getTypeIcon()}
          <Text style={styles.typeText}>{item.type === 'url' ? 'URL' : 'Text'}</Text>
        </View>
        <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
      </View>
      
      <Text style={styles.content} numberOfLines={2}>
        {truncateContent(item.content)}
      </Text>
      
      <View style={styles.footer}>
        <View style={[
          styles.statusBadge,
          { backgroundColor: item.status === 'safe' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)' }
        ]}>
          {getStatusIcon()}
          <Text style={[
            styles.statusText,
            { color: item.status === 'safe' ? '#34C759' : '#FF3B30' }
          ]}>
            {item.status === 'safe' ? 'Safe' : 'Malicious'}
          </Text>
        </View>
        <Text style={styles.details} numberOfLines={1}>{item.details}</Text>
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
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 6,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8E8E93',
  },
  content: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    marginBottom: 8,
    color: '#3C3C43',
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
  details: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8E8E93',
    flex: 1,
  },
});