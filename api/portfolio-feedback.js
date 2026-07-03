import { callGemini, requireFields } from './_lib/gemini.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    requireFields(req.body, ['portfolioText'])
    const { portfolioText } = req.body

    const prompt = `You are a senior hiring manager who reviews portfolios and case studies daily.

Review the portfolio content below and provide:
1. First impression and overall clarity of the work presented.
2. Storytelling feedback — does each project explain the problem, the process, and the outcome? Point out gaps.
3. Three specific, actionable suggestions to strengthen the portfolio.
4. What's missing that a hiring manager would want to see (e.g. metrics, context, role clarity).

Format in clean plain text with clear section headers, no markdown asterisks.

PORTFOLIO CONTENT:
"""
${portfolioText}
"""`

    const result = await callGemini(prompt)
    return res.status(200).json({ result })
  } catch (err) {
    console.error(err)
    return res.status(err.status || 500).json({ error: err.message || 'Unexpected error' })
  }
}
