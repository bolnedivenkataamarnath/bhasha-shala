export interface TranslationOptions {
  text: string;
  sourceLang: 'en' | 'hi';
  targetLang: 'sat';
}

export const translationService = {
  async translateContent(options: TranslationOptions): Promise<string> {
    const { text, sourceLang } = options;
    if (!text.trim()) return '';

    try {
      const res = await fetch('http://127.0.0.1:8000/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          source_lang: sourceLang,
          target_lang: 'sat',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.translated_text) {
          return data.translated_text;
        }
      }
    } catch (error) {
      console.log('FastAPI backend offline or CORS blocked — using Bhasha Shala offline mock service.', error);
    }

    // Guaranteed offline mock fallback service abstraction for Santhali (Ol Chiki)
    const label = sourceLang === 'hi' ? 'हिंदी → संताली' : 'English → Santhali';
    return `[${label} AI Mock]: ᱥᱟᱱᱛᱟᱲᱤ ᱛᱚᱨᱡᱚᱢᱟ: ${text}`;
  },
};
