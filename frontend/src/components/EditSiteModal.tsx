import React, { useState, useEffect } from 'react';
import type { Project } from '../types';
import { X, Building2, FileText, CheckCircle2, Save } from 'lucide-react';

interface EditSiteModalProps {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
  onUpdateSite: (projectId: number, name: string, description: string, status: 'Active' | 'Inactive') => void;
}

export const EditSiteModal: React.FC<EditSiteModalProps> = ({
  isOpen,
  project,
  onClose,
  onUpdateSite
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || '');
      setStatus(project.status || 'Active');
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onUpdateSite(project.id, name.trim(), description.trim(), status);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#162740] border border-[#21385c] rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-brandOrange-500/20 text-brandOrange-400 flex items-center justify-center border border-brandOrange-500/30">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Edit Construction Site Details</h3>
            <p className="text-xs text-slate-400 font-semibold">Site #{project.site_number || project.id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-brandOrange-400" /> Site Name & Location
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Site 4: Commercial Tower"
              className="w-full bg-[#0d1829] border border-[#21385c] rounded-xl px-3.5 py-2.5 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-brandOrange-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-sky-400" /> Description & Scope
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter site scope, general contractor details, or phase..."
              className="w-full bg-[#0d1829] border border-[#21385c] rounded-xl px-3.5 py-2.5 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Site Status
            </label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStatus('Active')}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  status === 'Active'
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                    : 'bg-[#0d1829] border-[#21385c] text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Active</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('Inactive')}
                className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  status === 'Inactive'
                    ? 'bg-rose-600 border-rose-500 text-white shadow-md'
                    : 'bg-[#0d1829] border-[#21385c] text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span>Inactive</span>
              </button>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#21385c]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-brandOrange-500 hover:bg-brandOrange-600 text-white font-extrabold flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Site Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
