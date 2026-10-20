import { LOCAL_ANESTHETICS } from "./local-anesthetics";
import { Technique } from "./techniques";

/**
 * Kateter, infüzyon ve yeniden doz.
 *
 * Bu dosyanın ilk hâli kaynaksızdı: rejimler "yaygın öğretim aralıkları" diye
 * yazılmıştı ama arkalarında ne bir kılavuz ne bir çalışma vardı. Şimdi her
 * rejim yayımlanmış bir çalışmadan geliyor ve `sources` alanı zorunlu —
 * kaynağı bulunamayan bloklar tablodan çıkarıldı, uydurulmuş bir sayıyla
 * bırakılmadı. Bir blok burada yoksa "o bloğa kateter konmaz" demek değildir;
 * "bu uygulamanın gösterebileceği yayımlanmış bir rejimi yok" demektir.
 *
 * Çıkarılan bloklar: supraklaviküler, aksiller pleksus, subgluteal siyatik,
 * fasya iliaka, lomber ESP, paravertebral, serratus, QL, lomber epidural.
 *
 * Üç şey ayrı tutuluyor:
 *
 * 1. **Tek atım tavanı infüzyonu yönetmez.** mg/kg tek doz sınırı bir bolusun
 *    tepe plazma düzeyi içindir; infüzyonda soru birikimdir.
 * 2. **Erişkinde yayımlanmış bir mg/kg/saat tavanı yoktur.** Bu dosyanın ilk
 *    hâlinde böyle bir tablo vardı ve uydurmaydı; bkz. NO_ADULT_CEILING_NOTE.
 * 3. **Kateteri olmayan blokta "yeniden doz" yoktur.** Karar bloğu yenilemek
 *    değil, çözülmeden önce sistemik analjeziye geçmektir.
 */

export interface Source {
  /** Kısa künye. */
  citation: string;
  doi: string;
}

export type CatheterRoute = "perineural" | "epidural" | "fascial";

export interface CatheterRegimen {
  techniqueId: string;
  route: CatheterRoute;
  /** Çalışmada kullanılan infüzyon konsantrasyonu (%). */
  concentrationPercent: number;
  /** Bazal hız aralığı, mL/sa. Aralıklı bolus rejimlerinde tanımsız. */
  basalMlPerHour?: [number, number];
  /** Programlı aralıklı bolus: hacim ve aralık. */
  intermittentBolus?: { ml: number; everyHours: number };
  /** Hasta kontrollü bolus, mL. */
  bolusMl?: number;
  /** Bolus kilidi, dakika. */
  lockoutMin?: number;
  /** Çift taraflı çalışılmışsa hız taraf başınadır. */
  perSide?: boolean;
  /** Bu kateterde dikkat edilen şey. */
  note: string;
  /** Sayıların geldiği çalışma(lar). Boş bırakılamaz. */
  sources: Source[];
}

const ILFELD_2004_ISB: Source = {
  citation:
    "Ilfeld BM ve ark. Interscalene perineural ropivacaine infusion: a comparison of two dosing regimens. Reg Anesth Pain Med. 2004;29(1):9-16",
  doi: "10.1016/j.rapm.2003.08.016",
};

const LE_2008: Source = {
  citation:
    "Le LT ve ark. Effects of local anesthetic concentration and dose on continuous interscalene nerve blocks. Reg Anesth Pain Med. 2008;33(6):518-25",
  doi: "10.1016/j.rapm.2008.05.006",
};

const ILFELD_2003_ICB: Source = {
  citation:
    "Ilfeld BM ve ark. Continuous infraclavicular perineural infusion with clonidine and ropivacaine compared with ropivacaine alone. Anesth Analg. 2003;97(3):706-12",
  doi: "10.1213/01.ANE.0000075840.52964.A7",
};

