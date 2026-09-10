/**
 * Lisans metinleri.
 *
 * İzin veren lisansların ortak şartı, telif bildiriminin **ve lisans
 * metninin** dağıtılan her kopyaya eşlik etmesidir. Paket listesi tek başına
 * bunun yarısını karşılar; metinler olmadan bildirim eksik kalır.
 *
 * Metinler tür başına bir kez tutulur — 403 paketin 332'si aynı MIT metnini
 * taşır, hepsini ayrı ayrı yazmak dosyayı megabaytlara çıkarırdı. Telif
 * satırları paket listesinde, metinler burada.
 *
 * Apache-2.0'ın tam metni uzun olduğu için özet değil, tam bağlantısıyla
 * birlikte veriliyor: kısaltılmış bir Apache metni lisansın kendisi değildir
 * ve şartı karşılamaz. Depoda tam metin `src/data/APACHE-2.0.txt` olarak
 * bulunur ve uygulamayla birlikte dağıtılır.
 */

export interface LicenseText {
  id: string;
  label: string;
  /** Metnin tamamı; Apache-2.0 için özet + resmî adres. */
  body: string;
  url?: string;
}

const MIT = `Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`;

const ISC = `Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`;

const BSD_2 = `Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.`;

const BSD_3 = `${BSD_2}

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.`;

export const LICENSE_TEXTS: LicenseText[] = [
  { id: "MIT", label: "MIT", body: MIT },
  { id: "ISC", label: "ISC", body: ISC },
  { id: "BSD-2-Clause", label: "BSD 2-Clause", body: BSD_2 },
  { id: "BSD-3-Clause", label: "BSD 3-Clause", body: BSD_3 },
  {
    id: "Apache-2.0",
    label: "Apache License 2.0",
    body:
      "Telif ve lisans bildirimlerinin korunması, değişikliklerin belirtilmesi ve NOTICE dosyasının taşınması koşuluyla, ticari kullanım dahil kullanma, çoğaltma, değiştirme ve dağıtma hakkı verir; ayrıca katkıda bulunanlardan patent lisansı sağlar. Tam metin uzundur ve kısaltılmış hâli lisansın kendisi sayılmaz — depoda src/data/APACHE-2.0.txt olarak tam hâliyle bulunur.",
    url: "https://www.apache.org/licenses/LICENSE-2.0",
  },
  {
    id: "BlueOak-1.0.0",
    label: "Blue Oak Model License 1.0.0",
    body:
      "İzin veren, patent hükmü içeren sade bir lisans: telif bildiriminin korunması koşuluyla kullanma, kopyalama, değiştirme ve dağıtma serbesttir; garanti verilmez.",
    url: "https://blueoakcouncil.org/license/1.0.0",
  },
  {
    id: "0BSD",
    label: "BSD Zero Clause",
    body: `Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`,
  },
  {
    id: "Unlicense",
    label: "The Unlicense",
    body:
      "Yazılım kamu malına bırakılmıştır: herhangi bir amaçla, ticari olarak da, izin ve atıf gerekmeksizin kullanılabilir. Garanti verilmez.",
    url: "https://unlicense.org/",
  },
  {
    id: "CC0-1.0",
    label: "CC0 1.0 (kamu malı)",
    body:
      "Hak sahibi eseri, hukuken mümkün olduğu ölçüde kamu malına bırakmıştır; atıf dahil hiçbir koşul aranmaz.",
    url: "https://creativecommons.org/publicdomain/zero/1.0/",
  },
  {
    id: "CC-BY-4.0",
    label: "CC BY 4.0",
    body:
      "Atıf verilmesi koşuluyla, ticari kullanım dahil paylaşma ve uyarlama serbesttir. Bu lisans burada bir veri paketi (caniuse-lite tarayıcı uyumluluk veritabanı) için geçerlidir.",
    url: "https://creativecommons.org/licenses/by/4.0/",
  },
  {
    id: "(MIT OR CC0-1.0)",
    label: "MIT veya CC0 1.0 (seçimli)",
    body: "Hak sahibi iki lisanstan birini seçme hakkı vermiştir; ikisi de izin verendir.",
  },
];

export function licenseText(id: string): LicenseText | undefined {
  return LICENSE_TEXTS.find((l) => l.id === id);
}

/** Uygulamayla dağıtılan, npm dışında kalan üçüncü taraf varlıklar. */
export interface BundledAsset {
  name: string;
  what: string;
  license: string;
  copyright: string;
  url?: string;
}

export const BUNDLED_ASSETS: BundledAsset[] = [
  {
    name: "Ionicons",
    what: "Arayüzdeki ikonlar; yazı tipi dosyası uygulamayla birlikte paketlenir.",
    license: "MIT",
    copyright: "Copyright (c) 2015-present Ionic (http://ionic.io/)",
    url: "https://ionic.io/ionicons",
  },
  {
    name: "Expo / React Native arayüz varlıkları",
    what: "Gezinme çubuğundaki geri, kapat ve arama ikonları gibi çerçeveye ait küçük görseller.",
    license: "MIT",
    copyright: "Copyright (c) Meta Platforms, Inc. and affiliates · Copyright (c) 650 Industries, Inc.",
  },
  {
    name: "ISNCSCI dermatom diyagramı",
    what: "Dermatom haritasının SVG geometrisi; react-native-svg ile çizilebilmesi için veri yapısına dönüştürüldü, geometri değiştirilmedi.",
    license: "Apache-2.0",
    copyright: "Copyright (c) 2018 Rick Hansen Institute",
    url: "https://github.com/rick-hansen-institute/ui",
  },
];
