'use client';

import { cn } from '@/lib/utils';
import { NAVIGATION_GROUPS } from '@/lib/data';
import type { PageId } from '@/lib/types';
import {
  LayoutDashboard,
  Video,
  Gauge,
  Bell,
  Building2,
  Settings,
  FileText,
  MessageSquare,
  Link2,
  ChevronLeft,
  ChevronRight,
  Plane,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  video: Video,
  gauge: Gauge,
  alarm: Bell,
  building: Building2,
  settings: Settings,
  document: FileText,
  chat: MessageSquare,
  link: Link2,
};

interface SidebarProps {
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ currentPage, onPageChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Plane className="h-5 w-5 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">인천공항</span>
            <span className="text-xs text-muted-foreground">열원사업소</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {NAVIGATION_GROUPS.map((group) => (
          <div key={group.label} className="mb-4">
            {!isCollapsed && (
              <span className="mb-2 block px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {group.label}
              </span>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = iconMap[item.icon] || LayoutDashboard;
                const isActive = currentPage === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onPageChange(item.id)}
                      className={cn(
                        'relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-primary'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                      )}
                    >
                      <Icon className={cn('h-5 w-5 shrink-0', isActive && 'text-sidebar-primary')} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                      {item.badge && (
                        <span
                          className={cn(
                            'flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-semibold text-destructive-foreground',
                            isCollapsed ? 'absolute -right-1 -top-1' : 'ml-auto'
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* System Status */}
      {!isCollapsed && (
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-accent-green/10 p-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-green" />
              </span>
              <span className="text-xs font-medium text-accent-green">시스템 정상</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">가동률 99.8%</p>
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={onToggleCollapse}
        className="flex h-12 items-center justify-center border-t border-sidebar-border text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      >
        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
      </button>
    </aside>
  );
}
