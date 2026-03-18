'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { QUICK_QUESTIONS } from '@/lib/data';
import { generateScenarioResponse, type ChatScenarioResponse } from '@/lib/chatScenarios';
import {
  Send,
  Bot,
  User,
  Sparkles,
  AlertTriangle,
  FileText,
  ClipboardCheck,
  History,
  Calendar,
  BarChart3,
  ExternalLink,
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  type?: 'text' | 'table' | 'alarm' | 'analysis' | 'wo' | 'checklist' | 'history' | 'plan' | 'simulation';
  tableData?: { headers: string[]; rows: (string | { value: string; status?: string })[][] };
  alarms?: { level: 'danger' | 'warn' | 'info'; title: string; desc: string }[];
  actions?: { label: string; action: string }[];
}

const initialMessages: Message[] = [
  {
    id: '1',
    sender: 'ai',
    content: '안녕하세요! 열원사업소 AI 운영 어시스턴트입니다. 설비 상태, 알람 분석, 점검일지 등 궁금한 점을 자유롭게 질문해 주세요.',
    timestamp: new Date(),
  },
];

// 키워드 기반 기본 응답 생성
const generateDefaultResponse = (query: string): Omit<Message, 'id' | 'timestamp'> => {
  const lowerQuery = query.toLowerCase();

  // 인사말
  if (lowerQuery.includes('안녕') || lowerQuery.includes('하이') || lowerQuery.includes('hello')) {
    return {
      sender: 'ai',
      content: '안녕하세요! 열원사업소 AI 운영 어시스턴트입니다. 설비 상태, 알람, 점검일지 등 궁금한 점을 질문해 주세요.',
      type: 'text',
    };
  }

  // 냉동기 관련
  if (lowerQuery.includes('냉동기') || lowerQuery.includes('스크류') || lowerQuery.includes('chiller')) {
    return {
      sender: 'ai',
      content: '스크류냉동기 현황 (6대)\n\n현재 4대 가동 중, 2대 대기 상태입니다.',
      type: 'table',
      tableData: {
        headers: ['설비', '상태', '용량', '고압', '저압', '토출온도'],
        rows: [
          ['AICC #1', { value: '가동', status: 'ok' }, '82.24 USRT', '13.5', '4.2', '72°C'],
          ['AICC #2', { value: '가동', status: 'ok' }, '82.24 USRT', '14.1', '4.5', '75°C'],
          ['관제탑 #1', { value: '가동', status: 'ok' }, '40 USRT', '12.8', '3.8', '68°C'],
          ['관제탑 #2', { value: '대기', status: 'warn' }, '40 USRT', '-', '-', '-'],
          ['공항청사 #1', { value: '가동', status: 'ok' }, '60.19 USRT', '13.2', '4.0', '70°C'],
          ['공항청사 #2', { value: '대기', status: 'warn' }, '60.19 USRT', '-', '-', '-'],
        ],
      },
      actions: [
        { label: '상세 보기', action: 'p3' },
        { label: '트렌드 차트', action: 'chart' },
      ],
    };
  }

  // 알람 관련
  if (lowerQuery.includes('알람') || lowerQuery.includes('경고') || lowerQuery.includes('긴급') || lowerQuery.includes('이상')) {
    return {
      sender: 'ai',
      content: '현재 알람 현황\n\n총 3건의 알람이 발생했습니다.',
      type: 'alarm',
      alarms: [
        { level: 'danger', title: 'AICC 팬류 F-01 진동 임계값 초과', desc: '3.8mm/s > 3.0mm/s · 14:32' },
        { level: 'warn', title: '관제탑 냉동기 #1 압력 이상', desc: '4.8bar < 5.0bar · 09:15' },
        { level: 'info', title: 'AICC 냉각탑 정기 점검 완료', desc: 'CAM-01 ~ CAM-02 · 08:00' },
      ],
      actions: [
        { label: '알람 페이지', action: 'p4' },
        { label: 'CCTV 확인', action: 'p2' },
      ],
    };
  }

  // 점검일지 관련
  if (lowerQuery.includes('점검') || lowerQuery.includes('일지') || lowerQuery.includes('보고서')) {
    return {
      sender: 'ai',
      content: '오늘 점검일지 (2026-03-18)\n\n자동 생성 완료\n냉동기 6대 데이터 수집\n진동센서 12개 정상\n알람 3건 기록',
      type: 'table',
      tableData: {
        headers: ['항목', '상태', '비고'],
        rows: [
          ['냉동기 점검', { value: '완료', status: 'ok' }, '6대 모두 정상'],
          ['센서 데이터', { value: '정상', status: 'ok' }, '12개 센서 수집'],
          ['알람 이력', { value: '3건', status: 'warn' }, '긴급 1, 경고 2'],
          ['특이사항', { value: '있음', status: 'warn' }, '팬류 F-01 점검 필요'],
        ],
      },
      actions: [
        { label: '점검일지 보기', action: 'p8' },
        { label: 'PDF 다운로드', action: 'download' },
      ],
    };
  }

  // 진동 센서 관련
  if (lowerQuery.includes('진동') || lowerQuery.includes('센서') || lowerQuery.includes('vib')) {
    return {
      sender: 'ai',
      content: '진동 센서 현황 (12개)\n\n11개 정상, 1개 주의 상태입니다.',
      type: 'table',
      tableData: {
        headers: ['센서 ID', '위치', 'RMS', 'Peak', '상태'],
        rows: [
          ['VIB-01', 'AICC 냉각탑 #1', '2.1 mm/s', '3.2 mm/s', { value: '정상', status: 'ok' }],
          ['VIB-02', 'AICC 냉각탑 #2', '2.3 mm/s', '3.5 mm/s', { value: '정상', status: 'ok' }],
          ['VIB-03', 'AICC 팬류 F-01', '3.8 mm/s', '5.1 mm/s', { value: '주의', status: 'warn' }],
          ['VIB-04', 'AICC 팬류 F-02', '1.9 mm/s', '2.8 mm/s', { value: '정상', status: 'ok' }],
          ['VIB-05', '관제탑 냉동기 #1', '1.8 mm/s', '2.6 mm/s', { value: '정상', status: 'ok' }],
        ],
      },
      actions: [
        { label: '전체 보기', action: 'p1' },
        { label: '트렌드 분석', action: 'p9' },
      ],
    };
  }

  // 에너지 관련
  if (lowerQuery.includes('에너지') || lowerQuery.includes('전력') || lowerQuery.includes('사용량')) {
    return {
      sender: 'ai',
      content: '오늘 에너지 현황\n\n총 전력 사용량: 2,847 kWh\n전일 대비: -3.2%',
      type: 'table',
      tableData: {
        headers: ['건물', '사용량', '전일비', '상태'],
        rows: [
          ['AICC', '1,245 kWh', '-2.1%', { value: '정상', status: 'ok' }],
          ['관제탑', '892 kWh', '-4.5%', { value: '절감', status: 'ok' }],
          ['공항청사', '710 kWh', '-3.8%', { value: '절감', status: 'ok' }],
        ],
      },
    };
  }

  // 설비 현황
  if (lowerQuery.includes('설비') || lowerQuery.includes('현황') || lowerQuery.includes('상태')) {
    return {
      sender: 'ai',
      content: '전체 설비 현황\n\n총 32대 설비 중 30대 정상 운영 중입니다.',
      type: 'table',
      tableData: {
        headers: ['구분', '전체', '정상', '주의', '가동률'],
        rows: [
          ['냉동기', '6', '6', '0', { value: '100%', status: 'ok' }],
          ['냉각탑', '4', '4', '0', { value: '100%', status: 'ok' }],
          ['팬류', '8', '7', '1', { value: '87.5%', status: 'warn' }],
          ['공조기', '6', '6', '0', { value: '100%', status: 'ok' }],
          ['펌프', '8', '7', '1', { value: '87.5%', status: 'warn' }],
        ],
      },
      actions: [
        { label: '설비 현황', action: 'p5' },
      ],
    };
  }

  // 도움말
  if (lowerQuery.includes('도움') || lowerQuery.includes('help') || lowerQuery.includes('뭐') || lowerQuery.includes('기능')) {
    return {
      sender: 'ai',
      content: '사용 가능한 질문 예시\n\n- "냉동기 상태 알려줘"\n- "현재 알람 현황"\n- "오늘 점검일지 보여줘"\n- "진동 센서 현황"\n- "에너지 사용량"\n- "전체 설비 현황"\n\n위와 같은 질문을 하시면 관련 정보를 안내해 드립니다.',
      type: 'text',
    };
  }

  // 기본 응답
  return {
    sender: 'ai',
    content: '죄송합니다. 해당 질문을 이해하지 못했습니다.\n\n"냉동기 상태", "알람 현황", "점검일지" 등의 키워드로 질문해 주세요.\n\n"도움말"을 입력하시면 사용 가능한 질문 예시를 볼 수 있습니다.',
    type: 'text',
  };
};

