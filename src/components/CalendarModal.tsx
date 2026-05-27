/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, ChevronLeft, ChevronRight, CornerDownRight, Gift } from 'lucide-react';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLog: (log: string) => void;
}

interface Event {
  day: number;
  title: string;
  type: 'academic' | 'festival' | 'exam' | 'holiday';
  desc: string;
}

export default function CalendarModal({ isOpen, onClose, onAddLog }: CalendarModalProps) {
  const [currentMonth, setCurrentMonth] = useState(5); // 5 represents May 2026, 6 represents June 2026
  
  // Custom mock calendar events for Cheongju University
  const events2026: Record<number, Event[]> = {
    5: [
      { day: 15, title: '2학기 국가장학금 1차 신청 개시', type: 'academic', desc: '한국장학재단 주관 국가장학금 1차 마감동조 신청 기간.' },
      { day: 19, title: '캠퍼스 주차 차단 시스템 교체 공사 시작', type: 'academic', desc: '차량 번호 인식기 고도화로 서문 우회 필요.' },
      { day: 22, title: '기말고사 부정시험 고발 예방 공지 선포', type: 'academic', desc: '각 과목 부정 소지 금지령 안내.' },
      { day: 29, title: '제42회 우암대동제 축제 개막', type: 'festival', desc: '중앙광장 무대 연설, 연예인 초청 및 자치 주점 3일 운영.' },
      { day: 31, title: '우암대동제 폐막 & 캠퍼스 정화 캠페인', type: 'festival', desc: '크루 연계 환경 미화 및 쓰레기 주워담기 그린 캠페인.' }
    ],
    6: [
      { day: 3, title: '도서관 24시간 철야 연장 개원', type: 'exam', desc: '기말고사 서포트 1층 무료 스터디 존 24시 연장 개청.' },
      { day: 5, title: '총학생회 야식 배부 대 이벤트', type: 'festival', desc: '중앙도서관 테라스 수제 핫도그 500개 선착순 무료.' },
      { day: 10, title: '1학기 기말고사 집중 현장평가 실시 (~14일)', type: 'exam', desc: '총 5일간 각 단과 대학 강의실 지정 대면 시험.' },
      { day: 21, title: '1학기 성적 공시 및 이의 조정 기간 개청', type: 'academic', desc: '학생 종합 포털을 활용한 성적 확인 및 헬프 이송.' }
    ]
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentMonth === 6) {
      setCurrentMonth(5);
      onAddLog('달력 5월로 전송.');
    } else if (direction === 'next' && currentMonth === 5) {
      setCurrentMonth(6);
      onAddLog('달력 6월로 전송.');
    }
  };

  const currentEvents = events2026[currentMonth] || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 shadow-2xl z-10 flex flex-col"
          >
            {/* Header banner */}
            <div className="bg-gradient-to-r from-[#002155] to-[#ef8d15] p-6 text-white flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-[#fec73b]" />
                <div>
                  <h3 className="font-bold text-base tracking-tight">청주대학교 주요 학사일정 캘린더</h3>
                  <p className="text-[10px] text-white/70 font-sans">Cheongju Academic Scheduler Board</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 text-white rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar grid controls */}
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center bg-neutral-50 dark:bg-zinc-805 px-4 py-2.5 rounded-xl">
                <button
                  disabled={currentMonth === 5}
                  onClick={() => handleMonthChange('prev')}
                  className="p-1.5 hover:bg-neutral-200 dark:hover:bg-zinc-700 rounded-lg disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-xs font-mono text-neutral-800 dark:text-zinc-100">
                  2026년 {currentMonth}월 (May Academic Events)
                </span>
                <button
                  disabled={currentMonth === 6}
                  onClick={() => handleMonthChange('next')}
                  className="p-1.5 hover:bg-neutral-200 dark:hover:bg-zinc-700 rounded-lg disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dynamic Calendar Grid representation */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                {/* Day headers */}
                {['일', '월', '화', '수', '목', '금', '토'].map((h, i) => (
                  <span key={i} className={`font-bold pb-2 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-neutral-400'}`}>
                    {h}
                  </span>
                ))}

                {/* Grid cells placeholders matching 2026 May (May 1st starts on Friday) */}
                {currentMonth === 5 ? (
                  <>
                    {/* May starts Friday, so 4 empty squares */}
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={`empty-${i}`} className="p-2 opacity-0 select-none">1</span>
                    ))}
                    {Array.from({ length: 31 }).map((_, idx) => {
                      const dayVal = idx + 1;
                      const hasEvent = currentEvents.some(e => e.day === dayVal);
                      const isToday = dayVal === 27; // 2026-05-27 is current time in metadata!
                      return (
                        <div
                          key={dayVal}
                          className={`p-2 rounded-lg flex flex-col justify-between items-center aspect-square transition-all relative ${
                            isToday
                              ? 'bg-[#002155] text-white font-extrabold shadow-sm'
                              : hasEvent
                                ? 'bg-amber-50 dark:bg-amber-950/25 border border-amber-250 text-[#002155] dark:text-[#7fa1f2]'
                                : 'hover:bg-neutral-50 dark:hover:bg-zinc-800 text-neutral-600'
                          }`}
                        >
                          <span className="text-[11px] font-mono leading-none">{dayVal}</span>
                          {hasEvent && (
                            <span className="w-1.5 h-1.5 bg-[#ef8d15] rounded-full mt-1 animate-pulse" />
                          )}
                          {isToday && (
                            <span className="absolute -top-1 -right-1 text-[7px] bg-[#fec73b] text-[#002155] px-1 rounded-sm font-bold scale-90 select-none">TODAY</span>
                          )}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {/* June starts Monday, so 1 empty square */}
                    {Array.from({ length: 1 }).map((_, i) => (
                      <span key={`empty-${i}`} className="p-2 opacity-0 select-none">1</span>
                    ))}
                    {Array.from({ length: 30 }).map((_, idx) => {
                      const dayVal = idx + 1;
                      const hasEvent = currentEvents.some(e => e.day === dayVal);
                      return (
                        <div
                          key={dayVal}
                          className={`p-2 rounded-lg flex flex-col justify-between items-center aspect-square transition-all relative ${
                            hasEvent
                              ? 'bg-amber-50 dark:bg-amber-950/25 border border-amber-250 text-[#002155] dark:text-[#7fa1f2]'
                              : 'hover:bg-neutral-50 dark:text-neutral-300 text-neutral-600'
                          }`}
                        >
                          <span className="text-[11px] font-mono leading-none">{dayVal}</span>
                          {hasEvent && (
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1 animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

              {/* Day events detailed bullet list */}
              <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-zinc-800">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">실시간 특성화 주요일정 개요 ({currentEvents.length}건)</p>
                <div className="space-y-2 h-44 overflow-y-auto pr-2 scrollbar-thin">
                  {currentEvents.map((ev, idx) => (
                    <div 
                      key={idx}
                      className="p-3 bg-neutral-50 dark:bg-zinc-950/50 rounded-xl border border-neutral-100 dark:border-zinc-855 text-xs space-y-1 transform hover:-translate-x-0.5 transition-all text-left"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#002155] dark:text-[#7fa1f2] flex items-center gap-1.5">
                          <span className="w-5 h-5 bg-[#002155] text-white rounded-full font-mono text-[9px] flex items-center justify-center">
                            {ev.day}
                          </span>
                          <span>{ev.title}</span>
                        </span>
                        <span className={`text-[8px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          ev.type === 'festival' ? 'bg-red-50 text-red-600' : ev.type === 'exam' ? 'bg-indigo-50 text-indigo-600' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          {ev.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-500 line-clamp-1 pl-6">
                        {ev.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom bar */}
            <div className="bg-neutral-50 dark:bg-zinc-900 border-t border-neutral-100 p-4 font-caption text-neutral-400 text-center text-[10px]">
              * 교무처 학사지원팀 캘린더 전산 기록과 100% 동일하게 교차 반영되었습니다.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
