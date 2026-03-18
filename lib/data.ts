// 인천공항 열원사업소 AI 모니터링 시스템 - 목업 데이터

import type { CctvCamera, SensorData, AlarmData, ChillerData, NavGroup, PageTitle } from './types';

// 페이지 타이틀 데이터
export const PAGE_TITLES: Record<string, PageTitle> = {
  p1: { title: '실시간 관제', subtitle: 'CCTV·센서 통합 모니터링' },
  p2: { title: '영상 모니터링', subtitle: '냉각탑·팬류 CCTV 전체 화면' },
  p3: { title: '냉동기 현황', subtitle: '스크류냉동기 상세 데이터' },
  p4: { title: '알람·이벤트 관리', subtitle: '알람 이력 조회 및 관리' },
  p5: { title: '설비 현황', subtitle: '건물별 설비 상태 (AICC·관제탑·공항청사)' },
  p6: { title: '임계값 설정', subtitle: '진동·온도·압력 임계값 설정' },
  p7: { title: '연동 현황', subtitle: 'BEMS·DDC·Century 연동 상태' },
  p8: { title: '점검일지', subtitle: '자동 생성 점검일지 관리' },
  p9: { title: 'AI 챗봇', subtitle: 'AI 운영 어시스턴트' },
  p10: { title: 'AI 예측 분석', subtitle: 'AI 기반 장비 고장 예측 및 수명 관리' },
};

// 네비게이션 그룹 데이터
export const NAVIGATION_GROUPS: NavGroup[] = [
  {
    label: '실시간 모니터링',
    items: [
      { id: 'p1', label: '실시간 관제', icon: 'dashboard' },
      { id: 'p2', label: '영상 모니터링', icon: 'video' },
      { id: 'p3', label: '냉동기 현황', icon: 'gauge' },
      { id: 'p4', label: '알람·이벤트 관리', icon: 'alarm', badge: 3 },
    ],
  },
  {
    label: '설비 관리',
    items: [
      { id: 'p5', label: '설비 현황', icon: 'building' },
      { id: 'p6', label: '임계값 설정', icon: 'settings' },
    ],
  },
  {
    label: '일지 관리',
    items: [
      { id: 'p8', label: '점검일지', icon: 'document' },
    ],
  },
  {
    label: 'AI 지원',
    items: [
      { id: 'p9', label: 'AI 챗봇', icon: 'chat' },
      { id: 'p10', label: 'AI 예측 분석', icon: 'brain' },
    ],
  },
  {
    label: '시스템',
    items: [
      { id: 'p7', label: '연동 현황', icon: 'link' },
    ],
  },
];

// CCTV 탭 데이터
export const CCTV_TABS = [
  { key: 'all' as const, label: '전체', count: 12 },
  { key: 'chiller' as const, label: '냉동기', count: 6 },
  { key: 'coolingTower' as const, label: '냉각탑', count: 2 },
  { key: 'fan' as const, label: '팬류/공조기', count: 4 },
];

