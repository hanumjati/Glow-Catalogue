// src/components/Pagination.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  if (totalPages <= 1) return null;
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onPrev} disabled={page <= 1}>
        <Text style={[styles.txt, page <= 1 && { opacity: 0.4 }]}>Prev</Text>
      </TouchableOpacity>
      <Text style={styles.page}>{page} / {totalPages}</Text>
      <TouchableOpacity onPress={onNext} disabled={page >= totalPages}>
        <Text style={[styles.txt, page >= totalPages && { opacity: 0.4 }]}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 12 },
  txt: { color: colors.pink, fontWeight: '700' },
  page: { marginHorizontal: 12, color: colors.text },
});
