import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useCredits } from '../context/CreditsContext'
import AppLogo from './AppLogo'

interface HeaderProps {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { isPremium } = useCredits()

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <AppLogo size={44} />
        <Text style={styles.title}>{title}</Text>
      </View>
      {isPremium && (
        <View style={styles.premiumBadge}>
          <Text style={styles.premiumText}>PRO</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#222' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { color: '#fff', fontSize: 20, fontWeight: '800' },
  premiumBadge: { backgroundColor: '#00ff88', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  premiumText: { color: '#111', fontSize: 13, fontWeight: '800' },
})

export default Header
