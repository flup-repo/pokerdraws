// Card value types
export type CardValue = 1 | 2 | 3 | 5 | 8 | 13 | 'joker';
export type CardSuit = 'diamonds' | 'clubs' | 'hearts' | 'spades';
export type CardDisplay = 'A' | '2' | '3' | '5' | '8' | 'K' | '🃏';

// Card interface
export interface Card {
    value: CardValue;
    suit: CardSuit;
    displayValue: CardDisplay;
}

// Participant in a room
export interface Participant {
    id: string;
    nickname: string;
    isConnected: boolean;
    playedCard: Card | null;
}

// Room state
export type RoomStatus = 'playing' | 'revealed';

export interface RoomState {
    id: string;
    name: string;
    slug: string;
    createdAt: number;
    state: RoomStatus;
    participants: Participant[];
}

export interface RecentRoom {
    slug: string;
    name: string;
    lastVisited: number;
}

// WebSocket messages - Client to Server
export type ClientMessage =
    | { type: 'join'; nickname: string }
    | { type: 'play'; card: Card }
    | { type: 'retract' }
    | { type: 'reveal' }
    | { type: 'clear' };

// WebSocket messages - Server to Client
export type ServerMessage =
    | { type: 'state'; room: RoomState }
    | { type: 'error'; message: string }
    | { type: 'nickname-assigned'; nickname: string };
