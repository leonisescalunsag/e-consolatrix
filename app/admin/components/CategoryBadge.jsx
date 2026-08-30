import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const categoryColors = {
  // For News
  announcement: '#3b82f6',
  event: '#a855f7',
  achievement: '#f59e0b',
  
  // For Rules
  attendance: '#44e644',
  dresscode: '#0033FF',
  academic: '#f50c0c',
  behavioral: '#FFA500',
  
  // For Teachers
  college: '#1E90FF',
  shs: '#32CD32',
  jhs: '#FF8C00',
  elementary: '#FFD700',
  
  default: '#8B0000'
};

export default function CategoryBadge({ category, type = 'default' }) {
  const color = categoryColors[category?.toLowerCase()] || categoryColors.default;
  
  return (
    <View style={[styles.badge, { backgroundColor: color + '20' }]}>
      <Text style={[styles.text, { color }]}>{category}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});