const ILFELD_2004_POPLITEAL: Source = {
  citation:
    "Ilfeld BM ve ark. Popliteal sciatic perineural local anesthetic infusion: a comparison of three dosing regimens. Anesthesiology. 2004;101(4):970-7",
  doi: "10.1097/00000542-200410000-00023",
};

const JAEGER_2013: Source = {
  citation:
    "Jæger P ve ark. Adductor canal block versus femoral nerve block for analgesia after total knee arthroplasty. Reg Anesth Pain Med. 2013;38(6):526-32",
  doi: "10.1097/AAP.0000000000000015",
};

const HANSON_2014: Source = {
  citation:
    "Hanson NA ve ark. Continuous ultrasound-guided adductor canal block for total knee arthroplasty. Anesth Analg. 2014;118(6):1370-7",
  doi: "10.1213/ANE.0000000000000197",
};

const ELKASSABANY_2016: Source = {
  citation:
    "Elkassabany NM ve ark. The risk of falls after total knee arthroplasty with the use of a femoral nerve block versus an adductor canal block. Anesth Analg. 2016;122(5):1696-703",
  doi: "10.1213/ANE.0000000000001237",
};

const DATCHINAMOURTHY_2024: Source = {
  citation:
    "Datchinamourthy T ve ark. Continuous infusion versus programmed intermittent bolus in erector spinae plane block in modified radical mastectomy. Indian J Anaesth. 2024;68(3):273-9",
  doi: "10.4103/ija.ija_922_23",
};

const YOSHIDA_2016: Source = {
  citation:
    "Yoshida T ve ark. Analgesic efficacy of bilateral continuous transversus abdominis plane blocks using an oblique subcostal approach after laparotomy. Br J Anaesth. 2016;117(6):812-20",
  doi: "10.1093/bja/aew339",
};

const TUNCEL_2005: Source = {
  citation:
    "Tuncel G ve ark. Epidural ropivacaine or sufentanil-ropivacaine infusions for post-thoracotomy pain. Eur J Cardiothorac Surg. 2005;28(3):375-9",
  doi: "10.1016/j.ejcts.2005.05.017",
};

