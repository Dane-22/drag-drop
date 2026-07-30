import React, { useEffect, useRef } from 'react';
import { X, MapPin, Phone, Briefcase, Wrench, Clock } from 'lucide-react';
import type { Worker } from '../types';

interface WorkerProfileModalProps {
  worker: Worker;
  onClose: () => void;
}

export const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({ worker, onClose }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in"
    >
      <div className="w-full max-w-md bg-[#0d1829] border border-[#263e63] rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all z-10 cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Header with Avatar & Name */}
        <div className="relative px-6 pt-8 pb-6 bg-gradient-to-br from-brandOrange-600/20 via-[#0d1829] to-sky-900/20">
          <div className="flex items-center gap-4">
            <img
              src={
                worker.profile_photo_url ||
                'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=200&q=80'
              }
              alt={worker.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-brandOrange-500/50 shadow-lg shadow-brandOrange-500/20"
            />
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">{worker.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-brandOrange-400 bg-brandOrange-500/15 px-2.5 py-0.5 rounded-full border border-brandOrange-500/30">
                  {worker.trade || 'Worker'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="px-6 pb-6 space-y-1">
          {/* Position */}
          <DetailRow
            icon={<Briefcase className="w-4 h-4 text-brandOrange-400" />}
            label="Position"
            value={worker.trade || 'Not specified'}
          />

          {/* Skills & Experience */}
          <DetailRow
            icon={<Wrench className="w-4 h-4 text-sky-400" />}
            label="Skills"
            value={`${worker.skill_level || 'Experienced'} • ${worker.experience || 'N/A'}`}
          />

          {/* Address */}
          <DetailRow
            icon={<MapPin className="w-4 h-4 text-emerald-400" />}
            label="Address"
            value={worker.address || 'Not provided'}
            isEmpty={!worker.address}
          />

          {/* Phone Number */}
          <DetailRow
            icon={<Phone className="w-4 h-4 text-violet-400" />}
            label="Phone"
            value={worker.phone_number || 'Not provided'}
            isEmpty={!worker.phone_number}
          />

          {/* Member Since */}
          <DetailRow
            icon={<Clock className="w-4 h-4 text-amber-400" />}
            label="Member Since"
            value={
              worker.created_at
                ? new Date(worker.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'N/A'
            }
          />
        </div>
      </div>
    </div>
  );
};

// Reusable Detail Row Component
const DetailRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  isEmpty?: boolean;
}> = ({ icon, label, value, isEmpty = false }) => (
  <div className="flex items-center gap-3 py-3 border-b border-[#1e3355]/60 last:border-b-0">
    <div className="w-9 h-9 rounded-xl bg-[#162740] flex items-center justify-center shrink-0 border border-[#263e63]">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
      <p className={`text-sm font-semibold truncate ${isEmpty ? 'text-slate-600 italic' : 'text-white'}`}>
        {value}
      </p>
    </div>
  </div>
);
