import React from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { TOOLS, ToolType } from '../data/tools'
import { useLanguage } from '../../../i18n/LanguageContext'

interface ToolBarProps {
  selectedTool: ToolType
  onSelectTool: (tool: ToolType) => void
}

const ToolBar: React.FC<ToolBarProps> = ({ selectedTool, onSelectTool }) => {
  const { t } = useLanguage()

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {TOOLS.filter((tool) => tool.id !== 'eyedropper').map((tool) => {
        const isSelected = selectedTool === tool.id
        return (
          <TouchableOpacity
            key={tool.id}
            style={[styles.toolBtn, isSelected && styles.toolBtnSelected]}
            onPress={() => onSelectTool(tool.id)}
            activeOpacity={0.6}
          >
            <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
              <Text style={styles.emoji}>{tool.emoji}</Text>
            </View>
            <Text style={[styles.label, isSelected && styles.labelSelected]} numberOfLines={1}>
              {t(tool.nameKey)}
            </Text>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
    alignItems: 'center',
  },
  toolBtn: {
    alignItems: 'center',
    width: 56,
  },
  toolBtnSelected: {},
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconCircleSelected: {
    borderColor: '#00ff88',
    backgroundColor: '#0a2a18',
  },
  emoji: {
    fontSize: 20,
  },
  label: {
    color: '#888',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  labelSelected: {
    color: '#00ff88',
  },
})

export default ToolBar