export const CATHETER_REGIMENS: CatheterRegimen[] = [
  {
    techniqueId: "interscalene",
    route: "perineural",
    concentrationPercent: 0.2,
    basalMlPerHour: [8, 8],
    bolusMl: 2,
    lockoutMin: 60,
    note: "Çalışmada 8 mL/sa + 2 mL bolus, 4 mL/sa + 6 mL bolusa üstün bulundu: bazal hızı yarıya indirmek dinlenme ağrısını korusa da kurtarma bolusu sayısını, uyku bölünmesini ve memnuniyetsizliği artırdı. Frenik etki bazal hızla sürer; solunum rezervi kısıtlı hastada bu rejim yeniden değerlendirilmelidir.",
    sources: [ILFELD_2004_ISB, LE_2008],
  },
  {
    techniqueId: "infraclavicular",
    route: "perineural",
    concentrationPercent: 0.2,
    basalMlPerHour: [8, 8],
    bolusMl: 2,
    lockoutMin: 20,
    note: "Ayaktan hastada üç gün boyunca taşınabilir pompayla uygulanan rejim. Aynı çalışmada klonidin 1 µg/mL eklenmesi günde yalnızca 2–7 mL'lik bir tüketim farkı yarattı ve analjezi, uyku ya da oral analjezik ihtiyacında anlamlı iyileşme sağlamadı.",
    sources: [ILFELD_2003_ICB],
  },
  {
    techniqueId: "femoral",
    route: "perineural",
    concentrationPercent: 0.2,
    basalMlPerHour: [8, 8],
    note: "Diz protezi çalışmalarında 30 mL %0.5 yükleme sonrası %0.2 ile 8 mL/sa. Kuadriseps gücü başlangıcın %18'ine düştü; aynı hızda adduktor kanal kateterinde %52'ydi. Erken mobilizasyon isteniyorsa adduktor kanal tercih edilir.",
    sources: [JAEGER_2013, ELKASSABANY_2016],
  },
  {
    techniqueId: "acb",
    route: "perineural",
    concentrationPercent: 0.2,
    basalMlPerHour: [8, 8],
    note: "Üç randomize çalışmada da %0.2 ropivakain 8 mL/sa. Femoral bloğa göre kuadriseps gücünü belirgin koruyor; plaseboya göre ilk 48 saatte morfin tüketimini ortalama 16,7 mg azaltıyor.",
    sources: [HANSON_2014, JAEGER_2013, ELKASSABANY_2016],
  },
  {
    techniqueId: "sciatic-popliteal",
    route: "perineural",
    concentrationPercent: 0.2,
    basalMlPerHour: [8, 8],
    bolusMl: 4,
    note: "Üç rejimin karşılaştırıldığı çalışmada 8 mL/sa + 4 mL bolus en iyisi çıktı. Yalnızca bolus (0,3 mL/sa + 9,9 mL) yetersizdi: sürekli bazal hız şart. Yalnızca bazal (12 mL/sa) ise rezervuarı erken tüketti — bolus eklemek daha düşük bazal hızla aynı etkiyi veriyor.",
    sources: [ILFELD_2004_POPLITEAL],
  },
  {
    techniqueId: "esp-thoracic",
    route: "fascial",
    concentrationPercent: 0.2,
    basalMlPerHour: [5, 5],
    intermittentBolus: { ml: 20, everyHours: 4 },
    note: "Mastektomide T4 kateterinden 4 saatte bir 20 mL aralıklı bolus, 5 mL/sa sürekli infüzyona üstün bulundu: 24 saatlik fentanil tüketimi 166 µg'a karşı 332 µg, ağrı skorları düşük, dermatomal yayılım daha geniş. Fasya planında yayılım hacme bağlı olduğundan aralıklı bolus tercih edilir.",
    sources: [DATCHINAMOURTHY_2024],
  },
  {
    techniqueId: "tap",
    route: "fascial",
    concentrationPercent: 0.1,
    basalMlPerHour: [10, 10],
    perSide: true,
    note: "Oblik subkostal yaklaşımla iki taraflı kateter, taraf başına %0.1 ropivakain 10 mL/sa, 50 saat. Tek atıma eklendiğinde morfin tüketimini azalttı. Konsantrasyonun düşük, hacmin yüksek tutulması fasya planında yayılım içindir. İki taraflı olduğundan toplam doz iki katıdır.",
    sources: [YOSHIDA_2016],
  },
  {
    techniqueId: "epidural-thoracic",
    route: "epidural",
    concentrationPercent: 0.2,
    basalMlPerHour: [4.5, 8],
    note: "Torakotomi sonrası T5-6 kateterinden %0.2 ropivakain; sufentanil 0,75 µg/mL eklenmesi tek başına ropivakaine üstün bulundu ve gereken hacmi azalttı. Hipotansiyon, idrar retansiyonu ve — antikoagülan alan hastada — epidural hematom için günlük nörolojik takip zorunludur.",
    sources: [TUNCEL_2005],
  },
];

export function regimenFor(techniqueId: string): CatheterRegimen | undefined {
  return CATHETER_REGIMENS.find((r) => r.techniqueId === techniqueId);
}

export const CATHETER_ROUTES: { id: CatheterRoute; label: string }[] = [
  { id: "perineural", label: "Perinöral" },
  { id: "fascial", label: "Fasya planı" },
  { id: "epidural", label: "Epidural" },
];

/**
 * Konsantrasyon mu, hacim mi, yoksa yalnızca toplam doz mu?
 *
 * Bu sorunun tek bir cevabı yok ve ikisi de yayımlanmış: interskalen blokta
 * düşük konsantrasyon/yüksek hız daha iyi analjezi verdi; popliteal siyatikte
 * ise konsantrasyon ve hacmin hiçbir etkisi bulunamadı, belirleyici olan
 * toplam ilaç kütlesiydi. Uygulamanın ilk hâlinde bunun yerine "fasya planı
 * bloklarında yüksek hacim daha iyi yayılır" diye tek cümlelik bir genelleme
 * vardı; o genellemenin kaynağı yoktu ve en azından periferik sinir
 * kateterleri için yanlıştı.
 */
