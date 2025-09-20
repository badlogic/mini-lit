import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import "@mariozechner/mini-lit/dist/PreviewCode.js";
import "@mariozechner/mini-lit/dist/LanguageSelector.js";
import {
   Badge,
   Button,
   Card,
   CardContent,
   CardHeader,
   CardTitle,
   defaultEnglish,
   defaultGerman,
   getCurrentLanguage,
   i18n,
   type LanguageCode,
   type MiniLitRequiredMessages,
   Separator,
   setTranslations,
} from "@mariozechner/mini-lit";

// Extend the i18n interface for this demo
declare module "@mariozechner/mini-lit" {
   interface i18nMessages extends MiniLitRequiredMessages {
      // Demo-specific messages
      Welcome: string;
      Dashboard: string;
      Settings: string;
      Profile: string;
      Logout: string;
      "Save Changes": string;
      Cancel: string;
      "Delete Account": string;
      "Are you sure?": string;
      Yes: string;
      No: string;
      Search: string;
      Filter: string;
      "Sort by": string;
      Name: string;
      Date: string;
      Status: string;
      Active: string;
      Inactive: string;
      Pending: string;
      "User Settings": string;
      "Notification Preferences": string;
      "Email Notifications": string;
      "Push Notifications": string;
      Language: string;
      Theme: string;
      "Dark Mode": string;
      "Light Mode": string;
      System: string;
   }
}

// Demo translations
const demoTranslations = {
   en: {
      // Required mini-lit messages
      ...defaultEnglish,

      // Demo-specific messages
      Welcome: "Welcome",
      Dashboard: "Dashboard",
      Settings: "Settings",
      Profile: "Profile",
      Logout: "Logout",
      "Save Changes": "Save Changes",
      Cancel: "Cancel",
      "Delete Account": "Delete Account",
      "Are you sure?": "Are you sure?",
      Yes: "Yes",
      No: "No",
      Search: "Search",
      Filter: "Filter",
      "Sort by": "Sort by",
      Name: "Name",
      Date: "Date",
      Status: "Status",
      Active: "Active",
      Inactive: "Inactive",
      Pending: "Pending",
      "User Settings": "User Settings",
      "Notification Preferences": "Notification Preferences",
      "Email Notifications": "Email Notifications",
      "Push Notifications": "Push Notifications",
      Language: "Language",
      Theme: "Theme",
      "Dark Mode": "Dark Mode",
      "Light Mode": "Light Mode",
      System: "System",
   },
   de: {
      // Required mini-lit messages
      ...defaultGerman,

      // Demo-specific messages
      Welcome: "Willkommen",
      Dashboard: "Dashboard",
      Settings: "Einstellungen",
      Profile: "Profil",
      Logout: "Abmelden",
      "Save Changes": "Änderungen speichern",
      Cancel: "Abbrechen",
      "Delete Account": "Konto löschen",
      "Are you sure?": "Sind Sie sicher?",
      Yes: "Ja",
      No: "Nein",
      Search: "Suchen",
      Filter: "Filter",
      "Sort by": "Sortieren nach",
      Name: "Name",
      Date: "Datum",
      Status: "Status",
      Active: "Aktiv",
      Inactive: "Inaktiv",
      Pending: "Ausstehend",
      "User Settings": "Benutzereinstellungen",
      "Notification Preferences": "Benachrichtigungseinstellungen",
      "Email Notifications": "E-Mail-Benachrichtigungen",
      "Push Notifications": "Push-Benachrichtigungen",
      Language: "Sprache",
      Theme: "Thema",
      "Dark Mode": "Dunkler Modus",
      "Light Mode": "Heller Modus",
      System: "System",
   },
};

// Set the translations for this demo
setTranslations(demoTranslations);

@customElement("page-languageselector")
export class LanguageSelectorPage extends LitElement {
   @state() currentLanguage: LanguageCode = getCurrentLanguage();

   createRenderRoot() {
      return this;
   }

   connectedCallback() {
      super.connectedCallback();
      // Listen for language changes (page reload will happen)
      window.addEventListener("language-changed", () => {
         this.currentLanguage = getCurrentLanguage();
         this.requestUpdate();
      });
   }

