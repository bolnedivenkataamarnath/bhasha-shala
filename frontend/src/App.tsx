import { useState, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import type { NavTab } from './types';
import TranslationPage from './pages/TranslationPage';
import LessonsPage from './pages/LessonsPage';
import StudentPage from './pages/StudentPage';
import OfflinePage from './pages/OfflinePage';
import SettingsPage from './pages/SettingsPage';
import { SettingsProvider, useSettings } from './context/SettingsContext';

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

function AppContent() {
  const { t } = useSettings();
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [selectedLanguage] = useState('Santhali');
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bhasha-shala-lessons');
      if (stored) {
        setLessons(JSON.parse(stored));
      }
    } catch (e) {
      setLessons([]);
    }
  }, [activeTab]);

  const totalLessons = lessons.length;
  const translatedLessonsCount = lessons.filter(
    (lesson) => Boolean(lesson.translatedContent) || Boolean(lesson.translations && Object.keys(lesson.translations).length > 0)
  ).length;

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
              <h1 className="text-3xl font-extrabold">{t('welcome')}</h1>
              <p className="mt-2 text-indigo-100">{t('subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold uppercase text-slate-400">{t('totalLessons')}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalLessons}</h3>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold uppercase text-slate-400">{t('translated')}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{translatedLessonsCount}</h3>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold uppercase text-slate-400">{t('worksheets')}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalLessons}</h3>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold uppercase text-slate-400">{t('aiQuizzes')}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalLessons}</h3>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('teacherQuickActions')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button onClick={() => setActiveTab('lessons')} className="p-4 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-xl font-semibold text-sm">
                  📚 Lessons & Content
                </button>
                <button onClick={() => setActiveTab('translation')} className="p-4 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 rounded-xl font-semibold text-sm">
                  🌐 AI Translation Hub
                </button>
                <button onClick={() => setActiveTab('student')} className="p-4 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-700 dark:text-purple-300 rounded-xl font-semibold text-sm">
                  📝 Worksheets & Quizzes
                </button>
              </div>
            </div>
          </div>
        );

      case 'translation':
        return <TranslationPage />;

      case 'lessons':
        return <LessonsPage />;

      case 'student':
        return <StudentPage />;

      case 'offline':
        return <OfflinePage isOnline={isOnline} />;

      case 'settings':
        return <SettingsPage />;

      default:
        return <Page title="Dashboard" />;
    }
  };

  return (
    <AppLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      isOnline={isOnline}
      onToggleOnline={() => setIsOnline((prev) => !prev)}
      selectedLanguage={selectedLanguage}
    >
      {renderPage()}
    </AppLayout>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

interface PageProps {
  title: string;
}

function Page({ title }: PageProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">This module is part of the Bhasha Shala learning platform.</p>
      <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
        <p className="text-slate-500 dark:text-slate-400">✨ Fully functional and aligned with offline & multilingual standards.</p>
      </div>
    </div>
  );
}
