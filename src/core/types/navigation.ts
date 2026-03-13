export type RootStackParamList = {
  LanguageSelect: undefined;
  Onboarding: undefined;
  Subscription: undefined;
  MainTabs: undefined;
  Creation: undefined;
  Painting: { headId: string; bodyId: string; environmentId: string };
  Finalization: {
    headId: string;
    bodyId: string;
    environmentId: string;
    fills: Record<string, string>;
    strokes: any[];
    canvasWidth: number;
    canvasHeight: number;
  };
};

export type MainTabParamList = {
  Home: undefined;
  Create: undefined;
  Library: undefined;
  Explore: undefined;
  Profile: undefined;
};
