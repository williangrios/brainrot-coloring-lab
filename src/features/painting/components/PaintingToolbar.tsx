import React from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { PaintBucket, Paintbrush, Wind, Eraser } from 'lucide-react-native'

export type ToolType = 'fill' | 'brush' | 'eraser' | 'spray'

interface Tool {
  id: ToolType
  label: string
  Icon: React.FC<any>
}

const TOOLS: Tool[] = [
  { id: 'fill', label: 'Fill', Icon: PaintBucket },
  { id: 'brush', label: 'Brush', Icon: Paintbrush },
  { id: 'spray', label: 'Spray', Icon: Wind },
  { id: 'eraser', label: 'Eraser', Icon: Eraser },
]

interface PaintingToolbarProps {
  selectedTool: ToolType
  onSelectTool: (tool: ToolType) => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  labels?: { fill: string; brush: string; spray: string; eraser: string }
}

const PaintingToolbar: React.FC<PaintingToolbarProps> = ({
  selectedTool,
  onSelectTool,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  labels,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.historyGroup}>
        <TouchableOpacity
          style={[styles.historyBtn, !canUndo && styles.historyBtnDisabled]}
          onPress={onUndo}
          disabled={!canUndo}
        >
          <Text style={[styles.historyIcon, !canUndo && styles.historyIconDisabled]}>↩</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.historyBtn, !canRedo && styles.historyBtnDisabled]}
          onPress={onRedo}
          disabled={!canRedo}
        >
          <Text style={[styles.historyIcon, !canRedo && styles.historyIconDisabled]}>↪</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toolsGroup}>
        {TOOLS.map((tool) => {
          const isSelected = selectedTool === tool.id
          const label = labels?.[tool.id] || tool.label
          return (
            <TouchableOpacity
              key={tool.id}
              style={[styles.toolBtn, isSelected && styles.toolBtnSelected]}
              onPress={() => onSelectTool(tool.id)}
            >
              <tool.Icon color={isSelected ? '#00ff88' : '#888'} size={20} />
              <Text style={[styles.toolLabel, isSelected && styles.toolLabelSelected]}>{label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: '#333', gap: 8 },
  historyGroup: { flexDirection: 'row', gap: 4, marginRight: 8 },
  historyBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2a2a2a', alignItems: 'center', justifyContent: 'center' },
  historyBtnDisabled: { opacity: 0.3 },
  historyIcon: { color: '#fff', fontSize: 18 },
  historyIconDisabled: { color: '#666' },
  toolsGroup: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  toolBtn: { alignItems: 'center', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 10 },
  toolBtnSelected: { backgroundColor: '#0a2a18' },
  toolLabel: { color: '#888', fontSize: 10, fontWeight: '600', marginTop: 2 },
  toolLabelSelected: { color: '#00ff88' },
})

export default PaintingToolbar
