'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Zap,
  Brain,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Upload,
  Grid3X3,
  Activity,
  BarChart3,
  BookOpen,
} from 'lucide-react';

// 전력/전압/전류 이상 감지 데이터
const powerAnomalies = [
  { id: 'PWR-001', type: '전류', equipment: '냉동기 #2', value: '125.8A', threshold: '100A', status: 'warning', change: '+25.8%' },
  { id: 'PWR-002', type: '전압', equipment: '변압기 TR-01', value: '±7.2%', threshold: '±5%', status: 'warning', change: '변동폭 증가' },
  { id: 'PWR-003', type: '전력', equipment: '터보냉동기 #1', value: '85.2kW', threshold: '75kW', status: 'caution', change: '+13.6%' },
  { id: 'PWR-004', type: '역률', equipment: 'AICC 수배전반', value: '0.72', threshold: '0.85', status: 'caution', change: '-15.3%' },
  { id: 'PWR-005', type: '고조파', equipment: '공항청사 MCC', value: '8.5%', threshold: '5%', status: 'caution', change: '+70%' },
  { id: 'PWR-006', type: '전류', equipment: '펌프 P-102', value: '불균형 12%', threshold: '10%', status: 'caution', change: '+20%' },
];

// AI 예측 데이터
const predictions = [
  {
    id: 'AI-001',
    severity: 'warning' as const,
    category: 'lifecycle',
    equipment: '스크류냉동기 #2',
    location: 'AICC B1F',
    title: '장비 수명 주기 경고',
    description: '동일 모델 3년 전 베어링 마모 고장. 현재 2년 11개월 도달.',
    prediction: '30일 내 베어링 점검',
    confidence: 87,
  },
  {
    id: 'AI-002',
    severity: 'warning' as const,
    category: 'pattern',
    equipment: '냉각탑 팬 #3',
    location: '관제탑 옥상',
    title: '진동 스파이크 주기 단축',
    description: '진동 발생 주기 48h→24h→12h 단축 추세.',
    prediction: '팬 밸런싱/베어링 교체',
    confidence: 92,
  },
  {
    id: 'AI-003',
    severity: 'warning' as const,
    category: 'power',
    equipment: '변압기 TR-01',
    location: '공항청사 전기실',
    title: '전압 변동폭 증가',
    description: '전압 변동 ±3%→±7%, 고조파 왜곡률 상승.',
    prediction: '전력 품질 필터 점검',
    confidence: 85,
  },
  {
    id: 'AI-004',
    severity: 'caution' as const,
    category: 'power',
    equipment: '터보냉동기 #1',
    location: '공항청사 지하',
    title: '전력 소비량 8.3% 증가',
    description: '동일 부하 대비 효율 저하 징후.',
    prediction: '냉매 충전량 점검',
    confidence: 78,
  },
  {
    id: 'AI-005',
    severity: 'caution' as const,
    category: 'maintenance',
    equipment: '공조기 AHU-05',
    location: 'AICC 3F',
    title: '필터 막힘률 72%',
    description: '평균 교체 주기 대비 85% 경과.',
    prediction: '2주 내 필터 교체',
    confidence: 95,
  },
  {
    id: 'AI-006',
    severity: 'caution' as const,
    category: 'temperature',
    equipment: '펌프 P-102',
    location: '관제탑 B1F',
    title: '모터 온도 상승 추세',
    description: '14일간 +0.3°C/일 상승. 냉각 계통 이상.',
    prediction: '7일 내 과열 위험',
    confidence: 81,
  },
  {
    id: 'AI-007',
    severity: 'caution' as const,
    category: 'weather',
    equipment: '냉각탑 팬 #1~#4',
    location: '관제탑 옥상',
    title: '우천 예보 (80%)',
    description: '오늘 오후 비 예보. 외부 장비 점검 권장.',
    prediction: '외부 장비 모니터링 강화',
    confidence: 90,
  },
  {
    id: 'AI-008',
    severity: 'caution' as const,
    category: 'power',
    equipment: 'AICC 수배전반',
    location: 'AICC B1F',
    title: '역률 저하 (0.72)',
    description: '기준 0.85 대비 15% 하락. 전력 요금 증가 우려.',
    prediction: '역률 개선 설비 점검',
    confidence: 83,
  },
  {
    id: 'AI-009',
    severity: 'info' as const,
    category: 'lifecycle',
    equipment: '냉각수 펌프 #4',
    location: 'AICC B2F',
    title: '수명 74% 경과',
    description: '가동 18,500시간 / 예상 25,000시간.',
    prediction: '8개월 후 오버홀 검토',
    confidence: 88,
  },
  {
    id: 'AI-010',
    severity: 'info' as const,
    category: 'weather',
    equipment: '외부 배관',
    location: 'AICC 옥상',
    title: '동파 위험 예측',
    description: '내일 새벽 -5°C 예보. 외부 배관 주의.',
    prediction: '순환 펌프 가동 권장',
    confidence: 88,
  },
  {
    id: 'AI-011',
    severity: 'info' as const,
    category: 'load',
    equipment: '전체 시스템',
    location: '열원사업소',
    title: '냉방 부하 증가 예측',
    description: '다음 주 평균 기온 +5°C 상승 예보.',
    prediction: '냉동기 추가 가동 준비',
    confidence: 72,
  },
  {
    id: 'AI-012',
    severity: 'caution' as const,
    category: 'weather',
    equipment: '전기실 환풍기',
    location: '공항청사 B1F',
    title: '침수 위험 알림',
    description: '강수량 50mm+ 시 반지하 침수 이력.',
    prediction: '배수펌프 점검 필요',
    confidence: 76,
  },
];

