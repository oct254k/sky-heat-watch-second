'use client';

import { cn } from '@/lib/utils';
import { DEFAULT_ALARMS } from '@/lib/data';
import type { AlarmData, AlarmLevel } from '@/lib/types';
import { AlertTriangle, AlertCircle, Info, Bell, Sparkles, Cpu } from 'lucide-react';

const levelConfig: Record<
  AlarmLevel,
  { bg: string; border: string; text: string; icon: React.ElementType }
> = {
  danger: {
    bg: 'bg-accent-red/10',
    border: 'border-accent-red/30',
    text: 'text-accent-red',
    icon: AlertTriangle,
  },
  warn: {
    bg: 'bg-accent-yellow/10',
    border: 'border-accent-yellow/30',
    text: 'text-accent-yellow',
    icon: AlertCircle,
  },
  caution: {
    bg: 'bg-accent-cyan/10',
    border: 'border-accent-cyan/30',
    text: 'text-accent-cyan',
    icon: Info,
  },
  ok: {
    bg: 'bg-accent-green/10',
    border: 'border-accent-green/30',
    text: 'text-accent-green',
    icon: Info,
  },
};

interface AlarmItemProps {
  alarm: AlarmData;
}

function AlarmItem({ alarm }: AlarmItemProps) {
  const config = levelConfig[alarm.level];
  const LevelIcon = config.icon;
  const SourceIcon = alarm.source === 'AI' ? Sparkles : Cpu;

  return (
    <div
      className={cn(
        'relative rounded-lg border p-3 transition-all hover:scale-[1.01]',
        config.bg,
        config.border,
        alarm.isNew && 'ring-2 ring-accent-red/50'
      )}
    >
      {/* New badge */}
      {alarm.isNew && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-red text-[10px] font-bold text-white">
          N
        </span>
      )}

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={cn('rounded-lg p-1.5', config.bg)}>
          <LevelIcon className={cn('h-4 w-4', config.text)} />
        </div>
        <div className="flex-1 min-w-0">
          {/* Tags */}
          <div className="mb-1 flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium',
                alarm.source === 'AI' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'
              )}
            >
              <SourceIcon className="h-3 w-3" />
              {alarm.source}
            </span>
            <span className={cn('rounded px-1.5 py-0.5 text-xs font-semibold', config.bg, config.text)}>
              {alarm.levelText}
            </span>
            <span className="text-xs text-muted-foreground">{alarm.time}</span>
          </div>

          {/* Title */}
          <p className="text-sm font-medium text-foreground">{alarm.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{alarm.desc}</p>

          {/* Values */}
          {alarm.current && alarm.threshold && (
            <div className="mt-2 flex items-center gap-3 text-xs">
              <span className="text-muted-foreground">
                현재: <span className={config.text}>{alarm.current}</span>
              </span>
              <span className="text-muted-foreground">
                임계: <span className="text-foreground">{alarm.threshold}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface AlarmPanelProps {
  compact?: boolean;
}

export function AlarmPanel({ compact = false }: AlarmPanelProps) {
  const displayAlarms = compact ? DEFAULT_ALARMS.slice(0, 3) : DEFAULT_ALARMS;

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-accent-yellow" />
          <h3 className="font-semibold text-foreground">실시간 알람</h3>
          <span className="rounded-full bg-accent-red px-2 py-0.5 text-xs font-semibold text-white">
            {DEFAULT_ALARMS.length}
          </span>
        </div>
        {!compact && (
          <button className="text-sm text-primary hover:underline">전체 보기</button>
        )}
      </div>

      {/* Alarm List */}
      <div className="space-y-3 p-4">
        {displayAlarms.map((alarm) => (
          <AlarmItem key={alarm.id} alarm={alarm} />
        ))}
      </div>
    </div>
  );
}
