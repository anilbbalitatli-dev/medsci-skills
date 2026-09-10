import { AGE_BANDS, AgeBand, ageBandById } from "@/data/age-dosing";
import {
  basisInfo,
  MAX_HEIGHT_CM,
  MIN_HEIGHT_CM,
  Sex,
  WeightBasis,
  WeightSet,
  dosingWeight,
  weightSet,
} from "@/data/body-weight";
import { useStorage } from "@/utils/use-storage";

/**
 * The patient, held once for the whole app.
 *
 * Every dose figure in this app is a function of weight and age, so those two
 * belong to the session rather than to a screen. They used to be local state in
 * two places — the surgery detail screen's calculator and the combination
 * builder — which meant entering a weight twice and, worse, that the
 * calculator had no age band at all and quietly answered with adult limits for
 * a child.
 *
 * Weight is stored as the raw text the user typed rather than a number, so a
 * half-finished "1." survives a re-render and the field does not fight back
 * while being edited.
 */
export interface PatientState {
  weightInput: string;
  ageBandId: string;
  withEpi: boolean;
  /** Boy, cm. Yalnızca ideal/yağsız/düzeltilmiş ağırlık için gerekir. */
  heightInput: string;
  sex: Sex;
  /** Doz hesabının hangi ağırlığı kullandığı. */
  weightBasis: WeightBasis;
}

const PATIENT_KEY = "patient";

const DEFAULT_PATIENT: PatientState = {
  weightInput: "",
  ageBandId: "adolescent-adult",
  withEpi: false,
  heightInput: "",
  // Varsayılan hem toplam ağırlık hem kadın: ikisi de ihtiyatlı taraf.
  // Toplam ağırlık uygulamanın bugüne kadarki davranışıdır ve kullanıcı
  // bilerek seçmeden hiçbir doz değişmez; kadın formülü aynı boyda daha düşük
  // ideal/yağsız ağırlık verir.
  sex: "female",
  weightBasis: "total",
};

export interface Patient extends PatientState {
  band: AgeBand;
  /**
   * Dozların çarpıldığı ağırlık.
   *
   * Seçilen dayanağa göre toplam ağırlıktan düşük olabilir. Ekranda hangi
   * ağırlığın kullanıldığı hasta çubuğunda yazar; buradan sessizce farklı bir
   * sayı dönmesi, kullanıcının yanlış sayıya bakarken doğru baktığını
   * sanmasına yol açardı.
   */
  weightKg: number;
  hasWeight: boolean;
  /** Girilen gerçek ağırlık; `weightKg` düzeltilmiş olsa bile değişmez. */
  totalWeightKg: number;
  heightCm: number;
  hasHeight: boolean;
  /** Boy da girildiyse dört ağırlık ve BMI; yoksa undefined. */
  weights?: WeightSet;
  /** Düzeltme fiilen uygulanıyor mu (seçildi *ve* hesaplanabiliyor). */
  weightAdjusted: boolean;
  /**
   * Düzeltme bu hastada sunulabilir mi.
   *
   * Pediatrik bantlarda hayır: ne Devine ne Janmahasatian çocukta geçerlidir
   * ve büyüme eğrisi olmadan pediatrik ideal ağırlık hesaplanamaz. Yanlış
   * formülü çocuğa uygulamak, düzeltme yapmamaktan daha kötüdür.
   */
  weightBasisAvailable: boolean;
}

export function usePatient(): [Patient, (patch: Partial<PatientState>) => void] {
  const [stored, setState] = useStorage<PatientState>(PATIENT_KEY, DEFAULT_PATIENT);
  // Cihazda boy/cinsiyet alanları eklenmeden önce kaydedilmiş bir hasta
  // olabilir; eksik alanları varsayılandan tamamlıyoruz ki eski kurulumlar
  // undefined bir dayanakla açılmasın.
  const state: PatientState = { ...DEFAULT_PATIENT, ...stored };

  const totalWeightKg = Number(state.weightInput.replace(",", "."));
  const hasWeight =
    state.weightInput.length > 0 && Number.isFinite(totalWeightKg) && totalWeightKg > 0;

  const heightCm = Number(state.heightInput.replace(",", "."));
  const hasHeight =
    state.heightInput.length > 0 &&
    Number.isFinite(heightCm) &&
    heightCm >= MIN_HEIGHT_CM &&
    heightCm <= MAX_HEIGHT_CM;

  const band = ageBandById(state.ageBandId);
  const weightBasisAvailable = !band.pediatric;

  const weights =
    hasWeight && hasHeight && weightBasisAvailable
      ? weightSet(totalWeightKg, heightCm, state.sex)
      : undefined;

  const basis = weightBasisAvailable ? state.weightBasis : "total";
  const weightKg = weights ? dosingWeight(weights, basis) : totalWeightKg;

  const patient: Patient = {
    ...state,
    band,
    weightKg,
    hasWeight,
    totalWeightKg,
    heightCm,
    hasHeight,
    weights,
    weightAdjusted: Boolean(weights) && basis !== "total",
    weightBasisAvailable,
  };

  return [patient, (patch) => setState({ ...state, ...patch })];
}

/**
 * Bir mg değerinin yanına yazılacak ağırlık etiketi.
 *
 * Düzeltme açıkken "104 kg" yazıp hesabı 72 kg ile yapmak, sayıya bakan kişiyi
 * yanıltır. Tavan gösteren her yer bu etiketi kullanır.
 */
export function weightLabel(patient: Patient): string {
  if (!patient.hasWeight) return "";
  return patient.weightAdjusted
    ? `${basisInfo(patient.weightBasis).short} ${patient.weightKg.toFixed(0)} kg`
    : `${patient.weightInput} kg`;
}

export { AGE_BANDS };
