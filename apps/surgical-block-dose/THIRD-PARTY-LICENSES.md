# Üçüncü Taraf Lisansları

Bu uygulama, aşağıdaki üçüncü taraf materyalini içerir.

> ## ⚠ Deponun MIT lisansı bu dosyaları KAPSAMAZ
>
> Bu depo MIT lisanslıdır ve MIT ticari kullanıma izin verir. Ancak
> `assets/reference/` altındaki ultrason görüntüleri **CC BY-NC 4.0**
> lisanslıdır ve **ticari kullanıma izin vermez**. Bu iki lisans birbirine
> dönüştürülemez.
>
> Dolayısıyla:
>
> - Uygulama **ücretsiz/eğitim amaçlı** kaldığı sürece sorun yoktur.
> - Uygulamayı **ücretli hale getirir veya ticari bir üründe kullanırsanız**,
>   aşağıda listelenen `usg-*.jpg` dosyalarını çıkarmanız gerekir.
> - Depoyu MIT şartlarıyla yeniden kullanan üçüncü kişiler de aynı kısıtla
>   bağlıdır; bu nedenle kısıt hem burada hem `assets/reference/README.md`
>   içinde belirtilmiştir.
>
> ### Nasıl çıkarılır
>
> ```bash
> ./scripts/strip-noncommercial-assets.sh
> ```
>
> **Dosyaları tek başına silmek yetmez ve build'i kırar.** Metro `require()`
> çağrılarını derleme sırasında çözdüğü için, kayıttaki satır dururken dosya
> yoksa paketleme `Unable to resolve module` hatasıyla durur. Script ikisini
> birlikte kaldırır: `src/data/block-images.ts` içindeki `@noncommercial`
> işaretli satırları ve işaret ettikleri dosyaları.
>
> Sonrasında ilgili blok kartları şematik sonoanatomi çizimine düşer; o
> çizimler bu depoya özgü orijinal çalışmadır ve hiçbir kısıt taşımaz.
> Script çalıştırıldıktan sonra bu bölümü de dosyadan silin.

## ISNCSCI Dermatom Diyagramı

`src/data/dermatome-figure.ts` içindeki SVG geometrisi (vücut şekli ve C2–S1
dermatom segmentlerinin sınırları), Rick Hansen Institute'un ISNCSCI UI
bileşeninden türetilmiştir.

- **Kaynak:** `@rhi-isncsci-ui/dermatome-diagram` (npm), sürüm 0.0.1
- **Depo:** https://github.com/rick-hansen-institute/ui
- **Telif:** Copyright (c) 2018 Rick Hansen Institute. All rights reserved.
- **Lisans:** Apache License, Version 2.0

Değişiklik bildirimi: Orijinal materyal bir web bileşeni (custom element)
içinde HTML/SVG olarak dağıtılmaktadır. Bu uygulamada SVG yol (path) verisi,
`react-native-svg` ile çizilebilmesi ve her segmentin ayrı ayrı
renklendirilebilmesi için TypeScript veri yapısına dönüştürülmüştür. Geometri
değiştirilmemiştir.

Apache License 2.0'ın tam metni `src/data/APACHE-2.0.txt` dosyasındadır ve
şu adresten de edinilebilir: http://www.apache.org/licenses/LICENSE-2.0

Bu lisans, materyalin ticari kullanım dahil yeniden dağıtımına, telif ve
lisans bildirimlerinin korunması ve değişikliklerin belirtilmesi koşuluyla
izin verir.

## Ultrason Görüntüleri (Toraks ve Göğüs Duvarı)

`assets/reference/usg-paravertebral.jpg`, `usg-intercostal.jpg`, `usg-esp.jpg`,
`usg-pecs2.jpg`, `usg-serratus.jpg`

- **Kaynak:** Park D, Chang MC. *Ultrasound-guided interventions for controlling
  the thoracic spine and chest wall pain: a narrative review.* J Yeungnam Med
  Sci. 2022;39(3):190-199. https://doi.org/10.12701/jyms.2022.00192
- **Telif:** Copyright © 2022 Yeungnam University College of Medicine, Yeungnam
  University Institute of Medical Science
- **Lisans:** Creative Commons Attribution **Non-Commercial** 4.0
  (http://creativecommons.org/licenses/by-nc/4.0/) — atıf verilmesi koşuluyla,
  **ticari olmayan** kullanım, dağıtım ve çoğaltma serbesttir.

Hangi figürün nereye karşılık geldiği:

| Dosya | Orijinal figür | Uygulamadaki blok |
| --- | --- | --- |
| `usg-paravertebral.jpg` | Fig. 3 | Torasik paravertebral (torakotomi, meme cerrahisi) |
| `usg-intercostal.jpg` | Fig. 4 | İnterkostal sinir bloğu (torakotomi) |
| `usg-esp.jpg` | Fig. 5 | ESP (torakotomi, lomber omurga) |
| `usg-pecs2.jpg` | Fig. 6 | PECS II (meme cerrahisi) |
| `usg-serratus.jpg` | Fig. 7 | Serratus anterior plan (meme cerrahisi) |

**Değişiklik bildirimi:** Orijinal figürler ultrason panelleri ile prob
yerleşimini gösteren klinik fotoğraflardan oluşan birleşik görsellerdir. Bu
uygulamada yalnızca **ultrason panelleri** alınacak şekilde kırpılmış, ardından
1400 piksel genişliğe ölçeklenmiştir. Ultrason görüntülerinin kendisinde,
etiketlerinde veya işaretlerinde hiçbir değişiklik yapılmamıştır. Klinik
fotoğraf panelleri kasıtlı olarak çıkarılmıştır.

Atıf, her görselin altında uygulama içinde de gösterilir.
