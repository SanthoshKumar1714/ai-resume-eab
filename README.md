# ResumeCraft - AI Resume Enhancer

A minimalist SPA for college students and recent graduates to build and enhance resumes with AI-powered assistance using Google Gemini.

## Features

- **5 Professional Templates**: Modern Minimal, Professional Classic, Creative Portfolio, Technical Developer, Academic Scholar
- **AI-Powered Enhancements**: Grammar correction, action verb strengthening, bullet point rewriting
- **🆕 Section-Level AI Generation**: Generate complete bullet points from custom descriptions
- **🆕 Custom AI Enhancement**: Tell AI exactly what you want to improve in your resume
- **🆕 Interactive Welcome Guide**: First-time users get a helpful 5-step tutorial
- **🆕 Quick Actions Bar**: Context-aware shortcuts for common tasks
- **Drag & Drop Interface**: Reorder sections and items easily
- **Real-time Preview**: See your changes instantly
- **PDF Export**: One-click download of your resume
- **Auto-save**: Never lose your progress with automatic local storage backup

## 🚀 Enhanced AI Features

### Section-Level AI Enhancement
Click the sparkle (✨) button in any Work Experience or Projects section header to access powerful AI generation:

**Generate Content Mode:**
- Describe your work, achievements, or project details
- AI generates 3-5 professional, achievement-oriented bullet points
- Customize the output to your needs

**Example:**
```
Input: "Led development of microservices using Docker and Kubernetes. 
Reduced deployment time by 70%. Mentored 3 junior developers."

AI generates professional bullets with strong action verbs and quantifiable metrics.
```

**Enhance Existing Mode:**
- Set specific enhancement goals (e.g., "make it more quantifiable", "emphasize leadership")
- Get actionable recommendations to improve your content
- AI provides targeted suggestions based on your goals

### Smart AI Context
- Understands work experience vs. project differences
- Generates role-appropriate content
- Respects industry best practices
- Focuses on achievements and impact

## AI Enhancement Features

**Bullet-Level Enhancement:**
- **Grammar Check**: Corrects spelling and grammar errors
- **Strengthen Action Verbs**: Makes bullet points more impactful  
- **Rewrite Professionally**: Provides 2 alternative versions of bullet points

**Section-Level Enhancement (NEW):**
- **Generate Bullets**: Create professional bullet points from descriptions
- **Custom Enhancement**: Improve sections based on your specific goals
- **Context-Aware**: Tailored to work experience or projects

**Rate Limits**: 15 AI requests per minute (Gemini Free Tier)

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

### Getting Started

1. **Select a Template**: Choose from 5 professional resume templates on the homepage
2. **Follow Welcome Guide**: New users get an interactive tutorial (can be skipped)
3. **Add Personal Information**: Fill in your contact details
4. **Use Quick Actions**: Click quick action buttons to add sections quickly
5. **Add Sections**: Add Work Experience, Education, Projects, and Skills sections

### Working with Content

6. **Fill Basic Information**: Add job titles, companies, dates, etc.
7. **AI Section Enhancement** (NEW): Click the ✨ button in section headers to:
   - Generate complete bullet points from descriptions
   - Get custom enhancement recommendations
8. **AI Bullet Enhancement**: Click ✨ next to any bullet point for individual improvements
9. **Preview**: See your resume update in real-time in the preview pane

### Saving and Exporting

10. **Auto-save**: Progress is automatically saved to browser every 30 seconds
11. **Save**: Click "Save" button to save your resume to the server
12. **Export**: Click "Export PDF" to download your resume

### Pro Tips

- **Be Specific**: When using section-level AI, provide detailed descriptions with metrics
- **Multiple Attempts**: Try different descriptions to get varied results
- **Edit After Generate**: Use AI-generated content as a starting point and customize
- **Rate Limit**: Keep an eye on remaining AI requests (shown in enhancement modals)

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
- See `ENHANCEMENTS.md` for detailed documentation of new features

## Completed Enhancements ✅

- ✅ Advanced section-level AI generation
- ✅ Custom AI enhancement with user-defined goals
- ✅ Interactive welcome guide for onboarding
- ✅ Quick actions bar with context-aware shortcuts
- ✅ Enhanced animations and transitions
- ✅ Helpful tooltips throughout the interface
- ✅ Mobile-responsive design improvements

## Future Enhancements (Phase 3)

- [ ] Full drag-and-drop functionality with react-dnd
- [ ] Framer Motion advanced animations
- [ ] DOCX export
- [ ] Multiple resume management
- [ ] Resume sharing via link
- [ ] Undo/redo functionality
- [ ] AI-powered professional summary generator
- [ ] Resume analysis and scoring
- [ ] Job description optimization

## Credits

Built with:
- Google Gemini AI for resume enhancements
- React and modern web technologies
- Love for helping students land their dream jobs

## License

This is a college project. All rights reserved.
