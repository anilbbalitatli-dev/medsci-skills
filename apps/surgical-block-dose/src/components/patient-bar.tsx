import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AGE_BANDS } from "@/data/age-dosing";
import {
  MAX_HEIGHT_CM,
  MIN_HEIGHT_CM,
  WEIGHT_BASES,
  basisInfo,
  basisSuggestion,
} from "@/data/body-weight";
import { elevation, makeStyles, numeric, radius, spacing, type, useColors } from "@/theme";
import { usePatient } from "@/utils/patient";

const SEXES = [
  { id: "female", label: "Kadın" },
  { id: "male", label: "Erkek" },
] as const;

/**
 * Hangi ağırlıkla dozlanacağı.
 *
 * Dört sayıyı da gösterip seçimi kullanıcıya bırakıyor. "Doğrusunu" seçip
 * göstermemek daha basit olurdu ama hangisinin doğru olduğu ilaca ve amaca
 * göre değişir — ve bir düzeltme ekranda görünmeden bütün dozları
 * değiştirirse, kullanıcı yanlış sayıya bakarken doğru baktığını sanır.
 *
 * Cinsiyet burada, boyun yanında: yalnızca bu formüllerde kullanılıyor,
 * hastanın başka hiçbir hesabına girmiyor.
 */
function BasisPicker() {
  const colors = useColors();
  const styles = useStyles();
  const [patient, setPatient] = usePatient();
  const w = patient.weights;
  if (!w) return null;

  const suggestion = basisSuggestion(w, patient.weightBasis);
  const active = basisInfo(patient.weightBasis);

  return (
    <View style={styles.basisBlock}>
      <View style={styles.sexRow}>
        <Text style={styles.basisLabel}>Formül cinsiyeti</Text>
        {SEXES.map((s) => {
          const on = s.id === patient.sex;
          return (
            <Pressable key={s.id} onPress={() => setPatient({ sex: s.id })}>
              <View style={[styles.chip, on && styles.chipOn]}>
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{s.label}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.bmi}>
        BMI {w.bmi.toFixed(1)} kg/m²
        {w.belowFormulaRange ? " · Devine formülü 152 cm altında türetilmemiştir" : ""}
      </Text>

      <Text style={styles.basisLabel}>Dozlar hangi ağırlıkla hesaplansın</Text>
      <View style={styles.chipWrap}>
        {WEIGHT_BASES.map((b) => {
          const on = b.id === patient.weightBasis;
          const kg = b.id === "total" ? w.total : Math.min(w.total, w[b.id]);
          return (
            <Pressable
              key={b.id}
              onPress={() => setPatient({ weightBasis: b.id })}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${b.label}, ${kg.toFixed(0)} kilogram`}
            >
              <View style={[styles.basisChip, on && styles.chipOn]}>
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{b.short}</Text>
                <Text style={[styles.basisChipKg, on && styles.chipTextOn]}>
                  {kg.toFixed(0)} kg
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.basisUse}>{active.useFor}</Text>

      {suggestion ? (
        <View style={styles.suggestion}>
          <Ionicons name="information-circle-outline" size={14} color={colors.warning} />
          <Text style={styles.suggestionText}>{suggestion}</Text>
        </View>
      ) : null}
    </View>
  );
}

/**
 * The patient, editable from anywhere and shown everywhere.
 *
 * Collapsed by default: once a weight is set, what matters is seeing at a
 * glance which patient the figures on screen belong to, not editing it again.
 * An unset patient opens expanded, because a dose screen with no weight is
 * asking a question the user has not answered yet.
 */
export function PatientBar() {
  const colors = useColors();
  const styles = useStyles();
  const [patient, setPatient] = usePatient();
  const [open, setOpen] = useState(!patient.hasWeight);

  const summary = patient.hasWeight
    ? `${patient.weightInput} kg · ${patient.band.label}`
    : "Hasta bilgisi girilmedi";

  return (
    <View style={styles.card}>
      <Pressable onPress={() => setOpen((v) => !v)} hitSlop={6}>
        <View style={styles.head}>
          <Ionicons
            name="person-outline"
            size={15}
            color={patient.hasWeight ? colors.primary : colors.textMuted}
          />
          <Text
            style={[styles.summary, !patient.hasWeight && styles.summaryEmpty]}
            numberOfLines={1}
          >
            {summary}
          </Text>
          {/* Düzeltilmiş ağırlık kapalıyken de görünmek zorunda: ekrandaki
              bütün mg değerleri girilen kiloya değil bu sayıya dayanıyor. */}
          {patient.weightAdjusted ? (
            <Text style={styles.basisTag}>
              {basisInfo(patient.weightBasis).short} {patient.weightKg.toFixed(0)} kg
            </Text>
          ) : null}
          {patient.withEpi ? <Text style={styles.epiTag}>epinefrinli</Text> : null}
          <Ionicons
            name={open ? "chevron-up" : "chevron-down"}
            size={15}
            color={colors.textMuted}
          />
        </View>
      </Pressable>

      {open ? (
        <View style={styles.body}>
          <View style={styles.inputRow}>
            <TextInput
              value={patient.weightInput}
              onChangeText={(weightInput) => setPatient({ weightInput })}
              placeholder="Ağırlık (kg)"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              style={[styles.input, styles.inputHalf]}
              accessibilityLabel="Hasta ağırlığı, kilogram"
            />
            {/* Boy isteğe bağlıdır ve yalnızca ideal/yağsız/düzeltilmiş
                ağırlığı açar. Zorunlu yapmak, kilo girmek için boy da bilmeyi
                şart koşardı; oysa hastaların çoğunda düzeltme gerekmiyor. */}
            <TextInput
              value={patient.heightInput}
              onChangeText={(heightInput) => setPatient({ heightInput })}
              placeholder="Boy (cm)"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              style={[styles.input, styles.inputHalf]}
              accessibilityLabel="Hasta boyu, santimetre"
            />
          </View>

          <View style={styles.chipWrap}>
            {AGE_BANDS.map((b) => {
              const on = b.id === patient.ageBandId;
              return (
                <Pressable key={b.id} onPress={() => setPatient({ ageBandId: b.id })}>
                  <View style={[styles.chip, on && styles.chipOn]}>
                    <Text style={[styles.chipText, on && styles.chipTextOn]}>{b.label}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Boy girildi ama düzeltme yapılamıyorsa sebebini söyle: sessizce
              hiçbir şey göstermemek, hesabın çalıştığı ama sonucun toplam
              ağırlıkla aynı çıktığı izlenimini verir. */}
          {patient.heightInput.length > 0 && !patient.hasHeight ? (
            <Text style={styles.basisWarn}>
              Boy {MIN_HEIGHT_CM}–{MAX_HEIGHT_CM} cm aralığında olmalı.
            </Text>
          ) : null}
          {patient.heightInput.length > 0 && patient.hasHeight && !patient.weightBasisAvailable ? (
            <Text style={styles.basisWarn}>
              İdeal ve yağsız ağırlık formülleri erişkin formülleridir; çocukta geçerli değildir ve
              bu yaş bandında sunulmaz. Pediatrik dozlar gerçek ağırlıkla hesaplanır.
            </Text>
          ) : null}

          {patient.weights ? (
            <BasisPicker />
          ) : patient.weightBasisAvailable && patient.hasWeight && !patient.hasHeight ? (
            <Text style={styles.basisHint}>
              Boy girilirse ideal, yağsız ve düzeltilmiş vücut ağırlığı hesaplanır; obez hastada
              lokal anestezik tavanı toplam ağırlıkla hesaplanmamalıdır.
            </Text>
          ) : null}

          <Pressable onPress={() => setPatient({ withEpi: !patient.withEpi })}>
            <View style={styles.toggleRow}>
              <Ionicons
                name={patient.withEpi ? "checkbox" : "square-outline"}
                size={18}
                color={patient.withEpi ? colors.primary : colors.textMuted}
              />
              <Text style={styles.toggleText}>Solüsyon epinefrin içeriyor</Text>
            </View>
          </Pressable>

          {patient.band.modifier !== 1 ? (
            <Text style={styles.modifierNote}>
              Bu yaş grubunda toplam mg/kg bütçesi ×{patient.band.modifier} uygulanır — bu katsayı
              kılavuz değil, uygulamanın ihtiyatlı kuralıdır.
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    ...elevation.card,
  },
  head: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  summary: { ...type.subheading, ...numeric, color: colors.text, flex: 1 },
  summaryEmpty: { color: colors.textMuted, fontWeight: "400" },
  epiTag: {
    ...type.caption,
    fontSize: 10,
    fontWeight: "700",
    color: colors.primaryStrong,
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  body: { gap: spacing.sm, paddingBottom: 2 },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    fontSize: 15,
    color: colors.text,
  },
  inputRow: { flexDirection: "row", gap: spacing.sm },
  // Web'de <input> kendi asgari genişliğini dayatır; minWidth sıfırlanmazsa
  // iki alan yan yana sığmaz ve ikincisi karttan taşar.
  inputHalf: { flex: 1, minWidth: 0 },
  basisTag: {
    ...type.caption,
    fontSize: 10,
    fontWeight: "700",
    color: colors.warning,
    backgroundColor: colors.warningBg,
    borderRadius: radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  basisBlock: {
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  sexRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  basisLabel: { ...type.label, color: colors.textFaint, flex: 0 },
  bmi: { ...type.caption, ...numeric, color: colors.text },
  basisChip: {
    backgroundColor: colors.chip,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    alignItems: "center",
    minWidth: 76,
  },
  basisChipKg: { ...numeric, fontSize: 12.5, fontWeight: "700", color: colors.text },
  basisUse: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  basisHint: { ...type.caption, color: colors.textFaint, lineHeight: 16 },
  basisWarn: { ...type.caption, color: colors.warning, lineHeight: 16 },
  suggestion: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 5,
    backgroundColor: colors.warningBg,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  suggestionText: { ...type.caption, color: colors.text, lineHeight: 16, flex: 1 },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  chipOn: { backgroundColor: colors.primary },
  chipText: { fontSize: 12, color: colors.text },
  chipTextOn: { color: colors.onPrimary, fontWeight: "700" },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  toggleText: { ...type.bodySm, color: colors.text },
  modifierNote: { ...type.caption, color: colors.warning, lineHeight: 16 },
}));
