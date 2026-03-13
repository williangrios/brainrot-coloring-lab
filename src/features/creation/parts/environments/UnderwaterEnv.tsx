import React from 'react'
import { G, Path, Circle, Ellipse, Rect } from 'react-native-svg'
import { PartProps } from '../types'

const UnderwaterEnv: React.FC<PartProps> = ({ fills, onRegionPress }) => {
  const p = (id: string) => ({
    fill: fills[id] || 'white',
    stroke: '#222',
    strokeWidth: 2,
    strokeLinejoin: 'round' as const,
    onPress: () => onRegionPress?.(id),
  })

  return (
    <G>
      {/* Water background */}
      <Rect x={0} y={0} width={400} height={500} {...p('water')} strokeWidth={0} />

      {/* Light rays from surface */}
      <Path d="M150,0 L130,80 L170,80 Z" fill="#222" opacity={0.05} />
      <Path d="M250,0 L230,90 L270,90 Z" fill="#222" opacity={0.05} />

      {/* Bubbles */}
      <Circle cx={50} cy={100} r={10} {...p('bubble1')} />
      <Circle cx={65} cy={70} r={6} {...p('bubble2')} />
      <Circle cx={45} cy={55} r={4} {...p('bubble3')} />
      <Circle cx={340} cy={150} r={12} {...p('bubble4')} />
      <Circle cx={360} cy={120} r={7} {...p('bubble5')} />
      <Circle cx={350} cy={90} r={4} {...p('bubble6')} />

      {/* Fish left */}
      <Path
        d="M30,200 Q45,185 65,195 Q80,200 75,210 Q65,220 45,215 Q30,215 30,200 Z"
        {...p('fish1_body')}
      />
      <Path d="M30,200 L15,190 L15,215 L30,207 Z" {...p('fish1_tail')} />
      <Circle cx={62} cy={200} r={3} fill="#222" />

      {/* Fish right */}
      <Path
        d="M370,280 Q355,268 335,275 Q320,282 325,290 Q335,300 355,295 Q370,292 370,280 Z"
        {...p('fish2_body')}
      />
      <Path d="M370,280 L385,272 L385,298 L370,288 Z" {...p('fish2_tail')} />
      <Circle cx={338} cy={282} r={3} fill="#222" />

      {/* Seaweed left */}
      <Path
        d="M20,500 Q15,460 25,440 Q35,420 25,400 Q15,380 25,360 Q32,345 28,330"
        stroke="#222"
        strokeWidth={3}
        fill="none"
      />
      <Path
        d="M20,500 Q30,470 22,450 Q14,430 24,410"
        {...p('seaweed1')}
      />

      {/* Seaweed right */}
      <Path
        d="M380,500 Q385,455 375,435 Q365,415 375,395 Q385,375 378,355"
        stroke="#222"
        strokeWidth={3}
        fill="none"
      />
      <Path
        d="M380,500 Q370,460 378,440 Q386,420 376,400"
        {...p('seaweed2')}
      />

      {/* Coral reef */}
      <Path
        d="M100,500 Q95,470 110,455 Q120,445 115,430 Q110,420 120,410"
        stroke="#222"
        strokeWidth={3}
        fill="none"
      />
      <Path
        d="M130,500 Q135,475 125,460 Q118,450 125,440"
        stroke="#222"
        strokeWidth={3}
        fill="none"
      />
      <Path
        d="M85,480 Q90,460 110,460 Q130,460 135,480 L135,500 L85,500 Z"
        {...p('coral1')}
      />

      {/* Coral right */}
      <Path
        d="M270,490 Q275,470 290,465 Q310,462 315,480 L315,500 L270,500 Z"
        {...p('coral2')}
      />
      <Path
        d="M280,500 Q278,480 285,470 Q292,462 288,450"
        stroke="#222"
        strokeWidth={2.5}
        fill="none"
      />
      <Path
        d="M305,500 Q308,485 300,475 Q295,468 300,458"
        stroke="#222"
        strokeWidth={2.5}
        fill="none"
      />

      {/* Sandy ground */}
      <Path
        d="M0,475 Q50,468 100,472 Q200,465 300,470 Q350,467 400,475 L400,500 L0,500 Z"
        {...p('ground')}
      />

      {/* Shells on ground */}
      <Path d="M180,485 Q185,478 195,480 Q200,485 195,490 Q185,492 180,485 Z" {...p('shell1')} />
      <Path d="M320,488 Q325,482 333,484 Q337,488 333,493 Q325,494 320,488 Z" {...p('shell2')} />

      {/* Starfish */}
      <Path
        d="M230,480 L233,470 L240,476 L245,468 L246,478 L256,478 L248,484 L252,493 L243,488 L237,495 L236,485 Z"
        {...p('starfish')}
      />
    </G>
  )
}

export default UnderwaterEnv
