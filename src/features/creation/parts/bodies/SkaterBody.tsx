import React from 'react'
import { G, Path, Rect, Circle, Ellipse } from 'react-native-svg'
import { PartProps } from '../types'

const SkaterBody: React.FC<PartProps> = ({ fills, onRegionPress }) => {
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
      <Rect x={182} y={210} width={36} height={25} {...p('neck')} />

      {/* Hoodie */}
      <Path
        d="M130,235 Q115,238 110,255 L105,340 Q108,380 150,390 Q175,395 200,395 Q225,395 250,390 Q292,380 295,340 L290,255 Q285,238 270,235 Z"
        {...p('hoodie')}
      />

      {/* Hood */}
      <Path
        d="M155,235 Q160,220 180,215 L220,215 Q240,220 245,235"
        {...p('hood')}
      />

      {/* Hoodie pocket */}
      <Path
        d="M155,330 Q155,350 180,355 Q200,358 220,355 Q245,350 245,330 L155,330 Z"
        {...p('pocket')}
      />

      {/* Hoodie strings */}
      <Path d="M185,235 L180,270" stroke="#222" strokeWidth={2} fill="none" />
      <Path d="M215,235 L220,270" stroke="#222" strokeWidth={2} fill="none" />

      {/* Left arm (in pocket) */}
      <Path
        d="M130,240 Q100,250 90,280 Q85,310 95,335 Q100,345 110,340 L155,335"
        {...p('left_arm')}
      />

      {/* Right arm (hanging) */}
      <Path
        d="M270,240 Q300,250 310,280 Q315,310 312,340 Q310,370 305,390 Q300,400 290,395 Q285,385 290,360 Q292,330 288,300 Q285,270 270,255"
        {...p('right_arm')}
      />

      {/* Baggy pants */}
      <Path
        d="M145,388 L135,455 Q140,468 175,470 L195,398 Q200,395 205,398 L225,470 Q260,468 265,455 L255,388 Q225,398 200,398 Q175,398 145,388 Z"
        {...p('pants')}
      />

      {/* Sneakers */}
      <Path d="M130,455 L135,455 Q140,480 175,480 L180,470 L175,470 Q150,468 140,460 L130,462 Z" {...p('left_shoe')} />
      <Path d="M270,455 L265,455 Q260,480 225,480 L220,470 L225,470 Q250,468 260,460 L270,462 Z" {...p('right_shoe')} />

      {/* Skateboard under feet */}
      <Path
        d="M115,480 Q110,475 115,472 L285,472 Q290,475 285,480 L115,480 Z"
        {...p('skateboard')}
      />
      {/* Wheels */}
      <Circle cx={140} cy={485} r={7} {...p('wheel1')} />
      <Circle cx={260} cy={485} r={7} {...p('wheel2')} />
    </G>
  )
}

export default SkaterBody
