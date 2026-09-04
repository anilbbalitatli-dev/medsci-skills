# iOS / App Store Yayınlama

Bu dosya uygulamayı App Store'a çıkarmak için gereken adımları ve **çıkmadan
önce karara bağlanması gereken üç konuyu** içerir. Teknik adımlar kolay kısım;
üç konu bunlardan daha önemli.

---

## Önce karara bağlanması gerekenler

### 1. CC BY-NC görselleri — ücretli yayınlanacaksa çıkarılmalı

`assets/reference/` altındaki beş ultrason görüntüsü (`usg-paravertebral`,
`usg-intercostal`, `usg-esp`, `usg-pecs2`, `usg-serratus`) **CC BY-NC 4.0**
lisanslıdır: ticari kullanıma kapalı. Diğer dört görüntü (fasya iliaka, femoral,
LFCN, PENG) CC BY 4.0'dır ve kısıt taşımaz.

- Uygulama **ücretsiz ve reklamsız** kalacaksa NC görselleri bırakmak yaygın
  yorumla savunulabilir — ama "ücretsiz uygulama ticari değildir" tartışmalı bir
  kabuldür ve risk sizindir.
- Uygulama **ücretliyse, uygulama içi satın alma içeriyorsa veya reklam
  gösteriyorsa** bu beş dosya çıkarılmalıdır:

```bash
./scripts/strip-noncommercial-assets.sh --dry-run   # neyin gideceğini gösterir
./scripts/strip-noncommercial-assets.sh             # kaldırır
```

Kaldırıldıktan sonra o blok kartları şematik çizime düşer; şematikler bu depoya
özgü orijinal çalışmadır ve hiçbir kısıt taşımaz. Ardından
`THIRD-PARTY-LICENSES.md` içindeki CC BY-NC bölümü de silinmelidir.

### 2. Tıbbi cihaz mevzuatı — kontrol edilmesi gereken nokta

Uygulama **eğitim/referans** olarak konumlanmıştır ve her ekranda bunu söyler.
Ancak hasta ağırlığı ve yaşı girildiğinde **o hastaya özgü doz tavanı**
hesaplıyor. AB MDR ve MDCG 2019-11 yorumunda, belirli bir hasta için klinik
kararı bilgilendirmek amacıyla çıktı üreten yazılım tıbbi cihaz sayılabilir;
Türkiye'de TİTCK aynı çerçeveyi uygular.

Bu bir yasak değil, bir sınıflandırma sorusudur. Yayına çıkmadan önce
netleştirin; gerekirse mevzuat danışmanına sorun. Pratikte iki yol vardır:

- **Referans olarak kalmak:** doz hesaplayıcıyı "kılavuz değerlerin
  gösterimi" düzeyinde tutmak, hasta-özgü öneri dili kullanmamak. Uygulamanın
  şu anki dili buna uygundur (tavanlar "kılavuz sınırı" olarak sunulur, öneri
  olarak değil).
- **Cihaz olarak kaydolmak:** hasta-özgü hesaplama öne çıkarılacaksa gereken yol.

### 3. App Store inceleme — tıbbi uygulama kuralları

İlgili kurallar: **1.4.1** (fiziksel zarar), **5.1.1** (veri toplama) ve
**2.3.8** (yer tutucu içerik). Beklenenler:

- Yaş sınırı **17+**, "Medical/Treatment Information" seçilir.
- Açıklamada uygulamanın **sağlık profesyonelleri için referans** olduğu ve
  klinik karar aracı olmadığı açıkça yazılmalıdır.
- İnceleme ekibi doz veren uygulamalarda kaynak sorabilir. Kaynaklar zaten
  uygulama içinde görünür (ESRA/ASRA 2018, SFAR/ADARPEF, ISNCSCI, makale
  atıfları) — inceleme notuna bunu yazın.
- Uygulama **hiçbir veri toplamıyor**: ağırlık/yaş ve favoriler yalnızca cihazda
  saklanır, ağ isteği yoktur. App Privacy formunda "Data Not Collected"
  işaretlenir. Bu doğru beyandır, kod bunu destekler.

---

## Teknik adımlar

Mac gerekmez — EAS Build bulutta derler.

### Hazırlık (bir kez)

1. **Apple Developer Program** üyeliği: yıllık 99 USD,
   <https://developer.apple.com/programs/>. Bireysel veya şirket olarak
   açılabilir; şirket hesabı için D-U-N-S numarası gerekir ve haftalar sürebilir.
   Bireysel hesapta geliştirici adı kendi adınız olarak görünür.

2. **Expo hesabı** ve CLI:

```bash
npm install -g eas-cli
eas login
```

3. Proje dizininde bir kez:

```bash
cd apps/surgical-block-dose
eas init          # projeyi Expo hesabınıza bağlar, projectId yazar
```

### Derleme

```bash
eas build --platform ios --profile production
```

İlk çalıştırmada EAS, Apple hesabınıza girmenizi ister ve sertifika ile
provisioning profilini kendisi üretip saklar. `eas.json` içindeki
`autoIncrement` build numarasını her yüklemede artırır, böylece "bu build
numarası zaten kullanılmış" hatası oluşmaz.

Test için önce cihazda deneyin:

```bash
eas build --platform ios --profile preview
```

### App Store Connect

1. <https://appstoreconnect.apple.com> → **Apps → +** ile yeni kayıt.
   Bundle ID: `com.medsci.surgicalblockdose` (app.json ile aynı olmalı).
2. Gerekenler:
   - **Ekran görüntüleri**: 6.7" (iPhone 15/16 Pro Max) ve 6.5" için zorunlu;
     iPad destekli olduğu için 12.9" iPad görüntüleri de gerekir
     (`app.json` içinde `supportsTablet: true`).
   - **Açıklama, anahtar kelimeler, destek URL'i, gizlilik politikası URL'i.**
     Gizlilik politikası veri toplanmasa bile zorunludur; tek sayfalık
     "hiçbir veri toplanmaz, her şey cihazda kalır" metni yeterlidir.
   - **Yaş sınırı** anketi → Medical/Treatment Information.
3. Yükleme:

```bash
eas submit --platform ios --latest
```

4. TestFlight'ta kendiniz deneyin, sonra **App Review**'a gönderin.

### Sonraki sürümler

`app.json` içindeki `version` alanını artırın (`1.0.1`). `buildNumber` ile
`versionCode` EAS tarafından otomatik artırılır.

---

## Yayın öncesi kontrol listesi

```bash
npm run typecheck     # tip hatası yok
npm run audit         # veri seti çapraz referansları eksiksiz
npx expo export --platform ios   # native bundle sorunsuz derleniyor
```

- [ ] Ücretli/reklamlı ise NC görseller çıkarıldı
- [ ] Mevzuat sorusu netleştirildi
- [ ] `app.json` içindeki `version` doğru
- [ ] Ekran görüntüleri hazır (iPhone + iPad)
- [ ] Gizlilik politikası yayında ve URL'i girildi
- [ ] İnceleme notuna kaynaklar ve "klinik karar aracı değildir" ifadesi yazıldı
