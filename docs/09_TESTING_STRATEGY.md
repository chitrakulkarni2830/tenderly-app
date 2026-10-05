# Testing Strategy

Testing for this MVP focuses on functional stability, local persistence reliability, and Android specific edge cases.

## 1. Functional Testing
- **First Launch Experience:** Ensure onboarding state triggers correctly on a fresh install and gracefully transitions to the home screen.
- **Clover Interactions:** Validate that tapping Love, Water, Sunshine, and Nourishment correctly update the state and UI.
- **Progression Logic:** Ensure Clover levels up only when the correct threshold is met.
- **Light Whisper:** Verify that messages rotate randomly without crashing or displaying empty text.
- **Settings & Audio:** Toggle audio on/off and verify immediate response. Change user name and ensure it displays correctly.
- **Navigation:** Validate smooth transitions between Splash, Home, Theme Selector, Settings, and About.

## 2. Persistence Testing
- **App Restart:** Kill the application completely and relaunch. Validate that `selectedTheme`, user name, and Clover's growth stage are restored accurately.
- **State Hydration:** Ensure the UI does not flash default state before hydrated state is applied.

## 3. Android Specific Testing
- **Hardware Back Button:** Verify the back button navigates correctly or exits the app from the Home screen.
- **Safe Areas:** Test across multiple simulated device ratios to ensure no clipping occurs at the top (status bar) or bottom (navigation bar).
- **Backgrounding:** Send the app to the background. Verify audio stops. Bring it to the foreground. Verify audio resumes.
- **Offline Behavior:** Turn off Wi-Fi/Cellular on the emulator. Ensure the entire app functions flawlessly.

## 4. Edge Cases
- **Missing Data:** Simulate wiping `AsyncStorage`. The app must return to the initial onboarding state without crashing.
- **Invalid Data:** Inject malformed JSON into storage. The app should gracefully reset to safe defaults.
- **Audio Failure:** Delete the audio asset locally and verify the app runs silently without crashing.
- **Interrupted State Changes:** Mash the care buttons rapidly. Verify the app does not lock up or corrupt the progression state.
