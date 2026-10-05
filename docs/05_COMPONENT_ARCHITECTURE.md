# Component Architecture

The application will be built using modular, reusable functional components. These are architectural concepts; implementation will depend entirely on the visual specifications provided later.

## Major Components

### `Clover`
- **Responsibility:** Renders the appropriate visual asset based on the `currentStage` state. Handles entrance/growth animations and tap interactions.

### `CareActionContainer` / `CareActionButton`
- **Responsibility:** Renders the four care interactions (Love, Water, Sunshine, Nourishment). Dispatches state updates when pressed and triggers visual/haptic feedback.

### `LightWhisper`
- **Responsibility:** A presentation component that displays a randomly selected message. Manages the fade-in/fade-out transitions when messages change.

### `ThemeSelector`
- **Responsibility:** Renders the selectable theme options. Dispatches the theme change event to the global state and triggers the application-wide re-render.

### `AudioController`
- **Responsibility:** A headless component (or hook) managing the background audio loop, playing/pausing based on app lifecycle and user settings.

### Reusable UI Primitives
- **`Typography` / `Text`:** A wrapper around React Native's Text component that maps to the design system's typography scales.
- **`Card` / `Surface`:** Reusable container for settings items, about sections, etc., adhering to theme border radii and background colors.
- **`Button`:** Generic, theme-aware button component.
