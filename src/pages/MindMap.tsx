import { useState } from 'react';
import { Loader2, Send, AlertCircle, RotateCcw } from 'lucide-react';
import MindMapDisplay from '../components/MindMapDisplay';
import MindMapHeader from '../components/MindMapHeader';
import MindMapSidebar from '../components/MindMapSidebar';
import { useGeminiMindmap } from '../hooks/useGeminiMindmap';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from 'wouter';

export default function MindMap() {
    const [prompt, setPrompt] = useState('');
    const { loading, error, mindmapData, generateMindmap, hasApiConfig, clearMindmap } = useGeminiMindmap();
    const { theme, toggleTheme } = useTheme();
    const [, navigate] = useLocation();

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            alert('Vui lòng nhập prompt');
            return;
        }

        if (!hasApiConfig) {
            alert('Vui lòng cấu hình VITE_GEMINI_API_KEY trong file .env.local');
            return;
        }

        try {
            await generateMindmap(prompt);
        } catch (err) {
            console.error('Error generating mindmap:', err);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && !loading) {
            e.preventDefault();
            handleGenerate();
        }
    };

    // Helper to set prompt programmatically if needed in future
    // const handleApplyPrompt = (appliedPrompt: string) => {
    //     setPrompt(appliedPrompt);
    // };

    const handleNavigateHome = () => {
        navigate('/');
    };

    const handleNavigateChat = () => {
        navigate('/chat');
    };

    const handleToggleTheme = () => {
        toggleTheme?.();
    };

    return (
        <div className={`w-full h-screen flex flex-col ${theme === 'dark'
            ? 'bg-linear-to-br from-slate-950 via-slate-900 to-slate-950'
            : 'bg-linear-to-br from-gray-50 via-white to-gray-50'
            }`}>
            <MindMapHeader
                onToggleTheme={handleToggleTheme}
                onNavigateHome={handleNavigateHome}
                onNavigateChat={handleNavigateChat}
            />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden pt-4 px-4 pb-4 gap-4 mt-20">
                {/* Left Sidebar */}
                <MindMapSidebar>
                    {/* Config Status */}
                    {!hasApiConfig && (
                        <div className={`flex gap-2 p-4 rounded-lg border ${theme === 'dark'
                            ? 'bg-amber-900/20 border-amber-700/30 text-amber-300'
                            : 'bg-amber-100/30 border-amber-300/30 text-amber-700'
                            }`}>
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div>
                                <strong className="block">⚠️ Chưa cấu hình API!</strong>
                                <p className="text-xs mt-1 opacity-90">Thêm VITE_GEMINI_API_KEY vào file .env.local</p>
                            </div>
                        </div>
                    )}

                    {/* Prompt Input */}
                    <div className="flex-1 flex flex-col gap-3">
                        <div>
                            <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                📝 Nhập chủ đề hoặc câu hỏi
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ví dụ: Giải thích về chế độ sản xuất tư bản..."
                                disabled={!hasApiConfig || loading}
                                className={`w-full h-32 p-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all ${theme === 'dark'
                                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-400'
                                    : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            />
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className={`flex gap-3 p-4 rounded-lg border ${theme === 'dark'
                                ? 'bg-red-900/20 border-red-700/30 text-red-300'
                                : 'bg-red-100/30 border-red-300/30 text-red-700'
                                }`}>
                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                <div className="text-sm">{error}</div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !hasApiConfig}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Tạo MindMap
                                </>
                            )}
                        </button>

                        {/* Refresh button to clear current mindmap */}
                        <button
                            onClick={() => clearMindmap?.()}
                            disabled={loading || !mindmapData}
                            className={`mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border ${theme === 'dark' ? 'border-slate-600 text-slate-200 hover:bg-slate-800' : 'border-gray-300 text-gray-800 hover:bg-gray-100'} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <RotateCcw className="w-4 h-4" />
                            Làm mới (xóa mindmap)
                        </button>
                    </div>

                    {/* Info Box */}
                    <div className={`p-4 rounded-lg border ${theme === 'dark'
                        ? 'bg-blue-900/20 border-blue-700/30 text-blue-200'
                        : 'bg-blue-100/30 border-blue-300/30 text-blue-800'
                        } text-xs`}>
                        <strong>Mẹo:</strong> Nhập chi tiết hơn để có mindmap chi tiết hơn. Bạn có thể hỏi về các lý thuyết kinh tế chính trị, giai đoạn phát triển, v.v.
                    </div>

                    {/* Divider */}
                    <div className={`h-px ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-gray-300/50'}`}></div>


                </MindMapSidebar>

                {/* Right Panel - MindMap Display */}
                <div className={`flex-1 rounded-xl overflow-hidden shadow-lg border ${theme === 'dark'
                    ? 'bg-slate-800/50 border-slate-700/30'
                    : 'bg-gray-100/50 border-gray-300/30'
                    }`}>
                    <MindMapDisplay
                        data={mindmapData}
                        className="w-full h-full"
                    />
                </div>
            </div>
        </div>
    );
}
