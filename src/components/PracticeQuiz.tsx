import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuestionWithType } from '../hooks/useGeminiPractice';
import { useGeminiPractice } from '../hooks/useGeminiPractice';
import { useTheme } from '../contexts/ThemeContext';
import { AlertCircle, CheckCircle, XCircle, Zap, Clock, SkipForward } from 'lucide-react';
import questionsData from '../data/question.json';

interface QuestionProgress {
    selectedAnswer: string | null;
    isAnswered: boolean;
    isCorrect: boolean | null;
}

interface QuizResult {
    score: number;
    totalQuestions: number;
    percentage: number;
    timestamp: number;
}

const TOTAL_QUIZ_TIME = 600; // 10 minutes in seconds

export default function PracticeQuiz({ onImportQuestion }: { onImportQuestion?: (questions: QuestionWithType[]) => void }) {
    const { theme } = useTheme();
    const { loading, error, questions, generateQuestions } = useGeminiPractice();

    // Load reference questions from question.json with type information
    const referenceQuestions: QuestionWithType[] = (questionsData as any[]).map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        answer: q.answer,
        type: q.type || 'concept',
        explanation: q.explanation
    }));

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
    const [progress, setProgress] = useState<QuestionProgress>({
        selectedAnswer: null,
        isAnswered: false,
        isCorrect: null
    });
    const [score, setScore] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [selectedQuestionsForImport, setSelectedQuestionsForImport] = useState<Set<number>>(new Set());

    // Timer effect for total quiz time
    useEffect(() => {
        if (!quizStarted || quizCompleted) return;

        const timer = setInterval(() => {
            setTotalTimeElapsed(prev => {
                const newTime = prev + 1;
                if (newTime >= TOTAL_QUIZ_TIME) {
                    setQuizCompleted(true);
                    return prev;
                }
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizStarted, quizCompleted]);

    const handleSelectAnswer = (option: string) => {
        if (progress.isAnswered) return;

        const optionKey = option.split('.')[0].trim();
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = optionKey === currentQuestion.answer;

        setProgress({
            ...progress,
            selectedAnswer: optionKey,
            isAnswered: true,
            isCorrect: isCorrect
        });

        if (isCorrect) {
            setScore(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setProgress({
                selectedAnswer: null,
                isAnswered: false,
                isCorrect: null
            });
        } else {
            // Save result to sessionStorage before completing
            const finalResult: QuizResult = {
                score: score,
                totalQuestions: questions.length,
                percentage: Math.round((score / questions.length) * 100),
                timestamp: Date.now()
            };
            sessionStorage.setItem('quizResult', JSON.stringify(finalResult));
            setQuizCompleted(true);
        }
    };

    const handleSkip = () => {
        setProgress(prev => ({
            ...prev,
            isAnswered: true,
            isCorrect: false
        }));
    };

    const handleStartQuiz = async () => {
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setScore(0);
        setQuizCompleted(false);
        setTotalTimeElapsed(0);
        setProgress({
            selectedAnswer: null,
            isAnswered: false,
            isCorrect: null
        });

        // Generate practice questions from Gemini
        await generateQuestions(referenceQuestions);
    };

    const handleResetQuiz = () => {
        setQuizStarted(false);
        setQuizCompleted(false);
        setCurrentQuestionIndex(0);
        setScore(0);
        setTotalTimeElapsed(0);
        setProgress({
            selectedAnswer: null,
            isAnswered: false,
            isCorrect: null
        });
        // Clear saved result
        sessionStorage.removeItem('quizResult');
    };

    // CSS classes based on theme
    const bgGradient = theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-white via-blue-50 to-white';

    const cardBg = theme === 'dark'
        ? 'bg-slate-800/60 border-slate-700/50'
        : 'bg-white/80 border-blue-200/30';

    const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
    const textMuted = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';

    // Not started state
    if (!quizStarted) {
        return (
            <div className={`w-full min-h-screen ${bgGradient} flex items-center justify-center p-4`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`${cardBg} backdrop-blur-xl border rounded-2xl p-8 max-w-md w-full shadow-2xl`}
                >
                    <motion.div
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-6xl mb-6 text-center"
                    >
                        🎯
                    </motion.div>

                    <h1 className={`text-4xl font-bold mb-4 text-center ${textColor}`}>
                        Practice Mode
                    </h1>

                    <p className={`${textMuted} text-center mb-6 leading-relaxed`}>
                        Luyện tập với 10 câu hỏi được AI sinh ra tương tự như những câu hỏi mẫu. Tổng thời gian là 10 phút.
                    </p>

                    <div className={`space-y-3 mb-8 p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-700/30' : 'bg-blue-50/50'}`}>
                        <div className="flex items-center gap-3">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            <span className={textMuted}>10 câu hỏi đa dạng</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-blue-400" />
                            <span className={textMuted}>10 phút cho toàn bộ quiz</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className={textMuted}>Feedback tức thời</span>
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-red-900/30 text-red-300' : 'bg-red-100/50 text-red-700'}`}
                        >
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm">{error}</p>
                        </motion.div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStartQuiz}
                        disabled={loading}
                        className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 rounded-lg font-bold text-white transition-all shadow-lg"
                    >
                        {loading ? 'Đang tạo câu hỏi...' : 'Bắt đầu Practice'}
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className={`w-full min-h-screen ${bgGradient} flex items-center justify-center p-4`}>
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`${cardBg} backdrop-blur-xl border rounded-2xl p-8 max-w-md w-full shadow-2xl text-center`}
                >
                    <div className="text-6xl mb-4 animate-spin inline-block">⚡</div>
                    <p className={`${textColor} font-semibold`}>Đang tạo câu hỏi từ AI...</p>
                </motion.div>
            </div>
        );
    }

    // Quiz completed state
    if (quizCompleted) {
        const percentage = Math.round((score / questions.length) * 100);
        let resultMessage = '';
        let resultColor = '';

        if (percentage === 100) {
            resultMessage = 'Tuyệt vời! Bạn là chuyên gia! 🎓';
            resultColor = 'text-green-500';
        } else if (percentage >= 80) {
            resultMessage = 'Rất tốt! Bạn đã nắm vững kiến thức! 👏';
            resultColor = 'text-blue-500';
        } else if (percentage >= 60) {
            resultMessage = 'Tốt! Tiếp tục luyện tập để cải thiện! 💪';
            resultColor = 'text-yellow-500';
        } else {
            resultMessage = 'Bạn cần ôn luyện thêm. Cố gắng lên! 📚';
            resultColor = 'text-orange-500';
        }

        const handleToggleQuestion = (idx: number) => {
            setSelectedQuestionsForImport(prev => {
                const newSet = new Set(prev);
                if (newSet.has(idx)) {
                    newSet.delete(idx);
                } else {
                    newSet.add(idx);
                }
                return newSet;
            });
        };

        const handleImportSelected = () => {
            if (selectedQuestionsForImport.size === 0) return;
            const selectedQuestions = Array.from(selectedQuestionsForImport).map(idx => questions[idx]);
            onImportQuestion?.(selectedQuestions);
        };

        return (
            <div className={`w-full min-h-screen ${bgGradient} flex items-center justify-center p-4`}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`${cardBg} backdrop-blur-xl border rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto relative z-50`}
                >
                    <div className="text-center mb-8">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6 }}
                            className="text-7xl mb-6"
                        >
                            {percentage === 100 ? '🏆' : percentage >= 80 ? '🎉' : percentage >= 60 ? '✨' : '📖'}
                        </motion.div>

                        <h2 className={`text-3xl font-bold mb-4 ${textColor}`}>
                            Kết quả của bạn
                        </h2>

                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-cyan-500">
                                {score}/{questions.length}
                            </div>
                            <div className={`text-4xl font-bold`} style={{ color: percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444' }}>
                                {percentage}%
                            </div>
                        </div>

                        <p className={`${resultColor} font-bold text-lg mb-8`}>
                            {resultMessage}
                        </p>
                    </div>

                    {/* Question Selection for Import */}
                    {onImportQuestion && questions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mb-8 p-6 rounded-lg border ${theme === 'dark'
                                ? 'bg-slate-700/30 border-slate-600/50'
                                : 'bg-blue-50/50 border-blue-200/50'
                                }`}
                        >
                            <h3 className={`text-lg font-bold mb-4 ${textColor}`}>
                                📤 Chọn câu hỏi để import vào Chat
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                                {questions.map((q, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleToggleQuestion(idx)}
                                        className={`p-3 text-left rounded-lg border-2 transition-all ${selectedQuestionsForImport.has(idx)
                                            ? theme === 'dark'
                                                ? 'bg-blue-500/20 border-blue-500/50'
                                                : 'bg-blue-100/50 border-blue-500/50'
                                            : theme === 'dark'
                                                ? 'bg-slate-700/20 border-slate-600/30 hover:border-slate-500/50'
                                                : 'bg-gray-100/30 border-gray-300/30 hover:border-gray-400/50'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${selectedQuestionsForImport.has(idx)
                                                ? 'bg-blue-500 border-blue-500 text-white'
                                                : 'border-gray-400'
                                                }`}>
                                                {selectedQuestionsForImport.has(idx) && '✓'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm line-clamp-2 ${textColor}`}>
                                                    {q.question}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {selectedQuestionsForImport.size > 0 && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleImportSelected}
                                    className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-lg font-semibold text-white transition-all"
                                >
                                    Import {selectedQuestionsForImport.size} câu vào Chat
                                </motion.button>
                            )}
                        </motion.div>
                    )}

                    <div className="space-y-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleResetQuiz}
                            className="w-full py-3 px-6 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-bold text-white transition-all shadow-lg"
                        >
                            Làm lại Practice
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Quiz in progress state
    if (questions.length === 0) {
        return (
            <div className={`w-full min-h-screen ${bgGradient} flex items-center justify-center p-4`}>
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`${cardBg} backdrop-blur-xl border rounded-2xl p-8 max-w-md w-full shadow-2xl text-center`}
                >
                    <div className="text-6xl mb-4 animate-spin inline-block">⚡</div>
                    <p className={`${textColor} font-semibold`}>Đang tạo câu hỏi...</p>
                </motion.div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const timeRemaining = Math.max(0, TOTAL_QUIZ_TIME - totalTimeElapsed);
    const timePercentage = (totalTimeElapsed / TOTAL_QUIZ_TIME) * 100;
    const isTimeWarning = timeRemaining <= 60;

    return (
        <div className={`w-full min-h-screen ${bgGradient} flex items-center justify-center p-4`}>
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex justify-between items-center mb-3">
                        <span className={`font-semibold ${textColor}`}>
                            Câu {currentQuestionIndex + 1}/{questions.length}
                        </span>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${isTimeWarning
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-blue-500/20 text-blue-400'
                            }`}>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                            </span>
                        </span>
                    </div>

                    {/* Progress bars */}
                    {/* Total time progress bar */}
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{
                        backgroundColor: theme === 'dark' ? 'rgba(71, 85, 105, 0.5)' : 'rgba(209, 213, 219, 0.5)'
                    }}>
                        <motion.div
                            className={`h-full rounded-full transition-all ${isTimeWarning ? 'bg-red-500' : 'bg-blue-500'
                                }`}
                            style={{ width: `${timePercentage}%` }}
                            layout
                        />
                    </div>

                    {/* Question progress indicators */}
                    <div className="flex gap-1.5 mt-3">
                        {questions.map((_, idx) => (
                            <motion.div
                                key={idx}
                                className={`h-1.5 rounded-full flex-1 transition-all ${idx < currentQuestionIndex
                                    ? 'bg-green-500'
                                    : idx === currentQuestionIndex
                                        ? 'bg-blue-500'
                                        : theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300'
                                    }`}
                                layout
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Question Card */}
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className={`${cardBg} backdrop-blur-xl border rounded-2xl p-8 shadow-2xl`}
                >
                    {/* Question */}
                    <div className="mb-8">
                        <h3 className={`text-2xl font-bold mb-4 ${textColor} leading-relaxed`}>
                            {currentQuestion.question}
                        </h3>
                    </div>

                    {/* Options */}
                    <div className="space-y-3 mb-8">
                        <AnimatePresence>
                            {currentQuestion.options.map((option, idx) => {
                                const optionKey = option.split('.')[0].trim();
                                const isSelected = progress.selectedAnswer === optionKey;
                                const isCorrectOption = optionKey === currentQuestion.answer;

                                let optionBg = theme === 'dark'
                                    ? 'bg-slate-700/40 hover:bg-slate-700/60 border-slate-600/50'
                                    : 'bg-blue-50/50 hover:bg-blue-100/50 border-blue-200/30';

                                if (progress.isAnswered) {
                                    if (isCorrectOption) {
                                        optionBg = 'bg-green-500/20 border-green-500/50';
                                    } else if (isSelected && !isCorrectOption) {
                                        optionBg = 'bg-red-500/20 border-red-500/50';
                                    }
                                }

                                return (
                                    <motion.button
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => handleSelectAnswer(option)}
                                        disabled={progress.isAnswered}
                                        className={`w-full p-4 text-left rounded-lg border-2 transition-all cursor-pointer group ${optionBg} ${progress.isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold flex-shrink-0 transition-all ${isSelected
                                                ? 'border-current'
                                                : theme === 'dark' ? 'border-slate-500' : 'border-gray-300'
                                                }`}>
                                                {progress.isAnswered && isCorrectOption && (
                                                    <span className="text-green-500 text-lg">✓</span>
                                                )}
                                                {progress.isAnswered && isSelected && !isCorrectOption && (
                                                    <span className="text-red-500 text-lg">✗</span>
                                                )}
                                            </div>
                                            <span className={`flex-1 font-medium ${textColor}`}>
                                                {option}
                                            </span>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Feedback */}
                    <AnimatePresence>
                        {progress.isAnswered && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-lg mb-6 flex gap-3 ${progress.isCorrect
                                    ? theme === 'dark' ? 'bg-green-900/30 border border-green-700/50 text-green-300' : 'bg-green-100/50 border border-green-300/50 text-green-700'
                                    : theme === 'dark' ? 'bg-red-900/30 border border-red-700/50 text-red-300' : 'bg-red-100/50 border border-red-300/50 text-red-700'
                                    }`}
                            >
                                {progress.isCorrect ? (
                                    <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                ) : (
                                    <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                )}
                                <div>
                                    <p className="font-semibold mb-1">
                                        {progress.isCorrect ? '✅ Đúng rồi!' : '❌ Sai mất rồi!'}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {!progress.isAnswered ? (
                            <>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleSkip}
                                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${theme === 'dark'
                                        ? 'bg-slate-700/60 hover:bg-slate-700 text-gray-300'
                                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                        }`}
                                >
                                    <SkipForward className="w-4 h-4" />
                                    Bỏ qua
                                </motion.button>
                            </>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleNextQuestion}
                                className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg font-bold text-white transition-all"
                            >
                                {currentQuestionIndex === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* Score */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 text-center text-lg font-bold ${textColor}`}
                >
                    Điểm: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">{score}/{currentQuestionIndex}</span>
                </motion.div>
            </div>
        </div>
    );
}
