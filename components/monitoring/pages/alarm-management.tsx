'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DEFAULT_ALARMS } from '@/lib/data';
import type { AlarmLevel, AlarmSource } from '@/lib/types';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Sparkles,
  Cpu,
  Calendar,
} from 'lucide-react';

const levelConfig: Record<AlarmLevel, { bg: string; border: string; text: string; icon: React.ElementType }> = {
  danger: { bg: 'bg-accent-red/10', border: 'border-accent-red/30', text: 'text-accent-red', icon: AlertTriangle },
  warn: { bg: 'bg-accent-yellow/10', border: 'border-accent-yellow/30', text: 'text-accent-yellow', icon: AlertCircle },
  caution: { bg: 'bg-accent-cyan/10', border: 'border-accent-cyan/30', text: 'text-accent-cyan', icon: Info },
  ok: { bg: 'bg-accent-green/10', border: 'border-accent-green/30', text: 'text-accent-green', icon: CheckCircle2 },
};

// Extended alarm data for the management page
const extendedAlarms = [
  ...DEFAULT_ALARMS,
  {
    id: 'alarm-4',
    level: 'warn' as AlarmLevel,
    levelText: '경고',
    source: 'DX' as AlarmSource,
    time: '25분 전',
    title: '공항청사 냉동기 #2 대기 모드 전환',
    desc: 'CHILLER-06 상태 변경',
  },
  {
    id: 'alarm-5',
    level: 'caution' as AlarmLevel,
    levelText: '주의',
    source: 'AI' as AlarmSource,
    time: '1시간 전',
    title: 'AICC 냉각탑 #2 효율 저하 징후',
    desc: 'CAM-02 열화상 분석',
    current: '효율 92%',
    threshold: '정상: 95% 이상',
  },
  {
    id: 'alarm-6',
    level: 'ok' as AlarmLevel,
    levelText: '복구',
    source: 'DX' as AlarmSource,
    time: '2시간 전',
    title: '관제탑 진동센서 VIB-08 정상 복구',
    desc: '자동 복구 완료',
  },
];

type FilterLevel = 'all' | AlarmLevel;
type FilterSource = 'all' | AlarmSource;

export function AlarmManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<FilterLevel>('all');
  const [filterSource, setFilterSource] = useState<FilterSource>('all');

  const filteredAlarms = extendedAlarms.filter((alarm) => {
    const matchesSearch = alarm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alarm.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = filterLevel === 'all' || alarm.level === filterLevel;
    const matchesSource = filterSource === 'all' || alarm.source === filterSource;
    return matchesSearch && matchesLevel && matchesSource;
  });

  const stats = {
    total: extendedAlarms.length,
    danger: extendedAlarms.filter((a) => a.level === 'danger').length,
    warn: extendedAlarms.filter((a) => a.level === 'warn').length,
    caution: extendedAlarms.filter((a) => a.level === 'caution').length,
    ok: extendedAlarms.filter((a) => a.level === 'ok').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">전체 알람</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className={cn('rounded-xl border p-4', levelConfig.danger.border, levelConfig.danger.bg)}>
          <p className="text-sm text-muted-foreground">긴급</p>
          <p className={cn('mt-1 text-2xl font-bold', levelConfig.danger.text)}>{stats.danger}</p>
        </div>
        <div className={cn('rounded-xl border p-4', levelConfig.warn.border, levelConfig.warn.bg)}>
          <p className="text-sm text-muted-foreground">경고</p>
          <p className={cn('mt-1 text-2xl font-bold', levelConfig.warn.text)}>{stats.warn}</p>
        </div>
        <div className={cn('rounded-xl border p-4', levelConfig.caution.border, levelConfig.caution.bg)}>
          <p className="text-sm text-muted-foreground">주의</p>
          <p className={cn('mt-1 text-2xl font-bold', levelConfig.caution.text)}>{stats.caution}</p>
        </div>
        <div className={cn('rounded-xl border p-4', levelConfig.ok.border, levelConfig.ok.bg)}>
          <p className="text-sm text-muted-foreground">복구</p>
          <p className={cn('mt-1 text-2xl font-bold', levelConfig.ok.text)}>{stats.ok}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-1 items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="알람 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as FilterLevel)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="all">전체 등급</option>
              <option value="danger">긴급</option>
              <option value="warn">경고</option>
              <option value="caution">주의</option>
              <option value="ok">복구</option>
            </select>
          </div>

          {/* Source Filter */}
          <select
            value={filterSource}
            onChange={(e) => setFilterSource(e.target.value as FilterSource)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">전체 출처</option>
            <option value="DX">규칙 기반 (DX)</option>
            <option value="AI">AI 분석 (AI)</option>
          </select>

          {/* Date Range */}
          <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-secondary">
            <Calendar className="h-4 w-4" />
            <span>오늘</span>
          </button>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Download className="h-4 w-4" />
          내보내기
        </button>
      </div>

      {/* Alarm Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">등급</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">출처</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">시간</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">제목</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">상세</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">현재값</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">임계값</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">조치</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlarms.map((alarm) => {
                const config = levelConfig[alarm.level];
                const LevelIcon = config.icon;
                const SourceIcon = alarm.source === 'AI' ? Sparkles : Cpu;

                return (
                  <tr key={alarm.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                    <td className="px-4 py-3">
                      <div className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-1', config.bg)}>
                        <LevelIcon className={cn('h-3.5 w-3.5', config.text)} />
                        <span className={cn('text-xs font-medium', config.text)}>{alarm.levelText}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium',
                          alarm.source === 'AI' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'
                        )}
                      >
                        <SourceIcon className="h-3 w-3" />
                        {alarm.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{alarm.time}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-foreground">{alarm.title}</span>
                      {alarm.isNew && (
                        <span className="ml-2 rounded bg-accent-red px-1 py-0.5 text-[10px] font-bold text-white">
                          NEW
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{alarm.desc}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{alarm.current || '-'}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{alarm.threshold || '-'}</td>
                    <td className="px-4 py-3">
                      <button className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80">
                        상세
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
