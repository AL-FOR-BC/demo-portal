# Dynamic Theme System

This application now supports dynamic theme color changes that work both in development and production environments.

## How It Works

### 1. CSS Custom Properties

Instead of using SCSS variables (which are compiled at build time), we use CSS custom properties (CSS variables) that can be changed dynamically at runtime.

### 2. Theme Utilities

The `src/utils/themeUtils.ts` file contains utility functions for:

- Converting hex colors to RGB
- Generating lighter and darker variants of colors
- Applying theme colors to CSS custom properties
- Saving/loading theme colors from localStorage

### 3. Theme Overrides

The `src/assets/scss/_theme-overrides.scss` file contains CSS rules that override Bootstrap and custom components to use CSS custom properties instead of SCSS variables.

## Key Features

### Real-time Color Preview

- Color changes are applied immediately when you change the color picker or text input
- Visual preview shows the primary color and its variants
- Reset button to restore default color

### Persistent Storage

- Theme colors are saved to localStorage
- Colors persist across browser sessions
- Automatically loaded when the app starts

### Production Ready

- Works in both development and production builds
- No build-time compilation required for color changes
- CSS custom properties are supported in all modern browsers

## Usage

### Changing Theme Colors

1. Navigate to Settings page (requires admin access)
2. Use the color picker or text input in the "Theme Color" section
3. Colors are applied immediately for preview
4. Click "Save Changes" to persist the changes

### Programmatic Usage

```typescript
import {
  applyThemeColors,
  saveThemeColor,
  loadThemeColor,
} from "./utils/themeUtils";

// Apply a new theme color
applyThemeColors("#ff6b6b");

// Save color to localStorage
saveThemeColor("#ff6b6b");

// Load saved color
const savedColor = loadThemeColor();
```

## CSS Custom Properties

The following CSS custom properties are available:

- `--primary-color`: Main theme color
- `--primary-light`: Lighter variant (10% lighter)
- `--primary-dark`: Darker variant (10% darker)
- `--primary-lighter`: Much lighter variant (20% lighter)
- `--primary-darker`: Much darker variant (20% darker)
- `--primary-color-rgb`: RGB values for opacity support

## Browser Support

CSS custom properties are supported in:

- Chrome 49+
- Firefox 31+
- Safari 9.1+
- Edge 15+

For older browsers, fallback colors are provided in the CSS.

## File Structure

```
src/
├── assets/scss/
│   ├── _css-variables.scss      # CSS custom properties definitions
│   ├── _theme-overrides.scss    # Component overrides for dynamic colors
│   └── theme.scss              # Main theme file (imports the above)
├── utils/
│   └── themeUtils.ts           # Theme utility functions
└── pages/setup/
    └── Setup.tsx               # Settings page with color picker
```

## Implementation Details

### Color Generation

The system automatically generates lighter and darker variants of the primary color using JavaScript color manipulation functions.

### Performance

- Color changes are applied instantly using CSS custom properties
- No re-rendering of components required
- Minimal performance impact

### Accessibility

- Color contrast is maintained automatically
- RGB values are provided for opacity support
- Fallback colors ensure compatibility

## Future Enhancements

Potential improvements could include:

- Multiple theme presets
- Dark/light mode variants
- Custom color palettes
- Theme import/export functionality
- Advanced color schemes (analogous, complementary, etc.)
