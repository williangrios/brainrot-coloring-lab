import React from 'react'
import { G, Path, Circle, Ellipse, Line } from 'react-native-svg'
import { PartProps } from '../types'

const ChefBody: React.FC<PartProps> = ({ fills, onRegionPress }) => {
  const p = (id: string) => ({
    fill: fills[id] || 'white',
    stroke: '#222',
    strokeWidth: 3,
    strokeLinejoin: 'round' as const,
    onPress: () => onRegionPress?.(id),
  })

  return (
    <G>
      {/* Neck */}
      <Path d="M182,210 L182,235 L218,235 L218,210" {...p('neck')} />

      {/* Chef jacket */}
      <Path
        d="M120,240 Q108,242 100,260 L95,350 Q95,400 145,410 Q170,415 200,415 Q230,415 255,410 Q305,400 305,350 L300,260 Q292,242 280,240 Z"
        {...p('jacket')}
      />

      {/* Apron */}
      <Path
        d="M150,280 L145,410 Q170,418 200,418 Q230,418 255,410 L250,280 Z"
        {...p('apron')}
      />

      {/* Apron strings */}
      <Path d="M150,280 Q120,290 115,300" stroke="#222" strokeWidth={2} fill="none" />
      <Path d="M250,280 Q280,290 285,300" stroke="#222" strokeWidth={2} fill="none" />

      {/* Jacket buttons */}
      <Circle cx={200} cy={265} r={4} fill="#222" />
      <Circle cx={200} cy={285} r={4} fill="#222" />

      {/* Big belly curve (under apron) */}
      <Path
        d="M150,320 Q155,380 200,390 Q245,380 250,320"
        stroke="#222"
        strokeWidth={1.5}
        fill="none"
        opacity={0.3}
      />

      {/* Left arm with spatula */}
      <Path
        d="M120,240 Q90,250 80,280 Q72,310 78,340 Q82,355 95,350 Q105,340 100,310 L105,275 Q110,255 120,250"
        {...p('left_arm')}
      />
      {/* Spatula */}
      <Path d="M78,340 L65,370 L55,365 L50,380 L70,385 L75,370 L65,375" {...p('spatula')} />

      {/* Right arm */}
      <Path
        d="M280,240 Q310,250 320,280 Q328,310 322,340 Q318,355 305,350 Q295,340 300,310 L295,275 Q290,255 280,250"
        {...p('right_arm')}
      />

      {/* Towel on shoulder */}
      <Path
        d="M275,245 L290,240 L295,270 L278,275 Z"
        {...p('towel')}
      />

      {/* Pants */}
      <Path
        d="M145,405 L140,460 Q155,465 175,460 L195,415 Q198,413 200,415 Q202,413 205,415 L225,460 Q245,465 260,460 L255,405 Q230,415 200,418 Q170,415 145,405 Z"
        {...p('pants')}
      />
    </G>
  )
}

export default ChefBody
