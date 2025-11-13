# Dify.ai API Setup - Step by Step Guide

## 📋 Prerequisites
- Dify.ai account (https://dify.ai)
- API key access
- Knowledge base hoặc documents về Marxism-Leninism Political Economy

## 🔧 Step 1: Create Dify Workflow

### 1.1 Access Dify Dashboard
1. Đăng nhập vào https://dify.ai
2. Chọn workspace của bạn
3. Click "**Workflows**" trên menu bên trái

### 1.2 Create New Workflow
1. Click "**Create Workflow**" button
2. Chọn template: **"Start from scratch"** hoặc **"Blank"**
3. Đặt tên: "**Marxism Political Economy MindMap**"

### 1.3 Setup Workflow Components

Workflow cần có:

#### Input Variable
```
Name: prompt
Type: Text
```

#### LLM Node (Main Processing)
1. Kéo "LLM" node vào canvas
2. Connect input variable đến LLM node
3. Copy prompt template vào LLM:

```
You are an "Marxism-Leninism Political Economy" AI assistant that generates structured mindmaps based on a given topic or text input.

Your task:
- Analyze the user's query related to economics or politics.
- Use only information from the provided knowledge base to generate your response.

If the requested content is not covered in the knowledge base, respond with:
"Xin lỗi, tôi không có thông tin về chủ đề này trong cơ sở dữ liệu hiện có."

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
- Keep IDs unique and lowercase (you can use short words or numbers).

User Query: {{prompt}}
```

#### Output
1. Kéo "Output" node vào canvas
2. Connect LLM output → Output node
3. Đặt tên output variable: **text**

### 1.4 Setup Knowledge Base (Optional but Recommended)

Để tối ưu kết quả, bạn có thể thêm Knowledge Base:

1. **Tạo Knowledge Base**
   - Click "**Knowledge Base**" tab
   - Click "**Create Knowledge Base**"
   - Đặt tên: "**Marxism Leninism Economics**"
   - Upload files hoặc paste content

2. **Add Knowledge Base to Workflow**
   - Thêm "**Knowledge Retrieval**" node
   - Configure retrieval settings
   - Connect với LLM node

## 🔑 Step 2: Get API Key

### 2.1 Generate API Key
1. Click profile icon (góc trên bên phải)
2. Chọn "**Settings**"
3. Click "**API Keys**" tab
4. Click "**Create API Key**"
5. Copy API key (lưu ở nơi an toàn!)

### 2.2 Get Workflow ID & API URL

Khi workflow được tạo:

**API URL Format:**
```
https://api.dify.ai/v1/workflows/{WORKFLOW_ID}/run
```

Tìm `WORKFLOW_ID`:
1. Mở workflow
2. Click "Publish" button
3. Copy URL workflow
4. Extract ID từ URL hoặc từ workflow settings

**Example:**
```
https://api.dify.ai/v1/workflows/a1b2c3d4-e5f6-7890-abcd-ef1234567890/run
```

## 💾 Step 3: Configure in Application

### 3.1 Open MindMap Tab
1. Chạy ứng dụng: `npm run dev`
2. Truy cập http://localhost:5173
3. Click "**MindMap**" trên navigation bar

### 3.2 Setup API Settings
1. Click "**⚙️ Cài đặt API**"
2. Nhập:
   - **Dify API Key**: `{YOUR_API_KEY}`
   - **Dify API URL**: `https://api.dify.ai/v1/workflows/{YOUR_WORKFLOW_ID}/run`

### 3.3 Test
1. Nhập prompt: "Chế độ sản xuất tư bản"
2. Click "**Tạo MindMap**"
3. Xem kết quả

## 🧪 Testing Examples

### Example 1: Basic Topic
```
Input: "Chủ nghĩa Mác"
Expected Output: Root node "Chủ nghĩa Mác" with branches:
- Lý thuyết cơ sở
- Nhân vật chính
- Ứng dụng thực tiễn
```

### Example 2: Complex Query
```
Input: "So sánh chế độ sản xuất phong kiến và tư bản chủ nghĩa"
Expected Output: Root node "So sánh" with:
- Chế độ sản xuất phong kiến
- Chế độ sản xuất tư bản chủ nghĩa
- Điểm tương đồng
- Điểm khác biệt
```

### Example 3: Historical Topic
```
Input: "Những cách mạng xã hội chủ nghĩa thế giới"
Expected Output: Root "Các cuộc Cách mạng XHCN" with:
- Nga (1917)
- Trung Quốc
- Việt Nam
- Cuba
- v.v.
```

## ⚠️ Troubleshooting

### Issue: "Invalid JSON response"
**Solution:**
- Kiểm tra LLM model có hỗ trợ JSON không
- Thêm explicit instruction: "**JSON ONLY, NO MARKDOWN**"
- Test với prompt đơn giản hơn

### Issue: "API Authentication Failed"
**Solution:**
- Kiểm tra API Key hết hạn chưa
- Kiểm tra Workflow ID chính xác
- Kiểm tra workflow đã publish chưa
- Kiểm tra CORS settings (nếu cần)

### Issue: "Empty Response"
**Solution:**
- Kiểm tra Knowledge Base có content không
- Test workflow directly trong Dify dashboard
- Kiểm tra prompt formatting

### Issue: "Timeout"
**Solution:**
- Knowledge Base quá lớn → giảm document size
- LLM model quá chậm → chọn model nhanh hơn
- Increase timeout trong app settings

## 🔐 Security Best Practices

### For Production:
1. **Store API keys securely**
   - Đừng hardcode API keys
   - Dùng environment variables
   - Dùng backend proxy

2. **Example (Backend Proxy):**
   ```typescript
   // Server endpoint
   app.post('/api/mindmap', (req, res) => {
     const { prompt } = req.body;
     const apiKey = process.env.DIFY_API_KEY;
     
     // Call Dify from server
     const response = await axios.post(difyUrl, {
       inputs: { prompt },
       response_mode: 'blocking'
     }, {
       headers: { 'Authorization': `Bearer ${apiKey}` }
     });
     
     res.json(response.data);
   });
   ```

3. **Rate Limiting**
   - Giới hạn requests/user
   - Implement queue system
   - Cache common queries

## 📞 Support

- Dify Documentation: https://docs.dify.ai
- API Reference: https://docs.dify.ai/api
- Discord Community: https://discord.gg/dify

---

**Good luck with your MindMap implementation!** 🚀
