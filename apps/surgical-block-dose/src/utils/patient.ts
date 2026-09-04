import { AGE_BANDS, AgeBand, ageBandById } from "@/data/age-dosing";
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
}

const PATIENT_KEY = "patient";

const DEFAULT_PATIENT: PatientState = {
  weightInput: "",
  ageBandId: "adolescent-adult",
  withEpi: false,
};

export interface Patient extends PatientState {
  band: AgeBand;
  /** Parsed weight; only meaningful when `hasWeight` is true. */
  weightKg: number;
  hasWeight: boolean;
}

export function usePatient(): [Patient, (patch: Partial<PatientState>) => void] {
  const [state, setState] = useStorage<PatientState>(PATIENT_KEY, DEFAULT_PATIENT);

  const weightKg = Number(state.weightInput.replace(",", "."));
  const hasWeight = state.weightInput.length > 0 && Number.isFinite(weightKg) && weightKg > 0;

  const patient: Patient = {
    ...state,
    band: ageBandById(state.ageBandId),
    weightKg,
    hasWeight,
  };

  return [patient, (patch) => setState({ ...state, ...patch })];
}

export { AGE_BANDS };
