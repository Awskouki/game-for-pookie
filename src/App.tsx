/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Enhanced Aura's Alchemical Adventure
 * Features: Dynamic levels, collectibles, enemies, power-ups, jumping, particles, sound, save/load
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Beaker, Brain, Sparkles, Trophy, ArrowRight, Heart, 
  Zap, Shield, Star, Coins, Pause, Play, Volume2, VolumeX,
  RotateCcw, Home, ChevronRight, Lightbulb, Maximize, Minimize
} from 'lucide-react';
import { 
  GameState, PlayerState, Level, Puzzle, ActivePowerUp, GameProgress 
} from './types';
import { generateLevel } from './utils/levelGenerator';
import { audioSystem } from './utils/audioSystem';
import { ParticleSystem } from './utils/particles';
import { saveProgress, loadProgress, getInitialProgress } from './utils/storage';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PLAYER_SIZE = 48;
const SPEED = 7; // Faster movement (was 5)
const JUMP_FORCE = 14; // Higher jumps (was 12)
const GRAVITY = 0.5; // Lighter gravity (was 0.6)
const GROUND_Y = CANVAS_HEIGHT - PLAYER_SIZE - 10;

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(Date.now());
  const particleSystemRef = useRef(new ParticleSystem());
  
  const [gameState, setGameState] = useState<GameState>('title');
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [unlockedGates, setUnlockedGates] = useState<number[]>([]);
  const [cameraX, setCameraX] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [combo, setCombo] = useState(0);
  const [comboTimer, setComboTimer] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [puzzleTimer, setPuzzleTimer] = useState(20);
  const puzzleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastWrongAnswer, setLastWrongAnswer] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  
  const [player, setPlayer] = useState<PlayerState>({
    x: 50, y: GROUND_Y, velocityY: 0, health: 5, maxHealth: 5, // More health!
    score: 0, lives: 3, isJumping: false, canDoubleJump: true, // 3 lives per level!
    hasDoubleJumped: false, isInvincible: false, hasShield: false
  });
  
  const [activePowerUps, setActivePowerUps] = useState<ActivePowerUp[]>([]);
  const [progress, setProgress] = useState<GameProgress>(getInitialProgress());
  const [currentCheckpoint, setCurrentCheckpoint] = useState<{x: number, y: number, score: number} | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const keysPressed = useRef<Record<string, boolean>>({});

  useEffect(() => { audioSystem.initialize(); }, []);
  
  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    const saved = loadProgress();
    if (saved) setProgress(saved);
  }, []);

  useEffect(() => {
    if (gameState === 'playing' && !currentLevel) {
      const level = generateLevel(progress.currentLevel);
      setCurrentLevel(level);
      setUnlockedGates([]);
      
      // Check if there's a checkpoint to restore
      if (progress.lastCheckpoint && progress.lastCheckpoint.gateId > 0) {
        setPlayer(prev => ({ 
          ...prev, 
          x: progress.lastCheckpoint!.x, 
          y: GROUND_Y, 
          score: progress.lastCheckpoint!.score, 
          health: 5, 
          canDoubleJump: true 
        }));
        // Unlock gates up to checkpoint
        const unlockedGateIds = Array.from({length: progress.lastCheckpoint.gateId}, (_, i) => i + 1);
        setUnlockedGates(unlockedGateIds);
        setCurrentCheckpoint({
          x: progress.lastCheckpoint.x,
          y: GROUND_Y,
          score: progress.lastCheckpoint.score
        });
      } else {
        // Start fresh
        setPlayer(prev => ({ ...prev, x: 50, y: GROUND_Y, score: 0, health: 5, canDoubleJump: true, lives: 3 }));
        setCurrentCheckpoint(null);
      }
    }
  }, [gameState, progress.currentLevel, currentLevel, progress.lastCheckpoint]);

  useEffect(() => {
    if (comboTimer) {
      const timer = setTimeout(() => { setCombo(0); setComboTimer(null); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [comboTimer]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setActivePowerUps(prev => prev.filter(p => p.endTime > now));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Puzzle timer countdown
  useEffect(() => {
    if (gameState === 'puzzle' && puzzleTimer > 0) {
      puzzleTimerRef.current = setTimeout(() => {
        setPuzzleTimer(prev => prev - 1);
      }, 1000);
    } else if (gameState === 'puzzle' && puzzleTimer === 0) {
      // Time's up! Lose a heart
      setPlayer(prev => {
        const newHealth = prev.health - 1;
        if (newHealth <= 0) {
          // Lost all health - lose a life
          const newLives = prev.lives - 1;
          if (newLives <= 0) {
            // Game over - no more lives
            setGameState('gameOver');
            return { ...prev, health: 0, lives: 0 };
          } else {
            // Respawn at checkpoint with full health
            respawnAtCheckpoint();
            return { ...prev, health: 5, lives: newLives };
          }
        } else {
          setGameState('playing');
          setCurrentPuzzle(null);
          return { ...prev, health: newHealth };
        }
      });
      if (soundEnabled) audioSystem.playSound('hurt');
    }
    return () => {
      if (puzzleTimerRef.current) {
        clearTimeout(puzzleTimerRef.current);
      }
    };
  }, [gameState, puzzleTimer, soundEnabled]);

  const checkCollectibleCollision = useCallback((collectible: any) => {
    const dx = player.x + PLAYER_SIZE / 2 - collectible.x;
    const dy = player.y + PLAYER_SIZE / 2 - collectible.y;
    return Math.sqrt(dx * dx + dy * dy) < PLAYER_SIZE / 2 + collectible.radius;
  }, [player.x, player.y]);

  const checkEnemyCollision = useCallback((enemy: any) => {
    return player.x < enemy.x + enemy.width && player.x + PLAYER_SIZE > enemy.x &&
           player.y < enemy.y + enemy.height && player.y + PLAYER_SIZE > enemy.y;
  }, [player.x, player.y]);

  const checkPowerUpCollision = useCallback((powerUp: any) => {
    const dx = player.x + PLAYER_SIZE / 2 - powerUp.x;
    const dy = player.y + PLAYER_SIZE / 2 - powerUp.y;
    return Math.sqrt(dx * dx + dy * dy) < PLAYER_SIZE / 2 + 20;
  }, [player.x, player.y]);

  const respawnAtCheckpoint = useCallback(() => {
    if (currentCheckpoint) {
      setPlayer(prev => ({
        ...prev,
        x: currentCheckpoint.x,
        y: currentCheckpoint.y,
        velocityY: 0,
        health: 5,
        score: currentCheckpoint.score,
        isJumping: false,
        hasDoubleJumped: false
      }));
    } else {
      // No checkpoint, respawn at start
      setPlayer(prev => ({
        ...prev,
        x: 50,
        y: GROUND_Y,
        velocityY: 0,
        health: 5,
        isJumping: false,
        hasDoubleJumped: false
      }));
    }
    setGameState('playing');
  }, [currentCheckpoint]);

  const update = useCallback(() => {
    if (gameState !== 'playing' || !currentLevel) return;

    const now = Date.now();
    const deltaTime = (now - lastTimeRef.current) / 1000;
    lastTimeRef.current = now;

    let { x, y, velocityY, isJumping, hasDoubleJumped } = player;
    const hasSpeed = activePowerUps.some(p => p.type === 'speed');
    const currentSpeed = hasSpeed ? SPEED * 1.5 : SPEED;

    const dx = (keysPressed.current['ArrowRight'] || keysPressed.current['d'] ? currentSpeed : 0) -
               (keysPressed.current['ArrowLeft'] || keysPressed.current['a'] ? currentSpeed : 0);
    
    let nextX = Math.max(0, Math.min(x + dx, currentLevel.worldWidth - PLAYER_SIZE));

    if ((keysPressed.current['ArrowUp'] || keysPressed.current['w'] || keysPressed.current[' ']) && !isJumping) {
      velocityY = -JUMP_FORCE;
      isJumping = true;
      hasDoubleJumped = false;
      if (soundEnabled) audioSystem.playSound('jump');
    } else if ((keysPressed.current['ArrowUp'] || keysPressed.current['w'] || keysPressed.current[' ']) && 
               player.canDoubleJump && !hasDoubleJumped && isJumping) {
      velocityY = -JUMP_FORCE;
      hasDoubleJumped = true;
      if (soundEnabled) audioSystem.playSound('jump');
      particleSystemRef.current.emit(x + PLAYER_SIZE / 2, y + PLAYER_SIZE, 8, 'trail');
    }

    velocityY += GRAVITY;
    let nextY = y + velocityY;

    // Ground collision
    let onGround = false;
    if (nextY >= GROUND_Y) {
      nextY = GROUND_Y;
      velocityY = 0;
      isJumping = false;
      hasDoubleJumped = false;
      onGround = true;
    }

    // Platform collision detection
    if (!onGround) {
      currentLevel.obstacles.forEach(obstacle => {
        if (obstacle.type === 'platform' || obstacle.type === 'obstacle') {
          // Check if player is falling onto platform from above
          const playerBottom = nextY + PLAYER_SIZE;
          const playerTop = nextY;
          const playerLeft = nextX;
          const playerRight = nextX + PLAYER_SIZE;
          
          const platformTop = obstacle.y;
          const platformBottom = obstacle.y + obstacle.height;
          const platformLeft = obstacle.x;
          const platformRight = obstacle.x + obstacle.width;
          
          // Horizontal overlap check
          const horizontalOverlap = playerRight > platformLeft && playerLeft < platformRight;
          
          // Landing on top of platform
          if (horizontalOverlap && 
              velocityY > 0 && 
              y + PLAYER_SIZE <= platformTop && 
              playerBottom >= platformTop && 
              playerBottom <= platformTop + 20) {
            nextY = platformTop - PLAYER_SIZE;
            velocityY = 0;
            isJumping = false;
            hasDoubleJumped = false;
            onGround = true;
          }
          
          // Hitting platform from below
          if (horizontalOverlap && 
              velocityY < 0 && 
              playerTop <= platformBottom && 
              playerTop >= platformBottom - 20) {
            nextY = platformBottom;
            velocityY = 0;
          }
          
          // Side collisions (prevent walking through platforms)
          if (playerBottom > platformTop + 10 && playerTop < platformBottom - 10) {
            // Coming from left
            if (x + PLAYER_SIZE <= platformLeft && nextX + PLAYER_SIZE > platformLeft) {
              nextX = platformLeft - PLAYER_SIZE;
            }
            // Coming from right
            if (x >= platformRight && nextX < platformRight) {
              nextX = platformRight;
            }
          }
        }
      });
    }

    const collidingGate = currentLevel.gates.find(gate => 
      !unlockedGates.includes(gate.gateId!) &&
      nextX + PLAYER_SIZE > gate.x && nextX < gate.x + gate.width
    );

    if (collidingGate) {
      const puzzle = currentLevel.puzzles.find(p => p.id === collidingGate.gateId);
      if (puzzle) {
        setGameState('puzzle');
        setCurrentPuzzle(puzzle);
        setShowHint(false);
        setWrongAttempts(0);
        setPuzzleTimer(20); // Start 20 second timer
        return;
      }
    }

    currentLevel.collectibles.forEach(collectible => {
      if (!collectible.collected && checkCollectibleCollision(collectible)) {
        collectible.collected = true;
        const comboMultiplier = 1 + (combo * 0.1);
        const points = Math.floor(collectible.value * comboMultiplier);
        setPlayer(prev => ({ ...prev, score: prev.score + points }));
        setCombo(prev => prev + 1);
        setComboTimer(Date.now());
        if (soundEnabled) audioSystem.playSound('collect');
        particleSystemRef.current.emit(collectible.x, collectible.y, 12, 'collect');
      }
    });

    currentLevel.powerUps.forEach(powerUp => {
      if (!powerUp.collected && checkPowerUpCollision(powerUp)) {
        powerUp.collected = true;
        setActivePowerUps(prev => [...prev, { type: powerUp.type, endTime: Date.now() + powerUp.duration }]);
        if (powerUp.type === 'doubleJump') setPlayer(prev => ({ ...prev, canDoubleJump: true }));
        else if (powerUp.type === 'shield') setPlayer(prev => ({ ...prev, hasShield: true }));
        else if (powerUp.type === 'invincibility') setPlayer(prev => ({ ...prev, isInvincible: true }));
        if (soundEnabled) audioSystem.playSound('powerup');
        particleSystemRef.current.emit(powerUp.x, powerUp.y, 20, 'powerup');
      }
    });

    const isInvincible = activePowerUps.some(p => p.type === 'invincibility') || player.isInvincible;
    currentLevel.enemies.forEach(enemy => {
      if (enemy.active && checkEnemyCollision(enemy)) {
        if (!isInvincible) {
          // Damage and knockback
          nextX = x - 80; // Push player back
          setPlayer(prev => {
            const newHealth = prev.health - 1;
            if (newHealth <= 0) {
              // Lost all health - lose a life
              const newLives = prev.lives - 1;
              if (newLives <= 0) {
                // Game over - no more lives
                setGameState('gameOver');
                return { ...prev, health: 0, lives: 0 };
              } else {
                // Respawn at checkpoint with full health
                setTimeout(() => respawnAtCheckpoint(), 100);
                return { ...prev, health: 5, lives: newLives };
              }
            }
            return { ...prev, health: newHealth };
          });
          if (soundEnabled) audioSystem.playSound('hurt');
          particleSystemRef.current.emit(x + PLAYER_SIZE / 2, y + PLAYER_SIZE / 2, 8, 'hurt');
        }
      }
    });

    currentLevel.enemies.forEach(enemy => {
      if (enemy.type === 'patrol') {
        enemy.x += enemy.speed * enemy.direction;
        if (enemy.x <= enemy.patrolStart! || enemy.x >= enemy.patrolEnd!) enemy.direction *= -1;
      } else if (enemy.type === 'chase') {
        const dx = player.x - enemy.x;
        if (Math.abs(dx) < 300) enemy.x += Math.sign(dx) * enemy.speed * 0.5;
      }
    });

    if (dx !== 0 && Math.random() > 0.7) {
      particleSystemRef.current.emit(x + PLAYER_SIZE / 2, y + PLAYER_SIZE, 1, 'trail');
    }

    particleSystemRef.current.update(deltaTime);

    setPlayer(prev => ({ ...prev, x: nextX, y: nextY, velocityY, isJumping, hasDoubleJumped }));

    if (nextX > CANVAS_WIDTH / 2) {
      setCameraX(Math.min(nextX - CANVAS_WIDTH / 2, currentLevel.worldWidth - CANVAS_WIDTH));
    } else {
      setCameraX(0);
    }

    if (nextX > currentLevel.worldWidth - 100) {
      setGameState('victory');
      if (soundEnabled) audioSystem.playSound('victory');
      const newProgress = {
        ...progress,
        totalScore: progress.totalScore + player.score,
        unlockedLevels: progress.unlockedLevels.includes(progress.currentLevel + 1) 
          ? progress.unlockedLevels 
          : [...progress.unlockedLevels, progress.currentLevel + 1]
      };
      setProgress(newProgress);
      saveProgress(newProgress);
    }
  }, [gameState, currentLevel, player, unlockedGates, activePowerUps, checkCollectibleCollision, 
      checkEnemyCollision, checkPowerUpCollision, soundEnabled, combo, progress]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      if (e.key === 'Escape' && gameState === 'playing') setGameState('paused');
    };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.key] = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  useEffect(() => {
    const animate = () => {
      update();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    if (gameState === 'playing') animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [update, gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !currentLevel) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.save();
    ctx.translate(-cameraX, 0);

    const grad = ctx.createLinearGradient(0, 0, currentLevel.worldWidth, 0);
    currentLevel.backgroundColor.forEach((color, i) => {
      grad.addColorStop(i / (currentLevel.backgroundColor.length - 1), color);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, currentLevel.worldWidth, CANVAS_HEIGHT);

    ctx.fillStyle = '#ec489955';
    for(let i=0; i<60; i++) {
        ctx.beginPath();
        ctx.arc((i * 137) % currentLevel.worldWidth, (i * 221) % CANVAS_HEIGHT, 3, 0, Math.PI*2);
        ctx.fill();
    }

    currentLevel.obstacles.forEach(obstacle => {
      ctx.fillStyle = obstacle.color;
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Draw Collectibles (Dark Souls/Crystals only)
    currentLevel.collectibles.forEach(collectible => {
      if (collectible.collected) return;
      const pulse = Math.sin(Date.now() / 200) * 2;
      ctx.save();
      ctx.translate(collectible.x, collectible.y);
      
      // Dark crystal (soul)
      ctx.fillStyle = '#7f1d1d'; // Dark red
      ctx.shadowColor = '#dc2626';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        const x = Math.cos(angle) * (collectible.radius + pulse);
        const y = Math.sin(angle) * (collectible.radius + pulse);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      
      ctx.restore();
    });

    // NO POWER-UPS - removed for cleaner aesthetic

    currentLevel.enemies.forEach(enemy => {
      if (!enemy.active) return;
      ctx.fillStyle = enemy.type === 'chase' ? '#ef4444' : '#f97316';
      ctx.beginPath();
      ctx.roundRect(enemy.x, enemy.y, enemy.width, enemy.height, [8]);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.fillRect(enemy.x + 8, enemy.y + 8, 8, 8);
      ctx.fillRect(enemy.x + enemy.width - 16, enemy.y + 8, 8, 8);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(enemy.x + 10, enemy.y + 10, 4, 4);
      ctx.fillRect(enemy.x + enemy.width - 14, enemy.y + 10, 4, 4);
    });

    currentLevel.gates.forEach(gate => {
      const isUnlocked = unlockedGates.includes(gate.gateId!);
      ctx.fillStyle = gate.color;
      ctx.globalAlpha = isUnlocked ? 0.2 : 1;
      ctx.fillRect(gate.x, gate.y, gate.width, gate.height);
      if (!isUnlocked) {
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.font = 'bold 10px "Press Start 2P"';
        ctx.fillText(`${gate.label}`, gate.x - 20, gate.y + 62);
        ctx.fillStyle = '#1e293b';
        ctx.fillText(`${gate.label}`, gate.x - 20, gate.y + 60);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.strokeRect(gate.x + 4, gate.y + 4, gate.width - 8, gate.height - 8);
      } else {
        // Draw checkpoint marker for unlocked gates
        ctx.fillStyle = '#22c55e';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(gate.x + gate.width / 2, gate.y + 50, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('✓', gate.x + gate.width / 2 - 6, gate.y + 57);
      }
      ctx.globalAlpha = 1;
    });

    const px = player.x;
    const py = player.y;
    
    if (player.hasShield) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(px + PLAYER_SIZE / 2, py + PLAYER_SIZE / 2, PLAYER_SIZE / 2 + 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    if (player.isInvincible || activePowerUps.some(p => p.type === 'invincibility')) {
      ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 100) * 0.3;
    }
    
    ctx.fillStyle = '#db2777';
    ctx.beginPath();
    ctx.roundRect(px, py, PLAYER_SIZE, PLAYER_SIZE, [16, 16, 4, 4]);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.fillRect(px + 10, py + 12, 10, 10);
    ctx.fillRect(px + 28, py + 12, 10, 10);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px + 14, py + 16, 4, 4);
    ctx.fillRect(px + 32, py + 16, 4, 4);

    ctx.fillStyle = '#f9a8d4';
    ctx.beginPath();
    ctx.arc(px + 10, py + 28, 4, 0, Math.PI*2);
    ctx.arc(px + 38, py + 28, 4, 0, Math.PI*2);
    ctx.fill();

    ctx.globalAlpha = 1;
    particleSystemRef.current.render(ctx, cameraX);
    ctx.restore();
  }, [player, cameraX, unlockedGates, currentLevel, activePowerUps]);

  function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, points: number) {
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = (Math.PI * i) / points - Math.PI / 2;
      const r = i % 2 === 0 ? radius : radius / 2;
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  const handlePuzzleChoice = (choice: string) => {
    if (!currentPuzzle) return;
    
    // Clear the timer
    if (puzzleTimerRef.current) {
      clearTimeout(puzzleTimerRef.current);
    }
    
    if (choice === currentPuzzle.answer) {
      setUnlockedGates(prev => [...prev, currentPuzzle.id]);
      const comboBonus = combo * 100;
      const timeBonus = puzzleTimer * 10; // 10 points per second remaining
      const newScore = player.score + 500 + comboBonus + timeBonus;
      
      setPlayer(prev => ({ ...prev, score: newScore }));
      setCombo(prev => prev + 1);
      setComboTimer(Date.now());
      
      // Update stats - correct answer
      const newProgress = {
        ...progress,
        completedPuzzles: [...progress.completedPuzzles, currentPuzzle.id],
        lastCheckpoint: {
          x: currentLevel?.gates.find(g => g.gateId === currentPuzzle.id)?.x! + 74,
          y: GROUND_Y,
          gateId: currentPuzzle.id,
          score: newScore
        },
        stats: {
          totalPuzzles: (progress.stats?.totalPuzzles || 0) + 1,
          correctAnswers: (progress.stats?.correctAnswers || 0) + 1,
          wrongAnswers: progress.stats?.wrongAnswers || 0,
          fastestTime: Math.min(progress.stats?.fastestTime || 20, 20 - puzzleTimer),
          mathCorrect: (progress.stats?.mathCorrect || 0) + (currentPuzzle.type === 'math' ? 1 : 0),
          chemistryCorrect: (progress.stats?.chemistryCorrect || 0) + (currentPuzzle.type === 'chemistry' ? 1 : 0),
          physicsCorrect: (progress.stats?.physicsCorrect || 0) + (currentPuzzle.type === 'physics' ? 1 : 0),
          logicCorrect: (progress.stats?.logicCorrect || 0) + (currentPuzzle.type === 'logic' ? 1 : 0),
        }
      };
      
      // Create checkpoint at this gate
      const gate = currentLevel?.gates.find(g => g.gateId === currentPuzzle.id);
      if (gate) {
        const checkpoint = {
          x: gate.x + gate.width + 50,
          y: GROUND_Y,
          score: newScore
        };
        setCurrentCheckpoint(checkpoint);
      }
      
      setProgress(newProgress);
      saveProgress(newProgress);
      setGameState('playing');
      setCurrentPuzzle(null);
      setShowExplanation(false);
      setLastWrongAnswer(null);
      if (soundEnabled) audioSystem.playSound('gate');
    } else {
      // Wrong answer - show explanation
      setWrongAttempts(prev => prev + 1);
      setPlayer(prev => ({ ...prev, score: Math.max(0, prev.score - 50) }));
      setLastWrongAnswer(choice);
      setShowExplanation(true);
      
      // Update stats - wrong answer
      const newProgress = {
        ...progress,
        stats: {
          ...progress.stats,
          totalPuzzles: (progress.stats?.totalPuzzles || 0) + 1,
          correctAnswers: progress.stats?.correctAnswers || 0,
          wrongAnswers: (progress.stats?.wrongAnswers || 0) + 1,
          fastestTime: progress.stats?.fastestTime || 20,
          mathCorrect: progress.stats?.mathCorrect || 0,
          chemistryCorrect: progress.stats?.chemistryCorrect || 0,
          physicsCorrect: progress.stats?.physicsCorrect || 0,
          logicCorrect: progress.stats?.logicCorrect || 0,
        }
      };
      setProgress(newProgress);
      saveProgress(newProgress);
      
      if (soundEnabled) audioSystem.playSound('wrong');
      if (wrongAttempts >= 2) setShowHint(true);
    }
  };

  const startLevel = (levelId: number) => {
    const newProgress = {
      ...progress,
      currentLevel: levelId,
      lastCheckpoint: undefined // Clear checkpoint when starting new level
    };
    setProgress(newProgress);
    saveProgress(newProgress);
    
    setCurrentLevel(null);
    setGameState('playing');
    setPlayer({
      x: 50, y: GROUND_Y, velocityY: 0, health: 5, maxHealth: 5, // More health
      score: 0, lives: 3, isJumping: false, canDoubleJump: true, // 3 lives per level
      hasDoubleJumped: false, isInvincible: false, hasShield: false
    });
    setActivePowerUps([]);
    setCombo(0);
    setCurrentCheckpoint(null);
    particleSystemRef.current.clear();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Mobile touch controls
  const handleTouchControl = (key: string, pressed: boolean) => {
    keysPressed.current[key] = pressed;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-red-950 to-black p-2 font-sans select-none overflow-hidden">
      
      <AnimatePresence>
        {gameState === 'playing' && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-[95vw] flex items-center justify-between mb-4 px-6 py-4 bg-slate-900/90 backdrop-blur-xl rounded-[2rem] shadow-[0_0_50px_rgba(220,38,38,0.3)] border-4 border-red-900"
          >
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                {Array.from({ length: player.maxHealth }).map((_, i) => (
                  <Heart 
                    key={i} 
                    className={`w-6 h-6 ${i < player.health ? 'text-red-600 fill-red-600 flicker-animation' : 'text-gray-700'}`} 
                  />
                ))}
              </div>
              <div className="flex flex-col">
                <span className="font-game text-[8px] text-red-500">Level {progress.currentLevel}</span>
                <span className="font-bold text-red-200 text-sm">{currentLevel?.name}</span>
              </div>
              <div className="flex items-center gap-2 bg-red-950/50 px-3 py-2 rounded-xl border border-red-900">
                <span className="font-game text-[10px] text-red-400">Lives:</span>
                <span className="font-bold text-red-300 text-lg">{player.lives}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-red-950/50 px-4 py-2 rounded-xl border border-red-900">
                <Coins className="w-5 h-5 text-amber-600" />
                <span className="font-bold text-amber-500">{player.score}</span>
              </div>
              
              {combo > 1 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 bg-red-950/50 px-4 py-2 rounded-xl border border-red-900"
                >
                  <Sparkles className="w-5 h-5 text-red-500" />
                  <span className="font-bold text-red-400">x{combo}</span>
                </motion.div>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setGameState('paused')}
                className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors border border-red-900"
              >
                <Pause className="w-5 h-5 text-red-400" />
              </button>
              
              <button 
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  audioSystem.setVolume(soundEnabled ? 0 : 0.3);
                }}
                className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors border border-red-900"
              >
                {soundEnabled ? 
                  <Volume2 className="w-5 h-5 text-red-400" /> : 
                  <VolumeX className="w-5 h-5 text-red-400" />
                }
              </button>
              
              <button 
                onClick={toggleFullscreen}
                className="p-2 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors border border-red-900"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? 
                  <Minimize className="w-5 h-5 text-red-400" /> : 
                  <Maximize className="w-5 h-5 text-red-400" />
                }
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-[95vw] h-[85vh] bg-slate-950 rounded-[3rem] overflow-hidden shadow-[0_0_80px_rgba(220,38,38,0.5)] border-[12px] border-red-950 p-1">
        <canvas 
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="w-full h-full rounded-[2rem] bg-slate-900"
        />

        <AnimatePresence>
          {gameState === 'title' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-br from-slate-900 via-red-950 to-black backdrop-blur-md flex flex-col items-center justify-center text-center p-12 z-50"
            >
              <motion.div 
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-28 h-28 bg-gradient-to-br from-red-900 to-red-950 rounded-[2.5rem] mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(220,38,38,0.8)] border-4 border-red-800"
              >
                <Sparkles className="w-14 h-14 text-red-400 flicker-animation" />
              </motion.div>
              <h1 className="text-5xl font-black text-red-100 mb-4 font-game leading-relaxed tracking-tight horror-text">
                ESCAPE THE<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-900 text-6xl">NIGHTMARE</span>
              </h1>
              <p className="text-red-300 mb-12 max-w-md text-xl font-medium leading-relaxed">
                Trapped in a dark dimension. Solve advanced puzzles to unlock the gates and escape before it's too late...
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setGameState('levelSelect')}
                  className="cute-button flex items-center gap-3 text-xl px-10 py-5 shake-animation"
                >
                  BEGIN ESCAPE <ArrowRight className="w-6 h-6" />
                </button>
                {progress.totalScore > 0 && (
                  <button 
                    onClick={() => startLevel(progress.currentLevel)}
                    className="bg-red-800 text-white px-8 py-5 rounded-2xl font-bold transition-all duration-200 active:scale-95 hover:bg-red-900 border-b-4 border-red-950 shadow-lg text-xl"
                  >
                    Continue Escape
                  </button>
                )}
              </div>
              <div className="mt-8 text-red-400 text-sm">
                Souls Collected: {progress.totalScore}
              </div>
            </motion.div>
          )}

          {gameState === 'levelSelect' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 z-50"
            >
              <h2 className="text-3xl font-black text-red-400 mb-8 font-game horror-text">Choose Your Nightmare</h2>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[1, 2, 3, 4, 5].map(levelId => {
                  const isUnlocked = progress.unlockedLevels.includes(levelId);
                  return (
                    <motion.button
                      key={levelId}
                      whileHover={isUnlocked ? { scale: 1.05 } : {}}
                      whileTap={isUnlocked ? { scale: 0.95 } : {}}
                      onClick={() => isUnlocked && startLevel(levelId)}
                      disabled={!isUnlocked}
                      className={`p-8 rounded-3xl font-bold text-2xl transition-all ${
                        isUnlocked 
                          ? 'bg-gradient-to-br from-red-900 to-red-950 text-red-100 shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] border-2 border-red-800' 
                          : 'bg-slate-800 text-slate-600 cursor-not-allowed border-2 border-slate-700'
                      }`}
                    >
                      <div className="text-4xl mb-2">{isUnlocked ? '💀' : '🔒'}</div>
                      Level {levelId}
                    </motion.button>
                  );
                })}
              </div>
              <button 
                onClick={() => setGameState('title')}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 font-bold"
              >
                <Home className="w-5 h-5" /> Return to Darkness
              </button>
            </motion.div>
          )}

          {gameState === 'puzzle' && currentPuzzle && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 z-50"
            >
              <motion.div 
                className="bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-[0_0_80px_rgba(220,38,38,0.8)] p-12 text-center border-8 border-red-900"
              >
                {/* Timer Display */}
                <motion.div 
                  animate={{ 
                    scale: puzzleTimer <= 5 ? [1, 1.1, 1] : 1,
                    color: puzzleTimer <= 5 ? '#dc2626' : '#ef4444'
                  }}
                  transition={{ repeat: puzzleTimer <= 5 ? Infinity : 0, duration: 0.5 }}
                  className={`text-6xl font-black mb-6 ${
                    puzzleTimer <= 5 ? 'text-red-600 flicker-animation' : 'text-red-500'
                  }`}
                >
                  {puzzleTimer}s
                </motion.div>

                <div className="flex justify-center mb-8">
                  <div className={`p-5 rounded-[2rem] shadow-[0_0_30px_rgba(220,38,38,0.5)] ${
                    currentPuzzle.type === 'math' ? 'bg-red-950' : 
                    currentPuzzle.type === 'chemistry' ? 'bg-red-950' :
                    currentPuzzle.type === 'physics' ? 'bg-red-950' : 'bg-red-950'
                  }`}>
                    {currentPuzzle.type === 'math' ? <Brain className="w-12 h-12 text-red-400 flicker-animation" /> : 
                     currentPuzzle.type === 'chemistry' ? <Beaker className="w-12 h-12 text-red-400 flicker-animation" /> :
                     currentPuzzle.type === 'physics' ? <Zap className="w-12 h-12 text-red-400 flicker-animation" /> :
                     <Sparkles className="w-12 h-12 text-red-400 flicker-animation" />}
                  </div>
                </div>

                <h2 className="text-xs font-game text-red-500 mb-6 leading-relaxed uppercase tracking-[0.2em] horror-text">
                  {currentPuzzle.prompt}
                </h2>
                
                <div className="text-3xl font-black text-red-100 mb-8 py-8 px-6 bg-black/50 rounded-[2.5rem] font-game shadow-[0_0_20px_rgba(220,38,38,0.3)] border border-red-900">
                  {currentPuzzle.question}
                </div>

                {showHint && currentPuzzle.hint && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-950/50 rounded-2xl border-2 border-red-800"
                  >
                    <div className="flex items-center gap-2 text-red-300">
                      <Lightbulb className="w-5 h-5" />
                      <span className="font-bold text-sm">{currentPuzzle.hint}</span>
                    </div>
                  </motion.div>
                )}

                {showExplanation && currentPuzzle.explanation && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-6 bg-red-900/30 rounded-2xl border-4 border-red-600"
                  >
                    <div className="text-center mb-4">
                      <span className="text-red-400 font-bold text-lg">❌ Wrong Answer!</span>
                      {lastWrongAnswer && (
                        <p className="text-red-300 text-sm mt-2">You chose: {lastWrongAnswer}</p>
                      )}
                    </div>
                    <div className="bg-green-950/50 p-4 rounded-xl border-2 border-green-700 mb-4">
                      <p className="text-green-300 font-bold text-center">✓ Correct Answer: {currentPuzzle.answer}</p>
                    </div>
                    <div className="text-yellow-200 text-sm leading-relaxed">
                      <p className="font-bold mb-2">📚 Explanation:</p>
                      <p>{currentPuzzle.explanation}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowExplanation(false);
                        setLastWrongAnswer(null);
                      }}
                      className="mt-4 w-full py-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded-xl transition-colors"
                    >
                      Try Again
                    </button>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {currentPuzzle.options.map((option) => (
                    <motion.button
                      key={option}
                      whileHover={{ scale: 1.05, backgroundColor: '#450a0a' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePuzzleChoice(option)}
                      className="py-5 px-4 bg-slate-800 text-red-100 font-bold rounded-[2rem] transition-colors border-4 border-red-900 text-xl shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:border-red-700"
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>

                {!showHint && wrongAttempts < 2 && (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-sm text-red-400 hover:text-red-300 flex items-center gap-2 mx-auto"
                  >
                    <Lightbulb className="w-4 h-4" /> Need a hint?
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}

          {gameState === 'paused' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <div className="bg-slate-900 rounded-[3rem] p-12 text-center shadow-[0_0_50px_rgba(220,38,38,0.5)] border-4 border-red-900">
                <h2 className="text-4xl font-black text-red-400 mb-8 font-game horror-text">Paused</h2>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => setGameState('playing')}
                    className="cute-button flex items-center justify-center gap-3 text-xl px-10 py-5"
                  >
                    <Play className="w-6 h-6" /> Resume Escape
                  </button>
                  <button 
                    onClick={() => {
                      setGameState('levelSelect');
                      setCurrentLevel(null);
                    }}
                    className="bg-slate-800 text-red-300 px-10 py-5 rounded-2xl font-bold hover:bg-slate-700 transition-colors text-xl border-2 border-red-900"
                  >
                    Choose Nightmare
                  </button>
                  <button 
                    onClick={() => setShowStats(true)}
                    className="bg-slate-800 text-yellow-300 px-10 py-5 rounded-2xl font-bold hover:bg-slate-700 transition-colors text-xl border-2 border-yellow-700 flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-6 h-6" /> View Stats
                  </button>
                  <button 
                    onClick={() => {
                      setGameState('title');
                      setCurrentLevel(null);
                    }}
                    className="bg-slate-800 text-red-300 px-10 py-5 rounded-2xl font-bold hover:bg-slate-700 transition-colors text-xl flex items-center justify-center gap-2 border-2 border-red-900"
                  >
                    <Home className="w-6 h-6" /> Return to Void
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Modal */}
          {showStats && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60]"
              onClick={() => setShowStats(false)}
            >
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-slate-900 rounded-[3rem] p-12 max-w-2xl w-full mx-4 shadow-[0_0_50px_rgba(220,38,38,0.5)] border-4 border-yellow-700"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-4xl font-black text-yellow-400 mb-8 font-game text-center">📊 Learning Stats</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800 p-4 rounded-xl border-2 border-green-700">
                    <p className="text-green-400 text-sm">Total Puzzles</p>
                    <p className="text-3xl font-bold text-white">{progress.stats?.totalPuzzles || 0}</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border-2 border-blue-700">
                    <p className="text-blue-400 text-sm">Accuracy</p>
                    <p className="text-3xl font-bold text-white">
                      {progress.stats?.totalPuzzles ? 
                        Math.round((progress.stats.correctAnswers / progress.stats.totalPuzzles) * 100) : 0}%
                    </p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border-2 border-green-700">
                    <p className="text-green-400 text-sm">Correct</p>
                    <p className="text-3xl font-bold text-green-400">{progress.stats?.correctAnswers || 0}</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-xl border-2 border-red-700">
                    <p className="text-red-400 text-sm">Wrong</p>
                    <p className="text-3xl font-bold text-red-400">{progress.stats?.wrongAnswers || 0}</p>
                  </div>
                </div>

                <div className="bg-slate-800 p-6 rounded-xl border-2 border-purple-700 mb-6">
                  <h3 className="text-purple-400 font-bold mb-4 text-center">Subject Mastery</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg">
                      <span className="text-blue-300">📐 Math</span>
                      <span className="font-bold text-white">{progress.stats?.mathCorrect || 0}</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg">
                      <span className="text-green-300">🧪 Chemistry</span>
                      <span className="font-bold text-white">{progress.stats?.chemistryCorrect || 0}</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg">
                      <span className="text-yellow-300">⚡ Physics</span>
                      <span className="font-bold text-white">{progress.stats?.physicsCorrect || 0}</span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-900 p-3 rounded-lg">
                      <span className="text-purple-300">🧠 Logic</span>
                      <span className="font-bold text-white">{progress.stats?.logicCorrect || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 p-4 rounded-xl border-2 border-yellow-700 mb-6">
                  <p className="text-yellow-400 text-sm text-center">Fastest Answer</p>
                  <p className="text-2xl font-bold text-white text-center">
                    {progress.stats?.fastestTime ? `${progress.stats.fastestTime}s` : 'N/A'}
                  </p>
                </div>

                <button
                  onClick={() => setShowStats(false)}
                  className="w-full py-4 bg-yellow-700 hover:bg-yellow-600 text-white font-bold rounded-xl transition-colors text-xl"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}

          {gameState === 'victory' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-br from-red-950 via-slate-900 to-black flex flex-col items-center justify-center text-center p-12 z-50"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0] 
                }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="w-28 h-28 bg-red-900/20 backdrop-blur rounded-[2.5rem] mb-10 flex items-center justify-center border-4 border-red-800 shadow-[0_0_50px_rgba(220,38,38,0.8)]"
              >
                <Trophy className="w-16 h-16 text-red-400" />
              </motion.div>
              <h1 className="text-5xl font-game text-red-100 mb-6 leading-tight tracking-tight horror-text">
                You Escaped!
              </h1>
              <div className="bg-black/50 backdrop-blur rounded-3xl p-8 mb-8 border-2 border-red-900">
                <div className="text-red-300 text-xl font-medium mb-4">
                  Souls Collected: <span className="font-black text-3xl text-red-400">{player.score}</span>
                </div>
                <div className="text-red-300 text-xl font-medium">
                  Total Souls: <span className="font-black text-3xl text-red-400">{progress.totalScore}</span>
                </div>
              </div>
              <div className="flex gap-4">
                {progress.unlockedLevels.includes(progress.currentLevel + 1) && (
                  <button 
                    onClick={() => startLevel(progress.currentLevel + 1)}
                    className="bg-red-800 text-red-100 px-12 py-5 rounded-[2rem] font-black text-2xl hover:scale-105 active:scale-95 transition-transform shadow-[0_0_30px_rgba(220,38,38,0.5)] flex items-center gap-3 border-2 border-red-900"
                  >
                    Next Nightmare <ChevronRight className="w-7 h-7" />
                  </button>
                )}
                <button 
                  onClick={() => setGameState('levelSelect')}
                  className="bg-slate-800 backdrop-blur text-red-300 px-12 py-5 rounded-[2rem] font-black text-2xl hover:scale-105 active:scale-95 transition-transform border-2 border-red-900"
                >
                  Choose Level
                </button>
              </div>
            </motion.div>
          )}

          {gameState === 'gameOver' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/95 backdrop-blur flex flex-col items-center justify-center text-center p-12 z-50"
            >
              <h1 className="text-5xl font-game text-red-600 mb-6 horror-text shake-animation">CONSUMED</h1>
              <p className="text-red-400 text-xl mb-8">The darkness has taken you...</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => startLevel(progress.currentLevel)}
                  className="cute-button flex items-center gap-3 text-xl px-10 py-5"
                >
                  <RotateCcw className="w-6 h-6" /> Try Again
                </button>
                <button 
                  onClick={() => setGameState('levelSelect')}
                  className="bg-slate-800 text-red-300 px-10 py-5 rounded-2xl font-bold hover:bg-slate-700 transition-colors text-xl border-2 border-red-900"
                >
                  Escape Route
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Touch Controls */}
      {isMobile && gameState === 'playing' && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-between items-end px-4 pointer-events-none z-50">
          {/* Left side - D-Pad */}
          <div className="relative w-48 h-48 pointer-events-auto">
            {/* Center circle for visual reference */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-900/50 rounded-full border-2 border-red-900/50"></div>
            
            {/* Left */}
            <button
              onTouchStart={(e) => { e.preventDefault(); handleTouchControl('ArrowLeft', true); }}
              onTouchEnd={(e) => { e.preventDefault(); handleTouchControl('ArrowLeft', false); }}
              onTouchCancel={(e) => { e.preventDefault(); handleTouchControl('ArrowLeft', false); }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 bg-red-900/90 backdrop-blur rounded-xl border-4 border-red-700 active:bg-red-800 active:scale-95 flex items-center justify-center text-white font-bold text-3xl shadow-2xl transition-all touch-none"
            >
              ←
            </button>
            
            {/* Right */}
            <button
              onTouchStart={(e) => { e.preventDefault(); handleTouchControl('ArrowRight', true); }}
              onTouchEnd={(e) => { e.preventDefault(); handleTouchControl('ArrowRight', false); }}
              onTouchCancel={(e) => { e.preventDefault(); handleTouchControl('ArrowRight', false); }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 bg-red-900/90 backdrop-blur rounded-xl border-4 border-red-700 active:bg-red-800 active:scale-95 flex items-center justify-center text-white font-bold text-3xl shadow-2xl transition-all touch-none"
            >
              →
            </button>
            
            {/* Up/Jump */}
            <button
              onTouchStart={(e) => { e.preventDefault(); handleTouchControl('ArrowUp', true); }}
              onTouchEnd={(e) => { e.preventDefault(); handleTouchControl('ArrowUp', false); }}
              onTouchCancel={(e) => { e.preventDefault(); handleTouchControl('ArrowUp', false); }}
              className="absolute left-1/2 -translate-x-1/2 top-0 w-16 h-16 bg-red-900/90 backdrop-blur rounded-xl border-4 border-red-700 active:bg-red-800 active:scale-95 flex items-center justify-center text-white font-bold text-3xl shadow-2xl transition-all touch-none"
            >
              ↑
            </button>
            
            {/* Down (optional - for future use) */}
            <button
              onTouchStart={(e) => { e.preventDefault(); handleTouchControl('ArrowDown', true); }}
              onTouchEnd={(e) => { e.preventDefault(); handleTouchControl('ArrowDown', false); }}
              onTouchCancel={(e) => { e.preventDefault(); handleTouchControl('ArrowDown', false); }}
              className="absolute left-1/2 -translate-x-1/2 bottom-0 w-16 h-16 bg-red-900/90 backdrop-blur rounded-xl border-4 border-red-700 active:bg-red-800 active:scale-95 flex items-center justify-center text-white font-bold text-3xl shadow-2xl transition-all touch-none"
            >
              ↓
            </button>
          </div>

          {/* Right side - Action Buttons */}
          <div className="flex flex-col gap-3 pointer-events-auto">
            {/* Jump Button (Primary) */}
            <button
              onTouchStart={(e) => { e.preventDefault(); handleTouchControl(' ', true); }}
              onTouchEnd={(e) => { e.preventDefault(); handleTouchControl(' ', false); }}
              onTouchCancel={(e) => { e.preventDefault(); handleTouchControl(' ', false); }}
              className="w-24 h-24 bg-red-600/90 backdrop-blur rounded-full border-4 border-red-500 active:bg-red-700 active:scale-95 flex flex-col items-center justify-center text-white font-bold shadow-2xl transition-all touch-none"
            >
              <span className="text-2xl">↑</span>
              <span className="text-xs mt-1">JUMP</span>
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          <kbd className="px-4 py-2 bg-slate-800 rounded-xl border-2 border-red-900 shadow-sm text-red-400 font-black text-sm">W A S D</kbd>
          <span className="text-red-400 font-bold text-sm">or</span>
          <kbd className="px-4 py-2 bg-slate-800 rounded-xl border-2 border-red-900 shadow-sm text-red-400 font-black text-sm">ARROWS</kbd>
          <span className="text-red-400 font-bold text-sm">TO ESCAPE</span>
        </div>
        <div className="flex items-center gap-3">
          <kbd className="px-4 py-2 bg-slate-800 rounded-xl border-2 border-red-900 shadow-sm text-red-400 font-black text-sm">ESC</kbd>
          <span className="text-red-400 font-bold text-sm">TO PAUSE</span>
        </div>
      </div>
    
      <div className="fixed bottom-4 left-0 right-0 text-center">
         <span className="text-[8px] font-game text-red-900 opacity-60 uppercase tracking-[0.4em]">
           escape or be consumed by darkness
         </span>
      </div>

    </div>
  );
}