// 장비 수명 현황 데이터
const equipmentLifecycle = [
  { name: '스크류냉동기 #1', age: 4.2, expectedLife: 15, status: 'normal' as const, lastMaintenance: '2024-01-10' },
  { name: '스크류냉동기 #2', age: 2.9, expectedLife: 15, status: 'warning' as const, lastMaintenance: '2023-11-15' },
  { name: '터보냉동기 #1', age: 5.8, expectedLife: 20, status: 'normal' as const, lastMaintenance: '2024-01-05' },
  { name: '냉각탑 팬 #1', age: 3.5, expectedLife: 10, status: 'normal' as const, lastMaintenance: '2023-12-20' },
  { name: '냉각탑 팬 #2', age: 3.5, expectedLife: 10, status: 'normal' as const, lastMaintenance: '2023-12-20' },
  { name: '냉각탑 팬 #3', age: 3.5, expectedLife: 10, status: 'caution' as const, lastMaintenance: '2023-10-05' },
  { name: '공조기 AHU-05', age: 6.2, expectedLife: 15, status: 'caution' as const, lastMaintenance: '2023-09-15' },
  { name: '펌프 P-102', age: 2.1, expectedLife: 12, status: 'caution' as const, lastMaintenance: '2023-08-20' },
];

type TabType = 'all' | 'warning' | 'caution' | 'info';

