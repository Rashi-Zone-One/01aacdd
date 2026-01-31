<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1rWIgr4Qfugz5wO4MH-ejvgvkCS8Vr7Wp

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and edit `GEMINI_API_KEY` with your Gemini API key (recommended for server-side usage). If you don't have a key the app will still run locally but the AI assistant feature will return a friendly message.
3. Run the app (development):
   `npm run dev`

Run production locally (after building):

1. Build the app:
   `npm run build`
2. Serve the `dist` folder:
   `npm run start` (uses `serve -s dist` on port 5000)

CI / GitHub Pages:
- A GitHub Action (`.github/workflows/deploy.yml`) will automatically build and publish the `dist` folder to the `gh-pages` branch when you push to `main` or `master`. The site will be available via GitHub Pages once the action completes.

Notes:
- For security, do not place your Gemini key in client-side code. The `getPrintAdvice` helper avoids calling the server SDK from the browser; for production, call Gemini from a trusted server endpoint that uses `GEMINI_API_KEY`.
