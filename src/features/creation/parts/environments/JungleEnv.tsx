import React from 'react'
import { G, Path, Circle, Ellipse, Rect } from 'react-native-svg'
import { PartProps } from '../types'

const JungleEnv: React.FC<PartProps> = ({ fills, onRegionPress }) => {
  const p = (id: string) => ({
    fill: fills[id] || 'white',
    stroke: '#222',
    strokeWidth: 2,
    strokeLinejoin: 'round' as const,
    onPress: () => onRegionPress?.(id),
  })

  return (
    <G>
      {/* Sky */}
      <Rect x={0} y={0} width={400} height={300} {...p('sky')} strokeWidth={0} />

      {/* Sun peeking through */}
      <Circle cx={200} cy={40} r={30} {...p('sun')} />

      {/* Tree left (big trunk + canopy) */}
      <Rect x={10} y={150} width={40} height={250} {...p('trunk1')} />
      <Path
        d="M-20,160 Q0,80 30,70 Q60,60 90,80 Q110,100 100,160 Q60,140 -20,160 Z"
        {...p('canopy1')}
      />

      {/* Tree right */}
      <Rect x={340} y={120} width={35} height={280} {...p('trunk2')} />
      <Path
        d="M310,130 Q320,50 358,40 Q390,35 410,60 Q430,90 420,130 Q380,110 310,130 Z"
        {...p('canopy2')}
      />

      {/* Vines hanging */}
      <Path d="M70,90 Q65,130 75,160 Q80,180 72,210" stroke="#222" strokeWidth={2.5} fill="none" />
      <Path d="M80,85 Q78,120 85,150 Q88,170 82,200" stroke="#222" strokeWidth={2} fill="none" />
      <Path d="M340,60 Q335,100 345,140 Q350,170 342,200" stroke="#222" strokeWidth={2.5} fill="none" />

      {/* Leaves on vines */}
      <Path d="M72,210 Q65,215 68,222 Q75,218 72,210 Z" {...p('vine_leaf1')} />
      <Path d="M82,200 Q75,205 78,212 Q85,208 82,200 Z" {...p('vine_leaf2')} />
      <Path d="M342,200 Q335,205 338,212 Q345,208 342,200 Z" {...p('vine_leaf3')} />

      {/* Big tropical leaves (mid) */}
      <Path
        d="M0,200 Q20,180 50,190 Q70,200 60,220 Q40,230 0,220 Z"
        {...p('big_leaf1')}
      />
      <Path
        d="M400,230 Q380,210 350,220 Q330,230 340,250 Q360,260 400,248 Z"
        {...p('big_leaf2')}
      />

      {/* Mushrooms */}
      <Rect x={140} y={430} width={10} height={25} {...p('mushroom1_stem')} />
      <Path d="M128,435 Q135,415 145,415 Q155,415 162,435 Z" {...p('mushroom1_cap')} />
      <Circle cx={140} cy={425} r={3} {...p('mushroom1_dot')} />
      <Circle cx={150} cy={427} r={2} {...p('mushroom1_dot2')} />

      <Rect x={280} y={440} width={8} height={20} {...p('mushroom2_stem')} />
      <Path d="M270,445 Q275,428 284,428 Q293,428 298,445 Z" {...p('mushroom2_cap')} />

      {/* Flowers */}
      <Circle cx={100} cy={445} r={8} {...p('flower1_center')} />
      <Circle cx={100} cy={435} r={5} {...p('flower1_petal1')} />
      <Circle cx={108} cy={440} r={5} {...p('flower1_petal2')} />
      <Circle cx={108} cy={450} r={5} {...p('flower1_petal3')} />
      <Circle cx={100} cy={455} r={5} {...p('flower1_petal4')} />
      <Circle cx={92} cy={450} r={5} {...p('flower1_petal5')} />
      <Circle cx={92} cy={440} r={5} {...p('flower1_petal6')} />
      <Path d="M100,455 L100,480" stroke="#222" strokeWidth={2} />

      <Circle cx={330} cy={455} r={6} {...p('flower2_center')} />
      <Circle cx={330} cy={447} r={4} {...p('flower2_petal1')} />
      <Circle cx={336} cy={451} r={4} {...p('flower2_petal2')} />
      <Circle cx={336} cy={459} r={4} {...p('flower2_petal3')} />
      <Circle cx={330} cy={463} r={4} {...p('flower2_petal4')} />
      <Circle cx={324} cy={459} r={4} {...p('flower2_petal5')} />
      <Circle cx={324} cy={451} r={4} {...p('flower2_petal6')} />
      <Path d="M330,463 L330,485" stroke="#222" strokeWidth={2} />

      {/* Ground (jungle floor) */}
      <Path
        d="M0,400 Q50,390 100,395 Q200,385 300,392 Q350,388 400,400 L400,500 L0,500 Z"
        {...p('ground')}
      />

      {/* Grass tufts */}
      <Path d="M160,395 L165,380 L170,395" stroke="#222" strokeWidth={2} fill="none" />
      <Path d="M200,390 L205,375 L210,390" stroke="#222" strokeWidth={2} fill="none" />
      <Path d="M240,393 L245,378 L250,393" stroke="#222" strokeWidth={2} fill="none" />
    </G>
  )
}

export default JungleEnv
