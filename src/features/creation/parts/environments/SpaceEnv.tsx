import React from 'react'
import { G, Path, Circle, Ellipse, Rect } from 'react-native-svg'
import { PartProps } from '../types'

const SpaceEnv: React.FC<PartProps> = ({ fills, onRegionPress }) => {
  const p = (id: string) => ({
    fill: fills[id] || 'white',
    stroke: '#222',
    strokeWidth: 2,
    strokeLinejoin: 'round' as const,
    onPress: () => onRegionPress?.(id),
  })

  return (
    <G>
      {/* Sky background */}
      <Rect x={0} y={0} width={400} height={500} {...p('sky')} strokeWidth={0} />

      {/* Planet with rings */}
      <Circle cx={320} cy={80} r={40} {...p('planet')} />
      <Ellipse cx={320} cy={80} rx={65} ry={15} {...p('planet_ring')} />

      {/* Moon */}
      <Circle cx={60} cy={60} r={25} {...p('moon')} />
      <Circle cx={52} cy={52} r={5} {...p('moon_crater1')} />
      <Circle cx={70} cy={65} r={4} {...p('moon_crater2')} />
      <Circle cx={58} cy={72} r={3} {...p('moon_crater3')} />

      {/* Stars (decorative) */}
      <Path d="M150,30 L153,40 L163,40 L155,46 L158,56 L150,50 L142,56 L145,46 L137,40 L147,40 Z" {...p('star1')} />
      <Path d="M250,140 L252,147 L259,147 L254,151 L256,158 L250,154 L244,158 L246,151 L241,147 L248,147 Z" {...p('star2')} />
      <Path d="M40,150 L42,157 L49,157 L44,161 L46,168 L40,164 L34,168 L36,161 L31,157 L38,157 Z" {...p('star3')} />

      {/* Small stars */}
      <Circle cx={100} cy={20} r={2} fill="#222" />
      <Circle cx={200} cy={50} r={2} fill="#222" />
      <Circle cx={340} cy={160} r={2} fill="#222" />
      <Circle cx={380} cy={40} r={2} fill="#222" />
      <Circle cx={20} cy={120} r={2} fill="#222" />
      <Circle cx={300} cy={200} r={2} fill="#222" />

      {/* Rocket */}
      <Path
        d="M355,400 L365,350 Q370,330 370,340 L380,400 Z"
        {...p('rocket_body')}
      />
      <Path d="M360,400 L355,420 L365,415 L370,400 Z" {...p('rocket_fin_left')} />
      <Path d="M375,400 L380,420 L370,415 L365,400 Z" {...p('rocket_fin_right')} />
      <Circle cx={368} cy={370} r={5} {...p('rocket_window')} />
      {/* Flame */}
      <Path d="M358,420 Q365,445 368,420 Q371,445 378,420" {...p('rocket_flame')} />

      {/* Floating asteroid */}
      <Path
        d="M30,350 Q20,330 35,320 Q55,315 65,330 Q75,345 60,360 Q40,365 30,350 Z"
        {...p('asteroid')}
      />
      <Circle cx={42} cy={338} r={4} {...p('asteroid_crater')} />

      {/* Ground (space station floor) */}
      <Path
        d="M0,460 Q100,450 200,455 Q300,450 400,460 L400,500 L0,500 Z"
        {...p('ground')}
      />
    </G>
  )
}

export default SpaceEnv
