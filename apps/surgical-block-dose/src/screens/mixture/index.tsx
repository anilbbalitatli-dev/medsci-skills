import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PatientBar } from "@/components/patient-bar";
import { ceilingMg } from "@/data/age-dosing";
import {
  computeMixture,
  describeFinalStrength,
  MixtureItem,
  STOCK_SOLUTIONS,
  stockById,
  StockKind,
} from "@/data/mixture";
import { findMaxDose } from "@/data/max-doses";
import { colors, elevation, numeric, radius, spacing, type } from "@/theme";
import { usePatient } from "@/utils/patient";

/**
 * What is in the syringe, once the stock solutions are mixed.
 *
 * The two figures it puts side by side are the ones that get conflated: the
 * milligrams drawn up, which dilution does not change, and the final
 * concentration, which dilution does. Adding saline lowers the second and not
 * the first, so a diluted syringe is not a smaller dose — it is the same dose
 * in a weaker solution, with a different motor profile and the same toxicity
 * budget. Showing them together is the whole point of the screen.
 */
const KIND_ORDER: StockKind[] = ["la", "adjuvant", "diluent"];
const KIND_LABEL: Record<StockKind, string> = {
  la: "Lokal anestezik",
  adjuvant: "Adjuvan",
  diluent: "Sulandırıcı",
};

const DEFAULT_ITEMS: MixtureItem[] = [
  { stockId: "bupi-05", volumeMl: 5 },
  { stockId: "fentanyl", volumeMl: 2 },
  { stockId: "saline", volumeMl: 13 },
];

function fmt(n: number, digits = 1): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(digits);
}

