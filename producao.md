COMO FAZER UPGRADE DE VERSÃO

# 1. Fazer o build na nuvem (EAS)

Android:
npx eas build --platform android --profile production

iOS:
npx eas build --platform ios --profile production

# 2. Submeter para as lojas

Google Play:
npx eas submit --platform android --profile production

Apple Store:
npx eas submit --platform ios --profile production

Após o envio para a Apple, acesse o App Store Connect para selecionar o build na versão e submeter para review.
