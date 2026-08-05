import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { LeftIconNav } from './LeftIconNav';
import { TopHeader } from './TopHeader';
import { WorkerSidebar, getTradeIcon } from './WorkerSidebar';
import { SiteAllocationGrid } from './SiteAllocationGrid';
import { FloatingToolbar } from './FloatingToolbar';
import { Toast } from './Toast';
import type { ToastMessage } from './Toast';
import { AddSiteModal } from './AddSiteModal';
import { EditSiteModal } from './EditSiteModal';
import { AddWorkerModal } from './AddWorkerModal';
import { AnalyticsDrawer } from './AnalyticsDrawer';
import { TeamRosterModal } from './TeamRosterModal';
import { WorkerProfileModal } from './WorkerProfileModal';
import { LoginPage } from './LoginPage';
import { SiteManagementPage } from './pages/SiteManagementPage';
import { EmployeeListPage } from './pages/EmployeeListPage';
import { SettingsPage } from './pages/SettingsPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { useSocket } from '../hooks/useSocket';
import type { Worker, Project, Allocation, DayOfWeek, AllocationViewMode } from '../types';
import type { AuthUser, NavPageId } from '../types/auth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getTodayString = () => new Date().toISOString().split('T')[0];
const getCurrentMonth = () => new Date().toISOString().slice(0, 7);
const getStartOfWeek = (d: Date) => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff)).toISOString().split('T')[0];
};

