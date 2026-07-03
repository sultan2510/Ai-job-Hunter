import { Link } from 'react-router-dom'
import { tools } from '../tools.js'

export default function Home() {
  return (
    <div className="container">
      <div className="hero">
        <div className="hero-eyebrow">Six tools, one briefcase</div>
        <h1>Everything you need to land the next role.</h1>
        <p>
          Paste your resume, profile, or a job post. Each tool below does one job well —
          no login, nothing saved, just a straight answer powered by AI.
        </p>
      </div>

      <div className="tool-grid">
        {tools.map((tool, i) => (
          <Link to={tool.path} className="tool-card" key={tool.id}>
            <div className="tool-index">{String(i + 1).padStart(2, '0')} / 06</div>
            <div className="tool-title">
              <span>{tool.icon}</span> {tool.title}
            </div>
            <div className="tool-desc">{tool.tagline}</div>
            <div className="tool-cta">Open tool →</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
