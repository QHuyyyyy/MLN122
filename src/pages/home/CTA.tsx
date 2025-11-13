import { Button } from "../../components/ui/button";
import { useTheme } from "../../contexts/ThemeContext";
import { Link } from "wouter";

export default function CTA() {
    const { theme } = useTheme();

    return (
        <section className={`py-20 px-4 border-t border-b transition-all duration-300 ${theme === "dark" ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-blue-400/30" : "bg-gradient-to-r from-blue-100/40 to-cyan-100/40 border-blue-300/30"}`}>
            <div className="max-w-4xl mx-auto text-center">
                <h2 className=" py-3 text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Hành Trình Công Nghiệp Hóa Việt Nam
                </h2>
                <p className={`text-xl mb-8 leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                    Việt Nam đang tích cực hội nhập kinh tế quốc tế và thích ứng với bối cảnh cách mạng công nghiệp 4.0 để xây dựng nền sản xuất hiện đại, bền vững.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/practice">
                        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 text-lg rounded-lg w-full sm:w-auto">
                            🎯 Luyện Tập Ngay
                        </Button>
                    </Link>
                    <Button variant="outline" className={`px-8 py-6 text-lg rounded-lg transition-colors ${theme === "dark" ? "border-blue-400 text-blue-400 hover:bg-blue-400/10" : "border-blue-600 text-blue-600 hover:bg-blue-600/10"}`}>
                        Liên Hệ
                    </Button>
                </div>
            </div>
        </section>
    );
}
