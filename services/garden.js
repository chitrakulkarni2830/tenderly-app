/**
 * Core Garden & Flower Collection service for Tenderly.
 * Handles flower generation, cycle validation, bouquet unlocking, templates, and persistence.
 */

export const FLOWER_TYPES = [
  'rose',
  'sunflower',
  'tulip',
  'lily',
  'peony',
  'gladiolus',
  'lavender',
];

export const FLOWERS_PER_CYCLE = 5;

// Stage 5 threshold is 18 actions + 3 additional actions = 21 total actions for Blossom
export const BLOSSOM_CARE_ACTIONS_THRESHOLD = 21;

/**
 * Metadata, botanical details, and achievement messages for all 7 collectible flowers.
 * Emotionally warm, tender, personal moments of care.
 */
export const FLOWER_METADATA = {
  rose: {
    id: 'rose',
    name: 'Wild Rose',
    botanicalName: 'Rosa rugosa',
    meaning: 'Love & Tenderness',
    message: 'Thank you for loving me so gently. Even on quiet days, your tenderness makes everything bloom.',
    color: '#D98282',
    accentColor: '#F5E4E4',
    asset: require('../assets/images/flower_rose.png'),
  },
  sunflower: {
    id: 'sunflower',
    name: 'Sunlit Bloom',
    botanicalName: 'Helianthus annuus',
    meaning: 'Warmth & Vitality',
    message: 'You brought so much warmth and light today. May you feel that same sunshine shining back on you.',
    color: '#E5A93C',
    accentColor: '#FDF3DC',
    asset: require('../assets/images/flower_sunflower.png'),
  },
  tulip: {
    id: 'tulip',
    name: 'Blush Tulip',
    botanicalName: 'Tulipa gesneriana',
    meaning: 'Patience & Grace',
    message: 'Look how patiently we grew together. A sweet reminder that good, beautiful things take time.',
    color: '#E08B7A',
    accentColor: '#FBEBE7',
    asset: require('../assets/images/flower_tulip.png'),
  },
  lily: {
    id: 'lily',
    name: 'Peace Lily',
    botanicalName: 'Lilium candidum',
    meaning: 'Calm & Stillness',
    message: 'A peaceful breath just for you. Thank you for making this little corner of the world so calm and safe.',
    color: '#7F9E7B',
    accentColor: '#EEF3EC',
    asset: require('../assets/images/flower_lily.png'),
  },
  peony: {
    id: 'peony',
    name: 'Soft Peony',
    botanicalName: 'Paeonia lactiflora',
    meaning: 'Abundance & Kindness',
    message: 'Your soft care has unfolded into something full and wondrous. You are doing so much better than you know.',
    color: '#D47E95',
    accentColor: '#FAE7ED',
    asset: require('../assets/images/flower_peony.png'),
  },
  gladiolus: {
    id: 'gladiolus',
    name: 'Mauve Gladiolus',
    botanicalName: 'Gladiolus communis',
    meaning: 'Quiet Strength',
    message: 'Standing tall and resilient with you. Thank you for showing up today with a brave and gentle heart.',
    color: '#9E84A7',
    accentColor: '#EFEBF2',
    asset: require('../assets/images/flower_gladiolus.png'),
  },
  lavender: {
    id: 'lavender',
    name: 'Sweet Lavender',
    botanicalName: 'Lavandula angustifolia',
    meaning: 'Rest & Serenity',
    message: 'Rest easy now, sweet friend. Let this fragrance bring peace to your mind and stillness to your soul.',
    color: '#8A82B5',
    accentColor: '#ECEAF5',
    asset: require('../assets/images/flower_lavender.png'),
  },
};

