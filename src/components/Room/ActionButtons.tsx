import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { RoomStatus } from '../../lib/types';
import { copyToClipboard, getRoomUrl } from '../../lib/utils';

interface ActionButtonsProps {
    roomSlug: string;
    roomStatus: RoomStatus;
    hasPlayedCards: boolean;
    onReveal: () => void;
    onClear: () => void;
}

// Button animation variants
const buttonVariants = {
    initial: { opacity: 1, y: 0, scale: 1 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 300,
            damping: 25,
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.9,
        transition: { duration: 0.2 },
    },
    pulse: {
        scale: [1, 1.02, 1],
        opacity: 1,
        y: 0,
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

export default function ActionButtons({
    roomSlug,
    roomStatus,
    hasPlayedCards,
    onReveal,
    onClear,
}: ActionButtonsProps) {
    const [copied, setCopied] = useState(false);
    const [showUrlFallback, setShowUrlFallback] = useState(false);

    const handleCopyLink = async () => {
        const url = getRoomUrl(roomSlug);
        const success = await copyToClipboard(url);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } else {
            setShowUrlFallback(true);
        }
    };

    const isRevealed = roomStatus === 'revealed';
    const canReveal = hasPlayedCards && !isRevealed;

    return (
        <div className="space-y-3 mt-8">
            {/* Reveal / Clear Button with dramatic transitions */}
            <AnimatePresence mode="wait">
                {!isRevealed ? (
                    <motion.div
                        key="reveal"
                        variants={buttonVariants}
                        initial="initial"
                        animate={canReveal ? "pulse" : "visible"}
                        exit="exit"
                        className="relative"
                    >
                        {/* Glow effect when button is ready */}
                        {canReveal && (
                            <motion.div
                                className="absolute -inset-2 bg-gold/30 rounded-xl blur-lg"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: [0.3, 0.6, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />
                        )}
                        <Button
                            className="w-full relative z-10"
                            disabled={!canReveal}
                            onClick={onReveal}
                        >
                            <motion.span
                                className="flex items-center justify-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="mr-2">👁️</span>
                                Reveal Cards
                            </motion.span>
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="clear"
                        variants={buttonVariants}
                        initial="initial"
                        animate="visible"
                        exit="exit"
                        className="relative"
                    >
                        {/* Celebration sparkle effect */}
                        <motion.div
                            className="absolute -inset-2 bg-gradient-to-r from-gold/20 via-gold-light/30 to-gold/20 rounded-xl blur-lg"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0.4, 0.7, 0.4],
                                backgroundPosition: ['0%', '100%', '0%'],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'linear',
                            }}
                        />
                        <Button
                            className="w-full relative z-10"
                            onClick={onClear}
                        >
                            <motion.span
                                className="flex items-center justify-center"
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 0 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.span
                                    className="mr-2 inline-block"
                                    animate={{ rotate: [0, 360] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'linear',
                                        repeatDelay: 3,
                                    }}
                                >
                                    🔄
                                </motion.span>
                                New Round
                            </motion.span>
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Copy Link Button or Fallback */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                {showUrlFallback ? (
                    <div className="bg-black/20 p-3 rounded-xl border border-white/10">
                        <p className="text-xs text-white/50 mb-1 ml-1">Share this link:</p>
                        <input
                            readOnly
                            value={getRoomUrl(roomSlug)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-gold select-all focus:outline-none focus:ring-1 focus:ring-gold font-mono"
                            onClick={(e) => e.currentTarget.select()}
                            autoFocus
                        />
                        <button
                            onClick={() => setShowUrlFallback(false)}
                            className="text-xs text-white/40 hover:text-white mt-2 w-full text-center hover:underline"
                        >
                            Back to button
                        </button>
                    </div>
                ) : (
                    <Button
                        variant="secondary"
                        className="w-full relative overflow-hidden"
                        onClick={handleCopyLink}
                    >
                        <AnimatePresence mode="wait">
                            {copied ? (
                                <motion.span
                                    key="copied"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center justify-center text-green-400"
                                >
                                    <motion.span
                                        className="mr-2"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.3, 1] }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        ✓
                                    </motion.span>
                                    Link Copied!
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="copy"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex items-center justify-center"
                                >
                                    <span className="mr-2">📋</span>
                                    Copy Invite Link
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Button>
                )}
            </motion.div>

            {/* Dynamic instruction text */}
            <AnimatePresence>
                {!hasPlayedCards && !isRevealed && (
                    <motion.p
                        className="text-center text-white/30 text-xs"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        Waiting for players to select cards...
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

