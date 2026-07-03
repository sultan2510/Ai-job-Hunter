import { callGemini, requireFields } from './_lib/gemini.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    requireFields(req.body, ['resume', 'jobDescription'])
    const { resume, jobDescription, tone } = req.body

    const prompt = `You are an expert career writer who drafts tailored, specific cover letters — never generic ones.

Using the resume and job description below, write a cover letter that:
- Opens with a specific, non-generic hook related to the role or company's work (avoid "I am writing to apply for...").
- Connects 2-3 concrete experiences from the resume directly to requirements in the job description.
- Is roughly 250-350 words.
- Closes with a confident, low-pressure call to action.
- Uses a tone that is ${tone ? tone : 'professional but warm, and human — not stiff or robotic'}.
- Does not invent facts, numbers, or experience not present in the resume.

Output only the finished cover letter text, ready to send, with no extra commentary before or after it.

RESUME:
"""
${resume}
"""

JOB DESCRIPTION:
"""
${jobDescription}
"""`

    const result = await callGemini(prompt)
    return res.status(200).json({ result })
  } catch (err) {
    console.error(err)
    return res.status(err.status || 500).json({ error: err.message || 'Unexpected error' })
  }
}
