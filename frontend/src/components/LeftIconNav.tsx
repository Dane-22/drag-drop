import React from 'react';
import {
  CalendarDays,
  Building2,
  Users,
  Settings,
  FileText,
  UserPlus,
  PanelLeftClose,
  PanelLeftOpen,
  EyeOff,
  X
} from 'lucide-react';
import type { NavPageId, UserRole } from '../types/auth';

interface LeftIconNavProps {
  userRole: UserRole;
  activePage: NavPageId;
  onSelectPage: (page: NavPageId) => void;
  isVisible: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onHideNav: () => void;
}

export const LeftIconNav: React.FC<LeftIconNavProps> = ({
  userRole,
  activePage,
  onSelectPage,
  isVisible,
  isExpanded,
  onToggleExpand,
  onHideNav
}) => {
  if (!isVisible) return null;

  const isEngineer = userRole === 'engineer';
  const isSuperAdmin = userRole === 'super_admin';

  const handleNavClick = (page: NavPageId) => {
    onSelectPage(page);
    // On mobile screens, auto-collapse sidebar after page selection for clean UX
    if (window.innerWidth < 768) {
      onHideNav();
    }
  };

  return (
    <>
      {/* Mobile Dark Backdrop Mask Overlay (<768px) */}
      <div
        onClick={onHideNav}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
      />

      {/* Navigation Container (Responsive Slide-Out Drawer on Mobile, Fixed Rail on Desktop) */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 md:z-20 bg-[#13233b] border-r border-[#1e3456] flex flex-col justify-between py-4 select-none shrink-0 transition-all duration-300 ease-in-out shadow-2xl md:shadow-none ${
          isExpanded ? 'w-64 md:w-60' : 'w-64 md:w-16'
        }`}
      >
        {/* Top Logo & Controls */}
        <div className="flex flex-col gap-5 w-full">
          {/* Logo & Expand/Minimize Toggle Bar */}
          <div className="flex items-center justify-between px-4 w-full">
            <div
              onClick={() => handleNavClick('site_allocation')}
              className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
              title="Apex Construction Portal"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brandOrange-600 to-brandOrange-500 flex items-center justify-center shadow-lg shadow-brandOrange-500/20 text-white shrink-0">
                <CalendarDays className="w-6 h-6 stroke-[2.5]" />
              </div>

              {(isExpanded || window.innerWidth < 768) && (
                <div className="flex flex-col">
                  <span className="text-xs font-black text-white tracking-wider leading-tight">APEX PORTAL</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Construction Management</span>
                </div>
              )}
            </div>

            {/* Mobile Close Button (<768px) */}
            <button
              onClick={onHideNav}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1c3050] md:hidden transition-colors cursor-pointer"
              title="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop Minimize / Maximize Sidebar Controls (>=768px) */}
            {isExpanded && (
              <div className="hidden md:flex items-center gap-1">
                <button
                  onClick={onToggleExpand}
                  title="Minimize Navigation (Icon Mode)"
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1c3050] transition-colors cursor-pointer"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
                <button
                  onClick={onHideNav}
                  title="Hide Navigation Rail"
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Desktop Navigation Mode Indicator for Collapsed View */}
          {!isExpanded && (
            <div className="hidden md:flex justify-center w-full">
              <button
                onClick={onToggleExpand}
                title="Maximize Navigation (Show Text Labels)"
                className="w-10 h-6 rounded-lg bg-[#1c3050] hover:bg-[#253e66] text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Dynamic Navigation Items Based on User Role */}
          <nav className="flex flex-col gap-2 w-full px-3 md:px-2">
            {/* Site Allocation Grid (All Roles) */}
            <button
              onClick={() => handleNavClick('site_allocation')}
              title="Site Allocation & Planning Grid"
              className={`rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                isExpanded || window.innerWidth < 768
                  ? 'w-full px-3 py-2.5'
                  : 'w-11 h-11 justify-center'
              } ${
                activePage === 'site_allocation'
                  ? 'bg-brandOrange-500 text-white shadow-md shadow-brandOrange-500/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#1c3050]'
              }`}
            >
              <CalendarDays className="w-5 h-5 shrink-0" />
              <span className={`text-xs font-semibold truncate ${!isExpanded ? 'md:hidden' : ''}`}>Site Allocation Grid</span>
            </button>

            {/* Site Management (Admin & Super Admin) - Right below Allocation Grid */}
            {!isEngineer && (
              <button
                onClick={() => handleNavClick('site_management')}
                title="Construction Site Management Portal"
                className={`rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                  isExpanded || window.innerWidth < 768
                    ? 'w-full px-3 py-2.5'
                    : 'w-11 h-11 justify-center'
                } ${
                  activePage === 'site_management'
                    ? 'bg-brandOrange-500 text-white shadow-md shadow-brandOrange-500/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c3050]'
                }`}
              >
                <Building2 className="w-5 h-5 shrink-0" />
                <span className={`text-xs font-semibold truncate ${!isExpanded ? 'md:hidden' : ''}`}>Site Management</span>
              </button>
            )}

            {/* Employee Directory List (Admin & Super Admin) */}
            {!isEngineer && (
              <button
                onClick={() => handleNavClick('employee_list')}
                title="Employee Directory List"
                className={`rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                  isExpanded || window.innerWidth < 768
                    ? 'w-full px-3 py-2.5'
                    : 'w-11 h-11 justify-center'
                } ${
                  activePage === 'employee_list'
                    ? 'bg-brandOrange-500 text-white shadow-md shadow-brandOrange-500/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c3050]'
                }`}
              >
                <Users className="w-5 h-5 shrink-0" />
                <span className={`text-xs font-semibold truncate ${!isExpanded ? 'md:hidden' : ''}`}>Employee Directory</span>
              </button>
            )}

            {/* Documents Repository (Admin & Super Admin) */}
            {!isEngineer && (
              <button
                onClick={() => handleNavClick('documents')}
                title="Documents & Blueprints Repository"
                className={`rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                  isExpanded || window.innerWidth < 768
                    ? 'w-full px-3 py-2.5'
                    : 'w-11 h-11 justify-center'
                } ${
                  activePage === 'documents'
                    ? 'bg-brandOrange-500 text-white shadow-md shadow-brandOrange-500/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c3050]'
                }`}
              >
                <FileText className="w-5 h-5 shrink-0" />
                <span className={`text-xs font-semibold truncate ${!isExpanded ? 'md:hidden' : ''}`}>Documents Repository</span>
              </button>
            )}

            {/* Settings (Admin & Super Admin) */}
            {!isEngineer && (
              <button
                onClick={() => handleNavClick('settings')}
                title="System Configuration Settings"
                className={`rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                  isExpanded || window.innerWidth < 768
                    ? 'w-full px-3 py-2.5'
                    : 'w-11 h-11 justify-center'
                } ${
                  activePage === 'settings'
                    ? 'bg-brandOrange-500 text-white shadow-md shadow-brandOrange-500/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-[#1c3050]'
                }`}
              >
                <Settings className="w-5 h-5 shrink-0" />
                <span className={`text-xs font-semibold truncate ${!isExpanded ? 'md:hidden' : ''}`}>System Settings</span>
              </button>
            )}

            {/* User Management (Super Admin Exclusive) */}
            {isSuperAdmin && (
              <button
                onClick={() => handleNavClick('user_management')}
                title="User Management (Super Admin Exclusive)"
                className={`rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                  isExpanded || window.innerWidth < 768
                    ? 'w-full px-3 py-2.5'
                    : 'w-11 h-11 justify-center'
                } ${
                  activePage === 'user_management'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 ring-2 ring-purple-400 font-bold'
                    : 'text-purple-400 hover:text-white hover:bg-[#1c3050]'
                }`}
              >
                <UserPlus className="w-5 h-5 shrink-0" />
                <span className={`text-xs font-semibold truncate ${!isExpanded ? 'md:hidden' : ''}`}>User Management</span>
              </button>
            )}
          </nav>
        </div>

        {/* Role Pill Indicator & User Info Footer */}
        <div className="w-full px-3">
          <div
            className="rounded-xl bg-[#1e3456] border border-[#2c4b7a] p-2.5 flex items-center justify-between"
            title={`Logged in as ${userRole.toUpperCase()}`}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm shrink-0">{isEngineer ? '🛠️' : isSuperAdmin ? '👑' : '📊'}</span>
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-[11px] font-bold text-white uppercase tracking-wider truncate">
                  {userRole.replace('_', ' ')}
                </span>
                <span className="text-[9px] text-emerald-400 font-semibold">Active Session</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
