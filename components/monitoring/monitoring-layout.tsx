'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './sidebar';
import { Header } from './header';
import type { PageId } from '@/lib/types';

// Pages
import { DashboardPage } from './pages/dashboard';
import { VideoMonitoringPage } from './pages/video-monitoring';
import { ChillerStatusPage } from './pages/chiller-status';
import { AlarmManagementPage } from './pages/alarm-management';
import { EquipmentStatusPage } from './pages/equipment-status';
import { ThresholdSettingsPage } from './pages/threshold-settings';
import { IntegrationStatusPage } from './pages/integration-status';
import { InspectionLogPage } from './pages/inspection-log';
import { AiChatbotPage } from './pages/ai-chatbot';
import { AiPredictionPage } from './pages/ai-prediction';

const pageComponents: Record<PageId, React.ComponentType> = {
  p1: DashboardPage,
  p2: VideoMonitoringPage,
  p3: ChillerStatusPage,
  p4: AlarmManagementPage,
  p5: EquipmentStatusPage,
  p6: ThresholdSettingsPage,
  p7: IntegrationStatusPage,
  p8: InspectionLogPage,
  p9: AiChatbotPage,
  p10: AiPredictionPage,
};

export function MonitoringLayout() {
  const [currentPage, setCurrentPage] = useState<PageId>('p1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const CurrentPageComponent = pageComponents[currentPage];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          isSidebarCollapsed ? 'ml-16' : 'ml-60'
        )}
      >
        <Header currentPage={currentPage} />
        <div className="p-6">
          <CurrentPageComponent />
        </div>
      </main>
    </div>
  );
}
