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

### Dermatoma göre blok arama

`src/data/block-finder.ts` — uygulamanın ters yönü: segmentleri seç, o bölgeye
ulaşan blokları al. İki sayı hesaplanır ve ikisi de arayüze taşınır:

- **Kapsama** — istenen segmentlerin ne kadarına ulaşılıyor.
- **Taşma** — istenmeyen kaç segment de bloke oluyor.

Bunları tek bir skora indirmek işin ilginç yarısını gizlerdi: spinal anestezi
L3–L4 isteğini kusursuz "kapsar" ve yanında istenmeyen on dört segmenti de
bloke eder. Yalnız kapsamaya göre sıralansa her alt ekstremite aramasının
başında dururdu.

İkili kombinasyonlar, tek bir blok işi **düzgünce** halledemiyorsa önerilir —
yalnızca "tam kapsayan bir blok var mı" diye bakmak yanlış çıktı, çünkü spinal
neredeyse her alt vücut isteğini tamamlıyor ve ACB + siyatik gibi doğru cevabı
gizliyordu. Öneri listesi, kombinasyon analizinde *gereksiz tekrar* veya
*yapılmamalı* olarak işaretlenen çiftleri dışarıda bırakır.

### Pediatrik doz modeli

`src/data/pediatric-dosing.ts` — kaynaklı pediatrik sınırlar. Yapısal nokta:
**kılavuzlar ilaç başına tek bir maksimum vermez, sınırı teknik başına koyar.**
Ropivakain kaudalde 2, epiduralde 1.7, intratekalde 0.5, fasyal planda
0.75 mg/kg'dır — tek ilaç için dört ayrı sayı. Bu yüzden arama anahtarı
`(kategori, ilaç)` çiftidir; `maxDose[drug]` biçiminde bir tablo bu değerlerin
hiçbirini ifade edemez.

- Kaynaklar: ESRA/ASRA 2018 (birincil, sayfa numaralı) ve SFAR/ADARPEF RFE.
  İkisinin ayrıldığı yerler `CONFLICTS` içinde **çözülmeden** tutulur; birini
  sessizce seçmek açık bir soruyu kapalı gösterirdi.
- `TECHNIQUE_CATEGORY` her tekniği bir kategoriye bağlar ve kılavuzun onu
  adıyla sayıp saymadığını (`explicit` / `inferred`) kaydeder. Arayüz bu ayrımı
  gösterir — kaynak aktarmakla kaynağı genişletmek aynı şey değildir.
- `GAPS` kılavuzların cevaplamadıklarını listeler: pediatrik lidokain sınırı,
  prematüre dozu ve **kombinasyon tavanı**. Uygulamadaki toplam doz hesabı ve
  `AGE_BANDS` içindeki yaş katsayıları kılavuz değil, bu uygulamanın ihtiyatlı
  kuralıdır; `modifierBasis: "house-rule"` alanı bunu işaretler ve arayüz de
  açıkça söyler.

### Sinir modeli ve kombinasyon analizi

Kombinasyon oluşturucusu, blokları serbest metin "kapsama" bilgisiyle değil,
sinir düzeyinde karşılaştırır:

- `src/data/nerves.ts` — sinirler bir yönlü çevrimsiz çizge (DAG) olarak
  tutulur. Her sinir hangi yapıdan çıktığını bildirir; bir siniri bloke etmek
  ondan sonra gelen her şeyi bloke eder. Bu sayede "safen sinir femoral sinirin
  dalıdır, femoral blok yapılmışsa zaten kapsanır" ilişkisi elle yazılmaz,
  anatomiden hesaplanır. Birden çok kökten beslenen bir sinir (radial sinir üç
  trunkustan gelir) yalnızca köklerinin tamamı bloke edilmişse *tam*, aksi
  hâlde *kısmi* sayılır — interskalen bloğun ulnar tarafı açık bırakması bu
  şekilde doğru çıkar.
- `src/data/technique-nerves.ts` — her tekniğin hangi sinirleri, hangi
  güvenilirlikle tuttuğu. Bloklar sinirin *bir noktasında* yapıldığı için
  teknikler ulaşabildikleri en distal yapıyı hedef gösterir. `commonlyMissed`,
  çizgenin kapsanmış sayacağı ama o yaklaşımın pratikte kaçırdığı sinirleri
  işaretler.
- `src/data/combination-analysis.ts` — kapanım hesabı, sinir sinir kapsama
  tablosu ve bulgular. Bir bloğun kimsenin kapsamadığı hiçbir siniri kalmamışsa
  *gereksiz tekrar* olarak işaretlenir. Çizgenin ifade edemediği klinik
  gerçekler (aynı pleksusa iki yaklaşım, frenik yükü, orta hat/yan duvar
  ayrımı) `INTERACTION_RULES` içinde elle tutulur; `complementary` bir kural,
  o çift için otomatik tekrar uyarısını bastırır.

Yeni bir teknik eklerken `TECHNIQUES` girdisinin yanına `TECHNIQUE_NERVES`
girdisini de eklemek gerekir; aksi hâlde teknik kombinasyon analizinde sinirsiz
görünür.

## Yasal metinler ve görsel kaynakları

`src/data/legal.ts` — kullanım amacı, sorumluluk, içeriğin bilinen sınırları,
gizlilik beyanı, veri kaynakları ve görsel lisansları. Uygulamada
`/legal` ekranında (ana ekrandaki uyarı banner'ına dokununca) görünür; aynı
metinler App Store gizlilik beyanı ve `THIRD-PARTY-LICENSES.md` için de
kullanılır. Üçü ayrışmasın diye tek yerde tutulur.

Yasal ekrandaki görsel listesi elle yazılmaz: kayıt dosyasından
(`block-images.ts`) okunur, lisans grubuyla eşleştirilir ve kaynağı
girilmemiş olanlar kırmızı kutuda ayrıca listelenir. Yani atıfsız bir görsel
sessizce yayına çıkamaz.

İlk açılışta bir kez onay penceresi gösterilir (`first-run-disclaimer.tsx`).
Onay yalnızca cihazda saklanır; anahtar sürüm numarası taşır, koşullar esaslı
biçimde değişirse `-v2` yapılıp onay yeniden istenir.

### Görsel ekleme

```bash
npm run image:add -- --list                       # boş yuvalar
npm run image:add -- foto.jpg --key usg-tap --credit "Kendi arşivim, 2026"
```

Dosya kopyalama, `require()` kaydı ve kaynak alanı tek komutta yapılır;
`--credit` zorunludur. Ayrıntılar: `assets/reference/README.md`.

## Web artifact üretimi

```bash
npx expo export --platform web
node scripts/build-web-artifact.js
```

İkinci komut `dist/` çıktısını tek bir kendi kendine yeten HTML dosyasına
katlar: bundle satır içine alınır, varlıklar `data:` URI'ye çevrilir ve
expo-router'ın iç içe bir yolda "Unmatched Route" göstermemesi için bir
`history.replaceState` düzeltmesi eklenir.

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
