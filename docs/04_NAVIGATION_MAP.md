# Navigation Map

The routing leverages **Expo Router** using a simple file-based layout. There is NO bottom tab navigation unless specified in the future design handoff. 

## Expected Screen Structure
- **`/splash`**
  - Handles app initialization, asset loading, state hydration, and entry animations.
- **`/` (Home)**
  - The primary interaction screen containing Clover, care actions, Light Whisper display, and access to other screens.
- **`/theme`**
  - Theme selection menu (Garden, Midnight, Lavender Dusk, Misty Morning).
- **`/settings`**
  - User name input, global app preferences (like audio toggle).
- **`/about`**
  - Static screen displaying "About Tenderly" information.

*Note: Additional screens will not be created unless explicitly added during the design handoff.*
