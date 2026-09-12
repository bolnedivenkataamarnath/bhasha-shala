import { useState } from 'react'
import './App.css'

function App() {
  const [teacherMode, setTeacherMode] = useState(false)
  const [lessonText, setLessonText] = useState('')
  const [translatedText, setTranslatedText] = useState('')

  if (teacherMode) {
    return (
      <div className="app">
        <header className="header">
          <div>
            <h1>🌱 Bhasha Shala</h1>
            <p>Teacher Mode</p>
          </div>

          <button
            className="language-button"
            onClick={() => setTeacherMode(false)}
          >
            ← Back
          </button>
        </header>

        <main className="main">
          <section className="teacher-page">
            <p className="tag">TEACHER MODE</p>

            <h2>Create a lesson</h2>

            <p className="description">
              Enter learning content in Hindi and prepare it
              for children in their mother tongue.
            </p>

            <div className="teacher-card">
              <label>Hindi lesson content</label>

             <textarea
  placeholder="Example: पेड़ हमें ऑक्सीजन देते हैं।"
  rows={6}
  value={lessonText}
  onChange={(e) => setLessonText(e.target.value)}
/>
              <label>Target language</label>

              <select>
                <option>Santhali</option>
                <option>Ho</option>
                <option>Mundari</option>
              </select>

             <button
  className="primary-button"
  onClick={() => setTranslatedText('Translation will appear here after AI is connected.')}
>
  🌐 Translate Lesson
</button>
{translatedText && (
  <div className="translation-result">
    <h3>Translated Lesson</h3>
    <p>{translatedText}</p>
  </div>
)}
            </div>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>🌱 Bhasha Shala</h1>
          <p>Mother Tongue Learning Platform</p>
        </div>

        <button className="language-button">
          हिंदी ▾
        </button>
      </header>

      <main className="main">
        <section className="welcome">
          <p className="tag">SMART EDUCATION • SIH26042</p>

          <h2>Learn in your<br />mother tongue.</h2>

          <p className="description">
            Helping primary school children learn through
            their own language with AI-powered translation,
            voice and interactive lessons.
          </p>

          <div className="buttons">
           <button
  className="primary-button"
  onClick={() => setTeacherMode(true)}
>
  👩‍🏫 Teacher Mode
</button>

            <button className="secondary-button">
              🎒 Student Mode
            </button>
          </div>
        </section>

        <section className="features">
          <div className="feature-card">
            <span>🗣️</span>
            <h3>Voice Learning</h3>
            <p>Listen and learn in your mother tongue.</p>
          </div>

          <div className="feature-card">
            <span>🌐</span>
            <h3>AI Translation</h3>
            <p>Translate learning content between languages.</p>
          </div>

          <div className="feature-card">
            <span>📝</span>
            <h3>Worksheets</h3>
            <p>Interactive activities for young learners.</p>
          </div>
        </section>
      </main>

      <footer>
        <p>Built for inclusive primary education 🇮🇳</p>
      </footer>
    </div>
  )
}

export default App