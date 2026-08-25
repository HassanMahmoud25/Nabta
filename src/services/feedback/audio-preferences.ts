import { storage } from '@/services/storage/local-storage';

export type AudioPreferences = { soundEffectsEnabled: boolean };
const key = 'nash2.audio-preferences';
const defaults: AudioPreferences = { soundEffectsEnabled: false };

export const audioPreferences = {
  get(): AudioPreferences { return { ...defaults, ...storage.get<Partial<AudioPreferences>>(key) }; },
  set(next: AudioPreferences) { storage.set(key, next); },
};
