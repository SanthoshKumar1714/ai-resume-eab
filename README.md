# ResumeCraft - AI Resume Enhancer

A minimalist SPA for college students and recent graduates to build and enhance resumes with AI-powered assistance using Google Gemini.

## Features

- **5 Professional Templates**: Modern Minimal, Professional Classic, Creative Portfolio, Technical Developer, Academic Scholar
- **AI-Powered Enhancements**: Grammar correction, action verb strengthening, bullet point rewriting
- **Drag & Drop Interface**: Reorder sections and items easily
- **Real-time Preview**: See your changes instantly
- **PDF Export**: One-click download of your resume
- **Auto-save**: Never lose your progress with automatic local storage backup

## Tech Stack

**Frontend:**
- React.js 18
- React Router for navigation
- React DnD for drag-and-drop
- Framer Motion for animations
- html2canvas + jsPDF for PDF export
- Vite for build tooling

**Backend:**
- Node.js with Express
- Google Gemini AI (Free Tier)
- JSON file storage
- Rate limiting middleware

## Project Structure

```
ai-resume-eab/
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # Context providers
│   │   ├── data/          # Templates and sample data
│   │   ├── styles/        # CSS files
│   │   ├── App.jsx
│   │   └── index.js
│   ├── .env               # Frontend environment variables
│   └── package.json
├── backend/               # Express backend
│   ├── server/
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   ├── utils/        # Utilities
│   │   └── index.js
│   ├── .env              # Backend environment variables
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd ai-resume-eab
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

The `.env` files are already configured with the Gemini API key:

**Backend** (`backend/.env`):
```
GEMINI_API_KEY=AIzaSyB5i0I-3MZTZImRCmW99PKj9R4RGNuRFlo
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```
VITE_API_URL=http://localhost:3001/api
```

## Running the Application

### Start Backend Server

In the `backend` directory:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Start Frontend Development Server

In a new terminal, navigate to the `frontend` directory:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Open in Browser

Navigate to `http://localhost:5173` in your web browser.

## Usage

1. **Select a Template**: Choose from 5 professional resume templates on the homepage
2. **Add Personal Information**: Fill in your contact details
3. **Add Sections**: Add Work Experience, Education, Projects, and Skills sections
4. **Fill Content**: Add items to each section with detailed information
5. **AI Enhancement**: Click the ✨ button next to any bullet point to enhance it with AI
6. **Preview**: See your resume update in real-time in the preview pane
7. **Save**: Click "Save" to save your resume to the server
8. **Export**: Click "Export PDF" to download your resume

## AI Enhancement Features

- **Grammar Check**: Corrects spelling and grammar errors
- **Strengthen Action Verbs**: Makes bullet points more impactful
- **Rewrite Professionally**: Provides 2 alternative versions of bullet points

**Rate Limits**: 15 AI requests per minute (Gemini Free Tier)

## Build for Production

### Build Frontend

```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`

### Build Backend

The backend doesn't require a build step. Deploy `backend/` directory with:
```bash
cd backend
npm start
```

## Development Notes

- Auto-save occurs every 30 seconds to localStorage
- Resume data is saved to `backend/server/data/resumes/` directory
- The application uses React Context API for state management
- All AI requests are proxied through the backend to keep the API key secure

## Future Enhancements (Phase 3)

- [ ] Full drag-and-drop functionality with react-dnd
- [ ] Framer Motion animations
- [ ] DOCX export
- [ ] Multiple resume management
- [ ] Resume sharing via link
- [ ] Undo/redo functionality

## Credits

Built with:
- Google Gemini AI for resume enhancements
- React and modern web technologies
- Love for helping students land their dream jobs

## License

This is a college project. All rights reserved.
