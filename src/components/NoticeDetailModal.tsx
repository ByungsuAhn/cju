/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, Eye, Heart, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { Notice } from '../types';

interface NoticeDetailModalProps {
  notice: Notice | null;
  onClose: () => void;
  onAddLog: (log: string) => void;
}

export default function NoticeDetailModal({ notice, onClose, onAddLog }: NoticeDetailModalProps) {
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    setCopied(true);
    onAddLog(`[${notice?.title}] 원격 공유 링크를 복사하였습니다.`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setLiked(!liked);
    onAddLog(`게시물 [${notice?.title}] 추천 ${!liked ? '등록' : '해제'} 완료.`);
  };

  return (
    <AnimatePresence>
      {notice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.96, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 15, opacity: 0 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-100 dark:border-zinc-800 shadow-2xl z-10 p-0"
          >
            {/* Header Art Frame */}
            <div className="bg-gradient-to-r from-[#002155] to-[#003580] p-6 text-white flex justify-between items-start">
              <div>
                <span className="text-[9px] font-sans font-bold bg-[#fec73b] text-[#002155] px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {notice.category} 공지문
                </span>
                <h3 className="font-bold text-base sm:text-lg mt-1 tracking-tight leading-snug">
                  {notice.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 text-white rounded-full transition-all shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Authoring Stats ribbon */}
            <div className="bg-neutral-50 dark:bg-zinc-950 px-6 py-3 border-b border-neutral-100 dark:border-zinc-900 flex justify-between items-center text-xs text-neutral-400">
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>{notice.author}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{notice.date}</span>
                </span>
              </div>
              <span className="flex items-center gap-1 font-mono">
                <Eye className="w-3.5 h-3.5" />
                <span>조회수 {notice.views + (liked ? 1 : 0)}</span>
              </span>
            </div>

            {/* Scrollable text body */}
            <div className="p-6 md:p-8 space-y-4 max-h-[380px] overflow-y-auto font-notoSans text-neutral-700 dark:text-zinc-200 text-xs sm:text-sm leading-relaxed pr-2">
              {notice.content.split('\n').map((para, pIdx) => (
                <p key={pIdx}>{para}</p>
              ))}
            </div>

            {/* Feedback & interactive controls bottom ribbon */}
            <div className="bg-neutral-50 dark:bg-zinc-950 p-4 border-t border-neutral-100 dark:border-zinc-900 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={handleLike}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                    liked
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-white hover:bg-neutral-100 text-neutral-500 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-red-600 text-red-600' : ''}`} />
                  <span>공감추천 ({liked ? 1 : 0})</span>
                </button>

                <button
                  onClick={handleShare}
                  className="px-4 py-2 text-xs font-bold bg-white hover:bg-neutral-100 text-neutral-500 rounded-xl border flex items-center gap-2 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? '링크 복사됨' : '주소 공유'}</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="px-5 py-2 text-xs bg-[#002155] hover:bg-[#003580] text-white font-bold rounded-xl cursor-pointer"
              >
                확인 완료
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
