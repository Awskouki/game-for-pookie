/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Level, Collectible, Enemy, PowerUp, GameObject, PuzzleType } from '../types';
import { generatePuzzle } from './puzzleGenerator';

export function generateLevel(levelId: number): Level {
  const themes = [
    { name: 'Abandoned Laboratory', colors: ['#1e1b4b', '#312e81', '#1e293b'] },
    { name: 'Haunted Asylum', colors: ['#1f2937', '#374151', '#111827'] },
    { name: 'Cursed Catacombs', colors: ['#450a0a', '#7f1d1d', '#1c1917'] },
    { name: 'Nightmare Dimension', colors: ['#14532d', '#166534', '#052e16'] },
    { name: 'The Void', colors: ['#0c0a09', '#1c1917', '#292524'] },
  ];

  const theme = themes[Math.min(levelId - 1, themes.length - 1)];
  const worldWidth = 2000 + (levelId * 500);
  const difficulty = levelId;

  // Generate gates
  const gateCount = 3 + levelId;
  const gates: GameObject[] = [];
  const gateSpacing = worldWidth / (gateCount + 1);

  for (let i = 0; i < gateCount; i++) {
    gates.push({
      x: gateSpacing * (i + 1),
      y: 0,
      width: 24,
      height: 400,
      color: getGateColor(i),
      type: 'gate',
      gateId: i + 1,
      label: getGateLabel(i)
    });
  }

  // Generate collectibles (MINIMAL - just souls/keys)
  const collectibles: Collectible[] = [];
  const collectibleCount = 5 + (levelId * 3); // Much fewer, just essential items
  
  for (let i = 0; i < collectibleCount; i++) {
    collectibles.push({
      id: `collectible-${levelId}-${i}`,
      x: Math.random() * (worldWidth - 100) + 50,
      y: Math.random() * 250 + 50,
      type: 'crystal', // Only dark crystals (souls)
      collected: false,
      value: 100, // Higher value since fewer items
      radius: 15
    });
  }

  // Generate enemies (MINIMAL - just atmosphere)
  const enemies: Enemy[] = [];
  const enemyCount = 0 + Math.floor(levelId / 3); // Very few enemies, mostly empty rooms
  
  for (let i = 0; i < enemyCount; i++) {
    const x = Math.random() * (worldWidth - 200) + 100;
    const patrolDistance = 100 + Math.random() * 100;
    
    enemies.push({
      id: `enemy-${levelId}-${i}`,
      x,
      y: 300 + Math.random() * 50,
      width: 32,
      height: 32,
      type: 'patrol',
      speed: 0.3 + Math.random() * 0.3, // Very slow
      direction: Math.random() > 0.5 ? 1 : -1,
      patrolStart: x - patrolDistance / 2,
      patrolEnd: x + patrolDistance / 2,
      active: true
    });
  }

  // NO POWER-UPS - removed for cleaner aesthetic
  const powerUps: PowerUp[] = [];

  // Generate obstacles (ESCAPE ROOM STYLE - structured rooms and corridors)
  const obstacles: GameObject[] = [];
  
  // Create room structures with corridors
  const roomCount = gateCount; // One room per gate
  const roomWidth = worldWidth / (roomCount + 1);
  
  for (let i = 0; i < roomCount; i++) {
    const roomX = roomWidth * i + 100;
    const roomCenterX = roomX + roomWidth / 2;
    
    // Create room walls (but leave openings for gates)
    // Left wall
    obstacles.push({
      x: roomX,
      y: 0,
      width: 30,
      height: 150,
      color: '#1c1917',
      type: 'obstacle'
    });
    obstacles.push({
      x: roomX,
      y: 250,
      width: 30,
      height: 150,
      color: '#1c1917',
      type: 'obstacle'
    });
    
    // Right wall (partial, gate goes here)
    obstacles.push({
      x: roomX + roomWidth - 30,
      y: 0,
      width: 30,
      height: 150,
      color: '#1c1917',
      type: 'obstacle'
    });
    obstacles.push({
      x: roomX + roomWidth - 30,
      y: 250,
      width: 30,
      height: 150,
      color: '#1c1917',
      type: 'obstacle'
    });
    
    // Add platforms and obstacles inside rooms
    if (Math.random() > 0.5) {
      // Platform in middle
      obstacles.push({
        x: roomCenterX - 60,
        y: 250,
        width: 120,
        height: 20,
        color: '#292524',
        type: 'platform'
      });
    }
    
    // Add decorative pillars
    if (Math.random() > 0.6) {
      obstacles.push({
        x: roomCenterX - 100,
        y: 300,
        width: 25,
        height: 100,
        color: '#1c1917',
        type: 'obstacle'
      });
    }
    if (Math.random() > 0.6) {
      obstacles.push({
        x: roomCenterX + 75,
        y: 300,
        width: 25,
        height: 100,
        color: '#1c1917',
        type: 'obstacle'
      });
    }
  }
  
  // Add corridor connectors between rooms
  for (let i = 0; i < roomCount - 1; i++) {
    const corridorX = roomWidth * (i + 1);
    
    // Top corridor wall
    obstacles.push({
      x: corridorX - 50,
      y: 0,
      width: 100,
      height: 100,
      color: '#0c0a09',
      type: 'obstacle'
    });
    
    // Bottom corridor wall
    obstacles.push({
      x: corridorX - 50,
      y: 300,
      width: 100,
      height: 100,
      color: '#0c0a09',
      type: 'obstacle'
    });
  }

  // Generate puzzles for each gate
  const puzzleTypes: PuzzleType[] = ['math', 'chemistry', 'physics', 'logic'];
  const puzzles = gates.map((gate, index) => {
    const type = puzzleTypes[index % puzzleTypes.length];
    const puzzle = generatePuzzle(type, difficulty);
    puzzle.id = gate.gateId!; // Match puzzle ID to gate ID!
    return puzzle;
  });

  return {
    id: levelId,
    name: theme.name,
    theme: theme.name,
    backgroundColor: theme.colors,
    worldWidth,
    gates,
    collectibles,
    enemies,
    powerUps,
    obstacles,
    puzzles
  };
}

function getGateColor(index: number): string {
  const colors = ['#7f1d1d', '#991b1b', '#b91c1c', '#dc2626', '#ef4444', '#f87171'];
  return colors[index % colors.length];
}

function getGateLabel(index: number): string {
  const labels = ['Blood', 'Death', 'Fear', 'Pain', 'Doom', 'Terror'];
  return labels[index % labels.length];
}
