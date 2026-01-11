/// <reference types="vite/client" />
import { useState, useCallback } from "react";
import usePartySocket from "partysocket/react";
import {
    RoomState,
    Card,
    ClientMessage,
    ServerMessage
} from "../lib/types";

// Helper to determine PartyKit host
const PARTYKIT_HOST = import.meta.env.DEV
    ? "localhost:1999"
    : "pokerdraws.partykit.dev"; // We'll need to update this after connection

export interface PokerRoomActions {
    playCard: (card: Card) => void;
    retractCard: () => void;
    revealCards: () => void;
    clearCards: () => void;
}

export function usePokerRoom(slug: string, nickname: string) {
    const [roomState, setRoomState] = useState<RoomState | null>(null);
    const [error, setError] = useState<string | null>(null);

    const socket = usePartySocket({
        host: PARTYKIT_HOST,
        room: slug,
        query: {
            nickname
        },
        onMessage(event) {
            const data = JSON.parse(event.data) as ServerMessage;

            switch (data.type) {
                case 'state':
                    setRoomState(data.room);
                    setError(null);
                    break;
                case 'error':
                    setError(data.message);
                    break;
                case 'nickname-assigned':
                    console.log(`Assigned nickname: ${data.nickname}`);
                    break;
            }
        }
    });

    // Action methods
    const playCard = useCallback((card: Card) => {
        const msg: ClientMessage = { type: 'play', card };
        socket.send(JSON.stringify(msg));
    }, [socket]);

    const retractCard = useCallback(() => {
        const msg: ClientMessage = { type: 'retract' };
        socket.send(JSON.stringify(msg));
    }, [socket]);

    const revealCards = useCallback(() => {
        const msg: ClientMessage = { type: 'reveal' };
        socket.send(JSON.stringify(msg));
    }, [socket]);

    const clearCards = useCallback(() => {
        const msg: ClientMessage = { type: 'clear' };
        socket.send(JSON.stringify(msg));
    }, [socket]);

    // Derived state for the current user
    const myParticipant = roomState?.participants.find(p => p.id === socket.id);

    return {
        roomState,
        error,
        actions: {
            playCard,
            retractCard,
            revealCards,
            clearCards
        },
        me: myParticipant,
        isConnected: socket.readyState === WebSocket.OPEN
    };
}
