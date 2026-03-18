'use client';

import { cn } from '@/lib/utils';
import { DEFAULT_SENSORS } from '@/lib/data';
import type { SensorData, SensorStatus } from '@/lib/types';
import { Activity, Thermometer } from 'lucide-react';

const statusConfig: Record<SensorStatus, { bg: string; border: string; text: string }> = {
  ok: { bg: 'bg-accent-green/10', border: 'border-accent-green/30', text: 'text-accent-green' },
  warn: { bg: 'bg-accent-yellow/10', border: 'border-accent-yellow/30', text: 'text-accent-yellow' },
  danger: { bg: 'bg-accent-red/10', border: 'border-accent-red/30', text: 'text-accent-red' },
  offline: { bg: 'bg-muted', border: 'border-muted', text: 'text-muted-foreground' },
};

interface SensorCardProps {
  sensor: SensorData;
}

function SensorCard({ sensor }: SensorCardProps) {
  const config = statusConfig[sensor.status];

  return (
    <div className={cn('rounded-lg border p-3 transition-all hover:scale-[1.02]', config.border, config.bg)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{sensor.id}</span>
        <span className={cn('h-2 w-2 rounded-full', sensor.status === 'ok' ? 'bg-accent-green' : sensor.status === 'warn' ? 'bg-accent-yellow' : 'bg-accent-red')} />
      </div>

      {/* Location */}
      <p className="mt-1 truncate text-sm font-medium text-foreground">{sensor.location}</p>

      {/* Values */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-1.5">
          <Activity className={cn('h-3.5 w-3.5', config.text)} />
          <div>
            <p className={cn('text-sm font-semibold', config.text)}>{sensor.vibration}</p>
            <p className="text-[10px] text-muted-foreground">mm/s</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Thermometer className="h-3.5 w-3.5 text-accent-cyan" />
          <div>
            <p className="text-sm font-semibold text-foreground">{sensor.temperature}</p>
            <p className="text-[10px] text-muted-foreground">°C</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SensorGridProps {
  compact?: boolean;
}

export function SensorGrid({ compact = false }: SensorGridProps) {
  const displaySensors = compact ? DEFAULT_SENSORS.slice(0, 6) : DEFAULT_SENSORS;

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h3 className="font-semibold text-foreground">센서 데이터 현황</h3>
          <p className="text-sm text-muted-foreground">진동센서 12ea · BEMS 연동 온도 8ea</p>
        </div>
        {!compact && (
          <button className="text-sm text-primary hover:underline">상세 보기</button>
        )}
      </div>

      {/* Grid */}
      <div className={cn('grid gap-3 p-4', compact ? 'grid-cols-3' : 'grid-cols-6')}>
        {displaySensors.map((sensor) => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}
      </div>
    </div>
  );
}
