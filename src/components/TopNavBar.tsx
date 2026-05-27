/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Search, Menu, X, User, Bell, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TopNavBarProps {
  currentTab: 'campus' | 'notices';
  setTab: (tab: 'campus' | 'notices') => void;
  currentUser: { name: string; dept: string; id: string } | null;
  onOpenLogin: () => void;
  onOpenQnas: () => void;
  onOpenCalendar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddLog: (log: string) => void;
}

export default function TopNavBar({
  currentTab,
  setTab,
  currentUser,
  onOpenLogin,
  onOpenQnas,
  onOpenCalendar,
  searchQuery,
  setSearchQuery,
  onAddLog,
}: TopNavBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deptDropdownOpen, setDeptDropdownOpen] = useState(false);

  const handleTabChange = (tab: 'campus' | 'notices') => {
    setTab(tab);
    setMobileMenuOpen(false);
    onAddLog(`주요 탭을 [${tab === 'campus' ? '캠퍼스 라이프' : '공지사항 & 최신뉴스'}]로 전환하였습니다.`);
  };

  const handleMockClick = (label: string) => {
    onAddLog(`[${label}] 메뉴는 기획 설계에 포함되어 있으며, 차세대 시스템 오픈 시 연결 예정입니다.`);
    alert(`[${label}] 안내 서비스는 준비 중입니다. 현재 캠퍼스 라이프 가이드와 공지사항 통합 조회가 정상 오픈되어 있습니다.`);
  };

  const testDepts = [
    '이공대학 (소프트웨어융합, 토목, 나노)',
    '예술대학 (연극영화, 사진영상, 현대디자인)',
    '경상대학 (경영학과, 회계정보학과)',
    '법과대학 (법학부, 경찰행정학)',
    '보건의료대학 (보건행정, 간호학과, 제약공학)'
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-zinc-900/80 transition-all">
      <div className="flex justify-between items-center px-4 md:px-8 py-3.5 max-w-7xl mx-auto">
        
        {/* Logo and Nav links */}
        <div className="flex items-center gap-10">
          {/* Mobile Logo or Left side bar logo placeholder */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleTabChange('campus')}>
            <span className="lg:hidden w-8 h-8 bg-[#002155] text-white rounded-lg flex items-center justify-center font-bold text-xs">
              CJU
            </span>
            <span className="font-bold text-[#002155] dark:text-[#7fa1f2] md:text-lg tracking-tight">
              청주대학교
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => handleMockClick('입학안내')}
              className="font-notoSans text-xs font-semibold text-neutral-500 hover:text-[#002155] dark:hover:text-zinc-100 transition-colors"
            >
              입학안내
            </button>

            <button
              onClick={() => handleTabChange('campus')}
              className={`font-notoSans text-xs font-bold transition-all relative py-1 ${
                currentTab === 'campus'
                  ? 'text-[#002155] dark:text-[#7fa1f2]'
                  : 'text-neutral-500 hover:text-[#002155]'
              }`}
            >
              캠퍼스 라이프
              {currentTab === 'campus' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#fec73b] rounded-full"
                />
              )}
            </button>

            <button
              onClick={() => handleTabChange('notices')}
              className={`font-notoSans text-xs font-bold transition-all relative py-1 ${
                currentTab === 'notices'
                  ? 'text-[#002155] dark:text-[#7fa1f2]'
                  : 'text-neutral-500 hover:text-[#002155]'
              }`}
            >
              공지사항 & 뉴스
              {currentTab === 'notices' && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[#fec73b] rounded-full"
                />
              )}
            </button>

            {/* Simulated interactive department hover */}
            <div className="relative">
              <button
                onClick={() => setDeptDropdownOpen(!deptDropdownOpen)}
                className="font-notoSans text-xs font-semibold text-neutral-500 hover:text-[#002155] flex items-center gap-1"
              >
                <span>학과소개</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {deptDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDeptDropdownOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-neutral-150 dark:border-zinc-805 rounded-xl shadow-xl z-50 p-2 text-xs"
                    >
                      <p className="font-bold text-neutral-400 p-2 uppercase tracking-wider text-[10px]">단과대학 바로가기</p>
                      {testDepts.map((d, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setDeptDropdownOpen(false);
                            onAddLog(`[${d}] 학부 조회 가상 요청.`);
                            alert(`[${d}] 상세 페이지 이동 시뮬레이션: 청주대 특성화 전공입니다.`);
                          }}
                          className="w-full text-left p-2 hover:bg-neutral-50 dark:hover:bg-zinc-800 rounded-lg text-neutral-700 dark:text-zinc-200 truncate"
                        >
                          {d}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => handleMockClick('대학소개')}
              className="font-notoSans text-xs font-semibold text-neutral-500 hover:text-[#002155] transition-colors"
            >
              대학소개
            </button>
          </nav>
        </div>

        {/* Global Search and Login Action */}
        <div className="flex items-center gap-3">
          {/* Clean Academic Search Bar */}
          <div className="relative hidden sm:block w-48 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-neutral-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색어를 입력하세요..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f5f3f3] dark:bg-zinc-900 border border-transparent hover:border-neutral-300 focus:outline-none focus:ring-1.5 focus:ring-[#002155] focus:bg-white focus:border-transparent transition-all rounded-full text-neutral-800 dark:text-zinc-100"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 font-bold text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* User notification bell badge */}
          {currentUser && (
            <div className="relative p-2 text-neutral-600 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-full cursor-pointer">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#fec73b] rounded-full" />
              <Bell className="w-4 h-4" />
            </div>
          )}

          {/* Action Trigger Button */}
          {currentUser ? (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#fbf9f8] dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-xl">
              <User className="w-3.5  text-[#002155] dark:text-zinc-300" />
              <span className="text-[11px] font-bold text-neutral-600 dark:text-zinc-300">
                {currentUser.name}
              </span>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-xs font-bold text-[#002155] hover:bg-[#002155]/10 active:scale-95 transition-all outline outline-1.5 outline-[#002155]/30 focus:outline-none rounded-xl cursor-pointer"
            >
              포털 로그인
            </button>
          )}

          {/* Mobile hamburger trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-600 dark:text-zinc-300 rounded-lg cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Slide-down */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t border-neutral-100 p-4 space-y-4 shadow-inner"
          >
            {/* Mobile search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="검색어를 입력해보세요 (예: 장학)"
                className="w-full pl-9 pr-3 py-2 bg-neutral-100 border-none rounded-xl text-xs focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <button
                onClick={() => handleTabChange('campus')}
                className={`p-3 rounded-xl font-bold ${
                  currentTab === 'campus' ? 'bg-[#002155] text-white' : 'bg-neutral-50 text-neutral-600'
                }`}
              >
                캠퍼스 라이프
              </button>
              <button
                onClick={() => handleTabChange('notices')}
                className={`p-3 rounded-xl font-bold ${
                  currentTab === 'notices' ? 'bg-[#002155] text-white' : 'bg-neutral-50 text-neutral-600'
                }`}
              >
                공지사항 & 뉴스
              </button>
            </div>

            <div className="space-y-1 pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCalendar();
                }}
                className="w-full text-left p-2.5 text-xs text-neutral-600 hover:bg-neutral-50 rounded-lg flex items-center justify-between"
              >
                <span>학사일정 캘린더</span>
                <span className="text-[10px] text-[#ef8d15] font-semibold bg-[#ef8d15]/10 px-2 py-0.5 rounded-md">조회</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQnas();
                }}
                className="w-full text-left p-2.5 text-xs text-neutral-600 hover:bg-neutral-50 rounded-lg flex items-center justify-between"
              >
                <span>헬퍼 시스템 및 민원 Q&A</span>
                <span className="text-[10px] text-[#e5b124] font-semibold bg-[#e5b124]/10 px-2 py-0.5 rounded-md">신청</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleMockClick('입학안내');
                }}
                className="w-full text-left p-2.5 text-xs text-neutral-600 hover:bg-neutral-50 rounded-lg"
              >
                입학안내 가이드
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleMockClick('대학소개');
                }}
                className="w-full text-left p-2.5 text-xs text-neutral-600 hover:bg-neutral-50 rounded-lg"
              >
                대학소개 브로셔
              </button>
            </div>

            {currentUser ? (
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                <p className="text-[11px] font-bold text-neutral-800">{currentUser.name}</p>
                <p className="text-[10px] text-neutral-500">{currentUser.dept}</p>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-3 bg-[#002155] text-white font-bold text-xs rounded-xl"
              >
                로그인하기
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
