import { useState, useCallback } from 'react';
import axios from 'axios';

export interface PracticeQuestion {
    id: number;
    question: string;
    options: string[];
    answer: string;
    type?: 'math' | 'formula';
}

export interface PracticeResponse {
    questions: PracticeQuestion[];
}

export interface QuestionWithType extends PracticeQuestion {
    type?: 'math' | 'formula';
}

/**
 * Hook for generating practice questions using Google Gemini API
 * Returns 10 similar questions based on question.json format
 */
export const useGeminiPractice = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [questions, setQuestions] = useState<PracticeQuestion[]>([]);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    const model = 'gemini-2.5-pro';

    const systemPrompt = `You are an expert in creating multiple-choice questions for the subject "Marxism-Leninism Political Economy" used in Vietnamese educational system.

Your task is to generate 10 practice questions. Each question has a "type" that determines how to generate variations:

QUESTION TYPES:
1. "math" type - Change numerical values and adjust context but KEEP the mathematical structure and formula the same. The problem type and operation must remain identical.
2. "formula" type - Keep the question and options EXACTLY the same. Do NOT modify these questions at all, just repeat them as-is.

CRITICAL REQUIREMENTS FOR JSON OUTPUT:
1. Generate exactly 10 questions total
2. All questions must be in Vietnamese
3. Each question must have exactly 4 multiple-choice options (A, B, C, D)
4. Return ONLY a JSON array, nothing else - no markdown, no code blocks, no explanations
5. JSON must be valid and properly formatted
6. For "math" type: Keep the mathematical formula/operation identical, only change numbers and context
7. For "formula" type: Return the exact same question with exact same options

JSON STRUCTURE (MUST BE EXACTLY LIKE THIS):
[
  {
    "id": 1,
    "question": "Write the full question in Vietnamese. Do not use line breaks inside strings.",
    "options": ["A. Option text here", "B. Option text here", "C. Option text here", "D. Option text here"],
    "answer": "A",
    "type": "math"
  }
]

IMPORTANT JSON RULES:
- Return ONLY the JSON array, no other text before or after
- Use double quotes for all strings
- Do not use newlines or special characters inside string values
- Each option MUST start with "A.", "B.", "C.", or "D."
- "answer" must be one of: "A", "B", "C", or "D"
- "type" must be one of: "math", "formula"
- All fields are required`;

    const generateQuestions = useCallback(async (referenceQuestions: QuestionWithType[]) => {
        if (!apiKey) {
            setError('VITE_GEMINI_API_KEY không được cấu hình trong .env');
            return;
        }

        setLoading(true);
        setError(null);
        setQuestions([]);

        try {
            // Create detailed reference text with type information
            const referenceText = referenceQuestions
                .map((q, idx) => {
                    const type = q.type || 'concept';
                    return `Question ${idx + 1} (Type: ${type}):\nQ: ${q.question}\nOptions: ${q.options.join(', ')}\nAnswer: ${q.answer}`;
                })
                .join('\n\n');

            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

            const prompt = `${systemPrompt}\n\nBased on these reference questions:\n\n${referenceText}\n\nGenerate 10 similar practice questions in Vietnamese. For math type questions, change the numbers but keep the formula. For formula type, keep them exactly the same. For concept type, create variations.`;

            const response = await axios.post(endpoint, {
                contents: [
                    { role: 'user', parts: [{ text: prompt }] }
                ],
                generationConfig: {
                    temperature: 1.0,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 10000,
                },
            });

            const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

            // Parse JSON from response
            const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
            if (!jsonMatch) {
                throw new Error('Invalid response format from AI. Could not find JSON array.');
            }

            let jsonStr = jsonMatch[0];

            // Clean up common JSON issues
            // Fix newlines inside strings
            jsonStr = jsonStr.replace(/[\r\n]+/g, ' ');

            // Try to parse
            let parsedQuestions: PracticeQuestion[];
            try {
                parsedQuestions = JSON.parse(jsonStr);
            } catch (parseErr) {
                // If it still fails, try to fix common issues
                // Remove escaped newlines that might be causing issues
                jsonStr = jsonStr.replace(/\\n/g, ' ');
                jsonStr = jsonStr.replace(/\\r/g, ' ');
                parsedQuestions = JSON.parse(jsonStr);
            }

            // Validate and fix questions if needed
            const validatedQuestions = parsedQuestions.map((q, idx) => ({
                ...q,
                id: idx + 1,
                answer: q.answer || 'A',
                type: q.type || 'math',
            }));

            setQuestions(validatedQuestions);
        } catch (err) {
            let errorMessage = 'Unknown error';

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.error?.message || err.message;
            } else if (err instanceof SyntaxError) {
                errorMessage = `JSON Parse Error: ${err.message}. The AI response may contain invalid JSON formatting.`;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(`Lỗi: ${errorMessage}`);
            console.error('Error generating questions:', err);
        } finally {
            setLoading(false);
        }
    }, [apiKey]);

    return { loading, error, questions, generateQuestions };
};
