
import React, { useState, useEffect } from 'react';
import { User, UserRole, Project, Language, NotificationItem } from '../types';
import i18n from '@/i18n';
import { generalService } from '../features/general/services/generalService';
import { StoreContext } from './StoreContext';
import { queryClient } from '@/lib/query-client';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(
    () => (localStorage.getItem('bi_lang') as Language) || 'ar'
  );
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
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

  // Initialize language on mount
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    i18n.changeLanguage(lang);
  }, []);

  // Load Notifications on Mount
  useEffect(() => {
    const saved = localStorage.getItem('bi_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed);
      } catch (e) {
        setNotifications([]);
      }
    } else {
      setNotifications([]);
    }
    setIsNotificationsInitialized(true);
  }, []);

  // Sync Notifications to LocalStorage
  useEffect(() => {
    if (isNotificationsInitialized) {
      localStorage.setItem('bi_notifications', JSON.stringify(notifications));
    }
  }, [notifications, isNotificationsInitialized]);

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    
    // Update synchronously before refetching
    i18n.changeLanguage(newLang);
    localStorage.setItem('bi_lang', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    
    setLang(newLang);
    generalService.changeLang(newLang).catch(console.error);
    
    // Invalidate all cached queries so they refetch with the new Accept-Language header
    queryClient.invalidateQueries();
  };

  const login = (roleInput: UserRole | 'company', email: string = 'user@bi-platform.com') => {
    const role: UserRole = roleInput === 'company' ? 'advertiser' : roleInput;
    const userId = (role === 'advertiser' && email.includes('advertiser')) 
        ? 'USR-DEMO-OWNER' 
        : `USR-${Math.floor(Math.random() * 10000)}`;

    const licenseUrl = role === 'advertiser' 
      ? 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80' 
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
