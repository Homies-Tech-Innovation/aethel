> This is a draft for the next version of the overview file

# Aethel - Architecture Overview

## Features

As a markdown editor, Aethel should provide essential editing capabilities:

- **Folders:** As a web application, Aethel requires an integrated filesystem that allows users to create and organize files into folders.
- **Media Support:** Although not ideal, Aethel should support rendering images, GIFs, and videos both within markdown documents and as standalone files. Media will be added separately to the filesystem and referenced in the markdown editor.
- **Realtime Markdown Rendering:** Changes in the editor should be reflected instantly in the rendered markdown view.
- **Text Color Coding and Highlighting:** Users should be able to color code and highlight text for better readability and emphasis.
- **Realtime Saving:** The editor should automatically save changes in real time.

### AI-Related Features

- **Chat with RAG (Retrieval-Augmented Generation):** Users can interact with an AI chat that leverages RAG for files. By default, only the currently open file is accessible to the AI. Additional files can be manually added to the context. RAG is only used for large files.
- **Agentic Features:**
  - CRUD operations for files and folders.
  - File rewriting and enhancement, including:
    - **Full Rewrite:** Can be triggered directly from the chat. When the AI finishes, it sends the rewritten version to the chat window, where a "Replace" button allows the user to approve and replace the old version with the new one.
    - **Suggestions:** The AI highlights enhancements (e.g., grammar, flow, tone) with underlines. Hovering reveals suggestions, which can be directly applied in the editor.

## Core Distinction

To enable parallel development, the frontend and backend should be separated as early as possible. This requires agreement on an OpenAPI contract. Once established, the backend can focus on implementing microservices, while the frontend progresses independently.

## Core Stack

WebSockets will be used for the realtime save system. Since WebSockets are already in use, they can also be leveraged for agentic AI API calls.

**TODO:**

- Create flowcharts, sequence diagrams, or other visuals to improve clarity.
- Finalize the API contract and DB design.
