interface ProgressBarProps {
    progress: number;
    showLabel?: boolean;
    size?: 'sm' | 'md';
}

export function ProgressBar({ progress, showLabel = false, size = 'md' }: ProgressBarProps) {
    const safeProgress = Math.min(100, Math.max(0, progress));
    const heightClass = size === 'sm' ? 'h-2' : 'h-3';

    return (
        <div className="w-full">
            <div className="flex items-center gap-3">
                <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClass}`}>
                    <div
                        className={`bg-blue-600 ${heightClass} rounded-full transition-all duration-300`}
                        style={{ width: `${safeProgress}%` }}
                    />
                </div>
                {showLabel && <span className="text-sm font-medium text-gray-700 w-10 text-right">{safeProgress}%</span>}
            </div>
        </div>
    );
}