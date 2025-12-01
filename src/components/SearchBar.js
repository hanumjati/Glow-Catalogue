// src/components/SearchBar.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';

export default function SearchBar({ value, onChange, placeholder = 'Cari produk...' }) {
  return (
    <View style={styles.container}>
      <Icon name="search" size={18} color={colors.gray} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        style={styles.input}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    elevation: 2,
  },
  input: { marginLeft: 8, flex: 1, fontSize: 15 },
});
