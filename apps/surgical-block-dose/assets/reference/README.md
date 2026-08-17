# Referans Görselleri (USG + Anatomi)

Bu klasör, uygulamada gösterilen **gerçek** görselleri barındırır: ultrason
görüntüleri ve anatomik plakalar. Uygulamadaki şematik çizimler (vücut
diyagramı) koddan üretilir, buraya girmez.

## Lisans kuralı — istisnasız

Buraya konan her görsel şunlardan **biri** olmak zorundadır:

1. **Kendi materyaliniz** (kendi çektiğiniz USG görüntüsü, kendi çiziminiz), veya
2. **Kamu malı / public domain** (ör. Gray's Anatomy 1918 baskısı plakaları), veya
3. **Yeniden dağıtıma izin veren açık lisans** (CC0, CC-BY, CC-BY-SA — açık
   erişimli dergi makalelerinin figürleri genelde böyledir).

Ders kitabı, atlas, NYSORA, ticari poster (ör. anatomyposters.com) ve stok
görsel siteleri **kullanılamaz** — kişisel olarak satın alınmış olsalar bile,
bu onları başka bir üründe yeniden dağıtma hakkı vermez.

Lisansını tek cümleyle yazamıyorsanız, o görseli eklemeyin.

## ⚠ Hasta gizliliği (kendi USG görüntüleriniz için)

Ultrason cihazı ekran görüntülerinin üst bandında genellikle **hasta adı,
protokol numarası, doğum tarihi ve tarih** gömülü gelir. Bunlar kişisel sağlık
verisidir.

Eklemeden önce:

- Üst/alt bilgi bandını **kırpın** (karartmak yerine kırpmak tercih edilir —
  karartma bazı formatlarda geri alınabilir).
- Görüntüde tanımlayıcı başka bir bilgi kalmadığını gözle doğrulayın.
- Kurumunuzun görüntü paylaşımına ilişkin politikasını kontrol edin.

## Dosya biçimi

| Özellik | Değer |
| --- | --- |
| Format | `.jpg` (USG için) veya `.png` (çizim/plaka için) |
| Genişlik | 1200–1600 px (daha büyüğü gereksiz, uygulama boyutunu şişirir) |
| Dosya boyutu | Tercihen < 400 KB |
| İsimlendirme | Aşağıdaki tablodaki anahtarın birebir aynısı + uzantı |

## Nasıl eklenir

1. Dosyayı bu klasöre koyun (ör. `usg-tap.jpg`).
2. `src/data/block-images.ts` içindeki kayda bir satır ekleyin:
   ```ts
   "usg-tap": require("../../assets/reference/usg-tap.jpg"),
   ```
3. `src/data/reference-images.ts` içinde o görselin `credit` alanındaki
   `CREDIT_PENDING` yerine gerçek kaynağı yazın, ör.:
   ```ts
   credit: "Kaynak: Smith et al., BMC Anesthesiol 2021, Fig. 2 (CC BY 4.0)",
   ```

Bu üç adım tamamlanana kadar uygulama o alanda "Görsel eklenmeyi bekliyor"
yazan kesikli çerçeveli bir kutu gösterir — yani eksik görseller sessizce
kaybolmaz, ekranda görünür.

## Beklenen görseller

Görseller **teknik bazında** anahtarlanır: tek bir TAP görüntüsü, TAP bloğu
kullanan bütün cerrahilerde gösterilir. Yani aşağıdaki 13 dosya tüm uygulamayı
kapsar.

### Ultrason

| Anahtar (dosya adı) | İçerik | Hangi cerrahilerde görünür |
| --- | --- | --- |
| `usg-adductor-canal` | Femoral arter, safen sinir, sartorius | TKA, ACL |
| `usg-interscalene` | C5-C6-C7 kökleri, skalen kaslar | Omuz artroskopisi |
| `usg-supraclavicular` | Subklavyen arter, pleksus, 1. kot, plevra | El/önkol |
| `usg-infraclavicular` | Aksiller arter, üç kord | El/önkol, dirsek |
| `usg-popliteal-sciatic` | Siyatik sinirin ayrılma noktası | Ayak/ayak bileği, diz altı amputasyon |
| `usg-tap` | Üç karın duvarı kası | Apendektomi, sezaryen, herni, jinekolojik laparoskopi |
| `usg-peng` | İliopubik eminens, psoas tendonu | THA, kalça kırığı |
| `usg-fascia-iliaca` | Sartorius, iliakus, fasya iliaka | THA, kalça kırığı |
| `usg-esp` | Transvers çıkıntı, erektor spina | Torakotomi, lomber omurga |
| `usg-pecs2` | Pektoralis majör/minör, serratus | Meme cerrahisi |
| `usg-spinal` | Spinöz çıkıntılar, interlaminar pencere | TKA, THA, sezaryen |

### Anatomi

| Anahtar (dosya adı) | İçerik |
| --- | --- |
| `anatomy-dermatome-anterior` | Dermatomlar, ön görünüm |
| `anatomy-dermatome-posterior` | Dermatomlar, arka görünüm |

Dermatom plakaları için Gray's Anatomy'nin 1918 baskısı kamu malıdır ve
doğrudan kullanılabilir; kaynak satırına `Gray's Anatomy (1918), public domain`
yazmak yeterlidir.
