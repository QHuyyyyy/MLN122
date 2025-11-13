import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export default function Nav() {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav
            className={`fixed top-0 w-full z-50 backdrop-blur-sm transition-colors duration-300 ${theme === "dark"
                ? "bg-gradient-to-b from-slate-900 to-transparent"
                : "bg-gradient-to-b from-white/80 to-transparent border-b border-slate-200/30"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Công Nghiệp Hóa Việt Nam
                </div>
                <div className="flex items-center gap-8">
                    <div className="hidden md:flex gap-8">
                        <a
                            href="#about"
                            className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"
                                }`}
                        >
                            Giới Thiệu
                        </a>
                        <a
                            href="#revolutions"
                            className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"
                                }`}
                        >
                            Cách Mạng
                        </a>
                        <a
                            href="#models"
                            className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"
                                }`}
                        >
                            Mô Hình
                        </a>
                        <a
                            href="#vietnam"
                            className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"
                                }`}
                        >
                            Việt Nam
                        </a>
                        <a
                            href="/mindmap"
                            className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"
                                }`}
                        >
                            MindMap
                        </a>
                        <a
                            href="/chat"
                            className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"
                                }`}
                        >
                            Chatbot
                        </a>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-lg transition-colors ${theme === "dark"
                            ? "bg-slate-800 hover:bg-slate-700 text-yellow-400"
                            : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                            }`}
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </nav>
    );
}
