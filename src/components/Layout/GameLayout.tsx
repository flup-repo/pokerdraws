import { ReactNode } from 'react';
import Button from '../ui/Button';
import { copyToClipboard, getRoomUrl } from '../../lib/utils';

interface HeaderProps {
    roomSlug: string;
    roomName?: string;
}

export function Header({ roomSlug, roomName }: HeaderProps) {
    const handleCopyLink = async () => {
        const url = getRoomUrl(roomSlug);
        await copyToClipboard(url);
    };

    return (
        <header className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
            <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gold">PokerDraws</h1>
                <span className="text-white/40">|</span>
                <span className="text-white/70 truncate max-w-[200px]">
                    {roomName || `Room: ${roomSlug}`}
                </span>
            </div>
            <Button variant="secondary" size="sm" onClick={handleCopyLink}>
                📋 Share
            </Button>
        </header>
    );
}

interface GameLayoutProps {
    header: ReactNode;
    table: ReactNode;
    sidebarContent: ReactNode;
    sidebarActions: ReactNode;
    cardDeck: ReactNode;
    leftSidebar?: ReactNode;
}

export default function GameLayout({ header, table, sidebarContent, sidebarActions, cardDeck, leftSidebar }: GameLayoutProps) {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Header - fixed height */}
            {header}

            {/* Main content area - takes remaining space */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
                {/* Left Sidebar - hidden on smaller screens to ensure table space */}
                {leftSidebar && (
                    <aside className="hidden xl:flex w-80 bg-black/20 border-r border-white/10 flex-col overflow-y-auto p-4 shrink-0">
                        {leftSidebar}
                    </aside>
                )}

                {/* Table area */}
                <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    {table}
                </main>

                {/* Sidebar - fixed width, split into scrollable content and sticky actions */}
                <aside className="w-full lg:w-72 xl:w-80 bg-black/20 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col max-h-[30vh] lg:max-h-none">
                    {/* Scrollable content area */}
                    <div className="flex-1 overflow-y-auto p-4 min-h-0">
                        {sidebarContent}
                    </div>

                    {/* Sticky actions at bottom */}
                    <div className="shrink-0 p-4 pt-2 border-t border-white/10 bg-black/30">
                        {sidebarActions}
                    </div>
                </aside>
            </div>

            {/* Card deck at bottom - fixed height */}
            {cardDeck}
        </div>
    );
}
