import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AGE_BANDS } from "@/data/age-dosing";
import { colors, elevation, numeric, radius, spacing, type } from "@/theme";
import { usePatient } from "@/utils/patient";

/**
 * The patient, editable from anywhere and shown everywhere.
 *
 * Collapsed by default: once a weight is set, what matters is seeing at a
 * glance which patient the figures on screen belong to, not editing it again.
 * An unset patient opens expanded, because a dose screen with no weight is
 * asking a question the user has not answered yet.
 */
export function PatientBar() {
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
          <TextInput
            value={patient.weightInput}
            onChangeText={(weightInput) => setPatient({ weightInput })}
            placeholder="Ağırlık (kg)"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            style={styles.input}
          />

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

const styles = StyleSheet.create({
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
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  chipOn: { backgroundColor: colors.primary },
  chipText: { fontSize: 12, color: colors.text },
  chipTextOn: { color: "#FFFFFF", fontWeight: "700" },
  toggleRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  toggleText: { ...type.bodySm, color: colors.text },
  modifierNote: { ...type.caption, color: colors.warning, lineHeight: 16 },
});
