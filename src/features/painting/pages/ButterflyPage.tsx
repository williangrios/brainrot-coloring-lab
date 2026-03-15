import React from 'react'
import Svg, { Path, Circle, Ellipse } from 'react-native-svg'

export interface ColoringPageProps {
  width: number
  height: number
  regionColors: Record<string, string>
  onRegionPress?: (regionId: string) => void
  outlineOnly?: boolean
}

export const BUTTERFLY_REGIONS = [
  'bg', 'wing-upper-left', 'wing-upper-right', 'wing-lower-left', 'wing-lower-right',
  'spot-left-upper', 'spot-right-upper', 'spot-left-lower', 'spot-right-lower',
  'body', 'head', 'antenna-left-tip', 'antenna-right-tip',
  'flower1-petal1', 'flower1-center', 'flower2-petal1', 'flower2-center', 'grass',
]

const ButterflyPage: React.FC<ColoringPageProps> = ({ width, height, regionColors, onRegionPress, outlineOnly }) => {
  const fill = (id: string) => {
    if (outlineOnly) return 'none'
    return regionColors[id] || 'white'
  }
  const press = (id: string) => () => outlineOnly ? undefined : onRegionPress?.(id)

  return (
    <Svg width={width} height={height} viewBox="0 0 400 500">
      {/* Background */}
      <Path d="M0,0 H400 V500 H0 Z" fill={fill('bg')} onPress={press('bg')} />

      {/* Wings - base layer */}
      <Path
        d="M200,200 C180,160 120,100 60,120 C20,135 10,180 30,220 C50,260 120,260 160,240 C180,230 195,215 200,200 Z"
        fill={fill('wing-upper-left')} stroke="black" strokeWidth={2.5} onPress={press('wing-upper-left')}
      />
      <Path
        d="M200,200 C220,160 280,100 340,120 C380,135 390,180 370,220 C350,260 280,260 240,240 C220,230 205,215 200,200 Z"
        fill={fill('wing-upper-right')} stroke="black" strokeWidth={2.5} onPress={press('wing-upper-right')}
      />
      <Path
        d="M200,220 C185,240 140,290 90,300 C50,310 25,290 20,260 C15,230 40,210 80,210 C130,210 175,215 200,220 Z"
        fill={fill('wing-lower-left')} stroke="black" strokeWidth={2.5} onPress={press('wing-lower-left')}
      />
      <Path
        d="M200,220 C215,240 260,290 310,300 C350,310 375,290 380,260 C385,230 360,210 320,210 C270,210 225,215 200,220 Z"
        fill={fill('wing-lower-right')} stroke="black" strokeWidth={2.5} onPress={press('wing-lower-right')}
      />

      {/* Wing spots - on top of wings */}
      <Path
        d="M120,170 C130,150 155,145 165,160 C175,175 165,195 150,195 C135,195 115,185 120,170 Z"
        fill={fill('spot-left-upper')} stroke="black" strokeWidth={2} onPress={press('spot-left-upper')}
      />
      <Path
        d="M280,170 C270,150 245,145 235,160 C225,175 235,195 250,195 C265,195 285,185 280,170 Z"
        fill={fill('spot-right-upper')} stroke="black" strokeWidth={2} onPress={press('spot-right-upper')}
      />
      <Ellipse
        cx={100} cy={255} rx={25} ry={18}
        fill={fill('spot-left-lower')} stroke="black" strokeWidth={2} onPress={press('spot-left-lower')}
      />
      <Ellipse
        cx={300} cy={255} rx={25} ry={18}
        fill={fill('spot-right-lower')} stroke="black" strokeWidth={2} onPress={press('spot-right-lower')}
      />

      {/* Body */}
      <Path
        d="M195,160 L205,160 L208,340 C208,350 192,350 192,340 Z"
        fill={fill('body')} stroke="black" strokeWidth={2.5} onPress={press('body')}
      />

      {/* Head */}
      <Circle
        cx={200} cy={150} r={18}
        fill={fill('head')} stroke="black" strokeWidth={2.5} onPress={press('head')}
      />

      {/* Eyes - not fillable */}
      <Circle cx={193} cy={147} r={4} fill="black" />
      <Circle cx={207} cy={147} r={4} fill="black" />

      {/* Antennae */}
      <Path d="M193,133 C185,110 160,95 155,85" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" />
      <Circle cx={155} cy={85} r={5} fill={fill('antenna-left-tip')} stroke="black" strokeWidth={2} onPress={press('antenna-left-tip')} />
      <Path d="M207,133 C215,110 240,95 245,85" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" />
      <Circle cx={245} cy={85} r={5} fill={fill('antenna-right-tip')} stroke="black" strokeWidth={2} onPress={press('antenna-right-tip')} />

      {/* Flower 1 */}
      <Path
        d="M70,420 C65,400 80,390 90,400 C100,390 115,400 110,420 C115,430 100,445 90,435 C80,445 65,430 70,420 Z"
        fill={fill('flower1-petal1')} stroke="black" strokeWidth={2} onPress={press('flower1-petal1')}
      />
      <Circle cx={90} cy={418} r={8} fill={fill('flower1-center')} stroke="black" strokeWidth={2} onPress={press('flower1-center')} />

      {/* Flower 2 */}
      <Path
        d="M300,440 C295,420 310,410 320,420 C330,410 345,420 340,440 C345,450 330,465 320,455 C310,465 295,450 300,440 Z"
        fill={fill('flower2-petal1')} stroke="black" strokeWidth={2} onPress={press('flower2-petal1')}
      />
      <Circle cx={320} cy={438} r={8} fill={fill('flower2-center')} stroke="black" strokeWidth={2} onPress={press('flower2-center')} />

      {/* Grass */}
      <Path
        d="M0,470 C30,460 60,470 90,460 C120,470 150,460 180,470 C210,460 240,470 270,460 C300,470 330,460 360,470 C390,460 400,465 400,470 L400,500 L0,500 Z"
        fill={fill('grass')} stroke="black" strokeWidth={2} onPress={press('grass')}
      />
    </Svg>
  )
}

export default React.memo(ButterflyPage)