export const CONCENTRATION_EVIDENCE: { claim: string; sources: Source[] }[] = [
  {
    claim:
      "İnterskalen kateterde %0.2 ile 8 mL/sa, aynı toplam dozu veren %0.4 ile 4 mL/sa'e göre daha az ağrı ve daha yüksek memnuniyet sağladı.",
    sources: [LE_2008],
  },
  {
    claim:
      "Popliteal siyatik kateterde %0.1 ile 8 mL/sa ve %0.4 ile 2 mL/sa eşdeğer bulundu: bu bölgede belirleyici olan konsantrasyon ya da hacim değil, toplam ilaç kütlesidir.",
    sources: [
      {
        citation:
          "Madison SJ ve ark. A randomized, triple-masked, active-controlled investigation of the relative effects of dose, concentration, and infusion rate for continuous popliteal-sciatic nerve blocks in volunteers. Br J Anaesth. 2015;114(1):121-9",
        doi: "10.1093/bja/aeu333",
      },
    ],
  },
  {
    claim:
      "Torasik ESP kateterinde 4 saatte bir 20 mL aralıklı bolus, aynı ilacın 5 mL/sa sürekli infüzyonuna üstün bulundu.",
    sources: [DATCHINAMOURTHY_2024],
  },
];

/**
 * Infüzyon konsantrasyonu neden tek atımdan düşük tutulur.
 *
 * Bu cümle bir doz iddiası değil, yukarıdaki kanıtların ortak sonucu:
 * kateterin amacı analjeziyi sürdürmektir, motor bloğu değil.
 */
export const INFUSION_CONCENTRATION_RATIONALE =
  "Kateter rejimlerinde konsantrasyon tek atımdan düşüktür (çoğunlukla %0.1–0.2): amaç analjeziyi sürdürmek, motor bloğu sürdürmek değil. Yoğun motor blok hem mobilizasyonu hem de sinir hasarının erken fark edilmesini engeller.";

/**
 * Erişkinde yayımlanmış bir mg/kg/saat tavanı yok.
 *
 * Bu ekranda bir zamanlar "erişkin sürekli infüzyon üst sınırları" tablosu
 * vardı (ropivakain 0,5 / levobupivakain ve bupivakain 0,4 mg/kg/sa) ve
 * hesaplayıcı bu sayılara göre yüzde veriyordu. Hiçbiri bir kaynağa
 * dayanmıyordu. Maksimum doz literatürünün kendisi de zaten bunun tam
 * tersini söylüyor: mevcut maksimum doz önerileri kanıta dayalı değildir ve
 * çoğu durumda kesin mg ya da mg/kg sayıları vermenin bilimsel gerekçesi
 * yoktur; anlamlı olan bloğa özgü, yayımlanmış doz aralıklarıdır.
 *
 * Bu yüzden tablo kaldırıldı. Ekran artık mL/sa'i mg'a çeviriyor — bu
 * aritmetiktir, iddia değil — ve sınır yerine dozun hangi durumlarda
 * düşürülmesi gerektiğini söylüyor.
 */
export const NO_ADULT_CEILING_NOTE =
  "Erişkinde sürekli perinöral infüzyon için kanıta dayalı bir mg/kg/saat tavanı yayımlanmamıştır. Maksimum doz önerileri üzerine yapılan derleme, mevcut sınırların randomize çalışmalara değil hayvan deneyleri, olgu bildirimleri ve farmakokinetik çıkarımlara dayandığını; çoğu durumda kesin mg/kg sayıları vermenin bilimsel gerekçesi olmadığını belirtir. Anlamlı olan, bloğa özgü yayımlanmış doz aralıklarıdır — yukarıdaki rejimler bu nedenle tek tek kaynaklandırılmıştır.";

