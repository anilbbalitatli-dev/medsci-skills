/**
 * Yasal metinler ve köken bilgisi.
 *
 * Tek bir yerde tutulur, çünkü aynı metin üç ayrı yere bakar: uygulama içindeki
 * "Yasal Bilgi" ekranı, App Store'un gizlilik beyanı ve deponun
 * THIRD-PARTY-LICENSES.md dosyası. Üçünün birbirinden ayrışması, en kötü
 * ihtimalle mağazaya yanlış beyan vermek demektir.
 *
 * Metinler bilinçli olarak "sorumluluk reddi" dilinden fazlasıdır: uygulamanın
 * neyi bildiğini, neyi bilmediğini ve verisinin nereden geldiğini söyler. Bir
 * doz tavanını okuyan kişinin, o sayının hangi kılavuzdan ve hangi varsayımla
 * geldiğini görebilmesi asıl korumadır; "sorumluluk kabul edilmez" cümlesi
 * değil.
 */

export interface LegalSection {
  id: string;
  title: string;
  /** Vurgulu (uyarı) kart olarak çizilir. */
  emphasis?: boolean;
  paragraphs?: string[];
  bullets?: string[];
}

/** Metinlerin son gözden geçirildiği tarih; ekranın altında gösterilir. */
export const LEGAL_REVISED = "Eylül 2026";

export const CLINICAL_SECTIONS: LegalSection[] = [
  {
    id: "intended-use",
    title: "Kullanım amacı",
    emphasis: true,
    paragraphs: [
      "Bu uygulama anestezi ve algoloji alanında çalışan sağlık profesyonelleri ile bu alanda eğitim görenler için hazırlanmış bir eğitim ve referans kaynağıdır. Ders kitabı, kılavuz özeti ve anatomik şema niteliğindedir.",
      "Klinik karar destek sistemi veya tıbbi cihaz olarak tasarlanmamıştır. Belirli bir hasta için blok seçimi, ilaç seçimi ya da doz kararı üretmez; kılavuzlarda yayımlanmış tipik değerleri ve sınırları gösterir.",
      "Hasta ağırlığı ve yaşı girildiğinde görünen sayılar, seçilen kılavuz sınırının o ağırlıkla çarpımından ibarettir. Bu bir öneri değil, bir aritmetik gösterimdir; hastanın kendisini değerlendirmez.",
    ],
  },
  {
    id: "responsibility",
    title: "Sorumluluk",
    paragraphs: [
      "Uygulanacak blok, ilaç, konsantrasyon ve hacim kararı her zaman hastayı gören sorumlu klinisyene aittir. Girişim öncesi güncel kılavuzları, kurum protokolünüzü ve ilacın onaylı kısa ürün bilgisini (KÜB) doğrulayın.",
      "Uygulamayı hazırlayanlar, buradaki bilgilerin kullanılmasından doğabilecek klinik sonuçlardan sorumlu tutulamaz. İçerik olduğu gibi sunulur; eksiksiz, hatasız veya güncel olduğu garanti edilmez.",
      "Hata bulduğunuzu düşünüyorsanız bildirin: yanlış bir sayı, düzeltilene kadar herkes için yanlıştır.",
    ],
  },
  {
    id: "limits",
    title: "İçeriğin bilinen sınırları",
    paragraphs: [
      "Aşağıdakiler eksiklik değil, kapsam dışı bırakılmış konulardır. Uygulamayı kullanırken bunları kendiniz tamamlamanız gerekir:",
    ],
    bullets: [
      "Doz tavanları sağlıklı erişkin ve çocuk için yayımlanmış değerlerdir. Karaciğer ve böbrek yetmezliği, kalp yetmezliği, gebelik, ileri yaş, kaşeksi ve asidoz tavanı düşürür; uygulama bu düzeltmeleri yapmaz.",
      "Ağırlık girdisi gerçek vücut ağırlığı olarak işlenir. Obez hastada ideal veya düzeltilmiş vücut ağırlığı kullanılması gerekir; bu hesap uygulamada yoktur.",
      "Birden çok blok yapıldığında dozlar tek bir tavana doğru toplanır. Uygulama kombinasyonlarda toplamı gösterir, ancak emilim hızının bloktan bloğa değiştiğini (interkostal > kaudal > periferik) hesaba katmaz.",
      "Sinir ve dermatom haritası öğretim amaçlı bir basitleştirmedir. Gerçek innervasyon kişiden kişiye değişir; blok yayılımı hacme, iğne ucu konumuna ve anatomik varyasyona bağlıdır.",
      "Antikoagülan kullanan hastada nöraksiyel ve derin blok zamanlaması bu uygulamanın kapsamında değildir; ASRA/ESRA antikoagülasyon kılavuzuna bakın.",
      "İlaç etkileşimleri, alerji ve kontrendikasyon kontrolü yapılmaz.",
    ],
  },
];

