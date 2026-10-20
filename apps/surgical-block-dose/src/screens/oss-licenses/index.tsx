import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Ionicons from "@expo/vector-icons/Ionicons";

import { BUNDLED_ASSETS, licenseText } from "@/data/license-texts";
import { OSS_LICENSE_TYPES, OSS_PACKAGES } from "@/data/oss-licenses";
import { makeStyles, radius, spacing, type, useColors, useContentStyle } from "@/theme";

/**
 * Açık kaynak bildirimleri.
 *
 * MIT, ISC ve BSD'nin ortak şartı: telif bildirimi ve lisans metni dağıtılan
 * her kopyada bulunsun. Bir uygulamada bunun karşılığı bu ekrandır. Paket
 * listesi lisans türüne göre katlanmış duruyor — 400 satırı açıkta tutmak
 * kimseye bir şey anlatmaz — ama tamamı burada ve aranabilir değil, tam.
 */
export function OssLicenses() {
  const insets = useSafeAreaInsets();
  const content = useContentStyle();
  const colors = useColors();
  const styles = useStyles();
  const [open, setOpen] = useState<string | undefined>();

  const grouped = useMemo(
    () =>
      OSS_LICENSE_TYPES.map((id) => ({
        id,
        text: licenseText(id),
        packages: OSS_PACKAGES.filter((p) => p.license === id),
      })).sort((a, b) => b.packages.length - a.packages.length),
    []
  );

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      <Text style={styles.intro}>
        Uygulama {OSS_PACKAGES.length} açık kaynak paket kullanır. Hepsi izin veren lisanslarla
        dağıtılır ve ortak şartları aynıdır: telif bildirimi ve lisans metni, dağıtılan kopyaya
        eşlik etsin. Bu ekran o bildirimdir.
      </Text>

      <Text style={styles.sectionTitle} accessibilityRole="header">Uygulamayla gelen diğer varlıklar</Text>
      {BUNDLED_ASSETS.map((asset) => (
        <View key={asset.name} style={styles.card}>
          <View style={styles.assetHead}>
            <Text style={styles.assetName}>{asset.name}</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{asset.license}</Text>
            </View>
          </View>
          <Text style={styles.assetWhat}>{asset.what}</Text>
          <Text style={styles.copyright}>{asset.copyright}</Text>
          {asset.url ? <Text style={styles.url}>{asset.url}</Text> : null}
        </View>
      ))}

      <Text style={styles.sectionTitle} accessibilityRole="header">npm paketleri</Text>
      {grouped.map((group) => {
        const isOpen = open === group.id;
        return (
          <View key={group.id} style={styles.card}>
            <Pressable
              onPress={() => setOpen(isOpen ? undefined : group.id)}
              hitSlop={6}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <View style={styles.groupHead}>
                <Ionicons
                  name={isOpen ? "chevron-down" : "chevron-forward"}
                  size={14}
                  color={colors.primary}
                />
                <Text style={styles.groupTitle}>{group.text?.label ?? group.id}</Text>
                <Text style={styles.groupCount}>{group.packages.length} paket</Text>
              </View>
            </Pressable>

            {isOpen ? (
              <>
                {group.text ? (
                  <View style={styles.licenseBox}>
                    <Text style={styles.licenseBody}>{group.text.body}</Text>
                    {group.text.url ? <Text style={styles.url}>{group.text.url}</Text> : null}
                  </View>
                ) : null}
                <View style={styles.packageList}>
                  {group.packages.map((p) => (
                    <View key={p.name} style={styles.packageRow}>
                      <Text style={styles.packageName}>
                        {p.name} <Text style={styles.packageVersion}>{p.version}</Text>
                      </Text>
                      {p.copyright ? (
                        <Text style={styles.copyright}>{p.copyright}</Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              </>
            ) : null}
          </View>
        );
      })}

      <Text style={styles.footnote}>
        Liste, uygulamanın çalışma zamanı bağımlılık ağacının tamamından üretilir
        (scripts/collect-licenses.js). Kapsam bilerek geniş tutulur: fazladan atıf zarar vermez,
        eksik atıf lisans ihlalidir.
      </Text>
    </ScrollView>
  );
}

const useStyles = makeStyles((colors) => ({
  content: { padding: spacing.lg, gap: spacing.md },
  intro: { ...type.body, color: colors.text, lineHeight: 20 },
  sectionTitle: { ...type.heading, color: colors.text, marginTop: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 6,
  },
  assetHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" },
  assetName: { ...type.subheading, color: colors.text, flex: 1 },
  assetWhat: { ...type.caption, color: colors.textMuted, lineHeight: 16 },
  tag: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagText: { ...type.caption, fontWeight: "700", color: colors.primaryStrong },
  groupHead: { flexDirection: "row", alignItems: "center", gap: 6 },
  groupTitle: { ...type.subheading, color: colors.text, flex: 1 },
  groupCount: { ...type.caption, color: colors.textMuted, fontWeight: "700" },
  licenseBox: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    padding: spacing.sm,
    gap: 4,
  },
  licenseBody: { fontSize: 11, color: colors.textMuted, lineHeight: 16 },
  packageList: { gap: 5 },
  packageRow: { gap: 1 },
  packageName: { ...type.caption, color: colors.text, fontWeight: "700" },
  packageVersion: { color: colors.textFaint, fontWeight: "400" },
  copyright: { fontSize: 10.5, color: colors.textFaint, lineHeight: 15 },
  url: { fontSize: 10.5, color: colors.primary },
  pressed: { opacity: 0.6 },
  footnote: { ...type.caption, color: colors.textFaint, lineHeight: 16, fontStyle: "italic" },
}));