export const FILLER_ASSETS = {
  babys_breath: require('../assets/images/filler_babys_breath.png'),
  eucalyptus: require('../assets/images/filler_eucalyptus.png'),
  kraft_wrap: require('../assets/images/bouquet_kraft_wrap.png'),
  kraft_back: require('../assets/images/bouquet_kraft_back.png'),
  kraft_front: require('../assets/images/bouquet_kraft_front.png'),
  ribbon_tie: require('../assets/images/bouquet_ribbon_tie.png'),
  note: require('../assets/images/blossom_note.png'),
};

/**
 * Exactly 5 predefined reusable bouquet templates.
 * Dynamically populated with any 5 flowers the user has collected.
 * Calibrated for lush, tightly clustered, cohesive floral beauty.
 */
export const BOUQUET_TEMPLATES = [
  {
    id: 'cottage_meadow',
    name: 'The Cottage Meadow',
    shortName: 'Meadow',
    subtitle: 'Warm kraft wrap with airy wildflowers',
    description: 'A cozy countryside bouquet nestled in crinkled kraft paper and natural twine.',
    wrapType: 'kraft',
    slots: [
      { x: 50, y: 7, scale: 1.05, rotate: '0deg', zIndex: 3 },
      { x: 33, y: 15, scale: 0.98, rotate: '-8deg', zIndex: 4 },
      { x: 67, y: 14, scale: 0.98, rotate: '8deg', zIndex: 4 },
      { x: 41, y: 25, scale: 0.94, rotate: '-4deg', zIndex: 5 },
      { x: 59, y: 24, scale: 0.94, rotate: '4deg', zIndex: 5 },
    ],
    fillers: [
      { type: 'eucalyptus', x: 20, y: 12, scale: 0.85, rotate: '-24deg', zIndex: 2 },
      { type: 'eucalyptus', x: 80, y: 10, scale: 0.85, rotate: '24deg', zIndex: 2 },
      { type: 'babys_breath', x: 28, y: 18, scale: 0.78, rotate: '-12deg', zIndex: 2 },
      { type: 'babys_breath', x: 72, y: 16, scale: 0.78, rotate: '12deg', zIndex: 2 },
    ],
  },
  {
    id: 'garden_posy',
    name: 'The Garden Posy',
    shortName: 'Posy',
    subtitle: 'Hand-tied with soft sage ribbon',
    description: 'A loose, organic arrangement tied together with a flowing silk bow.',
    wrapType: 'ribbon',
    slots: [
      { x: 50, y: 6, scale: 1.08, rotate: '0deg', zIndex: 3 },
      { x: 32, y: 13, scale: 1.0, rotate: '-10deg', zIndex: 4 },
      { x: 68, y: 12, scale: 1.0, rotate: '10deg', zIndex: 4 },
      { x: 41, y: 23, scale: 0.96, rotate: '-5deg', zIndex: 5 },
      { x: 59, y: 22, scale: 0.96, rotate: '5deg', zIndex: 5 },
    ],
    fillers: [
      { type: 'eucalyptus', x: 20, y: 9, scale: 0.9, rotate: '-26deg', zIndex: 2 },
      { type: 'eucalyptus', x: 80, y: 8, scale: 0.9, rotate: '26deg', zIndex: 2 },
      { type: 'babys_breath', x: 50, y: 4, scale: 0.85, rotate: '0deg', zIndex: 1 },
      { type: 'babys_breath', x: 28, y: 16, scale: 0.75, rotate: '-15deg', zIndex: 2 },
      { type: 'babys_breath', x: 72, y: 15, scale: 0.75, rotate: '15deg', zIndex: 2 },
    ],
  },
  {
    id: 'cascade_bloom',
    name: 'The Cascade Bloom',
    shortName: 'Cascade',
    subtitle: 'Graceful asymmetrical flow',
    description: 'A poetic sweeping diagonal arrangement that dances with botanical grace.',
    wrapType: 'kraft',
    slots: [
      { x: 36, y: 6, scale: 1.02, rotate: '-12deg', zIndex: 3 },
      { x: 52, y: 12, scale: 1.05, rotate: '-2deg', zIndex: 4 },
      { x: 68, y: 16, scale: 0.95, rotate: '10deg', zIndex: 4 },
      { x: 43, y: 24, scale: 0.96, rotate: '-6deg', zIndex: 5 },
      { x: 61, y: 27, scale: 0.92, rotate: '6deg', zIndex: 5 },
    ],
    fillers: [
      { type: 'eucalyptus', x: 18, y: 8, scale: 0.95, rotate: '-30deg', zIndex: 2 },
      { type: 'eucalyptus', x: 82, y: 18, scale: 0.8, rotate: '25deg', zIndex: 2 },
      { type: 'babys_breath', x: 26, y: 16, scale: 0.75, rotate: '-14deg', zIndex: 2 },
      { type: 'babys_breath', x: 66, y: 24, scale: 0.75, rotate: '14deg', zIndex: 2 },
    ],
  },
  {
    id: 'wholesome_crown',
    name: 'The Wholesome Crown',
    shortName: 'Crown',
    subtitle: 'Lush rounded dome of kindness',
    description: 'A harmonious dome of blooms centered around comfort and balanced beauty.',
    wrapType: 'kraft',
    slots: [
      { x: 50, y: 5, scale: 1.15, rotate: '0deg', zIndex: 3 },
      { x: 32, y: 12, scale: 1.02, rotate: '-10deg', zIndex: 4 },
      { x: 68, y: 11, scale: 1.02, rotate: '10deg', zIndex: 4 },
      { x: 40, y: 23, scale: 0.96, rotate: '-4deg', zIndex: 5 },
      { x: 60, y: 22, scale: 0.96, rotate: '4deg', zIndex: 5 },
    ],
    fillers: [
      { type: 'babys_breath', x: 50, y: 2, scale: 0.95, rotate: '0deg', zIndex: 1 },
      { type: 'babys_breath', x: 24, y: 10, scale: 0.85, rotate: '-15deg', zIndex: 2 },
      { type: 'babys_breath', x: 76, y: 8, scale: 0.85, rotate: '15deg', zIndex: 2 },
      { type: 'eucalyptus', x: 16, y: 18, scale: 0.8, rotate: '-28deg', zIndex: 2 },
      { type: 'eucalyptus', x: 84, y: 16, scale: 0.8, rotate: '28deg', zIndex: 2 },
    ],
  },
  {
    id: 'wildflower_whisper',
    name: 'The Wildflower Whisper',
    shortName: 'Whisper',
    subtitle: 'Tall, airy & ethereal arrangement',
    description: 'An open, breathing composition that feels like freshly gathered morning wildflowers.',
    wrapType: 'kraft',
    slots: [
      { x: 50, y: 3, scale: 1.12, rotate: '1deg', zIndex: 3 },
      { x: 32, y: 14, scale: 0.98, rotate: '-8deg', zIndex: 4 },
      { x: 68, y: 12, scale: 0.98, rotate: '8deg', zIndex: 4 },
      { x: 42, y: 25, scale: 0.94, rotate: '-3deg', zIndex: 5 },
      { x: 58, y: 24, scale: 0.94, rotate: '3deg', zIndex: 5 },
    ],
    fillers: [
      { type: 'eucalyptus', x: 30, y: 2, scale: 0.88, rotate: '-16deg', zIndex: 2 },
      { type: 'babys_breath', x: 70, y: 2, scale: 0.88, rotate: '16deg', zIndex: 2 },
      { type: 'eucalyptus', x: 16, y: 16, scale: 0.8, rotate: '-25deg', zIndex: 2 },
      { type: 'babys_breath', x: 84, y: 14, scale: 0.8, rotate: '25deg', zIndex: 2 },
    ],
  },
];

