import React from 'react';
import { X, BarChart3, Users, Building2, CheckCircle2, PieChart } from 'lucide-react';
import type { Worker, Project, Allocation } from '../types';

interface AnalyticsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  workers: Worker[];
  projects: Project[];
  allocations: Allocation[];
}

export const AnalyticsDrawer: React.FC<AnalyticsDrawerProps> = ({
  isOpen,
  onClose,
  workers,
  projects,
  allocations
}) => {
  if (!isOpen) return null;

  const totalAllocated = allocations.length;
  const totalSites = projects.filter((p) => !p.name.includes('[Add Site]')).length;
  const uniqueAllocatedWorkers = new Set(allocations.map((a) => a.worker_id)).size;
  const unallocatedCount = Math.max(0, workers.length - uniqueAllocatedWorkers);
  const utilizationRate = workers.length > 0 ? Math.round((uniqueAllocatedWorkers / workers.length) * 100) : 0;

  // Trade breakdown counts
  const tradeCounts: Record<string, number> = {};
  workers.forEach((w) => {
    tradeCounts[w.trade] = (tradeCounts[w.trade] || 0) + 1;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end select-none animate-fadeIn">
      <div className="w-full max-w-md bg-[#162740] border-l border-[#2a4773] h-full shadow-2xl flex flex-col text-slate-100 overflow-hidden">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#21385c] flex items-center justify-between bg-[#192c48]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brandOrange-500/10 text-brandOrange-500">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Site Utilization Analytics</h3>
              <p className="text-xs text-slate-400">Real-time resource coverage report</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#253e66] rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Metrics */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Key Metric Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0f1b2d] border border-[#2a4773] p-4 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                <PieChart className="w-4 h-4 text-brandOrange-500" />
                Utilization Rate
              </div>
              <div className="text-2xl font-black text-white">{utilizationRate}%</div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-brandOrange-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${utilizationRate}%` }}
                />
              </div>
            </div>

            <div className="bg-[#0f1b2d] border border-[#2a4773] p-4 rounded-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Active Allocations
              </div>
              <div className="text-2xl font-black text-white">{totalAllocated}</div>
              <span className="text-[10px] text-emerald-400 font-medium">{totalSites} active sites coverage</span>
            </div>
          </div>

          {/* Detailed Worker Coverage */}
          <div className="bg-[#0f1b2d] border border-[#2a4773] rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              Workforce Breakdown
            </h4>
            <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800">
              <span className="text-slate-300">Total Available Workers</span>
              <span className="font-bold text-white">{workers.length}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1 border-b border-slate-800">
              <span className="text-slate-300">On-Site Assigned Workers</span>
              <span className="font-bold text-emerald-400">{uniqueAllocatedWorkers}</span>
            </div>
            <div className="flex justify-between items-center text-xs py-1">
              <span className="text-slate-300">Unallocated Standby Pool</span>
              <span className="font-bold text-amber-400">{unallocatedCount}</span>
            </div>
          </div>

          {/* Trade Distribution List */}
          <div className="bg-[#0f1b2d] border border-[#2a4773] rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              Trade Specialization
            </h4>
            <div className="space-y-2">
              {Object.entries(tradeCounts).map(([trade, count]) => (
                <div key={trade} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">{trade}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{count}</span>
                    <span className="text-[10px] text-slate-500">workers</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#21385c] bg-[#192c48] text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-[#253e66] hover:bg-[#2e4c7e] text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
};
