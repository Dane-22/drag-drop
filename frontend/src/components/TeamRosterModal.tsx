import React from 'react';
import { Users, X, HardHat, Award } from 'lucide-react';
import type { Worker } from '../types';

interface TeamRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  workers: Worker[];
}

export const TeamRosterModal: React.FC<TeamRosterModalProps> = ({
  isOpen,
  onClose,
  workers
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-[#162740] border border-[#2a4773] rounded-2xl w-full max-w-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#21385c] flex items-center justify-between bg-[#192c48]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brandOrange-500/10 text-brandOrange-500">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Workforce Team Roster</h3>
              <p className="text-xs text-slate-400">Total Available Personnel: {workers.length}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#253e66] rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Worker Table List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {workers.map((w) => (
              <div
                key={w.id}
                className="p-3 bg-[#0f1b2d] border border-[#2a4773] rounded-xl flex items-center justify-between shadow-sm hover:border-brandOrange-500/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={
                      w.profile_photo_url ||
                      'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=120&q=80'
                    }
                    alt={w.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#2a4773]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{w.name}</h4>
                    <div className="flex items-center gap-1 text-[11px] text-brandOrange-500 font-medium">
                      <HardHat className="w-3 h-3" />
                      <span>{w.trade}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1e3456] text-slate-200 border border-[#2a4773] inline-flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    {w.skill_level || 'Licensed'}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1">{w.experience || '5 yrs Exp.'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#21385c] bg-[#192c48] text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#253e66] hover:bg-[#2e4c7e] text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close Roster
          </button>
        </div>
      </div>
    </div>
  );
};
