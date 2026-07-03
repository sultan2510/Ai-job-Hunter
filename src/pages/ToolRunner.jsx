import { useState } from 'react'

export default function ToolRunner({ tool }) {
  const initialState = Object.fromEntries(tool.fields.map((f) => [f.name, '']))
  const [values, setValues] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  const handleChange = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const missing = tool.fields.find((f) => f.required && !values[f.name]?.trim())
    if (missing) {
      setError(`Please fill in "${missing.label}" before running.`)
      return
    }

    setLoading(true)
    setResult('')
    try {
      const res = await fetch(tool.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }
      setResult(data.result || '')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container tool-page">
      <div className="tool-header">
        <h1><span>{tool.icon}</span> {tool.title}</h1>
        <p>{tool.description}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="panel">
          {tool.fields.map((f) => (
            <div className="field" key={f.name}>
              <label htmlFor={f.name}>{f.label}</label>
              {f.type === 'textarea' ? (
                <textarea
                  id={f.name}
                  rows={f.rows || 8}
                  placeholder={f.placeholder}
                  value={values[f.name]}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                />
              ) : (
                <input
                  id={f.name}
                  type="text"
                  placeholder={f.placeholder}
                  value={values[f.name]}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                />
              )}
            </div>
          ))}

          <div className="btn-row">
            <button className="btn" type="submit" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Run'}
            </button>
            {error && <span className="error-text">{error}</span>}
          </div>
        </div>
      </form>

      <div className="panel">
        <label>Result</label>
        {result ? (
          <div className="result">{result}</div>
        ) : (
          <div className="result-empty">
            {loading ? 'Working on it...' : 'Your result will appear here.'}
          </div>
        )}
      </div>
    </div>
  )
}