// CCTV 카메라 데이터 (열원사업소 12대: 냉동기 6대 + 냉각탑 2대 + 팬류/공조기 4대)
export const DEFAULT_CAMERAS: CctvCamera[] = [
  // AICC 건물 - 냉동기 (2대)
  {
    id: 'CAM-01',
    name: '냉동기 #1',
    location: '스크류냉동기',
    zone: 'AICC',
    type: 'fixed',
    status: 'normal',
    aiStatus: 'n',
    value: '82.24 USRT',
    category: 'chiller',
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 'CAM-02',
    name: '냉동기 #2',
    location: '스크류냉동기',
    zone: 'AICC',
    type: 'fixed',
    status: 'normal',
    aiStatus: 'n',
    value: '82.24 USRT',
    category: 'chiller',
    imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&q=80&auto=format&fit=crop',
  },
  // AICC 건물 - 냉각탑 (1대)
  {
    id: 'CAM-03',
    name: '냉각탑',
    location: '냉각탑 설비',
    zone: 'AICC',
    type: 'ptz',
    status: 'normal',
    aiStatus: 'n',
    value: '32°C',
    category: 'coolingTower',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
  },
  // 관제탑 건물 - 냉동기 (2대)
  {
    id: 'CAM-04',
    name: '냉동기 #1',
    location: '스크류냉동기',
    zone: '관제탑',
    type: 'fixed',
    status: 'normal',
    aiStatus: 'n',
    value: '40 USRT',
    category: 'chiller',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 'CAM-05',
    name: '냉동기 #2',
    location: '스크류냉동기',
    zone: '관제탑',
    type: 'fixed',
    status: 'warning',
    aiStatus: 'w',
    value: '40 USRT',
    aiDetail: '압력 이상 징후',
    category: 'chiller',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80&auto=format&fit=crop',
  },
  // 관제탑 건물 - 팬류/공조기 (1대)
  {
    id: 'CAM-06',
    name: '팬류/공조기',
    location: '팬류 설비',
    zone: '관제탑',
    type: 'ptz',
    status: 'normal',
    aiStatus: 'n',
    category: 'fan',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
  },
  // 공항청사 건물 - 냉동기 (2대)
  {
    id: 'CAM-07',
    name: '냉동기 #1',
    location: '스크류냉동기',
    zone: '공항청사',
    type: 'fixed',
    status: 'danger',
    aiStatus: 'd',
    value: '60.19 USRT',
    aiDetail: '이상 감지',
    category: 'chiller',
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 'CAM-08',
    name: '냉동기 #2',
    location: '스크류냉동기',
    zone: '공항청사',
    type: 'fixed',
    status: 'normal',
    aiStatus: 'n',
    value: '60.19 USRT',
    category: 'chiller',
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format&fit=crop',
  },
  // 공항청사 건물 - 냉각탑 (1대)
  {
    id: 'CAM-09',
    name: '냉각탑',
    location: '냉각탑 설비',
    zone: '공항청사',
    type: 'ptz',
    status: 'normal',
    aiStatus: 'n',
    value: '30°C',
    category: 'coolingTower',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format&fit=crop',
  },
  // AICC 건물 - 팬류/공조기 (2대)
  {
    id: 'CAM-10',
    name: '공조기 #1',
    location: 'AHU 설비',
    zone: 'AICC',
    type: 'fixed',
    status: 'warning',
    aiStatus: 'w',
    aiDetail: '회전 과속 (+15% RPM)',
    value: '과속 경고',
    category: 'fan',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80&auto=format&fit=crop',
  },
  {
    id: 'CAM-11',
    name: '공조기 #2',
    location: 'AHU 설비',
    zone: 'AICC',
    type: 'fixed',
    status: 'normal',
    aiStatus: 'n',
    category: 'fan',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80&auto=format&fit=crop',
  },
  // 공항청사 건물 - 팬류/공조기 (1대)
  {
    id: 'CAM-12',
    name: '팬류/공조기',
    location: '팬류 설비',
    zone: '공항청사',
    type: 'ptz',
    status: 'normal',
    aiStatus: 'n',
    category: 'fan',
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format&fit=crop',
  },
];

// 센서 데이터
export const DEFAULT_SENSORS: SensorData[] = [
  { id: 'VIB-01', location: 'AICC · 냉각탑 #1', vibration: 2.1, temperature: 25.3, status: 'ok' },
  { id: 'VIB-02', location: 'AICC · 냉각탑 #2', vibration: 2.3, temperature: 26.1, status: 'ok' },
  { id: 'VIB-03', location: 'AICC · 팬류 F-01', vibration: 3.8, temperature: 28.5, status: 'warn' },
  { id: 'VIB-04', location: 'AICC · 팬류 F-02', vibration: 1.9, temperature: 24.2, status: 'ok' },
  { id: 'VIB-05', location: 'AICC · 공조기 #1', vibration: 2.5, temperature: 23.8, status: 'ok' },
  { id: 'VIB-06', location: 'AICC · 공조기 #2', vibration: 2.2, temperature: 24.1, status: 'ok' },
  { id: 'VIB-07', location: '관제탑 · 냉동기 #1', vibration: 1.8, temperature: 22.5, status: 'ok' },
  { id: 'VIB-08', location: '관제탑 · 냉동기 #2', vibration: 2.0, temperature: 23.0, status: 'ok' },
  { id: 'VIB-09', location: '관제탑 · 팬류 F-03', vibration: 2.4, temperature: 25.2, status: 'ok' },
  { id: 'VIB-10', location: '공항청사 · 냉동기 #1', vibration: 1.7, temperature: 21.8, status: 'ok' },
  { id: 'VIB-11', location: '공항청사 · 냉동기 #2', vibration: 1.9, temperature: 22.3, status: 'ok' },
  { id: 'VIB-12', location: '공항청사 · 팬류 F-04', vibration: 2.1, temperature: 24.5, status: 'ok' },
];

// 알람 데이터
export const DEFAULT_ALARMS: AlarmData[] = [
  {
    id: 'alarm-1',
    level: 'danger',
    levelText: '긴급',
    source: 'DX',
    time: '2분 전',
    title: 'AICC 팬류 F-01 진동 임계값 초과',
    desc: 'CAM-05 팬류 F-01',
    current: '3.8mm/s',
    threshold: '3.0mm/s',
    isNew: true,
  },
  {
    id: 'alarm-2',
    level: 'warn',
    levelText: '경고',
    source: 'AI',
    time: '8분 전',
    title: '관제탑 냉동기 #1 베어링 결함 징후',
    desc: 'FFT 분석 BPFO 패턴 감지',
    current: '미스얼라인먼트 초기',
    threshold: '예측: 14일 내 점검 필요',
  },
  {
    id: 'alarm-3',
    level: 'caution',
    levelText: '주의',
    source: 'DX',
    time: '15분 전',
    title: 'AICC 냉각탑 정기 점검 완료',
    desc: 'CAM-01 ~ CAM-02',
  },
];

