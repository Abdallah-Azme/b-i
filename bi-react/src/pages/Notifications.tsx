import React, { useState, useMemo } from 'react';
import { useStore } from '../hooks/useStore';
import { Link, useNavigate } from '@tanstack/react-router';
import { 
  ArrowLeft, ArrowRight, CheckCheck, Trash2, 
  Handshake, Briefcase, TrendingUp, Shield, 
  Bell, Loader2
} from 'lucide-react';
import { ApiNotification } from '../features/auth/types';
import { 
  useNotifications, 
  useUnreadNotificationsCount, 
  useMarkAllNotificationsRead, 
  useDeleteAllNotifications, 
  useDeleteNotification 
} from '../features/auth/hooks/useNotifications';

const getIcon = (category: string) => {
  switch (category) {
    case 'deal': return <Handshake size={20} className="text-green-400" />;
    case 'project': return <Briefcase size={20} className="text-blue-400" />;
    case 'interest': return <TrendingUp size={20} className="text-brand-gold" />;
    case 'system': return <Shield size={20} className="text-purple-400" />;
    default: return <Bell size={20} className="text-gray-400" />;
  }
};

const getTimeAgo = (dateStr: string, lang: 'ar' | 'en') => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return lang === 'ar' ? `قبل ${days} يوم` : `${days}d ago`;
  if (hours > 0) return lang === 'ar' ? `قبل ${hours} ساعة` : `${hours}h ago`;
  if (minutes > 0) return lang === 'ar' ? `قبل ${minutes} دقيقة` : `${minutes}m ago`;
  return lang === 'ar' ? 'الآن' : 'Just now';
};

