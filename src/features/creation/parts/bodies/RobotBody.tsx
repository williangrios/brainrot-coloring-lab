import React from 'react'
import { G, Path, Rect, Circle, Line } from 'react-native-svg'
import { PartProps } from '../types'

const RobotBody: React.FC<PartProps> = ({ fills, onRegionPress }) => {
  const p = (id: string) => ({
    fill: fills[id] || 'white',
    stroke: '#222',
    strokeWidth: 3,
    strokeLinejoin: 'round' as const,
    onPress: () => onRegionPress?.(id),
  })

  return (
    <G>
      {/* Neck (mechanical) */}
      <Rect x={178} y={210} width={44} height={25} rx={3} {...p('neck')} />
      <Line x1={180} y1={218} x2={220} y2={218} stroke="#222" strokeWidth={1.5} />
      <Line x1={180} y1={228} x2={220} y2={228} stroke="#222" strokeWidth={1.5} />

      {/* Main torso (boxy) */}
      <Rect x={125} y={235} width={150} height={140} rx={8} {...p('torso')} />

      {/* Chest panel */}
      <Rect x={155} y={260} width={90} height={60} rx={5} {...p('chest_panel')} />

      {/* Display screen on chest */}
      <Rect x={170} y={272} width={60} height={35} rx={3} {...p('screen')} />

      {/* Bolts/rivets */}
      <Circle cx={140} cy={250} r={5} {...p('bolt1')} />
      <Circle cx={260} cy={250} r={5} {...p('bolt2')} />
      <Circle cx={140} cy={360} r={5} {...p('bolt3')} />
      <Circle cx={260} cy={360} r={5} {...p('bolt4')} />

      {/* Left arm (mechanical) */}
      <Rect x={80} y={240} width={40} height={80} rx={5} {...p('left_upper_arm')} />
      <Circle cx={100} cy={325} r={12} {...p('left_joint')} />
      <Rect x={85} y={335} width={30} height={60} rx={5} {...p('left_lower_arm')} />
      {/* Claw hand */}
      <Path d="M85,395 L75,420 L90,410 L100,425 L110,410 L125,420 L115,395" {...p('left_hand')} />

      {/* Right arm (mechanical) */}
      <Rect x={280} y={240} width={40} height={80} rx={5} {...p('right_upper_arm')} />
      <Circle cx={300} cy={325} r={12} {...p('right_joint')} />
      <Rect x={285} y={335} width={30} height={60} rx={5} {...p('right_lower_arm')} />
      {/* Claw hand */}
      <Path d="M285,395 L275,420 L290,410 L300,425 L310,410 L325,420 L315,395" {...p('right_hand')} />

      {/* Legs */}
      <Rect x={145} y={380} width={40} height={70} rx={5} {...p('left_leg')} />
      <Rect x={215} y={380} width={40} height={70} rx={5} {...p('right_leg')} />

      {/* Feet */}
      <Path d="M140,445 L145,450 Q165,460 190,455 L185,445" {...p('left_foot')} />
      <Path d="M210,445 L215,450 Q235,460 260,455 L255,445" {...p('right_foot')} />
    </G>
  )
}

export default RobotBody