// 통합 응답 생성 함수
const generateResponse = (query: string): Omit<Message, 'id' | 'timestamp'> => {
  // 시나리오 응답 먼저 확인
  const scenarioResponse = generateScenarioResponse(query);
  if (scenarioResponse) {
    return {
      sender: 'ai',
      content: scenarioResponse.text,
      type: scenarioResponse.type,
      tableData: scenarioResponse.tableData,
      alarms: scenarioResponse.alarms,
      actions: scenarioResponse.actions,
    };
  }

  // 기본 응답
  return generateDefaultResponse(query);
};

// 시나리오 타입별 아이콘 반환
const getScenarioIcon = (type?: string) => {
  switch (type) {
    case 'analysis':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case 'wo':
      return <FileText className="h-4 w-4 text-blue-500" />;
    case 'checklist':
      return <ClipboardCheck className="h-4 w-4 text-green-500" />;
    case 'history':
      return <History className="h-4 w-4 text-purple-500" />;
    case 'plan':
      return <Calendar className="h-4 w-4 text-cyan-500" />;
    case 'simulation':
      return <BarChart3 className="h-4 w-4 text-orange-500" />;
    default:
      return null;
  }
};

// 시나리오 타입별 배경색 반환
const getScenarioBgClass = (type?: string) => {
  switch (type) {
    case 'analysis':
      return 'border-amber-500/30 bg-amber-500/5';
    case 'wo':
      return 'border-blue-500/30 bg-blue-500/5';
    case 'checklist':
      return 'border-green-500/30 bg-green-500/5';
    case 'history':
      return 'border-purple-500/30 bg-purple-500/5';
    case 'plan':
      return 'border-cyan-500/30 bg-cyan-500/5';
    case 'simulation':
      return 'border-orange-500/30 bg-orange-500/5';
    default:
      return 'border-border bg-card';
  }
};

