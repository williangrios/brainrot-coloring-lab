import React from 'react'
import { G, Path, Rect, Line } from 'react-native-svg'
import { PartProps } from '../types'

const BuffBody: React.FC<PartProps> = ({ fills, onRegionPress }) => {
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
      <Rect x={180} y={210} width={40} height={30} {...p('neck')} />

      {/* Torso / tank top */}
      <Path
        d="M120,240 Q110,240 105,260 L100,340 Q100,380 140,390 L160,395 Q180,400 200,400 Q220,400 240,395 L260,390 Q300,380 300,340 L295,260 Q290,240 280,240 Z"
        {...p('torso')}
      />

      {/* Tank top straps */}
      <Path d="M165,240 L175,210" stroke="#222" strokeWidth={3} fill="none" />
      <Path d="M235,240 L225,210" stroke="#222" strokeWidth={3} fill="none" />

      {/* Chest line */}
      <Line x1={200} y1={260} x2={200} y2={330} stroke="#222" strokeWidth={2} opacity={0.5} />
      <Path d="M155,280 Q200,295 245,280" stroke="#222" strokeWidth={2} fill="none" opacity={0.5} />

      {/* Left arm (buff) */}
      <Path
        d="M120,240 Q85,245 70,280 Q60,310 65,340 Q68,360 80,370 Q95,375 105,360 Q115,340 110,310 L105,280 Q108,260 120,255"
        {...p('left_arm')}
      />

      {/* Right arm (buff, flexing) */}
      <Path
        d="M280,240 Q315,245 330,270 Q340,290 335,260 Q345,240 340,225 Q335,215 325,220 Q315,230 320,250 Q310,270 295,280 Q285,260 280,255"
        {...p('right_arm')}
      />

      {/* Shorts */}
      <Path
        d="M140,390 L130,450 Q135,460 170,460 L190,400 Q195,398 200,400 Q205,398 210,400 L230,460 Q265,460 270,450 L260,390 Q230,400 200,400 Q170,400 140,390 Z"
        {...p('shorts')}
      />

      {/* Belt */}
      <Path
        d="M140,388 Q170,398 200,400 Q230,398 260,388"
        stroke="#222"
        strokeWidth={3}
        fill="none"
      />
    </G>
  )
}

export default BuffBody
