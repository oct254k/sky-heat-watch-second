'use client';

import { KpiRow } from '../kpi-card';
import { CctvGrid } from '../cctv-grid';
import { AlarmPanel } from '../alarm-panel';
import { SensorGrid } from '../sensor-grid';
import { ChillerGrid } from '../chiller-grid';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI Row */}
      <KpiRow />

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* CCTV Section - 2 columns */}
        <div className="col-span-2">
          <CctvGrid compact />
        </div>

        {/* Alarm Panel - 1 column */}
        <div className="col-span-1">
          <AlarmPanel compact />
        </div>
      </div>

      {/* Sensor Grid */}
      <SensorGrid compact />

      {/* Chiller Grid */}
      <ChillerGrid compact />
    </div>
  );
}
