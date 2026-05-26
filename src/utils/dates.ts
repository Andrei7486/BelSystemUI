/**
 * Форматирует дату YYYY-MM-DD в локальный формат
 * Избегает timezone-сдвига при парсинге ISO строк
 * Guard на битые даты
 */
export function formatDisplayDate(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);

    // Guard на битые даты
    if (!year || !month || !day) return dateString;

    return new Date(year, month - 1, day).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Форматирует ISO timestamp в локальный формат с временем
 */
export function formatDisplayDateTime(isoString: string): string {
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return isoString;

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return isoString;
    }
}

/**
 * Возвращает относительное время (например "2 hours ago")
 */
export function formatRelativeTime(isoString: string): string {
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return 'unknown time';

        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        const intervals: [number, string][] = [
            [31536000, 'year'],
            [2592000, 'month'],
            [604800, 'week'],
            [86400, 'day'],
            [3600, 'hour'],
            [60, 'minute'],
            [1, 'second'],
        ];

        for (const [secondsInInterval, intervalName] of intervals) {
            const interval = Math.floor(seconds / secondsInInterval);
            if (interval >= 1) {
                return `${interval} ${intervalName}${interval > 1 ? 's' : ''} ago`;
            }
        }

        return 'just now';
    } catch {
        return 'unknown time';
    }
}