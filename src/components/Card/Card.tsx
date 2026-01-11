import { motion } from 'framer-motion';
import { Card as CardType } from '../../lib/types';
import { getSuitColor, getSuitSymbol } from '../../lib/cards';

interface CardProps {
    card: CardType;
    isFaceDown?: boolean;
    isSelected?: boolean;
    playerName?: string;
    size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
    style?: React.CSSProperties;
    disabled?: boolean;
}

const sizeDimensions = {
    xxs: { width: 64, height: 96, fontSize: 24, suitSize: 16 },
    xs: { width: 96, height: 144, fontSize: 32, suitSize: 24 },
    sm: { width: 144, height: 216, fontSize: 48, suitSize: 36 },
    md: { width: 192, height: 288, fontSize: 72, suitSize: 48 },
    lg: { width: 240, height: 360, fontSize: 96, suitSize: 60 },
};

// Card back pattern component
function CardBack({ size = 'md' }: { size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' }) {
    const dims = sizeDimensions[size];
    return (
        <svg
            width={dims.width}
            height={dims.height}
            viewBox={`0 0 ${dims.width} ${dims.height}`}
            className="absolute inset-0"
        >
            <defs>
                <pattern id="cardPattern" patternUnits="userSpaceOnUse" width="8" height="8">
                    <path d="M0 0L8 8M8 0L0 8" stroke="#8b0000" strokeWidth="0.5" opacity="0.3" />
                </pattern>
                <linearGradient id="cardBackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#c41e3a' }} />
                    <stop offset="50%" style={{ stopColor: '#8b0000' }} />
                    <stop offset="100%" style={{ stopColor: '#c41e3a' }} />
                </linearGradient>
            </defs>
            <rect
                x="0"
                y="0"
                width={dims.width}
                height={dims.height}
                rx="6"
                fill="url(#cardBackGradient)"
                stroke="#2d3748" // Darker border for visibility
                strokeWidth="1"
            />
            <rect
                x="3"
                y="3"
                width={dims.width - 6}
                height={dims.height - 6}
                rx="4"
                fill="none"
                stroke="#d4af37"
                strokeWidth="1"
                opacity="0.6"
            />
            <rect
                x="0"
                y="0"
                width={dims.width}
                height={dims.height}
                rx="6"
                fill="url(#cardPattern)"
            />
            {/* Center suit decoration */}
            <text
                x={dims.width / 2}
                y={dims.height / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={dims.fontSize}
                fill="#d4af37"
                opacity="0.5"
            >
                ♠
            </text>
        </svg>
    );
}

// Card front component
function CardFront({ card, size = 'md' }: { card: CardType; size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' }) {
    const dims = sizeDimensions[size];
    const color = getSuitColor(card.suit);
    const symbol = getSuitSymbol(card.suit);
    const isJoker = card.value === 'joker';

    return (
        <svg
            width={dims.width}
            height={dims.height}
            viewBox={`0 0 ${dims.width} ${dims.height}`}
            className="absolute inset-0"
        >
            <defs>
                <linearGradient id="cardFrontGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#fffef5' }} />
                    <stop offset="100%" style={{ stopColor: '#f5f0e6' }} />
                </linearGradient>
            </defs>
            {/* Card background */}
            <rect
                x="0"
                y="0"
                width={dims.width}
                height={dims.height}
                rx="6"
                fill="url(#cardFrontGradient)"
                stroke="#d4d0c8"
                strokeWidth="1"
            />

            {isJoker ? (
                <>
                    {/* Joker card - styled like Ace with ? instead of A */}
                    {/* Top left corner - ? and diamond suit */}
                    <text
                        x="12"
                        y={dims.suitSize + 8}
                        fontSize={dims.suitSize}
                        fill="#8b4513"
                        fontWeight="bold"
                        fontFamily="'Playfair Display', Georgia, serif"
                    >
                        ?
                    </text>
                    <text
                        x="12"
                        y={dims.suitSize * 2 + 12}
                        fontSize={dims.suitSize * 0.9}
                        fill="#8b4513"
                    >
                        ♦
                    </text>

                    {/* Large center diamond */}
                    <text
                        x={dims.width / 2}
                        y={dims.height / 2 - dims.height * 0.08}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={dims.fontSize * 1.5}
                        fill="#8b4513"
                    >
                        ♦
                    </text>

                    {/* JOKER text below diamond - properly centered */}
                    <text
                        x={dims.width / 2}
                        y={dims.height / 2 + dims.height * 0.22}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={dims.suitSize * 0.7}
                        fill="#8b4513"
                        fontWeight="bold"
                        fontFamily="'Playfair Display', Georgia, serif"
                        letterSpacing="2"
                    >
                        JOKER
                    </text>

                    {/* Bottom right corner (rotated) - ? and diamond suit */}
                    <g transform={`translate(${dims.width - 12}, ${dims.height - 12}) rotate(180)`}>
                        <text
                            x="0"
                            y={dims.suitSize + 8}
                            fontSize={dims.suitSize}
                            fill="#8b4513"
                            fontWeight="bold"
                            fontFamily="'Playfair Display', Georgia, serif"
                        >
                            ?
                        </text>
                        <text
                            x="0"
                            y={dims.suitSize * 2 + 12}
                            fontSize={dims.suitSize * 0.9}
                            fill="#8b4513"
                        >
                            ♦
                        </text>
                    </g>
                </>
            ) : (
                <>
                    {/* Top left corner */}
                    <text
                        x="12"
                        y={dims.suitSize + 8}
                        fontSize={dims.suitSize}
                        fill={color === 'red' ? '#c41e3a' : '#1a1a1a'}
                        fontWeight="bold"
                        fontFamily="'Playfair Display', Georgia, serif"
                    >
                        {card.displayValue}
                    </text>
                    <text
                        x="12"
                        y={dims.suitSize * 2 + 12}
                        fontSize={dims.suitSize * 0.9}
                        fill={color === 'red' ? '#c41e3a' : '#1a1a1a'}
                    >
                        {symbol}
                    </text>

                    {/* Center suit */}
                    <text
                        x={dims.width / 2}
                        y={dims.height / 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={dims.fontSize * 1.2}
                        fill={color === 'red' ? '#c41e3a' : '#1a1a1a'}
                    >
                        {symbol}
                    </text>

                    {/* Bottom right corner (rotated) */}
                    <g transform={`translate(${dims.width - 12}, ${dims.height - 12}) rotate(180)`}>
                        <text
                            x="0"
                            y={dims.suitSize + 8}
                            fontSize={dims.suitSize}
                            fill={color === 'red' ? '#c41e3a' : '#1a1a1a'}
                            fontWeight="bold"
                            fontFamily="'Playfair Display', Georgia, serif"
                        >
                            {card.displayValue}
                        </text>
                        <text
                            x="0"
                            y={dims.suitSize * 2 + 12}
                            fontSize={dims.suitSize * 0.9}
                            fill={color === 'red' ? '#c41e3a' : '#1a1a1a'}
                        >
                            {symbol}
                        </text>
                    </g>
                </>
            )}
        </svg>
    );
}

export default function Card({
    card,
    isFaceDown = false,
    isSelected = false,
    playerName,
    size = 'md',
    onClick,
    style,
    disabled = false,
}: CardProps) {
    const dims = sizeDimensions[size];

    return (
        <motion.div
            className={`
        relative cursor-pointer select-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
            style={{
                width: dims.width,
                height: dims.height,
                perspective: '1000px',
                ...style,
            }}
            whileHover={!disabled && !isFaceDown ? { scale: 1.05, y: -10 } : undefined}
            whileTap={!disabled ? { scale: 0.98 } : undefined}
            onClick={!disabled ? onClick : undefined}
        >
            {/* Card container with 3D flip */}
            <motion.div
                className="relative w-full h-full"
                style={{
                    transformStyle: 'preserve-3d',
                }}
                animate={{
                    rotateY: isFaceDown ? 180 : 0,
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                {/* Front face */}
                <div
                    className={`
            absolute inset-0 rounded-lg card-shadow
            ${isSelected ? 'ring-4 ring-gold ring-offset-2 ring-offset-felt' : ''}
          `}
                    style={{
                        backfaceVisibility: 'hidden',
                    }}
                >
                    <CardFront card={card} size={size} />
                </div>

                {/* Back face */}
                <div
                    className="absolute inset-0 rounded-lg card-shadow"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                    }}
                >
                    <CardBack size={size} />
                </div>
            </motion.div>

            {/* Player name label */}
            {playerName && (
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className="text-xs text-white/70 bg-black/40 px-2 py-0.5 rounded">
                        {playerName}
                    </span>
                </div>
            )}
        </motion.div>
    );
}
