import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { FLOWER_METADATA, FILLER_ASSETS } from '../services/garden';

/**
 * Renders a dynamically composed, cohesive, handcrafted botanical bouquet:
 * - Back kraft paper wrap / backdrop (when kraft)
 * - Layered decorative fillers (eucalyptus & baby's breath)
 * - 5 tightly clustered, overlapping collectible flowers
 * - Front wrapping fold / ribbon bow (stems tucked neatly inside)
 */
export default function BouquetRenderer({ template, flowers = [], size = 320, style }) {
  if (!template) return null;

  // Extract flower types
  const flowerTypes = flowers.map((f) => (typeof f === 'string' ? f : f?.flowerType)).filter(Boolean);

  const containerWidth = size;
  const containerHeight = size * 1.18; // 320 x 377px

  const isKraft = template.wrapType === 'kraft';

  // Calibrated wrap dimensions based on original asset aspect ratio (498x956)
  const wrapWidth = containerWidth * 0.76;
  const wrapHeight = wrapWidth * (956 / 498);
  const wrapLeft = (containerWidth - wrapWidth) / 2;
  const wrapTop = containerHeight * 0.28; // Cone starts at 28%, fold at ~48%

  return (
    <View style={[styles.container, { width: containerWidth, height: containerHeight }, style]}>
      {/* 1. Back Kraft Paper Wrap (provides rustic warm paper backing for blooms) */}
      {isKraft && (
        <Image
          source={FILLER_ASSETS.kraft_back}
          style={[
            styles.absoluteItem,
            {
              left: wrapLeft,
              top: wrapTop,
              width: wrapWidth,
              height: wrapHeight,
              zIndex: 1,
            },
          ]}
          resizeMode="contain"
        />
      )}

      {/* 2. Fillers (Eucalyptus sprigs & Baby's Breath clouds) */}
      {template.fillers?.map((filler, idx) => {
        const isEuc = filler.type === 'eucalyptus';
        const asset = isEuc ? FILLER_ASSETS.eucalyptus : FILLER_ASSETS.babys_breath;
        const fillerWidth = containerWidth * 0.42 * (filler.scale || 1);
        const fillerHeight = fillerWidth * (isEuc ? 792 / 670 : 925 / 1024);
        const left = (filler.x / 100) * containerWidth - fillerWidth / 2;
        const top = (filler.y / 100) * containerHeight;

        return (
          <Image
            key={`filler_${idx}`}
            source={asset}
            style={[
              styles.absoluteItem,
              {
                left,
                top,
                width: fillerWidth,
                height: fillerHeight,
                zIndex: filler.zIndex || 2,
                transform: [{ rotate: filler.rotate || '0deg' }],
              },
            ]}
            resizeMode="contain"
          />
        );
      })}

      {/* 3. 5 Dynamically Inserted Collectible Flowers (clustered crown) */}
      {template.slots?.map((slot, idx) => {
        const flowerType = flowerTypes[idx] || 'rose';
        const meta = FLOWER_METADATA[flowerType] || FLOWER_METADATA.rose;
        // Natural botanical flower proportions: bloom ~42% of width, stem length ~2.1x width
        const flowerWidth = containerWidth * 0.42 * (slot.scale || 1);
        const flowerHeight = flowerWidth * 2.15;
        const left = (slot.x / 100) * containerWidth - flowerWidth / 2;
        const top = (slot.y / 100) * containerHeight;

        return (
          <Image
            key={`flower_${idx}_${flowerType}`}
            source={meta.asset}
            style={[
              styles.absoluteItem,
              {
                left,
                top,
                width: flowerWidth,
                height: flowerHeight,
                zIndex: slot.zIndex || 3,
                transform: [{ rotate: slot.rotate || '0deg' }],
              },
            ]}
            resizeMode="contain"
          />
        );
      })}

      {/* 4. Front Wrapping Layer */}
      {isKraft ? (
        /* Front Kraft Wrap: folded collar and cone with twine bow in front of stems */
        <Image
          source={FILLER_ASSETS.kraft_front}
          style={[
            styles.absoluteItem,
            {
              left: wrapLeft,
              top: wrapTop,
              width: wrapWidth,
              height: wrapHeight,
              zIndex: 10,
            },
          ]}
          resizeMode="contain"
        />
      ) : (
        /* Silk Ribbon Bow: tied gracefully across gathered stems at the waist */
        <Image
          source={FILLER_ASSETS.ribbon_tie}
          style={[
            styles.absoluteItem,
            {
              left: (containerWidth - containerWidth * 0.48) / 2,
              top: containerHeight * 0.53,
              width: containerWidth * 0.48,
              height: containerWidth * 0.48,
              zIndex: 10,
            },
          ]}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  absoluteItem: {
    position: 'absolute',
  },
});
