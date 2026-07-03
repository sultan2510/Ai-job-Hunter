import { useRef, useState } from 'react'

const MAX_FILE_BYTES = 4 * 1024 * 1024 // 4MB, well under Vercel's request size limit

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result || ''
      const base64 = String(result).split(',')[1] || ''
      resolve(base64)
    }
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.readAsDataURL(file)
  })
}

export default function ToolRunner({ tool }) {
  const initialState = Object.fromEntries(tool.fields.map((f) => [f.name, '']))
  const [values, setValues] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  // Per-field upload state: { [fieldName]: { uploading, error, fileName } }
  const [uploadState, setUploadState] = useState({})
  const fileInputRefs = useRef({})

  const handleChange = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
  }

  const handleFileSelect = async (fieldName, file) => {
    if (!file) return

    if (file.size > MAX_FILE_BYTES) {
      setUploadState((s) => ({
        ...s,
        [fieldName]: { uploading: false, error: 'File is too large (max 4MB). Try pasting the text instead.', fileName: '' },
      }))
      return
    }

    setUploadState((s) => ({ ...s, [fieldName]: { uploading: true, error: '', fileName: file.name } }))

    try {
      const base64 = await fileToBase64(file)
      const res = await fetch('/api/extract-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileData: base64, fileType: file.type, fileName: file.name }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Could not read that file.')
      }
      handleChange(fieldName, data.text)
      setUploadState((s) => ({ ...s, [fieldName]: { uploading: false, error: '', fileName: file.name } }))
    } catch (err) {
      setUploadState((s) => ({
        ...s,
        [fieldName]: { uploading: false, error: err.message || 'Could not read that file.', fileName: '' },
      }))
    }
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
          {tool.fields.map((f) => {
            const upload = uploadState[f.name]
            return (
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

                {f.allowUpload && (
                  <div className="upload-row">
                    <input
                      type="file"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      ref={(el) => (fileInputRefs.current[f.name] = el)}
                      onChange={(e) => handleFileSelect(f.name, e.target.files?.[0])}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      className="upload-btn"
                      onClick={() => fileInputRefs.current[f.name]?.click()}
                      disabled={upload?.uploading}
                    >
                      {upload?.uploading ? <span className="spinner spinner-dark" /> : '📎'}
                      {upload?.uploading ? 'Reading file...' : 'Upload PDF or DOCX instead'}
                    </button>
                    {upload?.fileName && !upload?.uploading && !upload?.error && (
                      <span className="upload-status upload-status-ok">✓ Loaded {upload.fileName}</span>
                    )}
                    {upload?.error && <span className="upload-status upload-status-error">{upload.error}</span>}
                  </div>
                )}
              </div>
            )
          })}

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