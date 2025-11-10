import { Zap, Globe } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export default function About() {
    const { theme } = useTheme();

    return (
        <section id="about" className={`py-20 px-4 transition-colors duration-300 ${theme === "dark" ? "bg-slate-800/50" : "bg-slate-100/50"}`}>
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="animate-fade-in-left">
                        <h2 className=" py-3 text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Công Nghiệp Hóa là gì?
                        </h2>
                        <p className={`text-lg mb-4 leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                            Công nghiệp hóa là quá trình chuyển đổi nền sản xuất xã hội từ dựa trên lao động thủ công là chính sang nền sản xuất xã hội trên lao động bằng máy móc nhằm tạo ra năng suất lao động xã hội cao.
                        </p>
                        <p className={`text-lg mb-6 leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                            Đây là một bước phát triển nhảy vọt về chất trình độ của tư liệu lao động trên cơ sở những phát minh đột phá về kỹ thuật và công nghệ.
                        </p>
                        <div className="flex gap-4">
                            <div className="flex items-start gap-3">
                                <Zap className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-blue-400 mb-1">Hiệu Suất Cao</h3>
                                    <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                                        Tăng năng suất lao động đáng kể
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Globe className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
                                <div>
                                    <h3 className="font-semibold text-cyan-400 mb-1">Toàn Cầu</h3>
                                    <p className={theme === "dark" ? "text-slate-400" : "text-slate-600"}>
                                        Hội nhập kinh tế quốc tế
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="animate-fade-in-right">
                        <img src="/mwbIUJ6B3xhw.jpg" alt="Công Nghiệp Hóa" className={`rounded-lg shadow-2xl transition-all duration-300 ${theme === "dark" ? "hover:shadow-blue-500/50" : "hover:shadow-blue-300/50"}`} />
                    </div>
                </div>
            </div>
        </section>
    );
}
