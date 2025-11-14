
# 🧠 AIMate API Contract (V1)

This document outlines all backend endpoints for **AIMate**, covering **Authentication**, **Smart Chat Assistant**, and **Productivity Toolkits** (Summarizer, Task Generator, Note Taker, Email Drafter, and Text Rewriter).

---

## 📍 Base URL
```
https://aimate-wgqk.onrender.com/api
```

---

## 🛡️ AUTHENTICATION ENDPOINTS

### 1️⃣ Register User  
**POST** `/auth/register`  
**Description:** Creates a new user account.

#### Request Body
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "StrongPassword123!"
}
```

#### Response (201 Created)
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "abc123",
    "name": "John Doe",
    "email": "johndoe@email.com"
  }
}
```

**Error (400):**
```json
{ "message": "Email already exists" }
```

---

### 2️⃣ Login User  
**POST** `/auth/login`  
**Description:** Logs in user and sets `accessToken` and `refreshToken` in HTTP-only cookies.

#### Request Body
```json
{
  "email": "johndoe@example.com",
  "password": "StrongPassword123!",
  "rememberMe": true // (optional)
}
```

#### Response
```json
{
  "message": "Login successful",
  "user": {
    "id": "671fcda891d3c2f1",
    "name": "John Doe",
    "email": "johndoe@example.com"
  }
}
```

---

### 3️⃣ Refresh Access Token  
**POST** `/auth/refresh`  
**Description:** Refreshes expired access token using the refresh token from cookies.

#### Response
```json
{ "message": "Access token refreshed successfully" }
```

---

### 4️⃣ Logout User  
**POST** `/auth/logout`  
**Description:** Clears all authentication cookies and logs user out.

#### Response
```json
{ "message": "Logged out successfully" }
```
---

### 5️⃣ Check Logged-in User
**Endpoint:**  
**GET** `/auth/check`

#### Response
```json
{ 
  "user": {
    "id": "671fcda891d3c2f1",
    "name": "John Doe",
    "email": "johndoe@example.com"
  }
}
```

### 6️⃣ Get User Profile
**GET** `/users/profile`

### Response
```json
{ 
  "user": {
    "id": "671fcda891d3c2f1",
    "name": "John Doe",
    "email": "johndoe@example.com"
  }
}
```
---

## 💬 SMART CHAT ASSISTANT

### 1️⃣ Send Chat Message  
**POST** `/chat/session/:sessionId/message`  
**Description:** Sends a message to the AI-powered assistant and returns a generated response.

#### Request Body
```json
{
  "message": "Give me 3 ways to improve focus at work."
}
```

#### Response
```json
{
  "response": "Here are 3 effective ways to improve focus...",
  "success": true,
  "sessionId": "690a7e51e82e1d663890fd7e",
  "reply":"Here are 3 effective ways to improve focus...",
  "session": { ... }
}
```

---

### 2️⃣ Create Session  
**POST** `/chat/session`  
**Description:** Creates a new chat session.

#### Request Body: Empty

#### Response
```json

{
  "user": "76gy7fs787", 
  "title": "New Session", 
  "messages": [],
  "session": { ... }
  .
  .
  .
}
```

---
### 3️⃣ List Session History  
**GET** `/chat/sessions`  
**Description:** Fetches all previous chat sessions of a user.

#### Response
```json
[
  {
    "user": "76gy7fs787",
    "title": "New Session"
  }
]
```

### 4️⃣ Get Chat History  
**GET** `/chat/session/sessionId`  
**Description:** Fetches all previous chat history of a user.

#### Response
```json
[
  {
    "sessionId": "672002cd",
    "messages": [
      { "sender": "user", "text": "Hello!" },
      { "sender": "assistant", "text": "Hi! How can I help you today?" }
    ]
  }
]
```

### 5️⃣ Get System Prompt
**GET** `/chat/session/:sessionId/system-prompt`  
**Description:** Fetches the current system prompt of a user.

#### Response
```json
{
  "sessionId": "672002cd",
  "systemPrompt": ""
}

```

### 6️⃣ Update System Prompt
**UPDATE** `/chat/session/:sessionId/system-prompt`  
**Description:** Updates existing system prompt of a user.

