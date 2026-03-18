'use client';

import { cn } from '@/lib/utils';
import { DEFAULT_CHILLERS } from '@/lib/data';
import type { ChillerData } from '@/lib/types';
import { Thermometer, Gauge, Droplets, ArrowRight } from 'lucide-react';

interface ChillerCardProps {
  chiller: ChillerData;
}

function ChillerCard({ chiller }: ChillerCardProps) {
  const isRunning = chiller.status === 'running';
  const isError = chiller.status === 'error';

  const statusConfig = {
    running: { label: '가동', color: 'bg-accent-green', textColor: 'text-accent-green' },
    standby: { label: '대기', color: 'bg-accent-yellow', textColor: 'text-accent-yellow' },
    error: { label: '오류', color: 'bg-accent-red', textColor: 'text-accent-red' },
  };

  const config = statusConfig[chiller.status];

  const checkValue = (value: number, min: number, max: number) => {
    if (value === 0) return 'neutral';
    if (value >= min && value <= max) return 'ok';
    return 'warn';
  };

  const valueStatusStyle = {
    ok: 'text-accent-green',
    warn: 'text-accent-yellow',
    neutral: 'text-muted-foreground',
  };

  return (
    <div
      className={cn(
        'rounded-xl border bg-card transition-all hover:scale-[1.01]',
        isError ? 'border-accent-red/50' : 'border-border'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <p className="text-sm font-semibold text-foreground">{chiller.name}</p>
          <p className="text-xs text-muted-foreground">{chiller.zone}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('relative flex h-2.5 w-2.5')}>
            {isRunning && (
              <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', config.color)} />
            )}
            <span className={cn('relative inline-flex h-2.5 w-2.5 rounded-full', config.color)} />
          </span>
          <span className={cn('text-sm font-medium', config.textColor)}>{config.label}</span>
        </div>
      </div>

      {/* USRT */}
      <div className="border-b border-border p-4">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-foreground">{chiller.usrt}</span>
          <span className="text-sm text-muted-foreground">USRT</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-px bg-border">
        <div className="bg-card p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Gauge className="h-3.5 w-3.5" />
            <span>고압</span>
          </div>
          <p className={cn('mt-1 text-sm font-semibold', valueStatusStyle[checkValue(chiller.highPressure, 12, 15)])}>
            {chiller.highPressure > 0 ? `${chiller.highPressure} kg/cm²` : '-'}
          </p>
        </div>
        <div className="bg-card p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Gauge className="h-3.5 w-3.5" />
            <span>저압</span>
          </div>
          <p className={cn('mt-1 text-sm font-semibold', valueStatusStyle[checkValue(chiller.lowPressure, 3, 5)])}>
            {chiller.lowPressure > 0 ? `${chiller.lowPressure} kg/cm²` : '-'}
          </p>
        </div>
        <div className="bg-card p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Droplets className="h-3.5 w-3.5" />
            <span>유면</span>
          </div>
          <p className={cn('mt-1 text-sm font-semibold', valueStatusStyle[checkValue(chiller.oilLevel, 50, 80)])}>
            {chiller.oilLevel}%
          </p>
        </div>
        <div className="bg-card p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Thermometer className="h-3.5 w-3.5" />
            <span>토출온도</span>
          </div>
          <p className={cn('mt-1 text-sm font-semibold', valueStatusStyle[checkValue(chiller.dischargeTemp, 60, 80)])}>
            {isRunning ? `${chiller.dischargeTemp}°C` : '-'}
          </p>
        </div>
      </div>

      {/* Chilled Water */}
      {isRunning && (
        <div className="border-t border-border p-3">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="font-medium text-accent-cyan">{chiller.chilledWaterIn}°C</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-accent-blue">{chiller.chilledWaterOut}°C</span>
            <span className="text-xs text-muted-foreground">
              (ΔT: {chiller.chilledWaterIn - chiller.chilledWaterOut}°C)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

interface ChillerGridProps {
  compact?: boolean;
}

export function ChillerGrid({ compact = false }: ChillerGridProps) {
  const displayChillers = compact ? DEFAULT_CHILLERS.slice(0, 4) : DEFAULT_CHILLERS;

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h3 className="font-semibold text-foreground">스크류냉동기 운전 상태</h3>
          <p className="text-sm text-muted-foreground">건물별 냉동기 {DEFAULT_CHILLERS.length}대 · Century/DDC/BEMS 연동</p>
        </div>
        {!compact && (
          <button className="text-sm text-primary hover:underline">상세 보기</button>
        )}
      </div>

      {/* Grid */}
      <div className={cn('grid gap-4 p-4', compact ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-3')}>
        {displayChillers.map((chiller) => (
          <ChillerCard key={chiller.id} chiller={chiller} />
        ))}
      </div>
    </div>
  );
}
