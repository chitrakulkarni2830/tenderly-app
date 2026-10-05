# Design System & Theming

## Theme Architecture
Tenderly supports exactly four themes:
1. **Garden**
2. **Midnight**
3. **Lavender Dusk**
4. **Misty Morning**

- **Implementation:** Themes will be structured as a central configuration object (e.g., `themes.js`) containing tokenized design values (colors, specific font references).
- **Access:** Components access theme values via a custom React Context (`ThemeProvider`) or a lightweight state hook.
- **Persistence:** The `selectedTheme` key is stored locally and restored on launch, ensuring the UI hydrates with the correct colors immediately.

## Typography Dependencies
Typography is a strict design dependency.
- **Provided Data:** Fonts (TTF/OTF files), font families, sizes, weights, line heights, and letter spacing will be supplied.
- **Developer Action:** Create a typography configuration mapping these exact specifications to UI components. Do NOT substitute fonts or guess missing values.

## Asset Architecture
Assets will be bundled locally inside the `/assets` directory.
- **Categories:** `images/`, `fonts/`, `audio/`, `icons/`.
- **Clover & Flowers:** Specific static images or Lottie animations for each growth stage.
- **Backgrounds:** Theme-specific backgrounds.
- *Developer Action:* Wait for final assets. Do not create or use placeholders.

## Design Handoff Dependency
**Development of the UI cannot begin until the design handoff is provided.**
The handoff will contain:
- Figma designs & exact screen layouts
- All typography specs and color hex codes
- Exact dimensions, spacing, margins, paddings, and border radii
- Icons, illustrations, and Clover assets
- Animation specifications and component states
- Theme specifications

*Note: The supplied specifications are the absolute source of truth. The developer must not make visual assumptions.*
