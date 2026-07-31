import React, { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Worker, Project, Allocation, DayOfWeek, AllocationViewMode } from '../types';
import { Search, GripVertical, Briefcase, Wrench, Zap, HardHat, UserPlus, Filter, ChevronUp, ChevronDown, X, Building2, Calendar, CheckCircle2 } from 'lucide-react';

interface WorkerSidebarProps {
  workers?: Worker[];
  projects?: Project[];
  allocations?: Allocation[];
  selectedWorkerId?: number | null;
  activeDragsMap?: Record<number, { user_name: string; user_role: string }>;
  viewMode?: AllocationViewMode;
  selectedDate?: string;
  selectedWeekStart?: string;
  selectedMonth?: string;
  onAllocateWorkerDirectly?: (worker: Worker, projectId: number, day: DayOfWeek) => void;
  onOpenAddWorkerModal?: () => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Helper to return appropriate trade icon
export const getTradeIcon = (trade: string) => {
  const normalized = trade.toLowerCase();
  if (normalized.includes('foreman')) return <Briefcase className="w-3.5 h-3.5 text-amber-600 inline" />;
  if (normalized.includes('carpenter')) return <Wrench className="w-3.5 h-3.5 text-amber-700 inline" />;
  if (normalized.includes('electrician')) return <Zap className="w-3.5 h-3.5 text-[#e67e22] inline" />;
  return <HardHat className="w-3.5 h-3.5 text-slate-600 inline" />;
};

// Draggable Worker Card Component
const DraggableWorkerCard: React.FC<{
  worker: Worker;
  isSelected?: boolean;
  isFullyAssigned?: boolean;
  isPartiallyAssigned?: boolean;
  assignedSiteLabel?: string;
  fullSiteList?: string;
  activeDragsMap?: Record<number, { user_name: string; user_role: string }>;
  onOpenAssignModal?: (worker: Worker) => void;
}> = ({ worker, isSelected = false, isFullyAssigned = false, isPartiallyAssigned = false, assignedSiteLabel, fullSiteList, activeDragsMap = {}, onOpenAssignModal }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `worker-${worker.id}`,
    data: { worker }
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.4 : 1,
      }
    : undefined;

  const otherUserDragging = activeDragsMap[worker.id];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-3 rounded-xl border shadow-sm transition-all flex items-center justify-between cursor-grab active:cursor-grabbing select-none group ${
        isDragging
          ? 'ring-2 ring-brandOrange-500 opacity-50 bg-white'
          : isSelected
          ? 'ring-2 ring-brandOrange-500 bg-amber-50/90 border-brandOrange-400 shadow-md scale-[1.01]'
          : otherUserDragging
          ? 'ring-2 ring-amber-500 bg-amber-50/90 border-amber-300 shadow-md'
          : isFullyAssigned
          ? 'bg-sky-50/60 border-sky-200 hover:bg-sky-50 hover:shadow-md'
          : isPartiallyAssigned
          ? 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50 hover:shadow-md'
          : 'bg-white hover:bg-slate-50 border-slate-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Grip Handle */}
        <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />

        {/* Profile Avatar */}
        <img
          src={
            worker.profile_photo_url ||
            'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=120&q=80'
          }
          alt={worker.name}
          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
        />

        {/* Worker Info */}
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-slate-800 group-hover:text-slate-900 truncate">
            {worker.name}
          </h4>
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 truncate">
            {getTradeIcon(worker.trade)}
            <span className="truncate">{worker.trade}</span>
          </div>

          {/* Live Drag Ghosting Presence Indicator */}
          {otherUserDragging ? (
            <div className="mt-1 flex items-center gap-1 text-[9px] font-black text-amber-900 bg-amber-200/90 px-1.5 py-0.5 rounded-md w-fit animate-pulse border border-amber-300">
              <span>⚡ {otherUserDragging.user_name} ({otherUserDragging.user_role}) dragging...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
              {isFullyAssigned ? (
                <span
                  title={fullSiteList}
                  className="font-extrabold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded-md border border-sky-300 truncate cursor-help"
                >
                  {assignedSiteLabel ? `Assigned (${assignedSiteLabel})` : 'Assigned'}
                </span>
              ) : isPartiallyAssigned ? (
                <span
                  title={fullSiteList}
                  className="font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md border border-emerald-300 truncate cursor-help"
                >
                  {assignedSiteLabel || 'Available'}
                </span>
              ) : (
                <span
                  title={fullSiteList}
                  className="font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200"
                >
                  Available
                </span>
              )}
              <span>•</span>
              <span className="font-semibold text-slate-500">{worker.skill_level || 'Experienced'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Assign Action Button (Mobile View Exclusive: <768px) */}
      {onOpenAssignModal && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenAssignModal(worker);
          }}
          title="Assign Worker to Site Project"
          className="md:hidden ml-2 px-2.5 py-1 rounded-lg bg-brandOrange-500 hover:bg-brandOrange-600 active:scale-95 text-white font-extrabold text-[11px] shrink-0 shadow-sm transition-all cursor-pointer flex items-center gap-1"
        >
          <span>Assign</span>
        </button>
      )}
    </div>
  );
};

