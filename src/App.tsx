import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DashboardPage } from './pages/DashboardPage';
import { RoomsPage } from './pages/RoomsPage';
import { TenantsPage } from './pages/TenantsPage';
import { LeasesPage } from './pages/LeasesPage';
import { FinancePage } from './pages/FinancePage';
import { MaintenancePage } from './pages/MaintenancePage';
import { ReportsPage } from './pages/ReportsPage';
import { MessagesPage } from './pages/MessagesPage';
import { SettingsPage } from './pages/SettingsPage';
import { InvoicesPage } from './pages/InvoicesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { HelpPage } from './pages/HelpPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { CookiePolicyPage } from './pages/CookiePolicyPage';
import { TermsPage } from './pages/TermsPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';
import { DormSwitchModal } from './components/dorm/DormSwitchModal';
import { LogoutConfirmModal } from './components/auth/LogoutConfirmModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { getCurrentSession, logout } from './services/authService';
import { getLocalDormitories, getActiveDormitoryId } from './services/dormService';
import { getLocalSettings, fetchSettings, DormSettings } from './services/settingsService';
import { getUnreadNotificationsCount } from './services/notificationService';
import { getUnreadMessagesCount } from './services/messageService';
import { subscribeToTableChanges } from './services/realtimeService';
import { useIdleTimer } from './hooks/useIdleTimer';
import { DashboardSummary } from './types/dashboard';
import { SystemTourProvider } from './contexts/SystemTourContext';
import { SystemTour } from './components/onboarding/SystemTour';

const initialDormitory = {
  id: 'default-dorm',
  name: 'ภัทร์ลดา อพาร์ทเมนท์',
  roomCount: 0,
  tenantCount: 0,
  plan: 'PREMIUM' as const,
};

const initialUser = {
  displayName: 'คุณเจ้าของหอพัก',
  role: 'OWNER' as const,
  avatarUrl: null,
};

