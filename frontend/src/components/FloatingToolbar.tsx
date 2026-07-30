import React from 'react';
import { Gauge, Wrench, UserPlus, BarChart3, Settings } from 'lucide-react';
import { ChatWidget } from './ChatWidget';

interface FloatingToolbarProps {
  onOpenAnalytics?: () => void;
  onOpenAddWorker?: () => void;
  onOpenRoster?: () => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onOpenAnalytics,
  onOpenAddWorker,
  onOpenRoster
}) => {
  return (
    <>
      {/* Bottom Center Pill Floating Action Toolbar (Elevated to bottom-14 on mobile to prevent blocking Worker Bar) */}
      <div className="fixed bottom-14 md:bottom-4 left-1/2 -translate-x-1/2 bg-[#162740] border border-[#26416a] text-slate-300 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 shadow-2xl flex items-center gap-4 sm:gap-5 z-30 select-none backdrop-blur-md">
        <button
          onClick={onOpenAnalytics}
          className="hover:text-white p-1 text-brandOrange-500 transition-colors cursor-pointer"
          title="Site Utilization Dashboard"
        >
          <Gauge className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={onOpenAnalytics}
          className="hover:text-white p-1 transition-colors cursor-pointer"
          title="Safety Tools & Equipment"
        >
          <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={onOpenAddWorker}
          className="hover:text-white p-1 transition-colors text-emerald-400 hover:scale-110 cursor-pointer"
          title="Add New Worker to Workforce"
        >
          <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={onOpenRoster}
          className="hover:text-white p-1 transition-colors cursor-pointer"
          title="Workforce Team Roster"
        >
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={onOpenAnalytics}
          className="hover:text-white p-1 transition-colors cursor-pointer"
          title="System Settings"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      {/* Live Chat Support & Assistant Widget */}
      <ChatWidget />
    </>
  );
};