export const WorkerSidebar: React.FC<WorkerSidebarProps> = ({
  workers = [],
  projects = [],
  allocations = [],
  selectedWorkerId,
  activeDragsMap = {},
  viewMode = 'week',
  selectedDate = '2026-07-27',
  selectedWeekStart = '2026-07-27',
  selectedMonth = '2026-07',
  onAllocateWorkerDirectly,
  onOpenAddWorkerModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Quick Assign Modal State
  const [workerToAssign, setWorkerToAssign] = useState<Worker | null>(null);
  const [selectedSiteId, setSelectedSiteId] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Monday');

  const activeProjects = projects.filter((p) => !p.name.includes('[Add Site]'));

  useEffect(() => {
    if (activeProjects.length > 0 && selectedSiteId === 0) {
      setSelectedSiteId(activeProjects[0].id);
    }
  }, [projects]);

  // Helper to determine if worker is allocated under active view filter
  const getWorkerAllocationInfo = (workerId: number) => {
    if (!allocations || allocations.length === 0) {
      return { isFullyAssigned: false, isPartiallyAssigned: false, siteLabel: 'Available', fullSiteList: 'Available for allocation' };
    }

    let matchingAllocs: Allocation[] = [];

    if (viewMode === 'day') {
      const targetDay: DayOfWeek = (['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(selectedDate).getDay()]) as DayOfWeek;
      matchingAllocs = allocations.filter(
        (a) => a.worker_id === workerId && (a.allocation_date === selectedDate || a.day_of_week === targetDay)
      );

      if (matchingAllocs.length === 0) {
        return { isFullyAssigned: false, isPartiallyAssigned: false, siteLabel: 'Available', fullSiteList: 'Available for allocation on this date' };
      }

      const site = projects.find((p) => p.id === matchingAllocs[0].project_id);
      const siteName = site ? (site.site_number ? `Site ${site.site_number}` : site.name) : matchingAllocs[0].project_name || 'Site';
      return { isFullyAssigned: true, isPartiallyAssigned: false, siteLabel: siteName, fullSiteList: `Assigned to ${siteName}` };
    }

    if (viewMode === 'week') {
      const startDate = new Date(selectedWeekStart);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];

      matchingAllocs = allocations.filter((a) => {
        if (a.worker_id !== workerId) return false;
        if (a.allocation_date) {
          const cleanDate = a.allocation_date.split('T')[0];
          return cleanDate >= startStr && cleanDate <= endStr;
        }
        return true;
      });

      // Count unique assigned days
      const assignedDaysSet = new Set<string>();
      matchingAllocs.forEach((a) => {
        if (a.allocation_date) assignedDaysSet.add(a.allocation_date.split('T')[0]);
        else if (a.day_of_week) assignedDaysSet.add(a.day_of_week);
      });
      const daysCount = assignedDaysSet.size;

      if (daysCount === 0) {
        return { isFullyAssigned: false, isPartiallyAssigned: false, siteLabel: 'Available', fullSiteList: 'Available - 7 Days Open' };
      }

      const siteNamesSet = new Set<string>();
      matchingAllocs.forEach((a) => {
        const site = projects.find((p) => p.id === a.project_id);
        const name = site ? (site.site_number ? `Site ${site.site_number}` : site.name) : a.project_name || 'Site';
        siteNamesSet.add(name);
      });
      const uniqueSites = Array.from(siteNamesSet);

      if (daysCount < 7) {
        return {
          isFullyAssigned: false,
          isPartiallyAssigned: true,
          siteLabel: `Available (${daysCount}/7 Days)`,
          fullSiteList: `Assigned ${daysCount}/7 Days (${uniqueSites.join(', ')}) • ${7 - daysCount} Days Open`
        };
      }

      const siteLabel = uniqueSites.length === 1 ? uniqueSites[0] : `${uniqueSites.length} Sites`;
      return {
        isFullyAssigned: true,
        isPartiallyAssigned: false,
        siteLabel,
        fullSiteList: `Fully Assigned (7/7 Days): ${uniqueSites.join(', ')}`
      };
    }

    if (viewMode === 'month') {
      matchingAllocs = allocations.filter((a) => {
        if (a.worker_id !== workerId) return false;
        if (a.allocation_date) {
          return a.allocation_date.startsWith(selectedMonth);
        }
        return true;
      });

      if (matchingAllocs.length === 0) {
        return { isFullyAssigned: false, isPartiallyAssigned: false, siteLabel: 'Available', fullSiteList: 'Available for allocation this month' };
      }

      const siteNamesSet = new Set<string>();
      matchingAllocs.forEach((a) => {
        const site = projects.find((p) => p.id === a.project_id);
        const name = site ? (site.site_number ? `Site ${site.site_number}` : site.name) : a.project_name || 'Site';
        siteNamesSet.add(name);
      });
      const uniqueSites = Array.from(siteNamesSet);

      return {
        isFullyAssigned: true,
        isPartiallyAssigned: false,
        siteLabel: `${matchingAllocs.length} Shifts`,
        fullSiteList: `Assigned to ${matchingAllocs.length} shifts across ${uniqueSites.join(', ')}`
      };
    }

    return { isFullyAssigned: false, isPartiallyAssigned: false, siteLabel: 'Available', fullSiteList: 'Available' };
  };

  const unassignedWorkers = workers.filter((w) => !getWorkerAllocationInfo(w.id).isFullyAssigned);

  // Extract unique trade, skill, and status values
  const trades = Array.from(new Set(workers.map((w) => w.trade))).filter(Boolean);
  const skills = Array.from(new Set(workers.map((w) => w.skill_level || 'Experienced'))).filter(Boolean);
  const statuses = ['Available', 'Assigned'];

  const filteredWorkers = workers.filter((w) => {
    const allocInfo = getWorkerAllocationInfo(w.id);
    
    // Remove worker's card if the status is assigned
    if (allocInfo.isFullyAssigned) return false;

    const currentComputedStatus = 'Available';

    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.trade.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTrade = !selectedTrade || w.trade.toLowerCase() === selectedTrade.toLowerCase();
    const matchesSkill = !selectedSkill || (w.skill_level || 'Experienced').toLowerCase() === selectedSkill.toLowerCase();
    const matchesStatus = !selectedStatus || currentComputedStatus.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesTrade && matchesSkill && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTrade('');
    setSelectedSkill('');
    setSelectedStatus('');
  };

  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (workerToAssign && selectedSiteId && onAllocateWorkerDirectly) {
      onAllocateWorkerDirectly(workerToAssign, selectedSiteId, selectedDay);
      setWorkerToAssign(null);
      setIsMobileOpen(false);
    }
  };

  const hasActiveFilters = Boolean(searchTerm || selectedTrade || selectedSkill || selectedStatus);

  return (
    <>
      {/* Mobile Bottom Toggle Bar (<768px): Placed at bottom-0 z-40 for 100% visibility */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#162740] border-t border-[#21385c] px-4 py-2.5 flex items-center justify-between shadow-2xl">
        <button
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="flex items-center gap-2 text-white font-bold text-xs cursor-pointer w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="tracking-wide">AVAILABLE WORKERS POOL ({unassignedWorkers.length}/{workers.length})</span>
          </span>
          {isMobileOpen ? <ChevronDown className="w-4 h-4 text-brandOrange-400" /> : <ChevronUp className="w-4 h-4 text-brandOrange-400" />}
        </button>
      </div>

      {/* Mobile Drawer Backdrop Mask (<768px) */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* Sidebar Container: Responsive Drawer on Mobile, Fixed Panel on Desktop */}
      <aside
        className={`bg-[#f4f6fa] border-r border-slate-200 flex flex-col select-none shrink-0 transition-all ${
          isMobileOpen
            ? 'fixed inset-x-0 bottom-0 top-16 z-50 w-full rounded-t-2xl shadow-2xl'
            : 'hidden md:flex md:w-72 md:h-full'
        }`}
      >
        {/* Sidebar Title & Add Button */}
        <div className="p-4 pb-3 border-b border-slate-200 bg-white rounded-t-2xl md:rounded-none">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-700 tracking-wider uppercase">
              AVAILABLE WORKERS ({unassignedWorkers.length}/{workers.length})
            </h2>
            <div className="flex items-center gap-2">
              {onOpenAddWorkerModal && (
                <button
                  onClick={onOpenAddWorkerModal}
                  title="Add New Worker"
                  className="p-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              )}
              {/* Mobile Close Button */}
              {isMobileOpen && (
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 md:hidden transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative mb-2.5">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search workers or trade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brandOrange-500 focus:bg-white"
            />
          </div>

          {/* Interactive Filter Dropdowns */}
          <div className="grid grid-cols-3 gap-1 text-[10px]">
            <select
              value={selectedTrade}
              onChange={(e) => setSelectedTrade(e.target.value)}
              className="p-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium focus:ring-1 focus:ring-brandOrange-500 focus:outline-none cursor-pointer"
            >
              <option value="">All Trades</option>
              {trades.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="p-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium focus:ring-1 focus:ring-brandOrange-500 focus:outline-none cursor-pointer"
            >
              <option value="">All Skills</option>
              {skills.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-1 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium focus:ring-1 focus:ring-brandOrange-500 focus:outline-none cursor-pointer"
            >
              <option value="">Status</option>
              {statuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-2 text-[10px] text-brandOrange-600 hover:text-brandOrange-700 font-bold flex items-center gap-1 transition-colors"
            >
              <Filter className="w-3 h-3" /> Clear Active Filters
            </button>
          )}
        </div>

        {/* Worker List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredWorkers.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No matching workers found.
            </div>
          ) : (
            filteredWorkers.map((worker) => {
              const allocInfo = getWorkerAllocationInfo(worker.id);

              return (
                <DraggableWorkerCard
                  key={worker.id}
                  worker={worker}
                  isSelected={selectedWorkerId === worker.id}
                  isFullyAssigned={allocInfo.isFullyAssigned}
                  isPartiallyAssigned={allocInfo.isPartiallyAssigned}
                  assignedSiteLabel={allocInfo.siteLabel}
                  fullSiteList={allocInfo.fullSiteList}
                  activeDragsMap={activeDragsMap}
                  onOpenAssignModal={(w) => setWorkerToAssign(w)}
                />
              );
            })
          )}
        </div>
      </aside>

      {/* Mobile Quick-Assign Modal */}
      {workerToAssign && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#162740] border border-[#21385c] rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-white">
            <button
              onClick={() => setWorkerToAssign(null)}
              className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img
                src={
                  workerToAssign.profile_photo_url ||
                  'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=120&q=80'
                }
                alt={workerToAssign.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-brandOrange-500 shrink-0"
              />
              <div>
                <h3 className="text-base font-black text-white">{workerToAssign.name}</h3>
                <p className="text-xs text-slate-400 font-semibold">{workerToAssign.trade} • Quick Assign</p>
              </div>
            </div>

            <form onSubmit={handleConfirmAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-brandOrange-400" /> Select Construction Site
                </label>
                <select
                  value={selectedSiteId}
                  onChange={(e) => setSelectedSiteId(Number(e.target.value))}
                  className="w-full bg-[#0d1829] border border-[#21385c] rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brandOrange-500 cursor-pointer"
                >
                  {activeProjects.map((p, idx) => (
                    <option key={p.id} value={p.id}>
                      Site {p.site_number || idx + 1}: &quot;{p.name}&quot;
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" /> Select Shift Day
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                  className="w-full bg-[#0d1829] border border-[#21385c] rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d} (7:00 AM - 4:00 PM)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setWorkerToAssign(null)}
                  className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brandOrange-500 hover:bg-brandOrange-600 text-xs font-bold text-white shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Assign Worker to Site</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
