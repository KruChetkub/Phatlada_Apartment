import React, { useEffect, useState, useRef } from 'react';
import { DashboardSummary } from '../types/dashboard';
import { fetchDashboardSummary } from '../services/dashboardService';
import { HeroBanner } from '../components/dashboard/HeroBanner';
import { KpiCards } from '../components/dashboard/KpiCard';
import { IncomeExpenseCard } from '../components/dashboard/IncomeExpenseCard';
import { RoomStatusCard } from '../components/dashboard/RoomStatusCard';
import { LatestRoomsTable } from '../components/dashboard/LatestRoomsTable';
import { RecentPaymentsList } from '../components/dashboard/RecentPaymentsList';
import { NotificationsPanel } from '../components/dashboard/NotificationsPanel';
import { QuickMenu } from '../components/dashboard/QuickMenu';
import { PromoCard } from '../components/dashboard/PromoCard';

interface DashboardPageProps {
  onDataLoaded?: (data: DashboardSummary) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onDataLoaded }) => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const onDataLoadedRef = useRef(onDataLoaded);
  useEffect(() => {
    onDataLoadedRef.current = onDataLoaded;
  }, [onDataLoaded]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        const result = await fetchDashboardSummary();
        if (isMounted) {
          setData(result);
          onDataLoadedRef.current?.(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-5 animate-pulse">
        {/* Skeleton Banner */}
        <div className="h-36 rounded-lg bg-[#EEF2F0]" />
        {/* Skeleton KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="h-28 rounded-lg bg-[#EEF2F0]" />
          <div className="h-28 rounded-lg bg-[#EEF2F0]" />
          <div className="h-28 rounded-lg bg-[#EEF2F0]" />
          <div className="h-28 rounded-lg bg-[#EEF2F0]" />
        </div>
        {/* Skeleton Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 h-80 rounded-lg bg-[#EEF2F0]" />
          <div className="lg:col-span-4 h-80 rounded-lg bg-[#EEF2F0]" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-tone-red-solid/30 bg-tone-red-soft p-6 text-center text-ink">
          <h3 className="text-lg font-semibold text-tone-red-solid">โหลดข้อมูลไม่สำเร็จ</h3>
          <p className="mt-1 text-sm text-ink-secondary">{error || 'ไม่พบข้อมูล Dashboard'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-md bg-tone-red-solid px-4 py-2 text-xs font-semibold text-white shadow-sm hover:opacity-90"
          >
            ลองอีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 lg:p-6 space-y-5">
      {/* Top Section: Main Content (Left/Center) + Right Rail */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Center Main Column (approx 72% on wide screens) */}
        <div className="xl:col-span-8 space-y-5">
          {/* Row 1: Hero Banner */}
          <HeroBanner userName={data.user.displayName} />

          {/* Row 2: 4 KPI Cards */}
          <KpiCards data={data} />

          {/* Row 3: Income/Expense Bar Chart + Room Status Donut */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7">
              <IncomeExpenseCard finance={data.finance} />
            </div>
            <div className="lg:col-span-5">
              <RoomStatusCard rooms={data.rooms} />
            </div>
          </div>

          {/* Row 4: Latest Rooms Table + Recent Payments */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7">
              <LatestRoomsTable rooms={data.latestRooms} />
            </div>
            <div className="lg:col-span-5">
              <RecentPaymentsList payments={data.recentPayments} />
            </div>
          </div>
        </div>

        {/* Right Rail (approx 28% on wide screens: 340px width target) */}
        <div className="xl:col-span-4 space-y-5">
          {/* 1. Notifications Panel */}
          <NotificationsPanel notifications={data.notifications} />

          {/* 2. Quick Menu (3x2) */}
          <QuickMenu />

          {/* 3. Promo Card */}
          <PromoCard />
        </div>
      </div>
    </div>
  );
};

