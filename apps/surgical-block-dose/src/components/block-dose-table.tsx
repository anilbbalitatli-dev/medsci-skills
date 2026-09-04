import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { ceilingMg } from "@/data/age-dosing";
import { exclusionReason, laChoicesFor } from "@/data/local-anesthetics";
import { findMaxDose } from "@/data/max-doses";
import { checkPediatricBlocks } from "@/data/pediatric-dosing";
import { Technique } from "@/data/techniques";
import { LocalAnestheticChoice } from "@/data/types";
import { colors, numeric, radius, spacing, type } from "@/theme";
import { usePatient } from "@/utils/patient";

/**
 * Doses for every agent the block can be done with, scaled to the patient.
 *
 * Two things were wrong before. The card listed whichever one or two drugs the
 * catalogue happened to record, as though the agent were part of the technique
 * rather than a choice. And entering a weight changed nothing on this screen —
 * the volumes sat there fixed while the patient bar above them said 15 kg.
 *
 * So: every applicable agent gets a row, and once a weight is known each row
 * carries both figures that matter. The **typical** volume is what the block
 * takes; the **ceiling** is what this patient can have. When the first exceeds
 * the second the row says so, because that is the case the reader most needs to
 * catch and it is invisible if only one of the two numbers is shown.
 */
function mgFor(volumeMl: number, concentrationPercent: number): number {
  return volumeMl * concentrationPercent * 10;
}

