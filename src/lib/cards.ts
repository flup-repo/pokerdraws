import { Card, CardValue, CardSuit, CardDisplay } from './types';

// Card value to display mapping
const valueToDisplay: Record<CardValue, CardDisplay> = {
    1: 'A',
    2: '2',
    3: '3',
    5: '5',
    8: '8',
    13: 'K',
    joker: '🃏',
};

// All available card values
export const CARD_VALUES: CardValue[] = [1, 2, 3, 5, 8, 13, 'joker'];

// All suits
export const SUITS: CardSuit[] = ['diamonds', 'clubs', 'hearts', 'spades'];

// Get a random suit
export function getRandomSuit(): CardSuit {
    return SUITS[Math.floor(Math.random() * SUITS.length)];
}

// Create a card with a specific value and random suit
export function createCard(value: CardValue): Card {
    return {
        value,
        suit: getRandomSuit(),
        displayValue: valueToDisplay[value],
    };
}

// Create a full deck for the player
export function createPlayerDeck(): Card[] {
    return CARD_VALUES.map(value => createCard(value));
}

// Get numeric value of a card (for averaging)
export function getNumericValue(card: Card): number | null {
    if (card.value === 'joker') return null;
    return card.value as number;
}

// Calculate average of played cards (excluding jokers)
export function calculateAverage(cards: (Card | null)[]): number | null {
    const numericValues = cards
        .filter((card): card is Card => card !== null)
        .map(card => getNumericValue(card))
        .filter((value): value is number => value !== null);

    if (numericValues.length === 0) return null;

    const sum = numericValues.reduce((acc, val) => acc + val, 0);
    return Math.round((sum / numericValues.length) * 10) / 10;
}

// Get suit color
export function getSuitColor(suit: CardSuit): 'red' | 'black' {
    return suit === 'diamonds' || suit === 'hearts' ? 'red' : 'black';
}

// Get suit symbol
export function getSuitSymbol(suit: CardSuit): string {
    const symbols: Record<CardSuit, string> = {
        diamonds: '♦',
        clubs: '♣',
        hearts: '♥',
        spades: '♠',
    };
    return symbols[suit];
}

// Legend mapping for display
export const CARD_LEGEND: { display: CardDisplay; description: string }[] = [
    { display: 'A', description: '1 point' },
    { display: '2', description: '2 points' },
    { display: '3', description: '3 points' },
    { display: '5', description: '5 points' },
    { display: '8', description: '8 points' },
    { display: 'K', description: '13 points' },
    { display: '🃏', description: 'Unsure / Need discussion' },
];
