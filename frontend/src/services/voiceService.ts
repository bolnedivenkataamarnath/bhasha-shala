export const voiceService = {
  isVoiceEnabled(): boolean {
    if (typeof localStorage === 'undefined') return true;
    return localStorage.getItem('bhasha-shala-voice-on') !== 'false';
  },

  applySpeechSpeed(utterance: SpeechSynthesisUtterance): void {
    if (typeof localStorage === 'undefined') return;
    const speed = localStorage.getItem('bhasha-shala-speech-speed') || 'Normal';
    if (speed === 'Slow') {
      utterance.rate = 0.75;
    } else if (speed === 'Fast') {
      utterance.rate = 1.25;
    } else {
      utterance.rate = 1.0;
    }
  },

  getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve([]);
        return;
      }
      let voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
        return;
      }
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
      setTimeout(() => {
        resolve(window.speechSynthesis.getVoices());
      }, 350);
    });
  },

  async getBestVoiceForLanguage(lang: string): Promise<SpeechSynthesisVoice | null> {
    const voices = await this.getVoices();
    const lowerLang = lang.toLowerCase();

    // 1. Exact match
    let match = voices.find((v) => v.lang.toLowerCase() === lowerLang);
    if (match) return match;

    // 2. Prefix match
    match = voices.find((v) => v.lang.toLowerCase().startsWith(lowerLang));
    if (match) return match;

    // 3. Keyword/name match for Santhali
    if (lowerLang === 'sat' || lowerLang.startsWith('sat')) {
      match = voices.find(
        (v) =>
          v.lang.toLowerCase().includes('sat') ||
          v.name.toLowerCase().includes('santhali') ||
          v.name.toLowerCase().includes('santali')
      );
      if (match) return match;
    }

    return null;
  },
};
