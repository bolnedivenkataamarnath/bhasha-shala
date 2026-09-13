# 🌱 Bhasha Shala

### AI-Powered Mother-Tongue Learning Platform

Bhasha Shala is a unified, tablet-friendly educational platform designed to help primary school children learn concepts through languages they understand best — their mother tongue.

The platform combines **AI-powered translation, lessons, worksheets, quizzes, voice-based learning, and offline learning** in one place.

Built for **Smart India Hackathon 2026 — SIH26042**.

---

## 🎯 Problem

Many children in India begin their education in a language that is different from the language they speak at home.

This language gap can make it difficult for young learners to understand concepts, participate confidently, and build strong foundations during primary education.

This challenge is particularly important for children from **regional and tribal language communities**, where educational resources in their mother tongue may be limited.

---

## 💡 Solution

**Bhasha Shala** provides a single unified learning platform where educational content can be prepared, translated, practiced, and learned through multiple Indian languages.

Instead of separating the system into different teacher and student applications, Bhasha Shala brings the learning workflow together in one platform.

The platform provides:

* 🌐 AI-powered multilingual educational translation
* 📚 Lesson creation and learning
* 📝 Interactive worksheets
* 🧠 Quizzes and knowledge checks
* 🗣️ Voice-based learning
* 🔊 Text-to-speech support
* 📱 Offline lesson storage
* 🌍 Support for multiple Indian languages
* ⚙️ Language, voice, and appearance settings
* 💻 Tablet-friendly responsive interface

---

## 🚀 Key Features

### 📚 Lessons & Learning

Users can access educational lessons through a simple learning interface designed for primary-school learners.

Lessons can contain:

* Learning content
* Translated versions
* Worksheets
* Quizzes
* Voice-based learning support

---

### 🌐 AI-Powered Translation

Bhasha Shala integrates AI-powered translation to help convert educational content into Indian regional and tribal languages.

The platform supports multiple target languages and allows learners to access the translated version of educational content.

The current translation system uses **AI4Bharat IndicTrans2** for English-to-Indic language translation.

---

### 📝 Worksheets

Lessons can be accompanied by worksheets that allow students to practice concepts after learning them.

Worksheets are integrated into the learning workflow instead of being treated as a separate application.

---

### 🧠 Quizzes

Interactive quizzes help learners test their understanding of lesson content.

The quiz workflow is connected directly with lessons and learning activities.

---

### 🗣️ Voice & Speech Learning

Bhasha Shala includes voice-based learning capabilities to make educational content more accessible and engaging.

The platform provides:

* Voice controls
* Speech-related learning features
* Text-to-speech support
* Adjustable speech speed

---

### 📱 Offline Learning

Learning should not depend completely on an internet connection.

Bhasha Shala allows lessons and their related learning content to be saved locally for offline access.

Saved content can include:

* Lessons
* Translations
* Worksheets
* Quizzes

This makes the platform more suitable for environments where internet connectivity may be limited or unreliable.

---

### ⚙️ Settings & Personalization

The platform includes settings for:

* Application language
* Default learning language
* Voice enable/disable
* Speech speed
* Light/Dark appearance
* Normal/Large text

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────────┐
                    │       Bhasha Shala      │
                    │    Unified Web Platform │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   React + TypeScript    │
                    │        Frontend          │
                    └────────────┬────────────┘
                                 │
                              API
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │        FastAPI           │
                    │         Backend          │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
       Translation          Worksheet            Quiz
         Service             Service            Service
              │
              ▼
       IndicTrans2 AI
```

The frontend communicates with the FastAPI backend through API requests.

AI services are designed as replaceable components so that the core educational platform does not depend permanently on a single AI provider.

---

## 🧠 Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Progressive Web App concepts
* Browser Web Speech APIs
* IndexedDB for offline storage

### Backend

* Python
* FastAPI
* REST API

### AI / NLP

* AI4Bharat IndicTrans2
* Multilingual translation
* Indian language processing

### Development

* Git
* GitHub
* VS Code

---

## 📂 Project Structure

```text
bhasha-shala/
│
├── frontend/
│   └── React + TypeScript application
│
├── backend/
│   └── FastAPI backend and AI services
│
├── .gitignore
└── README.md
```

---

## 🌍 Supported Languages

The platform is designed to work with multiple Indian languages, including:

* 🇮🇳 English
* తెలుగు Telugu
* हिन्दी Hindi
* Santali
* தமிழ் Tamil
* ಕನ್ನಡ Kannada
* മലയാളം Malayalam
* বাংলা Bengali
* मराठी Marathi
* ଓଡ଼ିଆ Odia
* অসমীয়া Assamese

The architecture allows additional Indian languages to be integrated in the future.

---

## 🔄 Learning Workflow

```text
        Educational Content
                │
                ▼
        ┌─────────────────┐
        │     Lessons     │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ AI Translation  │
        └────────┬────────┘
                 │
                 ▼
       Mother-Tongue Content
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
    Worksheet   Quiz    Voice
        │        │        │
        └────────┼────────┘
                 ▼
          Student Learning
                 │
                 ▼
          Save for Offline
```

---

## 📱 Unified Platform Approach

Bhasha Shala is designed as **one integrated educational platform** rather than separate teacher and student applications.

Different learning and content workflows exist within the same application.

This approach helps keep the experience:

* Simple
* Consistent
* Easy to use on tablets
* Suitable for classroom environments
* Easier to maintain and extend

---

## 🔮 Future Scope

The current platform provides the core learning workflow. Future improvements can include:

* More Indian regional and tribal languages
* Improved speech recognition
* More advanced AI-generated educational content
* Personalized learning recommendations
* Better offline synchronization
* Richer interactive learning activities
* Educational analytics
* More classroom-oriented workflows
* Improved support for low-connectivity environments

---

## 🇮🇳 Vision

Our vision is to make quality primary education more accessible by allowing children to understand and learn concepts through the language they are most comfortable with.

**Language should not become a barrier to learning.**

Bhasha Shala aims to bring technology, AI, and mother-tongue education together to create a more inclusive learning experience for children across India.

---

## 🏆 Hackathon

**Smart India Hackathon 2026**

**Problem Statement:** SIH26042

**Theme:** Smart Education

**Project:** Bhasha Shala — AI-Powered Mother-Tongue Learning Platform

---

## 👨‍💻 Project

Built as a Smart India Hackathon project with a focus on:

**AI + Indian Languages + Primary Education + Accessibility + Offline Learning**

---

**Built for inclusive education in India. 🇮🇳**
