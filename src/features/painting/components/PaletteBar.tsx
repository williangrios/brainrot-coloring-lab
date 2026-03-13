import React, { useState, useCallback } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { PALETTES } from '../data/palettes'
import { useLanguage } from '../../../i18n/LanguageContext'

interface PaletteBarProps {
  selectedColor: string
  onSelectColor: (color: string) => void
  recentColors: string[]
}

const PaletteBar: React.FC<PaletteBarProps> = ({ selectedColor, onSelectColor, recentColors }) => {
  const { t } = useLanguage()
  const [paletteIndex, setPaletteIndex] = useState(0)

  const allPalettes = [
    ...PALETTES,
    { id: 'recent', nameKey: 'palette_recent', colors: recentColors.slice(0, 10) },
  ]

  const currentPalette = allPalettes[paletteIndex]

  const handlePrev = useCallback(() => {
    setPaletteIndex((i) => (i - 1 + allPalettes.length) % allPalettes.length)
  }, [allPalettes.length])

  const handleNext = useCallback(() => {
    setPaletteIndex((i) => (i + 1) % allPalettes.length)
  }, [allPalettes.length])

  return (
    <View style={styles.wrapper}>
      {/* Color swatches */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.swatches}
      >
        {currentPalette.colors.map((color, i) => {
          const isSelected = selectedColor.toLowerCase() === color.toLowerCase()
          return (
            <TouchableOpacity
              key={`${color}-${i}`}
              style={[
                styles.swatch,
                { backgroundColor: color },
                isSelected && styles.swatchSelected,
                color.toLowerCase() === '#ffffff' && styles.swatchWhite,
              ]}
              onPress={() => onSelectColor(color)}
              activeOpacity={0.7}
            />
          )
        })}
      </ScrollView>

      {/* Palette navigation */}
      <View style={styles.navRow}>
        <TouchableOpacity onPress={handlePrev} style={styles.navBtn}>
          <Text style={styles.navArrow}>‹</Text>
        </TouchableOpacity>
        <View style={styles.navCenter}>
          <Text style={styles.paletteName}>{t(currentPalette.nameKey)}</Text>
        </View>
        <TouchableOpacity onPress={handleNext} style={styles.navBtn}>
          <Text style={styles.navArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {},
  swatches: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
    alignItems: 'center',
  },
  swatch: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: {
    borderColor: '#00ff88',
    transform: [{ scale: 1.15 }],
  },
  swatchWhite: {
    borderColor: '#444',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navArrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  navCenter: {
    flex: 1,
    alignItems: 'center',
  },
  paletteName: {
    color: '#ccc',
    fontSize: 13,
    fontWeight: '600',
  },
})

export default PaletteBar
