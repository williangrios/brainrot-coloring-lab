import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import { useLanguage } from '../../i18n/LanguageContext'

interface PremiumModalProps {
  visible: boolean
  onClose: () => void
  onSubscribe: () => void
}

export default function PremiumModal({ visible, onClose, onSubscribe }: PremiumModalProps) {
  const { t } = useLanguage()

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.emoji}>🔒</Text>
          <Text style={styles.title}>{t('premiumRequired')}</Text>
          <Text style={styles.subtitle}>{t('premiumRequiredMsg')}</Text>

          <View style={styles.features}>
            <Text style={styles.feature}>{t('unlimitedDrawings')}</Text>
            <Text style={styles.feature}>{t('allDifficulties')}</Text>
            <Text style={styles.feature}>{t('noWatermark')}</Text>
            <Text style={styles.feature}>{t('allPalettes')}</Text>
          </View>

          <TouchableOpacity style={styles.subscribeBtn} onPress={onSubscribe}>
            <Text style={styles.subscribeBtnText}>{t('startFreeTrial')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>{t('maybeLater')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderTopWidth: 2,
    borderColor: '#00ff88',
  },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  features: { alignSelf: 'stretch', gap: 10, marginBottom: 24 },
  feature: { color: '#aaffcc', fontSize: 15, paddingLeft: 12 },
  subscribeBtn: {
    backgroundColor: '#00ff88',
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeBtnText: { color: '#111', fontSize: 17, fontWeight: '800' },
  closeBtn: { paddingVertical: 10 },
  closeBtnText: { color: '#666', fontSize: 14 },
})
