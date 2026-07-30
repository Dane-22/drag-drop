import React, { useState } from 'react';
import { Settings, Save, Shield, Database } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [realtimeSync, setRealtimeSync] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto select-none font-sans flex flex-col">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" /> System Preferences & Site Configuration
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Configure notification options, WebSocket parameters, and database sync.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#162740] hover:bg-[#1e3456] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Save className="w-4 h-4 text-brandOrange-400" /> Save Settings
        </button>
      </div>

      {savedToast && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-900 text-emerald-100 text-xs font-bold">
          ✨ Settings saved successfully!
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6 max-w-4xl">

        {/* Real-time WebSocket Sync */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-sky-500" /> Real-time WebSocket & Database Sync
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-800">Socket.io Multi-Dispatcher Sync</h4>
                <p className="text-slate-500 text-[11px]">Broadcast live worker transfers across all open browser tabs</p>
              </div>
              <input
                type="checkbox"
                checked={realtimeSync}
                onChange={(e) => setRealtimeSync(e.target.checked)}
                className="w-4 h-4 text-sky-500 rounded cursor-pointer shrink-0"
              />
            </div>
          </div>
        </div>

        {/* Security & Access */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-500" /> Security & JWT Token Expiry
          </h3>

          <div className="text-xs text-slate-600">
            <p>JWT Authorization tokens expire automatically after 24 hours.</p>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Status: Active & Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