/**
 * Checks whether Clover has met the flowering/blossoming threshold.
 * @param {number} careCount
 * @returns {boolean}
 */
export const isBlossomReady = (careCount) => {
  return typeof careCount === 'number' && careCount >= BLOSSOM_CARE_ACTIONS_THRESHOLD;
};

/**
 * Checks whether bouquet creation is unlocked (unlocked at 5+ collected flowers).
 * @param {Array} gardenHistory
 * @returns {boolean}
 */
export const isBouquetUnlocked = (gardenHistory) => {
  return Array.isArray(gardenHistory) && gardenHistory.length >= FLOWERS_PER_CYCLE;
};

/**
 * Selects the next flower for collection respecting:
 * 1. Exactly 7 collectible flower types.
 * 2. Within every 5-flower cycle, a flower cannot repeat (all 5 different).
 * 3. After 5 flowers, a new cycle begins.
 * 4. The exact same 5-flower sequence/order must not repeat in the consecutive cycle.
 * 5. Flowers excluded from cycle N are guaranteed to appear in cycle N+1.
 * 6. Selection remains randomized while respecting these constraints.
 *
 * @param {Array<{ flowerType: string }>} history - List of previously collected flowers in chronological order
 * @returns {{ flowerType: string, cycle: number, cyclePosition: number, metadata: object }}
 */
