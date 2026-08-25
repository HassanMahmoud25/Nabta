import type { AgeBand, LocalizedText } from '@/types/common';
export type OfflineActivity = { id: string; skillId: string; ageBands: AgeBand[]; title: LocalizedText; instructions: LocalizedText; minutes: number };
export const offlineActivities: OfflineActivity[] = [
  { id: 'shopping-200', skillId: 'money', ageBands: ['7-9', '10-12'], minutes: 15, title: { en: 'The 200 EGP Shop', ar: 'متجر الـ٢٠٠ جنيه' }, instructions: { en: 'Give your child an imaginary 200 EGP budget and ask them to choose three items, explain trade-offs, and keep a little unspent.', ar: 'امنح طفلك ميزانية خيالية قدرها ٢٠٠ جنيه واطلب منه اختيار ثلاثة أشياء وشرح المفاضلات والاحتفاظ بجزء دون إنفاق.' } },
  { id: 'ready-by-door', skillId: 'responsibility', ageBands: ['4-6', '7-9'], minutes: 10, title: { en: 'Ready by the Door', ar: 'جاهز بجوار الباب' }, instructions: { en: 'Choose one item needed tomorrow and make a simple evening plan to remember it.', ar: 'اختارا شيئًا مطلوبًا غدًا وضَعا خطة مسائية بسيطة لتذكره.' } },
  { id: 'link-detective', skillId: 'internet-safety', ageBands: ['7-9', '10-12'], minutes: 10, title: { en: 'Link Detective', ar: 'محقق الروابط' }, instructions: { en: 'Look at three pretend messages and discuss which clues suggest pressure, impersonation, or unsafe links.', ar: 'راجعوا ثلاث رسائل وهمية وناقشوا العلامات التي تدل على الضغط أو انتحال الهوية أو الروابط غير الآمنة.' } },
];