export function AiPredictionPage() {
  const [selectedTab, setSelectedTab] = useState<TabType>('all');

  // 통계
  const stats = {
    totalPredictions: predictions.length,
    warnings: predictions.filter(p => p.severity === 'warning').length,
    cautions: predictions.filter(p => p.severity === 'caution').length,
    avgConfidence: Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length),
  };

  const filteredPredictions = selectedTab === 'all'
    ? predictions
    : predictions.filter(p => p.severity === selectedTab);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'warning':
        return <AlertTriangle className="h-3 w-3" />;
      case 'caution':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Info className="h-3 w-3" />;
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'warning': return '경고';
      case 'caution': return '주의';
      default: return '정보';
    }
  };

  const getLifecyclePercent = (age: number, expectedLife: number) => {
    return Math.min(100, (age / expectedLife) * 100);
  };

  return (
    <div className="space-y-4">
      {/* 전력 이상 감지 섹션 */}
      <Card>
        <CardHeader className="py-3 px-4 bg-gradient-to-r from-destructive/10 to-transparent border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-destructive" />
              <CardTitle className="text-sm font-semibold">전력 이상 감지</CardTitle>
              <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
                {powerAnomalies.length}건
              </Badge>
            </div>
            <span className="text-[10px] text-muted-foreground">최근 5분 내 갱신</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-6 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 divide-x divide-y divide-border">
            {powerAnomalies.map(item => (
              <div
                key={item.id}
                className={cn(
                  'p-3 space-y-1',
                  item.status === 'warning' && 'bg-gradient-to-br from-destructive/10 to-transparent border-l-2 border-l-destructive',
                  item.status === 'caution' && 'bg-gradient-to-br from-status-warn/10 to-transparent border-l-2 border-l-status-warn'
                )}
              >
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{item.type}</span>
                <p className="text-xs font-semibold truncate">{item.equipment}</p>
                <p className={cn(
                  'text-base font-bold font-mono',
                  item.status === 'warning' ? 'text-destructive' : 'text-status-warn'
                )}>
                  {item.value}
                </p>
                <p className="text-[10px] text-muted-foreground">기준: {item.threshold}</p>
                <Badge
                  variant={item.status === 'warning' ? 'destructive' : 'secondary'}
                  className={cn(
                    'text-[10px] px-1.5 py-0',
                    item.status === 'caution' && 'bg-status-warn text-white'
                  )}
                >
                  {item.change}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI 요약 카드 */}
      <div className="grid grid-cols-4 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4">
        <Card className="border-l-2 border-l-primary relative overflow-hidden">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent-green/20 flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalPredictions}</p>
              <p className="text-xs text-muted-foreground">AI 예측 항목</p>
            </div>
            <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          </CardContent>
        </Card>

        <Card className="border-l-2 border-l-destructive">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.warnings}</p>
              <p className="text-xs text-muted-foreground">경고</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-2 border-l-status-warn">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-xl bg-status-warn/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-status-warn" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.cautions}</p>
              <p className="text-xs text-muted-foreground">주의</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-2 border-l-status-ok">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-xl bg-status-ok/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-status-ok" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.avgConfidence}%</p>
              <p className="text-xs text-muted-foreground">평균 신뢰도</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 메인 그리드 */}
      <div className="grid grid-cols-3 max-xl:grid-cols-1 gap-4">
        {/* AI 예측 목록 */}
        <Card className="col-span-2 max-xl:col-span-1">
          <CardHeader className="py-3 px-4 border-b">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">AI 예측 분석</CardTitle>
              </div>
              <div className="flex gap-1.5">
                {(['all', 'warning', 'caution', 'info'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={cn(
                      'px-3 py-1.5 text-[11px] font-semibold rounded-md border transition-colors',
                      selectedTab === tab
                        ? tab === 'warning'
                          ? 'bg-destructive text-white border-destructive'
                          : tab === 'caution'
                          ? 'bg-status-warn text-white border-status-warn'
                          : 'bg-primary text-white border-primary'
                        : 'bg-secondary text-secondary-foreground border-border hover:bg-muted'
                    )}
                  >
                    {tab === 'all' ? `전체 (${predictions.length})` :
                     tab === 'warning' ? `경고 (${stats.warnings})` :
                     tab === 'caution' ? `주의 (${stats.cautions})` : '정보'}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wide">상태</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wide">장비</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wide">예측 내용</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wide max-md:hidden">조치 권고</th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wide max-md:hidden">신뢰도</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPredictions.map(pred => (
                  <tr
                    key={pred.id}
                    className={cn(
                      'hover:bg-muted/50 transition-colors',
                      pred.severity === 'warning' && 'bg-gradient-to-r from-destructive/5 to-transparent',
                      pred.severity === 'caution' && 'bg-gradient-to-r from-status-warn/5 to-transparent',
                      pred.severity === 'info' && 'bg-gradient-to-r from-primary/5 to-transparent'
                    )}
                  >
                    <td className="px-3 py-2.5">
                      <Badge
                        variant={pred.severity === 'warning' ? 'destructive' : 'secondary'}
                        className={cn(
                          'text-[10px] px-2 py-0.5 gap-1',
                          pred.severity === 'caution' && 'bg-status-warn text-white',
                          pred.severity === 'info' && 'bg-primary text-white'
                        )}
                      >
                        {getSeverityIcon(pred.severity)}
                        {getSeverityLabel(pred.severity)}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="space-y-0.5">
                        <p className="font-semibold">{pred.equipment}</p>
                        <p className="text-[10px] text-muted-foreground">{pred.location}</p>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 max-w-[300px]">
                      <div className="space-y-0.5">
                        <p className="font-semibold">{pred.title}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{pred.description}</p>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 max-md:hidden">
                      <Badge variant="outline" className="text-[10px] bg-accent-green/10 text-accent-green border-accent-green/30">
                        {pred.prediction}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 max-md:hidden">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-accent-green to-primary rounded-full"
                            style={{ width: `${pred.confidence}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-semibold">{pred.confidence}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* 장비 수명 현황 */}
        <Card>
          <CardHeader className="py-3 px-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">장비 수명 현황</CardTitle>
              </div>
              <Badge className="text-[10px] bg-accent-green text-white">실시간 추적</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-3 space-y-2.5">
            {equipmentLifecycle.map((eq, idx) => (
              <div
                key={idx}
                className={cn(
                  'p-3 rounded-lg border bg-muted/30 flex items-center gap-3',
                  eq.status === 'warning' && 'border-l-2 border-l-destructive',
                  eq.status === 'caution' && 'border-l-2 border-l-status-warn',
                  eq.status === 'normal' && 'border-l-2 border-l-status-ok'
                )}
              >
                <div className="flex-1 min-w-[100px]">
                  <p className="text-xs font-semibold">{eq.name}</p>
                  <p className="text-[10px] text-muted-foreground">최근 정비: {eq.lastMaintenance}</p>
                </div>
                <div className="flex-[2] min-w-[100px]">
                  <div className="h-2 bg-muted rounded-full overflow-hidden mb-1">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        eq.status === 'normal' && 'bg-gradient-to-r from-status-ok to-status-ok/70',
                        eq.status === 'caution' && 'bg-gradient-to-r from-status-warn to-status-warn/70',
                        eq.status === 'warning' && 'bg-gradient-to-r from-destructive to-destructive/70'
                      )}
                      style={{ width: `${getLifecyclePercent(eq.age, eq.expectedLife)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-muted-foreground">
                    <span>{eq.age}년</span>
                    <span>{eq.expectedLife}년</span>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-[10px] px-2 py-0.5 min-w-[45px] justify-center',
                    eq.status === 'normal' && 'bg-status-ok/10 text-status-ok',
                    eq.status === 'caution' && 'bg-status-warn/10 text-status-warn',
                    eq.status === 'warning' && 'bg-destructive/10 text-destructive'
                  )}
                >
                  {eq.status === 'warning' && '경고'}
                  {eq.status === 'caution' && '주의'}
                  {eq.status === 'normal' && '정상'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI 학습 현황 */}
      <Card>
        <CardHeader className="py-3 px-4 border-b">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">AI 학습 데이터 현황</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-5 max-lg:grid-cols-3 max-sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold">1,247,832</p>
                <p className="text-[10px] text-muted-foreground">수집된 데이터 포인트</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Grid3X3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold">156</p>
                <p className="text-[10px] text-muted-foreground">과거 고장 이력</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold">48</p>
                <p className="text-[10px] text-muted-foreground">분석 패턴</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold">94.2%</p>
                <p className="text-[10px] text-muted-foreground">예측 정확도</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-lg font-bold">3년</p>
                <p className="text-[10px] text-muted-foreground">학습 기간</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AiPredictionPage;