export const selectNextFlower = (history = []) => {
  const N = history.length;
  const cycleIndex = Math.floor(N / FLOWERS_PER_CYCLE);
  const cycle = cycleIndex + 1;
  const cyclePosition = (N % FLOWERS_PER_CYCLE) + 1;

  // Flowers already collected in the current cycle
  const currentCycleFlowers = history.slice(cycleIndex * FLOWERS_PER_CYCLE).map((f) => f.flowerType);

  // Candidates cannot repeat within the same 5-flower cycle
  let candidates = FLOWER_TYPES.filter((f) => !currentCycleFlowers.includes(f));

  // Guarantee coverage: flowers excluded from the previous cycle must appear in this cycle.
  // Applied lazily — only forced when remaining positions equal remaining required flowers.
  if (cycleIndex > 0) {
    const prevCycleFlowers = history
      .slice((cycleIndex - 1) * FLOWERS_PER_CYCLE, cycleIndex * FLOWERS_PER_CYCLE)
      .map((f) => f.flowerType);

    // Flowers that were skipped in the previous cycle (debt owed to this cycle)
    const requiredFlowers = FLOWER_TYPES.filter((f) => !prevCycleFlowers.includes(f));

    // Which of those required flowers are still missing from the current cycle
    const missingRequired = requiredFlowers.filter((f) => !currentCycleFlowers.includes(f));

    // Positions remaining in the cycle AFTER the current pick
    const positionsRemaining = FLOWERS_PER_CYCLE - cyclePosition;

    // If the number of still-missing required flowers exceeds available future positions,
    // we MUST pick from required flowers right now to guarantee they all appear.
    if (missingRequired.length > 0 && missingRequired.length > positionsRemaining) {
      const forcedCandidates = candidates.filter((f) => missingRequired.includes(f));
      if (forcedCandidates.length > 0) candidates = forcedCandidates;
    }
  }

  // Prevent exact duplicate sequence from the previous cycle (last-position guard)
  if (cyclePosition === FLOWERS_PER_CYCLE && cycleIndex > 0) {
    const prevCycle = history
      .slice((cycleIndex - 1) * FLOWERS_PER_CYCLE, cycleIndex * FLOWERS_PER_CYCLE)
      .map((f) => f.flowerType);

    const prefixMatches = currentCycleFlowers.every((f, i) => f === prevCycle[i]);
    if (prefixMatches && candidates.length > 1) {
      candidates = candidates.filter((f) => f !== prevCycle[FLOWERS_PER_CYCLE - 1]);
    }
  }

  // Random selection among valid candidates
  const randomIndex = Math.floor(Math.random() * candidates.length);
  const chosenFlower = candidates[randomIndex];

  return {
    flowerType: chosenFlower,
    cycle,
    cyclePosition,
    metadata: FLOWER_METADATA[chosenFlower],
  };
};
