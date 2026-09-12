export type NavTab =
  | 'dashboard'
  | 'translation'
  | 'voice'
  | 'lessons'
  | 'worksheets'
  | 'quiz'
  | 'offline'
  | 'settings';

export type LanguageCode = 'sat' | 'hi' | 'en';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  script: string;
}

export interface LessonSummary {
  id: string;
  title: string;
  grade: string;
  subject: string;
  topic: string;
  sourceLang: string;
  targetLang: string;
  hasAudio: boolean;
  hasWorksheet: boolean;
  isOfflineCached: boolean;
  date: string;
}

export interface ActivityItem {
  id: string;
  type: 'translate' | 'voice' | 'worksheet' | 'quiz' | 'offline_save';
  title: string;
  timestamp: string;
  status: 'completed' | 'cached' | 'processing';
}