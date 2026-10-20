import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import {
  ADJUVANT_PROLONGS_NOTE,
  NO_CATHETER_NOTE,
  PEDIATRIC_INFUSION_REDIRECT,
  PREPARE_RULE_NOTE,
  infusionLoad,
  regimenFor,
  wearOffFor,
} from "@/data/infusion";
import { Technique } from "@/data/techniques";
import { makeStyles, numeric, radius, spacing, type, useColors } from "@/theme";
import { usePatient } from "@/utils/patient";

/**
 * "Blok çözülünce ne olacak?"
 *
 * Blok kartı şimdiye kadar tek atımın tepe noktasını anlatıyordu ve orada
 * bitiyordu. Hastanın gecesi ise bloğun çözüldüğü saatte başlar: kateter
 * varsa hangi hızda gittiği, yoksa ne zaman sistemik analjeziye geçileceği.
 *
 * İki bölüm ayrı duruyor çünkü iki ayrı karar: kateter rejimi *planlanır*
 * (girişimden önce), çözülme çizelgesi ise *takip edilir* (girişimden sonra).
 */
export function CatheterPanel({ technique }: { technique: Technique }) {
  const colors = useColors();
  const styles = useStyles();
  const [patient] = usePatient();

  const regimen = regimenFor(technique.id);
  const wearOff = wearOffFor(technique);
  if (!regimen && !wearOff) return null;

  // Yük, çalışmanın bazal hızının üst ucundan hesaplanır. Karşılaştırılacak
  // bir tavan yok (bkz. NO_ADULT_CEILING_NOTE); bu yalnızca birim çevrimi.
  const load =
    regimen && regimen.basalMlPerHour
      ? infusionLoad(
          regimen.basalMlPerHour[1],
          regimen.concentrationPercent,
          patient.hasWeight ? patient.weightKg : undefined
        )
      : undefined;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="git-commit-outline" size={14} color={colors.primary} />
        <Text style={styles.title}>Kateter ve çözülme</Text>
      </View>

      {regimen ? (
        <View style={styles.block}>
          {regimen.basalMlPerHour ? (
            <View style={styles.regimenRow}>
              <Text style={styles.regimenLabel}>Bazal</Text>
              <Text style={styles.regimenValue}>
                {regimen.basalMlPerHour[0] === regimen.basalMlPerHour[1]
                  ? `${regimen.basalMlPerHour[0]} mL/sa`
                  : `${regimen.basalMlPerHour[0]}–${regimen.basalMlPerHour[1]} mL/sa`}
                {regimen.perSide ? " (taraf başına)" : ""}
              </Text>
              <Text style={styles.regimenConc}>%{regimen.concentrationPercent}</Text>
            </View>
          ) : null}
          {/* Aralıklı bolus ayrı satır: ESP'de sürekli infüzyona üstün
              bulunduğu için gizlenmemeli. */}
          {regimen.intermittentBolus ? (
            <View style={styles.regimenRow}>
              <Text style={styles.regimenLabel}>Aralıklı bolus</Text>
              <Text style={styles.regimenValue}>
                {regimen.intermittentBolus.ml} mL
              </Text>
              <Text style={styles.regimenConc}>
                {regimen.intermittentBolus.everyHours} saatte bir
              </Text>
            </View>
          ) : null}
          {regimen.bolusMl !== undefined ? (
            <View style={styles.regimenRow}>
              <Text style={styles.regimenLabel}>Hasta bolusu</Text>
              <Text style={styles.regimenValue}>{regimen.bolusMl} mL</Text>
              <Text style={styles.regimenConc}>
                {regimen.lockoutMin ? `${regimen.lockoutMin} dk kilit` : ""}
              </Text>
            </View>
          ) : null}

          {/* mL/sa ayarlanan sayıdır ama toksisiteyi mg belirler; çevrimi
              ekranda yapmak konsantrasyon değiştirmenin ne demek olduğunu
              görünür kılıyor. */}
          {load ? (
            <Text style={styles.load}>
              {Math.round(load.mgPerHour)} mg/sa · 24 saatte{" "}
              {Math.round(load.mgPer24h)} mg
              {load.mgPerKgPerHour !== undefined
                ? ` · ${load.mgPerKgPerHour.toFixed(2)} mg/kg/sa`
                : ""}
            </Text>
          ) : null}
          {patient.band.pediatric ? (
            <Text style={styles.warn}>{PEDIATRIC_INFUSION_REDIRECT}</Text>
          ) : null}

          <Text style={styles.note}>{regimen.note}</Text>
          {/* Kaynak satırı rejimin yanından ayrılmaz: bu sayılar bir
              çalışmadan geliyor ve hangisinden geldiği görünmeli. */}
          {regimen.sources.map((src) => (
            <Text key={src.doi} style={styles.source}>
              {src.citation} · doi:{src.doi}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={styles.note}>{NO_CATHETER_NOTE}</Text>
      )}

      {wearOff ? (
        <View style={styles.block}>
          <Text style={styles.subTitle}>Tek atımda çözülme</Text>
          <View style={styles.timeline}>
            <Timeline
              label="Etki başlangıcı"
              value={`${wearOff.onsetMin[0]}–${wearOff.onsetMin[1]} dk`}
            />
            <Timeline
              label="Beklenen süre"
              value={`${wearOff.durationHours[0]}–${wearOff.durationHours[1]} sa`}
            />
            <Timeline
              label="Analjeziye geç"
              value={`${wearOff.prepareAtHours[0]}. saatten itibaren`}
              emphasis
            />
          </View>
          <Text style={styles.note}>
            Sistemik analjezi blok çözülmeden önce başlamalıdır — istem, ilacın
            ulaşması ve etkisinin başlaması birlikte bir saati bulur. Hastanın ağrıyla
            uyanması, kateteri olmayan blokta en sık görülen kusurdur.
          </Text>
          <Text style={styles.fine}>{PREPARE_RULE_NOTE}</Text>
          <Text style={styles.fine}>{ADJUVANT_PROLONGS_NOTE}</Text>
        </View>
      ) : null}
    </View>
  );
}

function Timeline({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  const styles = useStyles();
  return (
    <View style={[styles.tick, emphasis && styles.tickEmphasis]}>
      <Text style={styles.tickLabel}>{label}</Text>
      <Text style={[styles.tickValue, emphasis && styles.tickValueEmphasis]}>{value}</Text>
    </View>
  );
}

const useStyles = makeStyles((colors) => ({
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.sm,
    padding: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 5 },
  title: { ...type.subheading, color: colors.text },
  subTitle: { ...type.label, color: colors.textFaint },
  block: { gap: 5 },
  regimenRow: { flexDirection: "row", alignItems: "baseline", gap: spacing.sm },
  // Sabit genişlik yerine asgari genişlik: hizalama korunur ama sistem yazı
  // tipi büyütüldüğünde etiket kırpılmak yerine sarar.
  regimenLabel: { ...type.caption, color: colors.textMuted, minWidth: 92, flexShrink: 1 },
  regimenValue: { ...type.subheading, ...numeric, color: colors.text },
  regimenConc: { ...type.caption, ...numeric, color: colors.textFaint, flex: 1 },
  load: { ...type.caption, ...numeric, color: colors.textMuted, lineHeight: 16 },
  source: { fontSize: 9.5, color: colors.textFaint, lineHeight: 13 },
  warn: { ...type.caption, color: colors.warning, lineHeight: 16 },
  note: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  fine: { fontSize: 10, color: colors.textFaint, lineHeight: 14, fontStyle: "italic" },
  timeline: { flexDirection: "row", gap: 5 },
  tick: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    gap: 1,
  },
  tickEmphasis: { borderColor: colors.warningBorder, backgroundColor: colors.warningBg },
  tickLabel: { fontSize: 9.5, color: colors.textFaint, textTransform: "uppercase" },
  tickValue: { ...type.caption, ...numeric, fontWeight: "700", color: colors.text },
  tickValueEmphasis: { color: colors.warning },
}));
