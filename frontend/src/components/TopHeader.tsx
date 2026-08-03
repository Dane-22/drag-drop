import React from 'react';
import { Bell, LogOut, User, Menu, Calendar, ChevronLeft, ChevronRight, Sun, CalendarDays, CalendarRange } from 'lucide-react';
import type { AuthUser, NavPageId } from '../types/auth';
import type { AllocationViewMode } from '../types';

interface TopHeaderProps {
  currentUser?: AuthUser | null;
  activePage?: NavPageId;
  viewMode?: AllocationViewMode;
  onSelectViewMode?: (mode: AllocationViewMode) => void;
  selectedDate?: string;
  onSelectDate?: (dateStr: string) => void;
  selectedWeekStart?: string;
  onSelectWeekStart?: (weekStartStr: string) => void;
  selectedMonth?: string;
  onSelectMonth?: (monthStr: string) => void;
  onLogout?: () => void;
  isNavVisible?: boolean;
  onToggleNav?: () => void;
}

const getTodayString = () => new Date().toISOString().split('T')[0];
const getStartOfWeekStr = () => {
  const d = new Date();
  const day = d.getDay();
  return new Date(d.setDate(d.getDate() - day + (day === 0 ? -6 : 1))).toISOString().split('T')[0];
};
const getCurrentMonthStr = () => new Date().toISOString().slice(0, 7);

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  activePage = 'site_allocation',
  viewMode = 'week',
  onSelectViewMode,
  selectedDate = getTodayString(),
  onSelectDate,
  selectedWeekStart = getStartOfWeekStr(),
  onSelectWeekStart,
  selectedMonth = getCurrentMonthStr(),
  onSelectMonth,
  onLogout,
  isNavVisible = true,
  onToggleNav
}) => {
  const getPageTitle = (page: NavPageId) => {
    switch (page) {
      case 'employee_list':
        return 'EMPLOYEE & PERSONNEL DIRECTORY';
      case 'site_management':
        return 'CONSTRUCTION SITE MANAGEMENT PORTAL';
      case 'settings':
        return 'SYSTEM PREFERENCES & CONFIGURATION';
      case 'documents':
        return 'DOCUMENTS & BLUEPRINT REPOSITORY';
      case 'user_management':
        return 'SUPER ADMIN USER MANAGEMENT';
      case 'site_allocation':
      default:
        return 'SITE ALLOCATION & PLANNING GRID';
    }
  };

  const getRoleColor = (role?: string) => {
    if (role === 'super_admin') return 'bg-purple-600 border-purple-400 text-white';
    if (role === 'admin') return 'bg-sky-600 border-sky-400 text-white';
    return 'bg-amber-600 border-amber-400 text-white';
  };

  // Dynamically generated week options
  const weekOptions = React.useMemo(() => {
    const options = [];
    const date = new Date();
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const currentWeekStart = new Date(date.setDate(diff));
    
    for (let i = -1; i < 4; i++) {
      const start = new Date(currentWeekStart);
      start.setDate(start.getDate() + (i * 7));
      
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      
      const value = start.toISOString().split('T')[0];
      const startLabel = start.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      const endLabel = end.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      const year = start.getFullYear();
      
      let prefix = `Week ${i + 1}`;
      if (i === -1) prefix = 'Last Week';
      if (i === 0) prefix = 'Current Week';
      if (i === 1) prefix = 'Next Week';
      if (i === 2) prefix = 'Week 3';
      if (i === 3) prefix = 'Week 4';
      
      const label = `${prefix} (${startLabel} – ${endLabel}, ${year})`;
      options.push({ value, label });
    }
    return options;
  }, []);

  // Dynamically generated month options
  const monthOptions = React.useMemo(() => {
    const options = [];
    const currentMonth = new Date();
    currentMonth.setDate(1);
    
    for (let i = -1; i < 4; i++) {
      const d = new Date(currentMonth);
      d.setMonth(d.getMonth() + i);
      
      const value = d.toISOString().slice(0, 7);
      const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    return options;
  }, []);

  // Helper for step day in Day View Mode
  const handleStepDay = (delta: number) => {
    if (!onSelectDate) return;
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    onSelectDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="flex flex-col select-none shrink-0">
      {/* Upper Navigation Header */}
      <header className="h-16 bg-[#162740] border-b border-[#21385c] px-3 sm:px-6 flex items-center justify-between gap-2">
        {/* Left Side: Hamburger Menu Button & Title & Board Subtitle with Date Navigation */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Hamburger Menu Toggle Button */}
          {onToggleNav && (
            <button
              onClick={onToggleNav}
              title={isNavVisible ? 'Minimize / Hide Side Navigation' : 'Show Side Navigation Rail'}
              className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                !isNavVisible
                  ? 'bg-brandOrange-500 border-brandOrange-400 text-white shadow-lg shadow-brandOrange-500/30 animate-pulse'
                  : 'bg-[#1e3456] border-[#2a4773] text-slate-300 hover:text-white hover:bg-[#253e66]'
              }`}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="min-w-0 flex flex-col justify-center">
            <h1 className="text-xs sm:text-base md:text-lg font-extrabold text-white tracking-wider truncate">
              {getPageTitle(activePage)}
            </h1>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-slate-300 mt-0.5 truncate">
              {/* View Mode Filter Segmented Tabs (Only shown on Site Allocation Grid) */}
              {activePage === 'site_allocation' && onSelectViewMode && (
                <div className="inline-flex items-center bg-[#0e1a2b] border border-[#21385c] rounded-lg p-0.5 shadow-inner shrink-0">
                  <button
                    onClick={() => onSelectViewMode('day')}
                    className={`px-2 py-0.5 rounded-md font-bold flex items-center gap-1 transition-all cursor-pointer text-[10px] ${
                      viewMode === 'day'
                        ? 'bg-brandOrange-500 text-white shadow-sm font-extrabold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Single Day View Mode"
                  >
                    <Sun className="w-3 h-3" />
                    <span>Day</span>
                  </button>
                  <button
                    onClick={() => onSelectViewMode('week')}
                    className={`px-2 py-0.5 rounded-md font-bold flex items-center gap-1 transition-all cursor-pointer text-[10px] ${
                      viewMode === 'week'
                        ? 'bg-brandOrange-500 text-white shadow-sm font-extrabold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="7-Day Weekly Matrix View Mode"
                  >
                    <CalendarDays className="w-3 h-3" />
                    <span>Week</span>
                  </button>
                  <button
                    onClick={() => onSelectViewMode('month')}
                    className={`px-2 py-0.5 rounded-md font-bold flex items-center gap-1 transition-all cursor-pointer text-[10px] ${
                      viewMode === 'month'
                        ? 'bg-brandOrange-500 text-white shadow-sm font-extrabold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Monthly Overview View Mode"
                  >
                    <CalendarRange className="w-3 h-3" />
                    <span>Month</span>
                  </button>
                </div>
              )}

              {/* Dynamic Date Control based on Active View Mode */}
              {activePage === 'site_allocation' && viewMode === 'day' && (
                <div className="inline-flex items-center bg-[#1e3456] border border-[#2a4773] rounded-lg px-2 py-0.5 text-white gap-1 shadow-sm">
                  <button onClick={() => handleStepDay(-1)} className="hover:text-brandOrange-400 transition-colors cursor-pointer">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => onSelectDate && onSelectDate(e.target.value)}
                    className="bg-transparent text-white font-bold text-[10px] sm:text-xs focus:outline-none cursor-pointer"
                  />
                  <button onClick={() => handleStepDay(1)} className="hover:text-brandOrange-400 transition-colors cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {activePage === 'site_allocation' && viewMode === 'week' && (
                <div className="inline-flex items-center bg-[#1e3456] border border-[#2a4773] rounded-lg px-2 py-0.5 text-white gap-1.5 shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-brandOrange-400 shrink-0" />
                  <select
                    value={selectedWeekStart}
                    onChange={(e) => onSelectWeekStart && onSelectWeekStart(e.target.value)}
                    className="bg-transparent text-white font-bold text-[10px] sm:text-xs focus:outline-none cursor-pointer pr-1"
                  >
                    {weekOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#162740] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {activePage === 'site_allocation' && viewMode === 'month' && (
                <div className="inline-flex items-center bg-[#1e3456] border border-[#2a4773] rounded-lg px-2 py-0.5 text-white gap-1.5 shadow-sm">
                  <CalendarRange className="w-3.5 h-3.5 text-brandOrange-400 shrink-0" />
                  <select
                    value={selectedMonth}
                    onChange={(e) => onSelectMonth && onSelectMonth(e.target.value)}
                    className="bg-transparent text-white font-bold text-[10px] sm:text-xs focus:outline-none cursor-pointer pr-1"
                  >
                    {monthOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-[#162740] text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Profile Controls */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">

          {/* Right Tools & Active User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button title="Notifications" className="p-1.5 sm:p-2 text-slate-300 hover:text-white hover:bg-[#1e3456] rounded-lg relative transition-colors cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-brandOrange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-[#162740]">
                1
              </span>
            </button>

            {/* Active Logged In User Pill */}
            <div className="flex items-center gap-2 bg-[#1e3456] border border-[#2a4773] px-2 sm:px-3 py-1 rounded-xl">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-brandOrange-500 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>

              {/* Full Name & Role badge (Hidden on ultra-small screens <480px, shown on sm+) */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                  {currentUser?.name || 'Authorized User'}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-black uppercase border ${getRoleColor(currentUser?.role)}`}>
                    {currentUser?.role || 'ENGINEER'}
                  </span>
                </div>
              </div>

              {/* Role badge pill for mobile screens (<480px) */}
              <span className={`sm:hidden px-1.5 py-0.5 rounded text-[9px] font-black uppercase border ${getRoleColor(currentUser?.role)}`}>
                {currentUser?.role?.charAt(0).toUpperCase() || 'E'}
              </span>

              {/* Logout Button */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Sign Out of Portal"
                  className="ml-1 sm:ml-2 p-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-600/50 text-rose-200 transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

    </div>
  );
};
