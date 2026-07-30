import React, { useState } from 'react';
import type { Project, Allocation } from '../../types';
import { Building2, Search, Plus, CheckCircle2, XCircle, HardHat, Power, MapPin, Edit3 } from 'lucide-react';
import { PaginationBar } from '../PaginationBar';

interface SiteManagementPageProps {
  projects: Project[];
  allocations: Allocation[];
  onToggleSiteStatus: (projectId: number, currentStatus: string) => void;
  onOpenAddSiteModal: () => void;
  onOpenEditSiteModal: (project: Project) => void;
}

export const SiteManagementPage: React.FC<SiteManagementPageProps> = ({
  projects,
  allocations,
  onToggleSiteStatus,
  onOpenAddSiteModal,
  onOpenEditSiteModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  // Filter out the placeholder site
  const validProjects = projects.filter((p) => !p.name.includes('[Add Site]'));

  // Calculate statistics
  const totalSites = validProjects.length;
  const activeSites = validProjects.filter((p) => p.status !== 'Inactive').length;
  const inactiveSites = validProjects.filter((p) => p.status === 'Inactive').length;
  const totalAllocatedCrew = allocations.length;

  // Filter projects by search and status
  const filteredProjects = validProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(project.site_number).includes(searchTerm);

    const isInactive = project.status === 'Inactive';
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'active'
        ? !isInactive
        : isInactive;

    return matchesSearch && matchesStatus;
  });

  // Paginated records
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto select-none font-sans flex flex-col">
      {/* Metric Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Jobsites</p>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{totalSites}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Building2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Active Jobsites</p>
            <h3 className="text-2xl font-black text-emerald-700 mt-0.5">{activeSites}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Inactive / Suspended</p>
            <h3 className="text-2xl font-black text-rose-600 mt-0.5">{inactiveSites}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
            <XCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Assigned Crew</p>
            <h3 className="text-2xl font-black text-sky-700 mt-0.5">{totalAllocatedCrew}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
            <HardHat className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Status Filters, & Add Button */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search site by name, number, or description..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brandOrange-500 focus:bg-white"
          />
        </div>

        {/* Status Filter Buttons & Create Site Button */}
        <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => {
                setStatusFilter('all');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({totalSites})
            </button>
            <button
              onClick={() => {
                setStatusFilter('active');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'active'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              Active ({activeSites})
            </button>
            <button
              onClick={() => {
                setStatusFilter('inactive');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'inactive'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-rose-700'
              }`}
            >
              Inactive ({inactiveSites})
            </button>
          </div>

          <button
            onClick={onOpenAddSiteModal}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-black text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 border border-amber-500/50"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="tracking-wide">Add Construction Site</span>
          </button>
        </div>
      </div>

      {/* Sites Grid Cards */}
      {paginatedProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs font-semibold">
          No construction sites found matching your active filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {paginatedProjects.map((project, idx) => {
            const isInactive = project.status === 'Inactive';
            const siteCrewCount = allocations.filter((a) => a.project_id === project.id).length;

            return (
              <div
                key={project.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between select-none relative group ${
                  isInactive
                    ? 'border-slate-300 bg-slate-50/70 opacity-80'
                    : 'border-slate-200 hover:border-brandOrange-300'
                }`}
              >
                <div>
                  {/* Top Bar: Site Number & Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-extrabold text-[10px] uppercase tracking-wider border border-slate-200">
                      Site #{project.site_number || idx + 1}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 border ${
                        isInactive
                          ? 'bg-rose-50 text-rose-600 border-rose-200'
                          : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isInactive ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                      {isInactive ? 'Inactive' : 'Active'}
                    </span>
                  </div>

                  {/* Site Title */}
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight mb-1 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-brandOrange-500 shrink-0 mt-0.5" />
                    <span>{project.name}</span>
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-4">
                    {project.description || 'General commercial construction jobsite.'}
                  </p>
                </div>

                {/* Bottom Footer & Action Controls */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold">
                    <HardHat className="w-3.5 h-3.5 text-sky-500" />
                    <span>{siteCrewCount} Crew</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Edit Details Button */}
                    <button
                      onClick={() => onOpenEditSiteModal(project)}
                      title="Edit site name and description"
                      className="px-2.5 py-1.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-brandOrange-500" />
                      <span>Edit</span>
                    </button>

                    {/* Toggle Status Action Button */}
                    <button
                      onClick={() => onToggleSiteStatus(project.id, project.status || 'Active')}
                      className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm transition-all cursor-pointer ${
                        isInactive
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      <span>{isInactive ? 'Activate' : 'Deactivate'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={Math.ceil(filteredProjects.length / rowsPerPage)}
        totalRecords={filteredProjects.length}
        itemsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(rows: number) => {
          setRowsPerPage(rows);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};