#### Request Body
```json
{
  "systemPrompt": "Enter prompt..."
}
```

#### Response
```json
{ 
  "success": true, 
  "session": { ... }
}
```

---

## ⚙️ PRODUCTIVITY TOOLKITS

### 🧾 1️⃣ Summarizer  
**POST** `/ai/summarize`  
**Description:** Generates a concise summary of provided text or article.

#### Request Body
```json
{
  "text": "The provided article discusses the rise of AI in education..."
}
```

#### Response
```json
{
  "summary": "The article highlights how AI is transforming education by personalizing learning experiences."
}
```

**GET** `/ai/summaries`  
**Description:** Fetches summaries chat history.

#### Response
```json
{
  "summary": "The article highlights how AI is transforming education by personalizing learning experiences."
}
```

---

### ✅ 2️⃣ Task Generator  
**POST** `/ai/tasks`  
**Description:** Generates actionable tasks based on user input or project description.

#### Request Body
```json
{
  "prompt": "Build a landing page for a productivity app"
}
```

#### Response
```json
{
  "tasks": [
    "Design hero section",
    "Implement navigation bar",
    "Add pricing section",
    "Optimize responsiveness"
  ]
}
```

**GET** `/ai/tasks`  
**Description:** Fetches tasks history.

#### Response
```json
{
  "tasks": [
    "Design hero section",
    "Implement navigation bar",
    "Add pricing section",
    "Optimize responsiveness"
  ]
}
```

---

### 📝 3️⃣ Note Taker  
**POST** `/ai/notes`  
**Description:** Turns rough notes or ideas into a well-organized note with proper structure, headings, and clarity.

#### Request Body
```json
{
  "content": "Meeting notes: discuss app launch, fix bugs,  prepare presentation for investors."
}
```

#### Response
```json
{
 "sucess": true,
"note": {
    "user": "6906785a28c6347666732337",
    "title": "**Meeting Notes: App Launch Preparation**",
    "content": "**Meeting Notes: App Launch Preparation**\n\n**I. Key Discussion Points**\n\n1. **App Launch**: Review and confirm the launch plan, including timeline and key milestones.",
  }
}
```

  
**GET** `/ai/notes`  
**Description:** Fetches AI-structured notes.
#### Response:
```json
[
  {
    "id": "672001fc",
    "title": "Meeting Notes",
    "content": "Discussed new features for AIMate."
  }
]
```

---
### 📧 4️⃣ Email Drafter  
**POST** `/ai/email`  
**Description:** Generates a professional email draft based on user input.

#### Request Body
```json
{
  "prompt": "Write an email to a client following up on a project update."
}
```

#### Response
```json
{
  "body": "Hi [Client Name], I hope you're doing well. I wanted to follow up on our recent project updates..."
}
```

**GET** `/ai/emails`  
**Description:** Gets draft inputs.

#### Response
```json
{
  "body": "Hi [Client Name], I hope you're doing well. I wanted to follow up on our recent project updates..."
}
```

---
### ✍️ 5️⃣ Text Rewriter  
**POST** `/ai/rewrite`  
**Description:** Rewrites or paraphrases the given text while maintaining meaning.

#### Request Body
```json
{
  "text": "AI is changing the way we work by automating repetitive tasks."
}
```

#### Response
```json
{
  "success": true,
  "saved": "Artificial intelligence is transforming work by taking over routine tasks."
}
```

**GET** `/ai/rewrites`  
**Description:** Feches rewrite chat history.

#### Response
```json
{
  "success": true,
  "rewrites": "Artificial intelligence is transforming work by taking over routine tasks."
}
```

---

## ⚠️ ERROR RESPONSES (Common)

| Status | Message |
|--------|----------|
| 400 | Invalid request data |
| 401 | Unauthorized (invalid or missing token) |
| 403 | Forbidden |
| 404 | Resource not found |
| 500 | Internal server error |

---

### 🧩 Notes
- All authenticated routes require a valid **accessToken** in HTTP-only cookies.  
- Refresh tokens are automatically managed via `/api/auth/refresh`.  

---

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Author:** AIMate Backend Team
