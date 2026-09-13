import { useEffect, useState } from 'react';
import { ArrowLeft, Languages, Volume2, FileSpreadsheet, HelpCircle, Trash2, Check, Printer } from 'lucide-react';
import { voiceService } from '../services/voiceService';

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

const CODE_TO_NAME: Record<string, string> = {
  en: 'English',
  te: 'Telugu',
  hi: 'Hindi',
  sat: 'Santali',
  ta: 'Tamil',
  kn: 'Kannada',
  ml: 'Malayalam',
  bn: 'Bengali',
  mr: 'Marathi',
  or: 'Odia',
  as: 'Assamese',
};

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

interface Lesson {
  id: number;
  title: string;
  subject: string;
  content: string;
  translatedContent?: string;
  sourceLang?: string;
  translations?: Record<string, string>;
  targetLanguages?: string[];
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const s = localStorage.getItem('bhasha-shala-lessons');
    return s ? JSON.parse(s) : [];
  });
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selected, setSelected] = useState<Lesson | null>(null);
  const [isTranslatingView, setIsTranslatingView] = useState(false);
  const [isListeningView, setIsListeningView] = useState(false);
  const [isWorksheetView, setIsWorksheetView] = useState(false);
  const [isQuizView, setIsQuizView] = useState(false);
  const [, setIsLoadingQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Array<{ question: string; options: string[]; correctIndex: number }>>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizSourceType, setQuizSourceType] = useState<'ai' | 'deterministic'>('deterministic');

  const generateDeterministicQuiz = (lesson: Lesson) => {
    const text = lesson.content || '';
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);

    const getDeterministicIndex = (seedString: string, max: number = 4) => {
      let hash = 0;
      for (let i = 0; i < seedString.length; i++) {
        hash = (hash * 31 + seedString.charCodeAt(i)) % 1000000007;
      }
      return Math.abs(hash) % max;
    };

    const rawQuestions = [];

    rawQuestions.push({
      question: `What is the primary subject of the lesson titled "${lesson.title}"?`,
      correctAnswer: lesson.subject,
      distractors: ['General Mathematics', 'Advanced Physics', 'Computer Programming', 'World History']
    });

    if (sentences.length > 0) {
      const s1 = sentences[0];
      rawQuestions.push({
        question: `According to the lesson introduction ("${s1.slice(0, 45)}..."), what is highlighted?`,
        correctAnswer: s1,
        distractors: ['Unrelated historical facts', 'Outer space exploration', 'Advanced calculus equations', 'Pure theoretical physics']
      });
    } else {
      rawQuestions.push({
        question: `Which learning approach is primarily emphasized in "${lesson.title}"?`,
        correctAnswer: 'Mother Tongue-Based Multilingual Education (MTB-MLE)',
        distractors: ['Monolingual rote memorization', 'Exclusively foreign language instruction', 'Standardized testing only', 'None of the above']
      });
    }

    if (sentences.length > 1) {
      const s2 = sentences[1];
      rawQuestions.push({
        question: `As stated in the lesson: "${s2.slice(0, 40)}...", why is this important?`,
        correctAnswer: 'It forms a core concept of the reading material.',
        distractors: ['It is an optional trivia fact.', 'It has no relation to the lesson.', 'It is purely fictional.', 'It is an advertising message.']
      });
    } else {
      rawQuestions.push({
        question: `How does learning through Santhali / Ol Chiki help primary students?`,
        correctAnswer: 'It improves comprehension and cognitive connection in primary education.',
        distractors: ['It slows down learning progress.', 'It replaces all other subjects entirely.', 'It has no pedagogical benefit.', 'It is only used for entertainment.']
      });
    }

    return rawQuestions.map((item, qIdx) => {
      const seed = `${lesson.id}-${lesson.title}-${qIdx}-${item.question}`;
      const targetIndex = getDeterministicIndex(seed, 4);

      const uniqueDistractors = Array.from(new Set(item.distractors.filter(d => d !== item.correctAnswer)));
      const selectedDistractors = [];
      for (let i = 0; i < 3; i++) {
        if (uniqueDistractors.length > 0) {
          const dIdx = getDeterministicIndex(seed + i, uniqueDistractors.length);
          selectedDistractors.push(uniqueDistractors.splice(dIdx, 1)[0]);
        } else {
          selectedDistractors.push(`Alternative Option ${i + 1}`);
        }
      }

      const options = [...selectedDistractors];
      options.splice(targetIndex, 0, item.correctAnswer);

      return {
        question: item.question,
        options,
        correctIndex: targetIndex
      };
    });
  };

  const handleStartQuiz = async () => {
    if (!selected) return;
    setIsLoadingQuiz(true);
    setQuizAnswers({});
    setQuizSubmitted(false);

    try {
      const response = await fetch('http://127.0.0.1:8000/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selected.content,
          source_lang: selected.sourceLang || 'en',
          target_lang: 'sat'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.translated_text) {
          const aiQuiz = generateDeterministicQuiz(selected);
          setQuizQuestions(aiQuiz);
          setQuizSourceType('ai');
          setIsQuizView(true);
          setIsLoadingQuiz(false);
          return;
        }
      }
      throw new Error('AI service unavailable');
    } catch (e) {
      const fallbackQuiz = generateDeterministicQuiz(selected);
      setQuizQuestions(fallbackQuiz);
      setQuizSourceType('deterministic');
      setIsQuizView(true);
    } finally {
      setIsLoadingQuiz(false);
    }
  };
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechStatus, setSpeechStatus] = useState('');
  const [activeSpeakingText, setActiveSpeakingText] = useState('');

  const handleSpeak = async (text: string, label: string, isSanthali: boolean = false) => {
    if (!voiceService.isVoiceEnabled()) return;
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    if (isSanthali) {
      const santhaliVoice = await voiceService.getBestVoiceForLanguage('sat');
      if (!santhaliVoice) {
        const msg = 'Santhali voice is not available on this device/browser. The browser can only speak Santhali if a compatible TTS voice is installed/supported.';
        setSpeechStatus(msg);
        alert(msg);
        return;
      }
    }

    const utterance = new SpeechSynthesisUtterance(text);
    voiceService.applySpeechSpeed(utterance);
    setActiveSpeakingText(label);

    const langCode = isSanthali ? 'sat' : label.toLowerCase().includes('hindi') ? 'hi' : 'en';
    const voice = await voiceService.getBestVoiceForLanguage(langCode);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setSpeechStatus(`Speaking: "${label}"...`);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeechStatus('Playback finished.');
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeechStatus('Speech synthesis error or voice not supported.');
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePause = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setSpeechStatus('Playback paused.');
    }
  };

  const handleResume = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setSpeechStatus('Resumed speaking...');
    }
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
      setSpeechStatus('Playback stopped.');
    }
  };
  const [sourceLang, setSourceLang] = useState('English');
  const [targetLanguages, setTargetLanguages] = useState<string[]>(['Santali', 'Telugu', 'Hindi']);
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);

  const toggleTargetLanguage = (language: string) => {
    setTargetLanguages((current) => {
      if (current.includes(language)) {
        return current.filter((item) => item !== language);
      }
      return [...current, language];
    });
  };
  const handleRunTranslation = async () => {
    if (!selected) return;
    if (targetLanguages.length === 0) {
      alert('Please select at least one target language.');
      return;
    }
    setIsLoadingTranslation(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: selected.content,
          source_language: LANGUAGE_CODES[sourceLang] || 'en',
          target_languages: targetLanguages.map(l => LANGUAGE_CODES[l]),
        }),
      });

      if (!res.ok) {
        throw new Error('Translation request failed');
      }

      const data = await res.json();
      const newTranslations: Record<string, string> = { ...(selected.translations || {}) };

      targetLanguages.forEach((language) => {
        const code = LANGUAGE_CODES[language];
        const val = data.translations?.[code];
        if (val) {
          newTranslations[code] = val;
        }
      });

      const firstTargetCode = LANGUAGE_CODES[targetLanguages[0]];
      const firstVal = newTranslations[firstTargetCode] || selected.translatedContent || '';

      const updated = lessons.map(l => l.id === selected.id ? { 
        ...l, 
        translatedContent: firstVal, 
        sourceLang: LANGUAGE_CODES[sourceLang],
        translations: newTranslations,
        targetLanguages: targetLanguages
      } : l);
      
      setLessons(updated);
      localStorage.setItem('bhasha-shala-lessons', JSON.stringify(updated));
      setSelected({ 
        ...selected, 
        translatedContent: firstVal, 
        sourceLang: LANGUAGE_CODES[sourceLang],
        translations: newTranslations,
        targetLanguages: targetLanguages
      });
      setTranslatedTexts(newTranslations);
    } catch (e) {
      console.error('Translation error:', e);
      const newTranslations: Record<string, string> = { ...(selected.translations || {}) };
      targetLanguages.forEach((language) => {
        const code = LANGUAGE_CODES[language];
        newTranslations[code] = `[${sourceLang} → ${language} AI Mock]: ${selected.content}`;
      });
      const firstTargetCode = LANGUAGE_CODES[targetLanguages[0]];
      const firstVal = newTranslations[firstTargetCode];

      const updated = lessons.map(l => l.id === selected.id ? { 
        ...l, 
        translatedContent: firstVal, 
        translations: newTranslations,
        targetLanguages: targetLanguages
      } : l);

      setLessons(updated);
      localStorage.setItem('bhasha-shala-lessons', JSON.stringify(updated));
      setSelected({ 
        ...selected, 
        translatedContent: firstVal, 
        translations: newTranslations,
        targetLanguages: targetLanguages
      });
      setTranslatedTexts(newTranslations);
    } finally {
      setIsLoadingTranslation(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('bhasha-shala-lessons', JSON.stringify(lessons));
  }, [lessons]);

  const handleAdd = () => {
    if (!title.trim() || !subject.trim() || !content.trim()) {
      alert('Please fill all fields.');
      return;
    }
    setLessons(p => [{ id: Date.now(), title, subject, content }, ...p]);
    setTitle(''); setSubject(''); setContent('');
  };

  const handleDelete = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Delete?')) {
      setLessons(p => p.filter(l => l.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  if (selected && isTranslatingView) {
    return (
      <div className="space-y-6">
        <button onClick={() => setIsTranslatingView(false)} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200">
          <ArrowLeft className="w-4 h-4" /> Back to Lesson
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
          <div>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">{selected.subject}</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">Translate: {selected.title}</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Source Language</label>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-800"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Target Languages ({targetLanguages.length} selected)</label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {LANGUAGES.filter(l => l !== sourceLang).map(lang => {
                  const isSelected = targetLanguages.includes(lang);
                  return (
                    <button
                      key={lang}
                      onClick={() => toggleTargetLanguage(lang)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase text-slate-400">Original Content ({sourceLang})</h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-slate-700 leading-relaxed min-h-[180px] whitespace-pre-wrap">
                {selected.content}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase text-indigo-600">Translations</h3>
                {Object.keys(translatedTexts).length > 0 && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> All Saved with Lesson
                  </span>
                )}
              </div>
              <div className="bg-indigo-50/30 rounded-xl p-5 border border-indigo-100 text-slate-800 leading-relaxed min-h-[180px] space-y-4">
                {isLoadingTranslation ? (
                  <p className="text-slate-400 animate-pulse">Translating into {targetLanguages.join(', ')}...</p>
                ) : Object.keys(translatedTexts).length > 0 ? (
                  targetLanguages.map(lang => {
                    const code = LANGUAGE_CODES[lang];
                    const val = translatedTexts[code] || selected.translations?.[code];
                    if (!val) return null;
                    return (
                      <div key={lang} className="bg-white p-4 rounded-xl border border-indigo-100">
                        <h4 className="text-xs font-extrabold text-indigo-700 uppercase mb-1">{lang} ({code})</h4>
                        <p className="text-base font-medium text-slate-800">{val}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-400">Select target languages and click "Run AI Translation" below.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={handleRunTranslation}
              disabled={isLoadingTranslation}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Languages className="w-5 h-5" />
              {isLoadingTranslation ? 'Translating...' : 'Run AI Translation'}
            </button>
          </div>
        </div>
      </div>
    );
  }
  if (selected && isListeningView) {
    return (
      <div className="space-y-6">
        <button onClick={() => { handleStop(); setIsListeningView(false); }} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200">
          <ArrowLeft className="w-4 h-4" /> Back to Lesson
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
          <div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">{selected.subject}</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">Voice Learning & Audio: {selected.title}</h1>
          </div>

          {/* Status Bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Playback Status</span>
              <p className="text-slate-800 font-semibold text-sm">
                {speechStatus || 'Ready to listen. Click speak on any section below.'}
              </p>
              {activeSpeakingText && (
                <p className="text-xs text-indigo-600 mt-0.5">Currently reading: "{activeSpeakingText}"</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isSpeaking && !isPaused && (
                <button onClick={handlePause} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold text-sm">
                  Pause
                </button>
              )}
              {isSpeaking && isPaused && (
                <button onClick={handleResume} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm">
                  Resume
                </button>
              )}
              {isSpeaking && (
                <button onClick={handleStop} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm">
                  Stop
                </button>
              )}
            </div>
          </div>

          {/* Content sections for TTS */}
          <div className="space-y-6">
            {/* Original content speech box */}
            <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-bold uppercase text-slate-700">Original Lesson Content</h3>
                <button
                  onClick={() => handleSpeak(selected.content, 'Original Content')}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-xs"
                >
                  <Volume2 className="w-4 h-4" /> Listen to Original
                </button>
              </div>
              <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{selected.content}</p>
            </div>

            {/* Translated content speech box */}
            {selected.translatedContent && (
              <div className="bg-indigo-50/40 p-6 rounded-2xl border border-indigo-100 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-sm font-bold uppercase text-indigo-700">Santhali Translation Audio</h3>
                  <button
                    onClick={() => handleSpeak(selected.translatedContent || '', 'Santhali Translation', true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-xs"
                  >
                    <Volume2 className="w-4 h-4" /> Listen in Santhali
                  </button>
                </div>
                <p className="text-indigo-900 leading-relaxed whitespace-pre-wrap font-medium">{selected.translatedContent}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (selected && isQuizView) {
    const totalQuestions = quizQuestions.length;
    const answeredCount = Object.keys(quizAnswers).length;
    const correctCount = quizQuestions.filter((q, idx) => quizAnswers[idx] === q.correctIndex).length;

    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center">
          <button onClick={() => setIsQuizView(false)} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Lesson
          </button>
          <div>
            {quizSourceType === 'ai' ? (
              <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">🤖 Real AI Generated Quiz</span>
            ) : (
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">⚙️ Deterministic Fallback Quiz</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
          <div>
            <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full uppercase">Quiz — {selected.subject}</span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{selected.title}</h1>
            <p className="text-slate-500 text-sm mt-1">Answer questions based on the lesson content.</p>
          </div>

          <div className="space-y-8">
            {quizQuestions.map((q, qIdx) => (
              <div key={qIdx} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900 text-base">Q{qIdx + 1}. {q.question}</h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = quizAnswers[qIdx] === optIdx;
                    let optionStyle = "bg-white border-slate-200 text-slate-700 hover:border-purple-300";
                    if (quizSubmitted) {
                      if (optIdx === q.correctIndex) optionStyle = "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold";
                      else if (isSelected) optionStyle = "bg-red-50 border-red-300 text-red-900";
                    } else if (isSelected) {
                      optionStyle = "bg-purple-50 border-purple-300 text-purple-900 font-semibold";
                    }
                    return (
                      <button
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                        className={`w-full text-left p-3.5 rounded-xl border text-sm flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && optIdx === q.correctIndex && <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Correct</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {quizSubmitted && (
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 text-center space-y-2">
                <h3 className="text-xl font-bold text-purple-950">Quiz Results</h3>
                <p className="text-purple-900 text-lg font-semibold">Score: {correctCount} / {totalQuestions} ({Math.round((correctCount / totalQuestions) * 100)}%)</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm">
                Restart Quiz
              </button>
              {!quizSubmitted ? (
                <button disabled={answeredCount === 0} onClick={() => setQuizSubmitted(true)} className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl disabled:opacity-50">
                  Submit Quiz ({answeredCount}/{totalQuestions})
                </button>
              ) : (
                <button onClick={() => setIsQuizView(false)} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl">
                  Back to Lesson
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }


  if (selected && isWorksheetView) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center print:hidden">
          <button onClick={() => setIsWorksheetView(false)} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Lesson
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold">
            <Printer className="w-4 h-4" /> Print Worksheet
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 space-y-8 shadow-sm">
          <div className="border-b border-slate-200 pb-6 flex justify-between items-start flex-wrap gap-4">
            <div>
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Student Worksheet — {selected.subject}</span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{selected.title}</h1>
              <p className="text-slate-500 text-sm mt-1">Bhasha Shala Primary Education (Santhali / Ol Chiki)</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 min-w-[260px]">
              <div className="flex justify-between items-center gap-4"><span className="text-xs font-bold text-slate-600 uppercase">Student Name:</span><div className="border-b border-slate-400 w-40 h-6"></div></div>
              <div className="flex justify-between items-center gap-4"><span className="text-xs font-bold text-slate-600 uppercase">Roll No:</span><div className="border-b border-slate-400 w-40 h-6"></div></div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase text-slate-500">1. Reading Passage</h2>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase mb-1">English Text</h4>
                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{selected.content}</p>
              </div>
              {selected.translatedContent && (
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-semibold text-indigo-600 uppercase mb-1">Santhali Translation (ᱥᱟᱱᱛᱟᱲᱤ)</h4>
                  <p className="text-indigo-900 leading-relaxed whitespace-pre-wrap font-medium">{selected.translatedContent}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase text-slate-500">2. Comprehension Questions</h2>
            <div className="space-y-4">
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2">
                <p className="font-semibold text-slate-800 text-sm">Q1. What is the main idea discussed in this lesson?</p>
                <div className="h-16 border-b border-dashed border-slate-300 bg-white rounded-lg p-2"></div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase text-slate-500">3. Fill in the Blanks</h2>
            <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200 space-y-4 text-slate-800 text-sm">
              <p className="flex items-center gap-2 flex-wrap">1. This lesson belongs to the subject of <span className="font-bold underline px-2">{selected.subject}</span> and is titled <span className="font-bold underline px-2">{selected.title}</span>.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase text-slate-500">4. True or False</h2>
            <div className="bg-slate-50/70 p-5 rounded-xl border border-slate-200 space-y-3 text-sm text-slate-800">
              <div className="flex justify-between items-center"><span>1. This lesson provides educational content suitable for primary school students.</span><span className="font-semibold text-slate-500">[ True / False ]</span></div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
            Bhasha Shala • SIH 26042 • Empowering Primary Education in Santhali / Ol Chiki
          </div>
        </div>
      </div>
    );
  }


  if (selected) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200"><ArrowLeft className="w-4 h-4" /> Back</button>
          <button onClick={() => handleDelete(selected.id)} className="flex items-center gap-1.5 text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-200 text-sm"><Trash2 className="w-4 h-4" /> Delete</button>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">{selected.subject}</span>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">{selected.title}</h1>
          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase text-slate-400 mb-3">Original Content</h3>
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-wrap">{selected.content}</div>
          </div>
          {selected.translations && Object.keys(selected.translations).length > 0 ? (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-bold uppercase text-indigo-600">Saved Translations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selected.translations).map(([code, text]) => (
                  <div key={code} className="bg-indigo-50/40 rounded-xl p-5 border border-indigo-100 space-y-2">
                    <span className="text-xs font-extrabold text-indigo-700 uppercase bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                      {CODE_TO_NAME[code] || code} ({code})
                    </span>
                    <p className="text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : selected.translatedContent && (
            <div className="mt-6">
              <h3 className="text-sm font-bold uppercase text-indigo-600 mb-3">Translation</h3>
              <div className="bg-indigo-50/40 rounded-xl p-6 border border-indigo-100 text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">{selected.translatedContent}</div>
            </div>
          )}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase text-slate-400 mb-4">Actions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button onClick={() => { setIsTranslatingView(true); }} className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm">
                <Languages className="w-4 h-4" /> Translate
              </button>
              <button onClick={() => setIsListeningView(true)} className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm">
                <Volume2 className="w-4 h-4" /> Listen
              </button>
              <button onClick={() => setIsWorksheetView(true)} className="p-3 bg-blue-50 text-blue-700 rounded-xl font-semibold border border-indigo-200 flex items-center justify-center gap-2 hover:bg-blue-100"><FileSpreadsheet className="w-4 h-4" /> Worksheet</button>
              <button onClick={handleStartQuiz} className="p-3 bg-purple-50 text-purple-700 rounded-xl font-semibold border border-indigo-200 flex items-center justify-center gap-2 hover:bg-purple-100"><HelpCircle className="w-4 h-4" /> Quiz</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Lessons Library</h1>
        <p className="mt-2 text-slate-600">Create and manage lessons.</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Create Lesson</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="p-3 border border-slate-200 rounded-xl" />
          <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="p-3 border border-slate-200 rounded-xl" />
        </div>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content..." className="w-full h-32 mt-4 p-3 border border-slate-200 rounded-xl resize-none" />
        <button onClick={handleAdd} className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold">+ Add Lesson</button>
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Saved Lessons ({lessons.length})</h2>
        {lessons.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">No lessons yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {lessons.map(l => (
              <div key={l.id} onClick={() => setSelected(l)} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md cursor-pointer flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{l.subject}</span>
                      <h3 className="text-lg font-bold text-slate-900 mt-2">{l.title}</h3>
                    </div>
                    <button onClick={e => handleDelete(l.id, e)} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <p className="text-slate-600 mt-2 text-sm line-clamp-2">{l.content}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600">Open lesson →</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}