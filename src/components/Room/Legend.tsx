import { CARD_LEGEND } from '../../lib/cards';

export default function Legend() {
    return (
        <div className="pt-4 border-t border-white/10">
            <h3 className="text-sm font-medium text-white/60 mb-3">Card Values</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
                {CARD_LEGEND.map((item) => (
                    <div
                        key={item.display}
                        className="flex items-center gap-2 text-white/40"
                    >
                        <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded text-xs font-bold text-white/70">
                            {item.display}
                        </span>
                        <span className="text-xs">{item.description}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
