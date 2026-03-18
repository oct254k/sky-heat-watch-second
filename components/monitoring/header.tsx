'use client';

import { PAGE_TITLES } from '@/lib/data';
import type { PageId } from '@/lib/types';
import { Bell, User, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HeaderProps {
  currentPage: PageId;
}

export function Header({ currentPage }: HeaderProps) {
  const pageInfo = PAGE_TITLES[currentPage];
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Page Title */}
      <div>
        <h1 className="text-lg font-semibold text-foreground">{pageInfo.title}</h1>
        <p className="text-sm text-muted-foreground">{pageInfo.subtitle}</p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Real-time Indicator */}
        <div className="flex items-center gap-2 rounded-full bg-accent-green/10 px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-green" />
          </span>
          <span className="text-xs font-medium text-accent-green">실시간</span>
        </div>

        {/* Current Time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="font-mono">{currentTime}</span>
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 hover:bg-secondary">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
            3
          </span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-3 border-l border-border pl-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">김관리</p>
            <p className="text-xs text-muted-foreground">열원사업소 · 관리자</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}