export function AiChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // AI 응답 생성
    setTimeout(() => {
      const response = generateResponse(messageText);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        timestamp: new Date(),
        ...response,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 액션 버튼 처리
  const handleAction = (action: string) => {
    if (action.startsWith('p')) {
      // 페이지 네비게이션 (추후 구현)
      console.log('Navigate to:', action);
    } else if (action === 'download') {
      alert('PDF 다운로드 기능은 추후 구현 예정입니다.');
    } else if (action === 'chart') {
      alert('차트 보기 기능은 추후 구현 예정입니다.');
    } else if (action === 'wo_create') {
      // WO 발행 시나리오 트리거
      handleSend('WO 발행해줘');
    } else if (action === 'history') {
      // 이력 조회 트리거
      handleSend('관제탑 냉동기 최근 3개월 이상 이력 보여줘');
    } else if (action === 'simulate') {
      // 시뮬레이션 트리거
      handleSend('냉동기 1대 고장나면 나머지로 버틸 수 있어?');
    } else {
      console.log('Action:', action);
    }
  };

  // 테이블 렌더링
  const renderTable = (data?: Message['tableData']) => {
    if (!data) return null;
    return (
      <div className="mt-3 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary">
              {data.headers.map((header, i) => (
                <th key={i} className="px-3 py-2 text-left font-medium">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, i) => (
              <tr key={i} className="border-t border-border">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={cn(
                      'px-3 py-2',
                      typeof cell === 'object' && cell.status === 'ok' && 'text-green-500',
                      typeof cell === 'object' && cell.status === 'warn' && 'text-amber-500',
                      typeof cell === 'object' && cell.status === 'danger' && 'text-red-500'
                    )}
                  >
                    {typeof cell === 'object' ? cell.value : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // 알람 카드 렌더링
  const renderAlarms = (alarms?: Message['alarms']) => {
    if (!alarms) return null;
    return (
      <div className="mt-3 space-y-2">
        {alarms.map((alarm, i) => (
          <div
            key={i}
            className={cn(
              'rounded-lg border p-3',
              alarm.level === 'danger' && 'border-red-500/30 bg-red-500/10',
              alarm.level === 'warn' && 'border-amber-500/30 bg-amber-500/10',
              alarm.level === 'info' && 'border-blue-500/30 bg-blue-500/10'
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 text-xs font-medium',
                  alarm.level === 'danger' && 'bg-red-500 text-white',
                  alarm.level === 'warn' && 'bg-amber-500 text-white',
                  alarm.level === 'info' && 'bg-blue-500 text-white'
                )}
              >
                {alarm.level === 'danger' ? '긴급' : alarm.level === 'warn' ? '경고' : '정보'}
              </span>
            </div>
            <div className="font-medium text-sm">{alarm.title}</div>
            <div className="text-xs text-muted-foreground">{alarm.desc}</div>
          </div>
        ))}
      </div>
    );
  };

  // 액션 버튼 렌더링
  const renderActions = (actions?: Message['actions']) => {
    if (!actions) return null;
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => handleAction(action.action)}
            className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            {action.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((message) => {
            const isScenario = message.type && ['analysis', 'wo', 'checklist', 'history', 'plan', 'simulation'].includes(message.type);

            return (
              <div
                key={message.id}
                className={cn('flex gap-3', message.sender === 'user' && 'flex-row-reverse')}
              >
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                    message.sender === 'ai' ? 'bg-primary' : 'bg-secondary'
                  )}
                >
                  {message.sender === 'ai' ? (
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <User className="h-5 w-5 text-secondary-foreground" />
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[80%] rounded-xl border p-4',
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground border-primary'
                      : isScenario
                        ? getScenarioBgClass(message.type)
                        : 'bg-card border-border'
                  )}
                >
                  {/* 시나리오 타입 헤더 */}
                  {isScenario && (
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-current/10">
                      {getScenarioIcon(message.type)}
                      <span className="text-xs font-medium uppercase tracking-wide opacity-70">
                        {message.type === 'analysis' && '이상 분석'}
                        {message.type === 'wo' && '작업지시서'}
                        {message.type === 'checklist' && '점검일지'}
                        {message.type === 'history' && '이력 조회'}
                        {message.type === 'plan' && '점검 계획'}
                        {message.type === 'simulation' && '시뮬레이션'}
                      </span>
                    </div>
                  )}

                  {/* 본문 */}
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>

                  {/* 테이블 */}
                  {message.type === 'table' && renderTable(message.tableData)}

                  {/* 알람 */}
                  {message.type === 'alarm' && renderAlarms(message.alarms)}

                  {/* 액션 버튼 */}
                  {renderActions(message.actions)}

                  {/* 타임스탬프 */}
                  <p
                    className={cn(
                      'mt-2 text-xs',
                      message.sender === 'ai' ? 'text-muted-foreground' : 'text-primary-foreground/70'
                    )}
                  >
                    {message.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-muted-foreground">분석 중...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Questions */}
      <div className="border-t border-border bg-card/50 p-4">
        <div className="mx-auto max-w-3xl">
          <p className="mb-2 text-xs text-muted-foreground">빠른 질문</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q.id}
                onClick={() => handleSend(q.query)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:bg-secondary transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-3">
            <div className="relative flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                rows={1}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
                input.trim()
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
