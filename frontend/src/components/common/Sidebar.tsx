import React from 'react';
import {
  LayoutDashboard,
  Languages,
  BookOpenCheck,
  HardDriveDownload,
  Settings,
  GraduationCap,
  X,
  Sparkles,
} from 'lucide-react';
import type { NavTab } from '../../types';
interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: NavTab;
  label: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Overview & quick actions',
    icon: LayoutDashboard,
  },
  {
    id: 'translation',
    label: 'Translation',
    description: 'Hindi/English to Santhali',
    icon: Languages,
    badge: 'AI Core',
  },
  {
    id: 'student',
    label: 'Student Learning',
    description: 'Mother-tongue student mode',
    icon: GraduationCap,
    badge: 'Child-Friendly',
  },
  {
    id: 'lessons',
    label: 'Lessons Library',
    description: 'Saved curriculum & content',
    icon: BookOpenCheck,
  },
  {
    id: 'offline',
    label: 'Offline Content',
    description: 'Cached lessons & media',
    icon: HardDriveDownload,
    badge: 'Rural Ready',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Language & voice preferences',
    icon: Settings,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile/Tablet Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile close bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
          <span className="font-bold text-slate-800 text-sm">Navigation Menu</span>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 rounded-md hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Teaching Tools
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-start gap-3.5 p-3 rounded-xl text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div
                  className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                    isActive ? 'bg-indigo-700/60 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ml-1 ${
                          isActive
                            ? 'bg-indigo-800 text-indigo-100'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs truncate ${
                      isActive ? 'text-indigo-100' : 'text-slate-500'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Banner for Mother-Tongue Learning */}
        <div className="p-3 m-3 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-xs font-bold text-indigo-900">NEP 2020 Aligned</span>
          </div>
          <p className="text-[11px] leading-relaxed text-indigo-700 font-medium">
            Enabling Mother-Tongue Primary Education in Santhali ( Ol Chiki / ᱥᱟᱱᱛᱟᱲᱤ ).
          </p>
        </div>
      </aside>
    </>
  );
};
