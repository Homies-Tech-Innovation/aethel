# Aethel - Architecture Overview

## What Is This?

A markdown editor with an AI agent that can actually DO stuff - not just chat, but edit your docs, generate content, etc.

## The Stack

- **Frontend:** React
- **Backend:** Node.js + Express
- **Database:** [TODO: Pick one - PostgreSQL or MongoDB]
- **AI Agent:** [TODO: LangGraph + Python microservice OR LangGraph in JS implementation]
- **Docker:** Containerize everything

## Main Parts

### Frontend

- Markdown editor with live preview
- AI agent interface (not just chat - it can take actions)
- User dashboard
- Auth pages (login/signup)

### Backend

- User auth (JWT)
- Document CRUD
- AI agent service (either Python microservice or JS)
- Handles AI provider calls (OpenAI, Anthropic, Gemini)

### Database

- Users
- Documents
- AI interaction history

## How It Works

1. User writes markdown
2. User asks AI agent to do something
3. Agent can read the doc, edit it, generate new content, etc.
4. Changes saved to DB

## Big TODOs (Need Docs)

- Database design → `database.md`
- API endpoints → `api.md`
- AI agent architecture (LangGraph vs pure JS?) → `ai-agent.md`
- Frontend structure → `frontend.md`

That's it. Details in other docs.
