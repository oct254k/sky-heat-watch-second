'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DEFAULT_CAMERAS, CCTV_TABS } from '@/lib/data';
import type { CameraCategory, CctvCamera } from '@/lib/types';
import { Camera, Maximize2, AlertTriangle, CheckCircle2 } from 'lucide-react';

// SVG 도면 컴포넌트 import
import {
  CAM01Diagram,
  CAM02Diagram,
  CoolingTowerDiagram,
  CAM05Diagram,
  FanAHUDiagram,
} from './diagrams';

// 카메라별 도면 매핑
const getDiagramForCamera = (cameraId: string, category: CameraCategory): React.ReactNode => {
  // 카테고리별 기본 도면 매핑
  const categoryDiagrams: Record<string, React.ReactNode> = {
    chiller: <CAM01Diagram />,
    coolingTower: <CoolingTowerDiagram />,
    fan: <FanAHUDiagram />,
  };

  // 특정 카메라 ID별 도면 (경고/위험 상태 등)
  const specificDiagrams: Record<string, React.ReactNode> = {
    'CAM-01': <CAM01Diagram />,
    'CAM-02': <CAM02Diagram />,
    'CAM-03': <CoolingTowerDiagram />,
    'CAM-04': <CAM01Diagram />,
    'CAM-05': <CAM05Diagram />,  // 경고 상태
    'CAM-06': <FanAHUDiagram />,
    'CAM-07': <CAM05Diagram />,  // 위험 상태
    'CAM-08': <CAM02Diagram />,
    'CAM-09': <CoolingTowerDiagram />,
    'CAM-10': <FanAHUDiagram />,
    'CAM-11': <FanAHUDiagram />,
    'CAM-12': <FanAHUDiagram />,
  };

  return specificDiagrams[cameraId] || categoryDiagrams[category] || <CAM01Diagram />;
};

interface CctvCardProps {
  camera: CctvCamera;
  showDiagram: boolean;
  diagram: React.ReactNode;
  onClick?: () => void;
}

function CctvCard({ camera, showDiagram, diagram, onClick }: CctvCardProps) {
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

  // 상태별 배경 그라데이션
  const bgGradient = {
    normal: 'from-[#1c2635] via-[#243040] to-[#1a2530]',
    warning: 'from-[#2a2520] via-[#352a20] to-[#252015]',
    danger: 'from-[#2a1a1a] via-[#301f1f] to-[#251515]',
    offline: 'from-muted via-muted to-muted',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-md border bg-card transition-all hover:scale-[1.01] hover:shadow-md',
        statusStyles[camera.status]
      )}
    >
      {/* Video Feed / Diagram */}
      <div className={cn(
        'relative aspect-[16/10] overflow-hidden',
        showDiagram ? `bg-gradient-to-br ${bgGradient[camera.status]}` : 'bg-gradient-to-br from-muted to-muted/50'
      )}>
        {showDiagram ? (
          /* SVG 도면 모드 */
          <div className="absolute inset-0 flex items-center justify-center p-1">
            {diagram}
          </div>
        ) : (
          /* 실사 이미지 모드 */
          camera.imageUrl ? (
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
              <Camera className="h-6 w-6 text-muted-foreground/30" />
            </div>
          )
        )}

        {/* Scanline effect */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_3px]" />

        {/* Top overlay */}
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-1.5">
          <span className="rounded bg-black/40 px-1 py-0.5 text-[10px] font-medium text-white">
            {camera.id}
          </span>
          <div className={cn('flex items-center gap-0.5 rounded-full px-1.5 py-0.5', aiConfig.bg + '/20')}>
            <AiIcon className={cn('h-2.5 w-2.5', aiConfig.text)} />
            <span className={cn('text-[10px] font-medium', aiConfig.text)}>{aiConfig.label}</span>
          </div>
        </div>

        {/* Expand button */}
        <button className="absolute right-1.5 top-1.5 rounded bg-black/40 p-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Maximize2 className="h-3 w-3 text-white" />
        </button>

        {/* Recording indicator */}
        <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
          </span>
          <span className="text-[8px] font-medium text-white/80">REC</span>
        </div>

        {/* Zone badge */}
        <div className="absolute bottom-1.5 right-1.5">
          <span className="rounded bg-black/50 px-1 py-0.5 text-[8px] font-medium text-white/70">
            {camera.zone}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-1.5">
        <p className="text-xs font-medium text-foreground truncate">{camera.name}</p>
        <p className="text-[10px] text-muted-foreground truncate">{camera.location}</p>
      </div>
    </div>
  );
}

interface CctvGridProps {
  compact?: boolean;
}

export function CctvGrid({ compact = false }: CctvGridProps) {
  const [activeTab, setActiveTab] = useState<CameraCategory>('all');
  const [showDiagram, setShowDiagram] = useState(true); // 기본값: 도면 모드

  const filteredCameras =
    activeTab === 'all' ? DEFAULT_CAMERAS : DEFAULT_CAMERAS.filter((c) => c.category === activeTab);

  const displayCameras = compact ? filteredCameras.slice(0, 8) : filteredCameras;

  // 카테고리별 카운트 계산
  const categoryCounts = {
    all: DEFAULT_CAMERAS.length,
    chiller: DEFAULT_CAMERAS.filter((c) => c.category === 'chiller').length,
    coolingTower: DEFAULT_CAMERAS.filter((c) => c.category === 'coolingTower').length,
    fan: DEFAULT_CAMERAS.filter((c) => c.category === 'fan').length,
  };

  // 카메라 타입 카운트
  const fixedCount = DEFAULT_CAMERAS.filter((c) => c.type === 'fixed').length;
  const ptzCount = DEFAULT_CAMERAS.filter((c) => c.type === 'ptz').length;

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-green/10">
            <Camera className="h-4 w-4 text-accent-green" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">CCTV 실시간 모니터링</h3>
            <p className="text-xs text-muted-foreground">고정형 {fixedCount}ch · PTZ {ptzCount}ch</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 도면/실사 토글 */}
          <div className="flex items-center gap-2">
            <span className={cn(
              'text-[10px] font-medium transition-colors',
              showDiagram ? 'text-accent-green' : 'text-muted-foreground'
            )}>
              도면
            </span>
            <button
              onClick={() => setShowDiagram(!showDiagram)}
              className={cn(
                'relative h-5 w-9 rounded-full transition-colors',
                showDiagram ? 'bg-muted' : 'bg-accent-green'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
                  showDiagram ? 'left-0.5' : 'left-[18px]'
                )}
              />
            </button>
            <span className={cn(
              'text-[10px] font-medium transition-colors',
              !showDiagram ? 'text-accent-green' : 'text-muted-foreground'
            )}>
              실사
            </span>
          </div>

          {/* 연결 상태 */}
          <span className="rounded-md bg-accent-green/10 px-2 py-1 text-[10px] font-semibold text-accent-green">
            {DEFAULT_CAMERAS.length}/{DEFAULT_CAMERAS.length} 연결
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border bg-muted/30 px-3">
        {CCTV_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'border-b-2 px-3 py-2 text-xs font-medium transition-colors',
              activeTab === tab.key
                ? 'border-accent-green text-accent-green'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label} ({categoryCounts[tab.key]})
          </button>
        ))}
      </div>

      {/* Grid - 항상 4열 고정 */}
      <div className="grid grid-cols-4 gap-2 p-3">
        {displayCameras.map((camera) => (
          <CctvCard
            key={camera.id}
            camera={camera}
            showDiagram={showDiagram}
            diagram={getDiagramForCamera(camera.id, camera.category)}
          />
        ))}
      </div>
    </div>
  );
}
