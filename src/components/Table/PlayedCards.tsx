import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card as CardComponent } from '../Card';
import { Participant, RoomStatus } from '../../lib/types';

interface PlayedCardsProps {
    participants: Participant[];
    roomStatus: RoomStatus;
    currentUserId?: string;
}

// Generate a random scatter direction for clear animation
function getScatterDirection(index: number) {
    const angles = [
        { x: -200, y: -150, rotate: -30 },    // top-left
        { x: 200, y: -150, rotate: 30 },      // top-right
        { x: -250, y: 50, rotate: -45 },      // left
        { x: 250, y: 50, rotate: 45 },        // right
        { x: -150, y: 200, rotate: -20 },     // bottom-left
        { x: 150, y: 200, rotate: 20 },       // bottom-right
        { x: 0, y: -200, rotate: 0 },         // top
        { x: 0, y: 250, rotate: 15 },         // bottom
    ];
    return angles[index % angles.length];
}

// Card play animation variants
const cardPlayVariants = {
    initial: {
        opacity: 0,
        scale: 0.3,
        y: 100,
        rotate: 15,
    },
    animate: (index: number) => ({
        opacity: 1,
        scale: 1,
        y: 0,
        rotate: 0,
        transition: {
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: index * 0.08,
        },
    }),
    exit: (index: number) => {
        const scatter = getScatterDirection(index);
        return {
            opacity: 0,
            scale: 0.5,
            x: scatter.x,
            y: scatter.y,
            rotate: scatter.rotate,
            transition: {
                duration: 0.5,
                ease: [0.32, 0, 0.67, 0],
                delay: index * 0.04,
            },
        };
    },
};

// Staggered reveal animation - wrapper that controls when flip happens
const RevealWrapper = ({
    children,
    index,
    isRevealed,
}: {
    children: React.ReactNode;
    index: number;
    isRevealed: boolean;
}) => {
    const [shouldFlip, setShouldFlip] = useState(false);
    const prevRevealed = useRef(isRevealed);

    useEffect(() => {
        // Only trigger staggered reveal when transitioning from hidden to revealed
        if (isRevealed && !prevRevealed.current) {
            const timer = setTimeout(() => {
                setShouldFlip(true);
            }, index * 50); // 50ms staggered delay per card
            prevRevealed.current = isRevealed;
            return () => clearTimeout(timer);
        } else if (!isRevealed) {
            setShouldFlip(false);
            prevRevealed.current = isRevealed;
        }
    }, [isRevealed, index]);

    // Use shouldFlip for staggered animation, but also handle initial state
    const flipState = isRevealed ? shouldFlip : false;

    return (
        <motion.div
            initial={{ scale: 1 }}
            animate={{
                scale: shouldFlip ? [1, 1.05, 1] : 1,
            }}
            transition={{
                duration: 0.3,
                delay: index * 0.05,
            }}
        >
            {/* Clone children with updated isFaceDown prop */}
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        ...child.props,
                        isFaceDown: !flipState,
                    });
                }
                return child;
            })}
        </motion.div>
    );
};

import React from 'react';

export default function PlayedCards({ participants, roomStatus }: PlayedCardsProps) {
    // Filter participants who have played a card
    const playedParticipants = participants.filter(p => p.playedCard !== null);
    const isRevealed = roomStatus === 'revealed';

    // Track previous participants to detect card swaps
    const prevParticipantsRef = useRef<string[]>([]);
    const [isClearing, setIsClearing] = useState(false);

    // Combine real and mock for testing
    const displayParticipants = playedParticipants;

    // Detect when we're about to clear (participants going from some to none)
    useEffect(() => {
        const currentIds = displayParticipants.map(p => p.id);
        const prevIds = prevParticipantsRef.current;

        if (prevIds.length > 0 && currentIds.length === 0) {
            setIsClearing(true);
            // Reset after animation completes
            const timer = setTimeout(() => setIsClearing(false), 600);
            return () => clearTimeout(timer);
        }

        prevParticipantsRef.current = currentIds;
    }, [displayParticipants]);

    // Determine layout props based on count
    const count = displayParticipants.length;

    // Determine card size and spacing based on player count
    let cardSize: 'xxs' | 'xs' | 'sm' = 'sm';
    let gapClass = 'gap-4';

    if (count > 8) {
        // For 9+ players, use tiny cards to fit in 2 rows comfortably
        cardSize = 'xxs';
        gapClass = 'gap-x-1 gap-y-9';
    } else if (count > 4) {
        // For 5-8 players, use small cards (fits 1 row usually, or 2 tightly)
        cardSize = 'xs';
        gapClass = 'gap-x-2 gap-y-9';
    } else {
        // Up to 4 cards, use medium-small cards
        cardSize = 'sm';
        gapClass = 'gap-x-4 gap-y-9';
    }

    if (displayParticipants.length === 0 && !isClearing) {
        return (
            <motion.div
                className="text-center text-white/50 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <motion.p
                    className="text-lg mb-2"
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                >
                    Waiting for cards...
                </motion.p>
                <motion.p
                    className="text-sm"
                    initial={{ y: 10 }}
                    animate={{ y: 0 }}
                >
                    Play a card from your deck below
                </motion.p>
            </motion.div>
        );
    }

    return (
        <div className="flex items-center justify-center w-full h-full overflow-y-auto">
            {/* Cards grid - responsive layout */}
            <div
                className={`flex flex-wrap items-center justify-center ${gapClass} pb-8`}
                style={{ maxWidth: '100%' }}
            >
                <AnimatePresence mode="popLayout">
                    {displayParticipants.map((participant, index) => (
                        <motion.div
                            key={participant.id}
                            layout
                            custom={index}
                            variants={cardPlayVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex-shrink-0"
                        >
                            {participant.playedCard && (
                                <RevealWrapper
                                    index={index}
                                    isRevealed={isRevealed}
                                >
                                    <CardComponent
                                        card={participant.playedCard}
                                        isFaceDown={!isRevealed}
                                        playerName={participant.nickname}
                                        size={cardSize}
                                    />
                                </RevealWrapper>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
