# Chatvocate — IPC Expert

Django REST Framework backend + React/Vite frontend + ChromaDB + OpenAI, with a plain Python RAG pipeline (no LangChain).

## Setup (Windows)
1. Backend:
   ```
   cd backend
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   copy .env.example .env
   ```
   Add your OpenAI API key to `backend/.env`, then:
   ```
   python manage.py migrate
   python manage.py runserver
   ```
   The first question automatically indexes the included IPC PDF. To index before chatting:
   `python manage.py index_ipc`
2. Frontend in another terminal:
   ```
   cd frontend
   npm install
   copy .env.example .env
   npm run dev
   ```
   Open the Vite URL, usually http://localhost:5173.

API: `POST /api/chat/` with `{"question":"What does IPC Section 302 cover?","history":[]}`.

The uploaded PDF is an older IPC text and may not reflect current law. This app provides information, not legal advice. Verify current legislation with official sources or a qualified lawyer.
