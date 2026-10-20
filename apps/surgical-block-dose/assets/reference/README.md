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

Tek komut:

```bash
npm run image:add -- <dosya> --key usg-tap --credit "Kaynak: Smith ve ark., BMC Anesthesiol 2021, Fig. 2 (CC BY 4.0)"
```

Script üç işi birlikte yapar: dosyayı bu klasöre `usg-tap.jpg` adıyla kopyalar,
`src/data/block-images.ts` içine `require()` satırını yazar ve
`src/data/reference-images.ts` içindeki `credit` alanını doldurur. `--credit`
zorunludur; kaynağı yazılmamış bir görsel eklenemez.

Faydalı seçenekler:

- `npm run image:add` (argümansız) veya `--list`: hangi yuvaların boş olduğunu
  ve her birinde ne beklendiğini yazar.
- `--caption "USG — ..."`: hazır açıklamayı değiştirir.
- `--force`: o anahtarda zaten bir görsel varsa üzerine yazar.
- `--noncommercial`: CC BY-NC gibi ticari kullanıma kapalı bir kaynaktan
  geliyorsa satıra `@noncommercial` işaretini koyar; ticari sürüm
  hazırlanırken `scripts/strip-noncommercial-assets.sh` o dosyaları ve
  satırları birlikte kaldırır. Kendi çektiğiniz görsellerde gerekmez.

Yeni bir teknik için henüz yuva yoksa, önce `src/data/reference-images.ts`
içine bir girdi (`key` + `caption`) ekleyin; script tanımlı olmayan bir
anahtara dosya yazmaz.

Kayıt tamamlanana kadar uygulama o alanda "Görsel eklenmeyi bekliyor" yazan
kesikli çerçeveli bir kutu gösterir — yani eksik görseller sessizce kaybolmaz,
ekranda görünür. Kaynağı boş kalan bir görsel de uygulama içindeki **Yasal
Bilgi** ekranında kırmızı kutuda listelenir.

## Beklenen görseller

Görseller **teknik bazında** anahtarlanır: tek bir TAP görüntüsü, TAP bloğu
kullanan bütün cerrahilerde gösterilir. Güncel liste kod içinde tutulur ve
buradaki bir tabloya kopyalandığında hemen eskir; bu yüzden listeyi script'ten
alın:

```bash
npm run image:add -- --list
```

Anatomi plakaları (`anatomy-dermatome-anterior`, `anatomy-dermatome-posterior`)
için Gray's Anatomy'nin 1918 baskısı kamu malıdır ve doğrudan kullanılabilir;
kaynak satırına `Gray's Anatomy (1918), public domain` yazmak yeterlidir.
