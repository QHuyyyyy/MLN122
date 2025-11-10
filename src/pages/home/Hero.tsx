import { ChevronDown } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useEffect, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function Hero() {
    const [scrollY, setScrollY] = useState(0);
    const { theme } = useTheme();

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
            <div className="absolute inset-0 z-0">
                <img
                    src="/ShPb8BD9Fw7G.jpg"
                    alt="Hero Background"
                    className="w-full h-full object-cover transition-opacity duration-300"
                    style={{
                        transform: `translateY(${scrollY * 0.5}px)`,
                        opacity: theme === "dark" ? 0.2 : 0.08,
                    }}
                />
                <div className={`absolute inset-0 transition-colors duration-300 ${theme === "dark"
                    ? "bg-gradient-to-b from-slate-900/50 via-slate-800/70 to-slate-900/90"
                    : "bg-gradient-to-b from-white/40 via-slate-100/60 to-white/90"
                    }`}></div>
            </div>

            <div className="absolute inset-0 overflow-hidden z-0">
                <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse transition-colors duration-300 ${theme === "dark" ? "bg-blue-500/20" : "bg-blue-400/15"
                    }`}></div>
                <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse transition-colors duration-300 ${theme === "dark" ? "bg-cyan-500/20" : "bg-cyan-400/15"
                    }`} style={{ animationDelay: "1s" }}></div>
            </div>

            <div className="relative z-10 text-center max-w-4xl mx-auto px-4 animate-fade-in">
                <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">Công Nghiệp Hóa</span>
                    <br />
                    <span className={theme === "dark" ? "text-white" : "text-slate-800"}>
                        Hiện Đại Hóa Việt Nam
                    </span>
                </h1>
                <p className={`text-xl md:text-2xl mb-8 leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-slate-300" : "text-slate-600"
                    }`}>
                    Hành trình chuyển đổi từ sản xuất thủ công sang nền sản xuất hiện đại với công nghệ tiên tiến
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 text-lg rounded-lg">
                        Khám Phá Ngay
                    </Button>
                    <Button variant="outline" className={`px-8 py-6 text-lg rounded-lg transition-colors ${theme === "dark"
                        ? "border-blue-400 text-blue-400 hover:bg-blue-400/10"
                        : "border-blue-600 text-blue-600 hover:bg-blue-600/10"
                        }`}>
                        Tìm Hiểu Thêm
                    </Button>
                </div>
            </div>

            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                <ChevronDown className={`w-8 h-8 transition-colors duration-300 ${theme === "dark" ? "text-blue-400" : "text-blue-600"
                    }`} />
            </div>
        </section>
    );
}
