import React from 'react'
import { G, Path, Rect, Line } from 'react-native-svg'
import { PartProps } from '../types'

const SuitBody: React.FC<PartProps> = ({ fills, onRegionPress }) => {
  const p = (id: string) => ({
    fill: fills[id] || 'white',
    stroke: '#222',
    strokeWidth: 3,
    strokeLinejoin: 'round' as const,
    onPress: () => onRegionPress?.(id),
  })

  return (
    <G>
      {/* Neck + collar */}
      <Rect x={182} y={210} width={36} height={20} {...p('neck')} />

      {/* Shirt collar visible */}
      <Path d="M170,230 L190,245 L200,235 L210,245 L230,230" {...p('collar')} />

      {/* Suit jacket */}
      <Path
        d="M125,235 Q110,238 105,255 L100,350 Q100,390 145,400 Q172,408 200,410 Q228,408 255,400 Q300,390 300,350 L295,255 Q290,238 275,235 Z"
        {...p('jacket')}
      />

      {/* Lapels */}
      <Path d="M170,235 L165,300 L200,310 L200,245 Z" {...p('left_lapel')} />
      <Path d="M230,235 L235,300 L200,310 L200,245 Z" {...p('right_lapel')} />

      {/* Tie */}
      <Path
        d="M195,245 L200,248 L205,245 L208,290 L200,310 L192,290 Z"
        {...p('tie')}
      />

      {/* Jacket buttons */}
      <Path d="M198,320 A3,3 0 1,1 202,320 A3,3 0 1,1 198,320" fill="#222" />
      <Path d="M198,340 A3,3 0 1,1 202,340 A3,3 0 1,1 198,340" fill="#222" />

      {/* Pocket square */}
      <Path d="M245,268 L255,260 L258,278 L248,280 Z" {...p('pocket_square')} />

      {/* Left arm */}
      <Path
        d="M125,240 Q95,250 85,280 Q78,310 82,345 Q85,370 95,380 Q105,385 110,375 Q115,355 112,325 L108,285 Q112,258 125,250"
        {...p('left_arm')}
      />

      {/* Right arm with briefcase */}
      <Path
        d="M275,240 Q305,250 315,280 Q322,310 318,345 Q315,370 305,385 Q295,390 290,380 Q285,360 288,330 L292,285 Q288,258 275,250"
        {...p('right_arm')}
      />

      {/* Briefcase */}
      <Rect x={280} y={385} width={50} height={35} rx={4} {...p('briefcase')} />
      <Line x1={290} y1={385} x2={290} y2={380} stroke="#222" strokeWidth={2} />
      <Line x1={320} y1={385} x2={320} y2={380} stroke="#222" strokeWidth={2} />
      <Path d="M290,380 Q305,374 320,380" stroke="#222" strokeWidth={2.5} fill="none" />
      <Line x1={292} y1={400} x2={328} y2={400} stroke="#222" strokeWidth={1.5} />

      {/* Pants */}
      <Path
        d="M145,398 L138,460 Q150,468 178,468 L195,412 Q200,408 205,412 L222,468 Q250,468 262,460 L255,398 Q228,410 200,412 Q172,410 145,398 Z"
        {...p('pants')}
      />

      {/* Crease lines */}
      <Line x1={158} y1={410} x2={155} y2={465} stroke="#222" strokeWidth={1} opacity={0.4} />
      <Line x1={242} y1={410} x2={245} y2={465} stroke="#222" strokeWidth={1} opacity={0.4} />

      {/* Dress shoes */}
      <Path d="M132,458 Q138,478 178,478 L180,468 Q155,468 142,462 Z" {...p('left_shoe')} />
      <Path d="M268,458 Q262,478 222,478 L220,468 Q245,468 258,462 Z" {...p('right_shoe')} />
    </G>
  )
}

export default SuitBody
