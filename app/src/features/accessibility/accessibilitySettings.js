const STORAGE_KEY_PREFIX = "quickstop:settings:user:";

export const DEFAULT_ACCESSIBILITY_SETTINGS = {
  textScale: "normal",
  buttonSize: "normal",
  lineSpacing: "normal",
  highContrast: false,
  reducedMotion: false,
  darkMode: false,
  dyslexiaFont: false,
};

export const getStorageKeyForUser = (userId) =>
  userId ? `${STORAGE_KEY_PREFIX}${userId}` : null;

export const getStoredSettingsForUser = (userId) => {
  if (typeof window === "undefined") {
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  }

  const storageKey = getStorageKeyForUser(userId);
  if (!storageKey) {
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  }

  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  }

  try {
    const parsed = JSON.parse(raw);
    const normalized = parsed?.accessibility ?? parsed;
    return { ...DEFAULT_ACCESSIBILITY_SETTINGS, ...normalized };
  } catch (error) {
    console.error("Error leyendo la configuración local:", error);
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  }
};

export const applyAccessibilityPreferences = (
  settings = DEFAULT_ACCESSIBILITY_SETTINGS,
) => {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;

  root.classList.toggle("qs-high-contrast", !!settings.highContrast);
  root.classList.toggle("qs-reduced-motion", !!settings.reducedMotion);
  root.classList.toggle("qs-dark-mode", !!settings.darkMode);
  root.classList.toggle("qs-dyslexia", !!settings.dyslexiaFont);

  root.classList.remove("qs-text-normal", "qs-text-large", "qs-text-xlarge");
  if (settings.textScale === "large") {
    root.classList.add("qs-text-large");
  } else if (settings.textScale === "xlarge") {
    root.classList.add("qs-text-xlarge");
  } else {
    root.classList.add("qs-text-normal");
  }

  root.classList.remove(
    "qs-buttons-normal",
    "qs-buttons-large",
    "qs-buttons-xlarge",
  );
  if (settings.buttonSize === "large") {
    root.classList.add("qs-buttons-large");
  } else if (settings.buttonSize === "xlarge") {
    root.classList.add("qs-buttons-xlarge");
  } else {
    root.classList.add("qs-buttons-normal");
  }

  root.classList.remove("qs-line-spacing-normal", "qs-line-spacing-relaxed");
  if (settings.lineSpacing === "relaxed") {
    root.classList.add("qs-line-spacing-relaxed");
  } else {
    root.classList.add("qs-line-spacing-normal");
  }
};

export const clearAccessibilityPreferences = () => {
  applyAccessibilityPreferences(DEFAULT_ACCESSIBILITY_SETTINGS);
};
