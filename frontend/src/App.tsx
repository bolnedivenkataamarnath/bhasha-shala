import { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import type { NavTab } from './types';
import TranslationPage from './pages/TranslationPage';
import LessonsPage from './pages/LessonsPage';
function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isOnline, setIsOnline] = useState(true);
  const [selectedLanguage] = useState('Santhali');

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Welcome to Bhasha Shala 👋
            </h1>

            <p className="mt-2 text-slate-600">
              Mother-tongue learning tools for primary education.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">
                  📚 Lessons
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Create and manage lessons for students.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">
                  🌐 Translation
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Translate educational content into Santhali.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">
                  🎤 Voice Learning
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Use speech to make learning interactive.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">
                  📝 AI Activities
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Generate worksheets and quizzes.
                </p>
              </div>
            </div>
          </div>
        );

      case 'translation':
  return <TranslationPage />;

      case 'voice':
        return <Page title="Voice Learning" />;

      case 'lessons':
  return <LessonsPage />;

      case 'worksheets':
        return <Page title="Worksheet Generator" />;

      case 'quiz':
        return <Page title="AI Quiz" />;

      case 'offline':
        return <Page title="Offline Content" />;

      case 'settings':
        return <Page title="Settings" />;

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

interface PageProps {
  title: string;
}

function Page({ title }: PageProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>

      <p className="mt-2 text-slate-600">
        This module is part of the Bhasha Shala learning platform.
      </p>

      <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-8">
        <p className="text-slate-500">
          🚧 This feature will be built next.
        </p>
      </div>
    </div>
  );
}

export default App;