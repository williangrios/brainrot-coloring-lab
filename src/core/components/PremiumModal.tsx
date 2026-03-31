import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import { useLanguage } from '../../i18n/LanguageContext'

interface CreditsModalProps {
  visible: boolean
  canEarnBySharing: boolean
  onClose: () => void
  onGoToLibrary: () => void
  onSubscribe: () => void
}

export default function PremiumModal({ visible, canEarnBySharing, onClose, onGoToLibrary, onSubscribe }: CreditsModalProps) {
  const { t } = useLanguage()

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.emoji}>{canEarnBySharing ? '✦' : '🔒'}</Text>
          <Text style={styles.title}>{t('noCredits')}</Text>
          <Text style={styles.subtitle}>
            {canEarnBySharing ? t('noCreditsShareMsg') : t('noCreditsLimitMsg')}
          </Text>

          {canEarnBySharing ? (
            <TouchableOpacity style={styles.mainBtn} onPress={onGoToLibrary}>
              <Text style={styles.mainBtnText}>{t('goToLibrary')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.mainBtn} onPress={onSubscribe}>
              <Text style={styles.mainBtnText}>{t('upgradeToPremium')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>{t('cancel')}</Text>
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
  emoji: { fontSize: 48, color: '#00ff88', marginBottom: 12 },
  title: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#888', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  mainBtn: {
    backgroundColor: '#00ff88',
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainBtnText: { color: '#111', fontSize: 17, fontWeight: '800' },
  closeBtn: { paddingVertical: 10 },
  closeBtnText: { color: '#666', fontSize: 14 },
})