export const NO_ADULT_CEILING_SOURCE: Source = {
  citation:
    "Rosenberg PH, Veering BT, Urmey WF. Maximum recommended doses of local anesthetics: a multifactorial concept. Reg Anesth Pain Med. 2004;29(6):564-75",
  doi: "10.1016/j.rapm.2004.08.003",
};

/**
 * Birikim: toplam plazma düzeyi yükselir ama serbest fraksiyon yükselmeyebilir.
 *
 * Cerrahi sonrası α1-asit glikoprotein artar; ropivakainin bağlı fraksiyonu
 * büyür ve farmakolojik olarak etkin olan serbest derişim toplam derişimle
 * birlikte artmaz. 96 saatlik insizyon içi infüzyonda toplam derişim
 * literatürdeki "toksik" eşiğe yaklaşırken serbest derişim eşiğin 4–7 kat
 * altında kaldı. Bu, uzun infüzyonun otomatik olarak güvenli olduğu anlamına
 * gelmez — AAG yanıtı olmayan ya da klirensi bozuk hastada aynı koruma yoktur.
 */
export const ACCUMULATION_NOTE =
  "Sürekli infüzyonda asıl risk tek dozun tepe düzeyi değil, saatler içinde oluşan birikimdir. 96 saatlik %0.2 ropivakain infüzyonunda (5 mL/sa) toplam plazma derişimi literatürdeki toksisite eşiğine yaklaştı; buna karşılık etkin olan serbest derişim eşiğin 4–7 kat altında kaldı, çünkü cerrahi sonrası α1-asit glikoprotein ortalama %63 arttı ve bağlanmayan fraksiyonu düşürdü. Bu koruma her hastada yoktur.";

export const ACCUMULATION_SOURCE: Source = {
  citation:
    "Corso OH ve ark. Safety of 96-hour incision-site continuous infusion of ropivacaine for postoperative analgesia after bowel cancer resection. Ther Drug Monit. 2007;29(1):57-63",
  doi: "10.1097/FTD.0b013e31802c59ec",
};

/**
 * Dozun gerçekten düşürülmesi gereken durumlar.
 *
 * Tek doz için uptake hızını artıran durumlar (gebelik, ileri yaş) ayrı;
 * tekrarlayan ya da sürekli uygulamada belirleyici olan klirenstir.
 */
export const DOSE_REDUCTION_NOTE =
  "Tekrarlayan ya da sürekli uygulamada dozu düşürmenin en önemli nedeni azalmış klirenstir: karaciğer ve böbrek hastalığı ile kalp yetmezliği bu grubun başında gelir. Uygulama bu düzeltmeleri hesaplamaz; bu hastalarda yayımlanmış rejimin altında kalın ve günlük değerlendirin.";

export interface InfusionLoad {
  mgPerHour: number;
  mgPer24h: number;
  /** Hasta ağırlığı biliniyorsa mg/kg/sa — karşılaştırılacak bir tavan yok. */
  mgPerKgPerHour?: number;
}

/**
 * Bir infüzyon hızının mg karşılığı.
 *
 * Yalnızca birim çevrimi yapar ve hiçbir sınırla karşılaştırmaz: klinikte
 * ayarlanan sayı mL/sa'tir, toksisiteyi belirleyen mg'dır, ve ikisi arasındaki
 * çevrimi ekranda yapmak konsantrasyon değiştirmenin ne anlama geldiğini
 * görünür kılar. Eskiden burada bir "sınırın yüzde kaçı" hesabı vardı;
 * dayandığı sınır uydurma olduğu için kaldırıldı.
 */
export function infusionLoad(
  mlPerHour: number,
  concentrationPercent: number,
  weightKg?: number
): InfusionLoad {
  const mgPerHour = mlPerHour * concentrationPercent * 10;
  return {
    mgPerHour,
    mgPer24h: mgPerHour * 24,
    mgPerKgPerHour: weightKg && weightKg > 0 ? mgPerHour / weightKg : undefined,
  };
}

