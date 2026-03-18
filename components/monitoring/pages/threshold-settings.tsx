'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Save, RotateCcw, Activity, Thermometer, Gauge, AlertTriangle } from 'lucide-react';

interface ThresholdConfig {
  id: string;
  category: string;
  name: string;
  unit: string;
  caution: number;
  warning: number;
  danger: number;
  icon: React.ElementType;
}

const defaultThresholds: ThresholdConfig[] = [
  { id: 'vibration-rms', category: '진동', name: 'RMS 진동', unit: 'mm/s', caution: 2.5, warning: 3.0, danger: 4.0, icon: Activity },
  { id: 'vibration-peak', category: '진동', name: 'Peak 진동', unit: 'mm/s', caution: 4.0, warning: 5.0, danger: 6.0, icon: Activity },
  { id: 'temp-bearing', category: '온도', name: '베어링 온도', unit: '°C', caution: 60, warning: 70, danger: 80, icon: Thermometer },
  { id: 'temp-motor', category: '온도', name: '모터 온도', unit: '°C', caution: 70, warning: 80, danger: 90, icon: Thermometer },
  { id: 'pressure-high', category: '압력', name: '냉동기 고압', unit: 'kg/cm²', caution: 14, warning: 15, danger: 16, icon: Gauge },
  { id: 'pressure-low', category: '압력', name: '냉동기 저압', unit: 'kg/cm²', caution: 3, warning: 2.5, danger: 2, icon: Gauge },
  { id: 'oil-level', category: '유면', name: '오일 레벨', unit: '%', caution: 55, warning: 50, danger: 45, icon: Gauge },
];

interface ThresholdRowProps {
  threshold: ThresholdConfig;
  onChange: (id: string, field: 'caution' | 'warning' | 'danger', value: number) => void;
}

function ThresholdRow({ threshold, onChange }: ThresholdRowProps) {
  const Icon = threshold.icon;

  return (
    <tr className="border-b border-border last:border-0 hover:bg-secondary/30">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-secondary p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">{threshold.name}</p>
            <p className="text-xs text-muted-foreground">{threshold.category}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-center text-sm text-muted-foreground">{threshold.unit}</td>
      <td className="px-4 py-4">
        <input
          type="number"
          value={threshold.caution}
          onChange={(e) => onChange(threshold.id, 'caution', parseFloat(e.target.value))}
          className="w-20 rounded-lg border border-accent-yellow/30 bg-accent-yellow/10 px-3 py-2 text-center text-sm font-medium text-accent-yellow focus:border-accent-yellow focus:outline-none"
        />
      </td>
      <td className="px-4 py-4">
        <input
          type="number"
          value={threshold.warning}
          onChange={(e) => onChange(threshold.id, 'warning', parseFloat(e.target.value))}
          className="w-20 rounded-lg border border-status-warn/30 bg-status-warn/10 px-3 py-2 text-center text-sm font-medium text-status-warn focus:border-status-warn focus:outline-none"
        />
      </td>
      <td className="px-4 py-4">
        <input
          type="number"
          value={threshold.danger}
          onChange={(e) => onChange(threshold.id, 'danger', parseFloat(e.target.value))}
          className="w-20 rounded-lg border border-accent-red/30 bg-accent-red/10 px-3 py-2 text-center text-sm font-medium text-accent-red focus:border-accent-red focus:outline-none"
        />
      </td>
    </tr>
  );
}

export function ThresholdSettingsPage() {
  const [thresholds, setThresholds] = useState(defaultThresholds);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (id: string, field: 'caution' | 'warning' | 'danger', value: number) => {
    setThresholds((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    // Save logic would go here
  };

  const handleReset = () => {
    setThresholds(defaultThresholds);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">알람 임계값 설정</h2>
          <p className="text-sm text-muted-foreground">설비별 알람 발생 기준값을 설정합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            <RotateCcw className="h-4 w-4" />
            초기화
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium',
              hasChanges
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            <Save className="h-4 w-4" />
            저장
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">알람 등급:</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-accent-yellow" />
          <span className="text-sm text-foreground">주의 (1차)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-status-warn" />
          <span className="text-sm text-foreground">경고 (2차)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-accent-red" />
          <span className="text-sm text-foreground">긴급 (3차)</span>
        </div>
      </div>

      {/* Threshold Table */}
      <div className="rounded-xl border border-border bg-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">항목</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-muted-foreground">단위</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-accent-yellow">
                주의 (1차)
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-status-warn">
                경고 (2차)
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-accent-red">
                긴급 (3차)
              </th>
            </tr>
          </thead>
          <tbody>
            {thresholds.map((threshold) => (
              <ThresholdRow key={threshold.id} threshold={threshold} onChange={handleChange} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h4 className="mb-2 font-medium text-foreground">설정 안내</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>- 주의(1차): 초기 이상 징후 감지 시 알림을 발생시킵니다.</li>
          <li>- 경고(2차): AI 분석과 결합하여 경고 알림을 발생시킵니다.</li>
          <li>- 긴급(3차): 즉각적인 조치가 필요한 상황에 긴급 알림을 발생시킵니다.</li>
          <li>- 저압 및 유면의 경우, 값이 해당 임계값 이하로 내려갈 때 알람이 발생합니다.</li>
        </ul>
      </div>
    </div>
  );
}
