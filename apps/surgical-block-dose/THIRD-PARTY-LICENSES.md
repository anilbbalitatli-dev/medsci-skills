# Üçüncü Taraf Lisansları

Bu uygulama, aşağıdaki üçüncü taraf materyalini içerir.

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
