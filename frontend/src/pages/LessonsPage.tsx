import { useEffect, useState } from 'react';
import { ArrowLeft, Languages, Volume2, FileSpreadsheet, HelpCircle, Trash2, Check } from 'lucide-react';
import { translationService } from '../services/translationService';
import { voiceService } from '../services/voiceService';

interface Lesson {
  id: number;
  title: string;
  subject: string;
  content: string;
  translatedContent?: string;
  sourceLang?: 'en' | 'hi';
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechStatus, setSpeechStatus] = useState('');
  const [activeSpeakingText, setActiveSpeakingText] = useState('');

  const handleSpeak = async (text: string, label: string, isSanthali: boolean = false) => {
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
  const [sourceLang, setSourceLang] = useState<'en' | 'hi'>('en');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(false);

  const handleRunTranslation = async () => {
    if (!selected) return;
    setIsLoadingTranslation(true);
    try {
      const result = await translationService.translateContent({
        text: selected.content,
        sourceLang,
        targetLang: 'sat',
      });
      setTranslatedText(result);
      const updated = lessons.map(l => l.id === selected.id ? { ...l, translatedContent: result, sourceLang } : l);
      setLessons(updated);
      setSelected({ ...selected, translatedContent: result, sourceLang });
    } catch (e) {
      setTranslatedText('Translation failed.');
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
                onChange={(e) => setSourceLang(e.target.value as 'en' | 'hi')}
                className="w-full p-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-800"
              >
                <option value="en">English</option>
                <option value="hi">Hindi (हिंदी)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">Target Language</label>
              <input
                type="text"
                disabled
                value="Santhali (ᱥᱟᱱᱛᱟᱲᱤ / Ol Chiki)"
                className="w-full p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl font-medium text-indigo-900 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase text-slate-400">Original Content (Unchanged)</h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-slate-700 leading-relaxed min-h-[180px] whitespace-pre-wrap">
                {selected.content}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase text-indigo-600">Santhali Translation</h3>
                {translatedText && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Usable by Next Features
                  </span>
                )}
              </div>
              <div className="bg-indigo-50/30 rounded-xl p-5 border border-indigo-100 text-slate-800 leading-relaxed min-h-[180px] whitespace-pre-wrap">
                {isLoadingTranslation ? (
                  <p className="text-slate-400 animate-pulse">Translating...</p>
                ) : translatedText ? (
                  <p className="text-lg font-medium">{translatedText}</p>
                ) : (
                  <p className="text-slate-400">Click "Run AI Translation" below.</p>
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
          {selected.translatedContent && (
            <div className="mt-6">
              <h3 className="text-sm font-bold uppercase text-indigo-600 mb-3">Santhali Translation</h3>
              <div className="bg-indigo-50/40 rounded-xl p-6 border border-indigo-100 text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">{selected.translatedContent}</div>
            </div>
          )}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase text-slate-400 mb-4">Actions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <button onClick={() => { setSourceLang(selected.sourceLang || 'en'); setTranslatedText(selected.translatedContent || ''); setIsTranslatingView(true); }} className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm">
                <Languages className="w-4 h-4" /> Translate
              </button>
              <button onClick={() => setIsListeningView(true)} className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm">
                <Volume2 className="w-4 h-4" /> Listen
              </button>
              <button onClick={() => alert('Worksheet')} className="p-3 bg-blue-50 text-blue-700 rounded-xl font-semibold border border-indigo-200 flex items-center justify-center gap-2"><FileSpreadsheet className="w-4 h-4" /> Worksheet</button>
              <button onClick={() => alert('Quiz')} className="p-3 bg-purple-50 text-purple-700 rounded-xl font-semibold border border-indigo-200 flex items-center justify-center gap-2"><HelpCircle className="w-4 h-4" /> Quiz</button>
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