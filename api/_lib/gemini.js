const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

/**
 * Calls the Gemini API with a single prompt and returns the text response.
 * Throws an Error with a user-safe message on failure.
 */
export async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Server is missing GEMINI_API_KEY. Add it in your Vercel project settings.')
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    }),
  })

  if (!response.ok) {
    const errBody = await response.text().catch(() => '')
    console.error('Gemini API error:', response.status, errBody)
    throw new Error('The AI service failed to respond. Please try again in a moment.')
  }

  const data = await response.json()
  const candidate = data?.candidates?.[0]
  const text = candidate?.content?.parts?.map((p) => p.text).join('') || ''

  if (!text) {
    throw new Error('The AI service returned an empty response. Please try again.')
  }

  if (candidate?.finishReason === 'MAX_TOKENS') {
    console.warn('Gemini response was truncated at the token limit.')
  }

  return text.trim()
}

/**
 * Basic request validation + method guard shared by every handler.
 */
export function requireFields(body, fields) {
  for (const field of fields) {
    if (!body || !String(body[field] || '').trim()) {
      const err = new Error(`Missing required field: ${field}`)
      err.status = 400
      throw err
    }
  }
}