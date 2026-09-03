import { COVERAGE } from "./coverage-presets";
import { Coverage, LocalAnestheticChoice } from "./types";

/**
 * Canonical, de-duplicated catalogue of the individual techniques the app
 * knows about.
 *
 * `SURGERIES` lists blocks per operation, so the same technique appears many
 * times (TAP under four surgeries, spinal under five) and sometimes under
 * slightly different names. The combination builder needs one entry per
 * technique, so it reads from here rather than de-duplicating by name.
 *
 * `typical` is the commonly cited adult single-shot regimen — the starting
 * point for the dose arithmetic, not a prescription. Paediatric volumes are
 * weight-scaled and do NOT follow these adult figures; see ./age-dosing.ts.
 */
export interface Technique {
  id: string;
  name: string;
  region: string;
  typical: LocalAnestheticChoice;
  coverage: Coverage;
  /** Per-side technique that is usually performed bilaterally. */
  bilateralByDefault?: boolean;
  note?: string;
  /**
   * Where the probe goes, where the needle goes, and what tells you to stop.
   *
   * One sentence per technique, written at the level of orientation rather
   * than instruction — enough to recognise the view being described, not
   * enough to perform the block from. Block cards render this; it lives on the
   * technique rather than on each surgery's copy so the same block does not
   * drift between the four operations that list it.
   */
  landmark?: string;
}

