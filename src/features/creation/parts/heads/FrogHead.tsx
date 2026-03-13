import React from 'react'
import { G, Path, Circle, Ellipse } from 'react-native-svg'
import { PartProps } from '../types'

const FrogHead: React.FC<PartProps> = ({ fills, onRegionPress }) => {
  const p = (id: string) => ({
    fill: fills[id] || 'white',
    stroke: '#222',
    strokeWidth: 3,
    strokeLinejoin: 'round' as const,
    onPress: () => onRegionPress?.(id),
  })

  return (
    <G>
      {/* Bulging eyes (on top of head) */}
      <Circle cx={155} cy={55} r={30} {...p('left_eye')} />
      <Circle cx={245} cy={55} r={30} {...p('right_eye')} />
      <Circle cx={155} cy={55} r={12} fill="#222" />
      <Circle cx={245} cy={55} r={12} fill="#222" />
      <Circle cx={150} cy={50} r={4} fill="white" />
      <Circle cx={240} cy={50} r={4} fill="white" />

      {/* Main face - wide and flat */}
      <Path
        d="M120,75 Q100,85 100,130 Q100,185 150,205 Q175,215 200,215 Q225,215 250,205 Q300,185 300,130 Q300,85 280,75 Z"
        {...p('face')}
      />

      {/* Wide smile */}
      <Path
        d="M130,160 Q150,200 200,205 Q250,200 270,160"
        stroke="#222"
        strokeWidth={3}
        fill="none"
      />

      {/* Nostrils */}
      <Circle cx={185} cy={130} r={5} fill="#222" />
      <Circle cx={215} cy={130} r={5} fill="#222" />

      {/* Crown (pepe king style) */}
      <Path
        d="M148,78 L135,30 L155,55 L175,20 L195,55 L205,55 L225,20 L245,55 L265,30 L252,78"
        {...p('crown')}
      />
    </G>
  )
}

export default FrogHead
