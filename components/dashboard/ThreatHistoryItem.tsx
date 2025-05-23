import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TriangleAlert as AlertTriangle, CircleAlert as AlertCircle, Info } from 'lucide-react-native';

interface Threat {
  id: string;
  type: string;
  source: string;
  timestamp: Date;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface ThreatHistoryItemProps {
  threat: Threat;
}

export default function ThreatHistoryItem({ threat }: ThreatHistoryItemProps) {
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return '#FF3B30';
      case 'medium':
        return '#FF9500';
      case 'low':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle size={20} color="#FF3B30" />;
      case 'medium':
        return <AlertCircle size={20} color="#FF9500" />;
      case 'low':
        return <Info size={20} color="#34C759" />;
      default:
        return <Info size={20} color="#8E8E93" />;
    }
  };

  return (
    <TouchableOpacity style={styles.container}>
      <View style={[
        styles.iconContainer,
        { backgroundColor: `${getSeverityColor(threat.severity)}10` }
      ]}>
        {getSeverityIcon(threat.severity)}
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.source}>{threat.source}</Text>
          <Text style={styles.timestamp}>{formatTime(threat.timestamp)}</Text>
        </View>
        <Text style={styles.description}>{threat.description}</Text>
        <View style={styles.footer}>
          <View style={[
            styles.severityBadge,
            { backgroundColor: `${getSeverityColor(threat.severity)}20` }
          ]}>
            <Text style={[
              styles.severityText,
              { color: getSeverityColor(threat.severity) }
            ]}>
              {threat.severity.charAt(0).toUpperCase() + threat.severity.slice(1)}
            </Text>
          </View>
          <Text style={styles.typeText}>{threat.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  source: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    flex: 1,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8E8E93',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 8,
    color: '#3C3C43',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  severityText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  typeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
});