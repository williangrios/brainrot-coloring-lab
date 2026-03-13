import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface ScreenWrapperProps {
  children: React.ReactNode
  backgroundColor?: string
  noBottom?: boolean
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, backgroundColor = '#111', noBottom }) => {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.container, { backgroundColor, paddingTop: insets.top, paddingBottom: noBottom ? 0 : insets.bottom }]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default ScreenWrapper
