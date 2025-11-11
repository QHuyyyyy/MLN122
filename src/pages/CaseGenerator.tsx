import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Log API key status (for debugging)
console.log('Gemini API Key:', import.meta.env.VITE_GEMINI_API_KEY ? 'Đã tìm thấy' : 'Không tìm thấy');

// Sample data based on the content.md
type Concept = {
  id: string;
  name: string;
  description: string;
};

type Field = {
  id: string;
  name: string;
};

const concepts: Concept[] = [
  {
    id: 'concept-1',
    name: 'Công nghiệp hóa gắn liền với phát triển kinh tế tri thức',
    description: 'Ứng dụng các thành tựu khoa học công nghệ mới vào sản xuất và đời sống',
  },
  {
    id: 'concept-2',
    name: 'Công nghiệp hóa trong bối cảnh toàn cầu hóa',
    description: 'Tận dụng cơ hội từ hội nhập quốc tế để phát triển công nghiệp',
  },
  {
    id: 'concept-3',
    name: 'Công nghiệp hóa gắn với phát triển bền vững',
    description: 'Phát triển công nghiệp đi đôi với bảo vệ môi trường và phát triển xã hội',
  },
];

const fields: Field[] = [
  { id: 'field-1', name: 'Y tế' },
  { id: 'field-2', name: 'Giáo dục' },
  { id: 'field-3', name: 'Nông nghiệp' },
  { id: 'field-4', name: 'Công nghệ thông tin' },
  { id: 'field-5', name: 'Giao thông vận tải' },
  { id: 'field-6', name: 'Xây dựng' },
];

// Hàm gọi API Gemini để tạo ví dụ
async function generateExample(concept: Concept, field: Field): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Không tìm thấy Gemini API key. Vui lòng kiểm tra cấu hình.');
  }

  const prompt = `Hãy tạo một ví dụ thực tế ngắn gọn (khoảng 2-3 câu) về "${concept.name}" trong lĩnh vực "${field.name}". 
  Ví dụ nên cụ thể, dễ hiểu và phản ánh rõ nét mối liên hệ giữa lý thuyết và thực tiễn.
  Yêu cầu: Viết bằng tiếng Việt, ngắn gọn, súc tích.`;

  try {
    const response = await fetch(`/api/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 150,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Lỗi từ API:', errorData);
      throw new Error(`Lỗi từ API: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 
           'Không thể tạo ví dụ lúc này. Vui lòng thử lại.';
  } catch (error) {
    console.error('Lỗi khi gọi API Gemini:', error);
    throw new Error('Có lỗi xảy ra khi kết nối đến dịch vụ AI. Vui lòng thử lại sau.');
  }
}

export default function CaseGenerator() {
  const [selectedConcept, setSelectedConcept] = useState<string>('');
  const [selectedField, setSelectedField] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedConcept || !selectedField) {
      setError('Vui lòng chọn đầy đủ khái niệm và lĩnh vực');
      return;
    }
    
    const concept = concepts.find(c => c.id === selectedConcept);
    const field = fields.find(f => f.id === selectedField);
    
    if (!concept || !field) {
      setError('Không tìm thấy thông tin đã chọn');
      return;
    }
    
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setError('Lỗi cấu hình: Không tìm thấy Gemini API key. Vui lòng kiểm tra lại file .env');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setShowResult(false);
    
    try {
      const example = await generateExample(concept, field);
      setResult(example);
      setShowResult(true);
      toast.success('Đã tạo ví dụ thành công!');
    } catch (err) {
      console.error('Lỗi khi tạo ví dụ:', err);
      const errorMessage = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định';
      setError(`Lỗi: ${errorMessage}`);
      toast.error('Không thể tạo ví dụ');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setSelectedConcept('');
    setSelectedField('');
    setShowResult(false);
    setResult('');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Bộ tạo ví dụ thực tiễn</h1>
        <p className="text-muted-foreground text-center mb-8">
          Chọn một khái niệm và lĩnh vực để tạo ví dụ minh họa thực tế về Công nghiệp hóa, Hiện đại hóa
        </p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Tạo ví dụ minh họa</CardTitle>
            <CardDescription>
              Chọn khái niệm và lĩnh vực để tạo ví dụ thực tế
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Chọn khái niệm
              </label>
              <Select value={selectedConcept} onValueChange={setSelectedConcept}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn khái niệm" />
                </SelectTrigger>
                <SelectContent>
                  {concepts.map((concept) => (
                    <SelectItem key={concept.id} value={concept.id}>
                      {concept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedConcept && (
                <p className="text-sm text-muted-foreground">
                  {concepts.find(c => c.id === selectedConcept)?.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Chọn lĩnh vực
              </label>
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn lĩnh vực" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleGenerate} 
                disabled={!selectedConcept || !selectedField || isGenerating}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    AI đang tạo ví dụ...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Tạo ví dụ với AI
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={resetForm}
                disabled={isGenerating}
              >
                Đặt lại
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {showResult && (
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">
                Ví dụ minh họa
              </CardTitle>
              <CardDescription>
                {concepts.find(c => c.id === selectedConcept)?.name} trong lĩnh vực {fields.find(f => f.id === selectedField)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-line">{result}</p>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>💡 Mẹo: Bạn có thể thử kết hợp các khái niệm và lĩnh vực khác nhau để khám phá thêm nhiều ví dụ thú vị!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
