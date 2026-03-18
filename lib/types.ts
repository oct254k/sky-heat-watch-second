// 인천공항 열원사업소 AI 모니터링 시스템 타입 정의

// 페이지 ID
export type PageId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7' | 'p8' | 'p9' | 'p10';

// 알람 레벨
export type AlarmLevel = 'ok' | 'caution' | 'warn' | 'danger';
export type AlarmSource = 'DX' | 'AI';

export const ALARM_LEVEL_CONFIG = {
  ok: { label: '정상', color: 'var(--status-ok)', priority: 0 },
  caution: { label: '주의', color: 'var(--status-caution)', priority: 1 },
  warn: { label: '경고', color: 'var(--status-warn)', priority: 2 },
  danger: { label: '긴급', color: 'var(--status-danger)', priority: 3 },
} as const;

// 센서 상태
export type SensorStatus = 'ok' | 'warn' | 'danger' | 'offline';

// 카메라 카테고리
export type CameraCategory = 'all' | 'chiller' | 'coolingTower' | 'fan';

// CCTV 카메라 인터페이스
export interface CctvCamera {
  id: string;
  name: string;
  location: string;
  zone: string;
  type: 'fixed' | 'ptz';
  status: 'normal' | 'warning' | 'danger' | 'offline';
  aiStatus: 'n' | 'w' | 'd';
  aiDetail?: string;
  value?: string;
  category: CameraCategory;
  imageUrl?: string; // CCTV 실사 이미지 URL
}

// 센서 데이터 인터페이스
export interface SensorData {
  id: string;
  location: string;
  vibration: number;
  temperature: number;
  status: SensorStatus;
}

// 알람 데이터 인터페이스
export interface AlarmData {
  id: string;
  level: AlarmLevel;
  levelText: string;
  source: AlarmSource;
  time: string;
  title: string;
  desc: string;
  current?: string;
  threshold?: string;
  isNew?: boolean;
}

// 냉동기 데이터 인터페이스
export interface ChillerData {
  id: string;
  zone: string;
  name: string;
  status: 'running' | 'standby' | 'error';
  usrt: number;
  highPressure: number;
  lowPressure: number;
  oilLevel: number;
  dischargeTemp: number;
  chilledWaterIn: number;
  chilledWaterOut: number;
}

// KPI 카드 인터페이스
export interface KpiCardData {
  title: string;
  value: string;
  valueUnit: string;
  sub: string;
  status: SensorStatus;
  statusText: string;
  color: string;
  icon: React.ReactNode;
}

// 네비게이션 아이템
export interface NavItem {
  id: PageId;
  label: string;
  icon: string;
  badge?: number;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

// 페이지 타이틀
export interface PageTitle {
  title: string;
  subtitle: string;
}

// 점검일지 인터페이스
export interface InspectionLog {
  id: string;
  date: string;
  type: 'daily' | 'weekly' | 'monthly' | 'incident';
  building: string;
  createdAt: Date;
  createdBy: 'system' | string;
  confirmedBy?: string;
  confirmedAt?: Date;
  chillerData: {
    id: string;
    status: string;
    highPressure: number;
    lowPressure: number;
    oilLevel: number;
    dischargeTemp: number;
  }[];
  sensorData: {
    id: string;
    location: string;
    avgRms: number;
    avgPeak: number;
    status: string;
  }[];
  alarmHistory: {
    time: string;
    source: AlarmSource;
    level: string;
    message: string;
  }[];
  remarks: {
    type: 'auto' | 'manual';
    content: string;
  }[];
}

// 채팅 메시지 타입
export type MessageType = 'text' | 'table' | 'chart' | 'alert' | 'equipment' | 'report' | 'action';

export interface ChatMessage {
  id: string;
  type: MessageType;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  actions?: ChatAction[];
  metadata?: {
    source?: AlarmSource;
    confidence?: number;
    relatedEquipment?: string[];
  };
}

export interface ChatAction {
  id: string;
  label: string;
  type: 'link' | 'download' | 'navigate' | 'query';
  target: string;
}
