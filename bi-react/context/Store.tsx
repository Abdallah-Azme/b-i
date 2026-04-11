
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Project, Language, NotificationItem } from '../types';
import { SAMPLE_PROJECTS } from '../constants';

interface StoreContextType {
  user: User | null;
  lang: Language;
  projects: Project[];
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  toggleLanguage: () => void;
  login: (role: UserRole | 'company', email?: string) => void;
  logout: () => void;
  unlockProject: (projectId: string) => void;
  isProjectUnlocked: (projectId: string) => boolean;
  isPubliclyVisible: (project: Project) => boolean;
  requestInterest: (projectId: string) => void;
  interestedInvestors: string[];
  toggleInterestInvestor: (investorId: string) => void;
  isInterestedInInvestor: (investorId: string) => boolean;
  toggleFavorite: (projectId: string) => void;
  isFavorite: (projectId: string) => boolean;
  addProject: (projectData: Partial<Project>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Demo Data Generator for Store Initialization
const generateDemoNotifications = (): NotificationItem[] => {
  const now = Date.now();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  return [
    {
      id: 'n-1',
      type: 'interest',
      title: { ar: 'اهتمام جديد', en: 'New Interest' },
      message: { ar: 'قام مستثمر بتسجيل اهتمام بمشروعك PROJ-1002', en: 'An investor registered interest in PROJ-1002' },
      createdAt: new Date(now - 5 * minute).toISOString(),
      isRead: false,
      link: '/projects/PROJ-1002'
    },
    {
      id: 'n-2',
      type: 'deal',
      title: { ar: 'تحديث الصفقة', en: 'Deal Update' },
      message: { ar: 'تم قبول العرض المبدئي لصفقة المطعم', en: 'Initial offer accepted for the Restaurant deal' },
      createdAt: new Date(now - 45 * minute).toISOString(),
      isRead: false,
      link: '/dashboard'
    },
    {
      id: 'n-3',
      type: 'system',
      title: { ar: 'توثيق الحساب', en: 'Account Verification' },
      message: { ar: 'تم توثيق حسابك بنجاح. يمكنك الآن الوصول لكل الميزات.', en: 'Your account is successfully verified. You have full access.' },
      createdAt: new Date(now - 2 * hour).toISOString(),
      isRead: true
    },
    {
      id: 'n-4',
      type: 'project',
      title: { ar: 'مشروع جديد', en: 'New Project' },
      message: { ar: 'تمت إضافة مشروع جديد في قطاع التكنولوجيا', en: 'A new project was added in the Technology sector' },
      createdAt: new Date(now - 5 * hour).toISOString(),
      isRead: false,
      link: '/projects'
    },
    {
      id: 'n-5',
      type: 'deal',
      title: { ar: 'شراء كراسة', en: 'Booklet Purchased' },
      message: { ar: 'قام مستثمر بشراء كراسة المشروع PROJ-1044', en: 'An investor purchased the booklet for PROJ-1044' },
      createdAt: new Date(now - 1 * day).toISOString(),
      isRead: true
    },
    {
      id: 'n-6',
      type: 'system',
      title: { ar: 'تنبيه أمان', en: 'Security Alert' },
      message: { ar: 'تم تسجيل دخول جديد من جهاز غير معروف', en: 'New login detected from an unknown device' },
      createdAt: new Date(now - 1.5 * day).toISOString(),
      isRead: true
    },
    {
      id: 'n-7',
      type: 'interest',
      title: { ar: 'رسالة من الإدارة', en: 'Admin Message' },
      message: { ar: 'يرجى تحديث بيانات الملف الشخصي لاستكمال الإجراءات', en: 'Please update your profile to complete procedures' },
      createdAt: new Date(now - 2 * day).toISOString(),
      isRead: false,
      link: '/dashboard'
    },
    {
      id: 'n-8',
      type: 'project',
      title: { ar: 'فرصة مميزة', en: 'Featured Opportunity' },
      message: { ar: 'فرصة استثمارية ذهبية في قطاع العقارات متاحة الآن', en: 'Golden investment opportunity in Real Estate is now live' },
      createdAt: new Date(now - 3 * day).toISOString(),
      isRead: true,
      link: '/projects'
    },
    {
      id: 'n-9',
      type: 'deal',
      title: { ar: 'اكتمال صفقة', en: 'Deal Completed' },
      message: { ar: 'مبروك! تم إغلاق جولة الاستثمار لمشروع القهوة', en: 'Congrats! Investment round closed for the Coffee project' },
      createdAt: new Date(now - 4 * day).toISOString(),
      isRead: true
    },
    {
      id: 'n-10',
      type: 'system',
      title: { ar: 'تحديث النظام', en: 'System Update' },
      message: { ar: 'تم تحديث سياسة الخصوصية الخاصة بالمنصة', en: 'Platform Privacy Policy has been updated' },
      createdAt: new Date(now - 5 * day).toISOString(),
      isRead: true,
      link: '/privacy-policy'
    },
    {
      id: 'n-11',
      type: 'interest',
      title: { ar: 'تذكير', en: 'Reminder' },
      message: { ar: 'لديك طلبات صداقة معلقة من مستثمرين آخرين', en: 'You have pending connection requests from investors' },
      createdAt: new Date(now - 6 * day).toISOString(),
      isRead: true
    },
    {
      id: 'n-12',
      type: 'project',
      title: { ar: 'مشروع مماثل', en: 'Similar Project' },
      message: { ar: 'مشروع مشابه لاهتماماتك تم نشره للتو', en: 'A project matching your interests was just published' },
      createdAt: new Date(now - 1 * day).toISOString(),
      isRead: false,
      link: '/projects'
    }
  ];
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('ar');
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [interestedInvestors, setInterestedInvestors] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isNotificationsInitialized, setIsNotificationsInitialized] = useState(false);

  // Load Interested Investors on Mount
  useEffect(() => {
    const saved = localStorage.getItem('bi_interested_investors');
    if (saved) {
      setInterestedInvestors(JSON.parse(saved));
    }
  }, []);

  // Sync Interested Investors to LocalStorage
  useEffect(() => {
    localStorage.setItem('bi_interested_investors', JSON.stringify(interestedInvestors));
  }, [interestedInvestors]);

  // Layout direction effect
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Load Notifications on Mount
  useEffect(() => {
    const saved = localStorage.getItem('bi_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
      } catch (e) {
        // Fallback if corrupted
        const demo = generateDemoNotifications();
        setNotifications(demo);
        localStorage.setItem('bi_notifications', JSON.stringify(demo));
      }
    } else {
      const demo = generateDemoNotifications();
      setNotifications(demo);
      localStorage.setItem('bi_notifications', JSON.stringify(demo));
    }
    setIsNotificationsInitialized(true);
  }, []);

