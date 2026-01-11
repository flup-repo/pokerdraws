import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { generateRoomSlug } from '../lib/utils';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { RecentRoom } from '../lib/types';

export default function HomePage() {
    const [roomName, setRoomName] = useState('');
    const navigate = useNavigate();
    const [recentRooms, setRecentRooms] = useLocalStorage<RecentRoom[]>('pokerdraws-recent-rooms', []);

    const handleCreateRoom = (e: React.FormEvent) => {
        e.preventDefault();
        const name = roomName.trim() || 'Sprint Planning';
        const slug = generateRoomSlug();
        const newRoom: RecentRoom = { slug, name, lastVisited: Date.now() };

        // Add to recent rooms, avoiding duplicates and keeping top 5
        const updatedRooms = [newRoom, ...recentRooms.filter(r => r.slug !== slug)].slice(0, 5);
        setRecentRooms(updatedRooms);

        navigate(`/room/${slug}/join`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-felt-dark text-white">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 text-gold">
                    PokerDraws
                </h1>
                <p className="text-xl text-white/70 max-w-md mx-auto">
                    Real-time Planning Poker for agile teams. Beautiful cards, zero friction.
                </p>
            </div>

            {/* Create Room Form */}
            <div className="w-full max-w-md space-y-6">
                <div className="glass-panel rounded-2xl p-8 shadow-xl">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Start a Session</h2>
                    <form onSubmit={handleCreateRoom}>
                        <div className="space-y-4">
                            <Input
                                label="Room Name (optional)"
                                placeholder="Sprint Planning"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                maxLength={50}
                            />
                            <Button type="submit" className="w-full" size="lg">
                                Create Room
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Recent Rooms */}
                {recentRooms.length > 0 && (
                    <div className="glass-panel rounded-2xl p-6 shadow-xl">
                        <h3 className="text-lg font-semibold mb-4 text-gray-300">Recent Rooms</h3>
                        <div className="space-y-3">
                            {recentRooms.map((room) => (
                                <div
                                    key={room.slug}
                                    onClick={() => navigate(`/room/${room.slug}/join`)}
                                    className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-white/5 group"
                                >
                                    <span className="font-medium truncate">{room.name}</span>
                                    <span className="text-xs text-gold/70 group-hover:text-gold uppercase tracking-wider font-bold">Join</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Card Suite Decoration */}
            <div className="mt-16 flex gap-4 text-4xl opacity-30">
                <span className="text-card-red">♥</span>
                <span className="text-white">♠</span>
                <span className="text-card-red">♦</span>
                <span className="text-white">♣</span>
            </div>

            {/* Footer */}
            <footer className="mt-auto pt-8 text-center text-white/30 text-sm pb-4">
                <p>Free forever • No sign-up required</p>
            </footer>
        </div>
    );
}
