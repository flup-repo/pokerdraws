import { motion } from 'framer-motion';
import { Participant, RoomStatus } from '../../lib/types';
import { CARD_VALUES } from '../../lib/cards';

interface SummaryProps {
    participants: Participant[];
    roomStatus: RoomStatus;
}

export default function Summary({ participants, roomStatus }: SummaryProps) {
    if (roomStatus !== 'revealed') {
        return null;
    }

    // Count occurrences of each card value
    const counts = participants.reduce((acc, p) => {
        if (p.playedCard && p.isConnected) {
            const val = p.playedCard.value;
            acc.set(val, (acc.get(val) || 0) + 1);
        }
        return acc;
    }, new Map<string | number, number>());

    // Sort items based on CARD_VALUES order
    const summaryItems = CARD_VALUES
        .filter(value => counts.has(value))
        .map(value => {
            const count = counts.get(value)!;
            // Find a sample card to get the display string
            const sampleCard = participants.find(p => p.playedCard?.value === value)?.playedCard;

            return {
                value,
                display: sampleCard?.displayValue || String(value),
                count
            };
        });

    return (
        <motion.div
            className="flex flex-col h-full"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white/80">Played Cards</h2>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
                {summaryItems.length === 0 ? (
                    <p className="text-white/40 text-sm">No cards played</p>
                ) : (
                    summaryItems.map((item, index) => (
                        <motion.div
                            key={item.value}
                            className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/5"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-center gap-3 w-full">
                                <div className="bg-gold/10 w-10 h-10 rounded flex items-center justify-center border border-gold/20">
                                    <span className="text-gold font-bold text-lg">{item.display}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white text-sm font-medium">Card {item.display}</span>
                                    <span className="text-white/50 text-xs">{item.count} {item.count === 1 ? 'time' : 'times'} played</span>
                                </div>
                            </div>
                            <div className="text-gold/50 font-bold text-lg opacity-50">
                                {item.count}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
