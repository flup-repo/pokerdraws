import type { Party, Request, Connection } from "partykit/server";
import type {
    RoomState,
    Participant,
    ClientMessage,
    ServerMessage,
    RoomStatus
} from "../lib/types";

// In-memory state for the room
interface PartyRoomState {
    id: string;
    name: string;
    slug: string;
    createdAt: number;
    state: RoomStatus;
    participants: Map<string, Participant>;
}

export default class PokerRoom {
    party: Party;
    roomState: PartyRoomState | undefined;

    constructor(party: Party) {
        this.party = party;
    }

    // Initialize room if it doesn't exist
    ensureRoomState() {
        if (!this.roomState) {
            this.roomState = {
                id: this.party.id,
                name: "Planning Room", // Default name, can be updated via API if we add that
                slug: this.party.id,
                createdAt: Date.now(),
                state: 'playing',
                participants: new Map()
            };
        }
        return this.roomState;
    }

    // Helper to broadcast state to all connected clients
    broadcastState() {
        if (!this.roomState) return;

        // Convert Map to Array for transmission
        const publicState: RoomState = {
            ...this.roomState,
            participants: Array.from(this.roomState.participants.values())
        };

        const message: ServerMessage = {
            type: 'state',
            room: publicState
        };

        this.party.broadcast(JSON.stringify(message));
    }

    // Helper to send error to a specific connection
    sendError(connection: Connection, message: string) {
        const errorMsg: ServerMessage = {
            type: 'error',
            message
        };
        connection.send(JSON.stringify(errorMsg));
    }

    async onConnect(conn: Connection, ctx: { request: Request }) {
        const room = this.ensureRoomState();

        // Check max participants
        if (room.participants.size >= 20) {
            this.sendError(conn, "Room is full (max 20 players)");
            return;
        }

        // Parse nickname from query params
        const url = new URL(ctx.request.url);
        const requestedNickname = url.searchParams.get("nickname") || `Guest ${conn.id.slice(0, 4)}`;

        // Handle nickname collisions
        let nickname = requestedNickname;
        let counter = 1;
        const existingNicknames = new Set(
            Array.from(room.participants.values()).map(p => p.nickname)
        );

        while (existingNicknames.has(nickname)) {
            // If nickname has a number at the end, increment it
            // simplified logic: just append number
            nickname = `${requestedNickname}${counter}`;
            counter++;
        }

        // Add participant
        const newParticipant: Participant = {
            id: conn.id,
            nickname,
            isConnected: true,
            playedCard: null
        };

        room.participants.set(conn.id, newParticipant);

        // Send assigned nickname to the user
        const nickMsg: ServerMessage = {
            type: 'nickname-assigned',
            nickname
        };
        conn.send(JSON.stringify(nickMsg));

        // Broadcast update
        this.broadcastState();
    }

    async onClose(conn: Connection) {
        if (!this.roomState) return;

        const participant = this.roomState.participants.get(conn.id);
        if (participant) {
            // Remove participant completely (ephemeral rooms)
            this.roomState.participants.delete(conn.id);

            this.broadcastState();
        }
    }

    async onMessage(message: string | ArrayBuffer, sender: Connection) {
        if (typeof message !== 'string') return;

        if (!this.roomState) return;

        let data: ClientMessage;
        try {
            data = JSON.parse(message);
        } catch (e) {
            return; // Ignore invalid JSON
        }

        const participant = this.roomState.participants.get(sender.id);
        if (!participant) return;

        switch (data.type) {
            case 'join':
                // Update nickname if they send a join message locally after connection?
                break;

            case 'play':
                if (this.roomState.state === 'playing') {
                    participant.playedCard = data.card;
                    this.broadcastState();
                }
                break;

            case 'retract':
                if (this.roomState.state === 'playing') {
                    participant.playedCard = null;
                    this.broadcastState();
                }
                break;

            case 'reveal':
                this.roomState.state = 'revealed';
                this.broadcastState();
                break;

            case 'clear':
                this.roomState.state = 'playing';
                // Reset all cards
                for (const p of this.roomState.participants.values()) {
                    p.playedCard = null;
                }
                this.broadcastState();
                break;
        }
    }
}
