/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Notice {
  id: string;
  category: '학사' | '취업' | '일반' | '장학' | '중요';
  title: string;
  summary: string;
  content: string;
  date: string;
  author: string;
  views: number;
  urgent?: boolean;
}

export interface Club {
  id: string;
  name: string;
  category: '공연/예술' | '체육/레저' | '학술/교양' | '봉사/사회';
  description: string;
  room: string;
  count: number;
}

export interface StudyRoom {
  id: string;
  name: string;
  totalSeats: number;
  occupiedSeats: number;
  status: '여유' | '보통' | '혼잡';
}

export interface ShuttleLine {
  id: string;
  name: string;
  color: string;
  stations: string[];
  currentBusIndex: number; // Index in stations where bus is currently
  estimatedMin: number;
}

export interface MenuItem {
  corner: string;
  menu: string;
  price: string;
}
