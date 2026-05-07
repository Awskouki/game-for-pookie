<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Aura's Alchemical Adventure - Enhanced Edition

A delightful 2D educational puzzle-platformer where you guide Aura through magical realms, solving puzzles and collecting treasures to restore harmony to the enchanted world.

## 🎮 Game Features

### Core Gameplay
- **Dynamic Level System**: 5 procedurally generated levels with increasing difficulty
- **Puzzle Variety**: Math, Chemistry, Physics, and Logic puzzles
- **Platforming Mechanics**: Jump, double-jump, and navigate through obstacles
- **Combat-Lite**: Avoid or overcome enemies using power-ups

### Collectibles & Scoring
- **Coins**: Basic collectibles worth 10 points
- **Stars**: Rare collectibles worth 20 points  
- **Crystals**: Ultra-rare collectibles worth 50 points
- **Combo System**: Chain collections for multiplier bonuses (up to x10)
- **Score Persistence**: Your total score is saved across sessions

### Power-Ups
- **Speed Boost** ⚡: Move 50% faster for 5-10 seconds
- **Shield** 🛡️: Protect against one enemy hit
- **Invincibility** ✨: Become immune to all damage temporarily
- **Double Jump** 🦘: Unlock the ability to jump twice in mid-air

### Enemies & Obstacles
- **Patrol Enemies**: Move back and forth in set patterns (orange)
- **Chase Enemies**: Pursue the player when nearby (red)
- **Static Obstacles**: Rocks and barriers to navigate around

### Visual & Audio
- **Particle Effects**: 
  - Collection sparkles
  - Power-up bursts
  - Damage indicators
  - Movement trails
- **Procedural Sound Effects**:
  - Collect sounds
  - Jump sounds
  - Damage/hurt sounds
  - Power-up activation
  - Gate unlocking
  - Victory fanfare
  - Wrong answer buzzer

### Progression System
- **Save/Load**: Automatic progress saving using localStorage
- **Level Unlocking**: Complete levels to unlock the next
- **Achievements**: Track completed puzzles
- **Persistent Scoring**: Cumulative score across all playthroughs

### UI/UX Features
- **Health Display**: Visual heart indicators
- **Score Counter**: Real-time score tracking
- **Combo Indicator**: Shows active combo multiplier
- **Active Power-Ups**: Icons showing current buffs
- **Pause Menu**: ESC to pause, resume, or quit
- **Sound Toggle**: Mute/unmute sound effects
- **Level Select**: Choose any unlocked level
- **Hint System**: Get hints after 2 wrong answers

## 🎯 How to Play

### Controls
- **W/A/S/D** or **Arrow Keys**: Move and jump
- **Space**: Jump (alternative)
- **ESC**: Pause game

### Objective
1. Navigate through each level from left to right
2. Collect coins, stars, and crystals for points
3. Grab power-ups to gain temporary abilities
4. Avoid or tank enemy hits (you have 3 hearts)
5. Solve puzzles at gates to unlock them
6. Reach the end of the level to win

### Tips
- Chain collectibles quickly to build combo multipliers
- Save power-ups for difficult sections
- Use hints if you're stuck on a puzzle
- Double-jump power-up is essential for hard-to-reach items
- Shield protects you from one hit - use it wisely!

## 🚀 Run Locally

**Prerequisites:** Node.js (v20+)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:3000`

## 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🎨 Technical Highlights

### Architecture
- **React 19** with TypeScript for type safety
- **Framer Motion** for smooth animations
- **Canvas API** for high-performance 2D rendering
- **requestAnimationFrame** for 60 FPS game loop
- **Web Audio API** for procedural sound generation

### Code Organization
```
src/
├── App.tsx                 # Main game component
├── types.ts                # TypeScript interfaces
├── utils/
│   ├── audioSystem.ts      # Sound effect generation
│   ├── particles.ts        # Particle system
│   ├── puzzleGenerator.ts  # Procedural puzzle creation
│   ├── levelGenerator.ts   # Dynamic level generation
│   └── storage.ts          # Save/load system
```

### Performance Optimizations
- Efficient collision detection
- Particle pooling and cleanup
- Canvas rendering optimizations
- Memoized callbacks with useCallback
- Conditional rendering with AnimatePresence

## 📊 Game Statistics

- **5 Levels** with unique themes
- **4 Puzzle Types** (Math, Chemistry, Physics, Logic)
- **4 Power-Up Types**
- **2 Enemy Types**
- **3 Collectible Types**
- **Infinite Replayability** with procedural generation

## 🎓 Educational Value

This game teaches:
- **Mathematics**: Arithmetic, algebra, sequences
- **Chemistry**: Elements, compounds, chemical equations
- **Physics**: Forces, energy, units
- **Logic**: Patterns, deduction, reasoning

## 🔮 Future Enhancements

Potential additions:
- Boss battles with multi-stage puzzles
- Crafting system for combining items
- Multiplayer co-op mode
- More puzzle categories (Biology, Geography, History)
- Custom level editor
- Mobile touch controls
- Achievements and badges
- Online leaderboards

## 📝 License

Apache-2.0

## 🌟 Credits

Crafted with love for peace of mind.

View the original app in AI Studio: https://ai.studio/apps/eb40af8d-d391-4a3e-99aa-4f5840742c72

---

**Enjoy your alchemical adventure!** ✨🧪🎮
