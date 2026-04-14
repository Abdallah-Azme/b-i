import { useAuthStore } from '../services/auth-store';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const interestedInvestors = useAuthStore((state) => state.interestedInvestors);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const unlockProject = useAuthStore((state) => state.unlockProject);
  const toggleFavorite = useAuthStore((state) => state.toggleFavorite);
  const updateUser = useAuthStore((state) => state.updateUser);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);
  const requestInterest = useAuthStore((state) => state.requestInterest);
  const toggleInterestInvestor = useAuthStore((state) => state.toggleInterestInvestor);
  const isInterestedInInvestor = useAuthStore((state) => state.isInterestedInInvestor);

  return {
    user,
    isLoading,
    interestedInvestors,
    login,
    logout,
    unlockProject,
    toggleFavorite,
    updateUser,
    refreshProfile,
    requestInterest,
    toggleInterestInvestor,
    isInterestedInInvestor,
  };
};
