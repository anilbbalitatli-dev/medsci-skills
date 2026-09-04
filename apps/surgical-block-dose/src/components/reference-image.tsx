import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getReferenceImage } from "@/data/block-images";
import { ReferenceImage as ReferenceImageData } from "@/data/types";
import { colors, spacing } from "@/theme";

function PendingSlot({ caption }: { caption: string }) {
  return (
    <View style={styles.pending}>
      <Ionicons name="image-outline" size={20} color={colors.textMuted} />
      <Text style={styles.pendingTitle}>Görsel eklenmeyi bekliyor</Text>
      <Text style={styles.pendingCaption}>{caption}</Text>
    </View>
  );
}

function Lightbox({
  image,
  data,
  onClose,
}: {
  image: ReturnType<typeof getReferenceImage>;
  data: ReferenceImageData;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.lightboxBackdrop}>
        <Pressable
          onPress={onClose}
          hitSlop={12}
          style={[styles.lightboxClose, { top: insets.top + spacing.md }]}
          accessibilityLabel="Kapat"
        >
          <Ionicons name="close" size={26} color="#FFFFFF" />
        </Pressable>
        <ScrollView
          maximumZoomScale={4}
          minimumZoomScale={1}
          centerContent
          contentContainerStyle={styles.lightboxScroll}
        >
          <Image source={image} style={styles.lightboxImage} resizeMode="contain" />
        </ScrollView>
        <View style={[styles.lightboxMeta, { paddingBottom: insets.bottom + spacing.md }]}>
          <Text style={styles.lightboxCaption}>{data.caption}</Text>
          <Text style={styles.lightboxCredit}>{data.credit}</Text>
        </View>
      </View>
    </Modal>
  );
}

export function ReferenceImageView({
  data,
  showPending = false,
}: {
  data: ReferenceImageData;
  /** Render a labelled placeholder when the file isn't registered yet. */
  showPending?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const image = getReferenceImage(data.key);

  if (!image) return showPending ? <PendingSlot caption={data.caption} /> : null;

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setOpen(true)} style={({ pressed }) => pressed && styles.pressed}>
        {/* "contain", not "cover": these captures carry the anatomy labels that
            make them worth showing, and cropping to fill the frame cuts them
            off. Letterboxing against the imaging ground is invisible anyway,
            since ultrasound sits on black already. */}
        <Image source={image} style={styles.thumb} resizeMode="contain" />
        <View style={styles.expandHint}>
          <Ionicons name="expand-outline" size={14} color="#FFFFFF" />
        </View>
      </Pressable>
      <Text style={styles.caption}>{data.caption}</Text>
      <Text style={styles.credit}>{data.credit}</Text>
      {open ? <Lightbox image={image} data={data} onClose={() => setOpen(false)} /> : null}
    </View>
  );
}

export function ReferenceImageList({ images }: { images?: ReferenceImageData[] }) {
  const available = (images ?? []).filter((img) => getReferenceImage(img.key));
  if (available.length === 0) return null;

  return (
    <View style={styles.list}>
      {available.map((img) => (
        <ReferenceImageView key={img.key} data={img} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  container: {
    gap: 3,
  },
  pressed: {
    opacity: 0.75,
  },
  thumb: {
    width: "100%",
    height: 210,
    borderRadius: 10,
    backgroundColor: colors.imaging,
  },
  expandHint: {
    position: "absolute",
    right: spacing.sm,
    bottom: spacing.sm,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 999,
    padding: 5,
  },
  caption: {
    fontSize: 12.5,
    color: colors.text,
    fontWeight: "600",
  },
  credit: {
    fontSize: 11,
    color: colors.textMuted,
  },
  pending: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    borderRadius: 10,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.background,
  },
  pendingTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
  },
  pendingCaption: {
    fontSize: 11.5,
    color: colors.textMuted,
    textAlign: "center",
  },
  lightboxBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.94)",
  },
  lightboxClose: {
    position: "absolute",
    right: spacing.lg,
    zIndex: 2,
    padding: 4,
  },
  lightboxScroll: {
    flexGrow: 1,
    justifyContent: "center",
  },
  lightboxImage: {
    width: "100%",
    height: 420,
  },
  lightboxMeta: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: 3,
  },
  lightboxCaption: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "600",
  },
  lightboxCredit: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 11.5,
  },
});
