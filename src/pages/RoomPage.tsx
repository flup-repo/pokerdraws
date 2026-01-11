import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GameLayout, Header } from '../components/Layout';
import { PokerTable, PlayedCards } from '../components/Table';
import { CardDeck } from '../components/Card';
import { ParticipantList, Legend, ActionButtons, Summary } from '../components/Room';
import { Card, Participant, RoomStatus } from '../lib/types';
import { calculateAverage } from '../lib/cards';
import { usePokerRoom } from '../hooks/usePartySocket';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Average display component - shown above the table with dramatic reveal animation
function AverageDisplay({ participants, roomStatus }: { participants: Participant[], roomStatus: RoomStatus }) {
    const isRevealed = roomStatus === 'revealed';
    const playedCards = participants.filter(p => p.playedCard !== null && p.isConnected).map(p => p.playedCard!);
    const average = isRevealed && playedCards.length > 0 ? calculateAverage(playedCards) : null;

    // Calculate delay based on number of cards (to wait for all flips to complete)
    const revealDelay = playedCards.length * 0.05 + 0.6; // Match staggered reveal timing

    return (
        <div className="h-20 flex items-center justify-center">
            <AnimatePresence>
                {isRevealed && average !== null && (
                    <motion.div
                        initial={{ opacity: 0, y: -30, scale: 0.5, rotateX: -90 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            rotateX: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.5,
                            y: 20,
                            transition: { duration: 0.2 }
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 20,
                            delay: revealDelay,
                        }}
                        className="relative"
                    >
                        {/* Glow effect behind the badge */}
                        <motion.div
                            className="absolute -inset-4 bg-gold/40 rounded-full blur-2xl"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                                opacity: [0.5, 0.8, 0.5],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                delay: revealDelay + 0.2,
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />

                        {/* Main badge */}
                        <motion.div
                            className="relative bg-gradient-to-r from-gold via-gold-light to-gold text-card-black px-10 py-4 rounded-full font-bold text-3xl shadow-2xl border-2 border-gold-light/50"
                            whileHover={{ scale: 1.05 }}
                        >
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: revealDelay + 0.1 }}
                            >
                                Average:{' '}
                            </motion.span>
                            <motion.span
                                className="font-extrabold"
                                initial={{ opacity: 0, scale: 1.5 }}
                                animate={{
                                    opacity: 1,
                                    scale: [1.5, 1],
                                }}
                                transition={{
                                    delay: revealDelay + 0.3,
                                    duration: 0.3,
                                    type: 'spring',
                                }}
                            >
                                {average}
                            </motion.span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Sub-component that handles the active room connection
// We only render this when we are sure we have a nickname
function ActiveRoom({ slug, nickname }: { slug: string, nickname: string }) {
    // Connect to PartyKit
    const { roomState, actions, me, isConnected, error } = usePokerRoom(slug, nickname);

    // Loading state while connecting
    if (!roomState) {
        return (
            <div className="h-screen flex items-center justify-center text-white/50 animate-pulse bg-felt-dark">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-display tracking-widest uppercase text-sm">Connecting to room...</p>
                </div>
            </div>
        );
    }

    const { participants, state: roomStatus } = roomState;
    const hasPlayedCards = participants.some(p => p.playedCard !== null && p.isConnected);
    const currentUserId = me?.id || '';
    const myPlayedCard = me?.playedCard || null;
    const connectedParticipants = participants.filter(p => p.isConnected);
    const isWaitingForPlayers = connectedParticipants.length <= 1;

    // Error state (e.g. Room Full)
    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-felt-dark text-white p-4">
                <div className="max-w-md w-full glass-panel p-8 rounded-2xl text-center space-y-6">
                    <div className="text-6xl mb-4">🚫</div>
                    <h2 className="text-3xl font-bold text-red-400">Unable to Join</h2>
                    <p className="text-xl text-white/80">{error}</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="btn-primary w-full py-3 rounded-xl font-bold text-lg mt-4"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    const handleSelectCard = (card: Card | null) => {
        if (!card) {
            actions.retractCard();
        } else {
            actions.playCard(card);
        }
    };

    return (
        <GameLayout
            header={
                <div className="flex flex-col w-full">
                    {/* Connection Status Banner */}
                    <AnimatePresence>
                        {!isConnected && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-red-500/90 text-white text-center py-1 text-xs font-bold w-full absolute top-0 left-0 z-50 backdrop-blur-sm"
                            >
                                ⚠️ Connection lost. retrying...
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <Header roomSlug={slug} />
                </div>
            }
            table={
                <div className="flex flex-col h-full relative">
                    {/* Waiting for players message */}
                    <AnimatePresence>
                        {isWaitingForPlayers && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center pointer-events-none"
                            >
                                <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-white/80 animate-pulse">
                                    <span className="mr-2">👋</span>
                                    Waiting for others to join...
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Average display - above the table */}
                    <AverageDisplay participants={participants} roomStatus={roomStatus} />

                    {/* Poker table */}
                    <div className="flex-1 min-h-0">
                        <PokerTable>
                            <PlayedCards
                                participants={participants}
                                roomStatus={roomStatus}
                                currentUserId={currentUserId}
                            />
                        </PokerTable>
                    </div>
                </div>
            }
            sidebarContent={
                <>
                    <ParticipantList
                        participants={participants}
                        currentUserId={currentUserId}
                        roomStatus={roomStatus}
                    />
                    <Legend />
                </>
            }
            sidebarActions={
                <ActionButtons
                    roomSlug={slug}
                    roomStatus={roomStatus}
                    hasPlayedCards={hasPlayedCards}
                    onReveal={actions.revealCards}
                    onClear={actions.clearCards}
                />
            }
            cardDeck={
                <CardDeck
                    selectedCard={myPlayedCard}
                    onSelectCard={handleSelectCard}
                    disabled={roomStatus === 'revealed' || !isConnected}
                />
            }
            leftSidebar={
                <Summary
                    participants={participants}
                    roomStatus={roomStatus}
                />
            }
        />
    );
}

export default function RoomPage() {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    // Get nickname from navigation state or localStorage
    const [storedNickname] = useLocalStorage<string>('pokerdraws-nickname', '');
    const nickname = (location.state as { nickname?: string })?.nickname || storedNickname;

    // Redirect to join page if no nickname
    useEffect(() => {
        if (!nickname) {
            navigate(`/room/${slug}/join`, { replace: true });
        }
    }, [nickname, slug, navigate]);

    // Don't render anything (and don't connect!) until we have a nickname
    if (!nickname || !slug) return null;

    return <ActiveRoom slug={slug} nickname={nickname} />;
}
