import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { MoreMenuList } from './MoreMenuList';

type MoreMenuDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export const MoreMenuDrawer: React.FC<MoreMenuDrawerProps> = ({ open, onClose }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[110] md:hidden">
      <button
        type="button"
        aria-label={t('filters.close')}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 start-0 flex w-full max-w-sm flex-col border-e border-white/10 bg-brand-gray shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-4">
          <h2 className="text-xl font-bold text-white">{t('tabs.more')}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('filters.close')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black text-white transition-colors hover:border-brand-gold/60 hover:text-brand-gold"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <MoreMenuList onItemClick={onClose} />
        </div>
      </div>
    </div>,
    document.body,
  );
};
