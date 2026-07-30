import React, { useState } from 'react';
import { Building2, X, Plus } from 'lucide-react';

interface AddSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSite: (name: string, description: string) => void;
}

export const AddSiteModal: React.FC<AddSiteModalProps> = ({
  isOpen,
  onClose,
  onAddSite
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddSite(name.trim(), description.trim());
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn">
      <div className="bg-[#162740] border border-[#2a4773] rounded-2xl w-full max-w-md shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#21385c] flex items-center justify-between bg-[#192c48]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brandOrange-500/10 text-brandOrange-500">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-wide">Add New Construction Site</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#253e66] rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Site / Project Name <span className="text-brandOrange-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. HARBOR PLAZA TOWER C"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0f1b2d] border border-[#2a4773] rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brandOrange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Project Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief summary of construction activities..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0f1b2d] border border-[#2a4773] rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brandOrange-500 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#1e3456] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brandOrange-600 to-brandOrange-500 hover:from-brandOrange-500 hover:to-brandOrange-400 shadow-lg shadow-brandOrange-500/25 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Site
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
