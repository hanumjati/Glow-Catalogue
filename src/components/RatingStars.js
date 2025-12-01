// src/components/RatingStars.js
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';

export default function RatingStars({ value = 0, onChange }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {[1,2,3,4,5].map((n) => (
        <TouchableOpacity key={n} onPress={() => onChange && onChange(n)} style={{ padding: 4 }}>
          <Icon name={n <= value ? 'star' : 'star-outline'} size={24} color={colors.pink} />
        </TouchableOpacity>
      ))}
    </View>
  );
}