  // Sync Notifications to LocalStorage
  useEffect(() => {
    if (isNotificationsInitialized) {
      localStorage.setItem('bi_notifications', JSON.stringify(notifications));
    }
  }, [notifications, isNotificationsInitialized]);

  const toggleLanguage = () => setLang(prev => prev === 'en' ? 'ar' : 'en');

  const login = (roleInput: UserRole | 'company', email: string = 'user@bi-platform.com') => {
    // Migration/Normalization: Handle legacy 'company' role input
    const role: UserRole = roleInput === 'company' ? 'advertiser' : roleInput;

    // Fixed ID for demo advertiser to allow showing "My Projects"
    const userId = (role === 'advertiser' && email.includes('advertiser')) 
        ? 'USR-DEMO-OWNER' 
        : `USR-${Math.floor(Math.random() * 10000)}`;

    // Mock login with random ID and provided email
    // If role is advertiser (formerly company), we simulate a license URL being present
    const licenseUrl = role === 'advertiser' 
      ? 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80' // Mock Document Image
      : undefined;

    setUser({
      id: userId,
      name: role === 'advertiser' ? 'Business Owner' : 'Verified Investor',
      email: email,
      role: role,
      subscriptionPlan: role === 'investor' ? 'premium' : undefined,
      unlockedProjects: (role === 'advertiser' && email.includes('advertiser')) ? ['PROJ-1000', 'PROJ-1001'] : [],
      favorites: [],
      companyLicenseUrl: licenseUrl
    });
  };

