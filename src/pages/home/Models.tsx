import { Factory, TrendingUp, Globe } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export default function Models() {
    const { theme } = useTheme();

    const card = (Icon: any, title: string, desc: string, meta1: string, meta2: string) => (
        <div className={`p-8 rounded-xl transition-all duration-300 border flex flex-col h-full ${theme === "dark" ? "bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 hover:border-blue-400" : "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 hover:border-blue-400"}`}>
            <Icon className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-2xl font-bold text-blue-400 mb-4">{title}</h3>
            <p className={`mb-4 leading-relaxed ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                {desc}
            </p>
            <div className={`mt-auto p-4 rounded-lg ${theme === "dark" ? "bg-slate-900/50" : "bg-slate-100/50"}`}>
                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}><strong>Thời gian:</strong> {meta1}</p>
                <p className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}><strong>Kết quả:</strong> {meta2}</p>
            </div>
        </div>
    );

    return (
        <section id="models" className={`py-20 px-4 transition-colors duration-300 ${theme === "dark" ? "bg-slate-800/50" : "bg-white"}`}>
            <div className="max-w-6xl mx-auto">
                <h2 className="py-3 text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Mô Hình Công Nghiệp Hóa Trên Thế Giới
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {card(Factory, "Mô Hình Cổ Điển", "Gắn liền với cuộc cách mạng công nghiệp lần thứ nhất, bắt đầu từ công nghiệp nhẹ.", "60-80 năm", "Ít vốn, lợi nhuận cao")}
                    {card(TrendingUp, "Mô Hình Liên Xô", "Ưu tiên phát triển công nghiệp nặng, xây dựng hệ thống cơ sở vật chất kỹ thuật to lớn.", "—", "Nhanh chóng nhưng tốn kém")}
                    {card(Globe, "Mô Hình Nhật Bản & NICs", "Bắt đầu từ công nghiệp nhẹ, phát triển dần theo hướng công nghiệp nặng.", "60-80 năm", "Bền vững, hiệu quả")}
                </div>
            </div>
        </section>
    );
}
