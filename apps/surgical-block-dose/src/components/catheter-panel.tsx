import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import {
  ADJUVANT_PROLONGS_NOTE,
  NO_CATHETER_NOTE,
  PEDIATRIC_INFUSION_REDIRECT,
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

  // Yük, bazal hızın üst ucundan hesaplanır: sınırı zorlayan uç odur.
  const load = regimen
    ? infusionLoad(
        regimen.basalMlPerHour[1],
        regimen.concentrationPercent,
        technique.typical.drug,
        patient.hasWeight ? patient.weightKg : undefined
      )
    : undefined;

  const over = load?.fraction !== undefined && load.fraction > 1;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="git-commit-outline" size={14} color={colors.primary} />
        <Text style={styles.title}>Kateter ve çözülme</Text>
      </View>

      {regimen ? (
        <View style={styles.block}>
          <View style={styles.regimenRow}>
            <Text style={styles.regimenLabel}>Bazal</Text>
            <Text style={styles.regimenValue}>
              {regimen.basalMlPerHour[0]}–{regimen.basalMlPerHour[1]} mL/sa
            </Text>
            <Text style={styles.regimenConc}>%{regimen.concentrationPercent}</Text>
          </View>
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
            <Text style={[styles.load, over && styles.loadOver]}>
              Üst hızda {Math.round(load.mgPerHour)} mg/sa · 24 saatte{" "}
              {Math.round(load.mgPer24h)} mg
              {load.mgPerKgPerHour !== undefined
                ? ` · ${load.mgPerKgPerHour.toFixed(2)} mg/kg/sa`
                : ""}
              {load.limit && load.fraction !== undefined
                ? ` — erişkin sınırı ${load.limit.mgPerKgPerHour} mg/kg/sa, kullanılan oran %${Math.round(load.fraction * 100)}`
                : ""}
            </Text>
          ) : null}
          {patient.band.pediatric ? (
            <Text style={styles.warn}>{PEDIATRIC_INFUSION_REDIRECT}</Text>
          ) : null}

          <Text style={styles.note}>{regimen.note}</Text>
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
  loadOver: { color: colors.danger, fontWeight: "700" },
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
