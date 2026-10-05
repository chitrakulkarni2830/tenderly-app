# Android Requirements

Tenderly is built Android-first for the Google Play Store.

## Application Configurations (app.json)
- **Package ID:** Placeholder `com.tenderly.app` (to be finalized later).
- **App Icon & Splash:** Will be configured using Expo's asset generation once exact design assets are provided.
- **Status Bar & Navigation Bar:** Must be configured to respect the active theme (e.g., dark content on light themes, light content on dark themes).
- **Safe Areas:** Use `react-native-safe-area-context` to ensure the UI does not overlap with system UI elements, notches, or punch-holes.

## Android Specific Behavior
- **Hardware Back Button:** Must be handled appropriately using React Native's `BackHandler` or Expo Router's built-in stack navigation.
- **Audio Lifecycle:** Audio must strictly pause when the app is backgrounded and resume when foregrounded via the `AppState` API.

## Permissions & Security
- **No Unnecessary Permissions:** Tenderly relies strictly on local state and standard UI components.
- **Strictly Excluded Permissions:** The app MUST NOT request location, contacts, camera, microphone, SMS, phone, or photo access. There are no features requiring these.
- **Release Config:** Standard Expo EAS build configuration for Android (`.apk`/`.aab`).
