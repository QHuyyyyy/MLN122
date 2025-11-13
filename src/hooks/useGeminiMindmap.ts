import { useState, useCallback } from 'react';

export interface MindmapNode {
    id: string;
    name: string;
    children: MindmapNode[];
}

export interface MindmapResponse {
    topic: string;
    nodes: MindmapNode[];
}

/**
 * Direct Google Gemini integration for generating Marxism-Leninism Political Economy mindmaps.
 * Requires VITE_GEMINI_API_KEY in your environment (e.g., .env.local).
 * Note: Calling Gemini from the browser exposes the API key; prefer a backend proxy for production.
 */
export const useGeminiMindmap = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mindmapData, setMindmapData] = useState<MindmapResponse | null>(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    const model = 'gemini-2.5-pro'; // fast and cost-effective; switch to gemini-1.5-pro if needed

    const systemPrompt = `You are an  "Marxism-Leninism Political Economy" AI assistant that generates structured mindmaps 
- Use information from Political Economy 
If the requested content is not related to the Political Economy, respond with:  
  "Xin lỗi, tôi không thể trả lời các câu hỏi ngoài phạm vi Kinh tế Chính trị Mác-Lênin."
### Goal
Generate a clear, hierarchical mindmap that represents the main topic, its subtopics, and their relationships.
### Output Format
Always respond in **valid JSON format** (UTF-8 encoded).  
Follow this structure strictly:

{
  "topic": "<main topic>",
  "nodes": [
    {
      "id": "root",
      "name": "<main topic>",
      "children": [
        {
          "id": "<unique_id_1>",
          "name": "<subtopic_1>",
          "children": [
            {
              "id": "<unique_id_1_1>",
              "name": "<sub-subtopic>",
              "children": []
            }
          ]
        },
        {
          "id": "<unique_id_2>",
          "name": "<subtopic_2>",
          "children": []
        }
      ]
    }
  ]
}

### Guidelines
- Use **concise and meaningful** node names (1–5 words).
- Limit depth to **3–4 levels** unless user requests deeper detail.
- Avoid markdown, explanations, or natural language — **JSON only**.
- The first node must represent the main topic.
- If user provides long text, extract key ideas and structure them hierarchically.
- Include at least 3–5 main branches if possible.
- Keep IDs unique and lowercase (you can use short words or numbers).`;

    const generateMindmap = useCallback(async (userTopicOrText: string) => {
        if (!apiKey) {
            setError('VITE_GEMINI_API_KEY không được cấu hình trong .env');
            return;
        }

        setLoading(true);
        setError(null);
        // Clear previous mindmap immediately to avoid showing stale data while generating
        setMindmapData(null);

        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

            const prompt = `${systemPrompt}\n\n### Main Topic or Input\n${userTopicOrText}`;

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
                        topK: 40,
                        maxOutputTokens: 4000,
                        response_mime_type: 'application/json'
                    }
                })
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Gemini API error ${res.status}: ${text}`);
            }

            const data = await res.json();
            const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text
                ?? data?.candidates?.[0]?.content?.parts?.[0]?.stringValue; // fallback just in case

            if (!text) {
                throw new Error('Không nhận được phản hồi từ Gemini');
            }

            // If model responds with an apology message, show notice under chat and do not render mindmap
            const apologyPhrases = [
                'Xin lỗi, tôi không có thông tin về chủ đề này trong cơ sở dữ liệu hiện có',
                'Xin lỗi, tôi không thể trả lời các câu hỏi ngoài phạm vi Kinh tế Chính trị Mác-Lênin'
            ];
            if (apologyPhrases.some(p => text.trim().includes(p))) {
                setMindmapData(null);
                setError('Xin lỗi, tôi không thể trả lời các câu hỏi ngoài phạm vi Kinh tế Chính trị Mác-Lênin.');
                return null;
            }

            // Try strict JSON parse first; fall back to extracting the first JSON block
            let parsed: MindmapResponse | null = null;
            try {
                parsed = JSON.parse(text);
            } catch {
                const match = text.match(/\{[\s\S]*\}/);
                if (match) {
                    parsed = JSON.parse(match[0]);
                }
            }

            if (!parsed) {
                throw new Error('Không thể phân tích phản hồi từ Gemini - JSON không hợp lệ. Hãy kiểm tra prompt của bạn.');
            }

            setMindmapData(parsed);
            return parsed;
        } catch (err) {
            let message = 'Có lỗi xảy ra khi kết nối với Gemini';
            if (err instanceof Error) message = err.message;
            setError(message);
            // Ensure stale mindmap is not displayed when any error occurs
            setMindmapData(null);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiKey]);

    const clearMindmap = useCallback(() => {
        setMindmapData(null);
        setError(null);
    }, []);

    return {
        loading,
        error,
        mindmapData,
        generateMindmap,
        clearMindmap,
        hasApiConfig: !!apiKey
    };
};
