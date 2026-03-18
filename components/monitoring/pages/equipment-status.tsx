'use client';

import { cn } from '@/lib/utils';
import { DEFAULT_CHILLERS, DEFAULT_CAMERAS, DEFAULT_SENSORS } from '@/lib/data';
import {
  Building2,
  Thermometer,
  Camera,
  Activity,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface BuildingData {
  id: string;
  name: string;
  chillerCount: number;
  chillerRunning: number;
  cctvCount: number;
  cctvOnline: number;
  sensorCount: number;
  sensorOk: number;
  status: 'ok' | 'warn' | 'danger';
}

const buildings: BuildingData[] = [
  {
    id: 'aicc',
    name: 'AICC',
    chillerCount: 2,
    chillerRunning: 2,
    cctvCount: 4,
    cctvOnline: 4,
    sensorCount: 6,
    sensorOk: 5,
    status: 'warn',
  },
  {
    id: 'control-tower',
    name: '관제탑',
    chillerCount: 2,
    chillerRunning: 1,
    cctvCount: 2,
    cctvOnline: 2,
    sensorCount: 3,
    sensorOk: 3,
    status: 'ok',
  },
  {
    id: 'terminal',
    name: '공항청사',
    chillerCount: 2,
    chillerRunning: 1,
    cctvCount: 2,
    cctvOnline: 2,
    sensorCount: 3,
    sensorOk: 3,
    status: 'ok',
  },
];

const statusConfig = {
  ok: { color: 'text-accent-green', bg: 'bg-accent-green/10', border: 'border-accent-green/30' },
  warn: { color: 'text-accent-yellow', bg: 'bg-accent-yellow/10', border: 'border-accent-yellow/30' },
  danger: { color: 'text-accent-red', bg: 'bg-accent-red/10', border: 'border-accent-red/30' },
};

interface BuildingCardProps {
  building: BuildingData;
}

function BuildingCard({ building }: BuildingCardProps) {
  const config = statusConfig[building.status];

  return (
    <div className={cn('rounded-xl border bg-card', config.border)}>
      {/* Header */}
      <div className={cn('flex items-center justify-between border-b p-4', config.border, config.bg)}>
        <div className="flex items-center gap-3">
          <div className={cn('rounded-lg p-2', config.bg)}>
            <Building2 className={cn('h-5 w-5', config.color)} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{building.name}</h3>
            <p className="text-sm text-muted-foreground">건물 ID: {building.id.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {building.status === 'ok' ? (
            <CheckCircle2 className={cn('h-5 w-5', config.color)} />
          ) : (
            <AlertCircle className={cn('h-5 w-5', config.color)} />
          )}
          <span className={cn('text-sm font-medium', config.color)}>
            {building.status === 'ok' ? '정상' : building.status === 'warn' ? '주의' : '이상'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-px bg-border">
        <div className="bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Thermometer className="h-4 w-4" />
            <span className="text-sm">냉동기</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {building.chillerRunning}
            <span className="text-lg text-muted-foreground">/{building.chillerCount}</span>
          </p>
          <p className="text-xs text-muted-foreground">가동 중</p>
        </div>
        <div className="bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Camera className="h-4 w-4" />
            <span className="text-sm">CCTV</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {building.cctvOnline}
            <span className="text-lg text-muted-foreground">/{building.cctvCount}</span>
          </p>
          <p className="text-xs text-muted-foreground">온라인</p>
        </div>
        <div className="bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span className="text-sm">센서</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {building.sensorOk}
            <span className="text-lg text-muted-foreground">/{building.sensorCount}</span>
          </p>
          <p className="text-xs text-muted-foreground">정상</p>
        </div>
      </div>

      {/* Equipment List */}
      <div className="p-4">
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">설비 목록</h4>
        <div className="space-y-2">
          {DEFAULT_CHILLERS.filter((c) => c.zone === building.name).map((chiller) => (
            <div key={chiller.id} className="flex items-center justify-between rounded-lg bg-secondary p-2">
              <span className="text-sm text-foreground">{chiller.name}</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  chiller.status === 'running'
                    ? 'bg-accent-green/20 text-accent-green'
                    : chiller.status === 'standby'
                    ? 'bg-accent-yellow/20 text-accent-yellow'
                    : 'bg-accent-red/20 text-accent-red'
                )}
              >
                {chiller.status === 'running' ? '가동' : chiller.status === 'standby' ? '대기' : '오류'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EquipmentStatusPage() {
  const totalChillers = DEFAULT_CHILLERS.length;
  const runningChillers = DEFAULT_CHILLERS.filter((c) => c.status === 'running').length;
  const totalCameras = DEFAULT_CAMERAS.length;
  const onlineCameras = DEFAULT_CAMERAS.filter((c) => c.status !== 'offline').length;
  const totalSensors = DEFAULT_SENSORS.length;
  const okSensors = DEFAULT_SENSORS.filter((s) => s.status === 'ok').length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/20 p-2">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">관리 건물</p>
              <p className="text-2xl font-bold text-foreground">{buildings.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent-cyan/20 p-2">
              <Thermometer className="h-5 w-5 text-accent-cyan" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">냉동기</p>
              <p className="text-2xl font-bold text-foreground">
                {runningChillers}
                <span className="text-lg text-muted-foreground">/{totalChillers}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent-blue/20 p-2">
              <Camera className="h-5 w-5 text-accent-blue" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CCTV</p>
              <p className="text-2xl font-bold text-foreground">
                {onlineCameras}
                <span className="text-lg text-muted-foreground">/{totalCameras}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent-green/20 p-2">
              <Activity className="h-5 w-5 text-accent-green" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">센서</p>
              <p className="text-2xl font-bold text-foreground">
                {okSensors}
                <span className="text-lg text-muted-foreground">/{totalSensors}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Building Cards */}
      <div className="grid grid-cols-3 gap-6">
        {buildings.map((building) => (
          <BuildingCard key={building.id} building={building} />
        ))}
      </div>
    </div>
  );
}
