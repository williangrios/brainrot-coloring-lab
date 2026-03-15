import React from 'react'
import Svg, { Path, Circle, Line } from 'react-native-svg'
import { ColoringPageProps } from './ButterflyPage'

export const DINO_REGIONS = [
  'sky', 'ground', 'dino-body', 'dino-belly', 'dino-head', 'dino-jaw',
  'dino-eye-outer', 'spike1', 'spike2', 'spike3', 'dino-tail',
  'leg-front', 'foot-front', 'leg-back', 'foot-back',
  'sun', 'cloud1', 'cloud2',
]

const DinoPage: React.FC<ColoringPageProps> = ({ width, height, regionColors, onRegionPress, outlineOnly }) => {
  const fill = (id: string) => outlineOnly ? 'none' : (regionColors[id] || 'white')
  const press = (id: string) => () => outlineOnly ? undefined : onRegionPress?.(id)

  return (
    <Svg width={width} height={height} viewBox="0 0 400 500">
      {/* Sky */}
      <Path d="M0,0 H400 V350 H0 Z" fill={fill('sky')} onPress={press('sky')} />

      {/* Ground */}
      <Path
        d="M0,350 C50,340 100,355 150,345 C200,355 250,340 300,350 C350,340 400,350 400,345 L400,500 L0,500 Z"
        fill={fill('ground')} stroke="black" strokeWidth={2} onPress={press('ground')}
      />

      {/* Tail - behind body */}
      <Path
        d="M120,280 C100,290 70,295 50,280 C30,265 20,240 30,225 C40,215 55,220 60,235 C65,250 80,270 120,275 Z"
        fill={fill('dino-tail')} stroke="black" strokeWidth={2.5} onPress={press('dino-tail')}
      />

      {/* Back leg - behind body */}
      <Path d="M160,315 L155,360 C155,370 165,370 165,360 L168,315" fill={fill('leg-back')} stroke="black" strokeWidth={2.5} onPress={press('leg-back')} />
      <Path d="M150,358 C145,370 150,380 160,380 C170,380 175,370 170,358 Z" fill={fill('foot-back')} stroke="black" strokeWidth={2} onPress={press('foot-back')} />

      {/* Dino body */}
      <Path
        d="M120,280 C100,260 90,230 100,200 C110,180 130,170 150,170 L250,170 C270,170 280,180 285,195 C290,210 295,240 280,270 C270,290 250,310 230,320 L170,320 C150,310 130,300 120,280 Z"
        fill={fill('dino-body')} stroke="black" strokeWidth={2.5} onPress={press('dino-body')}
      />

      {/* Belly */}
      <Path
        d="M140,260 C135,240 140,220 155,210 C170,200 200,200 220,210 C240,220 250,240 245,260 C240,280 220,295 200,300 C175,300 150,285 140,260 Z"
        fill={fill('dino-belly')} stroke="black" strokeWidth={2} onPress={press('dino-belly')}
      />

      {/* Spikes */}
      <Path d="M160,170 L170,140 L180,170" fill={fill('spike1')} stroke="black" strokeWidth={2} strokeLinejoin="round" onPress={press('spike1')} />
      <Path d="M185,170 L198,132 L210,170" fill={fill('spike2')} stroke="black" strokeWidth={2} strokeLinejoin="round" onPress={press('spike2')} />
      <Path d="M215,170 L230,138 L245,170" fill={fill('spike3')} stroke="black" strokeWidth={2} strokeLinejoin="round" onPress={press('spike3')} />

      {/* Head */}
      <Path
        d="M250,170 C260,150 280,130 310,125 C340,120 360,130 365,150 C370,170 360,190 340,200 C320,210 290,210 270,200 C255,190 250,180 250,170 Z"
        fill={fill('dino-head')} stroke="black" strokeWidth={2.5} onPress={press('dino-head')}
      />

      {/* Jaw */}
      <Path d="M310,180 C320,185 340,190 355,185 C365,180 370,170 365,165 C355,175 340,178 325,175 Z" fill={fill('dino-jaw')} stroke="black" strokeWidth={2} onPress={press('dino-jaw')} />

      {/* Eye */}
      <Circle cx={320} cy={148} r={14} fill={fill('dino-eye-outer')} stroke="black" strokeWidth={2} onPress={press('dino-eye-outer')} />
      <Circle cx={322} cy={146} r={6} fill="black" />

      {/* Front leg - in front */}
      <Path d="M240,310 L245,360 C245,370 255,370 255,360 L252,310" fill={fill('leg-front')} stroke="black" strokeWidth={2.5} onPress={press('leg-front')} />
      <Path d="M240,358 C235,370 240,380 250,380 C260,380 265,370 260,358 Z" fill={fill('foot-front')} stroke="black" strokeWidth={2} onPress={press('foot-front')} />

      {/* Sun */}
      <Circle cx={60} cy={60} r={35} fill={fill('sun')} stroke="black" strokeWidth={2} onPress={press('sun')} />
      <Line x1={60} y1={15} x2={60} y2={5} stroke="black" strokeWidth={2} strokeLinecap="round" />
      <Line x1={60} y1={105} x2={60} y2={115} stroke="black" strokeWidth={2} strokeLinecap="round" />
      <Line x1={15} y1={60} x2={5} y2={60} stroke="black" strokeWidth={2} strokeLinecap="round" />
      <Line x1={105} y1={60} x2={115} y2={60} stroke="black" strokeWidth={2} strokeLinecap="round" />
      <Line x1={30} y1={30} x2={22} y2={22} stroke="black" strokeWidth={2} strokeLinecap="round" />
      <Line x1={90} y1={30} x2={98} y2={22} stroke="black" strokeWidth={2} strokeLinecap="round" />
      <Line x1={30} y1={90} x2={22} y2={98} stroke="black" strokeWidth={2} strokeLinecap="round" />
      <Line x1={90} y1={90} x2={98} y2={98} stroke="black" strokeWidth={2} strokeLinecap="round" />

      {/* Clouds */}
      <Path
        d="M250,70 C245,50 260,35 280,40 C290,25 315,25 325,40 C340,35 355,45 352,62 C365,70 360,90 345,90 L260,90 C245,90 240,80 250,70 Z"
        fill={fill('cloud1')} stroke="black" strokeWidth={2} onPress={press('cloud1')}
      />
      <Path
        d="M140,110 C137,95 148,85 162,88 C168,78 185,78 192,88 C202,84 213,92 210,104 C218,108 215,122 205,122 L148,122 C138,122 134,115 140,110 Z"
        fill={fill('cloud2')} stroke="black" strokeWidth={2} onPress={press('cloud2')}
      />

      {/* Plants - decorative, not fillable */}
      <Path d="M330,350 L330,400 M330,370 C320,360 310,365 315,375 M330,380 C340,370 350,375 345,385" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" />
      <Path d="M80,350 L80,400 M80,365 C70,355 60,360 65,370 M80,375 C90,365 100,370 95,380" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  )
}

export default React.memo(DinoPage)
