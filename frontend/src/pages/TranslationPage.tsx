import { useState } from 'react';

export default function TranslationPage() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setTranslatedText('Please enter some text first.');
      return;
    }

    setIsTranslating(true);
    setTranslatedText('');

    try {
      const response = await fetch('http://127.0.0.1:8000/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sourceText,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation request failed');
      }

      const data = await response.json();

      setTranslatedText(data.translated_text);
    } catch (error) {
      console.error(error);
      setTranslatedText(
        'Could not connect to the Bhasha Shala backend.'
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const handleClear = () => {
    setSourceText('');
    setTranslatedText('');
  };

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          AI Translation
        </h1>

        <p className="mt-2 text-slate-600">
          Translate educational content into the student's mother tongue.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        {/* Source */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900">
            English Content
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
              {isTranslating ? 'Translating...' : 'Translate with AI'}
            </button>

            <button
              onClick={handleClear}
              className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Translation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Santali Translation
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            AI-generated mother-tongue content in Ol Chiki.
          </p>

          <div className="w-full min-h-48 mt-4 p-5 bg-slate-50 border border-slate-200 rounded-xl">
            {translatedText ? (
              <p className="text-slate-800 text-lg leading-relaxed">
                {translatedText}
              </p>
            ) : (
              <p className="text-slate-400">
                Your AI translation will appear here.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}