// 냉동기 데이터
export const DEFAULT_CHILLERS: ChillerData[] = [
  {
    id: 'CHILLER-01',
    zone: 'AICC',
    name: '스크류냉동기 #1',
    status: 'running',
    usrt: 82.24,
    highPressure: 13.5,
    lowPressure: 4.2,
    oilLevel: 65,
    dischargeTemp: 72,
    chilledWaterIn: 12,
    chilledWaterOut: 7,
  },
  {
    id: 'CHILLER-02',
    zone: 'AICC',
    name: '스크류냉동기 #2',
    status: 'running',
    usrt: 82.24,
    highPressure: 14.1,
    lowPressure: 4.5,
    oilLevel: 70,
    dischargeTemp: 75,
    chilledWaterIn: 12,
    chilledWaterOut: 7,
  },
  {
    id: 'CHILLER-03',
    zone: '관제탑',
    name: '스크류냉동기 #1',
    status: 'running',
    usrt: 40,
    highPressure: 12.8,
    lowPressure: 3.8,
    oilLevel: 62,
    dischargeTemp: 68,
    chilledWaterIn: 11,
    chilledWaterOut: 6,
  },
  {
    id: 'CHILLER-04',
    zone: '관제탑',
    name: '스크류냉동기 #2',
    status: 'standby',
    usrt: 40,
    highPressure: 0,
    lowPressure: 0,
    oilLevel: 58,
    dischargeTemp: 25,
    chilledWaterIn: 0,
    chilledWaterOut: 0,
  },
  {
    id: 'CHILLER-05',
    zone: '공항청사',
    name: '스크류냉동기 #1',
    status: 'running',
    usrt: 60.19,
    highPressure: 13.2,
    lowPressure: 4.0,
    oilLevel: 63,
    dischargeTemp: 70,
    chilledWaterIn: 12,
    chilledWaterOut: 7,
  },
  {
    id: 'CHILLER-06',
    zone: '공항청사',
    name: '스크류냉동기 #2',
    status: 'standby',
    usrt: 60.19,
    highPressure: 0,
    lowPressure: 0,
    oilLevel: 55,
    dischargeTemp: 25,
    chilledWaterIn: 0,
    chilledWaterOut: 0,
  },
];

// 카메라 설정 파일 타입 (camera_config.json)
export interface CameraConfigItem {
  id: string;
  name: string;
  building: string;
  equipment: string;
  customImage?: string; // base64 인코딩된 이미지
  rois?: {
    id: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }[];
  thresholds?: {
    tempWarning: number;
    tempDanger: number;
    vibrationWarning: number;
    vibrationDanger: number;
  };
}

export interface CameraConfig {
  cameras: CameraConfigItem[];
}

// 냉동기 모니터링용 카메라 ID 목록 (p3 냉동기 현황 페이지용)
// camera_config.json에서 냉동기 관련 카메라만 필터링하여 표시
export const CHILLER_CAMERA_IDS = ['CAM-01', 'CAM-02']; // AICC 냉동기 #1, #2

// 빠른 질문 데이터 (시나리오 기반)
export const QUICK_QUESTIONS = [
  // 시나리오 1: 이상 분석 및 WO 발행
  { id: 'sq1', label: '고압 경보 분석', query: 'AICC 2호기 고압 경보 발생했어, 원인이 뭔지 분석해줘' },
  { id: 'sq2', label: 'WO 발행', query: 'WO 발행해줘' },
  // 시나리오 2: 점검일지 자동 완성 및 이력 조회
  { id: 'sq3', label: '점검일지 자동완성', query: '관제탑 냉동기 2대 오늘 성능 점검 결과를 센서 데이터로 자동 채워줘' },
  { id: 'sq4', label: '이상 이력 조회', query: '관제탑 냉동기 최근 3개월 이상 이력 보여줘' },
  // 시나리오 3: 성수기 대비 점검 계획 및 시뮬레이션
  { id: 'sq5', label: '성수기 점검계획', query: '곧 여름 성수기야. 7~8월 피크 대비해서 냉동기 사전 점검 일정 잡아줘' },
  { id: 'sq6', label: '부하 시뮬레이션', query: '냉동기 1대 고장나면 나머지로 버틸 수 있어?' },
];
