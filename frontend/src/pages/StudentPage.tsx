import { useState } from 'react';
import { ArrowLeft, Volume2, CheckCircle2, BookOpen, Sparkles, HardDriveDownload } from 'lucide-react';
import { voiceService } from '../services/voiceService';
import { offlineStorageService } from '../services/offlineStorageService';

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

export default function StudentPage() {
  const [lessons] = useState<Lesson[]>(() => {
    try {
      const s = localStorage.getItem('bhasha-shala-lessons');
      return s ? JSON.parse(s) : [];
    } catch (e) {
      return [];
    }
  });

  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [activeTab, setActiveTab] = useState<'read' | 'quiz'>('read');
  const [, setSpeechStatus] = useState('');
  const [isOfflineSaved, setIsOfflineSaved] = useState(false);
  
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Selected language for Student Learning (defaults to first available translation code or 'sat')
  const [selectedLangCode, setSelectedLangCode] = useState<string>('sat');

  // When a lesson is selected, initialize selectedLangCode to the first available translation key and check offline status
  const handleSelectLesson = async (lesson: Lesson) => {
    setSelectedLesson(lesson);
    const transKeys = lesson.translations ? Object.keys(lesson.translations) : [];
    if (transKeys.length > 0) {
      setSelectedLangCode(transKeys[0]);
    } else {
      setSelectedLangCode('sat');
    }
    const saved = await offlineStorageService.isLessonAvailableOffline(lesson.id);
    setIsOfflineSaved(saved);
  };

  const handleSaveOffline = async () => {
    if (!selectedLesson) return;
    try {
      await offlineStorageService.saveLessonOffline(selectedLesson);
      setIsOfflineSaved(true);
    } catch (e) {
      console.error('Error saving lesson offline:', e);
      alert('Failed to save lesson offline.');
    }
  };

  const generateQuiz = (lesson: Lesson) => {
    const text = lesson.content || '';
    const sentences = text.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(s => s.length > 8);
    const questions = [];

    questions.push({
      question: `What is the main subject of "${lesson.title}"?`,
      options: [lesson.subject, 'Mathematics', 'General Science', 'Computer Studies'],
      correctIndex: 0
    });

    if (sentences.length > 0) {
      questions.push({
        question: `According to the story: "${sentences[0].slice(0, 40)}...", what is discussed?`,
        options: [sentences[0], 'An unrelated event', 'A math puzzle', 'Outer space travel'],
        correctIndex: 0
      });
    } else {
      questions.push({
        question: `Why is learning in Santhali mother tongue important?`,
        options: ['It helps us understand faster and better.', 'It is harder to learn.', 'It is not useful.', 'None of the above'],
        correctIndex: 0
      });
    }

    return questions;
  };

  const quizQuestions = selectedLesson ? generateQuiz(selectedLesson) : [];

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
        setSpeechStatus('Note: Dedicated Santhali TTS voice not installed in browser. Using default voice.');
      }
    }

    const utterance = new SpeechSynthesisUtterance(text);
    voiceService.applySpeechSpeed(utterance);
    const langCode = isSanthali ? 'sat' : 'en';
    const voice = await voiceService.getBestVoiceForLanguage(langCode);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.onstart = () => {
      setSpeechStatus(`Reading aloud: "${label}"...`);
    };
    utterance.onend = () => {
      setSpeechStatus('Finished reading.');
    };
    utterance.onerror = () => {
      setSpeechStatus('Speech synthesis error.');
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeechStatus('Stopped reading.');
    }
  };
  if (selectedLesson) {
    const correctCount = quizQuestions.filter((q, idx) => quizAnswers[idx] === q.correctIndex).length;

    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
          <button onClick={() => { handleStopSpeech(); setSelectedLesson(null); }} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-xl font-bold">
            <ArrowLeft className="w-5 h-5" /> Back to Lessons
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveOffline}
              disabled={isOfflineSaved}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm shadow-xs transition-all ${
                isOfflineSaved
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
              }`}
            >
              <HardDriveDownload className="w-4 h-4" />
              {isOfflineSaved ? 'Available Offline' : 'Save Offline'}
            </button>
            <button onClick={() => setActiveTab('read')} className={`px-5 py-2.5 rounded-xl font-bold text-sm ${activeTab === 'read' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700'}`}>📖 Reading</button>
            <button onClick={() => setActiveTab('quiz')} className={`px-5 py-2.5 rounded-xl font-bold text-sm ${activeTab === 'quiz' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-100 text-slate-700'}`}>❓ Quiz</button>
          </div>
        </div>
        {activeTab === 'read' && (() => {
          const availableTranslations = selectedLesson.translations || {};
          const translationCodes = Object.keys(availableTranslations);
          let currentTranslatedText = '';
          if (availableTranslations[selectedLangCode]) {
            currentTranslatedText = availableTranslations[selectedLangCode];
          } else if (selectedLangCode === 'sat' && selectedLesson.translatedContent) {
            currentTranslatedText = selectedLesson.translatedContent;
          }

          return (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
              <div>
                <span className="bg-indigo-100 text-indigo-800 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase">
                  {selectedLesson.subject}
                </span>
                <h1 className="text-3xl font-extrabold text-slate-900 mt-3">{selectedLesson.title}</h1>
              </div>

              {/* Translated Lesson Box & Language Selector */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-sm font-bold uppercase text-indigo-600">Language Selector</h3>
                  {translationCodes.length > 0 && currentTranslatedText && (
                    <button
                      onClick={() => handleSpeak(currentTranslatedText, `${CODE_TO_NAME[selectedLangCode] || selectedLangCode} Translation`)}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold self-start sm:self-auto"
                    >
                      <Volume2 className="w-4 h-4" /> Listen
                    </button>
                  )}
                </div>

                {/* Language Selector Example: [ Santali ] [ Telugu ] [ Hindi ] */}
                {translationCodes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {translationCodes.map((code) => {
                      const langName = CODE_TO_NAME[code] || code;
                      const isSelected = selectedLangCode === code;
                      return (
                        <button
                          key={code}
                          onClick={() => setSelectedLangCode(code)}
                          className={`px-4 py-2 rounded-xl font-bold text-sm border transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          [ {langName} ]
                        </button>
                      );
                    })}
                  </div>
                ) : selectedLesson.translatedContent ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedLangCode('sat')}
                      className="px-4 py-2 rounded-xl font-bold text-sm border bg-indigo-600 text-white border-indigo-600 shadow-md"
                    >
                      [ Santali ]
                    </button>
                  </div>
                ) : null}

                {/* Translated lesson box containing ONLY the selected language's translated text */}
                <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 text-indigo-950 text-lg leading-relaxed whitespace-pre-wrap font-semibold">
                  {currentTranslatedText ? (
                    currentTranslatedText
                  ) : (
                    <p className="text-slate-400 italic text-base">
                      No translation available for this language yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {activeTab === 'quiz' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-8 shadow-sm">
            <div>
              <span className="bg-purple-100 text-purple-800 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase">
                Comprehension Practice
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">Fun Quiz: {selectedLesson.title}</h2>
            </div>

            <div className="space-y-6">
              {quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
                  <h3 className="font-bold text-slate-900 text-lg">{qIdx + 1}. {q.question}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[qIdx] === optIdx;
                      let btnStyle = "bg-white border-slate-200 text-slate-800";
                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) btnStyle = "bg-emerald-100 border-emerald-400 text-emerald-950 font-bold";
                        else if (isSelected) btnStyle = "bg-red-100 border-red-400 text-red-950";
                      } else if (isSelected) {
                        btnStyle = "bg-purple-600 text-white border-purple-600 font-bold";
                      }
                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                          className={`p-4 rounded-xl border text-left text-base font-semibold ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {quizSubmitted && (
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 text-center space-y-2">
                  <h3 className="text-2xl font-extrabold text-purple-950">🎉 Great Job!</h3>
                  <p className="text-purple-900 text-xl font-bold">Score: {correctCount} / {quizQuestions.length}</p>
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button onClick={() => { setQuizAnswers({}); setQuizSubmitted(false); }} className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-base">
                  Restart Quiz
                </button>
                {!quizSubmitted ? (
                  <button disabled={Object.keys(quizAnswers).length === 0} onClick={() => setQuizSubmitted(true)} className="px-8 py-3 bg-purple-600 text-white font-bold rounded-xl disabled:opacity-50 text-base">
                    Submit Answers
                  </button>
                ) : (
                  <button onClick={() => setActiveTab('read')} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl text-base">
                    Back to Reading
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }


  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Child-Friendly Tablet Mode
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Student Learning Mode 🎒</h1>
          <p className="text-emerald-100 text-base sm:text-lg font-medium">
            Learn stories and subjects in your mother tongue (<span className="text-yellow-200 font-bold">Santhali / ᱥᱟᱱᱛᱟᱲᱤ</span>). Listen with audio and test your skills with fun quizzes!
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold text-slate-900">Choose a Lesson to Learn</h2>

        {lessons.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto" />
            <h3 className="text-xl font-bold text-slate-800">No Lessons Found Yet</h3>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              Teachers can create lessons in the Lessons Library. Once added, they will automatically appear here for students!
            </p>
          </div>
        ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {lessons.map((l) => {
                  const transCount = l.translations ? Object.keys(l.translations).length : (l.translatedContent ? 1 : 0);
                  return (
                    <div
                      key={l.id}
                      onClick={() => handleSelectLesson(l)}
                      className="bg-white rounded-3xl border-2 border-slate-200 hover:border-emerald-500 p-7 shadow-sm transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">{l.subject}</span>
                          {transCount > 0 ? (
                            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {transCount} Language{transCount > 1 ? 's' : ''} Ready
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full">English Only</span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700">{l.title}</h3>
                        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">{l.content}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                          <Volume2 className="w-4 h-4" /> Start Learning →
                        </span>
                        <span className="text-xs font-semibold text-slate-400">Tap to open</span>
                      </div>
                    </div>
                  );
                })}
              </div>
        )}
      </div>
    </div>
  );
}

