import React from 'react'
import { G, Path, Rect, Circle, Line } from 'react-native-svg'
import { PartProps } from '../types'

const CityEnv: React.FC<PartProps> = ({ fills, onRegionPress }) => {
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

      {/* Clouds */}
      <Path
        d="M40,60 Q50,42 68,48 Q80,38 95,48 Q108,42 115,55 Q118,68 105,72 Q90,78 72,72 Q55,78 45,70 Q35,68 40,60 Z"
        {...p('cloud1')}
      />
      <Path
        d="M280,40 Q290,25 305,30 Q318,22 330,32 Q340,25 348,35 Q352,48 340,52 Q325,56 310,52 Q295,58 285,48 Q275,45 280,40 Z"
        {...p('cloud2')}
      />

      {/* Building far left */}
      <Rect x={0} y={160} width={55} height={240} {...p('building1')} />
      <Rect x={8} y={175} width={12} height={16} {...p('window1a')} />
      <Rect x={28} y={175} width={12} height={16} {...p('window1b')} />
      <Rect x={8} y={205} width={12} height={16} {...p('window1c')} />
      <Rect x={28} y={205} width={12} height={16} {...p('window1d')} />

      {/* Tall building left */}
      <Rect x={60} y={100} width={60} height={300} {...p('building2')} />
      <Rect x={70} y={115} width={14} height={18} {...p('window2a')} />
      <Rect x={92} y={115} width={14} height={18} {...p('window2b')} />
      <Rect x={70} y={148} width={14} height={18} {...p('window2c')} />
      <Rect x={92} y={148} width={14} height={18} {...p('window2d')} />
      <Rect x={70} y={181} width={14} height={18} {...p('window2e')} />
      <Rect x={92} y={181} width={14} height={18} {...p('window2f')} />
      {/* Antenna */}
      <Line x1={90} y1={100} x2={90} y2={75} stroke="#222" strokeWidth={2} />
      <Circle cx={90} cy={72} r={3} fill="#222" />

      {/* Building right side */}
      <Rect x={320} y={130} width={80} height={270} {...p('building3')} />
      <Rect x={332} y={145} width={14} height={18} {...p('window3a')} />
      <Rect x={358} y={145} width={14} height={18} {...p('window3b')} />
      <Rect x={380} y={145} width={14} height={18} {...p('window3c')} />
      <Rect x={332} y={178} width={14} height={18} {...p('window3d')} />
      <Rect x={358} y={178} width={14} height={18} {...p('window3e')} />
      <Rect x={380} y={178} width={14} height={18} {...p('window3f')} />

      {/* Small building far right */}
      <Rect x={355} y={200} width={45} height={200} {...p('building4')} />

      {/* Street lamp */}
      <Line x1={150} y1={400} x2={150} y2={320} stroke="#222" strokeWidth={3} />
      <Path d="M140,320 Q150,310 160,320" stroke="#222" strokeWidth={3} fill="none" />
      <Circle cx={150} cy={315} r={6} {...p('lamp')} />

      {/* Sign */}
      <Rect x={340} y={350} width={40} height={25} rx={3} {...p('sign')} />
      <Line x1={360} y1={375} x2={360} y2={400} stroke="#222" strokeWidth={2} />

      {/* Sidewalk */}
      <Rect x={0} y={400} width={400} height={20} {...p('sidewalk')} />

      {/* Street */}
      <Rect x={0} y={420} width={400} height={80} {...p('street')} />

      {/* Road markings */}
      <Rect x={80} y={455} width={30} height={6} rx={2} fill="#222" opacity={0.4} />
      <Rect x={180} y={455} width={30} height={6} rx={2} fill="#222" opacity={0.4} />
      <Rect x={280} y={455} width={30} height={6} rx={2} fill="#222" opacity={0.4} />
    </G>
  )
}

export default CityEnv
