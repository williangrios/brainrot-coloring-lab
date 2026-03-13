import React from 'react'
import { G, Path, Circle, Ellipse } from 'react-native-svg'
import { PartProps } from '../types'

const CapybaraHead: React.FC<PartProps> = ({ fills, onRegionPress }) => {
  const p = (id: string) => ({
    fill: fills[id] || 'white',
    stroke: '#222',
    strokeWidth: 3,
    strokeLinejoin: 'round' as const,
    onPress: () => onRegionPress?.(id),
  })

  return (
    <G>
      {/* Ears */}
      <Ellipse cx={145} cy={52} rx={18} ry={14} {...p('left_ear')} />
      <Ellipse cx={255} cy={52} rx={18} ry={14} {...p('right_ear')} />

      {/* Main face */}
      <Path
        d="M140,60 Q100,60 95,110 Q88,170 140,190 Q170,210 200,210 Q230,210 260,190 Q312,170 305,110 Q300,60 260,60 Z"
        {...p('face')}
      />

      {/* Snout / nose area */}
      <Ellipse cx={200} cy={155} rx={45} ry={30} {...p('snout')} />

      {/* Nose */}
      <Ellipse cx={200} cy={142} rx={14} ry={10} {...p('nose')} />

      {/* Eyes - relaxed/half-closed capybara style */}
      <Path
        d="M155,100 Q165,90 175,100 Q165,105 155,100 Z"
        {...p('left_eye')}
      />
      <Path
        d="M225,100 Q235,90 245,100 Q235,105 225,100 Z"
        {...p('right_eye')}
      />

      {/* Buck teeth */}
      <Path
        d="M190,185 L190,200 Q195,205 200,200 L200,185 Z"
        {...p('left_tooth')}
      />
      <Path
        d="M200,185 L200,200 Q205,205 210,200 L210,185 Z"
        {...p('right_tooth')}
      />

      {/* Whisker dots */}
      <Circle cx={155} cy={155} r={3} {...p('whisker1')} />
      <Circle cx={140} cy={165} r={3} {...p('whisker2')} />
      <Circle cx={245} cy={155} r={3} {...p('whisker3')} />
      <Circle cx={260} cy={165} r={3} {...p('whisker4')} />
    </G>
  )
}

export default CapybaraHead
