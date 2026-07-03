export const tools = [
  {
    id: 'resume-optimizer',
    path: '/resume-optimizer',
    icon: '📄',
    title: 'Resume Optimizer',
    tagline: 'Tighten your resume and beat the ATS scan.',
    description:
      'Paste your resume and (optionally) a target role. Get a rewritten, ATS-friendly version plus a list of concrete fixes.',
    endpoint: '/api/resume-optimize',
    fields: [
      { name: 'resume', label: 'Your resume (paste text or upload a file)', type: 'textarea', placeholder: 'Paste your full resume text here, or upload a PDF/DOCX below...', required: true, rows: 10, allowUpload: true },
      { name: 'targetRole', label: 'Target role (optional)', type: 'text', placeholder: 'e.g. Senior Product Designer' },
    ],
  },
  {
    id: 'linkedin-review',
    path: '/linkedin-review',
    icon: '🔗',
    title: 'LinkedIn Profile Review',
    tagline: 'Get a recruiter-eye critique of your profile.',
    description:
      'Paste your headline, About section, and experience bullets. Get feedback on positioning, keywords, and clarity.',
    endpoint: '/api/linkedin-review',
    fields: [
      { name: 'profileText', label: 'Your LinkedIn profile (headline, about, experience)', type: 'textarea', placeholder: 'Paste your headline, About section, and a few experience bullets...', required: true, rows: 10 },
    ],
  },
  {
    id: 'portfolio-feedback',
    path: '/portfolio-feedback',
    icon: '🎨',
    title: 'Portfolio Feedback',
    tagline: 'Get honest notes on your case studies.',
    description:
      'Describe your portfolio or paste case study text/links. Get feedback on structure, storytelling, and what a hiring manager will notice first.',
    endpoint: '/api/portfolio-feedback',
    fields: [
      { name: 'portfolioText', label: 'Portfolio description, case study text, or links', type: 'textarea', placeholder: 'Describe your portfolio, paste case study text, or list project links with brief context...', required: true, rows: 10 },
    ],
  },
  {
    id: 'job-matching',
    path: '/job-matching',
    icon: '🎯',
    title: 'Job Matching',
    tagline: 'See how well you fit a role before you apply.',
    description:
      'Paste your resume and a job description. Get a match score, gap analysis, and what to emphasize in your application.',
    endpoint: '/api/job-match',
    fields: [
      { name: 'resume', label: 'Your resume (paste text or upload a file)', type: 'textarea', placeholder: 'Paste your resume text, or upload a PDF/DOCX below...', required: true, rows: 8, allowUpload: true },
      { name: 'jobDescription', label: 'Job description', type: 'textarea', placeholder: 'Paste the job posting text...', required: true, rows: 8 },
    ],
  },
  {
    id: 'cover-letter',
    path: '/cover-letter',
    icon: '✍️',
    title: 'Cover Letter Generator',
    tagline: 'A tailored draft in seconds, not hours.',
    description:
      'Paste your resume and the job description. Get a tailored cover letter draft you can edit and send.',
    endpoint: '/api/cover-letter',
    fields: [
      { name: 'resume', label: 'Your resume (paste text or upload a file)', type: 'textarea', placeholder: 'Paste your resume text, or upload a PDF/DOCX below...', required: true, rows: 8, allowUpload: true },
      { name: 'jobDescription', label: 'Job description', type: 'textarea', placeholder: 'Paste the job posting text...', required: true, rows: 8 },
      { name: 'tone', label: 'Tone (optional)', type: 'text', placeholder: 'e.g. warm and direct, formal, enthusiastic' },
    ],
  },
  {
    id: 'interview-prep',
    path: '/interview-prep',
    icon: '🎤',
    title: 'Interview Prep',
    tagline: 'Walk in ready for the questions that matter.',
    description:
      'Paste the job description (and your resume for sharper answers). Get likely interview questions with guidance on how to answer them.',
    endpoint: '/api/interview-prep',
    fields: [
      { name: 'jobDescription', label: 'Job description', type: 'textarea', placeholder: 'Paste the job posting text...', required: true, rows: 8 },
      { name: 'resume', label: 'Your resume (optional, sharpens answers — paste text or upload a file)', type: 'textarea', placeholder: 'Paste your resume text, or upload a PDF/DOCX below...', rows: 8, allowUpload: true },
    ],
  },
]

export const getToolById = (id) => tools.find((t) => t.id === id)