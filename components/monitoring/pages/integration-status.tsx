'use client';

import { cn } from '@/lib/utils';
import {
  Server,
  Database,
  Wifi,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Activity,
} from 'lucide-react';

interface IntegrationData {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'warning' | 'disconnected';
  lastSync: string;
  dataCount: number;
  latency: number;
  icon: React.ElementType;
}

const integrations: IntegrationData[] = [
  {
    id: 'century',
    name: 'Century',
    description: '스크류냉동기 제어 시스템',
    status: 'connected',
    lastSync: '방금 전',
    dataCount: 156,
    latency: 45,
    icon: Server,
  },
  {
    id: 'honeywell-ddc',
    name: 'Honeywell DDC',
    description: '빌딩 자동화 컨트롤러',
    status: 'connected',
    lastSync: '1분 전',
    dataCount: 284,
    latency: 62,
    icon: Database,
  },
  {
    id: 'bems',
    name: 'BEMS',
    description: '건물 에너지 관리 시스템',
    status: 'connected',
    lastSync: '2분 전',
    dataCount: 512,
    latency: 128,
    icon: Activity,
  },
  {
    id: 'edge-sensor',
    name: '엣지 센서 노드',
    description: '무선 진동/온도 센서 네트워크',
    status: 'warning',
    lastSync: '5분 전',
    dataCount: 12,
    latency: 230,
    icon: Wifi,
  },
];

const statusConfig = {
  connected: { label: '연결됨', color: 'text-accent-green', bg: 'bg-accent-green/10', border: 'border-accent-green/30' },
  warning: { label: '지연', color: 'text-accent-yellow', bg: 'bg-accent-yellow/10', border: 'border-accent-yellow/30' },
  disconnected: { label: '연결 끊김', color: 'text-accent-red', bg: 'bg-accent-red/10', border: 'border-accent-red/30' },
};

interface IntegrationCardProps {
  integration: IntegrationData;
}

function IntegrationCard({ integration }: IntegrationCardProps) {
  const config = statusConfig[integration.status];
  const Icon = integration.icon;

  return (
    <div className={cn('rounded-xl border bg-card', config.border)}>
      <div className="flex items-start justify-between p-4">
        <div className="flex items-center gap-3">
          <div className={cn('rounded-lg p-2', config.bg)}>
            <Icon className={cn('h-5 w-5', config.color)} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{integration.name}</h3>
            <p className="text-sm text-muted-foreground">{integration.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {integration.status === 'connected' ? (
            <CheckCircle2 className={cn('h-5 w-5', config.color)} />
          ) : (
            <AlertCircle className={cn('h-5 w-5', config.color)} />
          )}
          <span className={cn('text-sm font-medium', config.color)}>{config.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px border-t border-border bg-border">
        <div className="bg-card p-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">마지막 동기화</span>
          </div>
          <p className="mt-1 text-sm font-medium text-foreground">{integration.lastSync}</p>
        </div>
        <div className="bg-card p-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Database className="h-3.5 w-3.5" />
            <span className="text-xs">데이터 포인트</span>
          </div>
          <p className="mt-1 text-sm font-medium text-foreground">{integration.dataCount}</p>
        </div>
        <div className="bg-card p-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Activity className="h-3.5 w-3.5" />
            <span className="text-xs">응답시간</span>
          </div>
          <p className={cn('mt-1 text-sm font-medium', integration.latency > 200 ? 'text-accent-yellow' : 'text-foreground')}>
            {integration.latency}ms
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border p-4">
        <span className="text-xs text-muted-foreground">ID: {integration.id.toUpperCase()}</span>
        <button className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80">
          <RefreshCw className="h-3.5 w-3.5" />
          동기화
        </button>
      </div>
    </div>
  );
}

export function IntegrationStatusPage() {
  const connectedCount = integrations.filter((i) => i.status === 'connected').length;
  const totalDataPoints = integrations.reduce((sum, i) => sum + i.dataCount, 0);
  const avgLatency = Math.round(integrations.reduce((sum, i) => sum + i.latency, 0) / integrations.length);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">연동 시스템</p>
          <p className="mt-1 text-2xl font-bold text-foreground">
            {connectedCount}
            <span className="text-lg text-muted-foreground">/{integrations.length}</span>
          </p>
          <p className="text-xs text-accent-green">정상 연결</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">총 데이터 포인트</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{totalDataPoints}</p>
          <p className="text-xs text-muted-foreground">실시간 수집 중</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">평균 응답시간</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{avgLatency}ms</p>
          <p className="text-xs text-accent-green">정상 범위</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">데이터 무결성</p>
          <p className="mt-1 text-2xl font-bold text-foreground">99.8%</p>
          <p className="text-xs text-accent-green">양호</p>
        </div>
      </div>

      {/* Integration Cards */}
      <div className="grid grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>

      {/* Data Flow Diagram */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold text-foreground">데이터 흐름</h3>
        <div className="flex items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg bg-secondary p-4">
              <Server className="h-8 w-8 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Century/DDC</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-border" />
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg bg-secondary p-4">
              <Database className="h-8 w-8 text-accent-cyan" />
            </div>
            <span className="text-sm text-muted-foreground">BEMS</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-border" />
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg bg-primary p-4">
              <Activity className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground">AI 분석</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-border" />
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg bg-accent-green/20 p-4">
              <CheckCircle2 className="h-8 w-8 text-accent-green" />
            </div>
            <span className="text-sm text-muted-foreground">모니터링</span>
          </div>
        </div>
      </div>
    </div>
  );
}
