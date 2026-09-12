import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

interface NetworkBadgeProps {
  isOnline: boolean;
  onToggleOnline?: () => void;
}

export const NetworkBadge: React.FC<NetworkBadgeProps> = ({ isOnline, onToggleOnline }) => {
  return (
    <button
      onClick={onToggleOnline}
      title="Click to simulate offline/online mode for testing"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm border ${
        isOnline
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 animate-pulse'
      }`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOnline ? 'bg-emerald-400' : 'bg-rose-400'
          }`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            isOnline ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
        ></span>
      </span>
      <span className="flex items-center gap-1">
        {isOnline ? (
          <>
            <Wifi className="w-3.5 h-3.5" />
            <span>ONLINE</span>
          </>
        ) : (
          <>
            <WifiOff className="w-3.5 h-3.5" />
            <span>OFFLINE MODE</span>
          </>
        )}
      </span>
    </button>
  );
};
