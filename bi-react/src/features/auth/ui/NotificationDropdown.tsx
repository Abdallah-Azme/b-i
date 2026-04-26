import React, { useRef, useState, useEffect } from 'react';
import { Bell, X, CheckCheck, Trash2, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import {
  useUnreadNotificationsCount,
  useNotifications,
  useMarkAllNotificationsRead,
  useDeleteAllNotifications,
  useDeleteNotification,
} from '../hooks/useNotifications';
import { ApiNotification } from '../types';

function timeAgo(dateStr: string, lang: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (lang === 'ar') {
    if (days > 0) return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
    if (hours > 0) return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
    if (mins > 0) return `منذ ${mins} ${mins === 1 ? 'دقيقة' : 'دقائق'}`;
    return 'الآن';
  }
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'just now';
}

export const NotificationDropdown: React.FC = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'ar' | 'en';
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Queries & mutations
  const { data: countData } = useUnreadNotificationsCount();
  const { data: notifData, isLoading: isLoadingList } = useNotifications({ per_page: 15 });
  const markAllRead = useMarkAllNotificationsRead();
  const deleteAll = useDeleteAllNotifications();
  const deleteOne = useDeleteNotification();

  const unreadCount = countData?.data?.unread_notifications_count ?? 0;
  const notifications: ApiNotification[] = notifData?.data?.notifications ?? [];

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleMarkAll = () => {
    markAllRead.mutate();
  };

  const handleDeleteAll = () => {
    deleteAll.mutate();
  };

  const handleDeleteOne = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteOne.mutate(id);
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={btnRef}
        id="notification-bell-btn"
        aria-label={lang === 'ar' ? 'الإشعارات' : 'Notifications'}
        onClick={() => setOpen(v => !v)}
        className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/10 transition-colors duration-200 group"
      >
        <Bell
          size={20}
          className={`transition-all duration-200 ${open ? 'text-brand-gold' : 'text-gray-300 group-hover:text-white'}`}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] text-white font-bold border border-black shadow animate-pulse-once">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          ref={panelRef}
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          className={`
            absolute top-full mt-3 w-80 sm:w-96
            ${lang === 'ar' ? 'left-0' : 'right-0'}
            bg-[#111] border border-white/10 rounded-2xl shadow-2xl shadow-black/60
            z-50 overflow-hidden
            animate-slide-down
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-sm font-semibold text-white">
              {lang === 'ar' ? 'الإشعارات' : 'Notifications'}
              {unreadCount > 0 && (
                <span className="ms-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </span>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={handleMarkAll}
                    disabled={markAllRead.isPending || unreadCount === 0}
                    title={lang === 'ar' ? 'تعليم الكل كمقروء' : 'Mark all as read'}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-brand-gold transition disabled:opacity-40"
                  >
                    {markAllRead.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCheck size={14} />}
                  </button>
                  <button
                    onClick={handleDeleteAll}
                    disabled={deleteAll.isPending}
                    title={lang === 'ar' ? 'حذف الكل' : 'Delete all'}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-500 transition disabled:opacity-40"
                  >
                    {deleteAll.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
            {isLoadingList ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={22} className="animate-spin text-brand-gold" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-500">
                <Bell size={32} className="opacity-30" />
                <p className="text-sm">{lang === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}</p>
              </div>
            ) : (
              notifications.map(n => (
                <NotificationRow
                  key={n.id}
                  notification={n}
                  lang={lang}
                  onDelete={handleDeleteOne}
                  isDeleting={deleteOne.isPending && (deleteOne.variables as any) === n.id}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-white/10 px-4 py-2.5">
              <Link
                to="/notifications"
                onClick={() => setOpen(false)}
                className="block text-center text-xs text-brand-gold hover:text-brand-gold/80 font-medium transition"
              >
                {lang === 'ar' ? 'عرض كل الإشعارات' : 'View all notifications'}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Notification Row ───────────────────────────────────────────────────── */
const categoryColors: Record<string, string> = {
  system: 'bg-blue-500',
  deal: 'bg-brand-gold',
  interest: 'bg-purple-500',
  project: 'bg-emerald-500',
};

const NotificationRow: React.FC<{
  notification: ApiNotification;
  lang: 'ar' | 'en';
  onDelete: (id: string, e: React.MouseEvent) => void;
  isDeleting: boolean;
}> = ({ notification: n, lang, onDelete, isDeleting }) => {
  const dotColor = categoryColors[n.notification_category] ?? 'bg-gray-400';
  const isUnread = !n.seen;

  const inner = (
    <div className={`group flex items-start gap-3 px-4 py-3 border-b border-white/5 transition-colors hover:bg-white/5 ${isUnread ? 'bg-white/[0.03]' : ''}`}>
      {/* Category dot */}
      <span className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${dotColor} ${isUnread ? 'ring-2 ring-offset-1 ring-offset-[#111] ring-current opacity-90' : 'opacity-40'}`} />

      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${isUnread ? 'text-white font-medium' : 'text-gray-300'} truncate`}>
          {n.title}
        </p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
        <p className="text-[10px] text-gray-600 mt-1">{timeAgo(n.created_at, lang)}</p>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => onDelete(n.id, e)}
        disabled={isDeleting}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-500/20 text-gray-600 hover:text-red-400 flex-shrink-0"
        title={lang === 'ar' ? 'حذف' : 'Delete'}
      >
        {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
      </button>
    </div>
  );

  if (n.target_url) {
    return <a href={n.target_url} target="_blank" rel="noopener noreferrer">{inner}</a>;
  }
  return <div>{inner}</div>;
};
