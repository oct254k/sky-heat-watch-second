'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { DEFAULT_CHILLERS, DEFAULT_SENSORS, DEFAULT_ALARMS } from '@/lib/data';
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Printer,
  User,
  Clock,
  AlertTriangle,
  Sparkles,
  Cpu,
} from 'lucide-react';

type LogType = 'daily' | 'weekly' | 'monthly';

const logTypeConfig = {
  daily: { label: '일간', period: '일일 점검일지' },
  weekly: { label: '주간', period: '주간 운영일지' },
  monthly: { label: '월간', period: '월간 성능보고서' },
};

export function InspectionLogPage() {
  const [logType, setLogType] = useState<LogType>('daily');
  const [selectedDate, setSelectedDate] = useState('2026-03-18');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const runningChillers = DEFAULT_CHILLERS.filter((c) => c.status === 'running');
  const standbyChillers = DEFAULT_CHILLERS.filter((c) => c.status === 'standby');
  const warnSensors = DEFAULT_SENSORS.filter((s) => s.status === 'warn');

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-4">
          {/* Log Type Tabs */}
          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            {(Object.keys(logTypeConfig) as LogType[]).map((type) => (
              <button
                key={type}
                onClick={() => setLogType(type)}
                className={cn(
                  'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                  logType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {logTypeConfig[type].label}
              </button>
            ))}
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          {/* Building Filter */}
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none">
            <option value="all">전체 건물</option>
            <option value="aicc">AICC</option>
            <option value="control-tower">관제탑</option>
            <option value="terminal">공항청사</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
            <Printer className="h-4 w-4" />
            인쇄
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Download className="h-4 w-4" />
            PDF 다운로드
          </button>
        </div>
      </div>

      {/* Log Document */}
      <div className="rounded-xl border border-border bg-card">
        {/* Document Header */}
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/20 p-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">{logTypeConfig[logType].period}</h2>
                <p className="text-sm text-muted-foreground">자동 생성 · {selectedDate}</p>
              </div>
            </div>
            <div className="rounded-lg bg-accent-green/10 px-3 py-1.5">
              <span className="text-sm font-medium text-accent-green">자동 생성 완료</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-muted-foreground">작성일</p>
              <p className="font-medium text-foreground">{selectedDate}</p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-muted-foreground">작성자</p>
              <p className="font-medium text-foreground">시스템 (자동)</p>
            </div>
            <div className="rounded-lg bg-secondary p-3">
              <p className="text-muted-foreground">점검 구분</p>
              <p className="font-medium text-foreground">정기 점검</p>
            </div>
          </div>
        </div>

        {/* Chiller Status Section */}
        <div className="border-b border-border p-6">
          <h3 className="mb-4 font-semibold text-foreground">스크류냉동기 운전 현황</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">설비</th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">건물</th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground">상태</th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground">고압</th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground">저압</th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground">유면</th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground">토출온도</th>
                </tr>
              </thead>
              <tbody>
                {DEFAULT_CHILLERS.map((chiller) => (
                  <tr key={chiller.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 font-medium text-foreground">{chiller.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{chiller.zone}</td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          chiller.status === 'running'
                            ? 'bg-accent-green/20 text-accent-green'
                            : 'bg-accent-yellow/20 text-accent-yellow'
                        )}
                      >
                        {chiller.status === 'running' ? '가동' : '대기'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center text-foreground">
                      {chiller.highPressure > 0 ? chiller.highPressure : '-'}
                    </td>
                    <td className="px-3 py-2 text-center text-foreground">
                      {chiller.lowPressure > 0 ? chiller.lowPressure : '-'}
                    </td>
                    <td className="px-3 py-2 text-center text-foreground">{chiller.oilLevel}%</td>
                    <td className="px-3 py-2 text-center text-foreground">
                      {chiller.status === 'running' ? `${chiller.dischargeTemp}°C` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sensor Data Section */}
        <div className="border-b border-border p-6">
          <h3 className="mb-4 font-semibold text-foreground">진동 센서 측정값 (일 평균)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">센서</th>
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">위치</th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground">진동 (mm/s)</th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground">온도 (°C)</th>
                  <th className="px-3 py-2 text-center font-medium text-muted-foreground">상태</th>
                </tr>
              </thead>
              <tbody>
                {DEFAULT_SENSORS.slice(0, 6).map((sensor) => (
                  <tr key={sensor.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 font-medium text-foreground">{sensor.id}</td>
                    <td className="px-3 py-2 text-muted-foreground">{sensor.location}</td>
                    <td className={cn('px-3 py-2 text-center', sensor.status === 'warn' ? 'text-accent-yellow' : 'text-foreground')}>
                      {sensor.vibration}
                    </td>
                    <td className="px-3 py-2 text-center text-foreground">{sensor.temperature}</td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          sensor.status === 'ok'
                            ? 'bg-accent-green/20 text-accent-green'
                            : 'bg-accent-yellow/20 text-accent-yellow'
                        )}
                      >
                        {sensor.status === 'ok' ? '정상' : '주의'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alarm History Section */}
        <div className="border-b border-border p-6">
          <h3 className="mb-4 font-semibold text-foreground">알람 발생 이력 (당일)</h3>
          <div className="space-y-2">
            {DEFAULT_ALARMS.map((alarm) => {
              const SourceIcon = alarm.source === 'AI' ? Sparkles : Cpu;
              return (
                <div
                  key={alarm.id}
                  className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{alarm.time}</span>
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium',
                      alarm.source === 'AI' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground'
                    )}
                  >
                    <SourceIcon className="h-3 w-3" />
                    {alarm.source}
                  </span>
                  <span className="text-sm text-foreground">{alarm.title}</span>
                  {alarm.current && alarm.threshold && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      ({alarm.current} &gt; {alarm.threshold})
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Remarks Section */}
        <div className="border-b border-border p-6">
          <h3 className="mb-4 font-semibold text-foreground">특이사항</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg bg-accent-yellow/10 p-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-accent-yellow" />
              <div>
                <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                  자동 기록
                </span>
                <p className="mt-1 text-sm text-foreground">
                  팬류 F-01 점검 필요 (14일 내) - AI 분석 기반 베어링 결함 징후 감지
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-secondary p-3">
              <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <span className="rounded bg-secondary px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                  수동 입력
                </span>
                <textarea
                  placeholder="추가 특이사항을 입력하세요..."
                  className="mt-2 w-full rounded-lg border border-border bg-background p-2 text-sm focus:border-primary focus:outline-none"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Section */}
        <div className="p-6">
          <h3 className="mb-4 font-semibold text-foreground">담당자 확인</h3>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">확인자:</span>
              <select className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">선택</option>
                <option value="kim">김관리</option>
                <option value="lee">이운영</option>
                <option value="park">박점검</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">확인일시:</span>
              <input
                type="datetime-local"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <button
              onClick={() => setIsConfirmed(true)}
              className={cn(
                'ml-auto flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-medium',
                isConfirmed
                  ? 'bg-accent-green/20 text-accent-green'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              {isConfirmed ? '확인 완료' : '확인 완료 처리'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
