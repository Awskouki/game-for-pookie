/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Puzzle, PuzzleType } from '../types';

const MATH_OPERATIONS = ['+', '-', '×', '÷'];
const ELEMENTS = [
  { name: 'Gold', symbol: 'Au' },
  { name: 'Silver', symbol: 'Ag' },
  { name: 'Iron', symbol: 'Fe' },
  { name: 'Copper', symbol: 'Cu' },
  { name: 'Oxygen', symbol: 'O' },
  { name: 'Hydrogen', symbol: 'H' },
  { name: 'Carbon', symbol: 'C' },
  { name: 'Nitrogen', symbol: 'N' },
  { name: 'Helium', symbol: 'He' },
  { name: 'Sodium', symbol: 'Na' },
];

const COMPOUNDS = [
  { formula: 'H2O', name: 'Water' },
  { formula: 'CO2', name: 'Carbon Dioxide' },
  { formula: 'NaCl', name: 'Salt' },
  { formula: 'H2O2', name: 'Hydrogen Peroxide' },
];

export function generateMathPuzzle(difficulty: number): Puzzle {
  const advancedPuzzles = [
    {
      question: 'Solve: ∫(2x + 3)dx = ?',
      answer: 'x² + 3x + C',
      options: ['x² + 3x + C', '2x² + 3x', 'x² + 3', '2x + C'],
      hint: 'Use the power rule: ∫xⁿdx = xⁿ⁺¹/(n+1) + C'
    },
    {
      question: 'What is the derivative of sin(x)?',
      answer: 'cos(x)',
      options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'],
      hint: 'Remember the basic trigonometric derivatives'
    },
    {
      question: 'Solve: lim(x→0) (sin x)/x = ?',
      answer: '1',
      options: ['1', '0', '∞', 'undefined'],
      hint: 'This is a fundamental limit in calculus'
    },
    {
      question: 'What is e^(iπ) + 1 = ? (Euler\'s Identity)',
      answer: '0',
      options: ['0', '1', 'e', 'π'],
      hint: 'One of the most beautiful equations in mathematics'
    },
    {
      question: 'Solve: d/dx(e^x) = ?',
      answer: 'e^x',
      options: ['e^x', 'xe^(x-1)', 'e', 'x·e^x'],
      hint: 'The exponential function is its own derivative'
    },
    {
      question: 'What is ∫(1/x)dx = ?',
      answer: 'ln|x| + C',
      options: ['ln|x| + C', '1/x² + C', 'x² + C', 'e^x + C'],
      hint: 'The antiderivative of 1/x is the natural logarithm'
    },
    {
      question: 'Pythagorean theorem: a² + b² = ?',
      answer: 'c²',
      options: ['c²', '2c', 'c', 'ab'],
      hint: 'For a right triangle with hypotenuse c'
    },
    {
      question: 'What is the quadratic formula for ax² + bx + c = 0?',
      answer: 'x = (-b ± √(b²-4ac))/2a',
      options: ['x = (-b ± √(b²-4ac))/2a', 'x = -b/2a', 'x = b²-4ac', 'x = √(b²-4ac)'],
      hint: 'Used to solve quadratic equations'
    },
    {
      question: 'What is the sum of angles in a triangle?',
      answer: '180°',
      options: ['180°', '360°', '90°', '270°'],
      hint: 'A fundamental property of Euclidean geometry'
    },
    {
      question: 'Solve: log₁₀(100) = ?',
      answer: '2',
      options: ['2', '10', '100', '1'],
      hint: '10 to what power equals 100?'
    }
  ];

  const puzzle = advancedPuzzles[Math.floor(Math.random() * advancedPuzzles.length)];

  return {
    id: Date.now(),
    type: 'math',
    question: puzzle.question,
    answer: puzzle.answer,
    options: puzzle.options,
    prompt: 'Solve to escape the nightmare!',
    difficulty,
    hint: puzzle.hint
  };
}