export const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDormSwitchOpen, setIsDormSwitchOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [systemSettings, setSystemSettings] = useState<DormSettings>(() => getLocalSettings());
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  // Global Inactivity Auto-Logout Timer for Security & Anti-Session Hijacking
  useIdleTimer({
    enabled: systemSettings.autoLogoutEnabled,
    timeoutMinutes: systemSettings.autoLogoutMinutes,
  });

  const [dashboardData, setDashboardData] = useState<Partial<DashboardSummary>>(() => {
    const session = getCurrentSession();
    const dormList = getLocalDormitories();
    const activeDormId = getActiveDormitoryId();
    const activeDorm = dormList.find((d) => d.id === activeDormId) || dormList[0];
    return {
      dormitory: {
        id: activeDorm?.id || initialDormitory.id,
        name: activeDorm?.name || initialDormitory.name,
        roomCount: 0,
        tenantCount: 0,
        plan: activeDorm?.plan || initialDormitory.plan,
      },
      user: {
        displayName: session.displayName,
        role: session.role,
        avatarUrl: session.avatarUrl,
      },
      unreadNotifications: 0,
    };
  });

  const handleDataLoaded = useCallback((data: DashboardSummary) => {
    setDashboardData((prev) => {
      if (
        prev.rooms?.total === data.rooms.total &&
        prev.tenants?.total === data.tenants.total &&
        prev.dormitory?.name === data.dormitory.name
      ) {
        return prev;
      }
      return data;
    });
  }, []);

  useEffect(() => {
    fetchSettings().then((s) => setSystemSettings(s)).catch(() => {});

    const handleSettingsUpdate = (e: Event) => {
      setSystemSettings(getLocalSettings());
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setDashboardData((prev) => ({
          ...prev,
          dormitory: {
            ...initialDormitory,
            ...prev.dormitory,
            name: detail.dormitoryName || prev.dormitory?.name || initialDormitory.name,
            plan: detail.plan || prev.dormitory?.plan || initialDormitory.plan,
          },
          user: {
            ...initialUser,
            ...prev.user,
            displayName: detail.userDisplayName || prev.user?.displayName || initialUser.displayName,
            role: detail.userRole || prev.user?.role || initialUser.role,
          },
        }));
      }
    };

    const handleDormSwitched = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setDashboardData((prev) => ({
          ...prev,
          dormitory: {
            ...initialDormitory,
            ...prev.dormitory,
            id: detail.id,
            name: detail.name,
            plan: detail.plan || 'PREMIUM',
          },
        }));
      }
    };

    const handleAuthChanged = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.session) {
        setDashboardData((prev) => ({
          ...prev,
          user: {
            ...initialUser,
            displayName: detail.session.displayName,
            role: detail.session.role,
            avatarUrl: detail.session.avatarUrl,
          },
        }));
      } else if (detail?.role) {
        setDashboardData((prev) => ({
          ...prev,
          user: {
            ...initialUser,
            ...prev.user,
            role: detail.role,
          },
        }));
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'phatlada_system_settings' || e.key === 'dormplus_system_settings') {
        const local = getLocalSettings();
        setSystemSettings(local);
        setDashboardData((prev) => ({
          ...prev,
          dormitory: {
            ...initialDormitory,
            ...prev.dormitory,
            name: local.dormitoryName || prev.dormitory?.name || initialDormitory.name,
            plan: local.plan || prev.dormitory?.plan || initialDormitory.plan,
          },
          user: {
            ...initialUser,
            ...prev.user,
            displayName: local.userDisplayName || prev.user?.displayName || initialUser.displayName,
            role: local.userRole || prev.user?.role || initialUser.role,
          },
        }));
      }
    };

    const refreshCounters = async () => {
      try {
        const [n, m] = await Promise.all([
          getUnreadNotificationsCount(),
          getUnreadMessagesCount(),
        ]);
        setUnreadNotificationsCount(n);
        setUnreadMessagesCount(m);
        setDashboardData((prev) => ({ ...prev, unreadNotifications: n }));
      } catch {
        // ignore
      }
    };

    refreshCounters();

    const unsubMsg = subscribeToTableChanges('messages', () => {
      refreshCounters();
    });
    const unsubNotif = subscribeToTableChanges('notifications', () => {
      refreshCounters();
    });

    window.addEventListener('phatlada_notifications_updated', refreshCounters);
    window.addEventListener('phatlada_messages_updated', refreshCounters);
    const pollId = window.setInterval(refreshCounters, 15000);

    window.addEventListener('phatlada_settings_updated', handleSettingsUpdate);
    window.addEventListener('phatlada_dormitory_switched', handleDormSwitched);
    window.addEventListener('phatlada_auth_changed', handleAuthChanged);
    window.addEventListener('storage', handleStorage);

    return () => {
      unsubMsg();
      unsubNotif();
      window.clearInterval(pollId);
      window.removeEventListener('phatlada_notifications_updated', refreshCounters);
      window.removeEventListener('phatlada_messages_updated', refreshCounters);
      window.removeEventListener('phatlada_settings_updated', handleSettingsUpdate);
      window.removeEventListener('phatlada_dormitory_switched', handleDormSwitched);
      window.removeEventListener('phatlada_auth_changed', handleAuthChanged);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const renderAdminLayout = (element: React.ReactNode) => (
    <div className="flex min-h-screen bg-bg text-ink">
      {/* Sidebar */}
      <Sidebar
        dormitory={{
          name: dashboardData.dormitory?.name || initialDormitory.name,
          roomCount: dashboardData.rooms?.total || 0,
          tenantCount: dashboardData.tenants?.total || 0,
          plan: dashboardData.dormitory?.plan || initialDormitory.plan,
        }}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenDormSwitch={() => setIsDormSwitchOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <Topbar
          user={dashboardData.user || initialUser}
          unreadCount={unreadNotificationsCount}
          unreadMessagesCount={unreadMessagesCount}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenLogoutModal={() => setIsLogoutOpen(true)}
        />

        {/* Page Routing */}
        <main className="flex-1">{element}</main>
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <SystemTourProvider>
        <Routes>
        {/* Public Website (หน้าบ้าน - ภัทร์ลดา อพาร์ทเมนท์) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Authentication Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Back-Office (ระบบจัดการหอพักหลังบ้าน พร้อม Auth Guard) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {renderAdminLayout(<DashboardPage onDataLoaded={handleDataLoaded} />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              {renderAdminLayout(<RoomsPage />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenants"
          element={
            <ProtectedRoute>
              {renderAdminLayout(<TenantsPage />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenants/new"
          element={
            <ProtectedRoute>
              {renderAdminLayout(<TenantsPage />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/leases"
          element={
            <ProtectedRoute>
              {renderAdminLayout(<LeasesPage />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/leases/new"
          element={
            <ProtectedRoute>
              {renderAdminLayout(<LeasesPage />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              {renderAdminLayout(<InvoicesPage />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
              {renderAdminLayout(<FinancePage />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/finance/payments/new"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
              {renderAdminLayout(<FinancePage />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <ProtectedRoute>
              {renderAdminLayout(<MaintenancePage />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/maintenance/new"
          element={
            <ProtectedRoute>
              {renderAdminLayout(<MaintenancePage />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['OWNER', 'MANAGER']}>
              {renderAdminLayout(<ReportsPage />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              {renderAdminLayout(<MessagesPage />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              {renderAdminLayout(<SettingsPage />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              {renderAdminLayout(<NotificationsPage />)}
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              {renderAdminLayout(<HelpPage />)}
            </ProtectedRoute>
          }
        />
        <Route path="*" element={renderAdminLayout(<PlaceholderPage title="ไม่พบหน้าที่ต้องการ" />)} />
      </Routes>

      {/* Global Security & Dormitory Modals */}
      <DormSwitchModal
        isOpen={isDormSwitchOpen}
        onClose={() => setIsDormSwitchOpen(false)}
        onSwitched={(dorm) => {
          setDashboardData((prev) => ({
            ...prev,
            dormitory: {
              ...initialDormitory,
              ...prev.dormitory,
              id: dorm.id,
              name: dorm.name,
              plan: dorm.plan,
            },
          }));
        }}
      />

      <LogoutConfirmModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={async () => {
          await logout();
          window.location.href = '/login';
        }}
      />

      {/* Global Cookie Consent Banner (PDPA Compliant) */}
      <CookieConsentBanner />

      {/* First-time Onboarding Walkthrough Tour */}
      <SystemTour />
      </SystemTourProvider>
    </BrowserRouter>
  );
};

export default App;
