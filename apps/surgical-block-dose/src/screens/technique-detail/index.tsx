import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BlockDoseTable } from "@/components/block-dose-table";
import { CatheterPanel } from "@/components/catheter-panel";
import { ComplicationPanel } from "@/components/complication-panel";
import { CoverageInfo } from "@/components/coverage-info";
import { DisclaimerBanner } from "@/components/disclaimer-banner";
import { PatientBar } from "@/components/patient-bar";
import { ReferenceImageList } from "@/components/reference-image";
import { RescuePanel } from "@/components/rescue-panel";
import { SonoAnatomyView } from "@/components/sono-anatomy";
import { TechniqueNervesPanel } from "@/components/technique-nerves-panel";
import { BLOCK_TECHNIQUE } from "@/data/block-technique";
import { imagesForTechnique } from "@/data/reference-images";
import { sonoSpecFor } from "@/data/sono-anatomy";
import { SURGERIES } from "@/data/surgeries";
import { techniqueById } from "@/data/techniques";
import { makeStyles, radius, spacing, type, useColors } from "@/theme";

/**
 * Tek bir bloğun referans sayfası.
 *
 * Uygulama şimdiye kadar blokları yalnızca bir ameliyatın içinden
 * gösteriyordu: "ESP bloğu nedir" diye bakmak için önce onu kullanan bir
 * cerrahi bulmak gerekiyordu. Oysa referans uygulamasında en sık yapılan şey
 * doğrudan bloğa bakmaktır — arama da bir yere gitmek zorunda.
 *
 * Sayfa yeni bir içerik üretmez; blok kartındaki panellerin aynısını cerrahi
 * bağlamı olmadan dizer. Doz tablosu tekniğin kendi tipik rejiminden türetilir.
 */
export function TechniqueDetail({ techniqueId }: { techniqueId: string }) {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const styles = useStyles();

  const technique = techniqueById(techniqueId);
  const images = imagesForTechnique(techniqueId);
  const sonoSpecs = images
    .map((img) => sonoSpecFor(img.key))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  // Bu bloğu listeleyen ameliyatlar: sayfanın "nerede kullanılır" cevabı ve
  // aynı zamanda cerrahi bağlamına dönüş yolu.
  const surgeries = SURGERIES.filter((s) =>
    s.blocks.some((b) => BLOCK_TECHNIQUE[b.id] === techniqueId)
  );

  if (!technique) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Bu blok katalogda bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <DisclaimerBanner />

      <View style={styles.header}>
        <Text style={styles.region}>{technique.region}</Text>
        <Text style={styles.name}>{technique.name}</Text>
        {technique.bilateralByDefault ? (
          <Text style={styles.bilateral}>
            Genellikle iki taraflı yapılır — doz hesabı iki tarafın toplamıdır.
          </Text>
        ) : null}
      </View>

      <PatientBar />

      <View style={styles.card}>
        <BlockDoseTable technique={technique} curated={[technique.typical]} />
        {technique.landmark ? <Text style={styles.landmark}>{technique.landmark}</Text> : null}
        {technique.note ? <Text style={styles.note}>{technique.note}</Text> : null}

        <CoverageInfo coverage={technique.coverage} />
        <TechniqueNervesPanel techniqueId={technique.id} />
        <ComplicationPanel techniqueId={technique.id} />
        <RescuePanel techniqueId={technique.id} />
        <CatheterPanel technique={technique} />

        <ReferenceImageList images={images} />
        {sonoSpecs.map((spec) => (
          <SonoAnatomyView key={spec.title} spec={spec} />
        ))}
      </View>

      {surgeries.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>Bu blok şu cerrahilerde listeleniyor</Text>
          <View style={styles.card}>
            {surgeries.map((s) => (
              <Link key={s.id} href={`/surgery/${s.id}`} asChild>
                <Pressable style={({ pressed }) => pressed && styles.pressed}>
                  <View style={styles.surgeryRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.surgeryName}>{s.name}</Text>
                      <Text style={styles.surgeryMeta}>{s.category}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={15} color={colors.textFaint} />
                  </View>
                </Pressable>
              </Link>
            ))}
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}

const useStyles = makeStyles((colors) => ({
  content: { padding: spacing.lg, gap: spacing.md },
  header: { gap: 2 },
  region: { ...type.label, color: colors.primary },
  name: { ...type.title, color: colors.text },
  bilateral: { ...type.caption, color: colors.warning, fontWeight: "700" },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  landmark: { ...type.bodySm, color: colors.textMuted, lineHeight: 19 },
  note: { ...type.caption, color: colors.textMuted, lineHeight: 17, fontStyle: "italic" },
  sectionTitle: { ...type.heading, color: colors.text, marginTop: spacing.sm },
  surgeryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: 7,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  surgeryName: { ...type.subheading, color: colors.text },
  surgeryMeta: { ...type.caption, color: colors.textFaint },
  pressed: { opacity: 0.6 },
  missing: { padding: spacing.xl },
  missingText: { ...type.body, color: colors.textMuted },
}));
