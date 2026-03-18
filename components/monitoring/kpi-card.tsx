'use client';

import { cn } from '@/lib/utils';
import type { SensorStatus } from '@/lib/types';
import { Camera, Activity, Thermometer, Building2, AlertTriangle } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  valueUnit: string;
  sub: string;
  status: SensorStatus;
  statusText: string;
  variant: 'cctv' | 'vibration' | 'chiller' | 'building' | 'alarm';
}

const variantConfig = {
  cctv: {
    icon: Camera,
    gradient: 'from-accent-blue/20 to-accent-cyan/10',
    iconBg: 'bg-accent-blue/20',
    iconColor: 'text-accent-blue',
  },
  vibration: {
    icon: Activity,
    gradient: 'from-accent-cyan/20 to-accent-blue/10',
    iconBg: 'bg-accent-cyan/20',
    iconColor: 'text-accent-cyan',
  },
  chiller: {
    icon: Thermometer,
    gradient: 'from-accent-green/20 to-accent-cyan/10',
    iconBg: 'bg-accent-green/20',
    iconColor: 'text-accent-green',
  },
  building: {
    icon: Building2,
    gradient: 'from-primary/20 to-accent-blue/10',
    iconBg: 'bg-primary/20',
    iconColor: 'text-primary',
  },
  alarm: {
    icon: AlertTriangle,
    gradient: 'from-accent-yellow/20 to-accent-red/10',
    iconBg: 'bg-accent-yellow/20',
    iconColor: 'text-accent-yellow',
  },
};

const statusConfig = {
  ok: { color: 'text-accent-green', bg: 'bg-accent-green/10' },
  warn: { color: 'text-accent-yellow', bg: 'bg-accent-yellow/10' },
  danger: { color: 'text-accent-red', bg: 'bg-accent-red/10' },
  offline: { color: 'text-muted-foreground', bg: 'bg-muted' },
};

export function KpiCard({ title, value, valueUnit, sub, status, statusText, variant }: KpiCardProps) {
  const config = variantConfig[variant];
  const statusStyle = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn('relative overflow-hidden rounded-xl border border-border bg-card p-4')}>
      {/* Background Gradient */}
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', config.gradient)} />

      {/* Content */}
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className={cn('rounded-lg p-2', config.iconBg)}>
            <Icon className={cn('h-5 w-5', config.iconColor)} />
          </div>
          <div className={cn('rounded-full px-2 py-0.5 text-xs font-medium', statusStyle.bg, statusStyle.color)}>
            {statusText}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{value}</span>
            <span className="text-sm text-muted-foreground">{valueUnit}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
        </div>
      </div>
    </div>
  );
}

export function KpiRow() {
  return (
    <div className="grid grid-cols-5 gap-4">
      <KpiCard
        title="CCTV 상태"
        value="8"
        valueUnit="/8"
        sub="냉각탑 4 · 팬류 4"
        status="ok"
        statusText="정상"
        variant="cctv"
      />
      <KpiCard
        title="진동 센서"
        value="12"
        valueUnit="/12"
        sub="엣지노드 무선"
        status="ok"
        statusText="정상"
        variant="vibration"
      />
      <KpiCard
        title="냉동기 상태"
        value="6"
        valueUnit="/6"
        sub="스크류냉동기"
        status="ok"
        statusText="정상"
        variant="chiller"
      />
      <KpiCard
        title="건물 현황"
        value="3"
        valueUnit="/3 건물"
        sub="AICC·관제탑·공항청사"
        status="ok"
        statusText="정상"
        variant="building"
      />
      <KpiCard
        title="알람 현황"
        value="3"
        valueUnit=" 건"
        sub="+1건 신규"
        status="warn"
        statusText="확인 필요"
        variant="alarm"
      />
    </div>
  );
}
