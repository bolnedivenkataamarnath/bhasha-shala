import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppLanguage = 'English' | 'Telugu' | 'Hindi' | 'Santali' | 'Tamil' | 'Kannada' | 'Malayalam' | 'Bengali' | 'Marathi' | 'Odia' | 'Assamese';
export type LearningLanguage = 'English' | 'Telugu' | 'Hindi' | 'Santali' | 'Tamil' | 'Kannada' | 'Malayalam' | 'Bengali' | 'Marathi' | 'Odia' | 'Assamese';
export type SpeechSpeed = 'Slow' | 'Normal' | 'Fast';
export type ThemeMode = 'Light' | 'Dark' | 'System';
export type TextSize = 'Normal' | 'Large';

interface SettingsContextType {
  appLang: AppLanguage;
  setAppLang: (lang: AppLanguage) => void;
  learningLang: LearningLanguage;
  setLearningLang: (lang: LearningLanguage) => void;
  voiceOn: boolean;
  setVoiceOn: (on: boolean) => void;
  speechSpeed: SpeechSpeed;
  setSpeechSpeed: (speed: SpeechSpeed) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  t: (key: string) => string;
}

const UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    dashboard: 'Dashboard',
    translation: 'Translation',
    student: 'Student Learning',
    lessons: 'Lessons Library',
    offline: 'Offline Content',
    settings: 'Settings',
  },
  Hindi: {
    dashboard: 'डैशबोर्ड',
    translation: 'अनुवाद',
    student: 'छात्र शिक्षण',
    lessons: 'पाठ पुस्तकालय',
    offline: 'ऑफ़लाइन सामग्री',
    settings: 'सेटिंग्स',
  },
  Telugu: {
    dashboard: 'డ్యాష్‌బోర్డ్',
    translation: 'అనువాదం',
    student: 'విద్యార్థి అభ్యాసనం',
    lessons: 'పాఠాల లైబ్రరీ',
    offline: 'ఆఫ్‌లైన్ కంటెంట్',
    settings: 'సెట్టింగ్‌లు',
  },
  Santali: {
    dashboard: 'ᱰᱮᱥᱵᱳᱨᱰ',
    translation: 'ᱛᱚᱨᱡᱚᱢᱟ',
    student: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱪᱮᱫᱚᱜ',
    lessons: 'ᱯᱟᱲᱦᱟᱣ ᱯᱚᱛᱚᱵ ᱚᱲᱟᱜ',
    offline: 'ᱚᱯᱞᱟᱭᱤᱱ ᱟᱹᱜᱩᱭᱟᱠᱟᱱ',
    settings: 'ᱥᱮᱴᱤᱝᱥ',
  },
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appLang, setAppLang] = useState<AppLanguage>(() => (localStorage.getItem('bhasha-shala-app-lang') as AppLanguage) || 'English');
  const [learningLang, setLearningLang] = useState<LearningLanguage>(() => (localStorage.getItem('bhasha-shala-learning-lang') as LearningLanguage) || 'Santali');
  const [voiceOn, setVoiceOn] = useState<boolean>(() => localStorage.getItem('bhasha-shala-voice-on') !== 'false');
  const [speechSpeed, setSpeechSpeed] = useState<SpeechSpeed>(() => (localStorage.getItem('bhasha-shala-speech-speed') as SpeechSpeed) || 'Normal');
  const [theme, setTheme] = useState<ThemeMode>(() => (localStorage.getItem('bhasha-shala-theme') as ThemeMode) || 'Light');
  const [textSize, setTextSize] = useState<TextSize>(() => (localStorage.getItem('bhasha-shala-text-size') as TextSize) || 'Normal');

  useEffect(() => { localStorage.setItem('bhasha-shala-app-lang', appLang); }, [appLang]);
  useEffect(() => { localStorage.setItem('bhasha-shala-learning-lang', learningLang); }, [learningLang]);
  useEffect(() => { localStorage.setItem('bhasha-shala-voice-on', String(voiceOn)); }, [voiceOn]);
  useEffect(() => { localStorage.setItem('bhasha-shala-speech-speed', speechSpeed); }, [speechSpeed]);

  useEffect(() => {
    localStorage.setItem('bhasha-shala-theme', theme);
    const root = document.documentElement;
    if (theme === 'Dark') {
      root.classList.add('dark');
    } else if (theme === 'Light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) root.classList.add('dark');
      else root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('bhasha-shala-text-size', textSize);
    const root = document.documentElement;
    if (textSize === 'Large') {
      root.style.fontSize = '18px';
      root.classList.add('text-size-large');
    } else {
      root.style.fontSize = '16px';
      root.classList.remove('text-size-large');
    }
  }, [textSize]);

  const t = (key: string): string => {
    const dict = UI_TRANSLATIONS[appLang] || UI_TRANSLATIONS['English'];
    return dict[key] || UI_TRANSLATIONS['English'][key] || key;
  };

  return (
    <SettingsContext.Provider
      value={{
        appLang,
        setAppLang,
        learningLang,
        setLearningLang,
        voiceOn,
        setVoiceOn,
        speechSpeed,
        setSpeechSpeed,
        theme,
        setTheme,
        textSize,
        setTextSize,
        t,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
