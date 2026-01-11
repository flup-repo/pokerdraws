import { motion, AnimatePresence } from 'framer-motion';
import { Participant, RoomStatus } from '../../lib/types';
import { formatParticipantCount } from '../../lib/utils';

interface ParticipantListProps {
    participants: Participant[];
    currentUserId?: string;
    roomStatus: RoomStatus;
}

function getStatusIcon(participant: Participant, roomStatus: RoomStatus): string {
    if (roomStatus === 'revealed') {
        return '✓';
    }
    if (participant.playedCard) {
        return '🃏';
    }
    return '⏳';
}

function getStatusLabel(participant: Participant, roomStatus: RoomStatus): string {
    if (roomStatus === 'revealed') {
        return 'Revealed';
    }
    if (participant.playedCard) {
        return 'Card played';
    }
    return 'Thinking...';
}

// Animation variants for participant items
const participantVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.9 },
    visible: (index: number) => ({
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 25,
            delay: index * 0.08,
        },
    }),
    exit: {
        opacity: 0,
        x: 30,
        scale: 0.9,
        transition: { duration: 0.2 },
    },
};

// Status icon animation variants
const statusIconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
        scale: 1,
        rotate: 0,
        transition: {
            type: 'spring',
            stiffness: 400,
            damping: 15,
        },
    },
    pulse: {
        scale: [1, 1.2, 1],
        transition: {
            duration: 0.3,
        },
    },
};

export default function ParticipantList({
    participants,
    currentUserId,
    roomStatus
}: ParticipantListProps) {
    const connectedCount = participants.filter(p => p.isConnected).length;

    return (
        <motion.div
            className="flex flex-col h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header with animated count */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white/80">Players</h2>
                <motion.span
                    className="text-sm text-white/50 bg-white/10 px-2 py-0.5 rounded"
                    key={connectedCount}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    {formatParticipantCount(connectedCount)}
                </motion.span>
            </div>

            {/* Participants list with AnimatePresence */}
            <ul className="space-y-2 flex-1 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                    {participants.map((participant, index) => {
                        const isCurrentUser = participant.id === currentUserId;
                        const statusIcon = getStatusIcon(participant, roomStatus);
                        const hasPlayedCard = participant.playedCard !== null;

                        return (
                            <motion.li
                                key={participant.id}
                                layout
                                custom={index}
                                variants={participantVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className={`
                                    flex items-center gap-3 rounded-lg p-3 transition-colors relative overflow-hidden
                                    ${isCurrentUser ? 'bg-gold/10 border border-gold/20' : 'bg-white/5'}
                                    ${!participant.isConnected ? 'opacity-50' : ''}
                                `}
                            >
                                {/* Played card highlight effect */}
                                {hasPlayedCard && roomStatus === 'playing' && (
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent pointer-events-none"
                                        initial={{ opacity: 0, x: '-100%' }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4 }}
                                    />
                                )}

                                {/* Status icon with animation */}
                                <motion.span
                                    className="text-xl relative z-10"
                                    key={`${participant.id}-${statusIcon}`}
                                    variants={statusIconVariants}
                                    initial="initial"
                                    animate="animate"
                                >
                                    {statusIcon}
                                </motion.span>

                                {/* Name and status */}
                                <div className="flex-1 min-w-0 relative z-10">
                                    <div className="flex items-center gap-2">
                                        <motion.span
                                            className={`truncate ${isCurrentUser ? 'text-gold' : 'text-white'}`}
                                            layout
                                        >
                                            {participant.nickname}
                                        </motion.span>
                                        {isCurrentUser && (
                                            <motion.span
                                                className="text-xs text-gold/70"
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                (You)
                                            </motion.span>
                                        )}
                                    </div>
                                    <motion.span
                                        className="text-xs text-white/40"
                                        key={`${participant.id}-${getStatusLabel(participant, roomStatus)}`}
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {getStatusLabel(participant, roomStatus)}
                                    </motion.span>
                                </div>

                                {/* Connection indicator with pulse animation */}
                                <motion.div
                                    className={`w-2 h-2 rounded-full relative z-10 ${participant.isConnected ? 'bg-green-400' : 'bg-gray-500'
                                        }`}
                                    title={participant.isConnected ? 'Connected' : 'Disconnected'}
                                    animate={participant.isConnected ? {
                                        boxShadow: [
                                            '0 0 0 0 rgba(74, 222, 128, 0.4)',
                                            '0 0 0 4px rgba(74, 222, 128, 0)',
                                        ],
                                    } : undefined}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: 'easeOut',
                                    }}
                                />
                            </motion.li>
                        );
                    })}
                </AnimatePresence>
            </ul>

            {/* Empty state with animation */}
            <AnimatePresence>
                {participants.length === 0 && (
                    <motion.div
                        className="text-center text-white/40 py-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <motion.p
                            animate={{ opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            Waiting for players...
                        </motion.p>
                        <p className="text-sm mt-1">Share the room link to invite others</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

