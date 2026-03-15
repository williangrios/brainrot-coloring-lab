export type RootStackParamList = {
  LanguageSelect: undefined
  Onboarding: undefined
  Email: undefined
  Subscription: undefined
  MainTabs: undefined
  Rating: undefined
  Painting: { pageId: string }
  Finalization: {
    pageId: string
    regionColors: Record<string, string>
    strokes: any[]
  }
}

export type MainTabParamList = {
  Home: undefined
  Browse: undefined
  Library: undefined
  Explore: undefined
  Profile: undefined
}
