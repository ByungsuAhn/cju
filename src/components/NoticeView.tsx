/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Megaphone, Search, Eye, Calendar, User, 
  ChevronRight, ArrowUpRight, Award, ChevronLeft,
  ChevronRightSquare, MessageSquare, ArrowRight, HelpCircle
} from 'lucide-react';
import { Notice } from '../types';

interface NoticeViewProps {
  notices: Notice[];
  onOpenNotice: (notice: Notice) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenQnas: () => void;
  onAddLog: (log: string) => void;
}

export default function NoticeView({
  notices,
  onOpenNotice,
  searchQuery,
  setSearchQuery,
  onOpenQnas,
  onAddLog,
}: NoticeViewProps) {
  // Local states
  const [selectedCategory, setSelectedCategory] = useState<'전체' | '학사' | '취업' | '일반' | '장학'>('전체');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter notices based on category tabs & search text
  const filteredNotices = notices.filter(n => {
    const categoryMatch = selectedCategory === '전체' || n.category === selectedCategory;
    const searchMatch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.author.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Simple Pagination config (e.g., 5 items per page)
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotices = filteredNotices.slice(startIndex, startIndex + itemsPerPage);

  // Triggering tabs
  const handleCategorySelect = (cat: '전체' | '학사' | '취업' | '일반' | '장학') => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    onAddLog(`공지사항 분류 전환: [${cat}]`);
  };

  // Mock items as shown exactly in Screen 2:
  const todaysPick = {
    title: '학생회관 리모델링 공사 및 소음 동반 안내',
    summary: '편의시설 및 학생 쉼터 휴게 인프라 강화를 위해 학생회관 2층 리모델링 종합 토목 공사가 6월 초까지 개시될 예정이오니 통행 시 정밀 유념바랍니다.',
    date: '자료실 점검연계',
  };

  const urgentSystemCheck = {
    title: '긴급: 차세대 수강신청 시스템 안전 서버점검',
    summary: '안정적인 2학기 예비수강을 담보하고자 금일 오후 23:00부터 익일 새벽 02:00까지 교내 데이터센터 시스템 정밀 전산 점검이 전격 단행됩니다.',
  };

  // Featured Hero Notice in Screen 2
  // We can pick notice id 'n7' which represents "글로벌 리더십 선발"
  const featuredStory = notices.find(n => n.id === 'n7') || notices[4];

  return (
    <div className="space-y-12 pb-20 animate-fade-in font-notoSans bg-[#fbf9f8] text-[#1b1c1c] dark:bg-[#121212] dark:text-zinc-100">
      
      {/* 1. Header Path Indicator Block */}
      <section className="bg-white dark:bg-zinc-900 border-b border-neutral-150 p-8 rounded-b-3xl shadow-xs">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#002155] dark:text-[#7fa1f2]">
            <span>홈</span>
            <ChevronRight className="w-3" />
            <span>뉴스 & 공지사항</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">CJU 뉴스 & 통합 공지사항</h2>
          <p className="text-xs text-neutral-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            청주대학교의 최신 뉴스, 공식 학사 정보 수혜 혜택을 단 번에 확인하세요. 격동하는 미래 인재 육성 프로젝트의 심안을 전해 드립니다.
          </p>
        </div>
      </section>

      {/* 2. Top Grid Layout (Featured Story + Today's Pick Card inside Screen 2) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Featured Story Column (Col span-7) */}
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">FEATURED JOURNAL</h3>
            
            {featuredStory && (
              <div 
                onClick={() => {
                  onOpenNotice(featuredStory);
                  onAddLog('Featured Story 원본 열람.');
                }}
                className="group cursor-pointer bg-white dark:bg-zinc-905 overflow-hidden rounded-3xl border border-neutral-200/50 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="h-64 sm:h-80 relative overflow-hidden">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    alt="Cheongju Global Leadership Programme"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlwkoQq28w-SYdb1-4pe_57Le7A6-jiYVt3AnuGez8f5YFTBuvvIeB6fCnQ52vtUFarkH7oHaWGSochXWeOmlNEqccsyTnbVpE78tUf-4ijiKWBMxM4NfMNk5AlUek39m_JhfFj0orJNCTP4ywYaBv5DNlygtwMWKzhIfRw-gOaZof-86Za0ta_0mxTnKSJCZFFd69RCfqd3dHmVDgKE-zmqVE8FiQELQxkJ75LRBefXonWjfLAYKNWXke9qUEeWRb7HTrsIujDtY0"
                  />
                  <div className="absolute top-4 left-4 bg-[#fec73b] text-[#002155] font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-md shadow-sm">
                    FEATURED STORY
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{featuredStory.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>조회수 {featuredStory.views}</span>
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-[#002155] dark:text-[#7fa1f2]">이슈 가이드</span>
                  </div>

                  <h4 className="font-bold text-lg text-[#002155] dark:text-[#7fa1f2] tracking-tight group-hover:underline leading-snug">
                    {featuredStory.title}
                  </h4>

                  <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                    {featuredStory.summary}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-neutral-400">
                    <span>담당처: {featuredStory.author}</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                      <span>자세히 보기</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Quick Alerts Column (Col span-4) */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest block">TODAY'S FLASH</h3>
              
              {/* Today's Pick Card */}
              <div 
                onClick={() => {
                  onAddLog('학생회관 리모델링 안내 팝업 유도.');
                  alert(`[${todaysPick.title}]\n\n본 공사는 학생 편의 증대를 공치하고자 진행되는 리뉴얼 사업입니다. 소음이 다소 수반되오니 너른 격양 부탁드립니다.\n문의: 총무처 관재과`);
                }}
                className="group cursor-pointer p-6 bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-800 rounded-3xl shadow-xs hover:border-[#fec73b] transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] bg-neutral-100 text-[#002155] font-bold px-2 py-0.5 rounded">
                    Today's Pick
                  </span>
                  <span className="text-[9px] text-[#ef8d15] font-semibold">공사 안내</span>
                </div>
                <h4 className="font-bold text-xs text-neutral-800 dark:text-zinc-150 line-clamp-1 group-hover:underline">
                  {todaysPick.title}
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-zinc-400 leading-relaxed mt-2 line-clamp-3">
                  {todaysPick.summary}
                </p>
              </div>

              {/* Navy Alert Megaphone Card */}
              <div 
                onClick={() => {
                  onAddLog('긴급점검 수강신청 가상 세부 팝업.');
                  alert(`[${urgentSystemCheck.title}]\n\n일동: 금일 23:00 ~ 익일 02:00\n본 전산 점검 중 종합전산망 접속이 일시 차단될 수 있습니다. 과목 저장 유의를 부탁드립니다.`);
                }}
                className="group cursor-pointer p-6 bg-gradient-to-br from-[#002155] to-[#003580] text-white rounded-3xl shadow-md space-y-2 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-[#fec73b] animate-bounce" />
                  <span className="text-[10px] font-bold tracking-widest text-[#fec73b]">긴급 안내</span>
                </div>
                <h4 className="font-bold text-xs text-white line-clamp-1">
                  {urgentSystemCheck.title}
                </h4>
                <p className="text-[10px] text-white/85 leading-normal line-clamp-3">
                  {urgentSystemCheck.summary}
                </p>
              </div>
            </div>

            {/* Assistance Q&A Widget inside Sidebar matching Screen 2 */}
            <div className="bg-[#002155]/5 border border-dashed border-[#002155]/20 p-6 rounded-3xl mt-4">
              <HelpCircle className="w-7 h-7 text-[#002155] dark:text-[#7fa1f2] mb-3" />
              <h4 className="font-bold text-xs">학교행정 도움이 필요합니까?</h4>
              <p className="text-[10px] text-neutral-500 dark:text-zinc-400 mt-1 leading-relaxed">
                각종 교내 복지, 성적 처리 이의 및 입학 장학 정보 등 민원을 즉각 회부하여 답신을 확인해보세요.
              </p>
              <button
                onClick={onOpenQnas}
                className="mt-4 w-full py-2 bg-[#002155] text-white hover:bg-[#003580] transition-colors text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Q&A 바로가기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Filterable Notice board List (Matches Screen 2 lower component precisely!) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        
        {/* News header indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200/70 pb-4 gap-4">
          <div className="flex flex-wrap gap-2">
            {(['전체', '학사', '취업', '일반', '장학'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#002155] text-white'
                    : 'bg-white dark:bg-zinc-900 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-zinc-805 border border-neutral-200/50 dark:border-zinc-800'
                }`}
              >
                {cat === '전체' ? '전체보기' : `${cat}공지`}
              </button>
            ))}
          </div>

          <span className="text-xs text-neutral-450 font-bold tracking-tight">
            총 <span className="text-[#002155] dark:text-[#7fa1f2] font-mono">{filteredNotices.length}</span>건의 게시물
          </span>
        </div>

        {/* Notices list column stack */}
        <div className="divide-y divide-neutral-200/50 dark:divide-zinc-850 bg-white dark:bg-zinc-900 p-2 rounded-3xl border border-neutral-200/55 dark:border-zinc-800 shadow-xs">
          {paginatedNotices.length > 0 ? (
            paginatedNotices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => {
                  onOpenNotice(notice);
                  onAddLog(`게시물 [${notice.title}] 선택.`);
                }}
                className="group cursor-pointer p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-neutral-50 dark:hover:bg-zinc-850/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
              >
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                      notice.category === '중요'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                        : notice.category === '학사'
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                          : notice.category === '취업'
                            ? 'bg-emerald-50 text-emerald-600'
                            : notice.category === '장학'
                              ? 'bg-purple-50 text-purple-600'
                              : 'bg-neutral-100 text-neutral-600'
                    }`}>
                      {notice.category}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">{notice.date}</span>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-neutral-800 dark:text-zinc-150 line-clamp-1 group-hover:text-[#002155] dark:group-hover:text-[#7fa1f2] transition-colors leading-snug">
                    {notice.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">
                    {notice.summary}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-4 text-[11px] text-neutral-400">
                  <span className="font-semibold">{notice.author}</span>
                  <span className="font-mono">조회 {notice.views}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-xs text-neutral-400 italic">
              * 기재된 검색 요건 또는 해당 카테고리에 알맞은 공지물이 존재하지 않습니다.
            </div>
          )}
        </div>

        {/* Beautiful Pagination (Matches exactly Screen 2 pagination controls!) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-1.5 pt-6 text-xs">
            {/* First */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-500 disabled:opacity-40 cursor-pointer"
            >
              |&lt;
            </button>
            {/* Prev */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1.5 border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-400 disabled:opacity-40 cursor-pointer"
            >
              &lt;
            </button>

            {/* Loop pages */}
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pIdx = idx + 1;
              return (
                <button
                  key={pIdx}
                  onClick={() => {
                    setCurrentPage(pIdx);
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  className={`w-8 h-8 font-semibold rounded-lg text-center cursor-pointer ${
                    currentPage === pIdx
                      ? 'bg-[#fec73b] text-[#002155] font-bold shadow-xs'
                      : 'hover:bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {pIdx}
                </button>
              );
            })}

            {/* Next */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-400 disabled:opacity-40 cursor-pointer"
            >
              &gt;
            </button>
            {/* Last */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1.5 border border-neutral-200 hover:bg-neutral-50 rounded-lg text-neutral-500 disabled:opacity-40 cursor-pointer"
            >
              &gt;|
            </button>
          </div>
        )}

      </section>

    </div>
  );
}
