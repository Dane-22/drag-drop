import React, { useState } from 'react';
import { FileText, Search, Upload, Download, Folder } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const documents = [
    { id: 1, title: 'Commercial Tower Architectural Blueprint v3.2', category: 'Blueprint', site: 'Commercial Tower', size: '14.2 MB', date: '2026-07-20' },
    { id: 2, title: 'Residential Complex Structural Foundation Plan', category: 'Blueprint', site: 'Residential Complex', size: '8.7 MB', date: '2026-07-18' },
    { id: 3, title: 'OSHA Safety Compliance & PPE Protocol 2026', category: 'Safety Certificate', site: 'All Sites', size: '2.1 MB', date: '2026-06-01' },
    { id: 4, title: 'Bridge Rehab Steel Welding Inspection Report', category: 'Inspection', site: 'Bridge Rehab', size: '5.4 MB', date: '2026-07-25' },
    { id: 5, title: 'Subcontractor Labor Agreement & Insurance Policy', category: 'Contract', site: 'All Sites', size: '3.8 MB', date: '2026-05-12' }
  ];

  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-slate-100 p-4 sm:p-6 overflow-y-auto select-none font-sans flex flex-col">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" /> Documents & Site Blueprint Repository
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Central repository for construction site blueprints, OSHA safety permits, inspection logs, and subcontracts.
          </p>
        </div>

        <button className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer">
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search documents by title, site, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Document Directory Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Folder className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px]">
                  {doc.category}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900 leading-snug">{doc.title}</h3>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">Site: {doc.site}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>{doc.size} • {doc.date}</span>
              <button className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1 font-bold">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