export function generateChemistryPuzzle(difficulty: number): Puzzle {
  const advancedPuzzles = [
    {
      question: 'What is Avogadro\'s number?',
      answer: '6.022 × 10²³',
      options: ['6.022 × 10²³', '3.14 × 10⁸', '9.81 × 10²', '1.602 × 10⁻¹⁹'],
      hint: 'The number of particles in one mole of substance'
    },
    {
      question: 'Balance: C₃H₈ + O₂ → CO₂ + H₂O',
      answer: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O',
      options: ['C₃H₈ + 5O₂ → 3CO₂ + 4H₂O', 'C₃H₈ + 3O₂ → 3CO₂ + 4H₂O', 'C₃H₈ + 4O₂ → 3CO₂ + 3H₂O', 'C₃H₈ + O₂ → CO₂ + H₂O'],
      hint: 'Count carbons, hydrogens, and oxygens on both sides'
    },
    {
      question: 'What is the pH of a neutral solution at 25°C?',
      answer: '7',
      options: ['7', '0', '14', '1'],
      hint: 'pH scale ranges from 0-14, neutral is in the middle'
    },
    {
      question: 'What is the electron configuration of Carbon (Z=6)?',
      answer: '1s² 2s² 2p²',
      options: ['1s² 2s² 2p²', '1s² 2s² 2p⁶', '1s² 2p⁴', '2s² 2p⁴'],
      hint: 'Fill orbitals in order: 1s, 2s, 2p'
    },
    {
      question: 'What is the ideal gas law equation?',
      answer: 'PV = nRT',
      options: ['PV = nRT', 'E = mc²', 'F = ma', 'V = IR'],
      hint: 'Relates Pressure, Volume, moles, and Temperature'
    },
    {
      question: 'What is the molecular geometry of CH₄ (methane)?',
      answer: 'Tetrahedral',
      options: ['Tetrahedral', 'Linear', 'Trigonal planar', 'Octahedral'],
      hint: 'Carbon has 4 bonding pairs, no lone pairs'
    },
    {
      question: 'What is the oxidation state of Mn in KMnO₄?',
      answer: '+7',
      options: ['+7', '+4', '+2', '+5'],
      hint: 'K is +1, O is -2, solve for Mn'
    },
    {
      question: 'What is ΔG for a spontaneous reaction?',
      answer: 'Negative',
      options: ['Negative', 'Positive', 'Zero', 'Undefined'],
      hint: 'Gibbs free energy determines spontaneity'
    },
    {
      question: 'What is the hybridization of carbon in ethene (C₂H₄)?',
      answer: 'sp²',
      options: ['sp²', 'sp³', 'sp', 'sp³d'],
      hint: 'Carbon has a double bond in ethene'
    },
    {
      question: 'What is the rate law for a first-order reaction?',
      answer: 'rate = k[A]',
      options: ['rate = k[A]', 'rate = k[A]²', 'rate = k', 'rate = k[A][B]'],
      hint: 'First-order means the rate depends on [A] to the first power'
    }
  ];

  const puzzle = advancedPuzzles[Math.floor(Math.random() * advancedPuzzles.length)];

  return {
    id: Date.now(),
    type: 'chemistry',
    question: puzzle.question,
    answer: puzzle.answer,
    options: puzzle.options,
    prompt: 'Answer correctly or be trapped forever!',
    difficulty,
    hint: puzzle.hint
  };
}

