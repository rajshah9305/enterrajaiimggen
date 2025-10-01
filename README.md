# RAJ Image Studio

RAJ Image Studio is a web application that lets you generate AI‑powered images using the Pollinations API.  
It provides a clean UI with real‑time preview, advanced settings, history storage, and download/share features.

## Features

- Prompt and negative prompt input
- Style and model selection
- Configurable CFG scale, resolution, seed, and number of outputs
- Real‑time preview using the fast Photon model
- History stored in `localStorage` (persisted across sessions)
- Download individual images or all at once
- Share generated results via the Web Share API
- Fully responsive design built with Tailwind CSS and utility‑first styling
- No backend required – runs entirely as a static site

## Repository Structure

```
.
├── index.html          # Main UI
├── history.html        # View generation history
├── main.js             # Application logic
├── design.md           # Design documentation
├── resources/          # Sample images & assets
├── README.md           # This file
├── package.json        # Development scripts
├── .gitignore          # Ignored files
└── vercel.json         # Vercel deployment configuration
```

## Setup & Development

1. **Prerequisites**  
   - Node.js (v18+ recommended)  
   - npm (comes with Node)

2. **Install dependencies** (none required for the app itself, but for the dev server):
   ```bash
   npm install
   ```

3. **Run locally**  
   ```bash
   npm run dev
   ```
   This will start a local static server (port 3000) and open the app in your default browser.

4. **Build / Deploy**  
   The app is static; simply push the repository to GitHub and import it in Vercel. Vercel will detect the `vercel.json` file and deploy automatically.

## Deployment on Vercel

1. Sign in to Vercel and create a new project from the GitHub repository.
2. Vercel will read `vercel.json` and serve the static files.
3. No additional build step is required.

## License

This project is for personal use only. Do not redistribute commercially without permission.