import { Sun, Moon, Brain } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from 'wouter';
import PracticeQuiz from '../components/PracticeQuiz';
import type { QuestionWithType } from '../hooks/useGeminiPractice';

interface PracticeHeaderProps {
    onToggleTheme: () => void;
    onNavigateHome: () => void;
    onNavigateChat?: () => void;
    onNavigateMindMap?: () => void;
}

function PracticeHeader({ onToggleTheme, onNavigateHome, onNavigateChat, onNavigateMindMap }: PracticeHeaderProps) {
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
                        {onNavigateChat && (
                            <button
                                onClick={onNavigateChat}
                                className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${linkHoverClass}`}
                            >
                                💬 Chat
                            </button>
                        )}
                        {onNavigateMindMap && (
                            <button
                                onClick={onNavigateMindMap}
                                className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${linkHoverClass}`}
                            >
                                🧠 Mind Map
                            </button>
                        )}
                        <button
                            onClick={onNavigateHome}
                            className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${linkHoverClass}`}
                        >
                            🏠 Home
                        </button>
                        <button
                            onClick={onToggleTheme}
                            className={`p-2 rounded-lg transition-colors ${buttonBgClass}`}
                            title="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Bottom Navigation Bar */}
            <div className={`fixed bottom-0 w-full z-40 backdrop-blur-sm transition-colors duration-300 ${navBgClass} border-t md:hidden`}>
                <div className="px-4 py-2 flex justify-around">
                    {onNavigateChat && (
                        <button
                            onClick={onNavigateChat}
                            className={`px-3 py-2 rounded-lg transition-colors text-xs font-medium ${linkHoverClass}`}
                        >
                            💬
                        </button>
                    )}
                    {onNavigateMindMap && (
                        <button
                            onClick={onNavigateMindMap}
                            className={`px-3 py-2 rounded-lg transition-colors text-xs font-medium ${linkHoverClass}`}
                        >
                            🧠
                        </button>
                    )}
                    <button
                        onClick={onNavigateHome}
                        className={`px-3 py-2 rounded-lg transition-colors text-xs font-medium ${linkHoverClass}`}
                    >
                        🏠
                    </button>
                </div>
            </div>
        </>
    );
}

export default function Practice() {
    const { theme, toggleTheme } = useTheme();
    const [, navigate] = useLocation();

    const handleToggleTheme = () => {
        toggleTheme?.();
    };

    const handleNavigateHome = () => {
        navigate('/');
    };

    const handleNavigateChat = () => {
        navigate('/chat');
    };

    const handleNavigateMindMap = () => {
        navigate('/mindmap');
    };

    const handleImportQuestion = (questionsToImport: QuestionWithType[]) => {
        // Store the imported questions in sessionStorage
        sessionStorage.setItem('importedQuestions', JSON.stringify(questionsToImport));
        // Navigate to chat
        navigate('/chat');
    };

    return (
        <div className={`w-full min-h-screen flex flex-col ${theme === 'dark'
            ? 'bg-linear-to-br from-slate-950 via-slate-900 to-slate-950'
            : 'bg-linear-to-br from-gray-50 via-white to-gray-50'
            }`}>
            <PracticeHeader
                onToggleTheme={handleToggleTheme}
                onNavigateHome={handleNavigateHome}
                onNavigateChat={handleNavigateChat}
                onNavigateMindMap={handleNavigateMindMap}
            />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden pt-20 pb-20 md:pb-0">
                <PracticeQuiz onImportQuestion={handleImportQuestion} />
            </div>
        </div>
    );
}
