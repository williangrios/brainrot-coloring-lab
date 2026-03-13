import React from 'react'
import { G, Path, Circle, Ellipse, Rect } from 'react-native-svg'
import { PartProps } from '../types'

const SkibidiHead: React.FC<PartProps> = ({ fills, onRegionPress }) => {
  const p = (id: string) => ({
    fill: fills[id] || 'white',
    stroke: '#222',
    strokeWidth: 3,
    strokeLinejoin: 'round' as const,
    onPress: () => onRegionPress?.(id),
  })

  return (
    <G>
      {/* Toilet lid (top) */}
      <Path
        d="M130,65 Q130,40 200,38 Q270,40 270,65 Q270,80 200,82 Q130,80 130,65 Z"
        {...p('lid')}
      />

      {/* Toilet bowl (main head) */}
      <Path
        d="M125,80 Q110,80 108,130 Q105,180 145,210 Q170,225 200,225 Q230,225 255,210 Q295,180 292,130 Q290,80 275,80 Z"
        {...p('bowl')}
      />

      {/* Handle on side */}
      <Path
        d="M290,105 L310,100 Q320,105 318,120 L295,125"
        {...p('handle')}
        fill="none"
      />

      {/* Crazy spiral left eye */}
      <Circle cx={170} cy={125} r={22} {...p('left_eye_outer')} />
      <Path
        d="M170,108 Q180,115 170,125 Q160,132 170,140"
        stroke="#222"
        strokeWidth={2.5}
        fill="none"
      />
      <Circle cx={170} cy={125} r={5} fill="#222" />

      {/* Crazy spiral right eye */}
      <Circle cx={230} cy={125} r={22} {...p('right_eye_outer')} />
      <Path
        d="M230,108 Q240,115 230,125 Q220,132 230,140"
        stroke="#222"
        strokeWidth={2.5}
        fill="none"
      />
      <Circle cx={230} cy={125} r={5} fill="#222" />

      {/* Screaming mouth */}
      <Ellipse cx={200} cy={185} rx={30} ry={22} {...p('mouth')} />
      <Path
        d="M180,178 L185,185 L190,178 L195,185 L200,178 L205,185 L210,178 L215,185 L220,178"
        stroke="#222"
        strokeWidth={2}
        fill="none"
      />
    </G>
  )
}

export default SkibidiHead
