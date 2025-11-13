import { useState, useCallback } from 'react';
import axios from 'axios';

export interface MindmapNode {
    id: string;
    name: string;
    children: MindmapNode[];
}

export interface MindmapResponse {
    topic: string;
    nodes: MindmapNode[];
}

export const useDifyMindmap = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mindmapData, setMindmapData] = useState<MindmapResponse | null>(null);


    const apiKey = import.meta.env.VITE_DIFY_API_KEY;
    const apiUrl = import.meta.env.VITE_DIFY_API_URL;

    const generateMindmap = useCallback(async (prompt: string) => {
        // Validate API configuration
        if (!apiKey) {
            setError('VITE_DIFY_API_KEY không được cấu hình trong .env');
            return;
        }

        if (!apiUrl) {
            setError('VITE_DIFY_API_URL không được cấu hình trong .env');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(apiUrl, {
                inputs: {},
                query: prompt,
                response_mode: 'blocking',
                user: `user`
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            // Extract the mindmap JSON from Dify response
            // Response structure for Chat API: { event, answer, message_id, ... }
            const output = response.data?.answer || response.data?.data?.outputs?.text || '';

            if (!output) {
                throw new Error('Không nhận được phản hồi từ Dify');
            }

            // Parse JSON from the response
            const jsonMatch = output.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Không thể phân tích phản hồi từ Dify - JSON không hợp lệ. Hãy kiểm tra prompt của bạn.');
            }

            const parsedData = JSON.parse(jsonMatch[0]) as MindmapResponse;
            setMindmapData(parsedData);
            return parsedData;
        } catch (err) {
            let errorMessage = 'Có lỗi xảy ra khi kết nối với Dify';

            if (err instanceof axios.AxiosError) {
                if (err.response?.status === 401) {
                    errorMessage = 'API Key không hợp lệ';
                } else if (err.response?.status === 404) {
                    errorMessage = 'API URL không hợp lệ';
                } else if (err.response?.status === 400) {
                    errorMessage = 'Request không hợp lệ - kiểm tra format của prompt';
                } else {
                    errorMessage = `Lỗi từ Dify: ${err.response?.statusText || err.message}`;
                }
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiKey, apiUrl]);

    return {
        loading,
        error,
        mindmapData,
        generateMindmap,
        hasApiConfig: !!apiKey && !!apiUrl
    };
};
