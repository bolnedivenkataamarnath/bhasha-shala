import React, { useState } from 'react';
import { Navbar } from '../common/Navbar';
import { Sidebar } from '../common/Sidebar';
import type { NavTab } from '../../types';
interface AppLayoutProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  selectedLanguage: string;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeTab,
  onSelectTab,
  isOnline,
  onToggleOnline,
  selectedLanguage,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        isOnline={isOnline}
        onToggleOnline={onToggleOnline}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        selectedLanguage={selectedLanguage}
      />

      {/* Main layout body */}
      <div className="flex-1 flex w-full max-w-(--breakpoint-2xl) mx-auto overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-slate-50">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
