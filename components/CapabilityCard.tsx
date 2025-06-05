import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CapabilityCardProps {
  title: string;
  description: string;
}

export default function CapabilityCard({ title, description }: CapabilityCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    fontFamily: 'Arial',
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    fontFamily: 'Arial',
    lineHeight: 22,
  },
});
