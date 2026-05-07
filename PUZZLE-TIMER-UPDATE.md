# Puzzle Timer Update

## Overview
Added a 20-second countdown timer to all puzzles. If the player doesn't answer within 20 seconds, they lose a heart.

## Features Implemented

### 1. Timer State Management
- Added `puzzleTimer` state (starts at 20 seconds)
- Added `puzzleTimerRef` for timeout management
- Timer initializes when puzzle opens

### 2. Countdown Logic
- Timer decrements every second while puzzle is active
- When timer reaches 0:
  - Player loses 1 heart
  - Hurt sound plays
  - Returns to playing state
  - If health reaches 0, game over

### 3. Timer Display
- Large countdown display at top of puzzle modal (60px font)
- Visual warning when timer ≤ 5 seconds:
  - Changes to bright red color
  - Pulsing/scaling animation
  - Flicker effect for urgency
- Normal state: red-500 color
- Warning state: red-600 color with animations

### 4. Time Bonus System
- Players earn bonus points for fast answers
- **10 points per second remaining** on the timer
- Example: Answer with 15 seconds left = 150 bonus points
- Bonus added on top of base 500 points + combo bonus

### 5. Timer Cleanup
- Timer properly cleared when:
  - Player selects an answer (correct or wrong)
  - Puzzle closes
  - Component unmounts
- Prevents memory leaks and multiple timers

## Technical Details

### Files Modified
- `src/App.tsx` - Main game component

### Key Changes
1. **State additions** (line ~53):
   ```typescript
   const [puzzleTimer, setPuzzleTimer] = useState(20);
   const puzzleTimerRef = useRef<NodeJS.Timeout | null>(null);
   ```

2. **Timer useEffect** (line ~95):
   - Countdown logic
   - Heart loss on timeout
   - Cleanup function

3. **handlePuzzleChoice updates** (line ~424):
   - Clear timer on answer
   - Calculate time bonus
   - Add bonus to score

4. **UI Display** (line ~650):
   - Timer countdown display
   - Warning animations
   - Color changes

## Gameplay Impact

### Difficulty Balance
- **Easy gameplay maintained**: 5 hearts, faster movement, higher jumps
- **Hard puzzles maintained**: University-level math, chemistry, physics
- **New pressure**: Time limit adds urgency without making puzzles harder
- **Reward system**: Fast solvers get bonus points

### Player Experience
- Clear visual feedback (large timer)
- Warning system (red + flicker at 5 seconds)
- Fair penalty (1 heart, not instant death)
- Bonus incentive (rewards quick thinking)

## Testing Recommendations
1. Test timer countdown accuracy
2. Verify heart loss at 0 seconds
3. Check time bonus calculation
4. Test warning animations at ≤5 seconds
5. Verify timer cleanup (no memory leaks)
6. Test game over when health reaches 0 from timer

## Future Enhancements (Optional)
- Different time limits per difficulty level
- Sound effects for timer warnings
- Pause timer when hint is shown
- Adjustable timer duration in settings
- Timer speed-up in later levels
