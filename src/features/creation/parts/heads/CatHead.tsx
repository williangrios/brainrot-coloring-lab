import React from 'react'
import { G, Path, Circle, Line } from 'react-native-svg'
import { PartProps } from '../types'

const CatHead: React.FC<PartProps> = ({ fills, onRegionPress }) => {
  const p = (id: string) => ({
    fill: fills[id] || 'white',
    stroke: '#222',
    strokeWidth: 3,
    strokeLinejoin: 'round' as const,
    onPress: () => onRegionPress?.(id),
  })

  return (
    <G>
      {/* Pointy ears */}
      <Path d="M135,80 L120,25 L170,70 Z" {...p('left_ear')} />
      <Path d="M265,80 L280,25 L230,70 Z" {...p('right_ear')} />

      {/* Inner ears */}
      <Path d="M140,75 L130,40 L162,68 Z" {...p('left_inner_ear')} />
      <Path d="M260,75 L270,40 L238,68 Z" {...p('right_inner_ear')} />

      {/* Main face */}
      <Path
        d="M130,75 Q100,90 100,135 Q100,195 160,215 Q180,220 200,220 Q220,220 240,215 Q300,195 300,135 Q300,90 270,75 Z"
        {...p('face')}
      />

      {/* Laser eyes - star/diamond shaped */}
      <Path
        d="M160,115 L150,105 L140,115 L150,125 Z"
        {...p('left_eye')}
      />
      <Path
        d="M260,115 L250,105 L240,115 L250,125 Z"
        {...p('right_eye')}
      />
      {/* Laser beams */}
      <Line x1={140} y1={115} x2={115} y2={110} stroke="red" strokeWidth={2} />
      <Line x1={140} y1={115} x2={118} y2={120} stroke="red" strokeWidth={2} />
      <Line x1={260} y1={115} x2={285} y2={110} stroke="red" strokeWidth={2} />
      <Line x1={260} y1={115} x2={282} y2={120} stroke="red" strokeWidth={2} />

      {/* Nose */}
      <Path d="M195,150 L200,157 L205,150 Z" fill="#222" stroke="#222" strokeWidth={2} />

      {/* Smirk mouth */}
      <Path
        d="M175,170 Q190,180 200,175 Q215,185 235,172"
        stroke="#222"
        strokeWidth={2.5}
        fill="none"
      />

      {/* Whiskers */}
      <Line x1={100} y1={145} x2={160} y2={155} stroke="#222" strokeWidth={2} />
      <Line x1={95} y1={162} x2={158} y2={165} stroke="#222" strokeWidth={2} />
      <Line x1={105} y1={180} x2={162} y2={175} stroke="#222" strokeWidth={2} />
      <Line x1={300} y1={145} x2={240} y2={155} stroke="#222" strokeWidth={2} />
      <Line x1={305} y1={162} x2={242} y2={165} stroke="#222" strokeWidth={2} />
      <Line x1={295} y1={180} x2={238} y2={175} stroke="#222" strokeWidth={2} />
    </G>
  )
}

export default CatHead
