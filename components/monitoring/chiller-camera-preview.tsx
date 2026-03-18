'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CHILLER_CAMERA_IDS, type CameraConfig, type CameraConfigItem } from '@/lib/data';
import { Camera, Maximize2, Video, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ChillerCameraPreviewProps {
  className?: string;
  maxCameras?: number;
  layout?: 'horizontal' | 'vertical';
}

export function ChillerCameraPreview({ className, maxCameras = 2, layout = 'horizontal' }: ChillerCameraPreviewProps) {
  const [cameras, setCameras] = useState<CameraConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCameraConfig() {
      try {
        const response = await fetch('/camera_config.json');
        if (!response.ok) {
          throw new Error('Failed to load camera config');
        }
        const config: CameraConfig = await response.json();

        // Filter cameras by chiller camera IDs
        const chillerCameras = config.cameras
          .filter(cam => CHILLER_CAMERA_IDS.includes(cam.id))
          .slice(0, maxCameras);

        setCameras(chillerCameras);
        setLoading(false);
      } catch (err) {
        console.error('Error loading camera config:', err);
        setError('카메라 설정을 불러올 수 없습니다');
        setLoading(false);
      }
    }

    loadCameraConfig();
  }, [maxCameras]);

  if (loading) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
        <div className="flex items-center gap-2 mb-4">
          <Video className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">냉동기 실시간 모니터링</h3>
        </div>
        <div className={cn('grid gap-3', layout === 'vertical' ? 'grid-cols-1' : 'grid-cols-2')}>
          {[1, 2].map((i) => (
            <div key={i} className="aspect-video bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error || cameras.length === 0) {
    return (
      <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
        <div className="flex items-center gap-2 mb-4">
          <Video className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">냉동기 실시간 모니터링</h3>
        </div>
        <div className="flex items-center justify-center aspect-video bg-muted rounded-lg">
          <div className="text-center text-muted-foreground">
            <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">{error || '카메라를 찾을 수 없습니다'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl border border-border bg-card p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">냉동기 실시간 모니터링</h3>
        </div>
        <span className="text-xs text-muted-foreground">{cameras.length}ch</span>
      </div>

      <div className={cn(
        'grid gap-3',
        layout === 'vertical' ? 'grid-cols-1' : (cameras.length === 1 ? 'grid-cols-1' : 'grid-cols-2')
      )}>
        {cameras.map((camera) => (
          <ChillerCameraCard key={camera.id} camera={camera} />
        ))}
      </div>
    </div>
  );
}

interface ChillerCameraCardProps {
  camera: CameraConfigItem;
}

function ChillerCameraCard({ camera }: ChillerCameraCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative cursor-pointer overflow-hidden rounded-lg border border-border/50 bg-card transition-all hover:scale-[1.02] hover:border-primary/30">
      {/* Video Feed */}
      <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
        {/* Camera Image */}
        {camera.customImage && !imageError ? (
          <img
            src={camera.customImage}
            alt={`${camera.id} ${camera.name}`}
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setImageError(true)}
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
          <div className="flex items-center gap-1 rounded-full bg-accent-green/20 px-2 py-0.5">
            <CheckCircle2 className="h-3 w-3 text-accent-green" />
            <span className="text-xs font-medium text-accent-green">정상</span>
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
        <p className="text-xs text-muted-foreground">{camera.building} - {camera.equipment}</p>
      </div>
    </div>
  );
}
