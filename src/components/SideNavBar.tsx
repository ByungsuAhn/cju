/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserCheck, LogOut, GraduationCap, Calendar, Library, MapPin, Users, HeartHandshake, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface SideNavBarProps {
  currentRole: 'student' | 'faculty' | 'visitor' | 'none';
  setRole: (role: 'student' | 'faculty' | 'visitor' | 'none') => void;
  currentUser: { name: string; dept: string; id: string } | null;
  onLogout: () => void;
  onOpenCalendar: () => void;
  onOpenQnas: () => void;
  onAddLog: (log: string) => void;
  scrollToSection: (selector: string) => void;
}

export default function SideNavBar({
  currentRole,
  setRole,
  currentUser,
  onLogout,
  onOpenCalendar,
  onOpenQnas,
  onAddLog,
  scrollToSection,
}: SideNavBarProps) {
  // Navigation trigger
  const handleRoleSelect = (role: 'student' | 'faculty' | 'visitor') => {
    setRole(role);
    onAddLog(`사용자 역할 필터를 [${role === 'student' ? '재학생' : role === 'faculty' ? '교직원' : '외부 방문객'}]으로 스위칭하였습니다.`);
    
    // Jump down to bento-grid info card section
    setTimeout(() => {
      scrollToSection('#role-bento-grid');
    }, 100);
  };

  return (
    <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-0 w-64 bg-neutral-100 dark:bg-zinc-950 border-r border-neutral-200/60 dark:border-zinc-800/80 z-40">
      {/* Brand & Logo Header */}
      <div className="p-8 flex flex-col items-center border-b border-neutral-200/40 dark:border-zinc-900">
        <div className="w-16 h-16 bg-[#002155] rounded-2xl flex items-center justify-center mb-3 shadow-lg group hover:rotate-6 transition-transform">
          <span className="text-white font-black text-xl tracking-wider">CJU</span>
        </div>
        <h1 className="font-bold text-lg text-[#002155] dark:text-[#7fa1f2] tracking-normal">청주대학교</h1>
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium font-sans">
          Global Elite University
        </p>
      </div>

      {/* Profile & Login Session */}
      <div className="px-4 py-6 border-b border-neutral-200/30 dark:border-zinc-900">
        {currentUser ? (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white dark:bg-zinc-900 rounded-2xl border border-neutral-200/50 dark:border-zinc-800 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 bg-[#fec73b] rounded-full animate-ping" />
              <span className="text-xs font-bold text-neutral-400">포털 접속 중</span>
            </div>
            <h4 className="font-bold text-sm text-neutral-800 dark:text-zinc-100 font-notoSans truncate">
              {currentUser.name}
            </h4>
            <p className="text-[11px] text-neutral-500 truncate dark:text-zinc-400 mt-0.5">
              {currentUser.dept}
            </p>
            <p className="text-[10px] font-mono text-neutral-400 select-all underline leading-none mt-1">
              학번: {currentUser.id}
            </p>

            <button
              onClick={onLogout}
              className="mt-3.5 w-full py-1.5 border border-red-200/70 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:hover:bg-red-950/25 dark:text-red-400 text-red-500 text-xs rounded-xl font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>로그아웃</span>
            </button>
          </motion.div>
        ) : (
          <div className="p-4 bg-[#fbf9f8] dark:bg-zinc-900/40 rounded-2xl text-center border border-dashed border-neutral-300 dark:border-zinc-800">
            <GraduationCap className="w-6 h-6 text-neutral-300 dark:text-zinc-700 mx-auto mb-2" />
            <p className="text-xs font-semibold text-neutral-600 dark:text-zinc-400 font-notoSans">
              도움이 필요하신가요?
            </p>
            <p className="text-[10px] text-neutral-400 mt-1 leading-normal">
              포털 로그인 후 맞춤형 학사정보 전산망을 즉시 조회해보세요.
            </p>
          </div>
        )}
      </div>

      {/* Target views */}
      <div className="mt-4 flex-grow px-3 space-y-1">
        <p className="text-[10px] tracking-wider font-bold text-neutral-400 dark:text-zinc-500 uppercase px-4 py-2">
          대상별 큐레이션
        </p>

        {/* Studnet */}
        <button
          onClick={() => handleRoleSelect('student')}
          className={`w-full flex items-center justify-between px-4 py-2.5 cursor-pointer rounded-xl transition-all ${
            currentRole === 'student'
              ? 'bg-[#002155] text-white shadow-md'
              : 'text-neutral-600 dark:text-zinc-300 hover:bg-neutral-200 dark:hover:bg-zinc-800/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4" />
            <span className="font-notoSans text-xs font-semibold">재학생 전용</span>
          </div>
          <span className="text-[10px] text-neutral-400 group-hover:block px-1.5 py-0.5 bg-neutral-200/50 dark:bg-zinc-800 text-neutral-500 dark:text-zinc-400 rounded-md">
            학사
          </span>
        </button>

        {/* Professor */}
        <button
          onClick={() => handleRoleSelect('faculty')}
          className={`w-full flex items-center justify-between px-4 py-2.5 cursor-pointer rounded-xl transition-all ${
            currentRole === 'faculty'
              ? 'bg-[#002155] text-white shadow-md'
              : 'text-neutral-600 dark:text-zinc-300 hover:bg-neutral-200 dark:hover:bg-zinc-800/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <GraduationCap className="w-4 h-4" />
            <span className="font-notoSans text-xs font-semibold">교직원 전용</span>
          </div>
          <span className="text-[10px] text-neutral-400 px-1.5 py-0.5 bg-neutral-200/50 dark:bg-zinc-800 text-neutral-500 dark:text-zinc-400 rounded-md">
            연구
          </span>
        </button>

        {/* Guest */}
        <button
          onClick={() => handleRoleSelect('visitor')}
          className={`w-full flex items-center justify-between px-4 py-2.5 cursor-pointer rounded-xl transition-all ${
            currentRole === 'visitor'
              ? 'bg-[#002155] text-white shadow-md'
              : 'text-neutral-600 dark:text-zinc-300 hover:bg-neutral-200 dark:hover:bg-zinc-800/60'
          }`}
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4" />
            <span className="font-notoSans text-xs font-semibold">방문객(대외)</span>
          </div>
          <span className="text-[10px] text-neutral-400 px-1.5 py-0.5 bg-neutral-200/50 dark:bg-zinc-800 text-neutral-500 dark:text-zinc-400 rounded-md">
            안내
          </span>
        </button>

        <p className="text-[10px] tracking-wider font-bold text-neutral-400 dark:text-zinc-500 uppercase px-4 py-3">
          스마트 시스템즈
        </p>

        {/* Library quick button */}
        <button
          onClick={() => scrollToSection('#central-library')}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-600 dark:text-zinc-300 hover:bg-neutral-200 dark:hover:bg-zinc-800/60 transition-all rounded-xl cursor-pointer"
        >
          <Library className="w-4 h-4 text-[#002155] dark:text-[#7fa1f2]" />
          <span className="font-notoSans text-xs font-medium">중앙도서관</span>
        </button>

        {/* Smart scheduler popup */}
        <button
          onClick={onOpenCalendar}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-600 dark:text-zinc-300 hover:bg-neutral-200 dark:hover:bg-zinc-800/60 transition-all rounded-xl cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-[#ef8d15]" />
          <span className="font-notoSans text-xs font-medium">학사일정 달력</span>
        </button>

        {/* Q&A Hotline */}
        <button
          onClick={onOpenQnas}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-600 dark:text-zinc-300 hover:bg-neutral-200 dark:hover:bg-zinc-800/60 transition-all rounded-xl cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-[#e5b124]" />
          <span className="font-notoSans text-xs font-medium">Q&A 민원 접수</span>
        </button>
      </div>

      {/* Safety Bottom Label */}
      <div className="p-4 bg-neutral-200/30 dark:bg-zinc-900 border-t border-neutral-200/40 dark:border-zinc-800 p-4 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <HeartHandshake className="w-3.5 h-3.5 text-[#002155] dark:text-zinc-400" />
          <span className="text-[11px] font-semibold text-neutral-500 dark:text-zinc-400 font-notoSans">
            우암 스마트 헬퍼 v2
          </span>
        </div>
      </div>
    </aside>
  );
}