export const PRIVACY_SECTION: LegalSection = {
  id: "privacy",
  title: "Gizlilik",
  paragraphs: [
    "Bu uygulama hiçbir veri toplamaz ve hiçbir veri göndermez.",
    "Girdiğiniz ağırlık ve yaş, seçtiğiniz favoriler ve son bakılan cerrahiler yalnızca cihazınızda saklanır. Sunucuya gönderilmez, yedeklenmez, üçüncü taraflarla paylaşılmaz. Uygulamada analitik, reklam veya çökme raporlama aracı yoktur.",
    "Uygulama çalışmak için internet bağlantısı kullanmaz; tüm içerik uygulamanın içindedir. Uygulamayı silmeniz, cihazda tutulan bu tercihleri de siler.",
    "Girdiğiniz hiçbir bilgi hasta kimliği içermediği için kişisel sağlık verisi de tutulmaz; ağırlık ve yaş bir kişiyle ilişkilendirilmeden, yalnız hesap girdisi olarak saklanır.",
  ],
};

export interface DataSource {
  topic: string;
  citation: string;
  note?: string;
}

/**
 * Uygulamadaki sayıların geldiği yerler. Mağaza incelemesinde doz veren
 * uygulamalardan kaynak istenir; liste bu yüzden hem burada hem inceleme
 * notunda kullanılabilecek biçimde tutulur.
 */
export const DATA_SOURCES: DataSource[] = [
  {
    topic: "Pediatrik doz tavanları ve infüzyon hızları",
    citation:
      "Suresh S ve ark. The European Society of Regional Anaesthesia and Pain Therapy / American Society of Regional Anesthesia and Pain Medicine Recommendations on Local Anesthetics and Adjuvants Dosage in Pediatric Regional Anesthesia. Reg Anesth Pain Med. 2018;43(2):211-216",
    note: "Tavanlar teknik grubuna göre verilir; uygulama bu yapıyı korur.",
  },
  {
    topic: "Pediatrik doz tavanları (ikinci kaynak)",
    citation:
      "SFAR / ADARPEF — Recommandations Formalisées d'Experts: Anesthésie loco-régionale en pédiatrie",
    note: "İki kaynağın çeliştiği yerlerde uygulama çelişkiyi gizlemez, ikisini de gösterir.",
  },
  {
    topic: "Lokal anestezik sistemik toksisitesi (LAST)",
    citation: "ASRA Local Anesthetic Systemic Toxicity Checklist",
    note: "Özetlenmiştir; olay anında kurumunuzun tam protokolü esastır.",
  },
  {
    topic: "Dermatom diyagramı geometrisi",
    citation:
      "ISNCSCI dermatome diagram — Rick Hansen Institute (@rhi-isncsci-ui), Apache License 2.0",
    note: "SVG yol verisi react-native-svg ile çizilebilmesi için dönüştürülmüştür; geometri değiştirilmemiştir.",
  },
  {
    topic: "Blok endikasyonları, hacim ve konsantrasyon aralıkları",
    citation:
      "Genel rejyonal anestezi öğretim kaynakları ve kurumsal uygulama alışkanlıkları",
    note: "Tek bir kılavuzdan alınmamıştır; tipik aralıklardır ve kurumdan kuruma değişir.",
  },
];

export interface ImageLicense {
  /** Bu lisansı taşıyan dosya adlarının önekiyle eşleşen anahtarlar. */
  keys: string[];
  license: string;
  commercial: boolean;
  citation: string;
  modification?: string;
}

export const IMAGE_LICENSES: ImageLicense[] = [
  {
    keys: ["usg-fascia-iliaca", "usg-femoral", "usg-lfcn", "usg-peng"],
    license: "CC BY 4.0",
    commercial: true,
    citation:
      "Muse IO, Deiling B, Grinman L, Hadeed MM, Elkassabany N. Peripheral Nerve Blocks for Hip Fractures. J Clin Med. 2024;13(12):3457",
    modification:
      "Yalnızca yazarların kendi ultrason figürleri alınmıştır. Aynı makalenin Şekil 1, 2 ve 7'si başka yayıncılardan izinle basıldığı için CC BY kapsamı dışındadır ve kullanılmamıştır.",
  },
  {
    keys: [
      "usg-paravertebral",
      "usg-intercostal",
      "usg-esp",
      "usg-pecs2",
      "usg-serratus",
    ],
    license: "CC BY-NC 4.0",
    commercial: false,
    citation:
      "Park D, Chang MC. Ultrasound-guided interventions for controlling the thoracic spine and chest wall pain: a narrative review. J Yeungnam Med Sci. 2022;39(3):190-199",
    modification:
      "Birleşik figürlerden yalnızca ultrason panelleri kırpılmıştır; görüntü, etiket ve işaretler değiştirilmemiştir.",
  },
];

/** Lisans listesinde yeri olmayan görseller bu metni alır. */
export const OWN_WORK_LICENSE =
  "Bu uygulama için hazırlanmıştır — kısıt taşımaz.";

export const SCHEMATIC_NOTE =
  "Blok kartlarındaki sonoanatomi çizimleri ve dermatom işaretlemeleri bu uygulama için çizilmiştir. Gerçek bir ultrason görüntüsünün yerini tutmaz; hangi yapının nerede aranacağını gösteren şemalardır.";
