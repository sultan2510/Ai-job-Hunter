import { callGemini, requireFields } from './_lib/gemini.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    requireFields(req.body, ['resume'])
    const { resume, targetRole } = req.body

    const prompt = `You are an expert resume writer and ATS (Applicant Tracking System) specialist.

Review the resume below${targetRole ? ` for a target role of "${targetRole}"` : ''} and produce:
1. A short overall assessment (2-3 sentences).
2. A "Top Fixes" list of the 5 most impactful changes to make, each with a one-line reason.
3. A rewritten version of the resume's experience bullets using strong action verbs and quantified impact where possible. Keep facts truthful to the original — do not invent numbers or experience that isn't implied by the original text.
4. A short list of ATS keyword suggestions relevant to the target role, if one was given.

Format the response in clean plain text with clear section headers. Do not use markdown asterisks for bold.

RESUME:
"""
${resume}
"""`

    const result = await callGemini(prompt)
    return res.status(200).json({ result })
  } catch (err) {
    console.error(err)
    return res.status(err.status || 500).json({ error: err.message || 'Unexpected error' })
  }
}