export function MixtureCalculator() {
  const insets = useSafeAreaInsets();
  const [patient] = usePatient();
  const [items, setItems] = useState<MixtureItem[]>(DEFAULT_ITEMS);
  const [picking, setPicking] = useState(false);

  const result = useMemo(() => computeMixture(items), [items]);

  const setVolume = (index: number, text: string) =>
    setItems((cur) =>
      cur.map((it, i) =>
        i === index ? { ...it, volumeMl: Number(text.replace(",", ".")) || 0 } : it
      )
    );
  const remove = (index: number) => setItems((cur) => cur.filter((_, i) => i !== index));
  const add = (stockId: string) => {
    setItems((cur) => [...cur, { stockId, volumeMl: 0 }]);
    setPicking(false);
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.intro}>
        <Text style={styles.introText}>
          Çekilen stok solüsyonları ve hacimleri girin; şırıngadaki toplam miligram ve{" "}
          <Text style={styles.bold}>son konsantrasyon</Text> ayrı ayrı hesaplansın. Sulandırmak
          konsantrasyonu düşürür, <Text style={styles.bold}>miligramı düşürmez</Text> — seyreltilmiş
          bir şırınga daha küçük bir doz değildir.
        </Text>
      </View>

      <PatientBar />

      <Text style={styles.sectionTitle}>Karışım</Text>
      <View style={styles.card}>
        {items.map((item, index) => {
          const stock = stockById(item.stockId);
          if (!stock) return null;
          return (
            <View key={`${item.stockId}-${index}`} style={styles.itemRow}>
              <View style={styles.itemMain}>
                <Text style={styles.itemLabel}>{stock.label}</Text>
                <View style={styles.volumeCell}>
                  <TextInput
                    value={item.volumeMl ? String(item.volumeMl) : ""}
                    onChangeText={(t) => setVolume(index, t)}
                    placeholder="0"
                    placeholderTextColor={colors.textFaint}
                    keyboardType="decimal-pad"
                    style={styles.volumeInput}
                  />
                  <Text style={styles.mlLabel}>mL</Text>
                </View>
                <Pressable onPress={() => remove(index)} hitSlop={10}>
                  <Ionicons name="close-circle-outline" size={18} color={colors.textFaint} />
                </Pressable>
              </View>
              {stock.note ? <Text style={styles.itemNote}>{stock.note}</Text> : null}
            </View>
          );
        })}

        <Pressable onPress={() => setPicking((v) => !v)} hitSlop={8}>
          <View style={styles.addRow}>
            <Ionicons name={picking ? "chevron-up" : "add-circle-outline"} size={16} color={colors.primary} />
            <Text style={styles.addText}>{picking ? "Kapat" : "Bileşen ekle"}</Text>
          </View>
        </Pressable>

        {picking ? (
          <View style={styles.picker}>
            {KIND_ORDER.map((kind) => (
              <View key={kind} style={styles.pickerGroup}>
                <Text style={styles.pickerLabel}>{KIND_LABEL[kind]}</Text>
                <View style={styles.chipWrap}>
                  {STOCK_SOLUTIONS.filter((s) => s.kind === kind).map((s) => (
                    <Pressable key={s.id} onPress={() => add(s.id)}>
                      <View style={styles.chip}>
                        <Text style={styles.chipText}>{s.label}</Text>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>Sonuç</Text>
      <View style={styles.card}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Toplam hacim</Text>
          <Text style={styles.totalValue}>{fmt(result.totalVolumeMl)} mL</Text>
        </View>

        {result.components
          .filter((c) => c.amount !== undefined)
          .map((c, i) => (
            <View key={`${c.stock.id}-${i}`} style={styles.resultRow}>
              <Text style={styles.resultName}>{c.stock.label}</Text>
              <Text style={styles.resultDetail}>
                {fmt(c.volumeMl)} mL ={" "}
                <Text style={styles.resultAmount}>
                  {fmt(c.amount!, c.unit === "µg" ? 0 : 1)} {c.unit}
                </Text>
                {c.finalPerMl !== undefined ? (
                  <Text>
                    {"  ·  şırıngada "}
                    {fmt(c.finalPerMl, c.unit === "µg" ? 1 : 2)} {c.unit}/mL
                  </Text>
                ) : null}
              </Text>
            </View>
          ))}

        {result.laTotals.length > 0 ? (
          <View style={styles.finalBlock}>
            <Text style={styles.finalTitle}>Son konsantrasyon</Text>
            {result.laTotals.map((t) => {
              const describe = describeFinalStrength(t.drug, t.finalPercent);
              const maxDose = findMaxDose(t.drug);
              const ceiling =
                patient.hasWeight && maxDose
                  ? ceilingMg(maxDose, patient.weightKg, patient.band, patient.withEpi)
                  : undefined;
              const over = ceiling !== undefined && t.mg > ceiling;
              return (
                <View key={t.drug} style={styles.finalRow}>
                  <View style={styles.finalHead}>
                    <Text style={styles.finalDrug}>{t.drug}</Text>
                    <Text style={styles.finalPercent}>%{t.finalPercent.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")}</Text>
                  </View>
                  <Text style={styles.finalMg}>
                    Toplam <Text style={styles.bold}>{fmt(t.mg)} mg</Text>
                    {ceiling !== undefined ? (
                      <Text style={over ? styles.overText : styles.okText}>
                        {"  ·  tavan "}
                        {Math.round(ceiling)} mg ({patient.weightInput} kg)
                      </Text>
                    ) : null}
                  </Text>
                  {describe ? <Text style={styles.finalDescribe}>{describe}</Text> : null}
                  {over ? (
                    <View style={styles.warnRow}>
                      <Ionicons name="alert-circle" size={13} color={colors.danger} />
                      <Text style={styles.warnText}>
                        Şırıngadaki miligram bu hastanın tavanını aşıyor. Sulandırmak bunu
                        değiştirmez — çekilen ilaç hacmini azaltmak gerekir.
                      </Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.hint}>Karışıma en az bir lokal anestezik ekleyin.</Text>
        )}
      </View>

      <Text style={styles.disclaimer}>
        Hesap yalnızca aritmetiktir: girilen stok konsantrasyonlarını ve hacimleri kullanır, ilaç
        seçimini veya endikasyonu değerlendirmez. Ampul etiketindeki konsantrasyonu her zaman
        kendiniz doğrulayın; aynı ilacın farklı sunumları raflarda yan yana bulunur.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md },
  intro: { backgroundColor: colors.chip, borderRadius: radius.md, padding: spacing.md },
  introText: { ...type.bodySm, color: colors.textMuted, lineHeight: 19 },
  bold: { fontWeight: "700", color: colors.text },
  sectionTitle: { ...type.heading, color: colors.text, marginTop: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    ...elevation.card,
  },
  itemRow: { gap: 2 },
  itemMain: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  itemLabel: { ...type.bodySm, color: colors.text, flex: 1 },
  volumeCell: { flexDirection: "row", alignItems: "center", gap: 4 },
  volumeInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    fontSize: 14,
    color: colors.text,
    width: 62,
    textAlign: "right",
  },
  mlLabel: { ...type.caption, color: colors.textMuted, width: 20 },
  itemNote: { ...type.caption, color: colors.textMuted, fontStyle: "italic", lineHeight: 16 },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addText: { ...type.caption, color: colors.primary, fontWeight: "700" },
  picker: { gap: spacing.sm },
  pickerGroup: { gap: 4 },
  pickerLabel: { ...type.label, fontSize: 9.5, color: colors.textFaint },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 5 },
  chip: {
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  chipText: { fontSize: 12, color: colors.text },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  totalLabel: { ...type.subheading, color: colors.text },
  totalValue: { ...type.title, ...numeric, fontSize: 19, color: colors.primary },
  resultRow: { gap: 1 },
  resultName: { ...type.subheading, fontSize: 12.5, color: colors.text },
  resultDetail: { ...type.caption, ...numeric, color: colors.textMuted },
  resultAmount: { fontWeight: "700", color: colors.text },
  finalBlock: {
    gap: spacing.sm,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  finalTitle: { ...type.label, color: colors.textMuted },
  finalRow: { gap: 2 },
  finalHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  finalDrug: { ...type.subheading, color: colors.text },
  finalPercent: { ...type.title, ...numeric, fontSize: 18, color: colors.primary },
  finalMg: { ...type.caption, ...numeric, color: colors.textMuted },
  okText: { color: colors.primaryStrong },
  overText: { color: colors.danger, fontWeight: "700" },
  finalDescribe: { ...type.caption, color: colors.textMuted, fontStyle: "italic" },
  warnRow: { flexDirection: "row", alignItems: "flex-start", gap: 5, marginTop: 2 },
  warnText: { ...type.caption, color: colors.danger, flex: 1, lineHeight: 16 },
  hint: { ...type.bodySm, color: colors.textMuted },
  disclaimer: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: "italic",
    lineHeight: 16,
    marginTop: spacing.sm,
  },
});
