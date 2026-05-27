/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Send, MessageSquare, ArrowRight, CornerDownRight } from 'lucide-react';

interface QnaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; dept: string; id: string } | null;
  onAddLog: (log: string) => void;
}

interface Thread {
  id: string;
  category: string;
  question: string;
  answer: string | null;
  date: string;
}

export default function QnaModal({ isOpen, onClose, currentUser, onAddLog }: QnaModalProps) {
  const [category, setCategory] = useState('학사행정');
  const [questionText, setQuestionText] = useState('');
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: 'q1',
      category: '장학혜택',
      question: '국가장학금 II유형 통장 미등록 시 어지합니까?',
      answer: '안녕하세요, 장학팀입니다. 포털 시스템에 본인 명의 계좌 미등록 상태 시 자동 보류됩니다. [종합정보]->[학생계좌정보]메뉴에 5월 27일까지 미기입 시 다음 주 지급 회차로 이월되니 기한 내 등록 완료를 당부드립니다.',
      date: '2026.05.26',
    },
    {
      id: 'q2',
      category: '주차/방문관리',
      question: '이번 주말 정문 주차 차단기 교체공사 중 시험 이용 차량은 어떻게 진입하나요?',
      answer: '안녕하세요, 총무처입니다. 주차시스템 고도화 기간(5.25~5.26) 동안 정문 차량 진입은 완전히 차단됩니다. 우암마을 및 새천년관 방면 진입을 원하실 경우 서문 또는 후문 임시 우회 차단기를 사용하여 주시기 바랍니다. 경비실 수하 승인을 덧씌워 유료 주차권은 임시 무료 처리됩니다.',
      date: '2026.05.25'
    }
  ]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      alert('질문 내용을 성실히 기재해 주세요.');
      return;
    }

    const newId = `q_user_${Date.now()}`;
    const newThread: Thread = {
      id: newId,
      category,
      question: questionText,
      answer: null, // Simulated response will occur in 2.5 seconds!
      date: '2026.05.27',
    };

    setThreads(prev => [newThread, ...prev]);
    const currentQ = questionText;
    setQuestionText('');
    onAddLog(`스마트 Q&A 민원 제출: [${category}] - "${currentQ.slice(0, 15)}..."`);

    // Dynamic simulated response from university officer!
    setTimeout(() => {
      setThreads(prev => prev.map(t => {
        if (t.id === newId) {
          let ansText = '인성 행정 도우미입니다. 기재해주신 민원 안건을 무사히 접수하였으며 관련 연계 분과(학사/장학/기획행정실) 과장님께 즉시 이송하여 빠른 시일 내에 연계 전산 조치 조율 예정해드립니다.';
          if (category === '학사행정') {
            ansText = `안녕하십니까, 학사지원처 원격 헬프 데스크입니다. 기말고사 추가 인정서 또는 공결 사유를 제출하시려면 본인 학과 사무실 메일 계정에 학부장 승인이 도식된 문서를 첨부하여 6월 8일 전까지 필히 마감하셔야 함을 전해 올립니다.`;
          } else if (category === '장학혜택') {
            ansText = `반갑습니다, 장학지원실입니다. 하반기 2학기 국가장학금 1차 신청서는 가구원 정보 동의 제공서가 동봉되어야 재단 연계가 성사됩니다. 미완료 시 미등록 학업 결손 사유 장학금에 포함되지 않으므로 유념바랍니다.`;
          } else if (category === '주차/방문관리') {
            ansText = `안녕하십니까, 총무과 주차관리 담당자입니다. 교대 스마트 주차 패스 정기 바이트 카드는 종합정보시스템 차량 증명서를 지참 후 학생회관 지하 총무처로 예방하셔야 정식 결재가 나옵니다.`;
          }
          return {
            ...t,
            answer: ansText
          };
        }
        return t;
      }));
      onAddLog(`[${category}] 헬프 데스크에서 실시간 민원에 대한 세부 답변이 등록되었습니다.`);
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-905/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-850 shadow-2xl z-10 flex flex-col max-h-[90vh]"
          >
            {/* Header banner */}
            <div className="bg-gradient-to-r from-[#002155] to-[#003580] p-6 text-white flex justify-between items-start shrink-0">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-[#fec73b]" />
                <div>
                  <h3 className="font-bold text-base tracking-tight">우암 헬프 데스크 Q&A 통합 민원</h3>
                  <p className="text-[10px] text-white/70 font-sans">Cheongju Hotline Integrated Board</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 text-white rounded-full transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content area */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh] scrollbar-thin">
              
              {/* Form block */}
              <form onSubmit={handleSubmit} className="p-4 bg-neutral-50 dark:bg-zinc-800/40 rounded-2xl border border-neutral-200/50 space-y-4">
                <p className="text-xs font-bold text-neutral-600 dark:text-zinc-300">새 민원/질문 제출하기</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 block">선택 카테고리</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-zinc-800 p-2.5 rounded-xl border border-neutral-200 focus:outline-none"
                    >
                      <option>학사행정</option>
                      <option>장학혜택</option>
                      <option>주차/방문관리</option>
                      <option>IT/종합 데이터센터</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 block">제출 신원</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser ? `${currentUser.name} (${currentUser.dept.slice(0, 9)})` : '익명 외부인'}
                      className="w-full text-xs bg-neutral-100 dark:bg-zinc-800 p-2.5 rounded-xl border border-neutral-200 text-neutral-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 block">민원 문의 및 제안 내용</label>
                  <textarea
                    rows={2}
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="장학 계좌 변경, 편의점 및 수강 인원 건의 등 안건을 상세히 기재해 주십시오."
                    className="w-full p-3 text-xs bg-white dark:bg-zinc-800 rounded-xl border border-neutral-250 focus:outline-none focus:ring-1.5 focus:ring-[#002155] focus:border-transparent resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#002155] hover:bg-[#003580] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm hover:translate-y-[-0.5px]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>스마트 기입 전산 전송</span>
                </button>
              </form>

              {/* Dynamic Answer threads listing */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-neutral-500 flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  <span>내 민원 접수 및 실시간 답변 현황 ({threads.length})</span>
                </h4>

                <div className="space-y-3.5">
                  {threads.map((t) => (
                    <div 
                      key={t.id} 
                      className="p-4 bg-white dark:bg-zinc-950 border border-neutral-150 dark:border-zinc-805 rounded-2xl shadow-xs space-y-3"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-[#002155] bg-[#002155]/5 px-2 py-0.5 rounded">
                          {t.category}
                        </span>
                        <span className="text-neutral-400 font-mono">{t.date}</span>
                      </div>

                      <p className="text-xs font-bold text-neutral-800 dark:text-zinc-150 leading-relaxed">
                        Q. {t.question}
                      </p>

                      {/* Animated/simulated officer replies */}
                      {t.answer ? (
                        <div className="bg-[#fbf9f8] dark:bg-zinc-900 p-3 rounded-xl border border-neutral-100 dark:border-zinc-805 flex gap-2 items-start">
                          <CornerDownRight className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-emerald-600">청주대 원격 행정 지원팀 답신</p>
                            <p className="text-xs text-neutral-600 dark:text-zinc-350 leading-normal">
                              {t.answer}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-neutral-50 dark:bg-zinc-900 rounded-xl border border-dashed border-neutral-200 text-center">
                          <span className="inline-block w-2 h-2 bg-amber-400 rounded-full animate-pulse mr-1.5" />
                          <span className="text-[10px] text-amber-500 font-bold">담당자 매칭 및 실시간 분석 답신 조율 중 (약 3초 배진)...</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom info banner */}
            <div className="bg-neutral-50 dark:bg-zinc-900 p-4 border-t border-neutral-100 text-center text-[10px] text-neutral-400 shrink-0">
              * 포털 내부 위변조 방지 블록체인 전자기록 보관이 진행 중입니다.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
