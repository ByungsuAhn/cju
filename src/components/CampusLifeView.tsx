/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, School, Landmark, ChevronRight, BookOpen, 
  MapPin, Bus, Utensils, Award, CornerDownRight, Check,
  Laptop, Calendar, CheckCircle2, TrendingUp, Compass, ArrowRight
} from 'lucide-react';
import { Club, Notice, StudyRoom, ShuttleLine, MenuItem } from '../types';
import { CLUBS, STUDY_ROOMS, SHUTTLE_LINES, CAFETERIA_MENU, MAP_NODES } from '../data';

interface CampusLifeViewProps {
  notices: Notice[];
  onOpenNotice: (notice: Notice) => void;
  currentUser: { name: string; dept: string; id: string } | null;
  onOpenLogin: () => void;
  setTab: (tab: 'campus' | 'notices') => void;
  currentRole: 'student' | 'faculty' | 'visitor' | 'none';
  setRole: (role: 'student' | 'faculty' | 'visitor' | 'none') => void;
  onAddLog: (log: string) => void;
}

export default function CampusLifeView({
  notices,
  onOpenNotice,
  currentUser,
  onOpenLogin,
  setTab,
  currentRole,
  setRole,
  onAddLog,
}: CampusLifeViewProps) {
  // 1. Club list filters
  const [selectedClubCategory, setSelectedClubCategory] = useState<'전체' | '공연/예술' | '체육/레저' | '학술/교양' | '봉사/사회'>('전체');
  const [activeClubDetail, setActiveClubDetail] = useState<Club | null>(null);

  // 2. Library booking simulator
  const [libraryRooms, setLibraryRooms] = useState<StudyRoom[]>(STUDY_ROOMS);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('r1');
  const [bookedSeats, setBookedSeats] = useState<string[]>([]); // Track user bookings
  const [isReserving, setIsReserving] = useState(false);

  // 3. Cafe menu select
  const [cafeMenus, setCafeMenus] = useState<MenuItem[]>(CAFETERIA_MENU);
  const [userRating, setUserRating] = useState<number | null>(null);

  // 4. Shuttle loop simulator
  const [shuttles, setShuttles] = useState<ShuttleLine[]>(SHUTTLE_LINES);
  const [selectedShuttleId, setSelectedShuttleId] = useState<string>('s1');

  // 5. Intelligent map pathfinder
  const [mapSourceId, setMapSourceId] = useState<string>('m1');
  const [mapDestId, setMapDestId] = useState<string>('m2');
  const [computedPath, setComputedPath] = useState<string[]>([]);
  const [calculatingPath, setCalculatingPath] = useState(false);

  // Simulation side-effects to make Campus feel "alive"
  useEffect(() => {
    const timer = setInterval(() => {
      // Rotate active shuttle station index
      setShuttles(prev => prev.map(line => {
        const nextIndex = (line.currentBusIndex + 1) % line.stations.length;
        const decreaseMin = line.estimatedMin > 1 ? line.estimatedMin - 1 : Math.floor(Math.random() * 8) + 3;
        return {
          ...line,
          currentBusIndex: nextIndex,
          estimatedMin: decreaseMin
        };
      }));

      // Randomly fluctuation library occupancy to feel alive
      setLibraryRooms(prev => prev.map(room => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const newOccupied = Math.max(10, Math.min(room.totalSeats - 5, room.occupiedSeats + delta));
        const ratio = newOccupied / room.totalSeats;
        const status = ratio > 0.8 ? '혼잡' : ratio > 0.5 ? '보통' : '여유';
        return {
          ...room,
          occupiedSeats: newOccupied,
          status
        };
      }));
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  // Handle library cell checking
  const handleReserveSeat = () => {
    if (!currentUser) {
      onAddLog('로그인하지 않은 상태에서 열람실 좌석 예약을 시도하여 로그인 모듈로 연결합니다.');
      onOpenLogin();
      return;
    }

    const room = libraryRooms.find(r => r.id === selectedRoomId);
    if (!room) return;

    if (bookedSeats.includes(selectedRoomId)) {
      // Cancel
      setBookedSeats(prev => prev.filter(id => id !== selectedRoomId));
      setLibraryRooms(prev => prev.map(r => r.id === selectedRoomId ? { ...r, occupiedSeats: r.occupiedSeats - 1 } : r));
      onAddLog(`중앙도서관 [${room.name}] 좌석 예약을 취소하였습니다.`);
    } else {
      setIsReserving(true);
      setTimeout(() => {
        setIsReserving(false);
        setBookedSeats(prev => [...prev, selectedRoomId]);
        setLibraryRooms(prev => prev.map(r => r.id === selectedRoomId ? { ...r, occupiedSeats: r.occupiedSeats + 1 } : r));
        onAddLog(`중앙도서관 [${room.name}] 28번 좌석 예약에 성공하였습니다. 모바일 자율 증명서가 발급되었습니다.`);
      }, 800);
    }
  };

  // Map Routing trigger
  const handleComputeRoute = () => {
    if (mapSourceId === mapDestId) {
      alert('출발지와 목적지가 동일합니다. 다른 건물을 선택해 주세요!');
      return;
    }
    setCalculatingPath(true);
    setTimeout(() => {
      setCalculatingPath(false);
      const srcNode = MAP_NODES.find(n => n.id === mapSourceId);
      const destNode = MAP_NODES.find(n => n.id === mapDestId);
      if (srcNode && destNode) {
        setComputedPath([srcNode.name, '성곽 예술 둘레길', '단위 공학관 로비', destNode.name]);
        onAddLog(`캠퍼스 스마트 맵: [${srcNode.name}]에서 [${destNode.name}]까지의 최단 도보 경로를 계산하였습니다.`);
      }
    }, 600);
  };

  // Dorm simulation
  const [dormChecked, setDormChecked] = useState(false);
  const [selectedDorm, setSelectedDorm] = useState('우암마을 4인실 (남/여)');
  const handleDormSubmit = () => {
    if (!currentUser) {
      onOpenLogin();
      return;
    }
    setDormChecked(true);
    onAddLog(`[학생생활관] ${currentUser.name} 학우님의 [${selectedDorm}] 입사 신청서류 제출을 완료하였습니다.`);
  };

  const filteredClubs = selectedClubCategory === '전체' 
    ? CLUBS 
    : CLUBS.filter(c => c.category === selectedClubCategory);

  return (
    <div className="space-y-16 pb-20 animate-fade-in font-notoSans bg-[#fbf9f8] text-[#1b1c1c] dark:bg-[#121212] dark:text-zinc-100">
      
      {/* 1. Hero Landscape Section */}
      <section className="relative h-[550px] lg:h-[620px] w-full overflow-hidden rounded-b-[40px] shadow-lg">
        <img 
          className="absolute inset-0 w-full h-full object-cover brightness-95 transform scale-100 min-w-full"
          alt="Cheongju University Landmark Landscape"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWdhHJ1KMteexY7p2QCSFIljnWMvuOG0srO9vyezIRMvm3JcvIYX2ktuFYOXPEOCjr_WWF9YJsa5zYxhQfVSRkwbqpeO_59rEsmqij_8w461sn4bddN9gj74fv3GNmRR3X7iMA4MMG3eRYnzT0-QsmHsrly_FWeG4aGIF3eeo6wCkAZoYuta2vITz7VjbrFv0RBxdHn-JGUbt5UDSnOcz6IZGMiBkKSUoYQhyN1craYkX3UKh_Cf9GDFnR-krRD9z6lTohfO_q55TY"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#002155]/90 via-[#002155]/65 to-transparent dark:from-[#000511]/95 dark:via-[#000511]/70" />
        
        <div className="relative h-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center items-start text-white">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-block px-3 py-1 bg-[#fec73b] text-[#002155] rounded-full text-xs font-bold mb-4 shadow-sm"
          >
            ★ 글로벌 명문 청주대 공식 포털
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-bold text-3xl md:text-5xl max-w-2xl leading-[1.2] tracking-tight text-white mb-4"
          >
            역사와 미래가 공존하는 <br />
            <span className="text-[#fec73b]">활기찬 캠퍼스 라이프</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base max-w-xl mb-8 text-neutral-200 leading-relaxed font-normal"
          >
            청주대학교는 학생들의 고유한 꿈과 끊임없는 열정을 아낌없이 응원합니다. 혁신 교육, 최적의 인적 교류, 최고 수준의 복지 복합 문화시설을 지금 즉시 풍요롭게 경험해 보세요.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-3.5"
          >
            <a 
              href="#smart-pathfinder"
              className="px-6 py-3.5 bg-[#fec73b] hover:bg-[#e5b124] text-[#002155] font-bold rounded-xl transition-all shadow-md active:scale-95 text-xs tracking-tight"
            >
              캠퍼스 투어 지도
            </a>
            <a 
              href="#student-clubs"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold rounded-xl transition-all text-xs"
            >
              동아리 가이드북
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. Target Profile Selector (Student, Faculty, Visitor Group) */}
      <section id="role-bento-grid" className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center md:text-left mb-8">
          <p className="text-xs uppercase tracking-widest text-[#002155] dark:text-[#7fa1f2] font-semibold mb-1">AUDIENCE CURATION</p>
          <h3 className="text-2xl font-bold tracking-tight">대상자 맞춤식 간편 바로가기</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Student Profile Card */}
          <div 
            onClick={() => {
              setRole('student');
              onAddLog('맞춤 큐레이션: 재학생에 포커스합니다.');
            }}
            className={`group cursor-pointer p-8 rounded-3xl transition-all duration-300 border ${
              currentRole === 'student' 
                ? 'bg-gradient-to-br from-[#002155] to-[#003580] text-white border-transparent shadow-xl translate-y-[-4px]' 
                : 'bg-white dark:bg-zinc-900 border-neutral-200/50 dark:border-zinc-800 hover:shadow-lg hover:border-[#002155]/20'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform ${
              currentRole === 'student' ? 'bg-[#fec73b] text-[#002155]' : 'bg-[#002155]/10 text-[#002155] dark:bg-[#7fa1f2]/10 dark:text-[#7fa1f2]'
            }`}>
              <Users className="w-6 h-6" />
            </div>
            <div className="flex justify-between items-center mb-2">
              <h4 className={`text-lg font-bold ${currentRole === 'student' ? 'text-white' : 'text-neutral-800 dark:text-zinc-100'}`}>
                재학생 (Students)
              </h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${currentRole === 'student' ? 'bg-white/10 text-[#fec73b]' : 'bg-neutral-100 dark:bg-zinc-800 text-neutral-500'}`}>
                인기
              </span>
            </div>
            <p className={`text-xs leading-relaxed mb-6 ${currentRole === 'student' ? 'text-white/80' : 'text-neutral-500 dark:text-zinc-400'}`}>
              장학금 최종수혜 명단 조회, 기말고사 시험 일정 및 생활관 기숙사 신청, 학생식당 오늘의 추천단과식 등 재학생 핵심 서비스로 채워져 있습니다.
            </p>
            <div className={`flex items-center gap-2 text-xs font-bold ${currentRole === 'student' ? 'text-[#fec73b]' : 'text-[#002155] dark:text-[#7fa1f2]'}`}>
              <span>개인 맞춤 가이드 활성화</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Faculty Card */}
          <div 
            onClick={() => {
              setRole('faculty');
              onAddLog('맞춤 큐레이션: 교직원에 포커스합니다.');
            }}
            className={`group cursor-pointer p-8 rounded-3xl transition-all duration-300 border ${
              currentRole === 'faculty' 
                ? 'bg-gradient-to-br from-[#785a00] to-[#5b4300] text-white border-transparent shadow-xl translate-y-[-4px]' 
                : 'bg-white dark:bg-zinc-900 border-neutral-200/50 dark:border-zinc-800 hover:shadow-lg hover:border-[#785a00]/20'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform ${
              currentRole === 'faculty' ? 'bg-[#fec73b] text-[#785a00]' : 'bg-[#785a00]/10 text-[#785a00] dark:bg-[#fec73b]/10 dark:text-[#fec73b]'
            }`}>
              <School className="w-6 h-6" />
            </div>
            <div className="flex justify-between items-center mb-2">
              <h4 className={`text-lg font-bold ${currentRole === 'faculty' ? 'text-white' : 'text-neutral-800 dark:text-zinc-100'}`}>
                교직원 (Faculty)
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-zinc-800 text-neutral-500">
                행정
              </span>
            </div>
            <p className={`text-xs leading-relaxed mb-6 ${currentRole === 'faculty' ? 'text-white/80' : 'text-neutral-500 dark:text-zinc-400'}`}>
              학사 성적 평가 입력, 연구 과제 행정 전산 지원망, 수강 정원 고도화 관리 가이드 및 교내 주차 고도화 차단기 우회 발급 전용 포탈을 지원합니다.
            </p>
            <div className={`flex items-center gap-2 text-xs font-bold ${currentRole === 'faculty' ? 'text-[#fec73b]' : 'text-[#785a00]'}`}>
              <span>연구 행정 가이드 활성화</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Visitor Card */}
          <div 
            onClick={() => {
              setRole('visitor');
              onAddLog('맞춤 큐레이션: 방문객에 포커스합니다.');
            }}
            className={`group cursor-pointer p-8 rounded-3xl transition-all duration-300 border ${
              currentRole === 'visitor' 
                ? 'bg-gradient-to-br from-neutral-800 to-neutral-950 text-white border-transparent shadow-xl translate-y-[-4px]' 
                : 'bg-white dark:bg-zinc-900 border-neutral-200/50 dark:border-zinc-800 hover:shadow-lg hover:border-neutral-700/20'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform ${
              currentRole === 'visitor' ? 'bg-[#ef8d15] text-white' : 'bg-neutral-100 text-neutral-700 dark:bg-zinc-800 dark:text-neutral-300'
            }`}>
              <Landmark className="w-6 h-6" />
            </div>
            <div className="flex justify-between items-center mb-2">
              <h4 className={`text-lg font-bold ${currentRole === 'visitor' ? 'text-white' : 'text-neutral-800 dark:text-zinc-100'}`}>
                방문객 (Visitors)
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-zinc-800 text-neutral-500 font-sans">
                오픈
              </span>
            </div>
            <p className={`text-xs leading-relaxed mb-6 ${currentRole === 'visitor' ? 'text-white/80' : 'text-neutral-500 dark:text-zinc-400'}`}>
              캠퍼스 100% 입체 탐방 경로 설정, 실시간 셔틀버스 위치 트래커 시스템, 대표 주차요금 및 입학설명회 브로셔 무료 다운로드를 이용할 수 있습니다.
            </p>
            <div className={`flex items-center gap-2 text-xs font-bold ${currentRole === 'visitor' ? 'text-[#ef8d15]' : 'text-neutral-800 dark:text-neutral-200'}`}>
              <span>오픈 캠퍼스 가이드 활성화</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Deep Interactive Campus Hub Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="text-center md:text-left">
          <p className="text-xs uppercase tracking-widest text-[#002155] dark:text-[#7fa1f2] font-semibold mb-1">INTERACTIVE HUB</p>
          <h3 className="text-2xl font-bold tracking-tight">캠퍼스 라이프 테마별 정밀 도구</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Card A: Student Clubs System (lg:col-span-6) */}
          <div id="student-clubs" className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 text-[#002155] dark:text-[#7fa1f2] mb-1">
                    <Award className="w-5 h-5 text-[#fec73b]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Student Clubs</span>
                  </div>
                  <h4 className="text-lg font-bold">학생 동아리 연계 보드</h4>
                </div>
                <span className="text-xs bg-[#002155]/5 text-[#002155] dark:bg-[#7fa1f2]/10 dark:text-[#7fa1f2] px-3 py-1 rounded-full font-bold">
                  총 54개 동아리 활동 중
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed mb-6">
                예술, 과학코딩, 사회봉사, 격동식 테니스/축구 등 다채로운 꿈을 향한 모임이 존재합니다. 관심 부서를 선택해서 방 배정 및 정원을 가상 체크해 보시기 바랍니다.
              </p>

              {/* Categorization tabs */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {(['전체', '공연/예술', '체육/레저', '학술/교양', '봉사/사회'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedClubCategory(cat);
                      onAddLog(`동아리 필터링: [${cat}]`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      selectedClubCategory === cat
                        ? 'bg-[#002155] text-white'
                        : 'bg-neutral-50 dark:bg-zinc-800 text-neutral-500 hover:bg-neutral-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Clubs dynamic micro-grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-48 overflow-y-auto pr-2 border-t border-neutral-100 dark:border-zinc-800 pt-4 scrollbar-thin">
                {filteredClubs.map(club => (
                  <div
                    key={club.id}
                    onClick={() => {
                      setActiveClubDetail(club);
                      onAddLog(`동아리 [${club.name}] 상세 보기 선택.`);
                    }}
                    className="p-3 bg-neutral-50/70 hover:bg-neutral-100/80 dark:bg-zinc-800/40 dark:hover:bg-zinc-805 cursor-pointer rounded-xl border border-neutral-100 dark:border-zinc-800 flex justify-between items-center transition-all hover:translate-x-1"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-neutral-800 dark:text-zinc-100">{club.name}</h5>
                      <span className="text-[10px] text-[#002155] dark:text-[#7fa1f2] font-medium bg-[#002155]/5 px-1.5 py-0.5 rounded">
                        {club.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-neutral-400 font-mono">{club.count}명</p>
                      <p className="text-[9px] text-neutral-400 font-sans">{club.room}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Club quick helper detail box */}
            <AnimatePresence mode="wait">
              {activeClubDetail ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="mt-4 p-4 bg-[#fbf9f8] dark:bg-zinc-800 border border-[#002155]/10 rounded-2xl flex items-start gap-3"
                >
                  <Award className="w-5 h-5 text-[#fec73b] shrink-0 mt-0.5" />
                  <div className="flex-grow">
                    <h6 className="text-xs font-bold text-[#002155] dark:text-[#7fa1f2]">{activeClubDetail.name} 소개</h6>
                    <p className="text-[11px] text-neutral-600 dark:text-zinc-300 mt-1 leading-normal">
                      {activeClubDetail.description}
                    </p>
                    <p className="text-[9px] text-neutral-400 mt-2 font-mono">
                      위치: {activeClubDetail.room} | 액티브 리더 회원: {activeClubDetail.count}명
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      alert(`[${activeClubDetail.name}] 2024년도 회원 대모집에 응해주셔서 감사합니다. 학생회관 ${activeClubDetail.room}에서 인원 면접이 상시 가동 중입니다!`);
                      onAddLog(`[${activeClubDetail.name}] 온라인 가입 신청 완료.`);
                    }}
                    className="px-3 py-1 text-[10px] bg-[#002155] text-white rounded-lg font-bold hover:bg-[#003580]"
                  >
                    가입요청
                  </button>
                </motion.div>
              ) : (
                <p className="text-[10px] text-center text-neutral-400 mt-4 italic">
                  * 동아리를 마우스로 선택하면 상세 가입 혜택과 방 번호 조회가 연계됩니다.
                </p>
              )}
            </AnimatePresence>
          </div>

          {/* Card B: Student Residence (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-800 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-[#785a00]/10 rounded-xl">
                  <Landmark className="w-5 h-5 text-[#785a00]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">우암마을 학생생활관</h4>
                  <p className="text-[10px] text-neutral-400">Student Residence Guide</p>
                </div>
              </div>
              
              <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed mb-6">
                청주대학교의 아늑한 주거 공간이자 자기 주도형 학업 공동체입니다. 쾌적한 시설의 침실, 스터디룸 및 식음료 프리미엄 스튜디오를 체험해보세요.
              </p>

              {/* Dorm Apply Simulator Form */}
              <div className="space-y-4 bg-[#fbf9f8] dark:bg-zinc-800/40 p-4 rounded-2xl border border-neutral-150 dark:border-zinc-800">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 block">원하는 생활관 호수 선택</label>
                  <select 
                    value={selectedDorm}
                    onChange={(e) => setSelectedDorm(e.target.value)}
                    className="w-full text-xs bg-white dark:bg-zinc-800 p-2.5 rounded-xl border border-neutral-200 dark:border-zinc-700 focus:outline-none"
                  >
                    <option>우암마을 2인실 (전용 욕실, 가구 완비)</option>
                    <option>우암마을 4인실 (남/여)</option>
                    <option>국제학사 프리미엄 글로벌 1인실</option>
                    <option>진리관 패밀리룸</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-neutral-500">신청 여부</span>
                  {dormChecked ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>신청 완료</span>
                    </span>
                  ) : (
                    <span className="text-neutral-400">미신청</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-zinc-800">
              <button
                onClick={handleDormSubmit}
                className="w-full py-3 bg-[#785a00] hover:bg-[#5b4300] active:scale-98 transition-all text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>제1지망 생활관 입소 온라인 신청</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-neutral-400 text-center mt-2 font-notoSans">
                * 신입생 및 통학거리 40km 이상인 재학생 우선 선발 대상입니다.
              </p>
            </div>
          </div>

        </div>

        {/* Dynamic Part: Central Library (Full 12-col layout with dynamic state!) */}
        <div id="central-library" className="bg-gradient-to-br from-white to-neutral-50 dark:from-zinc-900 dark:to-zinc-900 border border-neutral-200/50 dark:border-zinc-800 rounded-3xl p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Library info detail */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="p-3 bg-[#002155]/5 text-[#002155] dark:bg-[#7fa1f2]/10 dark:text-[#7fa1f2] rounded-2xl">
                <BookOpen className="w-6 h-6 text-[#002155] dark:text-[#7fa1f2]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#002155] dark:text-[#7fa1f2] font-semibold">Smart Central Library</span>
                <h4 className="text-lg font-bold">중앙도서관 원클릭 도서 좌석관</h4>
              </div>
            </div>

            <p className="text-xs text-neutral-600 dark:text-zinc-400 leading-relaxed font-notoSans">
              24시간 쉬지 않는 학문 탐구의 요람, 중앙도서관 좌석 및 정보 연동 플랫폼입니다. 노트북 전용좌석 및 IT 통합 열람대 등 실시간 도서 혼잡도 맵을 보시고 좌석을 안전 예약하세요.
            </p>

            {/* Micro-Features buttons for Library inside Screen 1 */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '노트북실 예약', detail: '와이파이 하이패스' },
                { label: '스터디그룹룸', detail: '4인~12인 가능' },
                { label: '출격/종합스캔', detail: '무인클라우드' }
              ].map((btn, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onAddLog(`[중앙도서관 - ${btn.label}] 퀵 가이드 호출.`);
                    alert(`중앙도서관 내에 구축된 스마트 IoT ${btn.label} 연계 시스템입니다. 도서관 현장 키오스크 또는 포털을 통해 추가 일정 관리가 이뤄집니다.`);
                  }}
                  className="p-3 bg-white dark:bg-zinc-850 hover:bg-[#002155]/5 dark:hover:bg-zinc-800 rounded-2xl border border-neutral-150 dark:border-zinc-800 text-center transition-all cursor-pointer"
                >
                  <Laptop className="w-4 h-4 mx-auto mb-2 text-[#002155] dark:text-[#7fa1f2]" />
                  <p className="text-[11px] font-bold text-neutral-800 dark:text-zinc-150 leading-none">{btn.label}</p>
                  <p className="text-[9px] text-neutral-400 mt-1 leading-none">{btn.detail}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Seat selection / state simulator */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-neutral-100 dark:border-zinc-800 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-100 dark:border-zinc-800">
                <span className="text-xs font-bold text-neutral-600 dark:text-zinc-300">실시간 연동 열람 구역 현황</span>
                <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#fec73b] rounded-full animate-pulse" />
                  <span>10초 주기 자동 갱신 중</span>
                </span>
              </div>

              {/* Show rooms selector */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
                {libraryRooms.map(room => (
                  <button
                    key={room.id}
                    onClick={() => {
                      setSelectedRoomId(room.id);
                      onAddLog(`열람 구역 스위치: [${room.name}]`);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedRoomId === room.id
                        ? 'bg-[#002155]/5 border-[#002155] text-[#002155] dark:bg-[#7fa1f2]/10 dark:border-[#7fa1f2] dark:text-[#7fa1f2]'
                        : 'border-neutral-200/60 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h5 className="text-[11px] font-bold truncate pr-1 text-neutral-800 dark:text-zinc-150">{room.name}</h5>
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                        room.status === '혼잡' ? 'bg-red-50 text-red-600' : room.status === '보통' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'
                      }`}>
                        {room.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-xs font-bold font-mono text-neutral-800 dark:text-zinc-200">{room.occupiedSeats}</span>
                      <span className="text-[9px] text-neutral-400">/ {room.totalSeats}석</span>
                    </div>
                    {/* Tiny animated occupancy bar */}
                    <div className="w-full h-1 bg-neutral-100 dark:bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          room.status === '혼잡' ? 'bg-red-500' : room.status === '보통' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${(room.occupiedSeats / room.totalSeats) * 100}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Simulated interactive seat layout */}
              <div className="bg-neutral-50 dark:bg-zinc-900 border border-neutral-100 p-4 rounded-xl flex flex-col justify-center items-center">
                <p className="text-[10px] text-neutral-400 font-bold mb-3">
                  선택구역 모의 스크린 방향 (Front Screen Aspect)
                </p>
                <div className="grid grid-cols-8 gap-2 w-full max-w-sm">
                  {Array.from({ length: 16 }).map((_, idx) => {
                    const isOccupied = (idx * 3) % 4 === 0 || idx === 11 || idx === 12;
                    const isMySeat = bookedSeats.includes(selectedRoomId) && idx === 13; // seat 14 represents user booking

                    return (
                      <button
                        key={idx}
                        disabled={isOccupied && !isMySeat}
                        onClick={() => {
                          handleReserveSeat();
                        }}
                        className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-all relative ${
                          isMySeat
                            ? 'bg-emerald-500 text-white shadow-md cursor-pointer animate-pulse'
                            : isOccupied
                              ? 'bg-neutral-200 dark:bg-zinc-800 text-neutral-400 cursor-not-allowed'
                              : 'bg-white hover:bg-[#002155]/10 border border-neutral-200 cursor-pointer text-[#002155] dark:bg-zinc-800'
                        }`}
                        title={isOccupied ? '점유된 좌석' : '예약 가능 좌석'}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-3 text-[10px] text-neutral-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-white border border-neutral-200 rounded" />
                    <span>예약 미지정</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-neutral-200 dark:bg-zinc-800 rounded" />
                    <span>이용 중</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded" />
                    <span>내 선점석</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Action booking trigger */}
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-left">
                <p className="text-[11px] font-semibold text-[#002155] dark:text-[#7fa1f2]">
                  지정 구역: {libraryRooms.find(r => r.id === selectedRoomId)?.name}
                </p>
                <p className="text-[9px] text-neutral-400 font-sans mt-0.5">
                  예약 성공 시 QR 모바일 출입증이 자동 활성화되어 게이트 통과가 가능합니다.
                </p>
              </div>

              <button
                disabled={isReserving}
                onClick={handleReserveSeat}
                className={`w-full sm:w-auto px-6 py-2 rounded-xl text-xs font-bold shadow-sm transition-all text-center cursor-pointer ${
                  bookedSeats.includes(selectedRoomId)
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-[#002155] hover:bg-[#003580] text-white'
                }`}
              >
                {isReserving ? (
                  <span className="flex items-center gap-1.5 justify-center">
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>처리 중...</span>
                  </span>
                ) : bookedSeats.includes(selectedRoomId) ? (
                  '좌석 예약 취송하기'
                ) : (
                  '실시간 빈자리 원격 선점하기'
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Dynamic Part: Welfare Cafe Menu & Live Bus Tracker Side-by-Side (Matches unique styling & responsive screen layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 1. Cafe Food Planner */}
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-805 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-[#fec73b]/10 rounded-xl">
                    <Utensils className="w-5 h-5 text-[#fec73b]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">오늘의 학생식당 대표 식단</h4>
                    <p className="text-[10px] text-neutral-400">Integrated Cafeteria Planner</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-md">
                  오전 11:00 ~ 오후 14:00 개장
                </span>
              </div>

              <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed mb-4">
                학생회관 푸드랜드에서 엄선한 맛사냥 프리미엄 영양 요리입니다. 매일 아침 전속 총주방장의 레시피에 맞춰 신선하게 조리됩니다.
              </p>

              {/* Dinner board lists */}
              <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-zinc-800">
                {cafeMenus.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex justify-between items-center p-3 bg-[#fbf9f8] dark:bg-zinc-800/40 border border-neutral-100 dark:border-zinc-805 rounded-xl text-xs hover:bg-white transition-all transform hover:-translate-y-0.5 shadow-xs"
                  >
                    <div>
                      <p className="text-[10px] font-bold text-[#002155] dark:text-[#7fa1f2] tracking-tight">{item.corner}</p>
                      <p className="font-semibold text-neutral-800 dark:text-zinc-100 mt-0.5">{item.menu}</p>
                    </div>
                    <span className="font-mono font-bold text-[#ef8d15] text-[11px] shrink-0">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-neutral-500 text-[11px]">학우 추천 선호도 피드백</span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => {
                      setUserRating(star);
                      onAddLog(`식단 만족도 별점 제출: ${star}점`);
                      alert(`감사합니다! 소중한 전산 피드백 ${star}별점이 학생 영양 위원회에 즉시 반영되었습니다.`);
                    }}
                    className={`text-sm tracking-tight font-bold shrink-0 transition-transform hover:scale-125 cursor-pointer ${
                      (userRating && star <= userRating) ? 'text-[#fec73b]' : 'text-neutral-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
                {userRating && <span className="text-[11px] font-bold text-neutral-500">[{userRating}점]</span>}
              </div>
            </div>
          </div>

          {/* 2. Interactive Campus Shuttle Live Bus Tracker */}
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-805 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2.5 bg-[#002155]/10 rounded-xl">
                  <Bus className="w-5 h-5 text-[#002155] dark:text-[#7fa1f2]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">캠퍼스 연계 셔틀버스 실시간 위치</h4>
                  <p className="text-[10px] text-neutral-400">Real-time GPS Shuttle Dispatch</p>
                </div>
              </div>

              <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed mb-4">
                교내 순환 및 원격 인근 권역 등하교 셔틀버스 위치 정보입니다. 20초마다 차량 내부 GPS 디바이스로 위치 데이터를 수급합니다.
              </p>

              {/* Course switch tabs */}
              <div className="flex gap-2 mb-4">
                {shuttles.map(line => (
                  <button
                    key={line.id}
                    onClick={() => {
                      setSelectedShuttleId(line.id);
                      onAddLog(`셔틀 정보 조회: [${line.name}]`);
                    }}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg border cursor-pointer flex-grow transition-all ${
                      selectedShuttleId === line.id
                        ? 'bg-neutral-900 text-white border-transparent'
                        : 'border-neutral-200 hover:border-neutral-300 dark:border-zinc-800'
                    }`}
                  >
                    {line.id === 's1' ? 'A노선' : line.id === 's2' ? 'B노선' : 'C야간'}
                  </button>
                ))}
              </div>

              {/* Station sequence with active bus display! */}
              {(() => {
                const line = shuttles.find(l => l.id === selectedShuttleId);
                return line ? (
                  <div className="p-4 bg-neutral-50 dark:bg-zinc-950 rounded-2xl border border-neutral-100 dark:border-zinc-800 space-y-4">
                    <p className="text-[11px] font-bold text-[#002155] dark:text-[#7fa1f2] truncate">
                      {line.name}
                    </p>

                    {/* Horizontal stations mapping */}
                    <div className="relative pt-6 pb-2">
                      {/* Gray track background */}
                      <div className="absolute top-8 left-1.5 right-1.5 h-1 bg-neutral-200 dark:bg-zinc-800 rounded-full" />
                      
                      {/* Active green/blue trace line */}
                      <div 
                        className="absolute top-8 left-1.5 h-1 rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${(line.currentBusIndex / (line.stations.length - 1)) * 100}%`,
                          backgroundColor: line.color
                        }}
                      />

                      <div className="flex justify-between items-center relative z-10">
                        {line.stations.map((station, sIdx) => {
                          const isBusHere = line.currentBusIndex === sIdx;
                          return (
                            <div key={sIdx} className="flex flex-col items-center relative group">
                              {/* Station node dot */}
                              <div 
                                className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                  isBusHere 
                                    ? 'bg-white scale-125 border-emerald-500 animate-bounce' 
                                    : 'bg-neutral-100 border-neutral-300 dark:bg-zinc-800 dark:border-zinc-700'
                                }`}
                              >
                                {isBusHere && (
                                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                                )}
                              </div>
                              <span className="text-[8px] font-medium text-neutral-400 dark:text-zinc-500 max-w-[50px] text-center truncate mt-2 leading-none block">
                                {station}
                              </span>

                              {/* Hover tooltip for station detail */}
                              <div className="absolute bottom-6 bg-neutral-800 text-white text-[9px] px-2 py-1 rounded shadow-md hidden group-hover:block pointer-events-none whitespace-nowrap">
                                {station} 정류장
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] bg-white dark:bg-zinc-900 px-3 py-2.5 border border-dashed border-neutral-200 rounded-xl">
                      <span className="text-neutral-500 font-bold shrink-0">실시간 연동 도착 정보</span>
                      <span className="font-mono font-bold text-emerald-500">
                        다음 역 약 {line.estimatedMin}분 후 진입 예정
                      </span>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-105">
              <button 
                onClick={() => {
                  onAddLog('셔틀 도착예정 카카오 발송 서비스 요청.');
                  alert('교내 셔틀 리얼타임 카카오 플러스 알림톡 연결 설정을 가동하였습니다.');
                }}
                className="w-full py-2.5 bg-neutral-100 text-neutral-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer dark:bg-zinc-800 dark:text-zinc-100"
              >
                <span>내 포털 계정으로 알림톡 수신 설정</span>
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* 4. Notice list highlights Section (주요 소식 / 공지사항 연결부 - Matches Screen 1 UI layout) */}
      <section className="bg-neutral-100/60 dark:bg-zinc-950/40 py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#002155] dark:text-[#7fa1f2] font-semibold mb-1">CJU NEWSWIRE</p>
              <h3 className="text-2xl font-bold tracking-tight">주요 소식 및 학사공지</h3>
            </div>
            <button
              onClick={() => setTab('notices')}
              className="text-[#002155] dark:text-[#7fa1f2] text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>전체보기</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {notices.slice(0, 3).map(notice => (
              <div
                key={notice.id}
                onClick={() => onOpenNotice(notice)}
                className="group cursor-pointer bg-white dark:bg-zinc-905 p-6 rounded-3xl border border-neutral-200/50 dark:border-zinc-800/80 shadow-xs hover:shadow-md hover:translate-y-[-2px] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                      notice.category === '중요' 
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/35 dark:text-amber-400' 
                        : 'bg-[#002155]/10 text-[#002155]'
                    }`}>
                      {notice.category}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">{notice.date}</span>
                  </div>

                  <h4 className="font-bold text-sm text-neutral-800 dark:text-zinc-100 line-clamp-2 leading-snug group-hover:text-[#002155] dark:group-hover:text-[#7fa1f2] transition-colors mb-2">
                    {notice.title}
                  </h4>
                  
                  <p className="text-[11px] text-neutral-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {notice.summary}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-neutral-100 dark:border-zinc-800 flex justify-between items-center text-[10px] text-neutral-400">
                  <span>조회수: {notice.views}회</span>
                  <span className="font-bold text-[#002155] dark:text-[#7fa1f2] group-hover:underline">원문 읽기 →</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick static/dynamic story teaser linked to Screen 2 */}
          <div className="mt-8 bg-white dark:bg-zinc-900/50 border border-neutral-150 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="w-12 h-12 bg-[#ef8d15]/10 rounded-2xl flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6 text-[#ef8d15]" />
              </span>
              <div>
                <h4 className="font-bold text-sm text-neutral-800 dark:text-zinc-100">
                  2024학년도 글로벌 리더십 해외 연수 프로그램 참가자 모집 가동 중!
                </h4>
                <p className="text-xs text-neutral-500 dark:text-zinc-400 mt-1">
                  영어권 미국 오하이오 대학 및 싱가포르 탐방 장학 서포터 선발 일정이 개청되었습니다. 1차 면접 소집요건을 확인해보세요.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setTab('notices');
                onAddLog('Teaser 공지사항 클릭으로 보드 전환.');
              }}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-850 dark:bg-white dark:text-neutral-900 font-bold text-xs text-white rounded-xl tracking-tight transition-all shrink-0 cursor-pointer text-center"
            >
              상세 모집요강 조회
            </button>
          </div>

        </div>
      </section>

      {/* 5. Smart Campus Map isometric section */}
      <section id="smart-pathfinder" className="max-w-7xl mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-zinc-900 border border-neutral-200/50 dark:border-zinc-805 rounded-3xl p-8 shadow-sm">
          
          {/* Schematic SVG simulation representation */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-[#fec73b]" />
              <h4 className="font-bold text-neutral-700 dark:text-zinc-300 text-xs uppercase tracking-wider">High-Fidelity Graphical Map Schematic</h4>
            </div>

            {/* Smart graphical canvas frame */}
            <div className="relative aspect-video rounded-2xl bg-slate-50 border border-slate-100 dark:bg-zinc-950 dark:border-zinc-800 overflow-hidden flex items-center justify-center">
              
              {/* Topographic grid */}
              <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,transparent,rgba(0,0,0,0.4))]" />
              
              {/* Isometric Campus Blueprint Artwork representation */}
              <div className="absolute inset-4 rounded-xl border border-dashed border-[#002155]/10 flex items-center justify-center p-4">
                <svg className="w-full h-full text-neutral-300 dark:text-zinc-800" viewBox="0 0 100 100">
                  
                  {/* Road network grid lines */}
                  <path d="M 10 90 L 90 10" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                  <path d="M 20 20 L 80 80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
                  <path d="M 10 50 L 90 50" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M 50 10 L 50 90" stroke="currentColor" strokeWidth="0.5" />

                  {/* Nodes marking */}
                  {MAP_NODES.map(node => {
                    const isSrc = node.id === mapSourceId;
                    const isDest = node.id === mapDestId;
                    return (
                      <g key={node.id}>
                        <circle 
                          cx={node.x} 
                          cy={node.y} 
                          r={isSrc || isDest ? "4" : "2.5"} 
                          className={`transition-all duration-300 ${
                            isSrc 
                              ? 'fill-[#fec73b] stroke-[#002155] stroke-2 animate-pulse' 
                              : isDest 
                                ? 'fill-red-500 stroke-neutral-900 stroke-2' 
                                : 'fill-neutral-400 hover:fill-[#002155]'
                          }`} 
                        />
                        <text 
                          x={node.x} 
                          y={node.y - 6} 
                          fontSize="3.5" 
                          textAnchor="middle" 
                          className="fill-neutral-600 dark:fill-zinc-400 font-bold"
                        >
                          {node.name.split(' (')[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Status floating card */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200 text-[10px]">
                <p className="font-bold text-[#002155]">스마트 최적화 엔진 v4.9</p>
                <p className="text-neutral-400 mt-0.5">실시간 보행로 장애 제거 가동 중</p>
              </div>

              {/* Live path line overlays */}
              <AnimatePresence>
                {computedPath.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-3 right-3 bg-neutral-900/90 text-white p-2.5 rounded-lg text-[9px] max-w-[170px]"
                  >
                    <p className="font-bold text-[#fec73b]">계산된 가이드 요약</p>
                    <p className="leading-normal mt-0.5 text-zinc-300 truncate font-mono">
                      {MAP_NODES.find(n => n.id === mapSourceId)?.name.split(' (')[0]} → {MAP_NODES.find(n => n.id === mapDestId)?.name.split(' (')[0]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Map destination configurations */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[#ef8d15] mb-1">
                <MapPin className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Campus Pathfinder</span>
              </div>
              <h3 className="text-xl font-bold">스마트 캠퍼스 맵 & 도보 길찾기</h3>
              <p className="text-xs text-neutral-500 dark:text-zinc-400 leading-relaxed mt-2">
                학우 여러분의 넓은 캠퍼스 이탈을 미연에 방지합니다. 강의실 건물 간 도보 이동시간, 우회 성곽길 및 실시간 셔틀 정차 소요 시간을 예측합니다.
              </p>
            </div>

            {/* Selector boxes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 block">1. 출발지 건물 선택</label>
                <select
                  value={mapSourceId}
                  onChange={(e) => {
                    setMapSourceId(e.target.value);
                    setComputedPath([]);
                  }}
                  className="w-full text-xs font-semibold bg-neutral-50 dark:bg-zinc-800 p-3 rounded-xl border border-neutral-250 dark:border-zinc-700 text-neutral-800 dark:text-zinc-100"
                >
                  {MAP_NODES.map(node => (
                    <option key={node.id} value={node.id}>{node.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 block">2. 도착 목적지 선택</label>
                <select
                  value={mapDestId}
                  onChange={(e) => {
                    setMapDestId(e.target.value);
                    setComputedPath([]);
                  }}
                  className="w-full text-xs font-semibold bg-neutral-50 dark:bg-zinc-800 p-3 rounded-xl border border-neutral-250 dark:border-zinc-700 text-neutral-800 dark:text-zinc-100"
                >
                  {MAP_NODES.map(node => (
                    <option key={node.id} value={node.id}>{node.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              disabled={calculatingPath}
              onClick={handleComputeRoute}
              className="w-full py-3 bg-[#002155] hover:bg-[#003580] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              {calculatingPath ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>최적 보행 알고리즘 가동 중...</span>
                </>
              ) : (
                <>
                  <Compass className="w-4 h-4 text-[#fec73b]" />
                  <span>최단 도보 경로 및 정시간 예측하기</span>
                </>
              )}
            </button>

            {/* Path description list */}
            {computedPath.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-[#fbf9f8] dark:bg-zinc-950 p-4 rounded-2xl border border-neutral-100 dark:border-zinc-800 space-y-3"
              >
                <div className="flex items-center gap-1.5 text-xs text-[#002155] dark:text-[#7fa1f2] font-bold">
                  <Check className="w-4 h-4" />
                  <span>예상 도보 소요 시간: 약 6분 (평군 기준)</span>
                </div>
                
                <div className="space-y-2 text-[11px] font-notoSans text-neutral-600 dark:text-zinc-300">
                  {computedPath.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-[#fec73b] text-[#002155] font-bold text-[9px] rounded-full flex items-center justify-center">
                        {sIdx + 1}
                      </span>
                      <span className="font-semibold">{step}</span>
                      {sIdx < computedPath.length - 1 && (
                        <span className="text-neutral-400 font-mono text-[10px]">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="bg-neutral-50 dark:bg-zinc-800 p-4 rounded-2xl text-[11px] leading-relaxed text-neutral-400">
              * 우지나, 벚꽃 낙화구역 등 안전 가이드라인이 자동 덧씌워진 스마트 도보망입니다.
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
