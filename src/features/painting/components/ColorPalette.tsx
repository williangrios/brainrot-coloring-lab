import React from 'react'
import { View, TouchableOpacity, ScrollView, StyleSheet, Text } from 'react-native'

const COLOR_GROUPS = [
  {
    name: 'Reds',
    colors: ['#FF0000', '#FF1744', '#FF4081', '#F50057', '#D50000', '#C62828', '#B71C1C', '#880E4F', '#FF5252', '#FF8A80'],
  },
  {
    name: 'Oranges',
    colors: ['#FF6D00', '#FF9100', '#FFAB40', '#FFB74D', '#FF8F00', '#EF6C00', '#E65100', '#FF6E40', '#FFAB91', '#FF7043'],
  },
  {
    name: 'Yellows',
    colors: ['#FFD600', '#FFEA00', '#FDD835', '#FBC02D', '#F9A825', '#F57F17', '#FFE082', '#FFD54F', '#FFF176', '#FFEE58'],
  },
  {
    name: 'Greens',
    colors: ['#00E676', '#69F0AE', '#00C853', '#2E7D32', '#1B5E20', '#4CAF50', '#81C784', '#A5D6A7', '#00BFA5', '#64FFDA'],
  },
  {
    name: 'Blues',
    colors: ['#2979FF', '#448AFF', '#82B1FF', '#2196F3', '#1976D2', '#0D47A1', '#00BCD4', '#0097A7', '#40C4FF', '#80D8FF'],
  },
  {
    name: 'Purples',
    colors: ['#7C4DFF', '#B388FF', '#D500F9', '#AA00FF', '#9C27B0', '#6A1B9A', '#4A148C', '#E040FB', '#EA80FC', '#CE93D8'],
  },
  {
    name: 'Skin',
    colors: ['#FFDBAC', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#FFDAB9', '#DEB887', '#D2B48C', '#BC8F8F', '#F5DEB3'],
  },
  {
    name: 'Neutrals',
    colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575', '#616161', '#424242', '#212121', '#000000'],
  },
  {
    name: 'Browns',
    colors: ['#795548', '#8D6E63', '#A1887F', '#6D4C41', '#5D4037', '#4E342E', '#3E2723', '#BCAAA4', '#D7CCC8', '#EFEBE9'],
  },
]

interface ColorPaletteProps {
  selectedColor: string
  onSelectColor: (color: string) => void
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ selectedColor, onSelectColor }) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.groupScroll}>
        {COLOR_GROUPS.map((group) => (
          <View key={group.name} style={styles.group}>
            <Text style={styles.groupLabel}>{group.name}</Text>
            <View style={styles.colorsRow}>
              {group.colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  onPress={() => onSelectColor(color)}
                  style={[
                    styles.dot,
                    { backgroundColor: color },
                    color === '#FFFFFF' && styles.whiteDot,
                    selectedColor === color && styles.dotSelected,
                  ]}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 8,
    paddingBottom: 4,
  },
  groupScroll: {
    paddingHorizontal: 12,
    gap: 16,
  },
  group: {
    alignItems: 'center',
  },
  groupLabel: {
    color: '#666',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  colorsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  whiteDot: {
    borderColor: '#444',
  },
  dotSelected: {
    borderColor: '#00ff88',
    borderWidth: 3,
    transform: [{ scale: 1.15 }],
  },
})

export default ColorPalette
