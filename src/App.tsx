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
import { PlaceholderPage } from './pages/PlaceholderPage';
import { DormSwitchModal } from './components/dorm/DormSwitchModal';
import { AuthRoleModal } from './components/auth/AuthRoleModal';
import { getCurrentSession } from './services/authService';
import { getLocalDormitories, getActiveDormitoryId } from './services/dormService';
import { DashboardSummary } from './types/dashboard';

const initialDormitory = {
  id: 'default-dorm',
  name: 'ภัทร์ลดาอพาร์ทเมนท์',
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
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

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
    const handleSettingsUpdate = (e: Event) => {
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
      if (detail?.role) {
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

    window.addEventListener('dormplus_settings_updated', handleSettingsUpdate);
    window.addEventListener('dormplus_dormitory_switched', handleDormSwitched);
    window.addEventListener('dormplus_auth_changed', handleAuthChanged);

    return () => {
      window.removeEventListener('dormplus_settings_updated', handleSettingsUpdate);
      window.removeEventListener('dormplus_dormitory_switched', handleDormSwitched);
      window.removeEventListener('dormplus_auth_changed', handleAuthChanged);
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
          unreadCount={dashboardData.unreadNotifications || 0}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenRoleModal={() => setIsRoleModalOpen(true)}
        />

        {/* Page Routing */}
        <main className="flex-1">{element}</main>
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website (หน้าบ้าน - ภัทร์ลดาอพาร์ทเมนท์) */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin Back-Office (ระบบจัดการหอพักหลังบ้าน) */}
        <Route
          path="/dashboard"
          element={renderAdminLayout(<DashboardPage onDataLoaded={handleDataLoaded} />)}
        />
        <Route path="/rooms" element={renderAdminLayout(<RoomsPage />)} />
        <Route path="/tenants" element={renderAdminLayout(<TenantsPage />)} />
        <Route path="/tenants/new" element={renderAdminLayout(<TenantsPage />)} />
        <Route path="/leases" element={renderAdminLayout(<LeasesPage />)} />
        <Route path="/leases/new" element={renderAdminLayout(<LeasesPage />)} />
        <Route path="/invoices" element={renderAdminLayout(<InvoicesPage />)} />
        <Route path="/finance" element={renderAdminLayout(<FinancePage />)} />
        <Route path="/finance/payments/new" element={renderAdminLayout(<FinancePage />)} />
        <Route path="/maintenance" element={renderAdminLayout(<MaintenancePage />)} />
        <Route path="/maintenance/new" element={renderAdminLayout(<MaintenancePage />)} />
        <Route path="/reports" element={renderAdminLayout(<ReportsPage />)} />
        <Route path="/messages" element={renderAdminLayout(<MessagesPage />)} />
        <Route path="/settings" element={renderAdminLayout(<SettingsPage />)} />
        <Route path="/notifications" element={renderAdminLayout(<NotificationsPage />)} />
        <Route path="/help" element={renderAdminLayout(<HelpPage />)} />
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

      <AuthRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onRoleChanged={(role) => {
          setDashboardData((prev) => ({
            ...prev,
            user: {
              ...initialUser,
              ...prev.user,
              role,
            },
          }));
        }}
      />
    </BrowserRouter>
  );
};

export default App;
