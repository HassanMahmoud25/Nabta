import { audioPreferences } from './audio-preferences';

export type SoundCue = 'tap' | 'mission-success' | 'badge-unlock' | 'level-up' | 'skill-complete';
const celebrationSource = require('../../../assets/audio/mission-complete.wav');
let lastPlayedAt = 0;
let audioModulePromise: Promise<typeof import('expo-audio')> | null = null;

function loadAudioModule() {
  audioModulePromise ??= import('expo-audio').catch((error) => {
    audioModulePromise = null;
    throw error;
  });
  return audioModulePromise;
}

async function playCelebration() {
  const { createAudioPlayer } = await loadAudioModule();
  const player = createAudioPlayer(celebrationSource);
  player.volume = .48;
  player.play();
  setTimeout(() => player.remove(), 2200);
}

export const soundFeedback = {
  setEnabled(value: boolean) { audioPreferences.set({ soundEffectsEnabled: value }); },
  isEnabled() { return audioPreferences.get().soundEffectsEnabled; },
  async play(cue: SoundCue) {
    if (!this.isEnabled() || cue === 'tap') return;
    const now = Date.now();
    if (now - lastPlayedAt < 1500) return;
    lastPlayedAt = now;
    try {
      const { setAudioModeAsync } = await loadAudioModule();
      await setAudioModeAsync({ playsInSilentMode: false, interruptionMode: 'mixWithOthers' });
      await playCelebration();
    } catch {
      // Native clients built before expo-audio was added should keep running silently.
    }
  },
};

export const celebrationAudio = { playMissionComplete: () => soundFeedback.play('mission-success'), playBadgeUnlocked: () => soundFeedback.play('badge-unlock'), playLevelUp: () => soundFeedback.play('level-up'), playSkillComplete: () => soundFeedback.play('skill-complete') };
