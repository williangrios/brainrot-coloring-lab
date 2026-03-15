import React, { useState } from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'

interface OpacitySliderProps {
  opacity: number
  onOpacityChange: (opacity: number) => void
  visible: boolean
}

const OPACITY_VALUES = [0.2, 0.4, 0.6, 0.8, 1.0]

const OpacitySlider: React.FC<OpacitySliderProps> = ({ opacity, onOpacityChange, visible }) => {
  const [expanded, setExpanded] = useState(false)

  if (!visible) return null

  const pct = Math.round(opacity * 100)

  if (!expanded) {
    return (
      <TouchableOpacity
        style={styles.badge}
        onPress={() => setExpanded(true)}
        activeOpacity={0.6}
      >
        <Text style={styles.badgeText}>{pct}%</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.expandedContainer}>
      <Text style={styles.label}>Opacity</Text>
      <View style={styles.optionsRow}>
        {OPACITY_VALUES.map((o) => {
          const isSelected = Math.abs(opacity - o) < 0.05
          return (
            <TouchableOpacity
              key={o}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => {
                onOpacityChange(o)
                setExpanded(false)
              }}
              activeOpacity={0.6}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {Math.round(o * 100)}%
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
      <TouchableOpacity style={styles.closeBtn} onPress={() => setExpanded(false)}>
        <Text style={styles.closeBtnText}>✕</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#333',
    alignSelf: 'flex-start',
    marginTop: 6,
    marginLeft: 8,
  },
  badgeText: {
    color: '#aaa',
    fontSize: 11,
    fontWeight: '700',
  },
  expandedContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: 6,
    marginLeft: 8,
  },
  label: {
    color: '#666',
    fontSize: 9,
    fontWeight: '600',
    marginRight: 2,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  option: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#222',
  },
  optionSelected: {
    backgroundColor: '#0a2a18',
  },
  optionText: {
    color: '#888',
    fontSize: 10,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#00ff88',
  },
  closeBtn: {
    marginLeft: 4,
    paddingHorizontal: 4,
  },
  closeBtnText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '700',
  },
})

export default OpacitySlider
