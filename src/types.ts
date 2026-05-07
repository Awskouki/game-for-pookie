/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GameState = 'title' | 'playing' | 'puzzle' | 'victory' | 'paused' | 'levelSelect' | 'gameOver';
export type PuzzleType = 'math' | 'chemistry' | 'physics' | 'logic';
export type PowerUpType = 'speed' | 'invincibility' | 'doubleJump' | 'shield';
export type CollectibleType = 'coin' | 'star' | 'potion' | 'crystal';
export type EnemyType = 'patrol' | 'chase' | 'stationary';

export interface Puzzle {
  id: number;
  question: string;
  answer: string;
  options: string[];
  type: PuzzleType;
  prompt: string;
  difficulty: number;
  hint?: string;
}

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  type: 'gate' | 'decoration' | 'obstacle' | 'platform';
  gateId?: number;
  label?: string;
}

export interface Collectible {
  id: string;
  x: number;
  y: number;
  type: CollectibleType;
  collected: boolean;
  value: number;
  radius: number;
}

export interface Enemy {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: EnemyType;
  speed: number;
  direction: number;
  patrolStart?: number;
  patrolEnd?: number;
  active: boolean;
}

export interface PowerUp {
  id: string;
  x: number;
  y: number;
  type: PowerUpType;
  collected: boolean;
  duration: number;
}

export interface ActivePowerUp {
  type: PowerUpType;
  endTime: number;
}

export interface PlayerState {
  x: number;
  y: number;
  velocityY: number;
  health: number;
  maxHealth: number;
  score: number;
  lives: number;
  isJumping: boolean;
  canDoubleJump: boolean;
  hasDoubleJumped: boolean;
  isInvincible: boolean;
  hasShield: boolean;
}

export interface Checkpoint {
  x: number;
  y: number;
  gateId: number;
  score: number;
}

export interface Level {
  id: number;
  name: string;
  theme: string;
  backgroundColor: string[];
  worldWidth: number;
  gates: GameObject[];
  collectibles: Collectible[];
  enemies: Enemy[];
  powerUps: PowerUp[];
  obstacles: GameObject[];
  puzzles: Puzzle[];
}

export interface GameProgress {
  currentLevel: number;
  unlockedLevels: number[];
  totalScore: number;
  achievements: string[];
  completedPuzzles: number[];
  lastCheckpoint?: Checkpoint;
}
