import React, { useState, useRef, useEffect } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import type { Project, Worker, Allocation, DayOfWeek } from '../types';
import { getTradeIcon } from './WorkerSidebar';
import { X, Plus, GripVertical, MoreVertical, Eye } from 'lucide-react';
import { PaginationBar } from './PaginationBar';
import { MonthDetailsModal } from './MonthDetailsModal';

import type { AllocationViewMode } from '../types';

interface SiteAllocationGridProps {
  projects?: Project[];
  workers?: Worker[];
  allocations?: Allocation[];
  activeId?: string | null;
  activeDragsMap?: Record<number, { user_name: string; user_role: string }>;
  viewMode?: AllocationViewMode;
  selectedDate?: string;
  selectedWeekStart?: string;
  selectedMonth?: string;
  selectedAllocId?: number | null;
  onSelectAllocCard?: (id: number | null) => void;
  onRemoveAllocation?: (allocationId: number) => void;
  onToggleStatus?: (allocationId: number) => void;
  onOpenAddSiteModal?: () => void;
  onViewWorkerProfile?: (worker: Worker) => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const getDayDateInfo = (weekStartStr: string, dayIndex: number) => {
  const startDate = new Date(weekStartStr);
  const targetDate = new Date(startDate);
  targetDate.setDate(startDate.getDate() + dayIndex);

  const isoDate = targetDate.toISOString().split('T')[0];
  const shortMonth = targetDate.toLocaleDateString('en-US', { month: 'short' });
  const dateNum = targetDate.getDate();

  return { isoDate, label: `${shortMonth} ${dateNum}` };
};

// Draggable Allocated Worker Card in Grid Cell
const DraggableAllocatedCard: React.FC<{
  alloc: Allocation;
  isSelected?: boolean;
  activeDragsMap?: Record<number, { user_name: string; user_role: string }>;
  onSelect?: () => void;
  onRemoveAllocation?: (id: number) => void;
  onViewProfile?: () => void;
}> = ({ alloc, isSelected = false, activeDragsMap = {}, onSelect, onRemoveAllocation, onViewProfile }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `alloc-${alloc.id}`,
    data: { worker: { id: alloc.worker_id, name: alloc.worker_name, trade: alloc.worker_trade } }
  });

  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const kebabRef = useRef<HTMLDivElement>(null);

  // Close kebab menu on outside click
  useEffect(() => {
    if (!isKebabOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (kebabRef.current && !kebabRef.current.contains(e.target as Node)) {
        setIsKebabOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isKebabOpen]);

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      opacity: isDragging ? 0.9 : 1,
      zIndex: isDragging ? 50 : 1
    }
    : undefined;

  const otherUserDragging = activeDragsMap[alloc.worker_id];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        if (onSelect) onSelect();
      }}
      className={`group/card p-1.5 rounded-xl border transition-all flex items-center justify-between gap-1 select-none cursor-grab active:cursor-grabbing relative ${isDragging
          ? 'ring-4 ring-brandOrange-500 shadow-2xl opacity-90 scale-105 border-brandOrange-500 bg-white z-50'
          : isSelected
            ? 'ring-2 ring-brandOrange-500 shadow-lg shadow-brandOrange-500/20 bg-amber-50/90 border-brandOrange-400 border-l-4 border-l-brandOrange-600 scale-[1.02]'
            : otherUserDragging
              ? 'ring-2 ring-amber-500 bg-amber-50/90 border-amber-300 shadow-md'
              : 'bg-white hover:bg-slate-50 border-slate-200 border-l-4 border-l-brandOrange-500 hover:shadow-md'
        }`}
    >
      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (onRemoveAllocation) onRemoveAllocation(alloc.id);
        }}
        title="Unallocate worker"
        className="opacity-0 group-hover/card:opacity-100 absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center text-xs shadow-md transition-all z-10 cursor-pointer"
      >
        <X className="w-3 h-3 stroke-[3]" />
      </button>

      <div className="flex items-center gap-1.5 overflow-hidden flex-1">
        <GripVertical className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-brandOrange-500 font-extrabold' : 'text-slate-300 group-hover/card:text-slate-500'}`} />
        <img
          src={
            alloc.worker_photo ||
            'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=120&q=80'
          }
          alt={alloc.worker_name || 'Worker'}
          className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
        />
        <div className="truncate">
          <h5 className="text-[11px] font-black text-slate-900 truncate leading-tight">
            {alloc.worker_name || `Worker #${alloc.worker_id}`}
          </h5>
          {otherUserDragging ? (
            <span className="text-[9px] font-black text-amber-900 bg-amber-200 px-1 py-0.2 rounded animate-pulse block truncate">
              ⚡ {otherUserDragging.user_name} dragging...
            </span>
          ) : (
            <div className="flex flex-col mt-0.5">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium truncate">
                {getTradeIcon(alloc.worker_trade || '')}
                <span className="truncate">{alloc.worker_trade || 'Trade'}</span>
              </div>
              {alloc.assigned_by && (
                <div className="text-[9px] text-slate-400 font-medium truncate mt-0.5">
                  ↳ by {alloc.assigned_by}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Kebab Menu */}
      <div ref={kebabRef} className="relative shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsKebabOpen(!isKebabOpen);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="opacity-0 group-hover/card:opacity-100 w-6 h-6 rounded-lg hover:bg-slate-200 flex items-center justify-center transition-all cursor-pointer"
          title="Options"
        >
          <MoreVertical className="w-3.5 h-3.5 text-slate-500" />
        </button>

        {isKebabOpen && (
          <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-xl z-[100] overflow-hidden animate-in fade-in zoom-in-95">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsKebabOpen(false);
                if (onViewProfile) onViewProfile();
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-brandOrange-50 hover:text-brandOrange-700 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              View Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Droppable Cell for a specific Project and Day
const MatrixCell: React.FC<{
  projectId: number;
  day: DayOfWeek;
  targetIsoDate?: string;
  allocations: Allocation[];
  workers?: Worker[];
  selectedAllocId?: number | null;
  activeDragsMap?: Record<number, { user_name: string; user_role: string }>;
  onSelectAllocCard?: (id: number | null) => void;
  onRemoveAllocation?: (id: number) => void;
  onViewWorkerProfile?: (worker: Worker) => void;
}> = ({ projectId, day, targetIsoDate, allocations, workers = [], selectedAllocId, activeDragsMap = {}, onSelectAllocCard, onRemoveAllocation, onViewWorkerProfile }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${projectId}-${day}`,
    data: { projectId, day, allocation_date: targetIsoDate }
  });

  const cellAllocations = allocations.filter((a) => {
    if (a.project_id !== projectId || a.day_of_week !== day) return false;
    if (targetIsoDate && a.allocation_date) {
      const cleanAllocDate = a.allocation_date.includes('T')
        ? a.allocation_date.split('T')[0]
        : a.allocation_date.substring(0, 10);
      return cleanAllocDate === targetIsoDate;
    }
    return true;
  });

  return (
    <td
      ref={setNodeRef}
      className={`p-2 border border-slate-200/80 align-top transition-all min-h-[90px] h-[90px] ${isOver
          ? 'bg-emerald-500/15 border-emerald-500 border-2 border-dashed shadow-lg shadow-emerald-500/20'
          : 'hover:bg-slate-50/50'
        }`}
    >
      <div className="flex flex-col gap-1.5 h-full">
        {isOver && (
          <div className="text-[10px] font-black text-emerald-700 bg-emerald-100 border border-emerald-300 rounded-md py-0.5 px-1.5 text-center animate-pulse tracking-wide shadow-sm">
            🎯 DROP WORKER HERE
          </div>
        )}

        {cellAllocations.map((alloc) => {
          const fullWorker = workers.find((w) => w.id === alloc.worker_id);
          return (
            <DraggableAllocatedCard
              key={alloc.id}
              alloc={alloc}
              isSelected={selectedAllocId === alloc.id}
              activeDragsMap={activeDragsMap}
              onSelect={() => onSelectAllocCard && onSelectAllocCard(selectedAllocId === alloc.id ? null : alloc.id)}
              onRemoveAllocation={onRemoveAllocation}
              onViewProfile={() => {
                if (onViewWorkerProfile && fullWorker) onViewWorkerProfile(fullWorker);
              }}
            />
          );
        })}

        {cellAllocations.length === 0 && !isOver && (
          <div className="h-full flex items-center justify-center text-[11px] text-slate-300 italic border border-dashed border-slate-200/60 rounded-xl p-2 select-none pointer-events-none">
            Drag worker here
          </div>
        )}
      </div>
    </td>
  );
};

export const SiteAllocationGrid: React.FC<SiteAllocationGridProps> = ({
  projects = [],
  workers = [],
  allocations = [],
  activeDragsMap = {},
  viewMode = 'week',
  selectedDate = '2026-07-27',
  selectedWeekStart = '2026-07-27',
  selectedMonth = '2026-07',
  selectedAllocId,
  onSelectAllocCard,
  onRemoveAllocation,
  onOpenAddSiteModal,
  onViewWorkerProfile
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sitesPerPage, setSitesPerPage] = useState(10);
  const [selectedMobileDay, setSelectedMobileDay] = useState<DayOfWeek | 'All'>('All');
  const [selectedMonthProject, setSelectedMonthProject] = useState<Project | null>(null);

  const activeProjects = projects.filter((p) => p.status !== 'Inactive');
  const totalSites = activeProjects.length;
  const totalPages = Math.ceil(totalSites / sitesPerPage);

  const paginatedProjects = activeProjects.slice(
    (currentPage - 1) * sitesPerPage,
    currentPage * sitesPerPage
  );

  const visibleDays = selectedMobileDay === 'All' ? DAYS : [selectedMobileDay];

  // Helper for Single Day View Mode
  const targetSingleDay: DayOfWeek = (['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(selectedDate).getDay()]) as DayOfWeek;
  const singleDayLabel = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  // Calculate filtered allocations for totals
  const getFilteredAllocations = () => {
    return allocations.filter((a) => {
      if (viewMode === 'day') {
        const cleanAllocDate = a.allocation_date?.substring(0, 10);
        return cleanAllocDate === selectedDate;
      } else if (viewMode === 'week') {
        const validDates = visibleDays.map(day => {
          const dayIdx = DAYS.indexOf(day);
          return getDayDateInfo(selectedWeekStart, dayIdx).isoDate;
        });
        const cleanAllocDate = a.allocation_date?.substring(0, 10);
        return cleanAllocDate ? validDates.includes(cleanAllocDate) : false;
      } else if (viewMode === 'month') {
        return a.allocation_date?.startsWith(selectedMonth);
      }
      return true;
    });
  };

  const filteredAllocations = getFilteredAllocations();

  return (
    <main className="flex-1 bg-slate-100 flex flex-col h-full overflow-hidden select-none">
      {/* Mobile Day Filter Selector (<768px - Only in Week View) */}
      {viewMode === 'week' && (
        <div className="md:hidden bg-[#162740] text-white px-3 py-2 border-b border-[#21385c] flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0">
          <span className="font-extrabold text-slate-400 text-[10px] shrink-0 uppercase tracking-wider">Day Filter:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedMobileDay('All')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[10px] transition-colors cursor-pointer ${selectedMobileDay === 'All' ? 'bg-brandOrange-500 text-white' : 'bg-[#1e3456] text-slate-300'
                }`}
            >
              All Days
            </button>
            {DAYS.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedMobileDay(d)}
                className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-colors cursor-pointer ${selectedMobileDay === d ? 'bg-brandOrange-500 text-white' : 'bg-[#1e3456] text-slate-300'
                  }`}
              >
                {d.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scrollable Container with Sticky Table Headers & Sticky Left Columns */}
      <div className="flex-1 overflow-auto min-h-0 pb-28 md:pb-0">
        <table className="w-full border-separate border-spacing-0 min-w-[700px] md:min-w-[960px] text-xs">
          {/* Table Header */}
          <thead className="sticky top-0 z-20 bg-[#162740] text-white">
            <tr className="shadow-md">
              <th className="sticky left-0 z-30 bg-[#162740] p-3 text-center border-b border-r border-[#21385c] w-10 sm:w-12 font-extrabold uppercase text-[10px] tracking-wider text-slate-400">
                #
              </th>
              <th className="sticky left-10 sm:left-12 z-30 bg-[#162740] p-3 text-left border-b border-r border-[#21385c] w-44 sm:w-56 font-extrabold uppercase text-[10px] tracking-wider text-slate-200">
                <div className="flex flex-col">
                  <span>Site Name & Details</span>
                  <span className="text-[11px] text-brandOrange-400 font-black mt-0.5">
                    OVERALL TOTAL: {filteredAllocations.length} SHIFTS
                  </span>
                </div>
              </th>

              {/* Day View Header */}
              {viewMode === 'day' && (
                <th className="p-3 text-center border-b border-r border-[#21385c] font-extrabold text-[11px] tracking-wider text-white">
                  <div className="flex items-center justify-center gap-2">
                    <span className="uppercase text-brandOrange-400 font-black">ASSIGNED WORKERS FOR {singleDayLabel}</span>
                  </div>
                </th>
              )}

              {/* Week View Header */}
              {viewMode === 'week' && visibleDays.map((day) => {
                const dayIdx = DAYS.indexOf(day);
                const dateInfo = getDayDateInfo(selectedWeekStart, dayIdx);

                return (
                  <th
                    key={day}
                    className="p-3 text-center border-b border-r border-[#21385c] font-extrabold text-[10px] tracking-wider text-slate-200 min-w-[160px]"
                  >
                    <div className="flex flex-col items-center leading-tight">
                      <span className="uppercase text-slate-100">{day}</span>
                      <span className="text-[10px] text-brandOrange-400 font-bold mt-0.5">({dateInfo.label})</span>
                    </div>
                  </th>
                );
              })}

              {/* Month View Header */}
              {viewMode === 'month' && (
                <th className="p-3 text-center border-b border-r border-[#21385c] font-extrabold text-[11px] tracking-wider text-white">
                  <span className="uppercase text-emerald-400 font-black">MONTHLY WORKFORCE ALLOCATION SUMMARY ({selectedMonth})</span>
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200 bg-white">
            {paginatedProjects.length === 0 ? (
              <tr>
                <td colSpan={visibleDays.length + 2} className="p-12 text-center text-slate-400 font-medium">
                  No construction sites configured. Click &quot;[Add Site]&quot; to add a new project.
                </td>
              </tr>
            ) : (
              paginatedProjects.map((project, idx) => {
                const isAddSitePlaceholder = project.name.includes('[Add Site]');
                const siteTotal = filteredAllocations.filter(a => a.project_id === project.id).length;

                return (
                  <tr key={`site-row-${project.id}-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                    {/* Site Index Sticky Column */}
                    <td className="sticky left-0 z-10 bg-white border-b border-r border-slate-200 p-3 text-center font-bold text-slate-400">
                      {project.site_number || (currentPage - 1) * sitesPerPage + idx + 1}
                    </td>

                    {/* Site Name Sticky Column */}
                    <td className="sticky left-10 sm:left-12 z-10 bg-white border-b border-r border-slate-200 p-3 font-bold text-slate-900">
                      {isAddSitePlaceholder ? (
                        <button
                          onClick={onOpenAddSiteModal}
                          className="text-brandOrange-600 hover:text-brandOrange-700 flex items-center gap-1.5 transition-colors font-extrabold cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          Site {project.site_number || idx + 1}: [Add Site]
                        </button>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className="truncate max-w-[160px] sm:max-w-none">
                            Site {project.site_number || idx + 1}: &quot;{project.name}&quot;
                          </span>
                          <div className="text-[10px] text-brandOrange-600 font-bold bg-brandOrange-50 px-2 py-0.5 rounded w-max mt-0.5 border border-brandOrange-100">
                            Total Assigned: {siteTotal}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Day View Cell */}
                    {viewMode === 'day' && (
                      <MatrixCell
                        key={`${project.id}-day-${selectedDate}`}
                        projectId={project.id}
                        day={targetSingleDay}
                        targetIsoDate={selectedDate}
                        allocations={allocations}
                        workers={workers}
                        selectedAllocId={selectedAllocId}
                        activeDragsMap={activeDragsMap}
                        onSelectAllocCard={onSelectAllocCard}
                        onRemoveAllocation={onRemoveAllocation}
                        onViewWorkerProfile={onViewWorkerProfile}
                      />
                    )}

                    {/* Week View Cells */}
                    {viewMode === 'week' && visibleDays.map((day) => {
                      const dayIdx = DAYS.indexOf(day);
                      const dateInfo = getDayDateInfo(selectedWeekStart, dayIdx);

                      return (
                        <MatrixCell
                          key={`${project.id}-${day}`}
                          projectId={project.id}
                          day={day}
                          targetIsoDate={dateInfo.isoDate}
                          allocations={allocations}
                          workers={workers}
                          selectedAllocId={selectedAllocId}
                          activeDragsMap={activeDragsMap}
                          onSelectAllocCard={onSelectAllocCard}
                          onRemoveAllocation={onRemoveAllocation}
                          onViewWorkerProfile={onViewWorkerProfile}
                        />
                      );
                    })}

                    {/* Month View Cell */}
                    {viewMode === 'month' && (() => {
                      const monthAllocations = allocations.filter((a) => a.project_id === project.id && (a.allocation_date ? a.allocation_date.startsWith(selectedMonth) : true));
                      
                      // Calculate unique workers
                      const uniqueWorkersMap = new Map();
                      monthAllocations.forEach(a => {
                        if (a.worker_id && !uniqueWorkersMap.has(a.worker_id)) {
                          uniqueWorkersMap.set(a.worker_id, {
                            id: a.worker_id,
                            name: a.worker_name,
                            photo: a.worker_photo,
                            trade: a.worker_trade
                          });
                        }
                      });
                      const uniqueWorkers = Array.from(uniqueWorkersMap.values());
                      
                      // Calculate trade shifts
                      const tradeShifts: Record<string, number> = {};
                      monthAllocations.forEach(a => {
                        const trade = a.worker_trade || 'Unknown';
                        tradeShifts[trade] = (tradeShifts[trade] || 0) + 1;
                      });
                      const tradeEntries = Object.entries(tradeShifts).sort((a, b) => b[1] - a[1]);

                      return (
                        <td 
                          className="p-4 border border-slate-200 bg-slate-50/50 align-middle hover:bg-slate-100/80 transition-colors cursor-pointer group"
                          onClick={() => setSelectedMonthProject(project)}
                          title="Click to view full workforce details"
                        >
                          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm gap-4 group-hover:border-brandOrange-300 group-hover:shadow-md transition-all">
                            
                            {monthAllocations.length === 0 ? (
                              <div className="flex-1 text-slate-400 text-xs italic font-medium px-2">No workforce allocated for this month.</div>
                            ) : (
                              <div className="flex flex-1 items-center gap-6 overflow-x-auto min-w-0 px-2">
                                
                                {/* Avatar Stack */}
                                <div className="flex flex-col gap-1.5 shrink-0">
                                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Crew Members ({uniqueWorkers.length})</span>
                                  <div className="flex -space-x-2 overflow-hidden py-0.5">
                                    {uniqueWorkers.slice(0, 5).map(w => (
                                      <img 
                                        key={w.id} 
                                        src={w.photo || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=120&q=80'} 
                                        alt={w.name} 
                                        title={w.name}
                                        className="inline-block w-8 h-8 rounded-full ring-2 ring-white object-cover shadow-sm bg-slate-100"
                                      />
                                    ))}
                                    {uniqueWorkers.length > 5 && (
                                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full ring-2 ring-white bg-slate-100 text-[10px] font-bold text-slate-500 shadow-sm">
                                        +{uniqueWorkers.length - 5}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Divider */}
                                <div className="w-px h-10 bg-slate-200 shrink-0"></div>

                                {/* Trade Breakdown */}
                                <div className="flex flex-col gap-1.5 min-w-0">
                                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Trade Distribution</span>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {tradeEntries.map(([trade, count]) => (
                                      <div key={trade} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md text-[11px] font-medium text-slate-700 whitespace-nowrap">
                                        {getTradeIcon(trade)} 
                                        <span><span className="font-bold text-brandOrange-600">{count}</span> {trade}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                              </div>
                            )}

                            {/* Total Summary */}
                            <div className="shrink-0 flex flex-col items-end pl-4 border-l border-slate-100">
                              <span className="text-xs font-bold text-slate-800 block">Total Shifts</span>
                              <span className="text-[10px] text-slate-400 font-semibold">{selectedMonth}</span>
                              <div className="mt-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 rounded-lg font-black text-sm">
                                {monthAllocations.length} Shifts
                              </div>
                            </div>
                            
                          </div>
                        </td>
                      );
                    })()}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls Bar */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalSites}
        itemsPerPage={sitesPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(num) => {
          setSitesPerPage(num);
          setCurrentPage(1);
        }}
        itemsPerPageOptions={[5, 10, 15, 20]}
      />

      {/* Month Details Modal */}
      <MonthDetailsModal
        isOpen={!!selectedMonthProject}
        onClose={() => setSelectedMonthProject(null)}
        project={selectedMonthProject}
        allocations={allocations.filter(a => a.project_id === selectedMonthProject?.id && (a.allocation_date ? a.allocation_date.startsWith(selectedMonth) : true))}
        month={selectedMonth}
      />
    </main>
  );
};
