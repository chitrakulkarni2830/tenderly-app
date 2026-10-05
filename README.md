# Tenderly

Tenderly is a calm, gentle botanical self-care mobile application built with React Native and Expo. Centered around a small plant companion named **Clover**, Tenderly operates on a single core philosophy:

> *"Take care of me to take care of you."*

By attending to Clover's small daily needs (water, sunlight, nourishment, and love), the user is gently reminded to extend that same patience, warmth, and care to themselves. Tenderly is completely local-first and offline, offering a quiet, distraction-free environment free from accounts, algorithms, streaks, or external tracking.

---

## Core Features

### Clover Growth System
Clover's visual appearance and developmental stage progress based on cumulative care actions:
* **5 Visual Stages**:
  * **Stage 1 (Sprout in Pot)**: 0–2 care actions (`clover_pot.png`)
  * **Stage 2 (Young Sprout)**: 3–6 care actions (`clover_young.png`)
  * **Stage 3 (Growing Plant)**: 7–11 care actions (`clover_grown.png`)
  * **Stage 4 (Budding Plant)**: 12–17 care actions (`clover_budding.png`)
  * **Stage 5 (Mature Plant)**: 18+ care actions (`clover_blossomed.png`)
* **Blossom Threshold**: Reaching **21 cumulative care actions** (Stage 5 + 3 additional care actions) triggers a full botanical bloom.
* **4 Core Care Actions**:
  * **Water**: Plays a falling water drop Lottie animation (`water_animation.json`).
  * **Sun**: Plays a radiating sunshine sparkles Lottie animation (`sparkles_animation.json`).
  * **Nourish**: Plays a floating green leaves Lottie animation (`nourish_animation.json`).
  * **Love**: Plays a rising hearts Lottie animation (`heart_animation.json`).

### Daily Clover Care & Reciprocal Reminders
* **Sequential Daily Needs**: Each day, Clover requests one unfulfilled need at a time across the four care categories (`water`, `food`, `light`, `love`).
* **Stable Daily Prompts**: A randomized message index is selected for each category at the start of each calendar day and remains consistent until completed.
* **Reciprocal Self-Care Replies**: Completing a requested action displays a reciprocal caring reply from Clover (e.g., reminding the user to drink a glass of water, step into the sunshine, eat a nourishing meal, or speak kindly to themselves).
* **Local Midnight Reset**: An automatic 60-second periodic check and an `AppState` active listener check if local midnight has passed, resetting completed daily actions for a new day.

### Whispers (Daily Affirmations)
* **Curated Library**: 51 gentle, quiet daily affirmations stored in `data/whispers.json`.
* **Deterministic Sequencing**: Whispers are shuffled using a Fisher-Yates shuffle algorithm and stored locally.
* **Daily Advance**: The whisper advances by exactly one item each calendar day.
* **Repeat Prevention**: When the entire list of 51 affirmations is exhausted, the collection reshuffles, ensuring the first affirmation of the new sequence does not duplicate the last affirmation of the previous cycle.
* **Personalized**: Dynamically inserts the user's name if configured.

### The Garden
* **Botanical Sanctuary**: A dedicated space (`/garden`) displaying all matured blooms the user has gathered.
* **Bloom Cards**: Grid displaying gathered flowers with customized background tints, names, symbolic meanings, and collection dates.
* **Flower Detail Modal**: Tapping any collected flower displays its common name, formal botanical Latin name, symbolic meaning, and personal achievement message.

### Flowering & Blossom Flow
When Clover reaches 21 care actions, the blossoming sequence activates on the home screen:
1. **Visual Bloom**: A collectible flower asset appears alongside mature Clover.
2. **Floating Note**: An animated letter (`blossom_note.png`) with a bouncing floating loop invites the user to tap: *"a note for you ✉️"*.
3. **Discovery Modal**: Tapping the note opens the Blossom Discovery modal displaying the newly bloomed flower, its botanical name, symbolic meaning, and achievement message.
4. **Collection & Renewal**: Tapping "Add to Garden" permanently stores the bloom in the Garden collection (`@tenderly_garden_flowers`) and resets Clover's care count to 0 (Stage 1 Sprout) to begin a fresh growth journey.
5. **Fair Distribution Selection Engine**:
   * Exactly 7 collectible flowers:
     * **Wild Rose** (*Rosa rugosa*) — Love & Tenderness
     * **Sunlit Bloom** (*Helianthus annuus*) — Warmth & Vitality
     * **Blush Tulip** (*Tulipa gesneriana*) — Patience & Grace
     * **Peace Lily** (*Lilium candidum*) — Calm & Stillness
     * **Soft Peony** (*Paeonia lactiflora*) — Abundance & Kindness
     * **Mauve Gladiolus** (*Gladiolus communis*) — Quiet Strength
     * **Sweet Lavender** (*Lavandula angustifolia*) — Rest & Serenity
   * Built around 5-flower cycles where blooms cannot repeat within the same cycle.
   * Flowers omitted in cycle *N* are guaranteed to appear in cycle *N+1*.
   * Prevents identical full 5-flower sequences from occurring back-to-back.

