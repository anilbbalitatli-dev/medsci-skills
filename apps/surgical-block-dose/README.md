# Surgical Block Dose Guide

Cerrahi tipine göre olası rejyonel anestezi bloklarını ve tipik lokal anestezik
doz aralıklarını gösteren bir Expo (React Native) mobil uygulaması.

## ⚠️ Önemli: Kapsam ve Sorumluluk Reddi

Bu uygulama **yalnızca eğitim/referans amaçlıdır**. Klinik bir karar destek
aracı değildir ve hasta bazında blok/doz seçiminin yerine geçmez:

- Blok önerileri ve doz aralıkları, yaygın kullanılan rejyonel anestezi
  referanslarındaki (NYSORA tarzı blok tanımları, BJA Education, Miller's
  Anesthesia) genel öğretim değerleridir; belirli bir hasta, cerrah veya kurum
  için doğrulanmış protokoller değildir.
- Uygulamadaki maksimum doz hesaplayıcısı, ağırlığa göre yaygın olarak
  aktarılan mg/kg sınırlarını gösterir; ilacın güncel prospektüsü, kurum
  protokolü ve hastanın klinik durumu (böbrek/karaciğer fonksiyonu, gebelik,
  komorbiditeler vb.) her zaman ayrıca değerlendirilmelidir.
- Gerçek hastada uygulama kararı her zaman sorumlu klinisyene aittir.

Bu depoyu genişletmeden önce içeriğin bir anesteziyoloji uzmanı tarafından
gözden geçirilmesi önerilir.

## Teknoloji

- [Expo](https://expo.dev) SDK 54 + [Expo Router](https://docs.expo.dev/router/introduction/) (dosya tabanlı navigasyon)
- React Native + TypeScript
- iOS ve Android'de Expo Go veya development build ile çalışır; ek native
  modül gerekmez.

> **Neden SDK 57 değil de 54?** App Store/Play Store'daki Expo Go istemcisi
> her zaman en yeni SDK'yı desteklemeyebilir (yeni SDK sürümleri mağaza
> onayını beklerken bir süre yalnızca development build/`eas go` ile
> çalışır). Bu proje, App Store'daki güncel Expo Go ile QR kod üzerinden
> doğrudan açılabilsin diye bilinçli olarak SDK 54'te tutuluyor. İleride
> mağazadaki Expo Go güncellendiğinde `npx expo install expo@latest && npx
> expo install --fix` ile yükseltilebilir.

## Proje Yapısı

```
src/
  app/                # Expo Router route'ları (yalnızca route dosyaları)
    _layout.tsx
    index.tsx          # Cerrahi listesi
    surgery/[id].tsx    # Cerrahi detay/blok önerisi
  screens/             # Ekran gövdeleri
    home/
    surgery-detail/
  components/          # Yeniden kullanılabilir UI (kart, uyarı banner'ı, doz hesaplayıcı)
  data/                # Cerrahi/blok/doz referans veri seti + tipler
  utils/                # Doz hesaplama yardımcıları
  theme.ts
```

Yeni bir cerrahi/blok eklemek için `src/data/surgeries.ts` dosyasına bir
`Surgery` girdisi eklemek yeterli; yeni bir ilaç için maksimum doz sınırı
eklemek isterseniz `src/data/max-doses.ts` dosyasını güncelleyin.

## Çalıştırma

```bash
npm install
npx expo start
```

Ardından:

- **iOS**: Expo Go uygulamasıyla QR kodu okutun (Mac gerektirmez) veya `npx expo start --ios` ile simülatörde açın (macOS gerekir).
- **Android**: Expo Go ile QR kodu okutun veya `npx expo start --android` ile emülatörde açın.
- **Web (opsiyonel)**: `npx expo install react-native-web @expo/metro-runtime` kurduktan sonra `npx expo start --web`.

## Ayrı bir repoya taşımak isterseniz

Bu klasör (`apps/surgical-block-dose/`) kendi başına çalışan bağımsız bir Expo
projesidir. Ayrı bir GitHub reposuna taşımak için klasörü kopyalayıp yeni bir
repoda `git init` yapmanız yeterli — `medsci-skills` reposundaki diğer
dosyalara bir bağımlılığı yoktur.

## Yol Haritası (öneriler)

- İçeriği bir anesteziyoloji uzmanına gözden geçirtmek
- Daha fazla cerrahi/blok eklemek
- Kontrendikasyon uyarıları (antikoagülan kullanımı, lokal enfeksiyon vb.)
- Çoklu dil desteği (İngilizce)
