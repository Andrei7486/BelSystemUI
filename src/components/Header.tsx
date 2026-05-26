import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
}

export function Header({ title, subtitle, onBack }: HeaderProps) {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <button
                            type="button"
                            onClick={onBack}
                            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            aria-label="Go back"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
                        {subtitle && <p className="text-sm sm:text-base text-gray-600 mt-1">{subtitle}</p>}
                    </div>
                </div>
            </div>
        </header>
    );
}