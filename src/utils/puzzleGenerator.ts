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
      hint: 'Use the power rule: ∫xⁿdx = xⁿ⁺¹/(n+1) + C',
      explanation: 'Using the power rule: ∫2x dx = x² and ∫3 dx = 3x. Don\'t forget the constant C!'
    },
    {
      question: 'What is the derivative of sin(x)?',
      answer: 'cos(x)',
      options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'],
      hint: 'Remember the basic trigonometric derivatives',
      explanation: 'The derivative of sin(x) is cos(x). This is a fundamental calculus rule.'
    },
    {
      question: 'Solve: lim(x→0) (sin x)/x = ?',
      answer: '1',
      options: ['1', '0', '∞', 'undefined'],
      hint: 'This is a fundamental limit in calculus',
      explanation: 'This is one of the most important limits: lim(x→0) (sin x)/x = 1. Used in many calculus proofs!'
    },
    {
      question: 'What is e^(iπ) + 1 = ? (Euler\'s Identity)',
      answer: '0',
      options: ['0', '1', 'e', 'π'],
      hint: 'One of the most beautiful equations in mathematics',
      explanation: 'Euler\'s Identity: e^(iπ) + 1 = 0. It connects five fundamental constants: e, i, π, 1, and 0!'
    },
    {
      question: 'Solve: d/dx(e^x) = ?',
      answer: 'e^x',
      options: ['e^x', 'xe^(x-1)', 'e', 'x·e^x'],
      hint: 'The exponential function is its own derivative',
      explanation: 'The exponential function e^x is special: its derivative equals itself! d/dx(e^x) = e^x'
    },
    {
      question: 'What is ∫(1/x)dx = ?',
      answer: 'ln|x| + C',
      options: ['ln|x| + C', '1/x² + C', 'x² + C', 'e^x + C'],
      hint: 'The antiderivative of 1/x is the natural logarithm',
      explanation: 'The integral of 1/x is ln|x| + C. The absolute value ensures it works for negative x too.'
    },
    {
      question: 'Pythagorean theorem: a² + b² = ?',
      answer: 'c²',
      options: ['c²', '2c', 'c', 'ab'],
      hint: 'For a right triangle with hypotenuse c',
      explanation: 'In a right triangle, the square of the hypotenuse equals the sum of squares of the other sides.'
    },
    {
      question: 'What is the quadratic formula for ax² + bx + c = 0?',
      answer: 'x = (-b ± √(b²-4ac))/2a',
      options: ['x = (-b ± √(b²-4ac))/2a', 'x = -b/2a', 'x = b²-4ac', 'x = √(b²-4ac)'],
      hint: 'Used to solve quadratic equations',
      explanation: 'The quadratic formula solves any quadratic equation. The discriminant b²-4ac tells us how many solutions exist.'
    },
    {
      question: 'What is the sum of angles in a triangle?',
      answer: '180°',
      options: ['180°', '360°', '90°', '270°'],
      hint: 'A fundamental property of Euclidean geometry',
      explanation: 'In Euclidean geometry, the interior angles of any triangle always sum to 180°.'
    },
    {
      question: 'Solve: log₁₀(100) = ?',
      answer: '2',
      options: ['2', '10', '100', '1'],
      hint: '10 to what power equals 100?',
      explanation: 'log₁₀(100) = 2 because 10² = 100. Logarithms are the inverse of exponents!'
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
    hint: puzzle.hint,
    explanation: puzzle.explanation
  };
}

