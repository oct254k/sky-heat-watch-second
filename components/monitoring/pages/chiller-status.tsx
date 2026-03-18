'use client';

import { cn } from '@/lib/utils';
import { DEFAULT_CHILLERS } from '@/lib/data';
import { ChillerCameraPreview } from '../chiller-camera-preview';
import type { ChillerData } from '@/lib/types';
import {
  Thermometer,
  Gauge,
  Droplets,
  ArrowRight,
  TrendingUp,
  Activity,
  Clock,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Mock trend data
const trendData = [
  { time: '00:00', highPressure: 13.2, lowPressure: 4.0, temp: 70 },
  { time: '04:00', highPressure: 13.5, lowPressure: 4.2, temp: 72 },
  { time: '08:00', highPressure: 14.0, lowPressure: 4.5, temp: 75 },
  { time: '12:00', highPressure: 14.2, lowPressure: 4.6, temp: 76 },
  { time: '16:00', highPressure: 13.8, lowPressure: 4.3, temp: 73 },
  { time: '20:00', highPressure: 13.5, lowPressure: 4.1, temp: 71 },
  { time: '24:00', highPressure: 13.3, lowPressure: 4.0, temp: 70 },
];

interface DetailedChillerCardProps {
  chiller: ChillerData;
  isSelected: boolean;
  onClick: () => void;
}

function DetailedChillerCard({ chiller, isSelected, onClick }: DetailedChillerCardProps) {
  const isRunning = chiller.status === 'running';
  const statusConfig = {
    running: { label: '가동', color: 'bg-accent-green', textColor: 'text-accent-green' },
    standby: { label: '대기', color: 'bg-accent-yellow', textColor: 'text-accent-yellow' },
    error: { label: '오류', color: 'bg-accent-red', textColor: 'text-accent-red' },
  };
  const config = statusConfig[chiller.status];

  return (
    <div
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-xl border bg-card p-4 transition-all hover:scale-[1.02]',
        isSelected ? 'border-primary ring-2 ring-primary/30' : 'border-border'
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-foreground">{chiller.name}</p>
          <p className="text-sm text-muted-foreground">{chiller.zone}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('relative flex h-3 w-3')}>
            {isRunning && (
              <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', config.color)} />
            )}
            <span className={cn('relative inline-flex h-3 w-3 rounded-full', config.color)} />
          </span>
          <span className={cn('text-sm font-medium', config.textColor)}>{config.label}</span>
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-foreground">{chiller.usrt}</span>
        <span className="text-lg text-muted-foreground">USRT</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-secondary p-2">
          <p className="text-xs text-muted-foreground">고압</p>
          <p className="text-sm font-semibold text-foreground">
            {chiller.highPressure > 0 ? `${chiller.highPressure} kg/cm²` : '-'}
          </p>
        </div>
        <div className="rounded-lg bg-secondary p-2">
          <p className="text-xs text-muted-foreground">저압</p>
          <p className="text-sm font-semibold text-foreground">
            {chiller.lowPressure > 0 ? `${chiller.lowPressure} kg/cm²` : '-'}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ChillerStatusPage() {
  const selectedChiller = DEFAULT_CHILLERS[0];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent-green/20 p-2">
              <Activity className="h-5 w-5 text-accent-green" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">가동 중</p>
              <p className="text-2xl font-bold text-foreground">
                {DEFAULT_CHILLERS.filter((c) => c.status === 'running').length}
                <span className="text-lg text-muted-foreground">/{DEFAULT_CHILLERS.length}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent-cyan/20 p-2">
              <TrendingUp className="h-5 w-5 text-accent-cyan" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">총 용량</p>
              <p className="text-2xl font-bold text-foreground">
                {DEFAULT_CHILLERS.filter((c) => c.status === 'running').reduce((sum, c) => sum + c.usrt, 0).toFixed(1)}
                <span className="text-lg text-muted-foreground"> USRT</span>
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-accent-yellow/20 p-2">
              <Clock className="h-5 w-5 text-accent-yellow" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">대기 중</p>
              <p className="text-2xl font-bold text-foreground">
                {DEFAULT_CHILLERS.filter((c) => c.status === 'standby').length}
                <span className="text-lg text-muted-foreground">대</span>
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/20 p-2">
              <Thermometer className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">평균 토출온도</p>
              <p className="text-2xl font-bold text-foreground">
                {(DEFAULT_CHILLERS.filter((c) => c.status === 'running').reduce((sum, c) => sum + c.dischargeTemp, 0) / DEFAULT_CHILLERS.filter((c) => c.status === 'running').length).toFixed(1)}
                <span className="text-lg text-muted-foreground">°C</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: CCTV + Detail Panel */}
      <div className="grid grid-cols-3 gap-6">
        {/* 좌측: CCTV 세로 배열 */}
        <div className="col-span-1">
          <ChillerCameraPreview maxCameras={2} layout="vertical" />
        </div>

        {/* 우측: Detail Panel */}
        <div className="col-span-2 space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{selectedChiller.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedChiller.zone} · {selectedChiller.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-accent-green" />
                </span>
                <span className="text-sm font-medium text-accent-green">가동 중</span>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-secondary p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Gauge className="h-4 w-4" />
                  <span className="text-sm">고압</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">{selectedChiller.highPressure}</p>
                <p className="text-sm text-muted-foreground">kg/cm² (정상: 12-15)</p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Gauge className="h-4 w-4" />
                  <span className="text-sm">저압</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">{selectedChiller.lowPressure}</p>
                <p className="text-sm text-muted-foreground">kg/cm² (정상: 3-5)</p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Droplets className="h-4 w-4" />
                  <span className="text-sm">유면</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">{selectedChiller.oilLevel}</p>
                <p className="text-sm text-muted-foreground">% (정상: 50-80)</p>
              </div>
              <div className="rounded-lg bg-secondary p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Thermometer className="h-4 w-4" />
                  <span className="text-sm">토출온도</span>
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">{selectedChiller.dischargeTemp}</p>
                <p className="text-sm text-muted-foreground">°C (정상: 60-80)</p>
              </div>
              <div className="col-span-2 rounded-lg bg-secondary p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Thermometer className="h-4 w-4" />
                  <span className="text-sm">냉수 온도</span>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <div>
                    <p className="text-2xl font-bold text-accent-cyan">{selectedChiller.chilledWaterIn}°C</p>
                    <p className="text-sm text-muted-foreground">입구</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold text-accent-blue">{selectedChiller.chilledWaterOut}°C</p>
                    <p className="text-sm text-muted-foreground">출구</p>
                  </div>
                  <div className="ml-4 rounded bg-accent-green/20 px-3 py-1">
                    <p className="text-sm font-medium text-accent-green">
                      ΔT: {selectedChiller.chilledWaterIn - selectedChiller.chilledWaterOut}°C
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h4 className="mb-4 font-semibold text-foreground">24시간 트렌드</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="time" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderColor: 'var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                  <Line type="monotone" dataKey="highPressure" stroke="var(--accent-cyan)" strokeWidth={2} name="고압" />
                  <Line type="monotone" dataKey="lowPressure" stroke="var(--accent-blue)" strokeWidth={2} name="저압" />
                  <Line type="monotone" dataKey="temp" stroke="var(--accent-yellow)" strokeWidth={2} name="토출온도" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Chiller List - 가로 배열 */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">냉동기 목록</h3>
        <div className="grid grid-cols-4 gap-4">
          {DEFAULT_CHILLERS.map((chiller) => (
            <DetailedChillerCard
              key={chiller.id}
              chiller={chiller}
              isSelected={chiller.id === selectedChiller.id}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
