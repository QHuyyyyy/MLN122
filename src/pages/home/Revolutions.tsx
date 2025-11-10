import { useTheme } from "../../contexts/ThemeContext";
import { Factory, TrendingUp, Globe } from "lucide-react";

export default function Revolutions() {
    const { theme } = useTheme();

    const card = (idx: string | number, title: string, desc: string, img: string, colorClass: string) => (
        <div
            className={`group p-8 rounded-xl transition-all duration-300 border flex flex-col h-full ${theme === "dark"
                    ? "bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600 hover:from-blue-600/20 hover:to-cyan-600/20 hover:border-blue-400"
                    : "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 hover:from-blue-50/50 hover:to-cyan-50/50 hover:border-blue-400"
                }`}
            key={idx}
        >
            <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center font-bold text-lg shrink-0 text-white`}>
                    {idx}
                </div>
                <h3 className="text-2xl font-bold text-blue-400">{title}</h3>
            </div>
            <p className={`mb-3 leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                {desc}
            </p>
            <img src={img} alt={title} className="rounded-lg w-full h-40 object-cover mt-auto" />
        </div>
    );

    return (
        <section id="revolutions" className={`py-20 px-4 transition-colors duration-300 ${theme === "dark" ? "bg-slate-900" : "bg-white"}`}>
            <div className="max-w-6xl mx-auto">
                <h2 className="py-3 text-4xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    4 Cuộc Cách Mạng Công Nghiệp
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                    {card(
                        "1.0",
                        "Cơ Giới Hóa (1760-1840)",
                        "Khởi phát từ nước Anh, chuyển đổi từ lao động thủ công sang lao động sử dụng máy móc, cơ giới hóa bằng việc sử dụng năng lượng nước và hơi nước.",
                        "/mwbIUJ6B3xhw.jpg",
                        "bg-gradient-to-br from-blue-500 to-cyan-500"
                    )}

                    {card(
                        "2.0",
                        "Điện - Cơ Khí (1870-1960)",
                        "Chuyển nền sản xuất cơ khí sang nền sản xuất điện – cơ khí và sang giai đoạn tự động hóa cục bộ trong sản xuất.",
                        "/rm2qzFwye1Pc.jpg",
                        "bg-gradient-to-br from-cyan-500 to-blue-500"
                    )}

                    {card(
                        "3.0",
                        "Công Nghệ Thông Tin (1960-2000)",
                        "Xuất hiện công nghệ thông tin, tự động hóa sản xuất. Máy tính và internet bắt đầu thay đổi toàn bộ quy trình sản xuất.",
                        "/znYHqDIzMj5k.jpg",
                        "bg-gradient-to-br from-blue-500 to-cyan-500"
                    )}

                    {card(
                        "4.0",
                        "Trí Tuệ Nhân Tạo (2011-Hiện Tại)",
                        "Xuất hiện các công nghệ mới có tính đột phá: trí tuệ nhân tạo, big data, in 3D, IoT. Tích hợp công nghệ vào mọi khía cạnh sản xuất.",
                        "/c6P5joqpHiSU.jpg",
                        "bg-gradient-to-br from-cyan-500 to-blue-500"
                    )}
                </div>
            </div>
        </section>
    );
}
