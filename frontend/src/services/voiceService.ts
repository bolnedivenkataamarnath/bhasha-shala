export const voiceService = {
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