   render() {
      return html`
         <div class="p-8 max-w-6xl mx-auto">
            <div class="mb-8">
               <h1 class="text-3xl font-bold mb-4">i18n & Language Selector</h1>
               <p class="text-muted-foreground">
                  Internationalization system with language selector component and TypeScript support.
               </p>
            </div>

            <!-- Basic i18n Demo -->
            <section class="mb-8">
               <h2 class="text-2xl font-semibold mb-4">Basic i18n Demo</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-4">
                        <div class="flex items-center gap-4 mb-4">
                           <span class="text-sm font-medium">${i18n("Language")}:</span>
                           <language-selector></language-selector>
                           ${Badge({
                              children: this.currentLanguage.toUpperCase(),
                              variant: "secondary",
                           })}
                        </div>

                        <div class="p-4 bg-muted/50 rounded-md space-y-2">
                           <h3 class="font-semibold text-lg">${i18n("Welcome")}</h3>
                           <div class="flex gap-2">
                              ${Button({
                                 variant: "default",
                                 size: "sm",
                                 children: i18n("Dashboard"),
                              })}
                              ${Button({
                                 variant: "outline",
                                 size: "sm",
                                 children: i18n("Settings"),
                              })}
                              ${Button({
                                 variant: "outline",
                                 size: "sm",
                                 children: i18n("Profile"),
                              })}
                           </div>
                        </div>
                     </div>
                  `}
                  code=${`// Register custom translations
const translations = {
  en: {
    // Required mini-lit messages
    "Copy": "Copy",
    "Copied!": "Copied!",
    // ... other required messages

    // Your app messages
    "Welcome": "Welcome",
    "Dashboard": "Dashboard",
    "Settings": "Settings",
    "Profile": "Profile"
  },
  de: {
    // Required mini-lit messages
    "Copy": "Kopieren",
    "Copied!": "Kopiert!",
    // ... other required messages

    // Your app messages
    "Welcome": "Willkommen",
    "Dashboard": "Dashboard",
    "Settings": "Einstellungen",
    "Profile": "Profil"
  }
};

setTranslations(translations);

// Use in template
<language-selector></language-selector>
<h3>\${i18n("Welcome")}</h3>
\${Button({ children: i18n("Dashboard") })}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Navigation Example -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Navigation with i18n</h2>

               <preview-code
                  .preview=${html`
                     <nav class="p-3 bg-muted/50 rounded-md flex items-center justify-between">
                        <div class="flex items-center gap-6">
                           <span class="font-semibold">MyApp</span>
                           <div class="flex gap-4">
                              ${Button({
                                 variant: "ghost",
                                 size: "sm",
                                 children: i18n("Dashboard"),
                              })}
                              ${Button({
                                 variant: "ghost",
                                 size: "sm",
                                 children: i18n("Settings"),
                              })}
                              ${Button({
                                 variant: "ghost",
                                 size: "sm",
                                 children: i18n("Profile"),
                              })}
                           </div>
                        </div>
                        <div class="flex items-center gap-2">
                           <language-selector></language-selector>
                           ${Button({
                              variant: "outline",
                              size: "sm",
                              children: i18n("Logout"),
                           })}
                        </div>
                     </nav>
                  `}
                  code=${`// Navigation bar with i18n
<nav class="navbar">
  <div class="nav-items">
    \${Button({ children: i18n("Dashboard") })}
    \${Button({ children: i18n("Settings") })}
    \${Button({ children: i18n("Profile") })}
  </div>
  <div class="nav-actions">
    <language-selector></language-selector>
    \${Button({ children: i18n("Logout") })}
  </div>
</nav>`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Settings Panel -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Settings Panel with i18n</h2>

               <preview-code
                  .preview=${html`
                     ${Card({
                        children: html`
                           ${CardHeader({
                              children: CardTitle({
                                 children: i18n("User Settings"),
                              }),
                           })}
                           ${CardContent({
                              children: html`
                                 <div class="space-y-4">
                                    <div class="space-y-2">
                                       <label class="text-sm font-medium">${i18n("Language")}</label>
                                       <div class="flex items-center gap-2">
                                          <language-selector></language-selector>
                                          <span class="text-sm text-muted-foreground">
                                             ${i18n("Select an option")}
                                          </span>
                                       </div>
                                    </div>

                                    <div class="space-y-2">
                                       <label class="text-sm font-medium">${i18n("Theme")}</label>
                                       <div class="flex gap-2">
                                          ${Button({
                                             variant: "outline",
                                             size: "sm",
                                             children: i18n("Light Mode"),
                                          })}
                                          ${Button({
                                             variant: "outline",
                                             size: "sm",
                                             children: i18n("Dark Mode"),
                                          })}
                                          ${Button({
                                             variant: "outline",
                                             size: "sm",
                                             children: i18n("System"),
                                          })}
                                       </div>
                                    </div>

                                    <div class="space-y-2">
                                       <label class="text-sm font-medium">${i18n("Notification Preferences")}</label>
                                       <div class="space-y-1">
                                          <div class="text-sm">${i18n("Email Notifications")}</div>
                                          <div class="text-sm">${i18n("Push Notifications")}</div>
                                       </div>
                                    </div>

                                    <div class="flex gap-2 pt-4">
                                       ${Button({
                                          variant: "default",
                                          children: i18n("Save Changes"),
                                       })}
                                       ${Button({
                                          variant: "outline",
                                          children: i18n("Cancel"),
                                       })}
                                    </div>
                                 </div>
                              `,
                           })}
                        `,
                     })}
                  `}
                  code=${`// Settings panel with i18n
\${Card({
  children: html\`
    \${CardHeader({
      children: CardTitle({ children: i18n("User Settings") })
    })}
    \${CardContent({
      children: html\`
        <label>\${i18n("Language")}</label>
        <language-selector></language-selector>

        <label>\${i18n("Theme")}</label>
        \${Button({ children: i18n("Light Mode") })}
        \${Button({ children: i18n("Dark Mode") })}

        \${Button({ children: i18n("Save Changes") })}
        \${Button({ children: i18n("Cancel") })}
      \`
    })}
  \`
})}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- Status Messages -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">Status Messages</h2>

               <preview-code
                  .preview=${html`
                     <div class="space-y-3">
                        <div class="flex items-center gap-2">
                           <span class="text-sm">${i18n("Status")}:</span>
                           ${Badge({
                              variant: "default",
                              children: i18n("Active"),
                           })}
                           ${Badge({
                              variant: "secondary",
                              children: i18n("Inactive"),
                           })}
                           ${Badge({
                              variant: "outline",
                              children: i18n("Pending"),
                           })}
                        </div>

                        <div class="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                           <p class="text-sm font-medium">${i18n("Are you sure?")}</p>
                           <div class="flex gap-2 mt-2">
                              ${Button({
                                 variant: "destructive",
                                 size: "sm",
                                 children: i18n("Yes"),
                              })}
                              ${Button({
                                 variant: "outline",
                                 size: "sm",
                                 children: i18n("No"),
                              })}
                           </div>
                        </div>

                        <div class="flex gap-2">
                           ${Button({
                              variant: "outline",
                              size: "sm",
                              children: i18n("Search"),
                           })}
                           ${Button({
                              variant: "outline",
                              size: "sm",
                              children: i18n("Filter"),
                           })}
                           ${Button({
                              variant: "outline",
                              size: "sm",
                              children: `${i18n("Sort by")}: ${i18n("Date")}`,
                           })}
                        </div>
                     </div>
                  `}
                  code=${`// Status badges with i18n
\${Badge({ children: i18n("Active") })}
\${Badge({ children: i18n("Inactive") })}
\${Badge({ children: i18n("Pending") })}

// Confirmation dialog
<p>\${i18n("Are you sure?")}</p>
\${Button({ children: i18n("Yes") })}
\${Button({ children: i18n("No") })}

// Action buttons
\${Button({ children: i18n("Search") })}
\${Button({ children: i18n("Filter") })}
\${Button({ children: \`\${i18n("Sort by")}: \${i18n("Date")}\` })}`}
               ></preview-code>
            </section>

            ${Separator()}

            <!-- How to i18n your app -->
            <section class="my-8">
               <h2 class="text-2xl font-semibold mb-4">How to i18n Your App</h2>

               <div class="space-y-4">
                  <p class="text-sm text-muted-foreground">
                     1. Define your i18n interface for TypeScript autocomplete:
                  </p>
                  <code-block
                     .code=${`declare module "@mariozechner/mini-lit" {
  interface i18nMessages extends MiniLitRequiredMessages {
    "Welcome": string;
    "Settings": string;
    "cartItems": (count: number) => string;
    "greeting": (name: string, time: string) => string;
  }
}`}
                     language="typescript"
                  ></code-block>

                  <p class="text-sm text-muted-foreground">2. Define translations:</p>
                  <code-block
                     .code=${`import { setTranslations, defaultEnglish, defaultGerman } from "@mariozechner/mini-lit";

const translations = {
  en: {
    ...defaultEnglish,
    "Welcome": "Welcome",
    "Settings": "Settings",
    "cartItems": (count: number) =>
      count === 0 ? "Your cart is empty" :
      count === 1 ? "1 item in your cart" :
      \`\${count} items in your cart\`,
    "greeting": (name: string, time: string) =>
      \`Good \${time}, \${name}!\`
  },
  de: {
    ...defaultGerman,
    "Welcome": "Willkommen",
    "Settings": "Einstellungen",
    "cartItems": (count: number) =>
      count === 0 ? "Ihr Warenkorb ist leer" :
      count === 1 ? "1 Artikel im Warenkorb" :
      \`\${count} Artikel im Warenkorb\`,
    "greeting": (name: string, time: string) =>
      \`Guten \${time}, \${name}!\`
  }
};

setTranslations(translations);`}
                     language="typescript"
                  ></code-block>

                  <p class="text-sm text-muted-foreground">3. Use in your app with autocomplete:</p>
                  <code-block
                     .code=${`import { i18n, getCurrentLanguage, setLanguage } from "@mariozechner/mini-lit";

// Simple strings
\${i18n("Welcome")}

// Functions with parameters
\${i18n("cartItems")(3)}  // "3 items in your cart"
\${i18n("greeting")("Alice", "morning")}  // "Good morning, Alice!"

// Language management
getCurrentLanguage()  // "en" or "de"
setLanguage("de")     // switches to German, reloads page

// Add language selector to UI
<language-selector></language-selector>`}
                     language="typescript"
                  ></code-block>
               </div>
            </section>
         </div>
      `;
   }
}
