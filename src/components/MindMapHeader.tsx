import { Sun, Moon, Brain } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface MindMapHeaderProps {
    onToggleTheme: () => void;
    onNavigateHome: () => void;
}

export default function MindMapHeader({ onToggleTheme, onNavigateHome }: MindMapHeaderProps) {
    const { theme } = useTheme();

    const navBgClass = theme === 'dark'
        ? 'bg-slate-800/60 border-slate-700/30'
        : 'bg-white/80 border-gray-200/30';

    const linkHoverClass = theme === 'dark'
        ? 'hover:bg-slate-700 text-gray-300 hover:text-blue-400'
        : 'hover:bg-gray-100 text-gray-700 hover:text-blue-600';

    const buttonBgClass = theme === 'dark'
        ? 'bg-slate-700/50 hover:bg-slate-600 text-yellow-400'
        : 'bg-gray-200 hover:bg-gray-300 text-amber-600';

    return (
        <>
            {/* Navigation Bar */}
            <nav className={`fixed top-0 w-full z-50 backdrop-blur-sm transition-colors duration-300 ${navBgClass} border-b`}>
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
                            <Brain className="w-7 h-7 text-blue-500" />
                            <span className="hidden sm:inline">Công Nghiệp Hóa Việt Nam</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onNavigateHome}
                            className={`px-3 py-2 rounded-lg transition-colors ${linkHoverClass}`}
                        >
                            ← Về trang chính
                        </button>
                        <button
                            onClick={onToggleTheme}
                            className={`p-2 rounded-lg transition-colors ${buttonBgClass}`}
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Page Header */}
            <div className={`mt-20 ${theme === 'dark'
                ? 'bg-linear-to-r from-blue-600 to-cyan-600'
                : 'bg-linear-to-r from-blue-500 to-cyan-500'
                } px-6 py-8 shadow-lg border-b ${theme === 'dark' ? 'border-slate-700/30' : 'border-blue-200/30'}`}>
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-white">🧠 MindMap AI</h1>
                    <p className={`mt-2 ${theme === 'dark' ? 'text-blue-100' : 'text-blue-50'}`}>
                        Tạo mindmap từ lý thuyết kinh tế chính trị Mác-Lênin
                    </p>
                </div>
            </div>
        </>
    );
}
