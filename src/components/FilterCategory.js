// src/components/FilterCategory.js
import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function FilterCategory({ categories = [], selected, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
      <TouchableOpacity style={[styles.chip, selected === null && styles.active]} onPress={() => onSelect(null)}>
        <Text style={[styles.txt, selected === null && styles.txtActive]}>Semua</Text>
      </TouchableOpacity>
      {categories.map((c) => (
        <TouchableOpacity key={c.id} style={[styles.chip, selected === c.id && styles.active]} onPress={() => onSelect(c.id)}>
          <Text style={[styles.txt, selected === c.id && styles.txtActive]}>{c.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.pinkLight,
    borderRadius: 20,
    marginRight: 10,
  },
  active: { backgroundColor: colors.pink },
  txt: { color: colors.text },
  txtActive: { color: colors.white, fontWeight: '700' },
});
