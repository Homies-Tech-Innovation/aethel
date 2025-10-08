# Documentation for WireFrame UI

*This documentation is not for the UI/UX design, it is for the wireframe/layout to get us an idea of what we are building

*PNG file exported from Figma is in the same folder

## Dependencies

- React
- Tailwind CSS
- Some markdown engine lib 
- Filesystem lib (for file browser)
- AI SDK/API to backend

## Layout Overview

The application follows a three-panel layout:
1. **Left Panel**: File Browser
2. **Center Panel**: Editor
3. **Right Panel**: AI Chat

## Components

### 1. File Browser (Left Panel)




- **Top Utility Tab**
  - Menu toggle button - shows/hides the file browser panel
  - Search button - opens a small popup to search files
  
- **File Tree**
  - Hierarchical display of folders and files. folders and files  
  - we can store files as md files or contents of the files in a sql db
  - images will be stored saperately and called with a url(in same folder as md files)
  - click on a file to open in editor
  click save button(not in layout yet) to save changes

  

  
- **Bottom Bar**
  - Settings button (gear icon)
  - "Other Tabs" indicator/switcher


---


### 2. Editor (Center Panel)


- **Tab Bar** ("OPENED FILES")
  - Shows all currently open files
  - Active tab highlighting
  - Close button on each tab (×)
  - Tab reordering via drag and drop
  
- **Editor Area**
   add text and hit save button to save the changes
  


**Interactions**:(not sure about these yet)
- Click tab to switch between open files
- Middle-click or click × to close tab
- Ctrl+S to save
- Standard text editing shortcuts

---

### 3. AI Chat (Right Panel)

**Purpose**: AI assistant for code help, explanations, and generation

- **Header**
  - "AI CHAT" title
  - Minimize/maximize button (optional)
  - Settings button (optional)
  
- **Chat History**
  - gives answeres in markdown but user sees rendered output in chat
  - entire editor file will be sent with user chat and previous chats for context(untill rag is implimented)
  - refresh page means clear chat history(for simplicity)(optional)
  
  
- **Input Area** (Bottom)
  - messege ai and tap send button or hit enter to send. send button needs to convert to loading state while waiting for ai response
---



## Responsive Behavior
- IDK

### Panel Resizing
- optional

### Theme Support
- Light and dark mode(option currently only one theme)
- Color scheme should be consistent across all panels


---

## download 

- downlod md files in a zip with other assets(images etc)(optional)
- not in layout yet
- export to pdf or html (optional)