export function generateChemistryPuzzle(difficulty: number): Puzzle {
  const advancedPuzzles = [
    {
      question: 'What is Avogadro\'s number?',
      answer: '6.022 × 10²³',
      options: ['6.022 × 10²³', '3.14 × 10⁸', '9.81 × 10²', '1.602 × 10⁻¹⁹'],
      hint: 'The number of particles in one mole of substance',
      explanation: 'Avogadro\'s number (6.022 × 10²³) is the number of atoms/molecules in one mole. It\'s fundamental to chemistry!'
    },
    {
      question: 'Balance: C₃H₈ + O₂ → CO₂ + H₂O',
      answer: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O',
      options: ['C₃H₈ + 5O₂ → 3CO₂ + 4H₂O', 'C₃H₈ + 3O₂ → 3CO₂ + 4H₂O', 'C₃H₈ + 4O₂ → 3CO₂ + 3H₂O', 'C₃H₈ + O₂ → CO₂ + H₂O'],
      hint: 'Count carbons, hydrogens, and oxygens on both sides',
      explanation: '3 carbons → 3CO₂, 8 hydrogens → 4H₂O, then balance oxygen: need 5O₂ total.'
    },
    {
      question: 'What is the pH of a neutral solution at 25°C?',
      answer: '7',
      options: ['7', '0', '14', '1'],
      hint: 'pH scale ranges from 0-14, neutral is in the middle',
      explanation: 'pH 7 is neutral (equal H⁺ and OH⁻). Below 7 is acidic, above 7 is basic.'
    },
    {
      question: 'What is the electron configuration of Carbon (Z=6)?',
      answer: '1s² 2s² 2p²',
      options: ['1s² 2s² 2p²', '1s² 2s² 2p⁶', '1s² 2p⁴', '2s² 2p⁴'],
      hint: 'Fill orbitals in order: 1s, 2s, 2p',
      explanation: 'Carbon has 6 electrons: 2 in 1s, 2 in 2s, and 2 in 2p orbitals.'
    },
    {
      question: 'What is the ideal gas law equation?',
      answer: 'PV = nRT',
      options: ['PV = nRT', 'E = mc²', 'F = ma', 'V = IR'],
      hint: 'Relates Pressure, Volume, moles, and Temperature',
      explanation: 'PV = nRT relates Pressure, Volume, moles (n), gas constant (R), and Temperature.'
    },
    {
      question: 'What is the molecular geometry of CH₄ (methane)?',
      answer: 'Tetrahedral',
      options: ['Tetrahedral', 'Linear', 'Trigonal planar', 'Octahedral'],
      hint: 'Carbon has 4 bonding pairs, no lone pairs',
      explanation: 'CH₄ has 4 bonding pairs around carbon with no lone pairs, forming a tetrahedral shape (109.5° angles).'
    },
    {
      question: 'What is the oxidation state of Mn in KMnO₄?',
      answer: '+7',
      options: ['+7', '+4', '+2', '+5'],
      hint: 'K is +1, O is -2, solve for Mn',
      explanation: 'K is +1, each O is -2 (×4 = -8). Total must be 0, so Mn = +7.'
    },
    {
      question: 'What is ΔG for a spontaneous reaction?',
      answer: 'Negative',
      options: ['Negative', 'Positive', 'Zero', 'Undefined'],
      hint: 'Gibbs free energy determines spontaneity',
      explanation: 'Negative ΔG means spontaneous (reaction proceeds forward). Positive ΔG means non-spontaneous.'
    },
    {
      question: 'What is the hybridization of carbon in ethene (C₂H₄)?',
      answer: 'sp²',
      options: ['sp²', 'sp³', 'sp', 'sp³d'],
      hint: 'Carbon has a double bond in ethene',
      explanation: 'Double bonds use sp² hybridization (one s + two p orbitals). The unhybridized p orbital forms the π bond.'
    },
    {
      question: 'What is the rate law for a first-order reaction?',
      answer: 'rate = k[A]',
      options: ['rate = k[A]', 'rate = k[A]²', 'rate = k', 'rate = k[A][B]'],
      hint: 'First-order means the rate depends on [A] to the first power',
      explanation: 'First-order: rate depends linearly on concentration. Doubling [A] doubles the rate.'
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
    hint: puzzle.hint,
    explanation: puzzle.explanation
  };
}

export function generatePhysicsPuzzle(difficulty: number): Puzzle {
  const advancedPuzzles = [
    {
      question: 'What is Einstein\'s mass-energy equivalence?',
      answer: 'E = mc²',
      options: ['E = mc²', 'F = ma', 'E = hf', 'p = mv'],
      hint: 'Energy equals mass times the speed of light squared',
      explanation: 'E = mc² shows mass and energy are interchangeable. A tiny mass contains enormous energy!'
    },
    {
      question: 'What is Planck\'s constant (h)?',
      answer: '6.626 × 10⁻³⁴ J·s',
      options: ['6.626 × 10⁻³⁴ J·s', '3 × 10⁸ m/s', '9.8 m/s²', '6.022 × 10²³'],
      hint: 'Fundamental constant in quantum mechanics',
      explanation: 'Planck\'s constant relates energy to frequency: E = hf. It\'s the foundation of quantum mechanics!'
    },
    {
      question: 'What is the Heisenberg Uncertainty Principle?',
      answer: 'Δx·Δp ≥ ℏ/2',
      options: ['Δx·Δp ≥ ℏ/2', 'E = mc²', 'F = ma', 'V = IR'],
      hint: 'Cannot simultaneously know position and momentum precisely',
      explanation: 'You can\'t know both position (Δx) and momentum (Δp) exactly. More precise position = less precise momentum!'
    },
    {
      question: 'What is the Schrödinger equation (time-independent)?',
      answer: 'Ĥψ = Eψ',
      options: ['Ĥψ = Eψ', 'E = mc²', 'F = ma', 'pV = nRT'],
      hint: 'Fundamental equation of quantum mechanics',
      explanation: 'The Schrödinger equation describes quantum systems. Ĥ is the Hamiltonian operator, ψ is the wavefunction.'
    },
    {
      question: 'What is the speed of light in vacuum (c)?',
      answer: '3 × 10⁸ m/s',
      options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '9.8 m/s²', '6.626 × 10⁻³⁴'],
      hint: 'The universal speed limit',
      explanation: 'Light travels at 3 × 10⁸ m/s (300,000 km/s) in vacuum. Nothing can go faster!'
    },
    {
      question: 'What is Newton\'s law of universal gravitation?',
      answer: 'F = G(m₁m₂)/r²',
      options: ['F = G(m₁m₂)/r²', 'F = ma', 'E = mc²', 'F = kx'],
      hint: 'Force between two masses',
      explanation: 'Gravitational force depends on both masses and decreases with distance squared (inverse square law).'
    },
    {
      question: 'What is the first law of thermodynamics?',
      answer: 'ΔU = Q - W',
      options: ['ΔU = Q - W', 'E = mc²', 'F = ma', 'PV = nRT'],
      hint: 'Energy conservation: change in internal energy',
      explanation: 'Energy is conserved: change in internal energy (ΔU) = heat added (Q) minus work done (W).'
    },
    {
      question: 'What is Coulomb\'s law for electric force?',
      answer: 'F = k(q₁q₂)/r²',
      options: ['F = k(q₁q₂)/r²', 'F = ma', 'E = mc²', 'V = IR'],
      hint: 'Force between two charges',
      explanation: 'Electric force between charges follows inverse square law, like gravity but with charges instead of masses.'
    },
    {
      question: 'What is the de Broglie wavelength equation?',
      answer: 'λ = h/p',
      options: ['λ = h/p', 'E = hf', 'E = mc²', 'F = ma'],
      hint: 'Wave-particle duality: wavelength of matter',
      explanation: 'All matter has wave properties! Wavelength (λ) = Planck\'s constant (h) / momentum (p).'
    },
    {
      question: 'What is Maxwell\'s equation for Gauss\'s law?',
      answer: '∇·E = ρ/ε₀',
      options: ['∇·E = ρ/ε₀', 'F = ma', 'E = mc²', '∇×B = μ₀J'],
      hint: 'Relates electric field to charge density',
      explanation: 'Gauss\'s law: electric field divergence equals charge density divided by permittivity.'
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
    hint: puzzle.hint,
    explanation: puzzle.explanation
  };
}

export function generateLogicPuzzle(difficulty: number): Puzzle {
  const puzzles = [
    {
      question: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops Lazzies?',
      answer: 'Yes',
      options: ['Yes', 'No', 'Maybe', 'Unknown'],
      hint: 'Follow the logical chain',
      explanation: 'This uses transitive property: if A→B and B→C, then A→C. Bloops→Razzies→Lazzies, so Bloops→Lazzies!'
    },
    {
      question: 'What comes next? 2, 4, 8, 16, ?',
      answer: '32',
      options: ['24', '32', '20', '28'],
      hint: 'Each number is doubled',
      explanation: 'This is a geometric sequence where each term is multiplied by 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32'
    },
    {
      question: 'If A > B and B > C, then A ? C',
      answer: '>',
      options: ['>', '<', '=', '≠'],
      hint: 'Transitive property',
      explanation: 'Transitive property of inequality: if A is greater than B, and B is greater than C, then A must be greater than C.'
    },
    {
      question: 'Complete: 1, 1, 2, 3, 5, 8, ?',
      answer: '13',
      options: ['11', '13', '15', '10'],
      hint: 'Fibonacci sequence',
      explanation: 'Fibonacci sequence: each number is the sum of the previous two. 5+8=13. Found everywhere in nature!'
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
    hint: puzzle.hint,
    explanation: puzzle.explanation
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
