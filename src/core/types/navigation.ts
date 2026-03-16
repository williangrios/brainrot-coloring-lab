export type RootStackParamList = {
  LanguageSelect: undefined
  Onboarding: undefined
  Email: undefined
  Subscription: undefined
  MainTabs: undefined
  Rating: {
    onRate?: (positive: boolean) => void
    onDismiss?: () => void
  } | undefined
  Painting: { pageId: string }
  Finalization: {
    pageId: string
    snapshotDataUrl?: string
  }
}

export type MainTabParamList = {
  Home: undefined
  Browse: undefined
  Library: undefined
  Explore: undefined
  Profile: undefined
}
