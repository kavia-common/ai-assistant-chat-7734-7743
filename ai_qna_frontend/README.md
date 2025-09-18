# Ocean Professional Q&A Frontend (React)

A minimalist, modern Q&A UI with an Ocean Professional theme. It provides:
- Centered question input at the top
- AI responses listed below
- Smooth transitions, subtle gradients, soft shadows
- Blue and amber accent colors

## Run

- npm start
- npm test
- npm run build

Open http://localhost:3000 to view in your browser.

## Styling

Colors and components are implemented via vanilla CSS in `src/App.css`.

Ocean Professional palette:
- Primary (blue): `#2563EB`
- Secondary (amber): `#F59E0B`
- Error: `#EF4444`
- Background: `#f9fafb`
- Surface: `#ffffff`
- Text: `#111827`

## Backend Integration

This UI includes a placeholder ask handler. To integrate with your backend:

1) Expose a POST endpoint like:
   POST /ask
   { "question": "your question" } -> { "answer": "AI response" }

2) Add environment variable:
   REACT_APP_API_URL=https://your-backend.example.com

3) Replace the askAI function in `src/App.js`:
   - Uncomment and use fetch(`${process.env.REACT_APP_API_URL}/ask`, ...)

Deployment agents will map REACT_APP_API_URL from your environment.

## Accessibility

- Keyboard and screen-reader friendly controls
- Focus rings for interactive elements
