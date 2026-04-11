import React, { useState } from 'react';
import { IncomingRequest, SentInterest, OngoingRequest, VerificationInfo } from '../types';
import { SAMPLE_INCOMING_REQUESTS, SAMPLE_SENT_INTERESTS, SAMPLE_ONGOING_REQUESTS, SAMPLE_VERIFICATION_INFO } from '../constants';
import { Money } from './Money';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Eye, Briefcase, RefreshCw, AlertCircle, Lock, LogOut, Trash2, Bell, ChevronRight } from 'lucide-react';

export const IncomingRequestsTab: React.FC<{ lang: 'en' | 'ar' }> = ({ lang }) => {
  const isAr = lang === 'ar';
  
  const getWhatsAppLink = (req: IncomingRequest) => {
    const projectName = req.projectName[lang];
    const message = isAr 
      ? `السلام عليكم، أود الاستفسار عن الطلب المقدم على مشروع ${projectName} من شركة ${req.investorName}.`
      : `Hello, I would like to inquire about the request submitted for the project ${projectName} from the company ${req.investorName}.`;
    return `https://wa.me/96560070353?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-4">
      {SAMPLE_INCOMING_REQUESTS.map(req => (
        <div key={req.id} className="bg-brand-gray/20 p-4 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white">{req.projectName[lang]}</h4>
            <p className="text-xs text-gray-400">{isAr ? 'المستثمر: ' : 'Investor: '}{req.investorName} • {req.date}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-[10px] font-bold ${req.status === 'new' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
              {req.status.toUpperCase()}
            </span>
            <a 
              href={getWhatsAppLink(req)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-brand-gold text-black px-3 py-1 rounded font-bold hover:bg-yellow-500 transition"
            >
              {isAr ? 'متابعة' : 'Follow Up'}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SentInterestsTab: React.FC<{ lang: 'en' | 'ar' }> = ({ lang }) => {
  const isAr = lang === 'ar';
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SAMPLE_SENT_INTERESTS.map(int => (
        <div key={int.id} className="bg-brand-gray/20 p-4 rounded-xl border border-white/5 flex gap-4">
          <img src={int.image} alt="" className="w-16 h-16 rounded-lg object-cover" />
          <div className="flex-1">
            <h4 className="font-bold text-white">{int.projectName[lang]}</h4>
            <p className="text-xs text-gray-400">{int.date}</p>
            <span className="text-[10px] font-bold text-brand-gold">{int.status.toUpperCase()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export const OngoingRequestsTab: React.FC<{ lang: 'en' | 'ar' }> = ({ lang }) => {
  const isAr = lang === 'ar';
  return (
    <div className="space-y-4">
      {SAMPLE_ONGOING_REQUESTS.map(deal => (
        <div key={deal.id} className="bg-brand-gray/20 p-4 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white">{deal.projectName[lang]}</h4>
            <p className="text-xs text-gray-400">{isAr ? 'الطرف الآخر: ' : 'Counterparty: '}{deal.counterparty}</p>
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-bold text-white">{deal.status.toUpperCase()}</span>
            <span className="text-[10px] text-gray-500">{deal.lastUpdate}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export const VerificationInfoTab: React.FC<{ lang: 'en' | 'ar' }> = ({ lang }) => {
  const isAr = lang === 'ar';
  const info = SAMPLE_VERIFICATION_INFO;
  return (
    <div className="bg-brand-gray/20 p-6 rounded-xl border border-white/5 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-white">{isAr ? 'حالة الحساب' : 'Account Status'}</h4>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${info.verificationStatus === 'review' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
          {info.verificationStatus.toUpperCase()}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <p className="text-gray-400">{isAr ? 'اسم الشركة: ' : 'Company Name: '}<span className="text-white">{info.companyName}</span></p>
        <p className="text-gray-400">{isAr ? 'رقم الترخيص: ' : 'License Number: '}<span className="text-white">{info.licenseNumber}</span></p>
      </div>
      <div className="flex gap-2 pt-4">
        <button className="bg-brand-gray border border-white/10 text-white px-4 py-2 rounded-lg font-bold text-xs">{isAr ? 'تحديث البيانات' : 'Update Data'}</button>
      </div>
    </div>
  );
};

export const SettingsTab: React.FC<{ lang: 'en' | 'ar' }> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="space-y-8">
      {/* Security */}
      <section className="bg-brand-gray/20 p-6 rounded-xl border border-white/5">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Lock size={18} className="text-brand-gold" /> {isAr ? 'الأمان' : 'Security'}</h3>
        <div className="space-y-4">
          <input type="password" placeholder={isAr ? 'كلمة المرور الحالية' : 'Current Password'} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm" />
          <input type="password" placeholder={isAr ? 'كلمة المرور الجديدة' : 'New Password'} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm" />
          <input type="password" placeholder={isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm" />
          <button className="bg-brand-gold text-black px-4 py-2 rounded-lg font-bold text-xs">{isAr ? 'تغيير كلمة المرور' : 'Change Password'}</button>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-brand-gray/20 p-6 rounded-xl border border-white/5">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Bell size={18} className="text-brand-gold" /> {isAr ? 'الإشعارات' : 'Notifications'}</h3>
        <div className="space-y-4">
          {['إشعارات الطلبات', 'إشعارات الاهتمام', 'إشعارات النظام'].map((label, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-gray-300">{isAr ? label : (i === 0 ? 'Request Notifications' : i === 1 ? 'Interest Notifications' : 'System Notifications')}</span>
              <div className="w-10 h-5 bg-brand-gold rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Account */}
      <section className="bg-brand-gray/20 p-6 rounded-xl border border-white/5">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><LogOut size={18} className="text-brand-gold" /> {isAr ? 'الحساب' : 'Account'}</h3>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-bold"><LogOut size={16} /> {isAr ? 'تسجيل الخروج' : 'Logout'}</button>
          <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 text-red-500 hover:text-red-400 text-sm font-bold"><Trash2 size={16} /> {isAr ? 'حذف الحساب' : 'Delete Account'}</button>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-brand-gray p-6 rounded-xl border border-white/10 max-w-sm w-full text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{isAr ? 'هل أنت متأكد؟' : 'Are you sure?'}</h3>
            <p className="text-sm text-gray-400 mb-6">{isAr ? 'سيتم حذف حسابك نهائياً ولا يمكن التراجع عن هذا الإجراء.' : 'Your account will be permanently deleted and this action cannot be undone.'}</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 bg-brand-gray border border-white/10 text-white py-2 rounded-lg font-bold">{isAr ? 'إلغاء' : 'Cancel'}</button>
              <button className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold">{isAr ? 'حذف الحساب' : 'Delete Account'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