### Bouquet Studio & Showcase
* **Unlock Requirement**: Unlocks once the user has collected at least **5 flowers** in their Garden (`FLOWERS_PER_CYCLE = 5`).
* **Dynamic Arrangement**: Uses the 5 most recently gathered blooms from the user's collection.
* **5 Handcrafted Bouquet Templates**:
  * **The Cottage Meadow**: Warm kraft wrap with airy wildflowers and natural twine.
  * **The Garden Posy**: Loose organic arrangement hand-tied with a flowing sage ribbon.
  * **The Cascade Bloom**: Poetic sweeping diagonal arrangement.
  * **The Wholesome Crown**: Balanced, harmonious dome arrangement.
  * **The Wildflower Whisper**: Tall, open, and ethereal composition.
* **Layered Botanical Rendering** (`BouquetRenderer.js`):
  * Kraft paper back layer (`bouquet_kraft_back.png`)
  * Natural fillers (eucalyptus sprigs and baby's breath clouds positioned and rotated by template coordinates)
  * 5 overlapping collectible flower assets
  * Front kraft fold cone (`bouquet_kraft_front.png`) or silk ribbon bow (`bouquet_ribbon_tie.png`), cleanly tucking the stems inside.
* **Bouquet Showcase** (`/bouquet-showcase`): A dedicated presentation view celebrating the finished arrangement and saving the creation to local storage (`@tenderly_bouquets`).

### Ambient Audio
* **5 Curated Ambient / Lofi Tracks**:
  * Bundled local MP3 audio files managed via `expo-audio`.
  * Configured with playlist looping (`loop: 'all'`).
  * Configured for background audio playback (`shouldPlayInBackground: true`, `playsInSilentMode: true`).
* **Top Navigation Audio Controls** (Home Screen):
  * Musical note icon toggle button in the top navigation bar.
  * Expands to an inline pill with:
    * Previous track (`play-skip-back`)
    * Play / Pause (`play` / `pause`)
    * Next track (`play-skip-forward`)
    * Close button to collapse the control pill back to the note icon.

### Themes & Design System
* **4 Built-in Themes** managed by `ThemeContext`:
  * **Garden**: Light warm cream background (`#FFF9ED`) with deep botanical green (`#3A5A40`).
  * **Midnight**: Deep twilight slate navy (`#21364C`) with luminous soft mint (`#D1FFC7`).
  * **Lavender Dusk**: Soft dusky lilac (`#E6DFE8`) with deep heather purple (`#403744`).
  * **Misty Morning**: Muted morning mist sage (`#E3E9E7`) with forest eucalyptus (`#40564C`).
* **Custom Typography**: Includes `Amarna` (editorial serif) and `Billabong` (soft script).
* **Theme Persistence**: Theme changes made through the Home screen slide-in menu are saved to local storage (`@tenderly_theme`).

### Personalization & Settings
* **User Name**: Configurable during the first-run onboarding screen (`/index` → `/welcome`) or at any time in Settings (`/name`). Clover uses this name in greetings and messages.
* **Settings Screen** (`/settings`):
  * **Your Name**: Edit your preferred name.
  * **How it works**: Comprehensive guidelines detailing daily care, whispers, plant growth, and bouquets (`/guide`).
  * **About Tenderly**: App philosophy and version display (`/about`).
  * **Privacy Policy**: Clear explanation of local-only storage and privacy standards (`/privacy`).

---

## Tech Stack

* **Framework**: [React Native](https://reactnative.dev/) (0.86.3) / [Expo](https://expo.dev/) (SDK 57 / ~57.0.26)
* **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (~57.0.24) with file-based routing
* **Language**: JavaScript (ES6+ / React 19.2.3)
* **Local Persistence**: [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) (2.2.0)
* **Audio Engine**: [expo-audio](https://docs.expo.dev/versions/latest/sdk/audio/) (^57.0.5)
* **Vector Icons**: [@expo/vector-icons](https://icons.expo.fyi/) (^15.0.2) (Feather, Ionicons)
* **Animations**: [lottie-react-native](https://github.com/lottie-react-native/lottie-react-native) (~7.3.8) and React Native `Animated`
* **Typography**: [expo-font](https://docs.expo.dev/versions/latest/sdk/font/) (~57.0.4)
* **Layout & UI**: [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context) (~5.7.0) and [react-native-screens](https://github.com/software-mansion/react-native-screens) (~4.26.0)

---

## Architecture & Directory Structure

```text
tenderly/
├── app/                      # Expo Router screen routes & layouts
│   ├── _layout.js            # Root layout, font loading, ThemeProvider, AudioProvider
│   ├── index.js              # Splash screen & onboarding name input
│   ├── welcome.js            # First-time welcome transition
│   ├── home.js               # Main screen: Clover, actions, audio controls, menu modal
│   ├── garden.js             # Garden sanctuary grid of gathered blooms
│   ├── bouquet.js            # Bouquet Studio: arrangement & template selector
│   ├── bouquet-showcase.js   # Bouquet presentation & showcase view
│   ├── settings.js           # Settings menu
│   ├── guide.js              # How it works & app guidelines
│   ├── name.js               # Name editing screen
│   ├── about.js              # About Tenderly & version
│   ├── privacy.js            # Local-only privacy policy
│   └── theme.js              # Standalone theme route
├── assets/
│   ├── animations/           # Lottie animation JSONs (heart, nourish, sparkles, water)
│   ├── audio/                # Bundled ambient MP3 tracks
│   ├── fonts/                # Custom font files (Amarna.ttf, Billabong.ttf)
│   └── images/               # Botanical PNG assets (Clover stages, flowers, wraps)
├── components/
│   ├── BouquetRenderer.js    # Multi-layered botanical bouquet compositing component
│   └── Clover.js             # Reusable Clover component
├── contexts/
│   ├── AudioContext.js       # Background playlist state and playback controls
│   └── ThemeContext.js       # Centralized theme state and storage synchronization
├── data/
│   ├── messages.json         # Clover care requests and reciprocal self-care replies
│   └── whispers.json         # Daily affirmation text library (51 entries)
├── docs/                     # Technical architecture & specification documents
├── services/
│   ├── storage.js            # AsyncStorage abstraction, keys, and Clover thresholds
│   ├── garden.js             # Flower metadata, bouquet templates, and cycle algorithm
│   └── audio.js              # Audio helper utilities
├── themes/
│   └── index.js              # Theme color palettes (Garden, Midnight, Lavender, Misty)
├── app.json                  # Expo application configuration
└── package.json              # Project dependencies and npm scripts
```

---

## Data & Persistence

Tenderly is built entirely as a **local-first, offline application**. It requires no user account, no login, no remote database, and makes no network requests for its core features.

All persistent state is stored on the user's device using `@react-native-async-storage/async-storage`:

| Storage Key | Description |
| :--- | :--- |
| `@tenderly_clover_state` | Cumulative care count, current growth stage, pending flower object, and last updated timestamp. |
| `@tenderly_user_settings` | User personalization settings (user's name). |
| `@tenderly_garden_flowers` | Array of collected flowers (flower type, cycle, cycle position, collected timestamp). |
| `@tenderly_bouquets` | Array of crafted bouquets (template ID, template name, flower IDs, created timestamp). |
| `@tenderly_whisper_state` | Randomized affirmation sequence, current index, and last shown date string. |
| `@tenderly_daily_messages_state` | Calendar date string and daily selection indices/completion flags for all 4 care categories. |
| `@tenderly_theme` | Active theme identifier (`garden`, `midnight`, `lavenderDusk`, `mistyMorning`). |

---

## Development Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or v20 LTS recommended)
* npm (bundled with Node.js)
* [Expo Go](https://expo.dev/go) app on a physical device, or an iOS / Android simulator

### Installation & Execution

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the Expo development server**:
   ```bash
   npx expo start
   ```

3. **Running on Android / iOS development builds**:
   ```bash
   # Run on connected Android device / emulator
   npx expo run:android

   # Run on iOS simulator (macOS required)
   npx expo run:ios
   ```

4. **Maintenance & Diagnostics**:
   ```bash
   # Run Expo doctor to verify dependency and SDK compatibility
   npx expo-doctor

   # Typecheck code
   npx tsc --noEmit
   ```

---

## Privacy Policy Summary

Tenderly does not collect, transmit, sell, or analyze personal data. All activity—including names, progress, and creations—remains solely on the user's local device. For the full privacy statement, navigate to **Settings → Privacy Policy** within the app or inspect `app/privacy.js`.

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
