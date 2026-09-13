# 🌱 Bhasha Shala

### AI-Powered Mother-Tongue Learning Platform

Bhasha Shala is a tablet-friendly educational platform designed to help primary school children learn concepts through their **mother tongue**.

Built for **Smart India Hackathon 2026 — SIH26042**.

---

## 🎯 Problem

Many children in India begin their education in a language that is different from the language they speak at home.

This can make early learning difficult, particularly for children from regional and tribal language communities.

Bhasha Shala aims to reduce this language barrier by combining **mother-tongue learning, multilingual translation, voice-based learning, and offline-friendly educational content** in one platform.

---

## 💡 Solution

Bhasha Shala provides a unified platform for teachers and students.

### 👩‍🏫 Teacher Side

Teachers can:

* Create and manage learning content
* Prepare lessons
* Translate educational content into supported languages
* Create worksheets
* Create quizzes
* Use voice and speech features
* Prepare content for student learning

### 🎒 Student Side

Students can:

* Learn through mother-tongue lessons
* Read translated learning content
* Complete worksheets
* Attempt quizzes
* Use voice-based learning features
* Save lessons for offline access
* Continue learning from previously saved lessons

---

## 🚀 Key Features

* 🌐 **AI-powered educational translation**
* 📚 **Mother-tongue lesson library**
* 📝 **Interactive worksheets**
* 🧠 **Quizzes and learning activities**
* 🗣️ **Voice and speech features**
* 🔊 **Text-to-speech support**
* 📱 **Offline lesson storage**
* 🎒 **Dedicated student learning mode**
* 👩‍🏫 **Teacher preparation workflow**
* 🌍 **Multiple Indian language support**
* ⚙️ **Language and accessibility settings**
* 📲 **Tablet-friendly interface**

---

## 🧠 AI Translation

Bhasha Shala uses an AI-powered translation service to convert educational content into supported Indian languages.

The current translation backend uses:

**AI4Bharat IndicTrans2**

This allows the platform to integrate AI translation while keeping the core education workflow independent from a single AI provider.

AI services are designed as replaceable adapters so additional translation, speech, or AI models can be integrated in the future.

---

## 🏗️ Architecture

```text
                    ┌─────────────────────────┐
                    │       Bhasha Shala      │
                    │      Tablet Web App      │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   React + TypeScript    │
                    │        Frontend          │
                    └────────────┬────────────┘
                                 │ HTTPS / API
                                 ▼
                    ┌─────────────────────────┐
                    │        FastAPI           │
                    │         Backend          │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
       Translation          Worksheets          Quiz
         Service             Service            Service
              │
              ▼
       IndicTrans2 AI
```

---

## 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Progressive Web App architecture
* Browser Web Speech APIs
* IndexedDB for offline lesson storage

### Backend

* Python
* FastAPI
* REST API
* AI translation services

### AI

* AI4Bharat IndicTrans2
* Modular AI service architecture

---

## 📂 Project Structure

```text
bhasha-shala/
│
├── frontend/
│   ├── src/
│   └── ...
│
├── backend/
│   ├── services/
│   ├── main.py
│   └── ...
│
├── .gitignore
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/bolnedivenkataamarnath/bhasha-shala.git
cd bhasha-shala
```

### 2. Start the Backend

Create and activate the Python environment, then install the backend dependencies.

```bash
python -m backend.main
```

The FastAPI backend runs at:

```text
http://127.0.0.1:8000
```

API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite development server will provide the local frontend URL.

---

## 🌍 Supported Learning Languages

The platform is designed to support multiple Indian languages, including:

* English
* Telugu
* Hindi
* Santali
* Tamil
* Kannada
* Malayalam
* Bengali
* Marathi
* Odia
* Assamese

Additional languages can be integrated through the language service architecture.

---

## 🔮 Future Scope

The platform can be extended with:

* More Indian regional and tribal languages
* Improved speech recognition for regional languages
* Better multilingual AI models
* Personalized learning paths
* Student progress tracking
* Teacher analytics
* More advanced AI-generated educational content
* Native Android deployment
* Expanded offline-first capabilities

---

## 🇮🇳 Vision

Our vision is to make quality primary education more accessible by allowing children to learn concepts through the language they understand best — **their mother tongue**.

Bhasha Shala aims to bridge the gap between **technology, education, and linguistic diversity** in India.

---

## 🏆 Hackathon

**Smart India Hackathon 2026**

**Problem Statement:** SIH26042

**Theme:** Smart Education

**Project:** Bhasha Shala

---

### Built for inclusive education in India. 🇮🇳
