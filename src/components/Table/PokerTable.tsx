import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PokerTableProps {
    children?: ReactNode;
}

export default function PokerTable({ children }: PokerTableProps) {
    return (
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
            <motion.div
                className="relative w-full max-w-4xl aspect-[2/1]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                {/* Outer wood border */}
                <div className="absolute inset-0 rounded-[50%] bg-gradient-to-br from-wood to-wood-dark shadow-2xl" />

                {/* Inner felt surface */}
                <div
                    className="absolute inset-2 md:inset-3 rounded-[50%] felt-texture overflow-hidden"
                    style={{
                        boxShadow: 'inset 0 4px 20px rgba(0, 0, 0, 0.4)',
                    }}
                >
                    {/* Felt texture overlay */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
                        }}
                    />

                    {/* Ambient light animation */}
                    <motion.div
                        className="absolute inset-0 rounded-[50%] pointer-events-none"
                        animate={{
                            boxShadow: [
                                'inset 0 0 60px rgba(212, 175, 55, 0.05)',
                                'inset 0 0 80px rgba(212, 175, 55, 0.1)',
                                'inset 0 0 60px rgba(212, 175, 55, 0.05)',
                            ],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />

                    {/* Table rail/edge highlight */}
                    <div
                        className="absolute inset-0 rounded-[50%]"
                        style={{
                            boxShadow: 'inset 0 0 0 2px rgba(212, 175, 55, 0.2)',
                        }}
                    />

                    {/* Content area for cards - constrained to inner area to stay within oval */}
                    <div className="absolute inset-4 md:inset-12 flex items-center justify-center">
                        {children}
                    </div>
                </div>

                {/* Decorative suit elements with subtle pulsing animation */}
                <motion.div
                    className="absolute top-1/2 left-4 md:left-8 transform -translate-y-1/2 text-gold/20 text-4xl"
                    animate={{
                        opacity: [0.15, 0.25, 0.15],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                >
                    ♠
                </motion.div>
                <motion.div
                    className="absolute top-1/2 right-4 md:right-8 transform -translate-y-1/2 text-gold/20 text-4xl"
                    animate={{
                        opacity: [0.15, 0.25, 0.15],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1.5, // Offset from the left decoration
                    }}
                >
                    ♦
                </motion.div>
            </motion.div>
        </div>
    );
}

