# Üçüncü Taraf Lisansları

Bu uygulama, aşağıdaki üçüncü taraf materyalini içerir.

> ## ⚠ Deponun MIT lisansı bu dosyaları KAPSAMAZ
>
> Bu depo MIT lisanslıdır ve MIT ticari kullanıma izin verir. Ancak
> `assets/reference/` altındaki ultrason görüntülerinin **bir kısmı**
> **CC BY-NC 4.0** lisanslıdır ve **ticari kullanıma izin vermez**. Bu iki
> lisans birbirine dönüştürülemez.
>
> **Kısıtlı olanlar (5 dosya, CC BY-NC 4.0):** `usg-paravertebral.jpg`,
> `usg-intercostal.jpg`, `usg-esp.jpg`, `usg-pecs2.jpg`, `usg-serratus.jpg`
>
> **Kısıtsız olanlar (4 dosya, CC BY 4.0):** `usg-fascia-iliaca.jpg`,
> `usg-femoral.jpg`, `usg-lfcn.jpg`, `usg-peng.jpg` — bunlar ticari kullanımda
> da kalabilir, yalnızca atıf gerekir.
>
> Dolayısıyla:
>
> - Uygulama **ücretsiz/eğitim amaçlı** kaldığı sürece sorun yoktur.
> - Uygulamayı **ücretli hale getirir veya ticari bir üründe kullanırsanız**,
>   yalnızca yukarıdaki **kısıtlı 5 dosyayı** çıkarmanız gerekir.
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

## Ultrason Görüntüleri (Kalça ve Alt Ekstremite)

`assets/reference/usg-fascia-iliaca.jpg`, `usg-femoral.jpg`, `usg-lfcn.jpg`,
`usg-peng.jpg`

- **Kaynak:** Muse IO, Deiling B, Grinman L, Hadeed MM, Elkassabany N.
  *Peripheral Nerve Blocks for Hip Fractures.* J Clin Med. 2024;13(12):3457.
  https://doi.org/10.3390/jcm13123457
- **Telif:** Copyright © 2024 by the authors. Licensee MDPI, Basel, Switzerland.
- **Lisans:** Creative Commons Attribution 4.0 (CC BY 4.0)
  (https://creativecommons.org/licenses/by/4.0/) — atıf verilmesi koşuluyla
  **ticari kullanım dahil** dağıtım, çoğaltma ve uyarlama serbesttir.

Hangi figürün nereye karşılık geldiği:

| Dosya | Orijinal figür | Uygulamadaki blok |
| --- | --- | --- |
| `usg-fascia-iliaca.jpg` | Fig. 3 | Fasya iliaka (supra-inguinal / SIFI) |
| `usg-femoral.jpg` | Fig. 4 | Femoral sinir bloğu (TKA, ACL, BKA) |
| `usg-lfcn.jpg` | Fig. 5 | Fasya iliaka — LFCN hedefi (ikinci görsel) |
| `usg-peng.jpg` | Fig. 6 | PENG (THA, kalça kırığı) |

> **Kullanılmayan figürler.** Aynı makalenin **Şekil 1, 2 ve 7**'si başka
> yayıncılardan (Oxford University Press, AAOS/OrthoInfo, Elsevier) *"reproduced
> with permission"* notuyla alınmıştır. Makalenin CC BY 4.0 lisansı bu üç
> figürü **kapsamaz**; bu nedenle uygulamaya alınmamışlardır. Aynı makaleden
> ileride figür eklenecekse önce o figürün altında böyle bir izin notu olup
> olmadığına bakılmalıdır.

**Değişiklik bildirimi:** Figürler PDF'ten gömülü çözünürlükte çıkarılmış,
1400 pikselden geniş olanlar 1400 piksel genişliğe ölçeklenmiş ve JPEG olarak
yeniden kodlanmıştır. Kırpma yapılmamış; ultrason görüntülerinde, etiketlerde
veya işaretlerde değişiklik yoktur.

---

Atıf, her görselin altında uygulama içinde de gösterilir.
