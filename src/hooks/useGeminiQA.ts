import { useState, useCallback } from 'react';

/**
 * Simple Gemini Q&A hook for answering questions about Marxism-Leninism Political Economy.
 * Returns plain text answers. Exposes ask(), clearAnswer(), loading, error, answer.
 */
export const useGeminiQA = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [answer, setAnswer] = useState<string | null>(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    const model = 'gemini-2.5-pro';

    const systemPrompt = `You are an "Marxism-Leninism Political Economy" AI assistant. Answer questions using authoritative information from Marxist-Leninist political economy. If the requested content is not covered in the Political Economy, respond exactly with:\n\n"Xin lỗi, tôi không có thông tin về chủ đề này trong cơ sở dữ liệu hiện có."`;

    const ask = useCallback(async (question: string) => {
        if (!apiKey) {
            setError('VITE_GEMINI_API_KEY không được cấu hình trong .env');
            return null;
        }

        setLoading(true);
        setError(null);
        setAnswer(null);

        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

            const prompt = `${systemPrompt}\n\nUser: ${question}`;

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        { role: 'user', parts: [{ text: prompt }] }
                    ],
                    generationConfig: {
                        temperature: 0.2,
                        topP: 0.95,
                        maxOutputTokens: 10000
                    }
                })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Gemini API error ${res.status}: ${text}`);
            }

            const data = await res.json();
            const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                throw new Error('Không nhận được phản hồi từ Gemini');
            }

            const apology = 'Xin lỗi, tôi không có thông tin về chủ đề này trong cơ sở dữ liệu hiện có';
            if (text.trim().includes(apology)) {
                setAnswer(null);
                setError(apology);
                return null;
            }

            setAnswer(text.trim());
            return text.trim();
        } catch (err) {
            let msg = 'Có lỗi xảy ra khi kết nối với Gemini';
            if (err instanceof Error) msg = err.message;
            setError(msg);
            setAnswer(null);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiKey]);

    const clearAnswer = useCallback(() => {
        setAnswer(null);
        setError(null);
    }, []);

    return { loading, error, answer, ask, clearAnswer, hasApiConfig: !!apiKey };
};
