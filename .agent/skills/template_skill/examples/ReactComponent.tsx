import React from 'react';
import * as lucideReact from 'lucide-react';

interface WorkerCardProps {
  id: number;
  name: string;
  position: string;
}

/**
 * WorkerCard Component
 * Best practices demonstrated:
 * - TypeScript interfaces for props
 * - Tailwind CSS for styling (no inline styles)
 * - Lucide icons for UI enhancement
 */
export const WorkerCard = ({ id, name, position }: WorkerCardProps) => {
  return (
    <div data-id={id} className="flex items-center p-4 bg-white shadow rounded-lg border border-gray-200">
      <lucideReact.User className="w-8 h-8 text-blue-500 mr-4" />
      <div>
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">{position}</p>
      </div>
    </div>
  );
};