export const Notifications: React.FC = () => {
  const { lang } = useStore();
  const navigate = useNavigate();
  const isAr = lang === 'ar';
  
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const { data: notificationsData, isLoading } = useNotifications({ per_page: 50 });
  const { data: unreadCountData } = useUnreadNotificationsCount();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteAll = useDeleteAllNotifications();
  const deleteOne = useDeleteNotification();

  const notifications = notificationsData?.data?.notifications || [];
  const unreadCount = unreadCountData?.data?.unread_notifications_count || 0;

  const filteredList = useMemo(() => {
    if (activeFilter === 'all') return notifications;
    if (activeFilter === 'unread') return notifications.filter(n => !n.seen);
    return notifications.filter(n => n.notification_category === activeFilter);
  }, [notifications, activeFilter]);

  const handleItemClick = (n: ApiNotification) => {
    // We could mark it as read when clicking, but we don't have a specific mark-read endpoint,
    // only read-all. Let's ignore individual read unless we add it later.
    if (n.target_url) {
      navigate({ to: n.target_url as any });
    }
  };

  const confirmClearAll = () => {
    deleteAll.mutate();
    setShowConfirmClear(false);
  };

  // Filter Chips Config
  const filters = [
    { id: 'all', label: { ar: 'الكل', en: 'All' } },
    { id: 'unread', label: { ar: 'غير مقروء', en: 'Unread' } },
    { id: 'deal', label: { ar: 'الصفقات', en: 'Deals' } },
    { id: 'project', label: { ar: 'المشاريع', en: 'Projects' } },
    { id: 'interest', label: { ar: 'اهتمامات', en: 'Interests' } },
    { id: 'system', label: { ar: 'النظام', en: 'System' } },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 py-4 md:py-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-3">
              <Link to="/more" className="md:hidden text-gray-400 hover:text-white">
                 {isAr ? <ArrowRight size={24} /> : <ArrowLeft size={24} />}
              </Link>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                {isAr ? 'الإشعارات' : 'Notifications'}
                {unreadCount > 0 && (
                   <span className="mx-2 bg-brand-gold text-black text-xs font-bold px-2 py-0.5 rounded-full">
                     {unreadCount}
                   </span>
                )}
              </h1>
           </div>
           
           <div className="flex items-center gap-2">
              <button 
                onClick={() => markAllRead.mutate()}
                disabled={unreadCount === 0 || markAllRead.isPending}
                className="text-xs md:text-sm font-medium text-brand-gold hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                <CheckCheck size={16} />
                <span className="hidden sm:inline">{isAr ? 'تحديد الكل كمقروء' : 'Mark all read'}</span>
              </button>
              
              <div className="h-4 w-px bg-white/20 mx-1"></div>

              <button 
                onClick={() => setShowConfirmClear(true)}
                disabled={notifications.length === 0}
                className="text-gray-400 hover:text-red-500 disabled:opacity-50 transition p-1"
              >
                <Trash2 size={18} />
              </button>
           </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
         {/* Filters */}
         <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
            {filters.map(f => (
               <button
                 key={f.id}
                 onClick={() => setActiveFilter(f.id as any)}
                 className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition border ${
                    activeFilter === f.id 
                    ? 'bg-brand-gold text-black border-brand-gold' 
                    : 'bg-brand-gray/50 text-gray-400 border-white/5 hover:border-white/20'
                 }`}
               >
                 {f.label[lang]}
               </button>
            ))}
         </div>

         {/* List */}
         {isLoading ? (
           <div className="flex flex-col items-center justify-center py-20">
             <Loader2 className="w-10 h-10 animate-spin text-brand-gold" />
           </div>
         ) : filteredList.length > 0 ? (
           <div className="space-y-3 animate-fade-in">
             {filteredList.map((n) => (
               <div 
                 key={n.id}
                 className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                    n.seen 
                    ? 'bg-brand-gray/20 border-white/5 opacity-80 hover:opacity-100' 
                    : 'bg-brand-gray/60 border-brand-gold/20 shadow-lg shadow-brand-gold/5'
                 }`}
               >
                  <div className="flex">
                     {/* Clickable Content Area */}
                     <div 
                        onClick={() => handleItemClick(n)}
                        className="flex-1 p-4 cursor-pointer flex gap-4"
                     >
                        {/* Icon */}
                        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${n.seen ? 'bg-white/5 grayscale' : 'bg-black/40'}`}>
                           {getIcon(n.notification_category)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-start mb-1">
                              <h3 className={`text-sm font-bold truncate ${n.seen ? 'text-gray-400' : 'text-white'}`}>
                                 {n.title}
                              </h3>
                              <span className="text-[10px] text-gray-500 whitespace-nowrap ms-2">
                                 {getTimeAgo(n.created_at, lang)}
                              </span>
                           </div>
                           <p className={`text-xs md:text-sm line-clamp-2 ${n.seen ? 'text-gray-500' : 'text-gray-300'}`}>
                              {n.body}
                           </p>
                        </div>
                     </div>

                     {/* Actions Column */}
                     <div className="w-12 border-l border-white/5 rtl:border-r rtl:border-l-0 flex flex-col items-center justify-center bg-black/20 gap-2">
                        {!n.seen && (
                           <div className="p-1.5 rounded-full text-brand-gold" title={isAr ? 'غير مقروء' : 'Unread'}>
                              <div className="w-2 h-2 rounded-full bg-current"></div>
                           </div>
                        )}
                        <button 
                           onClick={(e) => { e.stopPropagation(); deleteOne.mutate(n.id); }}
                           disabled={deleteOne.isPending}
                           className="p-1.5 rounded-full text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition disabled:opacity-50"
                           title={isAr ? 'حذف' : 'Delete'}
                        >
                           <Trash2 size={14} />
                        </button>
                     </div>
                  </div>
               </div>
             ))}
           </div>
         ) : (
           <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-brand-gray/30 rounded-full flex items-center justify-center mb-6">
                 <Bell size={32} className="text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                 {isAr ? 'لا توجد إشعارات' : 'No notifications'}
              </h3>
              <p className="text-gray-500 text-sm">
                 {isAr ? 'ستظهر هنا آخر التحديثات المتعلقة بحسابك' : 'Updates related to your account will appear here'}
              </p>
              {activeFilter !== 'all' && (
                 <button 
                   onClick={() => setActiveFilter('all')} 
                   className="mt-6 text-brand-gold hover:underline text-sm"
                 >
                   {isAr ? 'عرض الكل' : 'View All'}
                 </button>
              )}
           </div>
         )}
      </div>

      {/* Clear All Confirmation Modal */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
           <div className="bg-brand-gray border border-white/10 p-6 rounded-2xl w-full max-w-sm text-center">
              <h3 className="text-lg font-bold text-white mb-2">{isAr ? 'مسح كل الإشعارات؟' : 'Clear all notifications?'}</h3>
              <p className="text-sm text-gray-400 mb-6">{isAr ? 'لا يمكن التراجع عن هذا الإجراء.' : 'This action cannot be undone.'}</p>
              <div className="flex gap-3">
                 <button 
                   onClick={() => setShowConfirmClear(false)}
                   className="flex-1 py-2.5 rounded-lg bg-white/5 text-white hover:bg-white/10 font-bold text-sm transition"
                 >
                   {isAr ? 'إلغاء' : 'Cancel'}
                 </button>
                 <button 
                   onClick={confirmClearAll}
                   className="flex-1 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 font-bold text-sm transition"
                 >
                   {isAr ? 'مسح' : 'Clear'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
