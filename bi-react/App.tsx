
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/Store';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Projects } from './pages/Projects';
import { Investors } from './pages/Investors';
import { ProjectDetails } from './pages/ProjectDetails';
import { Pricing } from './pages/Pricing';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { RegisterType } from './pages/RegisterType';
import { LoginType } from './pages/LoginType';
import { Signup } from './pages/Signup';
import { VerifyEmail } from './pages/VerifyEmail';
import { Favorites } from './pages/Favorites';
import { TermsOfUse } from './pages/TermsOfUse';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { AddListing } from './pages/AddListing';
import { About } from './pages/About';
import { Statistics } from './pages/Statistics';
import { More } from './pages/More';
import { Notifications } from './pages/Notifications';
import { AllCategories } from './pages/AllCategories';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Wrapper to use router hooks inside ScrollToTop
const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/investors" element={<Investors />} />
        <Route path="/stats" element={<Statistics />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/more" element={<More />} />
        <Route path="/categories" element={<AllCategories />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-type" element={<LoginType />} />
        <Route path="/register-type" element={<RegisterType />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/advertiser/new-listing" element={<AddListing />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;
