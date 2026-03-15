import React from 'react'
import { View, Image, StyleSheet } from 'react-native'

interface AppLogoProps {
  size?: number
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 32 }) => {
  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size * 0.22 },
      ]}
    >
      <Image
        source={require('../../../assets/icon.png')}
        style={{ width: size, height: size, borderRadius: size * 0.22 }}
        resizeMode="cover"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    marginBottom: 20,
  },
})

export default AppLogo
