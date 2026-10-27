# ⚖️ Chatvocate – IPC Expert

### AI-Powered Legal Assistant for Indian Penal Code (IPC)

Chatvocate – IPC Expert is an AI-powered legal assistance application designed to help users explore and understand Indian Penal Code (IPC) information through natural language questions.

The application combines a React frontend with a Django backend to provide an interactive interface for asking legal questions and receiving AI-generated responses based on relevant legal information.

## 🚀 Features

- **AI-Powered Legal Q&A:** Ask questions about IPC-related legal topics in natural language.
- **Document-Based Knowledge:** Uses an IPC document as a knowledge source for retrieving relevant information.
- **Intelligent Responses:** Uses AI to generate contextual answers based on retrieved information.
- **Interactive User Interface:** React-based frontend for communicating with the legal assistant.
- **Backend API:** Django backend for handling application logic and requests.
- **Semantic Search:** ChromaDB vector storage for retrieving relevant document content.
- **REST API Integration:** Connects the frontend and backend for communication.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| Django | Backend framework |
| React.js | Frontend development |
| JavaScript | Frontend functionality |
| HTML & CSS | User interface and styling |
| OpenAI API | AI-powered responses |
| ChromaDB | Vector storage and semantic search |
| REST APIs | Frontend-backend communication |
| Git & GitHub | Version control and source code management |

## 🏗️ Project Structure

```text
Chatvocate-IPC-Expert/
│
├── backend/
│   ├── chat/
│   ├── config/
│   ├── data/
│   │   └── IPC_186045.pdf
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Ensure the following are installed on your system:

- Python 3.10 or a compatible version required by the project
- Node.js and npm
- Git
- An OpenAI API key

### 1. Clone the Repository

```bash
git clone https://github.com/Amolika-2005/Chatvocate-IPC-Expert.git
cd Chatvocate-IPC-Expert
```

### 2. Set Up the Django Backend

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment on Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Add the required environment variables using your own credentials:

```env
DJANGO_SECRET_KEY=your_django_secret_key
OPENAI_API_KEY=your_openai_api_key
```

Ensure the Django application loads the environment variables correctly.

**Security:** Never upload your actual API key or Django secret key to GitHub.

### 4. Apply Database Migrations

Run the following commands from the backend directory:

```bash
python manage.py migrate
```

### 5. Start the Backend Server

```bash
python manage.py runserver
```

The Django development server will normally be available at:

```text
http://127.0.0.1:8000/
```

### 6. Set Up the React Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install the frontend dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

## 🔐 Environment Variables

Keep sensitive configuration values in environment variables rather than committing them to source control.

| Variable | Description |
|---|---|
| `DJANGO_SECRET_KEY` | Secret key used by Django |
| `OPENAI_API_KEY` | API key used for OpenAI services |

Additional environment variables may be required depending on your local configuration.

## 📌 Future Enhancements

- Support for additional Indian laws and legal documents.
- Improved legal document retrieval and response accuracy.
- Chat history and conversation management.
- Enhanced user experience and responsive design.
- Source references for AI-generated legal answers.

## ⚠️ Disclaimer

Chatvocate is an informational tool intended to help users explore legal information. AI-generated responses may be incomplete or inaccurate and should not be treated as professional legal advice. Consult a qualified legal professional for advice about specific legal matters.

## 👩‍💻 Developer

**Amolika RT**

GitHub: [Amolika-2005](https://github.com/Amolika-2005)

---

⭐ If you find this project interesting, consider starring the repository!