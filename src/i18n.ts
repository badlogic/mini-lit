/**
 * Flexible i18n system for mini-lit
 *
 * Users can extend this with their own messages while ensuring
 * mini-lit's required messages are included.
 */

export type LanguageCode = "en" | "de" | string;

// Required messages for mini-lit components
export interface MiniLitRequiredMessages {
   "*": string;
   Copy: string;
   "Copy code": string;
   "Copied!": string;
   Download: string;
   Close: string;
   Preview: string;
   Code: string;
   "Loading...": string;
   "Select an option": string;
   "Mode 1": string;
   "Mode 2": string;
   Required: string;
   Optional: string;
   "Input Required": string;
   Cancel: string;
   Confirm: string;
}

// Users must extend this interface with their own messages
export interface i18nMessages extends MiniLitRequiredMessages {
   // User's app messages go here via declaration merging
}

// Default minimal translations for mini-lit components
export const defaultEnglish: MiniLitRequiredMessages = {
   "*": "*",
   Copy: "Copy",
   "Copy code": "Copy code",
   "Copied!": "Copied!",
   Download: "Download",
   Close: "Close",
   Preview: "Preview",
   Code: "Code",
   "Loading...": "Loading...",
   "Select an option": "Select an option",
   "Mode 1": "Mode 1",
   "Mode 2": "Mode 2",
   Required: "Required",
   Optional: "Optional",
   "Input Required": "Input Required",
   Cancel: "Cancel",
   Confirm: "Confirm",
};

export const defaultGerman: MiniLitRequiredMessages = {
   "*": "*",
   Copy: "Kopieren",
   "Copy code": "Code kopieren",
   "Copied!": "Kopiert!",
   Download: "Herunterladen",
   Close: "Schließen",
   Preview: "Vorschau",
   Code: "Code",
   "Loading...": "Laden...",
   "Select an option": "Option auswählen",
   "Mode 1": "Modus 1",
   "Mode 2": "Modus 2",
   Required: "Erforderlich",
   Optional: "Optional",
   "Input Required": "Eingabe erforderlich",
   Cancel: "Abbrechen",
   Confirm: "Bestätigen",
};

// Store for user-provided translations
let userTranslations: Record<string, i18nMessages> | null = null;

// Default translations (can be overridden)
let translations: Record<string, i18nMessages> = {
   en: defaultEnglish as i18nMessages,
   de: defaultGerman as i18nMessages,
};

/**
 * Set custom translations for your app
 *
 * @example
 * import { setTranslations } from '@mariozechner/mini-lit';
 *
 * // Your messages must include all MiniLitRequiredMessages
 * const myTranslations = {
 *   en: {
 *     // Required mini-lit messages
 *     "Copy": "Copy",
 *     "Copied!": "Copied!",
 *     // ... all other required messages
 *
 *     // Your app messages
 *     "Welcome": "Welcome",
 *     "Settings": "Settings",
 *   },
 *   de: {
 *     // Required mini-lit messages
 *     "Copy": "Kopieren",
 *     "Copied!": "Kopiert!",
 *     // ... all other required messages
 *
 *     // Your app messages
 *     "Welcome": "Willkommen",
 *     "Settings": "Einstellungen",
 *   }
 * };
 *
 * setTranslations(myTranslations);
 */
export function setTranslations(customTranslations: Record<string, i18nMessages>) {
   userTranslations = customTranslations;
   translations = customTranslations;
}

/**
 * Get current translations
 */
export function getTranslations(): Record<string, i18nMessages> {
   return translations;
}

// Language management
export function getCurrentLanguage(): LanguageCode {
   // Check localStorage first
   const stored = localStorage.getItem("language") as LanguageCode;
   if (stored && translations[stored]) {
      return stored;
   }

   // Fall back to browser language
   const userLocale = navigator.language || (navigator as any).userLanguage;
   const languageCode = userLocale ? (userLocale.split("-")[0] as LanguageCode) : "en";
   return translations[languageCode] ? languageCode : "en";
}

export function setLanguage(code: LanguageCode) {
   // Store in localStorage for persistence
   localStorage.setItem("language", code);
   // Reload page to apply new language
   window.location.reload();
}

// Super simple i18n function - just returns the value!
export function i18n<T extends keyof i18nMessages>(key: T): i18nMessages[T];
export function i18n<TCategory extends keyof i18nMessages, TKey extends keyof i18nMessages[TCategory]>(
   category: TCategory,
   key: TKey,
): i18nMessages[TCategory][TKey];
export function i18n(categoryOrKey: any, key?: any): any {
   const languageCode = getCurrentLanguage();
   const implementation = translations[languageCode] || translations.en;

   if (key === undefined) {
      // Flat access
      const value = (implementation as any)[categoryOrKey];
      if (!value) {
         // For functions that return strings, we need to handle them
         if (typeof value === "function") {
            return value;
         }
         console.error(`Unknown i18n key: ${categoryOrKey}`);
         return categoryOrKey;
      }
      return value;
   } else {
      // Nested access
      const category = (implementation as any)[categoryOrKey];
      if (!category || typeof category !== "object") {
         console.error(`Unknown i18n category: ${categoryOrKey}`);
         return key;
      }
      const value = (category as any)[key];
      if (!value) {
         console.error(`Unknown i18n key: ${categoryOrKey}.${key}`);
         return key;
      }
      return value;
   }
}

// Export default for convenience
export default i18n;
