import React from 'react'
import { G, Path, Circle, Ellipse } from 'react-native-svg'
import { PartProps } from '../types'

const AlienHead: React.FC<PartProps> = ({ fills, onRegionPress }) => {
  const p = (id: string) => ({
    fill: fills[id] || 'white',
    stroke: '#222',
    strokeWidth: 3,
    strokeLinejoin: 'round' as const,
    onPress: () => onRegionPress?.(id),
  })

  return (
    <G>
      {/* Antennae */}
      <Path d="M165,55 Q155,20 145,10" stroke="#222" strokeWidth={3} fill="none" />
      <Circle cx={145} cy={10} r={8} {...p('left_antenna_ball')} />
      <Path d="M235,55 Q245,20 255,10" stroke="#222" strokeWidth={3} fill="none" />
      <Circle cx={255} cy={10} r={8} {...p('right_antenna_ball')} />

      {/* Big dome head (inverted egg - wide on top) */}
      <Path
        d="M130,140 Q110,100 120,65 Q135,35 200,30 Q265,35 280,65 Q290,100 270,140 Q260,190 240,210 Q220,220 200,222 Q180,220 160,210 Q140,190 130,140 Z"
        {...p('head')}
      />

      {/* Huge almond eyes */}
      <Path
        d="M135,105 Q155,75 190,100 Q165,130 135,105 Z"
        {...p('left_eye')}
      />
      <Path
        d="M265,105 Q245,75 210,100 Q235,130 265,105 Z"
        {...p('right_eye')}
      />
      {/* Pupils */}
      <Ellipse cx={165} cy={103} rx={8} ry={10} fill="#222" />
      <Ellipse cx={235} cy={103} rx={8} ry={10} fill="#222" />
      <Circle cx={162} cy={98} r={3} fill="white" />
      <Circle cx={232} cy={98} r={3} fill="white" />

      {/* Tiny slit mouth */}
      <Path
        d="M188,175 Q200,182 212,175"
        stroke="#222"
        strokeWidth={2.5}
        fill="none"
      />

      {/* Brain texture lines on dome */}
      <Path d="M165,50 Q180,60 175,75" stroke="#222" strokeWidth={1.5} fill="none" opacity={0.4} />
      <Path d="M220,45 Q235,58 225,70" stroke="#222" strokeWidth={1.5} fill="none" opacity={0.4} />
      <Path d="M195,38 Q200,52 210,48" stroke="#222" strokeWidth={1.5} fill="none" opacity={0.4} />
    </G>
  )
}

export default AlienHead
