/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Phone, Mail, HelpCircle, 
  Map, ExternalLink, ShieldCheck, HeartCrack, Globe, PlayCircle, Share2
} from 'lucide-react';

import SideNavBar from './components/SideNavBar';
import TopNavBar from './components/TopNavBar';
import CampusLifeView from './components/CampusLifeView';
import NoticeView from './components/NoticeView';
import LoginModal from './components/LoginModal';
import NoticeDetailModal from './components/NoticeDetailModal';
import QnaModal from './components/QnaModal';
import CalendarModal from './components/CalendarModal';

import { INITIAL_NOTICES } from './data';
import { Notice } from './types';

export default function App() {
  // Global React state
  const [currentTab, setTab] = useState<'campus' | 'notices'>('campus');
  const [currentRole, setRole] = useState<'student' | 'faculty' | 'visitor' | 'none'>('student');
  const [currentUser, setCurrentUser] = useState<{ name: string; dept: string; id: string } | null>(null);
  
  // Search parameters
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [noticeDetailMsg, setNoticeDetailMsg] = useState<Notice | null>(null);
  const [qnaModalOpen, setQnaModalOpen] = useState(false);
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);

  // Hidden logger for traceability (satisfies guidelines of not polluting screen with telemetry logs)
  const [loggerState, setLoggerState] = useState<string[]>(['청주대 캠퍼스 플랫폼 초기 부팅 완료.']);

  const addLog = (msg: string) => {
    console.log(`[CJU Portal Log] ${msg}`);
    setLoggerState(prev => [...prev, `${new Date().toLocaleTimeString()} - ${msg}`]);
  };

  // Profile triggers
  const handleLogout = () => {
    if (currentUser) {
      addLog(`[로그아웃] ${currentUser.name} 학우님의 보안 세션이 종료되었습니다.`);
      setCurrentUser(null);
    }
  };

  const handleLoginSuccess = (name: string, dept: string, id: string) => {
    setCurrentUser({ name, dept, id });
    addLog(`[로그인 성공] ${name} 학우님 환영합니다! 가맹 전산망이 동기화되었습니다.`);
    alert(`${name}님, 청주대 통합포털 로그인을 승인합니다.\n소속: ${dept}\n학번: ${id}`);
  };

  // Page smooth scrolling helper
  const scrollToSection = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      addLog(`세션 페이지 이동: ${selector}`);
    } else {
      // If ofst tab, switch first
      setTab('campus');
      setTimeout(() => {
        const fallbackEl = document.querySelector(selector);
        fallbackEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8] text-[#1b1c1c] dark:bg-[#121212] dark:text-zinc-100 flex transition-colors duration-300 font-notoSans">
      
      {/* 1. Side Left Navigation (Desktop Only) */}
      <SideNavBar
        currentRole={currentRole}
        setRole={setRole}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenCalendar={() => setCalendarModalOpen(true)}
        onOpenQnas={() => setQnaModalOpen(true)}
        onAddLog={addLog}
        scrollToSection={scrollToSection}
      />

      {/* 2. Main content content area (pushed by 64px vertical sidebar on desktops) */}
      <div className="flex-grow lg:ml-64 flex flex-col min-h-screen justify-between relative">
        
        {/* Inside Main: Section top nav bar */}
        <TopNavBar
          currentTab={currentTab}
          setTab={setTab}
          currentUser={currentUser}
          onOpenLogin={() => setLoginModalOpen(true)}
          onOpenQnas={() => setQnaModalOpen(true)}
          onOpenCalendar={() => setCalendarModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddLog={addLog}
        />

        {/* Dynamic page routes render depending on tab selection */}
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            {currentTab === 'campus' ? (
              <motion.div
                key="campus-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <CampusLifeView
                  notices={INITIAL_NOTICES}
                  onOpenNotice={(notice) => setNoticeDetailMsg(notice)}
                  currentUser={currentUser}
                  onOpenLogin={() => setLoginModalOpen(true)}
                  setTab={setTab}
                  currentRole={currentRole}
                  setRole={setRole}
                  onAddLog={addLog}
                />
              </motion.div>
            ) : (
              <motion.div
                key="notice-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <NoticeView
                  notices={INITIAL_NOTICES}
                  onOpenNotice={(notice) => setNoticeDetailMsg(notice)}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onOpenQnas={() => setQnaModalOpen(true)}
                  onAddLog={addLog}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* 3. Global Premium Dark Footer (Matches Screen 1 and 2 visuals accurately) */}
        <footer className="bg-neutral-900 border-t border-neutral-800 text-white p-8 md:p-12 shrink-0">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 bg-[#002155] rounded-xl flex items-center justify-center font-bold text-sm border border-neutral-700">
                  CJU
                </span>
                <div>
                  <h4 className="font-bold text-sm tracking-wide text-zinc-100">CHEONGJU UNIVERSITY</h4>
                  <p className="text-[10px] text-neutral-400">대표 통합 전산 정보국</p>
                </div>
              </div>

              {/* Terms and Links details */}
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-neutral-450">
                <a href="#privacy" onClick={() => alert('개인정보처리방침에 서약된 암호화 법령에 의하여 안전히 보호 중입니다.')} className="hover:text-[#fec73b] hover:underline">개인정보처리방침</a>
                <a href="#no-email" onClick={() => alert('이메일무단수집을 엄격히 거부합니다. 위반 시 정보통신망법에 의해 처벌받을 수 있습니다.')} className="hover:text-[#fec73b] hover:underline">이메일무단수집거부</a>
                <a href="#directions" onClick={() => scrollToSection('#smart-pathfinder')} className="hover:text-[#fec73b] hover:underline">찾아오시는길</a>
                <a href="#campusmap" onClick={() => scrollToSection('#smart-pathfinder')} className="hover:text-[#fec73b] hover:underline">캠퍼스맵</a>
              </div>

              {/* Address detail strings */}
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                (28503) 충청북도 청주시 청원구 대성로 298 (내덕동) 청주대학교 <br />
                대표전화: <span className="font-semibold text-zinc-200">043-229-8114</span> / 팩스: <span className="text-zinc-200">043-229-8115</span>
              </p>
            </div>

            {/* Social shares and copyrights block */}
            <div className="flex flex-col md:items-end justify-between h-full space-y-6 md:space-y-0">
              <div className="flex gap-3">
                <a 
                  href="https://www.cju.ac.kr" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                  title="Official Website"
                >
                  <Globe className="w-5 h-5 text-neutral-300" />
                </a>
                <button 
                  onClick={() => alert('공식 YouTube 캠퍼스 홍보 영상 채널로 연계됩니다.')}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                  title="Official YouTube"
                >
                  <PlayCircle className="w-5 h-5 text-neutral-300" />
                </button>
                <button 
                  onClick={() => alert('포털 URL을 클립보드에 조속 복사했습니다!')}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                  title="Share Link"
                >
                  <Share2 className="w-5 h-5 text-neutral-300" />
                </button>
              </div>

              <div className="text-[11px] font-sans text-neutral-550 leading-none">
                © 2026 CHEONGJU UNIVERSITY. ALL RIGHTS RESERVED.
              </div>
            </div>

          </div>
        </footer>

      </div>

      {/* 4. Global Modals Overlay Panels */}
      
      {/* A. Login Panel Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* B. Notice detail expandable content overlay */}
      <NoticeDetailModal
        notice={noticeDetailMsg}
        onClose={() => setNoticeDetailMsg(null)}
        onAddLog={addLog}
      />

      {/* C. Helpful support QnA ticketing panel */}
      <QnaModal
        isOpen={qnaModalOpen}
        onClose={() => setQnaModalOpen(false)}
        currentUser={currentUser}
        onAddLog={addLog}
      />

      {/* D. Master Calendar scheduler popup */}
      <CalendarModal
        isOpen={calendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
        onAddLog={addLog}
      />

    </div>
  );
}
