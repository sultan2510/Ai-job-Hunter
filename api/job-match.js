import { callGemini, requireFields } from './_lib/gemini.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    requireFields(req.body, ['resume', 'jobDescription'])
    const { resume, jobDescription } = req.body

    const prompt = `You are a technical recruiter who evaluates candidate fit against job postings.

Compare the resume to the job description below and provide:
1. A Match Score out of 100 with a one-sentence explanation.
2. Strong matches — skills/experience from the resume that directly align with the job's requirements.
3. Gaps — requirements in the job posting that the resume doesn't clearly address.
4. What to emphasize — 3 specific things the candidate should highlight in their application or interview to strengthen their case.

Format in clean plain text with clear section headers, no markdown asterisks.

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
