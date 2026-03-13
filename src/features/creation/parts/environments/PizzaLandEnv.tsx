import React from 'react'
import { G, Path, Circle, Ellipse, Rect } from 'react-native-svg'
import { PartProps } from '../types'

const PizzaLandEnv: React.FC<PartProps> = ({ fills, onRegionPress }) => {
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
      <Rect x={0} y={0} width={400} height={350} {...p('sky')} strokeWidth={0} />

      {/* Pepperoni sun */}
      <Circle cx={320} cy={70} r={40} {...p('sun')} />
      <Circle cx={305} cy={55} r={8} {...p('sun_pepperoni1')} />
      <Circle cx={330} cy={60} r={6} {...p('sun_pepperoni2')} />
      <Circle cx={315} cy={80} r={7} {...p('sun_pepperoni3')} />
      {/* Sun rays */}
      <Path d="M280,70 L265,70 M320,30 L320,15 M360,70 L375,70 M320,110 L320,125 M290,40 L280,28 M350,40 L362,28 M290,100 L280,112 M350,100 L362,112" stroke="#222" strokeWidth={2} fill="none" />

      {/* Cheese mountains */}
      <Path
        d="M0,250 L60,150 L100,200 L160,120 L220,190 L280,130 L340,180 L400,140 L400,350 L0,350 Z"
        {...p('mountains')}
      />
      {/* Melting cheese drips */}
      <Path d="M80,180 Q85,200 80,210" stroke="#222" strokeWidth={2} fill="none" />
      <Path d="M180,160 Q185,180 178,195" stroke="#222" strokeWidth={2} fill="none" />
      <Path d="M300,155 Q305,175 298,188" stroke="#222" strokeWidth={2} fill="none" />

      {/* Mushroom tree left */}
      <Rect x={55} y={350} width={15} height={50} {...p('mushroom1_stem')} />
      <Path d="M30,355 Q40,310 62,310 Q85,310 95,355 Z" {...p('mushroom1_cap')} />
      <Circle cx={55} cy={330} r={5} {...p('mushroom1_dot1')} />
      <Circle cx={70} cy={335} r={4} {...p('mushroom1_dot2')} />

      {/* Mushroom tree right */}
      <Rect x={310} y={360} width={12} height={40} {...p('mushroom2_stem')} />
      <Path d="M290,365 Q298,330 316,330 Q334,330 342,365 Z" {...p('mushroom2_cap')} />
      <Circle cx={310} cy={345} r={4} {...p('mushroom2_dot1')} />
      <Circle cx={325} cy={348} r={3} {...p('mushroom2_dot2')} />

      {/* Pizza ground */}
      <Path
        d="M0,420 Q50,415 100,418 Q200,412 300,418 Q350,415 400,420 L400,500 L0,500 Z"
        {...p('ground')}
      />

      {/* Pepperoni on ground */}
      <Ellipse cx={80} cy={460} rx={15} ry={10} {...p('ground_pepperoni1')} />
      <Ellipse cx={250} cy={450} rx={12} ry={8} {...p('ground_pepperoni2')} />
      <Ellipse cx={350} cy={470} rx={13} ry={9} {...p('ground_pepperoni3')} />

      {/* Olive */}
      <Circle cx={170} cy={465} r={10} {...p('olive')} />
      <Circle cx={170} cy={465} r={4} {...p('olive_hole')} />

      {/* Cheese clouds */}
      <Path
        d="M50,50 Q60,30 80,35 Q95,25 110,35 Q125,28 135,40 Q140,55 125,60 Q110,65 95,60 Q75,68 60,60 Q45,60 50,50 Z"
        {...p('cloud1')}
      />
      <Path
        d="M180,80 Q190,65 205,68 Q218,60 228,70 Q238,62 248,72 Q255,85 240,90 Q225,95 210,90 Q195,95 185,88 Q175,85 180,80 Z"
        {...p('cloud2')}
      />
    </G>
  )
}

export default PizzaLandEnv
