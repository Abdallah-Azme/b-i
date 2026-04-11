
import { IncomingRequest, SentInterest, OngoingRequest, VerificationInfo, NotificationItem } from '@/shared/types';

export const SAMPLE_INCOMING_REQUESTS: IncomingRequest[] = [
  {
    id: 'REQ-001',
    investorName: 'Al-Kharafi Group',
    projectName: { en: 'Luxury Italian Restaurant', ar: 'مطعم إيطالي فاخر' },
    date: '2024-03-15',
    status: 'new'
  },
  {
    id: 'REQ-002',
    investorName: 'Ahmed Al-Sabah',
    projectName: { en: 'Luxury Italian Restaurant', ar: 'مطعم إيطالي فاخر' },
    date: '2024-03-10',
    status: 'replied'
  }
];

export const SAMPLE_SENT_INTERESTS: SentInterest[] = [
  {
    id: 'INT-501',
    projectName: { en: 'Tech Startup X', ar: 'شركة تقنية ناشئة X' },
    date: '2024-03-20',
    status: 'sent',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80'
  }
];

export const SAMPLE_ONGOING_REQUESTS: OngoingRequest[] = [
  {
    id: 'DEAL-901',
    projectName: { en: 'Boutique Coffee Shop', ar: 'مقهى بوتيك' },
    counterparty: 'Ali Al-Salem',
    status: 'negotiation',
    lastUpdate: '2 hours ago'
  }
];

export const SAMPLE_VERIFICATION_INFO: VerificationInfo = {
  accountStatus: 'verified',
  companyName: 'Ahmed Ventures Co.',
  licenseNumber: 'L-99201-2024',
  verificationStatus: 'verified'
};

export const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NOT-001',
    type: 'project',
    title: { en: 'New Project Listed', ar: 'مشروع جديد تم إدراجه' },
    message: { en: 'A new luxury restaurant project matches your profile.', ar: 'مشروع مطعم فاخر جديد يطابق اهتماماتك.' },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    link: '/projects/p1'
  },
  {
    id: 'NOT-002',
    type: 'interest',
    title: { en: 'Interest Received', ar: 'تم استلام اهتمام' },
    message: { en: 'ABC Group is interested in your Italian Restaurant project.', ar: 'مجموعة ABC مهتمة بمشروعك (المطعم الإيطالي).' },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    link: '/dashboard'
  },
  {
    id: 'NOT-003',
    type: 'system',
    title: { en: 'Account Verified', ar: 'تم توثيق الحساب' },
    message: { en: 'Your advertiser account has been successfully verified.', ar: 'تم توثيق حسابك كصاحب عمل بنجاح.' },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    isRead: true
  }
];
