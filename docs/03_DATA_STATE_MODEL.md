# Data & State Model

## Local State Schema
The application manages a small amount of crucial state locally. This state will be serialized and stored on the device.

### 1. User
- `name` (String): The user's chosen name.

### 2. Clover (The Plant)
- `currentStage` (Integer): Represents the current visual growth stage.
- `progressionValue` (Integer): A metric tracking the total care given, used to determine thresholds for stage leveling.
- `careHistory` (Object/Array): Tracks recent care actions (e.g., timestamps for Love, Water, Sunshine, Nourishment) to manage cooldowns or progression caps if defined by future logic.

### 3. Theme
- `selectedTheme` (String): The ID of the current theme (`garden`, `midnight`, `lavender_dusk`, `misty_morning`).

### 4. Application Preferences
- `audioEnabled` (Boolean): Global toggle for the ambient music.
- `hasCompletedOnboarding` (Boolean): Flag to determine if the user has seen the first-launch setup.

## State Lifecycle
- **Initialization (First Launch):** The app checks local storage. If no data is found, `hasCompletedOnboarding` is false, and default state is loaded in-memory (e.g., Stage 0 Clover, 'Garden' theme).
- **Restoration:** On subsequent launches, the app retrieves the JSON string from local storage, parses it, and hydrates the React state tree before dismissing the Splash screen.
- **Temporary UI State:** Includes active animations, the current randomly selected Light Whisper, modal visibility, and navigation state. This is NOT persisted.
- **Corrupted Data:** If the retrieved JSON is invalid or missing required keys, the app clears the corrupted keys and restores default safe values.
