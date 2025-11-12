// Core mini system

// Export component system types and utilities
export {
   type ComponentDefinition,
   ComponentLitBase,
   type ComponentStyles,
   createComponent,
   defineComponent,
   type ExtractProps,
   type ExtractPropsForClass,
   type ExtractRegularProps,
   type ExtractStyles,
   type ExtractVariants,
   getDefaultProps,
   getDefaultVariants,
   type PropDef,
   type RenderFunction,
   renderComponent,
   type SimpleStyles,
   type SlotStyles,
   styleComponent,
   type VariantDef,
} from "./component.js";
// i18n system
export {
   defaultEnglish,
   defaultGerman,
   getCurrentLanguage,
   getTranslations,
   i18n,
   type i18nMessages,
   type LanguageCode,
   type MiniLitRequiredMessages,
   setLanguage,
   setTranslations,
} from "./i18n.js";
// Icons
export * from "./icons.js";
