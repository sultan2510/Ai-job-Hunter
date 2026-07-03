import { callGemini, requireFields } from './_lib/gemini.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    requireFields(req.body, ['profileText'])
    const { profileText } = req.body

    const prompt = `You are a recruiter and LinkedIn profile optimization expert with 15 years of experience screening candidates.

Review the LinkedIn profile content below and provide:
1. First impression (what a recruiter notices in the first 5 seconds).
2. Headline feedback — is it clear and keyword-rich? Suggest 2 improved headline options.
3. About section feedback — structure, tone, and clarity notes.
4. Experience bullet feedback — are they achievement-focused or just duties? Give 2-3 example rewrites.
5. Overall score out of 10 with a one-sentence justification.

Format in clean plain text with clear section headers, no markdown asterisks.

PROFILE CONTENT:
"""
${profileText}
"""`

    const result = await callGemini(prompt)
    return res.status(200).json({ result })
  } catch (err) {
    console.error(err)
    return res.status(err.status || 500).json({ error: err.message || 'Unexpected error' })
  }
}
