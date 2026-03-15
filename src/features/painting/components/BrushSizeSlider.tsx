import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'

interface BrushSizeSliderProps {
  size: number
  onSizeChange: (size: number) => void
  visible: boolean
  onClose: () => void
}

const SIZES = [4, 8, 14, 22, 32]

const BrushSizeSlider: React.FC<BrushSizeSliderProps> = ({ size, onSizeChange, visible, onClose }) => {
  if (!visible) return null

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.6}>
        <Text style={styles.closeBtnText}>✕</Text>
      </TouchableOpacity>
      {SIZES.map((s) => (
        <TouchableOpacity
          key={s}
          style={[styles.sizeOption, size === s && styles.sizeOptionSelected]}
          onPress={() => onSizeChange(s)}
          activeOpacity={0.6}
        >
          <Svg width={36} height={36} viewBox="0 0 36 36">
            <Circle
              cx={18}
              cy={18}
              r={Math.min(s / 2, 16)}
              fill={size === s ? '#00ff88' : '#888'}
            />
          </Svg>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 8,
    top: '30%' as any,
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 4,
    gap: 2,
    borderWidth: 1,
    borderColor: '#333',
    zIndex: 10,
  },
  closeBtn: {
    width: 40,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '700',
  },
  sizeOption: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeOptionSelected: {
    backgroundColor: '#0a2a18',
  },
})

export default BrushSizeSlider
