import { callGemini, requireFields } from './_lib/gemini.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    requireFields(req.body, ['jobDescription'])
    const { jobDescription, resume } = req.body

    const prompt = `You are an interview coach who has prepped hundreds of candidates for interviews.

Based on the job description below${resume ? ' and the candidate\'s resume' : ''}, provide:
1. Five likely interview questions specific to this role (mix of behavioral and role-specific/technical), each with a one-line note on what the interviewer is really evaluating.
2. For each question, a brief guidance note on how to structure a strong answer${resume ? ', referencing specific relevant experience from the resume where possible' : ''}.
3. Three smart questions the candidate should ask the interviewer.
4. One likely tough/curveball question and how to handle it calmly.

Format in clean plain text with clear section headers, no markdown asterisks.

JOB DESCRIPTION:
"""
${jobDescription}
"""
${resume ? `\nCANDIDATE RESUME:\n"""\n${resume}\n"""` : ''}`

    const result = await callGemini(prompt)
    return res.status(200).json({ result })
  } catch (err) {
    console.error(err)
    return res.status(err.status || 500).json({ error: err.message || 'Unexpected error' })
  }
}
