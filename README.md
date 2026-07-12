# LeadMorph

LeadMorph is an AI-powered CSV import and review platform that helps users upload spreadsheet data, preview it safely, and transform it into structured CRM-style records with Gemini AI.

## What this project does

- Upload and validate CSV files from the browser
- Preview rows and columns before processing
- Send CSV data to the backend for AI-based extraction
- Review extracted records and skipped records separately
- Display results in a responsive, rich data table with sorting, filtering, pagination, resizing, and sticky headers
- Support dark/light mode and a polished modern UI

## Main features

### Frontend
- Next.js + React user interface
- Drag-and-drop CSV upload experience
- Local CSV validation and preview
- Responsive results table with:
  - sticky header
  - column resizing
  - sorting
  - global search
  - pagination
  - wrapped long cell content
  - column visibility controls
- Dark/light theme support
- Zustand-based result state management

### Backend
- Express server with CSV upload endpoint
- CSV parsing using `csv-parser`
- Batch processing for large datasets
- Gemini AI integration for structured JSON output
- Zod-based response schema validation

## Tech stack

### Frontend
- Next.js
- React
- Tailwind CSS
- Shadcn UI components
- Framer Motion
- TanStack Table
- Zustand
- Axios

### Backend
- Node.js
- Express
- Multer
- dotenv
- csv-parser
- Google GenAI
- Zod

## Project flow

1. User uploads a CSV file from the frontend.
2. The frontend validates the file and shows a preview of the data.
3. User confirms the upload.
4. The backend receives the file and parses the CSV rows.
5. Records are processed in batches and sent to Gemini AI.
6. AI returns structured extracted and skipped records.
7. Results are shown on the results page for review and analysis.

## Installation

### 1) Clone the repository
```bash
git clone <repo-url>
cd LeadMorph
```

### 2) Install frontend dependencies
```bash
cd Frontend
npm install
```

### 3) Install backend dependencies
```bash
cd ../Backend
npm install
```

### 4) Run the backend
```bash
cd Backend
npm run dev
```

### 5) Run the frontend
```bash
cd Frontend
npm run dev
```

Open http://localhost:3000 in your browser.

## Environment variables

Create a `.env` file inside the Backend folder with the following format:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

> Do not commit real secrets. Keep API keys and sensitive values private.

## Folder overview

```text
LeadMorph/
├── Backend/
│   ├── ai/
│   ├── Controllers/
│   ├── Middlewares/
│   ├── Routes/
│   ├── Services/
│   ├── utils/
│   └── server.js
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── config/
│   │   ├── lib/
│   │   ├── store/
│   │   └── utils/
└── README.md
```

## Notes

This project is designed for CSV-based data review and AI-assisted extraction workflows. It can be extended to support more CRM mappings, additional file formats, or richer validation rules in the future.
