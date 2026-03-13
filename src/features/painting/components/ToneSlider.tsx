import React, { useMemo } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { generateTones } from '../utils/colorUtils'

interface ToneSliderProps {
  baseColor: string
  selectedColor: string
  onSelectColor: (color: string) => void
}

const ToneSlider: React.FC<ToneSliderProps> = ({ baseColor, selectedColor, onSelectColor }) => {
  const tones = useMemo(() => generateTones(baseColor, 7), [baseColor])

  return (
    <View style={styles.container}>
      {/* Gradient background */}
      <View style={styles.track}>
        {tones.map((tone, i) => (
          <View key={i} style={[styles.trackSegment, { backgroundColor: tone }]} />
        ))}
      </View>
      {/* Selectable circles */}
      <View style={styles.circles}>
        {tones.map((tone, i) => {
          const isSelected = selectedColor.toLowerCase() === tone.toLowerCase()
          return (
            <TouchableOpacity
              key={i}
              style={[styles.circle, { backgroundColor: tone }, isSelected && styles.circleSelected]}
              onPress={() => onSelectColor(tone)}
              activeOpacity={0.7}
            />
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    position: 'relative',
  },
  track: {
    flexDirection: 'row',
    height: 28,
    borderRadius: 14,
    overflow: 'hidden',
  },
  trackSegment: {
    flex: 1,
  },
  circles: {
    position: 'absolute',
    top: 6,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 28,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  circleSelected: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#fff',
  },
})

export default ToneSlider
