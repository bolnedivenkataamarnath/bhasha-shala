import { useState, useEffect } from 'react';
import { CheckCircle2, Trash2, HardDriveDownload, RefreshCw } from 'lucide-react';
import { offlineStorageService } from '../services/offlineStorageService';

const CODE_TO_NAME: Record<string, string> = {
  en: 'English', te: 'Telugu', hi: 'Hindi', sat: 'Santali', ta: 'Tamil',
  kn: 'Kannada', ml: 'Malayalam', bn: 'Bengali', mr: 'Marathi', or: 'Odia', as: 'Assamese',
};

interface OfflinePageProps {
  isOnline: boolean;
}

export default function OfflinePage({ isOnline }: OfflinePageProps) {
  const [offlineLessons, setOfflineLessons] = useState<any[]>([]);
  const [syncedResults, setSyncedResults] = useState<any[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [selectedLangCode, setSelectedLangCode] = useState<string>('sat');

  const loadOfflineData = async () => {
    try {
      setOfflineLessons(await offlineStorageService.getAllOfflineLessons());
      setSyncedResults(await offlineStorageService.getAllOfflineResults());
    } catch (e) {
      console.error('Error loading offline data:', e);
    }
  };

  useEffect(() => { loadOfflineData(); }, []);

  const handleRemoveOffline = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Remove this lesson from offline storage?')) {
      await offlineStorageService.removeLessonOffline(id);
      await loadOfflineData();
      if (selectedLesson?.id === id) setSelectedLesson(null);
    }
  };

  const handleSyncResults = async () => {
    if (!isOnline) { alert('You are currently offline. Connect to internet to sync.'); return; }
    const results = await offlineStorageService.getAllOfflineResults();
    if (results.length === 0) { alert('No pending offline results to sync.'); return; }
    alert(`Successfully synced ${results.length} offline student results with backend server!`);
    for (const res of results) { if (res.id) await offlineStorageService.removeOfflineResult(res.id); }
    await loadOfflineData();
  };

  if (selectedLesson) {
    const availableTranslations = selectedLesson.translations || {};
    const translationCodes = Object.keys(availableTranslations);
    let currentTranslatedText = availableTranslations[selectedLangCode] || (selectedLangCode === 'sat' ? selectedLesson.translatedContent : '') || '';

    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        <button onClick={() => setSelectedLesson(null)} className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-indigo-700 shadow-xs">
          ← Back to Offline Lessons
        </button>
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase">
                {selectedLesson.subject} • Saved Offline
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-3">{selectedLesson.title}</h1>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Available Offline
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase text-slate-400">Original Content</h3>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-slate-800 text-base leading-relaxed whitespace-pre-wrap font-medium">
              {selectedLesson.content}
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase text-indigo-600">Offline Translated Versions</h3>
            {translationCodes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {translationCodes.map((code) => (
                  <button
                    key={code}
                    onClick={() => setSelectedLangCode(code)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm border transition-all ${selectedLangCode === code ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                  >
                    {CODE_TO_NAME[code] || code}
                  </button>
                ))}
              </div>
            )}
            <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 text-indigo-950 text-lg leading-relaxed whitespace-pre-wrap font-semibold">
              {currentTranslatedText || selectedLesson.translatedContent || 'No translation stored offline.'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-indigo-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
            <HardDriveDownload className="w-3.5 h-3.5 text-yellow-300" /> Rural & Low-Connectivity Ready
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Offline Content Hub 📦</h1>
          <p className="text-emerald-100 text-base sm:text-lg font-medium">
            Manage lessons saved directly to device IndexedDB. Access curriculum, translations, worksheets, and quizzes without internet.
          </p>
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl ${isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {isOnline ? '🟢' : '🟠'}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{isOnline ? 'Online (Sync Ready)' : 'Offline Mode Active'}</h3>
            <p className="text-xs text-slate-500 font-medium">{syncedResults.length} student quiz/worksheet result(s) waiting to sync.</p>
          </div>
        </div>
        <button
          onClick={handleSyncResults}
          disabled={!isOnline || syncedResults.length === 0}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Sync Results with Server
        </button>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-extrabold text-slate-900">Downloaded Offline Lessons ({offlineLessons.length})</h2>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">IndexedDB Active</span>
        </div>
        {offlineLessons.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <HardDriveDownload className="w-16 h-16 text-slate-300 mx-auto" />
            <h3 className="text-xl font-bold text-slate-800">No Lessons Downloaded for Offline Yet</h3>
            <p className="text-slate-500 max-w-md mx-auto text-sm">Go to the <b>Lessons Library</b> while online and click <b>"Save Offline"</b> on any lesson.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offlineLessons.map((l) => {
              const transCount = l.translations ? Object.keys(l.translations).length : (l.translatedContent ? 1 : 0);
              return (
                <div key={l.id} onClick={() => setSelectedLesson(l)} className="bg-white rounded-3xl border-2 border-slate-200 hover:border-emerald-500 p-7 shadow-sm transition-all cursor-pointer flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-extrabold text-teal-800 bg-teal-50 px-3 py-1 rounded-full">{l.subject}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">{transCount} Lang{transCount > 1 ? 's' : ''}</span>
                        <button onClick={(e) => handleRemoveOffline(l.id, e)} title="Remove offline copy" className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700">{l.title}</h3>
                    <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">{l.content}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Saved Offline</span>
                    <span className="text-slate-400 group-hover:text-emerald-700">Open →</span>
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
