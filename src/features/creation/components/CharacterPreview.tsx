import React from 'react'
import { View, StyleSheet } from 'react-native'
import Svg from 'react-native-svg'
import { headComponents, bodyComponents, environmentComponents } from '../data/partsRegistry'

interface CharacterPreviewProps {
  headId: string
  bodyId: string
  environmentId: string
  fills: Record<string, string>
  onRegionPress?: (regionId: string) => void
  width?: number
  height?: number
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({
  headId,
  bodyId,
  environmentId,
  fills,
  onRegionPress,
  width = 400,
  height = 500,
}) => {
  const HeadComponent = headComponents[headId]
  const BodyComponent = bodyComponents[bodyId]
  const EnvComponent = environmentComponents[environmentId]

  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox="0 0 400 500">
        {EnvComponent && (
          <EnvComponent fills={fills} onRegionPress={onRegionPress} />
        )}
        {BodyComponent && (
          <BodyComponent fills={fills} onRegionPress={onRegionPress} />
        )}
        {HeadComponent && (
          <HeadComponent fills={fills} onRegionPress={onRegionPress} />
        )}
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default CharacterPreview
