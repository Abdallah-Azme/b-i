
import { createContext } from 'react';
import { User, UserRole, Project, Language, NotificationItem } from '../types';

export interface StoreContextType {
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

export const StoreContext = createContext<StoreContextType | undefined>(undefined);