export const App: React.FC = () => {
  // Authentication & Role State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [activePage, setActivePage] = useState<NavPageId>('site_allocation');

  // Side Navigation Maximize / Minimize / Hide States
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  // Application Data States
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [activeWorker, setActiveWorker] = useState<Worker | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Time Granularity View Mode States (Day, Week, Month)
  const [viewMode, setViewMode] = useState<AllocationViewMode>('week');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedWeekStart, setSelectedWeekStart] = useState<string>(getStartOfWeek(new Date()));
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [selectedAllocId, setSelectedAllocId] = useState<number | null>(null);

  // Live Drag Ghosting Presence State
  const [draggingWorkersMap, setDraggingWorkersMap] = useState<Record<number, { user_name: string; user_role: string }>>({});

  // Modal & Drawer States
  const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
  const [selectedSiteForEdit, setSelectedSiteForEdit] = useState<Project | null>(null);
  const [isEditSiteModalOpen, setIsEditSiteModalOpen] = useState(false);
  const [isAddWorkerModalOpen, setIsAddWorkerModalOpen] = useState(false);
  const [isAnalyticsDrawerOpen, setIsAnalyticsDrawerOpen] = useState(false);
  const [isTeamRosterOpen, setIsTeamRosterOpen] = useState(false);
  const [workerProfileTarget, setWorkerProfileTarget] = useState<Worker | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  );

  const handleToggleNav = () => {
    if (!isNavVisible) {
      setIsNavVisible(true);
      setIsNavExpanded(false);
    } else if (!isNavExpanded) {
      setIsNavExpanded(true);
    } else {
      setIsNavVisible(false);
      setIsNavExpanded(false);
    }
  };

  // Fetch initial data from Express backend
  const loadData = async (tokenOverride?: string) => {
    try {
      const activeToken = tokenOverride || currentUser?.token || localStorage.getItem('apex_token');
      if (activeToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${activeToken}`;
      }

      const response = await axios.get(`${API_BASE}/get_data`);
      if (response.data && response.data.status === 'success') {
        setWorkers(response.data.data.workers || []);
        setProjects(response.data.data.projects || []);
        setAllocations(response.data.data.allocations || []);
      }
    } catch (err: any) {
      console.warn('Backend API connection warning:', err?.message || err);
    }
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 429) {
          setToast({
            id: String(Date.now()),
            type: 'warning',
            title: 'Rate Limit Reached (429)',
            message: error.response.data?.message || 'Too many requests. Please wait 1 minute before trying again.'
          });
        }
        return Promise.reject(error);
      }
    );

    const savedToken = localStorage.getItem('apex_token');
    const savedUserStr = localStorage.getItem('apex_user');
    if (savedToken && savedUserStr) {
      try {
        const parsedUser = JSON.parse(savedUserStr);
        parsedUser.token = savedToken;
        setCurrentUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        loadData(savedToken);
      } catch (e) {
        loadData();
      }
    } else {
      loadData();
    }

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  // Login Success Handler & Redirection Logic
  const handleLoginSuccess = async (user: AuthUser) => {
    setCurrentUser(user);
    setActivePage('site_allocation');

    if (user.token) {
      localStorage.setItem('apex_token', user.token);
      localStorage.setItem('apex_user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      await loadData(user.token);
    } else {
      await loadData();
    }

    setToast({
      id: String(Date.now()),
      type: 'success',
      title: `Welcome, ${user.name}!`,
      message: `Signed in as ${user.role.toUpperCase()}.`
    });
  };

  const handleLogout = () => {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('apex_token');
    localStorage.removeItem('apex_user');
    setCurrentUser(null);
    setActivePage('site_allocation');
  };

  // Socket.io Real-Time Dispatch Event Handlers
  const handleSocketAllocationUpdated = useCallback((data: any) => {
    const updated = data?.allocation || data;
    if (updated && updated.id) {
      setAllocations((prev) => {
        const filtered = prev.filter(
          (a) => !(a.worker_id === updated.worker_id && a.day_of_week === updated.day_of_week)
        );
        return [...filtered, updated];
      });
    }
  }, []);

  const handleSocketAllocationRemoved = useCallback((data: any) => {
    const targetId = data?.id || data?.allocation?.id;
    if (targetId) {
      setAllocations((prev) => prev.filter((a) => a.id !== targetId));
    }
  }, []);

  const handleSocketSiteCreated = useCallback((newProject: any) => {
    if (newProject && newProject.id) {
      setProjects((prev) => {
        if (prev.some((p) => p.id === newProject.id)) return prev;
        const filtered = prev.filter((p) => !p.name.includes('[Add Site]'));
        const addSitePlaceholder = prev.find((p) => p.name.includes('[Add Site]'));
        return [
          ...filtered,
          newProject,
          addSitePlaceholder || { id: 99, site_number: prev.length + 1, name: '[Add Site]', description: '' }
        ];
      });
    }
  }, []);

  const handleSocketWorkerCreated = useCallback((newWorker: any) => {
    if (newWorker && newWorker.id) {
      setWorkers((prev) => {
        if (prev.some((w) => w.id === newWorker.id)) return prev;
        return [...prev, newWorker];
      });
    }
  }, []);

  const handleSocketSiteStatusUpdated = useCallback((data: any) => {
    if (data && data.id) {
      setProjects((prev) =>
        prev.map((p) => (p.id === data.id ? { ...p, status: data.status } : p))
      );
    }
  }, []);

  const handleSocketSiteUpdated = useCallback((updatedProject: any) => {
    if (updatedProject && updatedProject.id) {
      setProjects((prev) =>
        prev.map((p) => (p.id === updatedProject.id ? { ...p, ...updatedProject } : p))
      );
    }
  }, []);

  const handleWorkerDragStarted = useCallback((data: any) => {
    if (data && data.worker_id) {
      setDraggingWorkersMap((prev) => ({
        ...prev,
        [data.worker_id]: { user_name: data.user_name || 'Dispatcher', user_role: data.user_role || 'Engineer' }
      }));
    }
  }, []);

  const handleWorkerDragEnded = useCallback((data: any) => {
    if (data && data.worker_id) {
      setDraggingWorkersMap((prev) => {
        const next = { ...prev };
        delete next[data.worker_id];
        return next;
      });
    }
  }, []);

  // Initialize Socket.io Hook
  const socket = useSocket(
    handleSocketAllocationUpdated,
    handleSocketAllocationRemoved,
    handleSocketSiteCreated,
    handleSocketWorkerCreated,
    handleSocketSiteStatusUpdated,
    handleWorkerDragStarted,
    handleWorkerDragEnded,
    handleSocketSiteUpdated
  );

  // Drag Handlers with Live Presence Emitters
  const handleDragStart = (event: DragStartEvent) => {
    const workerData = event.active.data.current?.worker as Worker;
    if (workerData) {
      setActiveWorker(workerData);
      if (socket && currentUser) {
        socket.emit('worker_drag_start', {
          worker_id: workerData.id,
          user_name: currentUser.name,
          user_role: currentUser.role
        });
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    const worker = active.data.current?.worker as Worker;

    if (worker && socket) {
      socket.emit('worker_drag_end', { worker_id: worker.id });
    }

    setActiveWorker(null);

    if (over && active.data.current?.worker) {
      const worker = active.data.current.worker as Worker;
      const overData = over.data.current as { projectId: number; day: DayOfWeek; allocation_date?: string };

      if (overData && overData.projectId && overData.day) {
        const targetDate = overData.allocation_date || selectedWeekStart;

        const existingOnDay = allocations.find(
          (a) => a.worker_id === worker.id && a.day_of_week === overData.day && (a.allocation_date === targetDate || !a.allocation_date)
        );

        const tempId = existingOnDay ? existingOnDay.id : Date.now();
        const updatedAllocation: Allocation = {
          id: tempId,
          worker_id: worker.id,
          project_id: overData.projectId,
          day_of_week: overData.day,
          allocation_date: targetDate,
          status: 'assigned',
          worker_name: worker.name,
          worker_trade: worker.trade,
          worker_photo: worker.profile_photo_url
        };

        setAllocations((prev) => {
          const filtered = prev.filter((a) => !(a.worker_id === worker.id && a.day_of_week === overData.day && (a.allocation_date === targetDate || !a.allocation_date)));
          return [...filtered, updatedAllocation];
        });

        try {
          const res = await axios.post(`${API_BASE}/allocate_worker`, {
            worker_id: worker.id,
            project_id: overData.projectId,
            day_of_week: overData.day,
            allocation_date: targetDate
          });

          if (res.data && res.data.status === 'success') {
            const isTransfer = res.data.is_transfer;
            setAllocations((prev) =>
              prev.map((a) => (a.id === tempId ? res.data.data : a))
            );
            setToast({
              id: String(Date.now()),
              type: 'success',
              title: isTransfer ? 'Worker Transferred' : 'Worker Allocated',
              message: res.data.message || `${worker.name} assigned to site on ${overData.day}.`
            });
          }
        } catch (err: any) {
          loadData();
          setToast({
            id: String(Date.now()),
            type: 'error',
            title: 'Allocation Warning',
            message: 'Could not complete worker transfer.'
          });
        }
      }
    }
  };

  const handleAllocateWorkerDirectly = async (worker: Worker, projectId: number, day: DayOfWeek) => {
    const today = new Date().toISOString().split('T')[0];

    const existingOnDay = allocations.find(
      (a) => a.worker_id === worker.id && a.day_of_week === day
    );

    const tempId = existingOnDay ? existingOnDay.id : Date.now();
    const updatedAllocation: Allocation = {
      id: tempId,
      worker_id: worker.id,
      project_id: projectId,
      day_of_week: day,
      allocation_date: today,
      status: 'assigned',
      worker_name: worker.name,
      worker_trade: worker.trade,
      worker_photo: worker.profile_photo_url
    };

    setAllocations((prev) => {
      const filtered = prev.filter((a) => !(a.worker_id === worker.id && a.day_of_week === day));
      return [...filtered, updatedAllocation];
    });

    try {
      const res = await axios.post(`${API_BASE}/allocate_worker`, {
        worker_id: worker.id,
        project_id: projectId,
        day_of_week: day,
        allocation_date: today
      });

      if (res.data && res.data.status === 'success') {
        const isTransfer = res.data.is_transfer;
        setAllocations((prev) =>
          prev.map((a) => (a.id === tempId ? res.data.data : a))
        );
        setToast({
          id: String(Date.now()),
          type: 'success',
          title: isTransfer ? 'Worker Transferred' : 'Worker Allocated',
          message: res.data.message || `${worker.name} assigned to site on ${day}.`
        });
      }
    } catch (err: any) {
      loadData();
      setToast({
        id: String(Date.now()),
        type: 'error',
        title: 'Allocation Warning',
        message: 'Could not complete worker transfer.'
      });
    }
  };

  const handleRemoveAllocation = async (allocationId: number) => {
    const target = allocations.find((a) => a.id === allocationId);
    setAllocations((prev) => prev.filter((a) => a.id !== allocationId));

    try {
      await axios.post(`${API_BASE}/remove_allocation`, { id: allocationId });
      if (target) {
        setToast({
          id: String(Date.now()),
          type: 'success',
          title: 'Worker Unallocated',
          message: `${target.worker_name || 'Worker'} unallocated from site.`
        });
      }
    } catch (err: any) {
      console.error('Failed to remove allocation', err);
    }
  };

  const handleAddSite = async (name: string, description: string) => {
    try {
      const res = await axios.post(`${API_BASE}/create_project`, {
        name,
        description
      });

      if (res.data && res.data.status === 'success') {
        const newProject = res.data.data;
        setProjects((prev) => {
          if (prev.some((p) => p.id === newProject.id)) return prev;
          const filtered = prev.filter((p) => !p.name.includes('[Add Site]'));
          const addSitePlaceholder = prev.find((p) => p.name.includes('[Add Site]'));
          return [
            ...filtered,
            newProject,
            addSitePlaceholder || { id: 99, site_number: prev.length + 1, name: '[Add Site]', description: '' }
          ];
        });

        setToast({
          id: String(Date.now()),
          type: 'success',
          title: 'Construction Site Created',
          message: `Site ${newProject.site_number}: "${newProject.name}" added to allocation board.`
        });
      }
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        title: 'Error Creating Site',
        message: 'Could not save new construction site to database.'
      });
    }
  };

  const handleAddWorker = async (name: string, trade: string, experience: string, skill_level: string) => {
    try {
      const res = await axios.post(`${API_BASE}/create_worker`, {
        name,
        trade,
        experience,
        skill_level
      });

      if (res.data && res.data.status === 'success') {
        const newWorker = res.data.data;
        setWorkers((prev) => {
          if (prev.some((w) => w.id === newWorker.id)) return prev;
          return [...prev, newWorker];
        });
        setToast({
          id: String(Date.now()),
          type: 'success',
          title: 'Worker Added',
          message: `${newWorker.name} (${newWorker.trade}) added to workforce pool.`
        });
      }
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        title: 'Error Adding Worker',
        message: 'Could not add worker to database.'
      });
    }
  };

  const handleToggleSiteStatus = async (projectId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'Inactive' ? 'Active' : 'Inactive';

    try {
      const res = await axios.post(`${API_BASE}/toggle_project_status`, {
        project_id: projectId,
        status: nextStatus
      });

      if (res.data && res.data.status === 'success') {
        const target = projects.find((p) => p.id === projectId);
        setToast({
          id: String(Date.now()),
          type: 'success',
          title: `Site ${nextStatus}`,
          message: `Construction Site '${target?.name || ''}' status set to ${nextStatus}.`
        });
      }
    } catch (err: any) {
      loadData();
      setToast({
        id: String(Date.now()),
        type: 'error',
        title: 'Status Update Warning',
        message: 'Could not update site status.'
      });
    }
  };

  const handleUpdateSite = async (
    projectId: number,
    name: string,
    description: string,
    status: 'Active' | 'Inactive'
  ) => {
    try {
      const res = await axios.post(`${API_BASE}/update_project`, {
        project_id: projectId,
        name,
        description,
        status
      });

      if (res.data && res.data.status === 'success') {
        setToast({
          id: String(Date.now()),
          type: 'success',
          title: 'Construction Site Updated',
          message: `Site '${name}' details updated successfully.`
        });
      }
    } catch (err: any) {
      loadData();
      setToast({
        id: String(Date.now()),
        type: 'error',
        title: 'Update Error',
        message: 'Could not save site updates.'
      });
    }
  };

  // If user is not authenticated -> Render LoginPage
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const filteredWorkers = workers;

  // Render content based on active nav selection
  const renderActivePageContent = () => {
    switch (activePage) {
      case 'site_management':
        return (
          <SiteManagementPage
            projects={projects}
            allocations={allocations}
            onToggleSiteStatus={handleToggleSiteStatus}
            onOpenAddSiteModal={() => setIsAddSiteModalOpen(true)}
            onOpenEditSiteModal={(project) => {
              setSelectedSiteForEdit(project);
              setIsEditSiteModalOpen(true);
            }}
          />
        );

      case 'employee_list':
        return (
          <EmployeeListPage
            workers={workers}
            onOpenAddWorkerModal={() => setIsAddWorkerModalOpen(true)}
          />
        );

      case 'settings':
        return <SettingsPage />;

      case 'documents':
        return <DocumentsPage />;

      case 'user_management':
        return <UserManagementPage />;

      case 'site_allocation':
      default:
        const selectedAlloc = allocations.find((a) => a.id === selectedAllocId);
        const activeWorkerId = selectedAlloc ? selectedAlloc.worker_id : (activeWorker ? activeWorker.id : null);

        return (
          <div className="flex-1 flex overflow-hidden relative">
            <WorkerSidebar
              workers={filteredWorkers}
              projects={projects}
              allocations={allocations}
              selectedWorkerId={activeWorkerId}
              activeDragsMap={draggingWorkersMap}
              viewMode={viewMode}
              selectedDate={selectedDate}
              selectedWeekStart={selectedWeekStart}
              selectedMonth={selectedMonth}
              onAllocateWorkerDirectly={handleAllocateWorkerDirectly}
              onOpenAddWorkerModal={() => setIsAddWorkerModalOpen(true)}
            />
            <SiteAllocationGrid
              projects={projects}
              workers={workers}
              allocations={allocations}
              activeId={activeWorker ? `worker-${activeWorker.id}` : null}
              activeDragsMap={draggingWorkersMap}
              viewMode={viewMode}
              selectedDate={selectedDate}
              selectedWeekStart={selectedWeekStart}
              selectedMonth={selectedMonth}
              selectedAllocId={selectedAllocId}
              onSelectAllocCard={setSelectedAllocId}
              onRemoveAllocation={handleRemoveAllocation}
              onOpenAddSiteModal={() => setIsAddSiteModalOpen(true)}
              onViewWorkerProfile={setWorkerProfileTarget}
            />
          </div>
        );
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
        {/* Toast Notification */}
        <Toast toast={toast} onClose={() => setToast(null)} />

        {/* Modals & Popovers */}
        <AddSiteModal
          isOpen={isAddSiteModalOpen}
          onClose={() => setIsAddSiteModalOpen(false)}
          onAddSite={handleAddSite}
        />

        <EditSiteModal
          isOpen={isEditSiteModalOpen}
          project={selectedSiteForEdit}
          onClose={() => setIsEditSiteModalOpen(false)}
          onUpdateSite={handleUpdateSite}
        />

        <AddWorkerModal
          isOpen={isAddWorkerModalOpen}
          onClose={() => setIsAddWorkerModalOpen(false)}
          onAddWorker={handleAddWorker}
        />

        <TeamRosterModal
          isOpen={isTeamRosterOpen}
          onClose={() => setIsTeamRosterOpen(false)}
          workers={workers}
        />

        <AnalyticsDrawer
          isOpen={isAnalyticsDrawerOpen}
          onClose={() => setIsAnalyticsDrawerOpen(false)}
          workers={workers}
          projects={projects}
          allocations={allocations}
        />

        {/* Role-filtered Collapsible / Maximize / Minimize Left Navigation Rail */}
        <LeftIconNav
          userRole={currentUser.role}
          activePage={activePage}
          onSelectPage={setActivePage}
          isVisible={isNavVisible}
          isExpanded={isNavExpanded}
          onToggleExpand={() => setIsNavExpanded((prev) => !prev)}
          onHideNav={() => setIsNavVisible(false)}
        />

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Header Bar with Hamburger Menu Toggle */}
          <TopHeader
            currentUser={currentUser}
            activePage={activePage}
            viewMode={viewMode}
            onSelectViewMode={setViewMode}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedWeekStart={selectedWeekStart}
            onSelectWeekStart={setSelectedWeekStart}
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
            onLogout={handleLogout}
            isNavVisible={isNavVisible}
            onToggleNav={handleToggleNav}
          />

          {/* Active Page View Content */}
          {renderActivePageContent()}
        </div>

        {/* Bottom Floating Action Toolbar */}
        {activePage === 'site_allocation' && (
          <FloatingToolbar
            onOpenAnalytics={() => setIsAnalyticsDrawerOpen(true)}
            onOpenAddWorker={() => setIsAddWorkerModalOpen(true)}
            onOpenRoster={() => setIsTeamRosterOpen(true)}
          />
        )}
      </div>

      {/* Drag Overlay Card */}
      <DragOverlay>
        {activeWorker ? (
          <div className="p-3 bg-white rounded-xl border-2 border-brandOrange-500 shadow-2xl flex items-center gap-3 w-56 select-none cursor-grabbing ring-4 ring-brandOrange-500/20">
            <img
              src={activeWorker.profile_photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
              alt={activeWorker.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div>
              <h4 className="text-xs font-bold text-slate-900">{activeWorker.name}</h4>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                {getTradeIcon(activeWorker.trade)}
                <span>{activeWorker.trade}</span>
              </div>
              <span className="text-[10px] text-brandOrange-600 font-bold">
                {activeWorker.experience || '5 yrs Exp.'}
              </span>
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Worker Profile Modal */}
      {workerProfileTarget && (
        <WorkerProfileModal
          worker={workerProfileTarget}
          onClose={() => setWorkerProfileTarget(null)}
        />
      )}
    </DndContext>
  );
};
