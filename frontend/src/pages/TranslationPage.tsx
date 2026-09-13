import { useState } from 'react';

const LANGUAGES = [
  'English',
  'Telugu',
  'Hindi',
  'Santali',
  'Tamil',
  'Kannada',
  'Malayalam',
  'Bengali',
  'Marathi',
  'Odia',
  'Assamese',
];

const LANGUAGE_CODES: Record<string, string> = {
  English: 'en',
  Telugu: 'te',
  Hindi: 'hi',
  Santali: 'sat',
  Tamil: 'ta',
  Kannada: 'kn',
  Malayalam: 'ml',
  Bengali: 'bn',
  Marathi: 'mr',
  Odia: 'or',
  Assamese: 'as',
};

export default function TranslationPage() {
  const [sourceText, setSourceText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('English');

  const [targetLanguages, setTargetLanguages] = useState<string[]>([
    'Santali',
  ]);

  const [translatedTexts, setTranslatedTexts] = useState<
    Record<string, string>
  >({});

  const [isTranslating, setIsTranslating] = useState(false);

  const toggleTargetLanguage = (language: string) => {
    setTargetLanguages((current) => {
      if (current.includes(language)) {
        return current.filter((item) => item !== language);
      }

      return [...current, language];
    });
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setTranslatedTexts({
        Error: 'Please enter some text first.',
      });
      return;
    }

    if (targetLanguages.length === 0) {
      setTranslatedTexts({
        Error: 'Please select at least one target language.',
      });
      return;
    }

    setIsTranslating(true);
    setTranslatedTexts({});

    try {
      const response = await fetch('http://127.0.0.1:8000/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
          source_language: LANGUAGE_CODES[sourceLanguage],
          target_languages: targetLanguages.map(
            (language) => LANGUAGE_CODES[language]
          ),
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error('Translation request failed');
      }

      const data = await response.json();

      console.log('Translation response:', data);

      const translated: Record<string, string> = {};

      targetLanguages.forEach((language) => {
        const code = LANGUAGE_CODES[language];

        translated[language] = data.translations?.[code] || '';
      });

      setTranslatedTexts(translated);
    } catch (error) {
      console.error('Translation error:', error);

      setTranslatedTexts({
        Error:
          'Could not connect to the Bhasha Shala backend. Make sure the backend is running.',
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedTexts({});
  };

  return (
    <div>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          AI Translation
        </h1>

        <p className="mt-2 text-slate-600">
          Translate educational content into multiple Indian languages.
        </p>
      </div>

      {/* Language Selection */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Source Language */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Source Language
            </label>

            <select
              value={sourceLanguage}
              onChange={(e) => {
                const newSourceLanguage = e.target.value;

                setSourceLanguage(newSourceLanguage);

                // Remove source language from selected targets
                setTargetLanguages((current) =>
                  current.filter(
                    (language) => language !== newSourceLanguage
                  )
                );
              }}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {LANGUAGES.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          {/* Target Languages */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Target Languages
            </label>

            <div className="border border-slate-200 rounded-xl p-3 max-h-44 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {LANGUAGES
                  .filter((language) => language !== sourceLanguage)
                  .map((language) => (
                    <label
                      key={language}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                        targetLanguages.includes(language)
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={targetLanguages.includes(language)}
                        onChange={() => toggleTargetLanguage(language)}
                        className="w-4 h-4 accent-indigo-600"
                      />

                      <span className="text-sm">
                        {language}
                      </span>
                    </label>
                  ))}
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              {targetLanguages.length} language
              {targetLanguages.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        </div>
      </div>

      {/* Translation Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* Source */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900">
            {sourceLanguage} Content
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Enter a lesson sentence or educational content.
          </p>

          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Example: The sun gives us light."
            className="w-full h-48 mt-4 p-4 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTranslating
                ? 'Translating...'
                : 'Translate with AI'}
            </button>

            <button
              onClick={handleClear}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Translations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Translations
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            AI-generated translations for the selected languages.
          </p>

          <div className="space-y-4 mt-4">
            {targetLanguages.length === 0 ? (
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-slate-400">
                  Select at least one target language.
                </p>
              </div>
            ) : (
              targetLanguages.map((language) => (
                <div
                  key={language}
                  className="p-5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <h3 className="font-bold text-slate-800 mb-2">
                    {language}
                  </h3>

                  {translatedTexts[language] ? (
                    <p className="text-slate-800 text-lg leading-relaxed">
                      {translatedTexts[language]}
                    </p>
                  ) : (
                    <p className="text-slate-400">
                      Translation will appear here.
                    </p>
                  )}
                </div>
              ))
            )}

            {translatedTexts.Error && (
              <div className="p-5 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600">
                  {translatedTexts.Error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}