/** Pediatrik hastada erişkin çalışmaları geçerli değildir. */
export const PEDIATRIC_INFUSION_REDIRECT =
  "Yukarıdaki rejimler erişkin çalışmalarından gelir. Çocukta infüzyon hızları kılavuzlarda yaşa göre ayrı verilir ve belirgin daha düşüktür — Pediatrik Doz ekranındaki infüzyon tablosunu kullanın.";

// ---------------------------------------------------------------------------
// Yeniden doz / çözülme
// ---------------------------------------------------------------------------

export interface WearOffPlan {
  drug: string;
  onsetMin: [number, number];
  durationHours: [number, number];
  /** Sistemik analjeziye başlanması gereken saat. */
  prepareAtHours: [number, number];
}

/**
 * Blok ne zaman çözülür ve ondan önce ne yapılır.
 *
 * Süreler ilaç kataloğundaki başlangıç/süre değerlerinden gelir. "Hazırlan"
 * saati sürenin alt ucundan bir saat önce alınır; bu bir farmakolojik sayı
 * değil, açıkça uygulamanın kendi pratik kuralıdır — istem, ilacın servise
 * ulaşması ve etkisinin başlaması birlikte o kadar sürer. Ekranda da böyle
 * yazar.
 */
export const PREPARE_LEAD_HOURS = 1;

export const PREPARE_RULE_NOTE =
  "«Analjeziye geç» saati bu uygulamanın pratik kuralıdır, yayımlanmış bir eşik değildir: beklenen sürenin alt ucundan bir saat önce alınır.";

export function wearOffPlan(drug: string): WearOffPlan | undefined {
  const la = LOCAL_ANESTHETICS.find((l) =>
    drug.toLowerCase().startsWith(l.drug.toLowerCase())
  );
  if (!la) return undefined;
  const [lo, hi] = la.durationHours;
  return {
    drug: la.label,
    onsetMin: la.onsetMin,
    durationHours: la.durationHours,
    prepareAtHours: [Math.max(0, lo - PREPARE_LEAD_HOURS), hi],
  };
}

export const ADJUVANT_PROLONGS_NOTE =
  "Deksametazon (perinöral veya IV) ve perinöral deksmedetomidin blok süresini belirgin uzatır; bu çizelge adjuvansız tek atım içindir.";

/** Kateteri olmayan blokta "yeniden doz" çoğu zaman yoktur. */
export const NO_CATHETER_NOTE =
  "Bu blok için uygulamada kaynaklandırılmış bir kateter rejimi yok — bu, bloğa kateter konmaz demek değil, gösterebileceğimiz yayımlanmış bir rejim bulunmadığı demektir. Tek atım blok çözüldüğünde aynı bloğu yenilemek genellikle seçenek değildir: ikinci doz ilk dozun üstüne toplam tavana eklenir ve ilk enjeksiyonun yarattığı ödem ikinci girişimi zorlaştırır. Süre dolmadan sistemik analjeziye geçin; kateter gerekiyorsa kurum protokolünüzü kullanın.";

/** Bir tekniğin tipik ilacından çıkarılan çözülme planı. */
export function wearOffFor(technique: Technique): WearOffPlan | undefined {
  return wearOffPlan(technique.typical.drug);
}

/** Ekranda gösterilen bütün kaynaklar, tekrarsız. */
export function allSources(): Source[] {
  const seen = new Map<string, Source>();
  const add = (s: Source) => seen.set(s.doi, s);
  for (const r of CATHETER_REGIMENS) r.sources.forEach(add);
  for (const c of CONCENTRATION_EVIDENCE) c.sources.forEach(add);
  add(NO_ADULT_CEILING_SOURCE);
  add(ACCUMULATION_SOURCE);
  return [...seen.values()];
}
