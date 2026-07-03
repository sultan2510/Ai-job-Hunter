import { PDFParse } from 'pdf-parse'
import mammoth from 'mammoth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { fileData, fileType, fileName } = req.body
    if (!fileData) {
      const err = new Error('No file was received. Please choose a file and try again.')
      err.status = 400
      throw err
    }

    const buffer = Buffer.from(fileData, 'base64')
    const lowerName = (fileName || '').toLowerCase()
    let text = ''

    if (fileType === 'application/pdf' || lowerName.endsWith('.pdf')) {
      const parser = new PDFParse({ data: buffer })
      try {
        const result = await parser.getText()
        text = result.text
      } finally {
        await parser.destroy()
      }
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      lowerName.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } else {
      const err = new Error('Unsupported file type. Please upload a PDF or DOCX file.')
      err.status = 400
      throw err
    }

    text = (text || '').trim()

    if (!text) {
      const err = new Error(
        'Could not find any text in that file (it may be a scanned/image-only PDF). Try pasting the text manually instead.'
      )
      err.status = 422
      throw err
    }

    return res.status(200).json({ text })
  } catch (err) {
    console.error('extract-text error:', err)
    return res.status(err.status || 500).json({
      error: err.message || 'Failed to read that file. Please try pasting the text instead.',
    })
  }
}