import { useState, useRef, useEffect } from 'react';
import { Loader2, Send, Mic } from 'lucide-react';
import MindMapHeader from '../components/MindMapHeader';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from 'wouter';
import { useGeminiQA } from '../hooks/useGeminiQA';

export default function Chatbot() {
    const { loading, error, ask, hasApiConfig } = useGeminiQA();
    const { theme, toggleTheme } = useTheme();
    const [, navigate] = useLocation();

    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Array<{ id: string; from: 'user' | 'bot'; text: string }>>([]);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const showHero = messages.length === 0;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    const send = async () => {
        const text = input.trim();
        if (!text) return;
        const id = String(Date.now());
        setMessages(prev => [...prev, { id, from: 'user', text }]);
        setInput('');

        try {
            const botId = `${id}-bot`;
            setMessages(prev => [...prev, { id: botId, from: 'bot', text: 'Đang trả lời...' }]);
            const res = await ask(text);
            setMessages(prev => prev.map(m => m.id === botId ? { ...m, text: res ?? 'Không có câu trả lời.' } : m));
        } catch (e) {
            setMessages(prev => [...prev, { id: `err-${Date.now()}`, from: 'bot', text: 'Có lỗi khi gọi API. Vui lòng thử lại.' }]);
        }
    };

    // note: input key handling is done inline on the input/textarea elements

    const handleNavigateHome = () => navigate('/');
    const handleNavigateMindMap = () => navigate('/mindmap');

    return (
        <div className={`w-full h-screen flex flex-col ${theme === 'dark'
            ? 'bg-slate-950'
            : 'bg-gray-50'}
        `}>
            <MindMapHeader
                onToggleTheme={() => toggleTheme?.()}
                onNavigateHome={handleNavigateHome}
                onNavigateMindMap={handleNavigateMindMap}
            />

            <main className="flex-1 pt-20 px-6 pb-6">
                <div className="mx-auto max-w-1000px h-[calc(100vh-6rem)] flex flex-col">
                    {showHero ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-full max-w-3xl px-4">
                                <h1 className="text-center text-3xl md:text-4xl font-medium mb-8">What's on the agenda today?</h1>
                                <div className="flex items-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full px-4 py-3 shadow-sm">
                                    <input
                                        className="flex-1 bg-transparent outline-none px-3 text-gray-700 dark:text-gray-100"
                                        placeholder={hasApiConfig ? 'Ask anything' : 'Vui lòng cấu hình VITE_GEMINI_API_KEY để dùng chatbot.'}
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); send(); } }}
                                        disabled={!hasApiConfig}
                                    />
                                    <button
                                        onClick={send}
                                        disabled={!hasApiConfig || loading || input.trim() === ''}
                                        className="ml-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        Ask
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 relative flex flex-col">
                            <div className="px-6 pt-6">
                                <h2 className="text-2xl font-semibold text-center">Chat hỗ trợ - Kinh tế Chính trị Mác-Lênin</h2>
                                <p className="text-xs mt-1 text-gray-500 text-center">Hỏi về giáo trình, lý thuyết và khái niệm. Nếu câu hỏi ngoài phạm vi, hệ thống sẽ trả lời không có dữ liệu.</p>
                            </div>

                            <div className="flex-1 overflow-y-auto flex flex-col items-center">
                                <div className="w-full max-w-4xl px-6 py-8 space-y-4">
                                    {messages.length === 0 && (
                                        <div className="text-center text-sm text-gray-500">Nhập câu hỏi ở khung dưới và nhấn Enter hoặc nút Gửi.</div>
                                    )}

                                    {messages.map(m => (
                                        <div key={m.id} className="w-full flex">
                                            <div className={`w-full flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`inline-block px-5 py-3 rounded-lg ${m.from === 'user'
                                                    ? 'bg-blue-600 text-white max-w-[65%]'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 max-w-[70%]'}
                                                    `}>
                                                    <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={bottomRef} />
                                </div>
                            </div>

                            {/* Bottom sticky input - centered pill */}
                            <div className="fixed left-0 right-0 bottom-0 flex justify-center pb-6 pointer-events-none bg-linear-to-t from-white dark:from-slate-950 to-transparent">
                                <div className="pointer-events-auto w-full max-w-4xl px-6">
                                    {error && (
                                        <div className="mb-3 text-sm text-red-600">{error}</div>
                                    )}
                                    <div className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full px-4 py-2 shadow-lg">
                                        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700"><Mic className="w-5 h-5" /></button>
                                        <input
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                                            placeholder={hasApiConfig ? 'Ask anything' : 'Vui lòng cấu hình VITE_GEMINI_API_KEY để dùng chatbot.'}
                                            className="flex-1 bg-transparent outline-none px-3 text-gray-700 dark:text-gray-100"
                                            disabled={!hasApiConfig}
                                        />
                                        <button
                                            onClick={send}
                                            disabled={!hasApiConfig || loading || input.trim() === ''}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                            <span className="hidden sm:inline">Gửi</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}

