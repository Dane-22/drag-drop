import React from 'react';
import { X, CalendarDays, CalendarClock } from 'lucide-react';
import type { Project, Allocation } from '../types';
import { getTradeIcon } from './WorkerSidebar';

interface MonthDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  allocations: Allocation[];
  month: string;
}

export const MonthDetailsModal: React.FC<MonthDetailsModalProps> = ({
  isOpen,
  onClose,
  project,
  allocations,
  month
}) => {
  if (!isOpen || !project) return null;

  // Group allocations by worker
  const workerMap = new Map<number, {
    id: number;
    name: string;
    photo: string;
    trade: string;
    shifts: { date: string; id: number; dayOfWeek: string }[];
  }>();

  allocations.forEach(a => {
    if (!a.worker_id) return;
    
    if (!workerMap.has(a.worker_id)) {
      workerMap.set(a.worker_id, {
        id: a.worker_id,
        name: a.worker_name || `Worker #${a.worker_id}`,
        photo: a.worker_photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=120&q=80',
        trade: a.worker_trade || 'Unknown',
        shifts: []
      });
    }
    
    if (a.allocation_date) {
      workerMap.get(a.worker_id)!.shifts.push({
        date: a.allocation_date.substring(0, 10),
        id: a.id,
        dayOfWeek: a.day_of_week
      });
    }
  });

  const uniqueWorkers = Array.from(workerMap.values()).sort((a, b) => b.shifts.length - a.shifts.length);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-[#162740] border border-[#2a4773] rounded-2xl w-full max-w-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#21385c] flex items-center justify-between bg-[#192c48] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brandOrange-500/10 text-brandOrange-500 border border-brandOrange-500/20">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide leading-tight">
                {project.name}
              </h3>
              <div className="text-[11px] text-brandOrange-400 font-semibold mt-0.5">
                Workforce Details for {month}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#253e66] rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-1 flex-1 overflow-y-auto min-h-0 bg-[#0a121f]">
          {uniqueWorkers.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium italic">
              No workers assigned to this site in {month}.
            </div>
          ) : (
            <div className="flex flex-col gap-1 p-3">
              {uniqueWorkers.map(worker => {
                // Sort shifts by date
                worker.shifts.sort((a, b) => a.date.localeCompare(b.date));
                
                return (
                  <div key={worker.id} className="bg-[#162740] border border-[#2a4773] rounded-xl p-3 flex flex-col sm:flex-row gap-4 hover:border-[#385b91] transition-colors">
                    {/* Worker Profile Info */}
                    <div className="flex items-center gap-3 sm:w-1/3 shrink-0">
                      <img 
                        src={worker.photo} 
                        alt={worker.name} 
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#2a4773]"
                      />
                      <div className="overflow-hidden">
                        <h4 className="text-sm font-bold text-white truncate">{worker.name}</h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-0.5">
                          {getTradeIcon(worker.trade)}
                          <span className="truncate">{worker.trade}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Shifts Details */}
                    <div className="flex-1 flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-[#2a4773] pt-3 sm:pt-0 sm:pl-4">
                      <div className="flex items-center gap-1.5 mb-2">
                        <CalendarClock className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                          {worker.shifts.length} Assigned Shift{worker.shifts.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {worker.shifts.map(shift => (
                          <div 
                            key={shift.id} 
                            className="text-[10px] bg-[#1e3456] border border-[#2a4773] text-slate-200 px-2 py-1 rounded-md font-medium"
                            title={shift.dayOfWeek}
                          >
                            {shift.date}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
