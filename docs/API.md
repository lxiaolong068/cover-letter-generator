# API Documentation

This document describes the available API endpoints in the Cover Letter Generator application.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://yourdomain.com`

## Authentication

The API uses JWT-based authentication with httpOnly cookies. Session cookies must be included when requesting protected endpoints.

## Endpoint Documentation

### Cover Letter Generation

#### POST `/api/generate`

Generate a new cover letter using AI.

**Request Body:**

```json
{
  "jobDescription": "string (required) - Job description",
  "userProfile": "string (required) - User profile",
  "coverLetterType": "professional | creative | technical | executive (optional, default: professional) - Cover letter type",
  "additionalInstructions": "string (optional) - Additional instructions"
}
```

**Response:**

- **Content-Type**: `text/plain; charset=utf-8`
- **Transfer-Encoding**: `chunked` (streaming response)

**Example:**

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "Software engineer position at tech startup...",
    "userProfile": "5 years of React and Node.js development experience...",
    "coverLetterType": "professional"
  }'
```

### User Management

#### POST `/api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "string (required) - Email address",
  "name": "string (required) - User name"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid - User ID",
    "email": "string - Email address",
    "name": "string - User name",
    "created_at": "timestamp - Creation time"
  },
  "session": {
    "token": "string - Session token",
    "expires_at": "timestamp - Expiration time"
  }
}
```

#### POST `/api/auth/login`

Authenticate user and create session.

**Request Body:**

```json
{
  "email": "string (required) - Email address"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid - User ID",
    "email": "string - Email address",
    "name": "string - User name"
  },
  "session": {
    "token": "string - Session token",
    "expires_at": "timestamp - Expiration time"
  }
}
```

#### POST `/api/auth/logout`

End user session.

**Response:**

```json
{
  "message": "Logout successful"
}
```

### Cover Letter Management

#### GET `/api/cover-letters`

Get user's saved cover letters.

**Query Parameters:**

- `limit`: number (optional, default: 10) - Number of items to return
- `offset`: number (optional, default: 0) - Offset for pagination

**Response:**

```json
{
  "coverLetters": [
    {
      "id": "uuid - Cover letter ID",
      "title": "string - Title",
      "content": "string - Content",
      "cover_letter_type": "string - Cover letter type",
      "model_used": "string - Model used",
      "tokens_used": "number - Tokens used",
      "generation_time": "number - Generation time (ms)",
      "created_at": "timestamp - Creation time"
    }
  ],
  "total": "number - Total count"
}
```

#### GET `/api/cover-letters/[id]`

Get specific cover letter by ID.

**Response:**

```json
{
  "id": "uuid - Cover letter ID",
  "title": "string - Title",
  "content": "string - Content",
  "job_description": "string - Job description",
  "user_profile": "string - User profile",
  "cover_letter_type": "string - Cover letter type",
  "model_used": "string - Model used",
  "tokens_used": "number - Tokens used",
  "generation_time": "number - Generation time (ms)",
  "created_at": "timestamp - Creation time",
  "updated_at": "timestamp - Update time"
}
```

#### POST `/api/cover-letters`

Save generated cover letter.

**Request Body:**

```json
{
  "title": "string (required) - Title",
  "content": "string (required) - Content",
  "jobDescription": "string (required) - Job description",
  "userProfile": "string (required) - User profile",
  "coverLetterType": "professional | creative | technical | executive (required) - Cover letter type",
  "modelUsed": "string (required) - Model used",
  "tokensUsed": "number (optional) - Tokens used",
  "generationTime": "number (required) - Generation time (ms)"
}
```

#### DELETE `/api/cover-letters/[id]`

Delete cover letter.

**Response:**

```json
{
  "message": "Cover letter deleted successfully"
}
```

### PDF Export

#### POST `/api/export/pdf`

Export cover letter to PDF format.

**Request Body:**

```json
{
  "content": "string (required) - Cover letter content",
  "title": "string (optional) - PDF file title"
}
```

**Response:**

- **Content-Type**: `application/pdf`
- **Content-Disposition**: `attachment; filename="cover-letter.pdf"`

### Health Check

#### GET `/api/health`

Check API and database health status.

**Response:**

```json
{
  "status": "ok - Status",
  "timestamp": "timestamp - Timestamp",
  "database": "connected - Database connection status",
  "version": "string - Version number"
}
```

## Error Responses

All endpoints return error information in the following format:

```json
{
  "error": "string - Error type",
  "message": "string - Error message",
  "statusCode": "number - HTTP status code"
}
```

### Common Error Codes

- `400` - Bad Request (invalid input)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

- **Cover Letter Generation**: 10 requests per user per minute
- **User Authentication**: 5 requests per IP per minute
- **General API**: 100 requests per user per minute

## WebSocket Events

### Cover Letter Generation Stream

Connect to `/api/generate` with streaming enabled to receive real-time generation updates.

**Event Types:**

- `data` - Partial content chunk
- `done` - Generation complete
- `error` - Generation failed

## SDK Usage Examples

### JavaScript/TypeScript

```typescript
// Generate cover letter with streaming
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    jobDescription: 'Your job description...',
    userProfile: 'Your personal profile...',
    coverLetterType: 'professional',
  }),
});

const reader = response.body?.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  console.log(chunk); // Process streaming content
}
```

### Python

```python
import requests

# Generate cover letter
response = requests.post('http://localhost:3000/api/generate',
  json={
    'jobDescription': 'Your job description...',
    'userProfile': 'Your personal profile...',
    'coverLetterType': 'professional'
  },
  stream=True
)

for chunk in response.iter_content(chunk_size=1024):
  if chunk:
    print(chunk.decode('utf-8'))
```
