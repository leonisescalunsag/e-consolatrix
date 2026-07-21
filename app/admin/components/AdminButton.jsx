import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function AdminButton({ title, onPress, type = 'primary', icon }) {
  return (
    <TouchableOpacity 
      style={[styles.button, styles[type]]} 
      onPress={onPress}
    >
      {icon}
      <Text style={[styles.text, styles[`${type}Text`]]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 5,
  },
  primary: {
    backgroundColor: '#8B0000',
  },
  secondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#8B0000',
  },
  danger: {
    backgroundColor: '#dc3545',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#8B0000',
  },
  dangerText: {
    color: '#fff',
  },
});