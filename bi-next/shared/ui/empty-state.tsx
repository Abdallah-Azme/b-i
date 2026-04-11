import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  desc: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, desc, action }) => (
  <div className="col-span-full py-20 text-center bg-brand-gray/10 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center animate-fade-in w-full">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gray/30 mb-4 text-gray-500 shadow-inner">
      <Icon size={28} />
    </div>
    <h3 className="text-lg font-bold text-white mb-1 tracking-tight">{title}</h3>
    <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">{desc}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);
