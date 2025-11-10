import { useTheme } from "../../contexts/ThemeContext";

export default function Vietnam() {
    const { theme } = useTheme();

    return (
        <section id="vietnam" className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="py-3 text-4xl md:text-5xl font-bold mb-12 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Công Nghiệp Hóa, Hiện Đại Hóa Ở Việt Nam
                </h2>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <img src="/ShPb8BD9Fw7G.jpg" alt="Vietnam Industry" className="rounded-lg shadow-2xl hover:shadow-blue-500/50 transition-shadow duration-300" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold text-blue-400 mb-6">Đặc Trưng Công Nghiệp Hóa Việt Nam</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-1 bg-gradient-to-b from-blue-400 to-cyan-400 flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-semibold text-blue-400 mb-1">Định Hướng Xã Hội Chủ Nghĩa</h4>
                                    <p className={theme === "dark" ? "text-slate-300" : "text-slate-700"}>
                                        Mục tiêu: Dân giàu, nước mạnh, dân chủ, công bằng, văn minh
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1 bg-gradient-to-b from-cyan-400 to-blue-400 flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-semibold text-cyan-400 mb-1">Gắn Liền Với Kinh Tế Tri Thức</h4>
                                    <p className={theme === "dark" ? "text-slate-300" : "text-slate-700"}>
                                        Phát triển công nghệ và đổi mới sáng tạo
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1 bg-gradient-to-b from-blue-400 to-cyan-400 flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-semibold text-blue-400 mb-1">Kinh Tế Thị Trường Định Hướng</h4>
                                    <p className={theme === "dark" ? "text-slate-300" : "text-slate-700"}>
                                        Trong điều kiện xã hội chủ nghĩa
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1 bg-gradient-to-b from-cyan-400 to-blue-400 flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-semibold text-cyan-400 mb-1">Hội Nhập Kinh Tế Quốc Tế</h4>
                                    <p className={theme === "dark" ? "text-slate-300" : "text-slate-700"}>
                                        Tích cực, chủ động trong bối cảnh toàn cầu hóa
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`p-12 rounded-xl border transition-all duration-300 ${theme === "dark" ? "bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600" : "bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300"}`}>
                    <h3 className="text-3xl font-bold text-cyan-400 mb-8">Nội Dung Công Nghiệp Hóa, Hiện Đại Hóa</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-xl font-semibold text-blue-400 mb-4">1. Tạo Lập Điều Kiện</h4>
                            <p className={`leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                                Thực hiện chuyển đổi từ nền sản xuất – xã hội lạc hậu sang nền sản xuất – xã hội tiến bộ trên tất cả các mặt của đời sống sản xuất xã hội.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-xl font-semibold text-cyan-400 mb-4">2. Thực Hiện Các Nhiệm Vụ</h4>
                            <p className={`leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                                Đẩy mạnh ứng dụng khoa học công nghệ, chuyển đổi cơ cấu kinh tế, hoàn thiện quan hệ sản xuất, thích ứng với cách mạng công nghiệp 4.0.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
