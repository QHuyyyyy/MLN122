import { useTheme } from "../../contexts/ThemeContext";

export default function Footer() {
    const { theme } = useTheme();

    return (
        <footer className={`py-12 px-4 border-t transition-colors duration-300 ${theme === "dark" ? "bg-slate-900 border-slate-700" : "bg-slate-100 border-slate-300"}`}>
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-blue-400 mb-4">Về Chúng Tôi</h3>
                        <p className={`text-sm leading-relaxed transition-colors duration-300 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                            Tìm hiểu về công nghiệp hóa, hiện đại hóa và cách mạng công nghiệp 4.0 ở Việt Nam.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-cyan-400 mb-4">Liên Kết</h3>
                        <ul className={`space-y-2 text-sm transition-colors duration-300 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                            <li><a href="#about" className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"}`}>Giới Thiệu</a></li>
                            <li><a href="#revolutions" className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"}`}>Cách Mạng</a></li>
                            <li><a href="#models" className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"}`}>Mô Hình</a></li>
                            <li><a href="#vietnam" className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"}`}>Việt Nam</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-blue-400 mb-4">Tài Nguyên</h3>
                        <ul className={`space-y-2 text-sm transition-colors duration-300 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                            <li><a href="#" className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"}`}>Bài Viết</a></li>
                            <li><a href="#" className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"}`}>Nghiên Cứu</a></li>
                            <li><a href="#" className={`transition-colors ${theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600"}`}>Thống Kê</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-cyan-400 mb-4">Liên Hệ</h3>
                        <ul className={`space-y-2 text-sm transition-colors duration-300 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                            <li>Email: info@industry.vn</li>
                            <li>Điện thoại: +84 (0) 123 456 789</li>
                            <li>Địa chỉ: Hà Nội, Việt Nam</li>
                        </ul>
                    </div>
                </div>
                <div className={`border-t pt-8 text-center text-sm transition-all duration-300 ${theme === "dark" ? "border-slate-700 text-slate-400" : "border-slate-300 text-slate-600"}`}>
                    <p>&copy; 2024 Công Nghiệp Hóa Việt Nam. Tất cả các quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    );
}
