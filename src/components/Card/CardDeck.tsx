import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './Card';
import { Card as CardType } from '../../lib/types';
import { createPlayerDeck } from '../../lib/cards';

interface CardDeckProps {
    selectedCard: CardType | null;
    onSelectCard: (card: CardType | null) => void;
    disabled?: boolean;
}

// Animation variants for individual cards in the deck
const cardVariants = {
    hidden: {
        opacity: 0,
        y: 100,
        rotate: 20,
        scale: 0.8,
    },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: index * 0.08, // Staggered deal animation
        },
    }),
    exit: {
        opacity: 0,
        y: 80,
        scale: 0.8,
        transition: { duration: 0.2 },
    },
};

// Container animation - subtle entrance
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            when: 'beforeChildren',
            staggerChildren: 0.05,
        },
    },
};

export default function CardDeck({ selectedCard, onSelectCard, disabled = false }: CardDeckProps) {
    // Create deck with random suits on mount
    const deck = useMemo(() => createPlayerDeck(), []);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [cardSize, setCardSize] = useState<'xs' | 'md'>('md');

    // Responsive card size
    useEffect(() => {
        const handleResize = () => {
            setCardSize(window.innerWidth < 640 ? 'xs' : 'md');
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Track when initial deal animation is complete
    useEffect(() => {
        const timer = setTimeout(() => setHasAnimated(true), deck.length * 80 + 500);
        return () => clearTimeout(timer);
    }, [deck.length]);

    const handleCardClick = (card: CardType) => {
        if (disabled) return;

        // If clicking the same card, deselect it
        if (selectedCard && selectedCard.value === card.value) {
            onSelectCard(null);
        } else {
            onSelectCard(card);
        }
    };

    // Calculate card positions for fan layout
    const getCardStyle = (index: number, total: number): React.CSSProperties => {
        const centerIndex = (total - 1) / 2;
        const offset = index - centerIndex;
        // Tighter fan on smaller screens
        const rotationPerCard = cardSize === 'xs' ? 4 : 6;
        const rotation = offset * rotationPerCard;
        const yOffset = Math.abs(offset) * (cardSize === 'xs' ? 2 : 3);

        return {
            transform: `rotate(${rotation}deg)`,
            marginTop: yOffset,
            zIndex: index,
        };
    };

    return (
        <motion.div
            className="bg-black/30 border-t border-white/10 pt-10 pb-6 px-4 backdrop-blur-sm overflow-visible"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex justify-center items-end gap-2 md:gap-3 overflow-x-auto overflow-y-visible pb-2 pt-12">
                <AnimatePresence mode="popLayout">
                    {deck.map((card, index) => {
                        const isSelected = selectedCard?.value === card.value;

                        return (
                            <motion.div
                                key={`${card.value}-${card.suit}`}
                                layout={hasAnimated} // Only enable layout animation after initial deal
                                custom={index}
                                variants={cardVariants}
                                initial="hidden"
                                animate={{
                                    opacity: 1,
                                    y: isSelected ? -30 : 0,
                                    rotate: 0,
                                    scale: isSelected ? 1.12 : 1,
                                    transition: {
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 25,
                                    },
                                }}
                                exit="exit"
                                whileHover={!disabled && !isSelected ? {
                                    y: -15,
                                    scale: 1.05,
                                    transition: { duration: 0.2 },
                                } : undefined}
                                whileTap={!disabled ? { scale: 0.98 } : undefined}
                                style={getCardStyle(index, deck.length)}
                                className={`relative ${isSelected ? 'z-50' : ''}`}
                            >
                                {/* Selection glow effect */}
                                {isSelected && (
                                    <motion.div
                                        className="absolute -inset-4 bg-gold/20 rounded-xl blur-xl"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{
                                            opacity: [0.3, 0.6, 0.3],
                                            scale: 1,
                                        }}
                                        transition={{
                                            opacity: {
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            },
                                            scale: {
                                                duration: 0.3,
                                            },
                                        }}
                                    />
                                )}
                                <Card
                                    card={card}
                                    isSelected={isSelected}
                                    onClick={() => handleCardClick(card)}
                                    size={cardSize}
                                    disabled={disabled}
                                />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Instructions with animation */}
            <motion.p
                className="text-center text-white/40 text-sm mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: deck.length * 0.08 + 0.3 }}
            >
                <AnimatePresence mode="wait">
                    {disabled ? (
                        <motion.span
                            key="disabled"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                        >
                            🔒 Cards revealed - wait for new round
                        </motion.span>
                    ) : selectedCard ? (
                        <motion.span
                            key="selected"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-gold-light"
                        >
                            ✓ Playing: {selectedCard.displayValue} - Click another to change
                        </motion.span>
                    ) : (
                        <motion.span
                            key="select"
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                        >
                            Select a card to play
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.p>
        </motion.div>
    );
}

