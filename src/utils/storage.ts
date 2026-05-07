/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameProgress } from '../types';

const STORAGE_KEY = 'aura-adventure-progress';

export function saveProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export function loadProgress(): GameProgress | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load progress:', error);
  }
  return null;
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear progress:', error);
  }
}

export function getInitialProgress(): GameProgress {
  return {
    currentLevel: 1,
    unlockedLevels: [1],
    totalScore: 0,
    achievements: [],
    completedPuzzles: []
  };
}
