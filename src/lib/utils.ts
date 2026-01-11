import { nanoid } from 'nanoid';

// Generate a unique room slug (8 characters)
export function generateRoomSlug(): string {
    return nanoid(8);
}

// Generate a unique ID for participants
export function generateId(): string {
    return nanoid(12);
}

// Copy text to clipboard with fallback
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}

// Get the shareable room URL
export function getRoomUrl(slug: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/room/${slug}`;
}

// Format participant count
export function formatParticipantCount(count: number): string {
    if (count === 1) return '1 player';
    return `${count} players`;
}

// Clamp a value between min and max
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => void>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, wait);
    };
}
