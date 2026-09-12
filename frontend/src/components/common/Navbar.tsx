import React from 'react';
import { Menu, BookOpen, Languages, Sparkles, GraduationCap } from 'lucide-react';
import { NetworkBadge } from './NetworkBadge';

interface NavbarProps {
  isOnline: boolean;
  onToggleOnline: () => void;
  onToggleSidebar: () => void;
  selectedLanguage: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  isOnline,
  onToggleOnline,
  onToggleSidebar,
  selectedLanguage,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-3 bg-white border-b border-slate-200 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-slate-600 rounded-lg hover:bg-slate-100 lg:hidden focus:outline-hidden"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">
                Anuvad<span className="text-indigo-600">Shiksha</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-150">
                <Sparkles className="w-3 h-3 text-indigo-500" /> SIH26042
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-500 font-medium">
              Vernacular Primary Education Platform
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Vernacular Language Selector Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">
          <Languages className="w-4 h-4 text-indigo-600" />
          <span>Vernacular Target:</span>
          <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-bold">
            {selectedLanguage}
          </span>
        </div>

        {/* Teacher Mode Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
          <GraduationCap className="w-4 h-4 text-amber-700" />
          <span className="hidden md:inline">Teacher Console</span>
          <span className="md:hidden">Teacher</span>
        </div>

        {/* Network status toggle for demo */}
        <NetworkBadge isOnline={isOnline} onToggleOnline={onToggleOnline} />
      </div>
    </header>
  );
};
