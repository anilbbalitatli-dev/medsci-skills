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
    index.tsx          # Cerrahi listesi + genel arama
    surgery/[id].tsx    # Cerrahi detay/blok önerisi
    technique/[id].tsx  # Tek bloğun referans sayfası
    catheters.tsx       # Kateter rejimleri ve infüzyon hesaplayıcı
  screens/             # Ekran gövdeleri
    home/
    surgery-detail/
    technique-detail/
    catheters/
  components/          # Yeniden kullanılabilir UI (kart, uyarı banner'ı, doz hesaplayıcı)
  data/                # Cerrahi/blok/doz referans veri seti + tipler
  utils/                # Doz hesaplama yardımcıları
  theme.ts
```

Yeni bir cerrahi/blok eklemek için `src/data/surgeries.ts` dosyasına bir
`Surgery` girdisi eklemek yeterli; yeni bir ilaç için maksimum doz sınırı
eklemek isterseniz `src/data/max-doses.ts` dosyasını güncelleyin.

### Tablet düzeni ve erişilebilirlik

`useLayout()` / `useContentStyle()` (`src/theme.ts`) — genişlik 700 pikseli
aştığında iki şey birden yapılır ve ikisi ayrı:

- **Okuma genişliği 560 pikselde sabitlenir.** iPad'in sorunu büyük olması
  değil, satırın uzaması: ızgara genişliğine yayılmış bir doz tablosunda ilaç
  adıyla mg değeri arasında bir avuç boşluk kalır ve göz satırı takip edemez.
- **Katalog iki sütuna açılır.** Artan yer, satırı uzatmak yerine ikinci bir
  sütuna gider. Arama sonuçları tek sütunda kalır, çünkü gruplandırılmışlar:
  "Bloklar" başlığı iki sütunlu bir ızgarada hangi kartların ona ait olduğunu
  söyleyemez.

`orientation` artık `default`; `supportsTablet` açıkken `portrait` bırakmak
iPad'i döndürülemez hâlde tutuyordu.

Erişilebilirlik tarafında: yalnız ikondan oluşan düğmeler (favori, karışımdan
çıkar) etiketlendi, başlık çubuğundaki kısayollara ne oldukları yazıldı
("Harita" tek başına neyin haritası olduğunu söylemiyor), bölüm başlıkları
`accessibilityRole="header"` aldı ki ekran okuyucuda gezinme noktası olsunlar,
favori düğmesinin dokunma hedefi 44 pt'ye çıkarıldı. Metin taşıyan sabit
genişlikli kutular (`width`) asgari genişliğe çevrildi: sistem yazı tipi
büyütüldüğünde kırpmak yerine sarsınlar.

### Kateter, infüzyon ve çözülme

`src/data/infusion.ts` — kateter rejimleri, erişkin infüzyon üst sınırları ve
tek atım bloğun çözülme çizelgesi. Blok kartında panel olarak, `/catheters`
ekranında liste olarak görünür; ikisi ayrı sorulara bakıyor ("bu bloğa kateter
konur mu" ve "kateter koyacağım, hangi bloğa").

İki ayrım bu dosyanın nedeni:

- **Tek atım tavanı infüzyonu yönetmez.** mg/kg tek doz sınırı bir bolusun
  tepe plazma düzeyi içindir; infüzyonda soru birikimdir ve sınır mg/kg/saat
  cinsindendir. Uygulamanın tek atım tavanını infüzyona uygulamak, 24 saatte
  giden 480 mg ropivakaini "tavanı 2,4 kat aştı" diye kırmızıya boyardı.
- **Kateteri olmayan blokta "yeniden doz" yoktur.** Karar bloğu yenilemek
  değil, çözülmeden önce sistemik analjeziye geçmektir. Çizelgedeki üçüncü
  kutu bu yüzden "tekrarla" değil "hazırlan" diyor ve sürenin alt ucundan bir
  saat önce başlıyor — istem, ilacın servise ulaşması ve etkisinin başlaması
  birlikte o kadar sürüyor.

Hesaplayıcı mL/sa ↔ mg/kg/sa çevrimini yapıyor. Klinikte ayarlanan sayı
mL/sa'tir, sınır ise mg/kg/saat cinsinden yayımlanır; kafadan çevirmek
gerektiği için sınır pratikte hiç bakılmayan bir şeye dönüşüyor.

`npm run audit` her rejimin tekniğinin var olduğunu, infüzyon
konsantrasyonunun tek atımı aşmadığını (kateterin amacı motor bloğu sürdürmek
değil) ve üst bazal hızın 70 kiloluk bir hastada erişkin sınırını aşmadığını
denetler. Yayımlanan bir rejim, hastada değil tabloda yanlıştır.

### Hangi ağırlıkla dozlanır

`src/data/body-weight.ts` — boy girildiğinde ideal (Devine), yağsız
(Janmahasatian) ve düzeltilmiş vücut ağırlığı hesaplanır; hasta çubuğundan
dozların hangisiyle çarpılacağı seçilir. `patient.weightKg` seçilen ağırlığı
döndürür, `patient.totalWeightKg` girilen kiloyu; tavan gösteren her yer
`weightLabel(patient)` ile hangisini kullandığını yazar.

Üç kural bu dosyanın şeklini belirledi:

- **Varsayılan değişmedi.** Toplam ağırlık seçili gelir; kullanıcı bilerek
  seçmeden hiçbir doz değişmez. BMI 30'un üstünde bir hatırlatma çıkar, karar
  yine klinisyenindir.
- **Düzeltme dozu asla yükseltmez.** Kısa boylu, zayıf hastada Devine ideal
  ağırlığı gerçek ağırlığın üstüne çıkarabilir; `dosingWeight()` bu yüzden
  toplam ağırlıkla sınırlar.
- **Çocukta hiç sunulmaz.** Ne Devine ne Janmahasatian pediatrik popülasyonda
  geçerlidir; büyüme eğrisi olmadan pediatrik ideal ağırlık hesaplanamaz. Yaş
  bandı pediatrikse seçim kaldırılır ve dozlar gerçek ağırlıkla hesaplanır.

LAST ekranı bu seçimi dinlemez: kontrol listesi lipid dozunu yağsız ağırlıktan
ister, yani orada ağırlık tercih değil şarttır. `lipidPlan()` bu yüzden iki
ağırlık alır — mL/kg çarpımının ağırlığı (yağsız) ve 70 kg eşiğinin okunduğu
ağırlık (gerçek kilo). İkisini birleştirmek 120 kiloluk bir hastayı "70 kg
altı" koluna düşürüyordu.

Formüller `npm run audit` içinde elle çözülmüş değerlere karşı sabitlenmiştir;
beklenen sayılar yayımlanmış denklemlerden gelir, koddan yeniden
hesaplanmaz — öyle olsa denetim kodun kendisiyle uyumlu olduğunu kanıtlardı.

### Genel arama

`src/data/search.ts` — ana ekrandaki kutu cerrahi, blok, sinir, lokal
anestezik ve dermatom seviyesinde birlikte arar. Sonuçlar tek listeye değil
türlerine göre gruplanır, çünkü her tür başka bir soruya cevap verir: cerrahi
kendi sayfasına, blok kendi sayfasına, sinir onu **tam bloklayan tekniklere**,
seviye de dermatom arayüzüne (`/dermatome-blocks?levels=L3`) götürür.

Eşleşme Türkçe'ye göre katlanır: önce `tr` yerel ayarıyla küçük harfe çevrilir,
sonra `ı → i` ve aksanlar düşürülür. Böylece "buyuk" ile "büyük", "iliaka" ile
"İliaka" aynı sonucu verir — kullanıcının Türkçe klavyeyle yazması gerekmez.
İlaçların İngilizce yazılışları (`ropivacaine`) ayrı bir takma ad tablosundan
gelir; harf dönüşümüyle otomatik yapmak alakasız kelimeleri birbirine
yaklaştırıyordu.

Sinir → onu bloklayan teknikler indeksi bir kez kurulur. Her tuşa basışta 44
tekniğin kapanışını yeniden çıkarmak yüzlerce graf yürüyüşü demekti; katalog
çalışma sırasında değişmiyor.

`npm run audit`, kataloğun her cerrahisini, bloğunu, sinirini, ilacını ve
dermatom seviyesini **kendi adıyla aratıp** sonucun geldiğini doğrular.
Aramanın bozulma biçimleri veriye bakınca görünmez (eşikten kısa ad, grup
başına düşen sonuç sınırı, harf katlaması), o yüzden denetim tabloyu değil
davranışı yoklar.

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

## Pleksus şemaları

`src/data/plexus-diagrams.ts` + `components/plexus-diagram.tsx` — brakiyal,
lomber ve sakral pleksus. Her şema kökten uca zinciri çizer, üzerine her
yaklaşımın çalıştığı seviyeyi (yatay çizgi) veya tek tek hedeflerini (halka)
koyar. `/plexus` ekranında pleksuslar ve yaklaşımlar arasında geçiş yapılır;
blok kartında o bloğun kendi şeması sabit gösterilir.

Renkler şemanın kendi verisinden değil `closureFor(techniqueId)` çıktısından
gelir; bir tekniğin hedefleri değişirse şema da onunla değişir. Koordinatlar
elle verilir, çünkü `nerves.ts` çizgesi neyin neyi blokladığını bilir ama
yapıların nerede durduğunu bilmez. Çizgede olmayan ara basamaklar (brakiyal
divizyonlar, spinal kökler) şemada çizim için vardır ve rengini besledikleri
yapıdan alır. `npm run audit` her düğümün, bağlantının ve yaklaşımın gerçek bir
sinire/tekniğe çözüldüğünü doğrular.

## Tema

`src/theme.ts` iki palet tutar (`LIGHT`, `DARK`) ve stiller `makeStyles` ile
palete bağlı üretilir. `StyleSheet.create` çağrıldığı anda renkleri dondurduğu
için modül düzeyinde bir kez değil, palet başına bir kez çalışır; iki palet
olduğundan önbellek en fazla iki giriş tutar.

Statik `colors` dışa aktarımı bilerek kaldırıldı: kalan her kullanım yeri
derleyici hatası verdiği için geçiş yarım kalamaz. Renk gerektiren bileşen
`useColors()`, stil gerektiren `useStyles()` çağırır; modül düzeyindeki renk
haritaları (`severityStyles`, `statusColors`, `roleStyles`) palet alan
fonksiyonlara dönüştürüldü.

Varsayılan mod cihazın ayarını izler; başlıktaki düğme sistem → açık → koyu
sırasıyla döner ve seçim cihazda saklanır. `onPrimary` ayrı bir token: vurgu
renginin üstündeki metin açık temada beyaz, koyu temada koyudur — koyu temada
vurgu açıldığı için beyaz metin orada okunmaz.

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
