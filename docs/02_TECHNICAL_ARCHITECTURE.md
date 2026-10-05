# Technical Architecture

## Core Tech Stack
- **Framework:** React Native (v0.86.3)
- **Platform:** Expo (SDK 57)
- **Routing:** Expo Router
- **Language:** JavaScript
- **Target Platform:** Android First / Google Play Store

## Architecture Overview
The architecture is designed to be simple and maintainable, suitable for a small mobile MVP without a backend.
- **UI/Screens:** Handled by Expo Router with a file-based routing structure.
- **Components:** Modular React components for reusability.
- **State Management:** React Context API or lightweight state management (e.g., Zustand) depending on preference, paired with React Hooks for localized state. 
- **Persistence:** Local, on-device storage using `AsyncStorage` (or a similar lightweight Expo-compatible wrapper) for saving application state.
- **Offline Architecture:** Since there is no backend, all assets (images, fonts, audio, Light Whisper JSON data) are bundled with the application. State is updated synchronously and persisted locally.

## Local Persistence Approach
- **Tooling:** React Native `AsyncStorage` (via `@react-native-async-storage/async-storage`).
- **Initialization:** On app load, the persistence layer reads the stored state. If none exists, default MVP state is initialized.
- **Read/Write:** Synchronous UI updates followed by asynchronous persistence writes to avoid blocking the main thread.
- **Update Strategy:** Whole-state snapshot or granular key-value updates depending on the data (e.g., separating `user_settings` from `clover_state`).
- **Invalid-State Recovery:** If parsing fails or data is corrupted, the app gracefully falls back to default settings, avoiding fatal crashes.

## Error Handling
- **First Launch:** Handled via empty state checks. Initial setup (like entering a name) will be triggered.
- **Missing/Invalid Local State:** Caught during JSON parsing. Fallback to default state.
- **Storage Failure:** Handled gracefully via `try/catch` blocks. The app will function in-memory for the session if persistence fails.
- **Audio Loading Failure:** Playback is skipped without crashing the application; UI handles the missing audio gracefully.
- **Theme Restoration Failure:** Default theme (Garden) is applied.
- **Interrupted Animations:** Components must gracefully unmount or clean up ongoing animation values.
