import React from 'react'
import Svg, { Path, Ellipse, Circle } from 'react-native-svg'
import { ApiColoringPage, ApiRegionShape } from '../../../core/data/mockApiPages'
import { ColoringPageProps } from './index'

interface DynamicPageProps extends ColoringPageProps {
  pageData: ApiColoringPage
}

const DynamicPage: React.FC<DynamicPageProps> = ({
  width, height, regionColors, onRegionPress, outlineOnly, pageData,
}) => {
  const vb = pageData.viewBox

  const fill = (region: ApiRegionShape) => {
    if (region.decorative) return region.defaultFill || 'none'
    if (outlineOnly) return 'none'
    return regionColors[region.id] || region.defaultFill || 'white'
  }

  const press = (region: ApiRegionShape) => () => {
    if (outlineOnly || region.decorative) return
    onRegionPress?.(region.id)
  }

  const renderRegion = (region: ApiRegionShape) => {
    const strokeColor = region.strokeWidth > 0 ? 'black' : 'none'
    const commonProps = {
      key: region.id,
      stroke: strokeColor,
      strokeWidth: region.strokeWidth,
      onPress: press(region),
    }

    if (region.type === 'path' && region.d) {
      const isOutlinePath = region.decorative && region.defaultFill === 'none'
      return (
        <Path
          {...commonProps}
          d={region.d}
          fill={fill(region)}
          strokeLinecap={isOutlinePath ? 'round' : undefined}
        />
      )
    }

    if (region.type === 'ellipse' && region.cx != null) {
      return (
        <Ellipse
          {...commonProps}
          cx={region.cx}
          cy={region.cy}
          rx={region.rx!}
          ry={region.ry!}
          fill={fill(region)}
        />
      )
    }

    if (region.type === 'circle' && region.cx != null) {
      return (
        <Circle
          {...commonProps}
          cx={region.cx}
          cy={region.cy}
          r={region.rx!}
          fill={fill(region)}
        />
      )
    }

    return null
  }

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${vb.width} ${vb.height}`}>
      {pageData.regions.map(renderRegion)}
    </Svg>
  )
}

export default React.memo(DynamicPage)