export function generatePhysicsPuzzle(difficulty: number): Puzzle {
  const advancedPuzzles = [
    {
      question: 'What is Einstein\'s mass-energy equivalence?',
      answer: 'E = mc²',
      options: ['E = mc²', 'F = ma', 'E = hf', 'p = mv'],
      hint: 'Energy equals mass times the speed of light squared'
    },
    {
      question: 'What is Planck\'s constant (h)?',
      answer: '6.626 × 10⁻³⁴ J·s',
      options: ['6.626 × 10⁻³⁴ J·s', '3 × 10⁸ m/s', '9.8 m/s²', '6.022 × 10²³'],
      hint: 'Fundamental constant in quantum mechanics'
    },
    {
      question: 'What is the Heisenberg Uncertainty Principle?',
      answer: 'Δx·Δp ≥ ℏ/2',
      options: ['Δx·Δp ≥ ℏ/2', 'E = mc²', 'F = ma', 'V = IR'],
      hint: 'Cannot simultaneously know position and momentum precisely'
    },
    {
      question: 'What is the Schrödinger equation (time-independent)?',
      answer: 'Ĥψ = Eψ',
      options: ['Ĥψ = Eψ', 'E = mc²', 'F = ma', 'pV = nRT'],
      hint: 'Fundamental equation of quantum mechanics'
    },
    {
      question: 'What is the speed of light in vacuum (c)?',
      answer: '3 × 10⁸ m/s',
      options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '9.8 m/s²', '6.626 × 10⁻³⁴'],
      hint: 'The universal speed limit'
    },
    {
      question: 'What is Newton\'s law of universal gravitation?',
      answer: 'F = G(m₁m₂)/r²',
      options: ['F = G(m₁m₂)/r²', 'F = ma', 'E = mc²', 'F = kx'],
      hint: 'Force between two masses'
    },
    {
      question: 'What is the first law of thermodynamics?',
      answer: 'ΔU = Q - W',
      options: ['ΔU = Q - W', 'E = mc²', 'F = ma', 'PV = nRT'],
      hint: 'Energy conservation: change in internal energy'
    },
    {
      question: 'What is Coulomb\'s law for electric force?',
      answer: 'F = k(q₁q₂)/r²',
      options: ['F = k(q₁q₂)/r²', 'F = ma', 'E = mc²', 'V = IR'],
      hint: 'Force between two charges'
    },
    {
      question: 'What is the de Broglie wavelength equation?',
      answer: 'λ = h/p',
      options: ['λ = h/p', 'E = hf', 'E = mc²', 'F = ma'],
      hint: 'Wave-particle duality: wavelength of matter'
    },
    {
      question: 'What is Maxwell\'s equation for Gauss\'s law?',
      answer: '∇·E = ρ/ε₀',
      options: ['∇·E = ρ/ε₀', 'F = ma', 'E = mc²', '∇×B = μ₀J'],
      hint: 'Relates electric field to charge density'
    }
  ];

  const puzzle = advancedPuzzles[Math.floor(Math.random() * advancedPuzzles.length)];

  return {
    id: Date.now(),
    type: 'physics',
    question: puzzle.question,
    answer: puzzle.answer,
    options: puzzle.options,
    prompt: 'The darkness awaits your answer...',
    difficulty,
    hint: puzzle.hint
  };
}

export function generateLogicPuzzle(difficulty: number): Puzzle {
  const puzzles = [
    {
      question: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops Lazzies?',
      answer: 'Yes',
      options: ['Yes', 'No', 'Maybe', 'Unknown'],
      hint: 'Follow the logical chain'
    },
    {
      question: 'What comes next? 2, 4, 8, 16, ?',
      answer: '32',
      options: ['24', '32', '20', '28'],
      hint: 'Each number is doubled'
    },
    {
      question: 'If A > B and B > C, then A ? C',
      answer: '>',
      options: ['>', '<', '=', '≠'],
      hint: 'Transitive property'
    },
    {
      question: 'Complete: 1, 1, 2, 3, 5, 8, ?',
      answer: '13',
      options: ['11', '13', '15', '10'],
      hint: 'Fibonacci sequence'
    },
  ];

  const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

  return {
    id: Date.now(),
    type: 'logic',
    question: puzzle.question,
    answer: puzzle.answer,
    options: puzzle.options,
    prompt: 'Think fast before time runs out!',
    difficulty,
    hint: puzzle.hint
  };
}

export function generatePuzzle(type: PuzzleType, difficulty: number): Puzzle {
  switch (type) {
    case 'math':
      return generateMathPuzzle(difficulty);
    case 'chemistry':
      return generateChemistryPuzzle(difficulty);
    case 'physics':
      return generatePhysicsPuzzle(difficulty);
    case 'logic':
      return generateLogicPuzzle(difficulty);
    default:
      return generateMathPuzzle(difficulty);
  }
}

function generateOptions(correctAnswer: number, count: number): string[] {
  const options = new Set<string>([correctAnswer.toString()]);
  
  while (options.size < count) {
    const offset = Math.floor(Math.random() * 20) - 10;
    const wrongAnswer = correctAnswer + offset;
    if (wrongAnswer !== correctAnswer && wrongAnswer > 0) {
      options.add(wrongAnswer.toString());
    }
  }
  
  return Array.from(options).sort(() => Math.random() - 0.5);
}