export function BlockDoseTable({
  technique,
  curated,
}: {
  technique?: Technique;
  /** The catalogue's own entries, kept for the notes authored on them. */
  curated: LocalAnestheticChoice[];
}) {
  const [patient] = usePatient();
  const choices = technique ? laChoicesFor(technique) : [];

  // Techniques whose agent choice is not a concentration equivalence (spinal)
  // keep the authored list rather than getting a generated one.
  if (!technique || choices.length === 0) {
    return (
      <View style={styles.table}>
        {curated.map((a) => {
          const lo = mgFor(a.volumeMlRange[0], a.concentrationPercent);
          const hi = mgFor(a.volumeMlRange[1], a.concentrationPercent);
          return (
            <View key={a.drug} style={styles.row}>
              <View style={styles.rowMain}>
                <Text style={styles.drug}>{a.drug}</Text>
                <View style={styles.curatedFigures}>
                  <Text style={styles.volume}>
                    {a.volumeMlRange[0]}–{a.volumeMlRange[1]}
                    <Text style={styles.unit}> mL</Text>
                  </Text>
                  <Text style={styles.mg}>
                    {Math.round(lo)}–{Math.round(hi)}
                    <Text style={styles.unit}> mg</Text>
                  </Text>
                </View>
              </View>
              {a.note ? <Text style={styles.note}>{a.note}</Text> : null}
            </View>
          );
        })}
      </View>
    );
  }

  const [volLow, volHigh] = technique.typical.volumeMlRange;
  const sides = technique.bilateralByDefault ? 2 : 1;
  const excluded = exclusionReason(technique.id);

  return (
    <View style={styles.table}>
      <View style={styles.headRow}>
        <Text style={styles.headDrug}>Lokal anestezik</Text>
        <Text style={styles.headCol}>Tipik</Text>
        <Text style={styles.headCol}>{patient.hasWeight ? `Tavan (${patient.weightInput} kg)` : "Tavan"}</Text>
      </View>

      {choices.map(({ la, concentrationPercent, caution }) => {
        const curatedNote = curated.find((c) =>
          c.drug.toLowerCase().startsWith(la.drug.toLowerCase())
        )?.note;

        const typicalLo = mgFor(volLow * sides, concentrationPercent);
        const typicalHi = mgFor(volHigh * sides, concentrationPercent);

        // The ceiling is whichever is stricter: the systemic mg/kg limit, or the
        // paediatric per-technique limit the guidelines set for this block type.
        const maxDose = findMaxDose(la.drug);
        let ceiling: number | undefined;
        if (patient.hasWeight && maxDose) {
          ceiling = ceilingMg(maxDose, patient.weightKg, patient.band, patient.withEpi);
          if (patient.band.pediatric) {
            const [check] = checkPediatricBlocks(
              [
                {
                  techniqueId: technique.id,
                  techniqueName: technique.name,
                  drug: la.drug,
                  mgLow: typicalLo,
                  mgHigh: typicalHi,
                },
              ],
              patient.weightKg
            );
            if (check?.ceilingMg !== undefined) ceiling = Math.min(ceiling, check.ceilingMg);
          }
        }
        const ceilingMl =
          ceiling !== undefined ? ceiling / (concentrationPercent * 10) : undefined;
        const over = ceiling !== undefined && typicalHi > ceiling;

        return (
          <View key={la.drug} style={[styles.row, over && styles.rowOver]}>
            <View style={styles.rowMain}>
              <View style={styles.drugCell}>
                <Text style={styles.drug}>
                  {la.label} <Text style={styles.conc}>%{concentrationPercent}</Text>
                </Text>
                <Text style={styles.timing}>
                  {la.onsetMin[0]}–{la.onsetMin[1]} dk · {la.durationHours[0]}–{la.durationHours[1]} sa
                </Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.volume}>
                  {volLow * sides}–{volHigh * sides}
                  <Text style={styles.unit}> mL</Text>
                </Text>
                <Text style={styles.mgSmall}>
                  {Math.round(typicalLo)}–{Math.round(typicalHi)} mg
                </Text>
              </View>

              <View style={styles.col}>
                {ceilingMl !== undefined && ceiling !== undefined ? (
                  <>
                    <Text style={[styles.volume, over ? styles.overText : styles.ceilingText]}>
                      {ceilingMl.toFixed(1)}
                      <Text style={styles.unit}> mL</Text>
                    </Text>
                    <Text style={styles.mgSmall}>{Math.round(ceiling)} mg</Text>
                  </>
                ) : (
                  <Text style={styles.pending}>kilo girin</Text>
                )}
              </View>
            </View>

            {over ? (
              <View style={styles.warnRow}>
                <Ionicons name="alert-circle" size={12} color={colors.danger} />
                <Text style={styles.warnText}>
                  Tipik hacim bu hastanın tavanını aşıyor — hacmi düşürün veya daha seyreltik
                  solüsyon kullanın.
                </Text>
              </View>
            ) : null}
            {caution ? <Text style={styles.note}>{caution}</Text> : null}
            {curatedNote ? <Text style={styles.note}>{curatedNote}</Text> : null}
          </View>
        );
      })}

      {sides === 2 ? (
        <Text style={styles.footnote}>
          Hacimler iki taraflı uygulama için toplam olarak verilmiştir.
        </Text>
      ) : null}
      {excluded ? (
        <View style={styles.excludedRow}>
          <Ionicons name="close-circle" size={12} color={colors.danger} />
          <Text style={styles.excludedText}>{excluded}</Text>
        </View>
      ) : null}
      <Text style={styles.footnote}>
        Tavan, ilacın sistemik mg/kg sınırından hesaplanır; pediatrik hastada kılavuzun blok tipine
        özgü sınırı daha düşükse o kullanılır. Tek bir blok içindir — birden fazla blok yapılacaksa
        Kombinasyon Oluşturucu'daki toplam hesap geçerlidir.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  table: { gap: 1, borderRadius: radius.sm, overflow: "hidden", marginTop: spacing.xs },
  headRow: {
    flexDirection: "row",
    backgroundColor: colors.chip,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    gap: spacing.sm,
  },
  headDrug: { ...type.label, fontSize: 9, color: colors.textMuted, flex: 1 },
  headCol: { ...type.label, fontSize: 9, color: colors.textMuted, width: 74, textAlign: "right" },
  row: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 3,
  },
  rowOver: { backgroundColor: colors.dangerBg },
  rowMain: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  curatedFigures: { flexDirection: "row", alignItems: "baseline", gap: spacing.md },
  drugCell: { flex: 1, gap: 1 },
  drug: { ...type.subheading, color: colors.text },
  conc: { ...numeric, color: colors.textMuted, fontWeight: "700" },
  timing: { fontSize: 10, color: colors.textFaint },
  col: { width: 74, alignItems: "flex-end", gap: 1 },
  volume: { ...type.subheading, ...numeric, color: colors.text },
  ceilingText: { color: colors.primary },
  overText: { color: colors.danger },
  mg: { ...type.subheading, ...numeric, color: colors.primary },
  mgSmall: { ...numeric, fontSize: 10.5, color: colors.textMuted },
  unit: { fontSize: 10, fontWeight: "600", color: colors.textFaint },
  pending: { fontSize: 10, color: colors.textFaint, fontStyle: "italic" },
  note: { ...type.caption, color: colors.textMuted, fontStyle: "italic", lineHeight: 16 },
  warnRow: { flexDirection: "row", alignItems: "flex-start", gap: 4 },
  warnText: { ...type.caption, color: colors.danger, flex: 1, lineHeight: 16 },
  excludedRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
    backgroundColor: colors.dangerBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  excludedText: { ...type.caption, color: colors.danger, flex: 1, lineHeight: 16 },
  footnote: {
    fontSize: 10,
    color: colors.textFaint,
    fontStyle: "italic",
    lineHeight: 14,
    paddingHorizontal: spacing.md,
    paddingTop: 4,
  },
});
