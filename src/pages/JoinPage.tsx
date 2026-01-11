import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function JoinPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [storedNickname, setStoredNickname] = useLocalStorage<string>('pokerdraws-nickname', '');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Pre-fill nickname from localStorage and select text
    useEffect(() => {
        if (storedNickname) {
            setNickname(storedNickname);
            // Select text after state updates
            setTimeout(() => {
                inputRef.current?.select();
            }, 0);
        }
    }, [storedNickname]);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedNickname = nickname.trim();

        if (!trimmedNickname) {
            setError('Please enter a nickname');
            return;
        }

        if (trimmedNickname.length > 20) {
            setError('Nickname must be 20 characters or less');
            return;
        }

        // Save nickname for future sessions
        setStoredNickname(trimmedNickname);

        // Navigate to room
        navigate(`/room/${slug}`);
    };

    return (
        <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gold mb-2">PokerDraws</h1>
                <p className="text-white/60">Join the planning session</p>
            </div>

            {/* Join Form */}
            <form onSubmit={handleJoin} className="w-full max-w-md">
                <div className="glass-panel rounded-2xl p-8 shadow-xl">
                    <h2 className="text-2xl font-semibold mb-6 text-center">What's your name?</h2>

                    <Input
                        ref={inputRef}
                        placeholder="Enter your nickname"
                        value={nickname}
                        onChange={(e) => {
                            setNickname(e.target.value);
                            setError('');
                        }}
                        onFocus={(e) => e.target.select()}
                        error={error}
                        maxLength={20}
                        autoFocus
                    />

                    <Button type="submit" className="w-full mt-6" size="lg">
                        Join Room
                    </Button>
                </div>
            </form>

            {/* Back Link */}
            <button
                onClick={() => navigate('/')}
                className="mt-6 text-white/50 hover:text-white transition-colors"
            >
                ← Create a new room instead
            </button>
        </div>
    );
}
