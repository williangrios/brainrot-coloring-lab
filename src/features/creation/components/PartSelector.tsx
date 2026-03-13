import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { PartMeta } from '../parts/types'

interface PartSelectorProps {
  label: string
  parts: PartMeta[]
  selectedId: string
  onSelect: (id: string) => void
}

const PartSelector: React.FC<PartSelectorProps> = ({ label, parts, selectedId, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {parts.map((part) => (
          <TouchableOpacity
            key={part.id}
            style={[styles.option, selectedId === part.id && styles.optionSelected]}
            onPress={() => onSelect(part.id)}
          >
            <Text style={[styles.optionText, selectedId === part.id && styles.optionTextSelected]}>
              {part.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    marginLeft: 4,
  },
  scroll: {
    gap: 8,
    paddingHorizontal: 4,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#333',
  },
  optionSelected: {
    borderColor: '#00ff88',
    backgroundColor: '#0a2a18',
  },
  optionText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#00ff88',
  },
})

export default PartSelector
