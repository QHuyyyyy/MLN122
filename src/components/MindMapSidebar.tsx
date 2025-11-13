import { useTheme } from '../contexts/ThemeContext';

interface MindMapSidebarProps {
    children: React.ReactNode;
}

export default function MindMapSidebar({ children }: MindMapSidebarProps) {
    const { theme } = useTheme();

    const sidebarBgClass = theme === 'dark'
        ? 'bg-slate-800/70 border-slate-700 shadow-lg'
        : 'bg-white/90 border-gray-200 shadow-md';

    const scrollbarClass = theme === 'dark'
        ? 'scrollbar-thumb-slate-600 scrollbar-track-slate-800'
        : 'scrollbar-thumb-gray-300 scrollbar-track-gray-100';

    return (
        <div className={`w-full md:w-96 lg:w-[420px] flex flex-col gap-4 ${sidebarBgClass} rounded-r-xl p-6 border backdrop-blur-sm overflow-y-auto transition-all duration-300 ${scrollbarClass} scrollbar-thin`}>
            <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          border-radius: 3px;
          background-color: ${theme === 'dark' ? 'rgba(71, 85, 105, 0.5)' : 'rgba(200, 200, 200, 0.5)'};
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background-color: ${theme === 'dark' ? 'rgba(100, 116, 139, 0.8)' : 'rgba(150, 150, 150, 0.8)'};
        }
      `}</style>
            {children}
        </div>
    );
}
