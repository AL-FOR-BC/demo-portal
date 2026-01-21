// Theme utility functions for dynamic color changes

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryLighter: string;
  primaryDarker: string;
}

// Function to convert hex color to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 85, g: 110, b: 230 }; // Default fallback
}

// Function to lighten a hex color
function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  const factor = 1 + percent / 100;

  const r = Math.min(255, Math.round(rgb.r * factor));
  const g = Math.min(255, Math.round(rgb.g * factor));
  const b = Math.min(255, Math.round(rgb.b * factor));

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Function to darken a hex color
function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  const factor = 1 - percent / 100;

  const r = Math.max(0, Math.round(rgb.r * factor));
  const g = Math.max(0, Math.round(rgb.g * factor));
  const b = Math.max(0, Math.round(rgb.b * factor));

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Function to generate theme colors from a primary color
export function generateThemeColors(primaryColor: string): ThemeColors {
  return {
    primary: primaryColor,
    primaryLight: lightenColor(primaryColor, 10),
    primaryDark: darkenColor(primaryColor, 10),
    primaryLighter: lightenColor(primaryColor, 20),
    primaryDarker: darkenColor(primaryColor, 20),
  };
}

// Function to apply theme colors to CSS custom properties
export function applyThemeColors(primaryColor: string): void {
  const colors = generateThemeColors(primaryColor);
  const root = document.documentElement;

  // Apply CSS custom properties
  root.style.setProperty("--primary-color", colors.primary);
  root.style.setProperty("--primary-light", colors.primaryLight);
  root.style.setProperty("--primary-dark", colors.primaryDark);
  root.style.setProperty("--primary-lighter", colors.primaryLighter);
  root.style.setProperty("--primary-darker", colors.primaryDarker);

  // Also set RGB values for opacity support
  const rgb = hexToRgb(colors.primary);
  root.style.setProperty("--primary-color-rgb", `${rgb.r}, ${rgb.g}, ${rgb.b}`);
}

// Function to get current theme colors
export function getCurrentThemeColors(): ThemeColors {
  const root = document.documentElement;
  return {
    primary:
      getComputedStyle(root).getPropertyValue("--primary-color").trim() ||
      "#094BAC",
    primaryLight:
      getComputedStyle(root).getPropertyValue("--primary-light").trim() ||
      "#1a5bb8",
    primaryDark:
      getComputedStyle(root).getPropertyValue("--primary-dark").trim() ||
      "#073a8a",
    primaryLighter:
      getComputedStyle(root).getPropertyValue("--primary-lighter").trim() ||
      "#2b6bc4",
    primaryDarker:
      getComputedStyle(root).getPropertyValue("--primary-darker").trim() ||
      "#052f68",
  };
}

// Function to save theme color to localStorage
export function saveThemeColor(color: string): void {
  localStorage.setItem("theme-primary-color", color);
}

// Function to load theme color from localStorage
export function loadThemeColor(): string {
  return localStorage.getItem("theme-primary-color") || "#094BAC";
}

// Function to initialize theme on app startup
export function initializeTheme(): void {
  const savedColor = loadThemeColor();
  applyThemeColors(savedColor);
}

// Function to update favicon dynamically
export function updateFavicon(faviconData: string | null): void {
  const existingLinks = document.querySelectorAll(
    'link[rel="icon"], link[rel="shortcut icon"]'
  );
  existingLinks.forEach((link) => link.remove());

  if (faviconData) {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = faviconData.startsWith("data:image")
      ? faviconData.split(";")[0].split(":")[1]
      : "image/x-icon";
    link.href = faviconData;
    document.head.appendChild(link);
    localStorage.setItem("favicon", faviconData);
  } else {
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/x-icon";
    link.href = "/favicon.ico";
    document.head.appendChild(link);
    localStorage.removeItem("favicon");
  }
}

export function loadFavicon(): string | null {
  return localStorage.getItem("favicon");
}

export function initializeFavicon(faviconData?: string | null): void {
  const favicon = faviconData || loadFavicon();
  if (favicon) {
    updateFavicon(favicon);
  }
}
