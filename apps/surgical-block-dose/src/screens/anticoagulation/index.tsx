import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  AGENTS,
  AGENT_CLASS_LABEL,
  AgentClass,
  BLEEDING_RISK,
  BLEEDING_RISK_TIERS,
  BleedingRiskTier,
  SOURCE_PENDING_NOTE,
  hasIntervals,
} from "@/data/anticoagulation";
import { techniqueById } from "@/data/techniques";
import { Palette, makeStyles, radius, spacing, type, useColors } from "@/theme";

const TIER_ORDER: BleedingRiskTier[] = ["high", "intermediate", "low"];
function tierColors(colors: Palette): Record<BleedingRiskTier, { text: string; bg: string }> {
  return {
    high: { text: colors.danger, bg: colors.dangerBg },
    intermediate: { text: colors.warning, bg: colors.warningBg },
    low: { text: colors.primaryStrong, bg: colors.primaryMuted },
  };
}

const CLASS_ORDER: AgentClass[] = [
  "antiplatelet",
  "lmwh",
  "ufh",
  "doac",
  "vka",
  "thrombolytic",
  "herbal",
];

/**
 * Antikoagülan alan hastada blok.
 *
 * Ekran iki bölüm: uygulamanın kendi risk gruplaması (hazır) ve ilaç bekleme
 * süreleri (kaynak bekliyor). İkincisini boş göstermek kasıtlı — bu sayılar
 * hafızadan yazılmaz ve yaklaşık bir değer, hiç değer olmamasından daha
 * tehlikelidir.
 */
export function Anticoagulation() {
  const colors = useColors();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const filled = hasIntervals();
  const TIER_COLOR = tierColors(colors);

  const byTier = TIER_ORDER.map((tier) => ({
    tier,
    info: BLEEDING_RISK_TIERS[tier],
    techniques: Object.entries(BLEEDING_RISK)
      .filter(([, v]) => v.tier === tier)
      .map(([id, v]) => ({ id, name: techniqueById(id)?.name ?? id, why: v.why }))
      .sort((a, b) => a.name.localeCompare(b.name, "tr")),
  }));

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <Text style={styles.intro}>
        Antikoagülan alan hastada soru iki katmanlıdır: <Text style={styles.bold}>bu blok</Text> ne
        kadar riskli ve <Text style={styles.bold}>bu ilaç</Text> için ne kadar beklenmeli. Birincisi
        bloğun derinliğine ve kanamanın basıyla durdurulup durdurulamayacağına bakar; ikincisi
        kılavuz tablosudur.
      </Text>

      <Text style={styles.sectionTitle}>Blokların kanama riski</Text>
      {byTier.map(({ tier, info, techniques }) => (
        <View key={tier} style={styles.card}>
          <View style={[styles.tierBadge, { backgroundColor: TIER_COLOR[tier].bg }]}>
            <Text style={[styles.tierBadgeText, { color: TIER_COLOR[tier].text }]}>
              {info.label}
            </Text>
          </View>
          <Text style={styles.tierRule}>{info.rule}</Text>
          <View style={styles.techList}>
            {techniques.map((t) => (
              <View key={t.id} style={styles.techRow}>
                <Text style={styles.techName}>{t.name}</Text>
                <Text style={styles.techWhy}>{t.why}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      <Text style={styles.sectionTitle}>İlaç bekleme süreleri</Text>
      {!filled ? (
        <View style={[styles.card, styles.pendingCard]}>
          <View style={styles.pendingHead}>
            <Ionicons name="time-outline" size={15} color={colors.warning} />
            <Text style={styles.pendingTitle}>Süreler henüz girilmedi</Text>
          </View>
          <Text style={styles.pendingBody}>{SOURCE_PENDING_NOTE}</Text>
          <Text style={styles.pendingBody}>
            Aşağıdaki ilaçlar listede yerini almış durumda; her biri kaynağıyla birlikte
            doldurulduğunda bu bölüm tabloya dönüşecek.
          </Text>
        </View>
      ) : null}

      {CLASS_ORDER.map((agentClass) => {
        const agents = AGENTS.filter((a) => a.agentClass === agentClass);
        if (agents.length === 0) return null;
        return (
          <View key={agentClass} style={styles.card}>
            <Text style={styles.className}>{AGENT_CLASS_LABEL[agentClass]}</Text>
            {agents.map((agent) => (
              <View key={agent.id} style={styles.agentRow}>
                <Text style={styles.agentName}>{agent.name}</Text>
                {agent.intervals ? (
                  <>
                    <Text style={styles.agentInterval}>
                      <Text style={styles.agentLabel}>Girişim öncesi: </Text>
                      {agent.intervals.beforeBlock}
                    </Text>
                    <Text style={styles.agentInterval}>
                      <Text style={styles.agentLabel}>Girişim/kateter sonrası: </Text>
                      {agent.intervals.afterBlock}
                    </Text>
                    {agent.intervals.withCatheter ? (
                      <Text style={styles.agentInterval}>
                        <Text style={styles.agentLabel}>Kateter dururken: </Text>
                        {agent.intervals.withCatheter}
                      </Text>
                    ) : null}
                    {agent.intervals.renal ? (
                      <Text style={styles.agentInterval}>
                        <Text style={styles.agentLabel}>Böbrek yetmezliğinde: </Text>
                        {agent.intervals.renal}
                      </Text>
                    ) : null}
                    {agent.source ? <Text style={styles.agentSource}>{agent.source}</Text> : null}
                  </>
                ) : (
                  <Text style={styles.agentPending}>kaynak bekliyor</Text>
                )}
              </View>
            ))}
          </View>
        );
      })}

      <Text style={styles.footnote}>
        Risk gruplaması bu uygulamanın kendi sınıflamasıdır; ölçütü iğnenin derinliği, basının
        uygulanabilirliği ve kanamanın bulunduğu yerde yapacağı hasardır. ESRA ve ASRA listeleri
        ayrıntıda ayrışır — hasta başında kurum protokolünüz esastır.
      </Text>
    </ScrollView>
  );
}

const useStyles = makeStyles((colors) => ({
  content: { padding: spacing.lg, gap: spacing.md },
  intro: { ...type.body, color: colors.text, lineHeight: 20 },
  bold: { fontWeight: "700", color: colors.text },
  sectionTitle: { ...type.heading, color: colors.text, marginTop: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  pendingCard: { backgroundColor: colors.warningBg, borderColor: colors.warningBorder },
  pendingHead: { flexDirection: "row", alignItems: "center", gap: 6 },
  pendingTitle: { ...type.heading, color: colors.warning },
  pendingBody: { ...type.bodySm, color: colors.warning, lineHeight: 19 },
  tierBadge: { alignSelf: "flex-start", borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3 },
  tierBadgeText: { ...type.caption, fontWeight: "700" },
  tierRule: { ...type.bodySm, color: colors.text, lineHeight: 19 },
  techList: { gap: 6, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm },
  techRow: { gap: 1 },
  techName: { ...type.subheading, fontSize: 12.5, color: colors.text },
  techWhy: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  className: { ...type.subheading, color: colors.textMuted },
  agentRow: { gap: 2, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 6 },
  agentName: { ...type.subheading, fontSize: 12.5, color: colors.text },
  agentInterval: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  agentLabel: { fontWeight: "700", color: colors.text },
  agentSource: { fontSize: 10, color: colors.textFaint, fontStyle: "italic" },
  agentPending: { fontSize: 11, color: colors.warning, fontStyle: "italic" },
  footnote: { ...type.caption, color: colors.textFaint, lineHeight: 16, fontStyle: "italic" },
}));
