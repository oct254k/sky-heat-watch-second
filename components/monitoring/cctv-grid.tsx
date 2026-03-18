'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DEFAULT_CAMERAS, CCTV_TABS } from '@/lib/data';
import type { CameraCategory, CctvCamera } from '@/lib/types';
import { Camera, Maximize2, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CctvCardProps {
  camera: CctvCamera;
  onClick?: () => void;
}

function CctvCard({ camera, onClick }: CctvCardProps) {
  const statusStyles = {
    normal: 'border-accent-green/30',
    warning: 'border-accent-yellow/50',
    danger: 'border-accent-red/50',
    offline: 'border-muted',
  };

  const aiStatusStyles = {
    n: { bg: 'bg-accent-green', text: 'text-accent-green', icon: CheckCircle2, label: '정상' },
    w: { bg: 'bg-accent-yellow', text: 'text-accent-yellow', icon: AlertTriangle, label: camera.value || '경고' },
    d: { bg: 'bg-accent-red', text: 'text-accent-red', icon: AlertTriangle, label: '위험' },
  };

  const aiConfig = aiStatusStyles[camera.aiStatus];
  const AiIcon = aiConfig.icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-lg border-2 bg-card transition-all hover:scale-[1.02]',
        statusStyles[camera.status]
      )}
    >
      {/* Video Feed */}
      <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        {/* Real Image or Fallback */}
        {camera.imageUrl ? (
          <img
            src={camera.imageUrl}
            alt={`${camera.id} ${camera.name}`}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="h-8 w-8 text-muted-foreground/30" />
          </div>
        )}

        {/* Scanline effect */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />

        {/* Top overlay */}
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-2">
          <span className="rounded bg-black/40 px-1.5 py-0.5 text-xs font-medium text-white">
            {camera.id}
          </span>
          <div className={cn('flex items-center gap-1 rounded-full px-2 py-0.5', aiConfig.bg + '/20')}>
            <AiIcon className={cn('h-3 w-3', aiConfig.text)} />
            <span className={cn('text-xs font-medium', aiConfig.text)}>{aiConfig.label}</span>
          </div>
        </div>

        {/* Expand button */}
        <button className="absolute right-2 top-2 rounded bg-black/40 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Maximize2 className="h-4 w-4 text-white" />
        </button>

        {/* Recording indicator */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-[10px] font-medium text-white/80">REC</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-2">
        <p className="text-sm font-medium text-foreground">{camera.name}</p>
        <p className="text-xs text-muted-foreground">{camera.location}</p>
      </div>
    </div>
  );
}

interface CctvGridProps {
  compact?: boolean;
}

export function CctvGrid({ compact = false }: CctvGridProps) {
  const [activeTab, setActiveTab] = useState<CameraCategory>('all');

  const filteredCameras =
    activeTab === 'all' ? DEFAULT_CAMERAS : DEFAULT_CAMERAS.filter((c) => c.category === activeTab);

  const displayCameras = compact ? filteredCameras.slice(0, 4) : filteredCameras;

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h3 className="font-semibold text-foreground">CCTV 실시간 모니터링</h3>
          <p className="text-sm text-muted-foreground">냉각탑 4ch · 팬류 4ch</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-secondary p-1">
          {CCTV_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className={cn('grid gap-3 p-4', compact ? 'grid-cols-2' : 'grid-cols-4')}>
        {displayCameras.map((camera) => (
          <CctvCard key={camera.id} camera={camera} />
        ))}
      </div>
    </div>
  );
}
