import { useState } from 'react';
import { Globe, Volume2, Palette, Check, Sparkles } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import type { AppLanguage, LearningLanguage, SpeechSpeed, ThemeMode, TextSize } from '../context/SettingsContext';

const SUPPORTED_LANGUAGES: AppLanguage[] = [
  'English', 'Telugu', 'Hindi', 'Santali', 'Tamil',
  'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Odia', 'Assamese',
];

export default function SettingsPage() {
  const {
    appLang, setAppLang,
    learningLang, setLearningLang,
    voiceOn, setVoiceOn,
    speechSpeed, setSpeechSpeed,
    theme, setTheme,
    textSize, setTextSize,
  } = useSettings();

  const [savedMessage, setSavedMessage] = useState<string>('');

  const showSavedNotification = (settingName: string) => {
    setSavedMessage(`${settingName} updated & saved successfully!`);
    setTimeout(() => setSavedMessage(''), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="bg-gradient-to-r from-indigo-800 via-blue-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Customization & Controls
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Settings & Preferences ⚙️</h1>
          <p className="text-indigo-100 text-base sm:text-lg font-medium">
            Manage your app language, speech voice parameters, theme appearance, and text accessibility for classroom tablets.
          </p>
        </div>
      </div>

      {savedMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-3.5 rounded-2xl font-bold flex items-center gap-2.5 shadow-sm">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* 1. LANGUAGE SETTINGS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-3 bg-indigo-50 text-indigo-700 rounded-2xl"><Globe className="w-6 h-6" /></div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Language Settings</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Configure primary application language and default learning language</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">App Language</label>
            <select
              value={appLang}
              onChange={(e) => { setAppLang(e.target.value as AppLanguage); showSavedNotification('App Language'); }}
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-600 rounded-2xl px-4 py-3 font-semibold text-slate-800 dark:text-white outline-none transition-all cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (<option key={lang} value={lang}>{lang}</option>))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Default Learning Language</label>
            <select
              value={learningLang}
              onChange={(e) => { setLearningLang(e.target.value as LearningLanguage); showSavedNotification('Default Learning Language'); }}
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-600 rounded-2xl px-4 py-3 font-semibold text-slate-800 dark:text-white outline-none transition-all cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (<option key={lang} value={lang}>{lang}</option>))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. VOICE & SPEECH */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl"><Volume2 className="w-6 h-6" /></div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Voice & Speech</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Manage text-to-speech audio toggle and playback speed</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-sm font-bold text-slate-800 dark:text-white block">Voice Audio</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Enable text-to-speech narration</span>
            </div>
            <button
              onClick={() => { setVoiceOn(!voiceOn); showSavedNotification('Voice setting'); }}
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                voiceOn ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  voiceOn ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Speech Speed</label>
            <select
              value={speechSpeed}
              onChange={(e) => { setSpeechSpeed(e.target.value as SpeechSpeed); showSavedNotification('Speech Speed'); }}
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-600 rounded-2xl px-4 py-3 font-semibold text-slate-800 dark:text-white outline-none transition-all cursor-pointer"
            >
              <option value="Slow">Slow</option>
              <option value="Normal">Normal</option>
              <option value="Fast">Fast</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. APPEARANCE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-2xl"><Palette className="w-6 h-6" /></div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Appearance</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Customize display theme and text size for readability</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Theme</label>
            <select
              value={theme}
              onChange={(e) => { setTheme(e.target.value as ThemeMode); showSavedNotification('Theme'); }}
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-600 rounded-2xl px-4 py-3 font-semibold text-slate-800 dark:text-white outline-none transition-all cursor-pointer"
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
              <option value="System">System</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">Text Size</label>
            <select
              value={textSize}
              onChange={(e) => { setTextSize(e.target.value as TextSize); showSavedNotification('Text Size'); }}
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-600 rounded-2xl px-4 py-3 font-semibold text-slate-800 dark:text-white outline-none transition-all cursor-pointer"
            >
              <option value="Normal">Normal</option>
              <option value="Large">Large</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
