import Constants from "expo-constants";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { REFERENCE_IMAGES } from "@/data/block-images";
import {
  CLINICAL_SECTIONS,
  DATA_SOURCES,
  IMAGE_LICENSES,
  LEGAL_REVISED,
  LegalSection,
  OWN_WORK_LICENSE,
  PRIVACY_SECTION,
  SCHEMATIC_NOTE,
} from "@/data/legal";
import { ANATOMY, CREDIT_PENDING, USG } from "@/data/reference-images";
import { colors, radius, spacing, type } from "@/theme";

/**
 * Hangi görsellerin gerçekten uygulamayla birlikte geldiği, kayıt dosyasından
 * okunur — elle tutulan bir listeden değil. Görsel eklenip kredisi yazılmazsa
 * bu ekranda "kaynak girilmedi" olarak görünür; yani atıfsız bir görselin
 * sessizce yayına çıkması mümkün değildir.
 */
function shippedImages() {
  const declared = [...Object.values(USG), ...Object.values(ANATOMY)];
  return Object.keys(REFERENCE_IMAGES).map((key) => {
    const data = declared.find((img) => img.key === key);
    return {
      key,
      caption: data?.caption ?? key,
      credit: data?.credit ?? CREDIT_PENDING,
      licensed: IMAGE_LICENSES.some((lic) => lic.keys.includes(key)),
    };
  });
}

function Section({ section }: { section: LegalSection }) {
  return (
    <View style={[styles.card, section.emphasis && styles.cardEmphasis]}>
      <Text style={[styles.cardTitle, section.emphasis && styles.textEmphasis]}>
        {section.title}
      </Text>
      {section.paragraphs?.map((p) => (
        <Text key={p} style={[styles.body, section.emphasis && styles.textEmphasis]}>
          {p}
        </Text>
      ))}
      {section.bullets?.map((b) => (
        <View key={b} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.body}>{b}</Text>
        </View>
      ))}
    </View>
  );
}

export function Legal() {
  const insets = useSafeAreaInsets();
  const images = shippedImages();
  const uncredited = images.filter((img) => img.credit === CREDIT_PENDING);
  const unlisted = images.filter((img) => !img.licensed && img.credit !== CREDIT_PENDING);
  const version = Constants.expoConfig?.version;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      {CLINICAL_SECTIONS.map((section) => (
        <Section key={section.id} section={section} />
      ))}

      <Text style={styles.groupTitle}>Gizlilik</Text>
      <Section section={{ ...PRIVACY_SECTION, title: "Toplanan veri yok" }} />

      <Text style={styles.groupTitle}>Kaynaklar</Text>
      <View style={styles.card}>
        {DATA_SOURCES.map((source) => (
          <View key={source.topic} style={styles.sourceRow}>
            <Text style={styles.sourceTopic}>{source.topic}</Text>
            <Text style={styles.sourceCitation}>{source.citation}</Text>
            {source.note ? <Text style={styles.sourceNote}>{source.note}</Text> : null}
          </View>
        ))}
      </View>

      <Text style={styles.groupTitle}>Görseller</Text>
      <View style={styles.card}>
        <Text style={styles.body}>{SCHEMATIC_NOTE}</Text>
      </View>

      {IMAGE_LICENSES.map((lic) => {
        const shipped = lic.keys.filter((key) => key in REFERENCE_IMAGES);
        if (shipped.length === 0) return null;
        return (
          <View key={lic.license + lic.citation} style={styles.card}>
            <View style={styles.licenseHeader}>
              <Text style={styles.cardTitle}>{lic.license}</Text>
              <View style={[styles.tag, lic.commercial ? styles.tagOk : styles.tagLimited]}>
                <Text style={[styles.tagText, lic.commercial ? styles.tagOkText : styles.tagLimitedText]}>
                  {lic.commercial ? "Ticari kullanıma açık" : "Ticari kullanıma kapalı"}
                </Text>
              </View>
            </View>
            <Text style={styles.body}>{lic.citation}</Text>
            {lic.modification ? <Text style={styles.sourceNote}>{lic.modification}</Text> : null}
            <Text style={styles.fileList}>{shipped.join(" · ")}</Text>
          </View>
        );
      })}

      {unlisted.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Diğer görseller</Text>
          <Text style={styles.body}>{OWN_WORK_LICENSE}</Text>
          {unlisted.map((img) => (
            <View key={img.key} style={styles.sourceRow}>
              <Text style={styles.sourceTopic}>{img.caption}</Text>
              <Text style={styles.sourceCitation}>{img.credit}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Yayına çıkmadan görülmesi gereken tek kart bu: atıfsız görsel. */}
      {uncredited.length > 0 ? (
        <View style={[styles.card, styles.cardDanger]}>
          <Text style={[styles.cardTitle, styles.textDanger]}>Kaynağı girilmemiş görsel</Text>
          <Text style={[styles.body, styles.textDanger]}>
            Aşağıdaki görseller uygulamada yer alıyor ama kaynak/lisans bilgisi yazılmamış.
            Yayına çıkmadan önce doldurulmalıdır.
          </Text>
          <Text style={styles.fileList}>{uncredited.map((img) => img.key).join(" · ")}</Text>
        </View>
      ) : null}

      <Text style={styles.footer}>
        Metinler {LEGAL_REVISED} tarihinde gözden geçirildi
        {version ? ` · sürüm ${version}` : ""}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  groupTitle: {
    ...type.label,
    color: colors.textFaint,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardEmphasis: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warningBorder,
  },
  cardDanger: {
    backgroundColor: colors.dangerBg,
    borderColor: colors.dangerBorder,
  },
  cardTitle: {
    ...type.heading,
    color: colors.text,
  },
  textEmphasis: {
    color: colors.warning,
  },
  textDanger: {
    color: colors.danger,
  },
  body: {
    ...type.body,
    color: colors.text,
    lineHeight: 20,
  },
  bulletRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  bulletDot: {
    ...type.body,
    color: colors.textMuted,
    lineHeight: 20,
  },
  sourceRow: {
    gap: 2,
  },
  sourceTopic: {
    ...type.subheading,
    color: colors.text,
  },
  sourceCitation: {
    ...type.bodySm,
    color: colors.textMuted,
    lineHeight: 18,
  },
  sourceNote: {
    ...type.caption,
    color: colors.textFaint,
    lineHeight: 17,
  },
  licenseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  tagOk: { backgroundColor: colors.primaryMuted },
  tagLimited: { backgroundColor: colors.warningBg },
  tagText: { ...type.caption, fontWeight: "700" },
  tagOkText: { color: colors.primaryStrong },
  tagLimitedText: { color: colors.warning },
  fileList: {
    ...type.caption,
    color: colors.textFaint,
  },
  footer: {
    ...type.caption,
    color: colors.textFaint,
    textAlign: "center",
    marginTop: spacing.sm,
  },
});
