# API 文档

本文档描述了求职信生成器应用程序中可用的 API 端点。

## 基础 URL

- **开发环境**: `http://localhost:3000`
- **生产环境**: `https://yourdomain.com`

## 身份验证

API 使用基于 JWT 的身份验证，采用 httpOnly cookies。在请求受保护的端点时需要包含会话 cookie。

## 端点说明

### 求职信生成

#### POST `/api/generate`

使用 AI 生成新的求职信。

**请求体:**

```json
{
  "jobDescription": "string (必需) - 职位描述",
  "userProfile": "string (必需) - 用户简介",
  "coverLetterType": "professional | creative | technical | executive (可选，默认: professional) - 求职信类型",
  "additionalInstructions": "string (可选) - 额外说明"
}
```

**响应:**

- **Content-Type**: `text/plain; charset=utf-8`
- **Transfer-Encoding**: `chunked` (流式响应)

**示例:**

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "科技初创公司的软件工程师职位...",
    "userProfile": "5年 React 和 Node.js 开发经验...",
    "coverLetterType": "professional"
  }'
```

### 用户管理

#### POST `/api/auth/register`

注册新用户账户。

**请求体:**

```json
{
  "email": "string (必需) - 电子邮箱",
  "name": "string (必需) - 用户姓名"
}
```

**响应:**

```json
{
  "user": {
    "id": "uuid - 用户ID",
    "email": "string - 电子邮箱",
    "name": "string - 用户姓名",
    "created_at": "timestamp - 创建时间"
  },
  "session": {
    "token": "string - 会话令牌",
    "expires_at": "timestamp - 过期时间"
  }
}
```

#### POST `/api/auth/login`

用户认证并创建会话。

**请求体:**

```json
{
  "email": "string (必需) - 电子邮箱"
}
```

**响应:**

```json
{
  "user": {
    "id": "uuid - 用户ID",
    "email": "string - 电子邮箱",
    "name": "string - 用户姓名"
  },
  "session": {
    "token": "string - 会话令牌",
    "expires_at": "timestamp - 过期时间"
  }
}
```

#### POST `/api/auth/logout`

结束用户会话。

**响应:**

```json
{
  "message": "注销成功"
}
```

### 求职信管理

#### GET `/api/cover-letters`

获取用户保存的求职信。

**查询参数:**

- `limit`: number (可选，默认: 10) - 返回条目数量
- `offset`: number (可选，默认: 0) - 偏移量

**响应:**

```json
{
  "coverLetters": [
    {
      "id": "uuid - 求职信ID",
      "title": "string - 标题",
      "content": "string - 内容",
      "cover_letter_type": "string - 求职信类型",
      "model_used": "string - 使用的模型",
      "tokens_used": "number - 使用的令牌数",
      "generation_time": "number - 生成时间(毫秒)",
      "created_at": "timestamp - 创建时间"
    }
  ],
  "total": "number - 总数"
}
```

#### GET `/api/cover-letters/[id]`

根据 ID 获取特定求职信。

**响应:**

```json
{
  "id": "uuid - 求职信ID",
  "title": "string - 标题",
  "content": "string - 内容",
  "job_description": "string - 职位描述",
  "user_profile": "string - 用户简介",
  "cover_letter_type": "string - 求职信类型",
  "model_used": "string - 使用的模型",
  "tokens_used": "number - 使用的令牌数",
  "generation_time": "number - 生成时间(毫秒)",
  "created_at": "timestamp - 创建时间",
  "updated_at": "timestamp - 更新时间"
}
```

#### POST `/api/cover-letters`

保存生成的求职信。

**请求体:**

```json
{
  "title": "string (必需) - 标题",
  "content": "string (必需) - 内容",
  "jobDescription": "string (必需) - 职位描述",
  "userProfile": "string (必需) - 用户简介",
  "coverLetterType": "professional | creative | technical | executive (必需) - 求职信类型",
  "modelUsed": "string (必需) - 使用的模型",
  "tokensUsed": "number (可选) - 使用的令牌数",
  "generationTime": "number (必需) - 生成时间(毫秒)"
}
```

#### DELETE `/api/cover-letters/[id]`

删除求职信。

**响应:**

```json
{
  "message": "求职信删除成功"
}
```

### PDF 导出

#### POST `/api/export/pdf`

将求职信导出为 PDF 格式。

**请求体:**

```json
{
  "content": "string (必需) - 求职信内容",
  "title": "string (可选) - PDF 文件标题"
}
```

**响应:**

- **Content-Type**: `application/pdf`
- **Content-Disposition**: `attachment; filename="cover-letter.pdf"`

### 健康检查

#### GET `/api/health`

检查 API 和数据库健康状态。

**响应:**

```json
{
  "status": "ok - 状态",
  "timestamp": "timestamp - 时间戳",
  "database": "connected - 数据库连接状态",
  "version": "string - 版本号"
}
```

## 错误响应

所有端点都按以下格式返回错误信息：

```json
{
  "error": "string - 错误类型",
  "message": "string - 错误消息",
  "statusCode": "number - HTTP 状态码"
}
```

### 常见错误代码

- `400` - 错误请求（无效输入）
- `401` - 未经授权（需要认证）
- `403` - 禁止访问（权限不足）
- `404` - 未找到（资源不存在）
- `429` - 请求过多（超过限率）
- `500` - 内部服务器错误

## 限率控制

- **求职信生成**: 每用户每分钟 10 次请求
- **用户认证**: 每 IP 每分钟 5 次请求
- **通用 API**: 每用户每分钟 100 次请求

## WebSocket 事件

### 求职信生成流

连接到 `/api/generate` 并启用流式传输以接收实时生成更新。

**事件类型:**

- `data` - 部分内容块
- `done` - 生成完成
- `error` - 生成失败

## SDK 使用示例

### JavaScript/TypeScript

```typescript
// 使用流式传输生成求职信
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    jobDescription: '您的职位描述...',
    userProfile: '您的个人简介...',
    coverLetterType: 'professional',
  }),
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  console.log(chunk); // 处理流式内容
}
```

### Python

```python
import requests

# 生成求职信
response = requests.post('http://localhost:3000/api/generate',
  json={
    'jobDescription': '您的职位描述...',
    'userProfile': '您的个人简介...',
    'coverLetterType': 'professional'
  },
  stream=True
)

for chunk in response.iter_content(chunk_size=1024):
  if chunk:
    print(chunk.decode('utf-8'))
```