export const TECHNIQUES: Technique[] = [
  // ---- Alt ekstremite -------------------------------------------------
  {
    id: "acb",
    name: "Adduktor Kanal Bloğu (ACB)",
    region: "Alt Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.2, volumeMlRange: [15, 20] },
    coverage: COVERAGE.acb,
    landmark:
      "Uyluğun orta 1/3'ünde, sartorius kasının altında femoral arterin üzerine yüksek frekanslı lineer prob; iğne lateralden mediale, arterin hemen lateral-üstündeki kılıfa.",
  },
  {
    id: "ipack",
    name: "IPACK Bloğu",
    region: "Alt Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.2, volumeMlRange: [10, 15] },
    coverage: COVERAGE.ipack,
    landmark:
      "Popliteal krukta femur kondilleri düzeyinde; iğne medialden laterale, popliteal arter ile femurun posterior kortesi arasındaki aralığa — sinir gövdelerine değil.",
  },
  {
    id: "femoral",
    name: "Femoral Sinir Bloğu",
    region: "Alt Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [15, 20] },
    coverage: COVERAGE.femoral,
    landmark:
      "İnguinal kıvrımda femoral arterin hemen lateralinde, fasya iliakanın altındaki hiperekoik üçgen yapı; iğne lateralden mediale, in-plane.",
  },
  {
    id: "sciatic-popliteal",
    name: "Siyatik Sinir Bloğu (Popliteal)",
    region: "Alt Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [15, 20] },
    coverage: COVERAGE.poplitealSciatic,
    landmark:
      "Popliteal kıvrımın 5–8 cm proksimalinde, tibial ve peroneal sinirlerin ayrıldığı nokta bulunur ve iğne bu ayrım seviyesinde paranöral kılıfa yönlendirilir.",
  },
  {
    id: "saphenous",
    name: "Safen Sinir Bloğu",
    region: "Alt Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [5, 10] },
    coverage: COVERAGE.saphenous,
    landmark:
      "Adduktor kanalın distalinde veya diz altı medialde, safen ven komşuluğunda; yüzeyel bir hedeftir, düşük hacim yeterlidir.",
  },
  {
    id: "ankle-block",
    name: "Ayak Bileği Bloğu (5 sinir)",
    region: "Alt Ekstremite",
    typical: { drug: "Lidokain", concentrationPercent: 1, volumeMlRange: [12, 18] },
    coverage: COVERAGE.ankleBlock,
    landmark:
      "Ayak bileği düzeyinde beş sinir ayrı ayrı: tibial (medial malleol arkası, arter komşuluğu), derin peroneal (dorsalis pedis lateral), yüzeyel peroneal, sural ve safen — son üçü cilt altı halka infiltrasyonu.",
  },
  {
    id: "peng",
    name: "PENG Bloğu",
    region: "Alt Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.2, volumeMlRange: [20, 25] },
    coverage: COVERAGE.peng,
    landmark:
      "Kurvilineer prob AIIS'ten iliopubik eminense oblik; iğne lateralden mediale, ucu kemiğe temas ettirilip hafif geri çekilerek psoas tendonunun altındaki plana.",
  },
  {
    id: "fascia-iliaca",
    name: "Fasya İliaka Bloğu",
    region: "Alt Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.2, volumeMlRange: [30, 40] },
    coverage: COVERAGE.fasciaIliaca,
    landmark:
      "Supra-inguinal yaklaşımda prob inguinal ligamana paralel-sagittal, ASIS yakınında; iğne fasya iliakayı geçip iliakus kası üzerinde hidrodiseksiyonla iliak fossaya doğru yayılır.",
  },
  {
    id: "spinal",
    name: "Spinal Anestezi",
    region: "Nöraksiyel",
    typical: { drug: "Bupivakain (hiperbarik)", concentrationPercent: 0.5, volumeMlRange: [2.5, 3.5] },
    coverage: COVERAGE.spinalLowerLimb,
    landmark:
      "Oturur veya lateral pozisyonda L3-4 ya da L4-5 aralığı; orta hat veya paramedian, BOS gelişi doğrulandıktan sonra enjeksiyon.",
    note: "İntratekal doz, periferik blok dozlarından bağımsız değerlendirilir; toplam sistemik yük hesabına yine de dahil edilir.",
  },
  {
    id: "epidural-lumbar",
    name: "Lomber Epidural",
    region: "Nöraksiyel",
    typical: { drug: "Ropivakain", concentrationPercent: 0.2, volumeMlRange: [10, 15] },
    coverage: COVERAGE.epiduralLumbar,
    landmark:
      "L2-3 veya L3-4 aralığı; direnç kaybı yöntemiyle epidural aralık bulunur, kateter 3–5 cm ilerletilir. Test dozu ile intratekal/intravasküler yerleşim dışlanır.",
    note: "Buradaki hacim tek seferlik bolus içindir. Kateterden sürekli infüzyon yapılıyorsa saatlik doz ayrıca hesaplanmalı ve toplam gün içi yük takip edilmelidir.",
  },
  {
    id: "epidural-thoracic",
    name: "Torasik Epidural",
    region: "Nöraksiyel",
    typical: { drug: "Ropivakain", concentrationPercent: 0.2, volumeMlRange: [5, 10] },
    coverage: COVERAGE.epiduralThoracic,
    landmark:
      "İnsizyonun orta dermatomuna denk gelen aralık (torakotomide T5-7, üst karında T7-9); paramedian yaklaşım tercih edilir, spinöz çıkıntıların eğimi nedeniyle iğne belirgin sefalik açıyla ilerletilir.",
    note: "Segmental bir bloktur: hacim arttıkça kapsama genişler ama sempatik blokaj da yayılır. Torakotomi ve büyük karın cerrahisinde uzun süre referans standart olarak kabul edilmiştir.",
  },
  {
    id: "caudal",
    name: "Kaudal Blok",
    region: "Nöraksiyel",
    typical: { drug: "Ropivakain", concentrationPercent: 0.2, volumeMlRange: [10, 20] },
    coverage: COVERAGE.caudal,
    landmark:
      "Yüzüstü/lateral pozisyonda sakral kornualar arasındaki hiatus; sakrokoksigeal ligaman geçildikten sonra iğne düzleştirilir, USG ile yayılım doğrulanabilir.",
    note: "Pediatrik hacim genellikle Armitage'a göre 0.5–1.25 mL/kg olarak hesaplanır; buradaki erişkin hacmi çocukta geçerli değildir.",
  },

  {
    id: "sciatic-subgluteal",
    name: "Siyatik Sinir Bloğu (Subgluteal)",
    region: "Alt Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [15, 20] },
    coverage: COVERAGE.sciaticSubgluteal,
    landmark:
      "Büyük trokanter ile iskial tuberositas arasında, gluteus maksimusun altındaki subgluteal aralıkta yassı hiperekoik sinir; kurvilineer prob, iğne lateralden mediale.",
    note: "Popliteal yaklaşımın aksine hamstring dalları da bloke olur; diz fleksiyonu zayıflar ve mobilizasyon planı buna göre yapılmalıdır.",
  },
  {
    id: "obturator",
    name: "Obturator Sinir Bloğu",
    region: "Alt Ekstremite",
    typical: { drug: "Lidokain", concentrationPercent: 1, volumeMlRange: [10, 15] },
    coverage: COVERAGE.obturator,
    landmark:
      "İnguinal kıvrımın altında, pektineus ile adduktor kasların arasındaki fasyal düzlemlerde ön ve arka dallar; interadduktor yaklaşımda tek enjeksiyonla iki dal birlikte hedeflenebilir.",
    note: "Mesane tümörü rezeksiyonunda obturator refleksini (adduktor sıçraması) önlemek için kullanıldığında motor blok istenen etkidir; bu endikasyonda kısa etkili ajan tercih edilir.",
  },
  {
    id: "genicular",
    name: "Genikular Sinir Bloğu",
    region: "Alt Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [3, 5] },
    coverage: COVERAGE.genicular,
    landmark:
      "Femur ve tibia metafizlerinde periost-diafiz birleşim noktaları: superomedial, superolateral ve inferomedial genikular sinirler; seviye başına küçük hacim.",
    note: "Kronik diz ağrısında radyofrekans öncesi tanısal blok olarak yaygındır; akut cerrahi analjezide ACB/IPACK kadar yerleşik değildir.",
  },
  {
    id: "quadratus-lumborum",
    name: "Quadratus Lumborum (QL) Bloğu",
    region: "Karın Duvarı",
    typical: { drug: "Ropivakain", concentrationPercent: 0.375, volumeMlRange: [20, 30] },
    coverage: COVERAGE.quadratusLumborum,
    landmark:
      "Kurvilineer prob orta aksiller çizgide iliak krestin üzerinde; 'shamrock' görünümünde quadratus lumborum kasının lateral kenarı (QL1), posterioru (QL2) veya transmusküler (QL3) hedeflenir.",
    bilateralByDefault: true,
    note: "TAP'a göre daha proksimal ve daha uzun süreli analjezi bildirilir; torakolumbar fasya üzerinden paravertebral alana yayılım nedeniyle viseral bileşene de kısmi katkısı olabilir.",
  },

  // ---- Üst ekstremite -------------------------------------------------
  {
    id: "wrist-block",
    name: "Bilek Bloğu (median/ulnar/radial)",
    region: "Üst Ekstremite",
    typical: { drug: "Lidokain", concentrationPercent: 1, volumeMlRange: [9, 15] },
    coverage: COVERAGE.wristBlock,
    landmark:
      "Median: palmaris longus ile fleksör karpi radialis arasında; ulnar: fleksör karpi ulnaris altında, ulnar arterin medialinde; radial: radial stiloid üzerinde yelpaze şeklinde cilt altı.",
    note: "El bileği hareketini korur, günübirlik el cerrahisinde hastanın erken taburculuğunu kolaylaştırır. Turnike gerekiyorsa tek başına yetersizdir.",
  },
  {
    id: "digital",
    name: "Dijital Blok (parmak)",
    region: "Üst Ekstremite",
    typical: { drug: "Lidokain (epinefrinsiz)", concentrationPercent: 1, volumeMlRange: [2, 4] },
    coverage: COVERAGE.digital,
    landmark:
      "Parmak kökünde dorsal ve palmar dijital sinirler için iki taraflı enjeksiyon; alternatif olarak tek enjeksiyonla subkutan transtekal yaklaşım.",
    note: "Klasik öğreti uç organ olduğu için epinefrinden kaçınmaktır. Toplam hacim sınırlı tutulur — dar bir alanda basınç artışı dolaşımı bozabilir.",
  },
  {
    id: "pecs1",
    name: "PECS I Bloğu",
    region: "Toraks",
    typical: { drug: "Ropivakain", concentrationPercent: 0.375, volumeMlRange: [10, 15] },
    coverage: COVERAGE.pecs1,
    landmark:
      "Klavikula altı 2-3. kot düzeyinde, pektoralis majör ile minör arasındaki fasyal düzlem; torakoakromiyal arterin pektoral dalı landmark olarak kullanılır.",
    note: "Yalnızca pektoral sinirleri tutar; cilt duyusunu kapsamaz. Tek başına meme cerrahisi için yetersizdir, ekspander/implant yerleştirilmesinde kas spazmına yöneliktir.",
  },
  {
    id: "parasternal",
    name: "Parasternal Blok (transversus torasis / pekto-interkostal)",
    region: "Toraks",
    typical: { drug: "Ropivakain", concentrationPercent: 0.25, volumeMlRange: [15, 20] },
    coverage: COVERAGE.parasternal,
    bilateralByDefault: true,
    note: "Sternotomi analjezisinde ön göğüs duvarının orta hat bandını kapsar; ESP ve paravertebral bloklar bu bölgeye güvenilir şekilde ulaşmaz.",
    landmark:
      "Sternum kenarının 1–2 cm lateralinde, 3-5. kıkırdak kot düzeyi; pektoralis majör ile interkostal kaslar arasına (pekto-interkostal) ya da transversus torasis kasının yüzeyine. İnternal torasik arter hemen komşudur.",
  },
  {
    id: "interscalene",
    name: "İnterskalen Brakiyal Pleksus Bloğu",
    region: "Üst Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [15, 20] },
    coverage: COVERAGE.interscalene,
    landmark:
      "Krikoid düzeyinde, ön ve orta skalen kaslar arasındaki olukta üst/orta trunkusun 'trafik lambası' görünümü; iğne posterolateralden, C5-C6 komşuluğuna.",
  },
  {
    id: "suprascapular",
    name: "Suprascapular Sinir Bloğu",
    region: "Üst Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [5, 10] },
    coverage: COVERAGE.suprascapular,
    landmark:
      "Supraspinöz fossada, suprascapular çentiğin medialinde; iğne transvers skapular ligamanın altındaki fossa tabanına.",
  },
  {
    id: "axillary-nerve",
    name: "Aksiller Sinir Bloğu",
    region: "Üst Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [5, 10] },
    coverage: COVERAGE.axillaryNerve,
    landmark:
      "Posterior yaklaşımda humerus boynu düzeyinde, posterior sirkumfleks humeral arter komşuluğunda deltoidin altına.",
  },
  {
    id: "supraclavicular",
    name: "Supraklaviküler Brakiyal Pleksus Bloğu",
    region: "Üst Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [20, 30] },
    coverage: COVERAGE.supraclavicular,
    landmark:
      "Klavikula üstünde subklavyen arterin lateral-superiorunda 'üzüm salkımı' demeti; iğne lateralden mediale, plevra sürekli görüş alanında tutulur.",
  },
  {
    id: "infraclavicular",
    name: "İnfraklaviküler Brakiyal Pleksus Bloğu",
    region: "Üst Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [20, 30] },
    coverage: COVERAGE.infraclavicular,
    landmark:
      "Korakoid çıkıntının medial-kaudalinde, aksiller arter etrafındaki üç kord; iğne dik açıya yakın, hedef arterin posteriorundaki U şeklinde yayılım.",
  },
  {
    id: "axillary-plexus",
    name: "Aksiller Brakiyal Pleksus Bloğu",
    region: "Üst Ekstremite",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [20, 30] },
    coverage: COVERAGE.axillaryPlexus,
    landmark:
      "Aksillada arter etrafında median, ulnar ve radial sinirler ayrı ayrı; muskülokutanöz sinir korakobrakiyalis içinde ayrıca aranır.",
  },
  {
    id: "ivra",
    name: "Bier Bloğu (IVRA)",
    region: "Üst Ekstremite",
    typical: { drug: "Lidokain (epinefrinsiz)", concentrationPercent: 0.5, volumeMlRange: [40, 50] },
    coverage: COVERAGE.ivra,
    landmark:
      "Ekstremite eleve edilip Esmarch ile boşaltılır, çift turnike şişirilir, distal bir venden yavaş enjeksiyon. Turnike en az 20 dakika indirilmez.",
    note: "Turnike erken sönerse tüm doz aniden sistemik dolaşıma geçer; başka blokla kombine edilmesi önerilmez.",
  },

  // ---- Karın duvarı ---------------------------------------------------
  {
    id: "tap",
    name: "TAP Bloğu",
    region: "Karın Duvarı",
    typical: { drug: "Ropivakain", concentrationPercent: 0.375, volumeMlRange: [15, 20] },
    coverage: COVERAGE.tap,
    landmark:
      "Orta aksiller çizgide kot kavsi ile iliak krest arasında; eksternal oblik, internal oblik ve transversus abdominis katmanları ayırt edilip iğne son iki kas arasındaki plana.",
    bilateralByDefault: true,
  },
  {
    id: "rectus-sheath",
    name: "Rektus Kılıf Bloğu",
    region: "Karın Duvarı",
    typical: { drug: "Ropivakain", concentrationPercent: 0.25, volumeMlRange: [10, 15] },
    coverage: COVERAGE.rectusSheath,
    landmark:
      "Umbilikus düzeyinde rektus abdominis kasının arka kılıfı ile kas gövdesi arasındaki potansiyel aralık; iki taraflı uygulanır.",
    bilateralByDefault: true,
  },
  {
    id: "ilioinguinal",
    name: "İlioinguinal–İliohipogastrik Blok",
    region: "Karın Duvarı",
    typical: { drug: "Ropivakain", concentrationPercent: 0.25, volumeMlRange: [10, 15] },
    coverage: COVERAGE.ilioinguinal,
    landmark:
      "ASIS'in medial-kaudalinde, internal oblik ile transversus abdominis arasında; iki sinir genellikle birlikte görülür.",
  },
  {
    id: "port-site",
    name: "Port Yeri İnfiltrasyonu",
    region: "Karın Duvarı",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [3, 5] },
    coverage: COVERAGE.portSiteInfiltration,
    landmark:
      "İnsizyon hattı boyunca cilt, cilt altı ve fasyaya infiltrasyon; port yerleri kapatılmadan önce uygulanır.",
  },

  // ---- Toraks / göğüs duvarı -----------------------------------------
  {
    id: "pecs2",
    name: "PECS II Bloğu",
    region: "Toraks",
    typical: { drug: "Ropivakain", concentrationPercent: 0.375, volumeMlRange: [20, 30] },
    coverage: COVERAGE.pecs2,
    landmark:
      "Klavikula altı 3-4. kot düzeyinde iki enjeksiyon: pektoralis majör-minör arası ve pektoralis minör-serratus anterior arası.",
  },
  {
    id: "serratus",
    name: "Serratus Anterior Plan Bloğu",
    region: "Toraks",
    typical: { drug: "Ropivakain", concentrationPercent: 0.375, volumeMlRange: [20, 30] },
    coverage: COVERAGE.serratus,
    landmark:
      "Orta aksiller çizgide 4-5. kot düzeyinde, serratus anteriorun yüzeyine (latissimus dorsi altına) veya derinine.",
  },
  {
    id: "paravertebral",
    name: "Torasik Paravertebral Blok",
    region: "Toraks",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [15, 20] },
    coverage: COVERAGE.paravertebralThoracotomy,
    landmark:
      "Spinöz çıkıntıdan 2.5 cm lateral, transvers çıkıntı ve süperior kostotransvers ligaman görülür; iğne ligamanı geçince plevranın öne itilmesi beklenir.",
  },
  {
    id: "esp-thoracic",
    name: "Erektor Spina Plan Bloğu (Torasik)",
    region: "Toraks",
    typical: { drug: "Ropivakain", concentrationPercent: 0.375, volumeMlRange: [20, 30] },
    coverage: COVERAGE.espThoracotomy,
    landmark:
      "Orta hattan 3 cm lateral, hedef seviyenin transvers çıkıntısı; iğne erektör spina kasının altına, kemiğe temas edecek şekilde — kraniokaudal yayılım aranır.",
  },
  {
    id: "intercostal",
    name: "İnterkostal Sinir Bloğu",
    region: "Toraks",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [3, 5] },
    coverage: COVERAGE.intercostal,
    landmark:
      "Kot açısında, kotun alt kenarındaki oluğa; iğne kot alt kenarından hafifçe kaydırılır, nörovasküler demet komşuluğunda küçük hacim.",
    note: "Hacim seviye başınadır; çok seviyeli uygulamada toplam doz hızla artar.",
  },

  // ---- Omurga / baş-boyun / diğer -------------------------------------
  {
    id: "esp-lumbar",
    name: "Erektor Spina Plan Bloğu (Lomber)",
    region: "Omurga",
    typical: { drug: "Ropivakain", concentrationPercent: 0.375, volumeMlRange: [20, 30] },
    coverage: COVERAGE.espLumbar,
    landmark:
      "Hedef lomber seviyenin transvers çıkıntısı üzerinde, erektör spina kasının altına; insizyon hattı boyunca iki taraflı uygulanır.",
    bilateralByDefault: true,
  },
  {
    id: "wound-infiltration",
    name: "Cerrahi Yara İnfiltrasyonu",
    region: "Omurga",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [15, 20] },
    coverage: COVERAGE.woundInfiltration,
    landmark:
      "Kapatma öncesi insizyon kenarlarına ve derin fasya katmanlarına cerrah tarafından infiltrasyon.",
  },
  {
    id: "scpb",
    name: "Yüzeyel Servikal Pleksus Bloğu",
    region: "Baş-Boyun",
    typical: { drug: "Ropivakain", concentrationPercent: 0.375, volumeMlRange: [10, 15] },
    coverage: COVERAGE.scpb,
    landmark:
      "Sternokleidomastoid kasın posterior kenarının orta noktası; yüzeyel servikal fasyanın altına, kas altına girilmeden yelpaze şeklinde.",
    bilateralByDefault: true,
  },
  {
    id: "tumescent",
    name: "Tümesan Anestezi",
    region: "Alt Ekstremite",
    typical: { drug: "Lidokain", concentrationPercent: 0.1, volumeMlRange: [200, 400] },
    coverage: COVERAGE.tumescent,
    landmark:
      "Ven trasesi boyunca perivenöz alana, USG eşliğinde büyük hacimli seyreltik solüsyon; aynı zamanda ısı hasarına karşı termal tampon oluşturur.",
    note:
      "Tümesan dozlama bu uygulamanın mg/kg tablosuyla değerlendirilemez: solüsyon çok seyreltiktir, epinefrin içerir ve cilt altına verildiği için emilim yavaş, pik gecikmelidir. Literatürde çok daha yüksek toplam mg/kg değerleri bildirilmiştir; buradaki sınır hesabı bu tekniğe uygulanmamalıdır.",
  },
  {
    id: "deep-cervical",
    name: "Derin Servikal Pleksus Bloğu",
    region: "Baş-Boyun",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [10, 15] },
    coverage: COVERAGE.deepCervical,
    landmark:
      "C2-C3-C4 transvers çıkıntılarının posterior tüberkülleri; mastoid ile Chassaignac tüberkülü arasındaki çizgi üzerinde, tek veya üç enjeksiyon.",
    note: "Yüzeyel bloğun aksine frenik sinir felci, rekürren laringeal sinir tutulumu ve vertebral arter enjeksiyonu riski taşır; bu nedenle günümüzde çoğu endikasyonda yüzeyel blok tercih edilir. İki taraflı uygulanmaz.",
  },
  {
    id: "scalp-block",
    name: "Skalp Bloğu",
    region: "Baş-Boyun",
    typical: { drug: "Ropivakain", concentrationPercent: 0.5, volumeMlRange: [20, 30] },
    coverage: COVERAGE.scalp,
    landmark:
      "Altı sinir çifti halka şeklinde: supraorbital ve supratroklear (kaş üzeri), zigomatikotemporal, aurikulotemporal (tragus önü, yüzeyel temporal arter komşuluğu), büyük ve küçük oksipital (oksipital protuberans hizası).",
    note: "Kraniyotomide çivili başlık takılması ve insizyon yanıtını körler; hemodinamik dalgalanmayı azaltır. Epinefrinli solüsyon skalpin yoğun kanamasını da sınırlar.",
  },
  {
    id: "pudendal",
    name: "Pudendal Sinir Bloğu",
    region: "Ürogenital",
    typical: { drug: "Lidokain", concentrationPercent: 1, volumeMlRange: [10, 20] },
    coverage: COVERAGE.pudendal,
    bilateralByDefault: true,
    landmark:
      "Transvajinal yaklaşımda iskial spina palpe edilip sakrospinöz ligamanın hemen medial-altına; perineal yaklaşımda iskial tuberositas medialinden pudendal kanala.",
    note: "Vajinal doğumun ikinci evresinde ve perine cerrahisinde kullanılır; uterus kaynaklı viseral ağrıyı kapsamaz.",
  },
  {
    id: "penile",
    name: "Dorsal Penil Sinir Bloğu",
    region: "Ürogenital",
    typical: { drug: "Lidokain (epinefrinsiz)", concentrationPercent: 1, volumeMlRange: [2, 5] },
    coverage: COVERAGE.penileBlock,
    landmark:
      "Simfizis pubis altında, Buck fasyasının derinine iki taraflı; alternatif olarak penis kökü halka bloğu.",
    note: "Uç organ — epinefrinli solüsyon kullanılmaz.",
  },
];

export const TECHNIQUE_REGIONS = Array.from(new Set(TECHNIQUES.map((t) => t.region)));

export function techniqueById(id: string): Technique | undefined {
  return TECHNIQUES.find((t) => t.id === id);
}
