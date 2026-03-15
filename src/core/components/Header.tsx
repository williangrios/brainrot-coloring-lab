import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useCredits } from '../context/CreditsContext'
import AppLogo from './AppLogo'

interface HeaderProps {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { credits, isPremium } = useCredits()

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <AppLogo size={44} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.creditsContainer}>
        {isPremium ? (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PRO</Text>
          </View>
        ) : (
          <View style={styles.creditsBadge}>
            <Text style={styles.creditsIcon}>✦</Text>
            <Text style={styles.creditsText}>{credits}</Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#222' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { color: '#fff', fontSize: 20, fontWeight: '800' },
  creditsContainer: { flexDirection: 'row', alignItems: 'center' },
  creditsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: '#333', gap: 4 },
  creditsIcon: { color: '#FFD600', fontSize: 14 },
  creditsText: { color: '#FFD600', fontSize: 15, fontWeight: '700' },
  premiumBadge: { backgroundColor: '#00ff88', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  premiumText: { color: '#111', fontSize: 13, fontWeight: '800' },
})

export default Header
