'use client';

import React from 'react';
import { useNotifications } from '@/features/notifications/hooks/use-notifications';
import { Bell, Star, PlusCircle, CheckCircle, Info, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Link } from '@/i18n/routing';

export const NotificationsTab: React.FC<{ locale: string }> = ({ locale }) => {
  const isAr = locale === 'ar';
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center bg-brand-gray/10 p-4 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
             <Bell className="text-brand-gold" size={20} />
             <span className="font-bold text-white">{isAr ? 'الإشعارات' : 'Notifications'}</span>
          </div>
          <div className="flex gap-2">
             <Button variant="ghost" onClick={markAllAsRead} className="text-xs text-brand-gold hover:text-white hover:bg-transparent px-2 h-auto">
                {isAr ? 'تحديد الكل كمقروء' : 'Mark all as read'}
             </Button>
             <Button variant="ghost" onClick={clearAll} className="text-xs text-red-500 hover:text-white hover:bg-transparent px-2 h-auto">
                {isAr ? 'حذف الكل' : 'Clear all'}
             </Button>
          </div>
       </div>

       <div className="space-y-3">
          {notifications.length > 0 ? notifications.map(notif => (
            <div 
              key={notif.id} 
              className={`p-4 rounded-xl border transition group relative ${notif.isRead ? 'bg-black/20 border-white/5' : 'bg-brand-gold/10 border-brand-gold/30'}`}
              onClick={() => markAsRead(notif.id)}
            >
               <div className="flex gap-4">
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notif.isRead ? 'bg-gray-800 text-gray-500' : 'bg-brand-gold text-black shadow-lg shadow-brand-gold/20'}`}>
                     {notif.type === 'interest' ? <Star size={18} /> : 
                      notif.type === 'project' ? <PlusCircle size={18} /> : 
                      notif.type === 'deal' ? <CheckCircle size={18} /> : <Info size={18} />}
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-bold ${notif.isRead ? 'text-gray-300' : 'text-white'}`}>{notif.title[locale as keyof typeof notif.title]}</h4>
                        <span className="text-[10px] text-gray-500 font-medium">{new Date(notif.createdAt).toLocaleDateString(locale === 'en' ? 'en-US' : 'ar-KW')}</span>
                     </div>
                     <p className={`text-xs ${notif.isRead ? 'text-gray-500' : 'text-gray-300'}`}>{notif.message[locale as keyof typeof notif.message]}</p>
                     
                     {notif.link && (
                        <Link href={notif.link} className="flex items-center gap-1 text-[10px] text-brand-gold mt-2 font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                           {isAr ? 'عرض التفاصيل' : 'View Details'} <ChevronRight size={10} />
                        </Link>
                     )}
                  </div>
               </div>
               {!notif.isRead && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-gold animate-pulse"></div>}
            </div>
          )) : (
            <div className="text-center py-20 bg-brand-gray/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center">
               <div className="w-16 h-16 rounded-full bg-gray-900/50 flex items-center justify-center text-gray-700 mb-4">
                  <Bell size={24} />
               </div>
               <p className="text-gray-500 text-sm">{isAr ? 'لا يوجد إشعارات حالياً' : 'No notifications yet'}</p>
            </div>
          )}
       </div>
    </div>
  );
};
