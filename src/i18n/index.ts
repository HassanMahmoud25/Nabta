import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
import { resources } from './resources';

const i18n = createInstance();

export const supportedLanguages = ['en', 'ar'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

void i18n.use(initReactI18next).init({
  resources, lng: 'en', fallbackLng: 'en', interpolation: { escapeValue: false }, compatibilityJSON: 'v4',
});

export async function setAppLanguage(language: SupportedLanguage) {
  const shouldBeRtl = language === 'ar';
  if (I18nManager.isRTL !== shouldBeRtl) I18nManager.forceRTL(shouldBeRtl);
  await i18n.changeLanguage(language);
}

export function localizedDirection(language = i18n.resolvedLanguage) {
  return language === 'ar' ? ('rtl' as const) : ('ltr' as const);
}

export default i18n;
