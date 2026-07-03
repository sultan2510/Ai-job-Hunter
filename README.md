# AI Job Hunter

A stateless AI career toolkit with 6 tools: resume optimizer, LinkedIn profile review,
portfolio feedback, job matching, cover letter generator, and interview prep.

- **Frontend:** React + Vite, React Router
- **Backend:** Node.js serverless functions (`/api`), deployed as Vercel Functions
- **AI:** Google Gemini API (free tier)
- **Database:** none — everything is paste-in / paste-out, nothing is stored

## 1. Get a free Gemini API key

Go to https://aistudio.google.com/app/apikey, sign in with a Google account, and create a key.
The free tier is enough to run and demo this app.

## 2. Local setup

```bash
npm install
cp .env.example .env
# then paste your key into .env
```

Because the backend uses Vercel serverless functions, the easiest way to run the *whole*
app locally (frontend + API together) is the Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

This starts the app at `http://localhost:3000` with both the React frontend and the
`/api` functions working exactly like they will in production.

(Running `npm run dev` alone only starts the Vite frontend — the AI calls won't work
without `vercel dev` or a deployed backend, since `/api` needs a Node server.)

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: AI Job Hunter"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-job-hunter.git
git push -u origin main
```

## 4. Deploy on Vercel

1. Go to https://vercel.com/new and import the GitHub repo you just pushed.
2. Vercel will auto-detect it as a Vite project — leave the default build settings.
3. Before deploying, add an environment variable:
   - `GEMINI_API_KEY` = your key from step 1
   - (optional) `GEMINI_MODEL` = `gemini-2.5-flash`
4. Click **Deploy**. Once it finishes, your app is live at `your-project.vercel.app`.

Any future `git push` to `main` will auto-redeploy.

## Project structure

```
├── api/                    # Vercel serverless functions (backend)
│   ├── _lib/gemini.js      # shared Gemini API helper (not routed — underscore prefix)
│   ├── resume-optimize.js
│   ├── linkedin-review.js
│   ├── portfolio-feedback.js
│   ├── job-match.js
│   ├── cover-letter.js
│   └── interview-prep.js
├── src/
│   ├── components/Nav.jsx
│   ├── pages/Home.jsx      # tool grid landing page
│   ├── pages/ToolRunner.jsx# generic form + result page, driven by tools.js config
│   ├── tools.js            # single source of truth for all 6 tools
│   ├── App.jsx
│   └── index.css
├── vercel.json
└── package.json
```

## Adding user accounts + history later

The app is stateless by design (no login, nothing saved) to keep it simple to run and
deploy. If you later want to save history per user, the cleanest path is:
- Add [Vercel Postgres](https://vercel.com/storage/postgres) or [Supabase](https://supabase.com) for the database
- Add auth with [Clerk](https://clerk.com) or [NextAuth](https://authjs.dev)
- Store each tool run keyed by user ID in a `runs` table

None of that is required to use the app as-is.
