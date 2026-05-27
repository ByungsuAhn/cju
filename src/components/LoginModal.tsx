/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, User, Award, CheckCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (studentName: string, dept: string, id: string) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !password) {
      setError('학번과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate standard university authentication
    setTimeout(() => {
      setIsLoading(false);
      let name = '김우암';
      let dept = '컴퓨터소프트웨어학부';
      if (studentId === 'professor' || studentId.startsWith('p')) {
        name = '홍길동 교수';
        dept = 'AI빅데이터학전공';
      } else if (studentId === 'guest') {
        name = '이청주';
        dept = '방문학생/예비입학생';
      } else if (studentId.length >= 4) {
        // Generate generic student
        const num = parseInt(studentId);
        if (num % 2 === 0) {
          name = '이예리';
          dept = '항공서비스학부';
        } else {
          name = '박건우';
          dept = '경영학부 이공계열';
        }
      }

      onLoginSuccess(name, dept, studentId);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-800"
          >
            {/* Header Art Band */}
            <div className="bg-gradient-to-r from-[#002155] to-[#003580] p-8 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 bg-[#fec73b] text-[#002155] rounded-xl flex items-center justify-center font-bold text-lg shadow-inner">
                  CJU
                </span>
                <div>
                  <h3 className="font-bold text-xl tracking-tight">청주대학교 통합포털</h3>
                  <p className="text-xs text-white/70">Cheongju University Portal Systems</p>
                </div>
              </div>

              <p className="text-xs text-white/80 mt-4 leading-relaxed font-notoSans">
                학사행정, 전자출결, 중앙도서관 및 교내 통합 민원 시스템을 단 하나의 학번ID로 편리하게 연결합니다.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
                  {error}
                </div>
              )}

              {/* ID Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 block">
                  포털 학번 / 교직원 번호
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 relative text-neutral-400" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="학번을 입력해주세요 (예: 20241234)"
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-zinc-700/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002155] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-500 block">
                  비밀번호 (초기 비밀번호: 주민번호앞6자리+cju!)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 relative text-neutral-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요"
                    className="w-full pl-10 pr-4 py-3 bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200 dark:border-zinc-700/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#002155] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Tips */}
              <div className="bg-[#fbf9f8] dark:bg-zinc-800 p-4 rounded-xl space-y-2 border border-neutral-100 dark:border-zinc-800/50">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#002155] dark:text-[#7fa1f2]">
                  <Award className="w-3.5 h-3.5" />
                  <span>간편 테스트 학번 힌트</span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-zinc-400 leading-relaxed font-notoSans">
                  학번에 아무 숫자나 입력하시거나 특별 ID(<span className="font-semibold text-neutral-700 dark:text-zinc-200">professor</span>, <span className="font-semibold text-neutral-700 dark:text-zinc-200">guest</span>)로 즉석 로그인 실감 테스트가 가능합니다.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#002155] hover:bg-[#003580] active:scale-[0.98] transition-all text-white font-semibold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>안전한 포털 로그인</span>
                  </>
                )}
              </button>
            </form>

            <div className="bg-neutral-50 dark:bg-zinc-900 border-t border-neutral-100 dark:border-zinc-800/80 p-4 text-center text-xs text-neutral-400">
              특수보안 키보드 및 2차 연계인증 가동 중
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
