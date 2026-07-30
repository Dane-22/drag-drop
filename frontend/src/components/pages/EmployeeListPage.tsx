import React, { useState } from 'react';
import { Users, Search, UserPlus, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import type { Worker } from '../../types';
import { getTradeIcon } from '../WorkerSidebar';
import { PaginationBar } from '../PaginationBar';

interface EmployeeListPageProps {
  workers: Worker[];
  onOpenAddWorkerModal: () => void;
}

export const EmployeeListPage: React.FC<EmployeeListPageProps> = ({
  workers,
  onOpenAddWorkerModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tradeFilter, setTradeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.trade.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTrade = !tradeFilter || w.trade.toLowerCase() === tradeFilter.toLowerCase();

    return matchesSearch && matchesTrade;
  });

  const totalRecords = filteredWorkers.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const paginatedWorkers = filteredWorkers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const trades = Array.from(new Set(workers.map((w) => w.trade))).filter(Boolean);

  return (
    <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto select-none font-sans flex flex-col justify-between">
      <div>
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" /> Employee & Personnel Directory
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Manage licensed trade personnel, skill certifications, contact info, and availability.
            </p>
          </div>

          <button
            onClick={onOpenAddWorkerModal}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Add New Employee
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search employee name or trade skill..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 shrink-0">Trade:</span>
            <select
              value={tradeFilter}
              onChange={(e) => {
                setTradeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="">All Trades</option>
              {trades.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Employee Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {paginatedWorkers.map((worker) => (
            <div key={`employee-${worker.id}`} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="flex items-start gap-3">
                <img
                  src={worker.profile_photo_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=120&q=80'}
                  alt={worker.name}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 truncate">{worker.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                      {worker.status || 'Available'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mt-1">
                    {getTradeIcon(worker.trade)}
                    <span>{worker.trade}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium mt-1">
                    <span className="flex items-center gap-1"><Award className="w-3 h-3 text-amber-500" /> {worker.skill_level || 'Licensed'}</span>
                    <span>•</span>
                    <span>{worker.experience || '5 yrs Exp.'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Safety Certified
                </span>
                <div className="flex items-center gap-2">
                  <button title="Call Employee" className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer">
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                  <button title="Email Employee" className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer">
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Bar */}
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(num) => {
          setItemsPerPage(num);
          setCurrentPage(1);
        }}
        itemsPerPageOptions={[6, 12, 24, 48]}
      />
    </div>
  );
};
