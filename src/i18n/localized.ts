import i18n from './index'; import type { LocalizedText } from '@/types/common';
export function localize(text: LocalizedText) { return i18n.resolvedLanguage === 'ar' ? text.ar : text.en; }

