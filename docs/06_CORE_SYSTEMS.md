# Core Systems Architecture

## 1. Clover Architecture
Clover is the central entity. The implementation supports:
- **Multiple Growth Stages:** Clover's visual representation changes as it progresses. The exact number of stages and visual thresholds will be provided during the design handoff.
- **Progression Logic:** A numeric threshold system (e.g., total care actions) dictates when Clover levels up to the next stage.
- **Care Interactions:** Interacting with UI elements updates Clover's state.
- **Persistence:** Growth stage and progression are saved to local storage immediately upon change and restored on application restart.

## 2. Care System
There are four care interactions: **Love, Water, Sunshine, Nourishment**.
- **Trigger:** A user presses a specific care UI element.
- **State Update:** The `progressionValue` in the state is incremented.
- **Visual Feedback:** Triggers an animation (to be defined in design handoff) and updates the Light Whisper.
- **Persistence:** The updated state is asynchronously written to local storage.

## 3. Light Whisper
A system for displaying comforting text.
- **Dataset:** A local static JSON array containing approximately 50 provided messages.
- **Selection:** Random selection logic is triggered on app launch and upon completing a care action.
- **Display:** The text updates with an appropriate transition (e.g., cross-fade) depending on the final interaction design.
- **Content:** *Developer must not invent the messages. They will be supplied separately.*

## 4. Audio Architecture
Tenderly includes exactly **one** ambient music track.
- **Loading:** Loaded via Expo AV (`expo-av`) asynchronously on app startup.
- **Playback:** Configured to loop infinitely.
- **State:** Controlled by the global `audioEnabled` state.
- **App Lifecycle:** Pauses when the app goes to the background (Android `AppState`) and resumes when returning to the foreground, if enabled.
- **Error Handling:** If the audio file fails to load, playback degrades gracefully without throwing fatal errors.

## 5. Settings / Personalization
- **Name Input:** A simple input field allowing the user to type their name. This requires basic sanitization (e.g., trimming whitespace, reasonable max length). Handled via local state and persisted to `AsyncStorage`.
- **About Tenderly:** A static informational view displaying the app's purpose, version, and credits.
