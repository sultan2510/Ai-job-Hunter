export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { fileData, fileType, fileName } = req.body || {}
    if (!fileData) {
      const err = new Error('No file was received. Please choose a file and try again.')
      err.status = 400
      throw err
    }

    const buffer = Buffer.from(fileData, 'base64')
    const lowerName = (fileName || '').toLowerCase()
    let text = ''

    if (fileType === 'application/pdf' || lowerName.endsWith('.pdf')) {
      text = await extractPdfText(buffer)
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      lowerName.endsWith('.docx')
    ) {
      const { default: mammoth } = await import('mammoth')
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

async function extractPdfText(buffer) {
  // Dynamic import + the legacy Node build: pdfjs-dist auto-detects the
  // non-browser environment and runs without an external worker file,
  // which avoids the packaging issues that broke pdf-parse in serverless.
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')

  const uint8 = new Uint8Array(buffer)
  const doc = await getDocument({ data: uint8, useSystemFonts: true }).promise

  let text = ''
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map((item) => item.str).join(' ') + '\n'
  }
  await doc.cleanup()
  return text
}