# TailorCV

TailorCV is a local MVP that rewrites resume content against a pasted job offer while staying truthful, realistic, and ATS-friendly.

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
cp .env.example .env.local
```

3. Add your OpenAI API key to `.env.local`:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open the app:

```bash
http://localhost:3004
```

## Notes

- The OpenAI API key is used only in `app/api/rewrite-resume/route.ts`.
- The browser calls `/api/rewrite-resume`, so the key is never exposed client-side.
- There is no auth, database, payment flow, or PDF export in this MVP.