  const logout = () => setUser(null);

  const isInterestedInInvestor = (investorId: string) => interestedInvestors.includes(investorId);

  const toggleInterestInvestor = (investorId: string) => {
    if (!user || user.role !== 'advertiser') {
      alert(lang === 'en' ? 'Only business owners can express interest.' : 'فقط أصحاب الأعمال يمكنهم إبداء الاهتمام.');
      return;
    }
    
    if (isInterestedInInvestor(investorId)) return;
    
    setInterestedInvestors(prev => [...prev, investorId]);
    alert(lang === 'en' ? 'Interest sent to admin.' : 'تم إرسال الاهتمام للإدارة.');
  };

  const unlockProject = (projectId: string) => {
    if (!user) return;
    if (user.unlockedProjects.includes(projectId)) return;
    
    // Simulate payment success
    setUser({ ...user, unlockedProjects: [...user.unlockedProjects, projectId] });
    alert(lang === 'en' ? 'Payment Successful. File Unlocked.' : 'تم الدفع بنجاح. تم فتح الملف.');
  };

  const isProjectUnlocked = (projectId: string) => {
    if (!user) return false;
    return user.unlockedProjects.includes(projectId);
  };

  const isPubliclyVisible = (project: Project) => {
    return project.status === 'published' || project.status === 'approved';
  };

  const requestInterest = (projectId: string) => {
    alert(lang === 'en' ? 'Interest registered. Admin will contact you shortly.' : 'تم تسجيل اهتمامك. سيتصل بك المسؤول قريباً.');
  };

  const toggleFavorite = (projectId: string) => {
    if (!user) {
      alert(lang === 'en' ? 'Please login to save favorites.' : 'يرجى تسجيل الدخول لحفظ المفضلة.');
      return;
    }
    
    const isFav = user.favorites.includes(projectId);
    const newFavorites = isFav 
      ? user.favorites.filter(id => id !== projectId)
      : [...user.favorites, projectId];
      
    setUser({ ...user, favorites: newFavorites });
  };

  const isFavorite = (projectId: string) => {
    if (!user) return false;
    return user.favorites.includes(projectId);
  };

  // Add Project / Listing
  const addProject = (projectData: Partial<Project>) => {
    if (!user) return;
    
    const newProject: Project = {
       id: `PROJ-${Math.floor(Math.random() * 100000)}`,
       ownerId: user.id,
       name: projectData.name || { ar: 'مشروع جديد', en: 'New Project' },
       category: projectData.category || { ar: 'غير محدد', en: 'Uncategorized' },
       image: projectData.image || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
       capital: projectData.capital || 0,
       age: projectData.age || { ar: '0 سنوات', en: '0 Years' },
       shareOffered: projectData.shareOffered || 0,
       askingPrice: projectData.askingPrice || 0,
       location: projectData.location || { ar: 'الكويت', en: 'Kuwait' },
       descriptionShort: projectData.descriptionShort || { ar: '', en: '' },
       descriptionFull: projectData.descriptionFull || { ar: '', en: '' },
       financialHealth: projectData.financialHealth || 'Stable',
       status: 'pending',
       createdAt: new Date().toISOString(),
       listingPurpose: projectData.listingPurpose || 'investment',
       ...projectData
    } as Project;

    setProjects(prev => [newProject, ...prev]);
  };

  // Notification Methods
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...userData });
  };

  return (
    <StoreContext.Provider value={{ 
      user, lang, projects, toggleLanguage, login, logout, unlockProject, isProjectUnlocked, isPubliclyVisible, requestInterest, toggleFavorite, isFavorite, addProject,
      notifications, unreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, clearAllNotifications, updateUser,
      interestedInvestors, toggleInterestInvestor, isInterestedInInvestor
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
