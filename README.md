# Schoova - Smart Task Scheduler

**Schoova** is an accountability tool designed to help young adults achieve their goals through personalized scheduling and gamified working time. 

## Features

### 🎯 AI-Powered Task Scheduling
- Input task name, time commitment, due date, and optional subtasks
- AI algorithm intelligently splits tasks across available time slots
- Respects existing schedule and finds optimal work sessions

### 📅 Weekly Calendar View
- Visual weekly schedule with dummy Harvard student data
- Color-coded events (classes, study time, personal activities)
- Time slots from 8 AM to 10 PM

### ✨ Interactive AI Recommendations
- Highlighted AI-suggested time blocks with pulsing animation
- Accept or reject individual blocks
- Bulk accept/reject all suggestions
- Accepted blocks turn green and integrate into schedule

### 🧠 Smart Subtask Parsing
- Advanced mode for breaking down tasks
- Supports patterns like "outline, draft, revise"
- Or problem sets: "problem 1-2, 3-4, 5-6"
- AI distributes subtasks across sessions

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## How to Use

1. **View Your Schedule**: The calendar displays a sample Harvard student week with classes, study time, and personal activities.

2. **Add a New Task**:
   - Enter task name (e.g., "CS106 Problem Set 3")
   - Set time commitment in hours (e.g., 4)
   - Choose due date
   - (Optional) Add subtasks in the description field

3. **Review AI Suggestions**: 
   - Orange highlighted blocks appear on your calendar
   - Each block shows the task name and time slot
   - Click "✓ Accept" to add to schedule
   - Click "✗ Reject" to remove suggestion

4. **Manage Recommendations**:
   - Use "Accept All" to add all suggested blocks
   - Use "Reject All" to clear all suggestions
   - Accepted blocks turn green and become permanent

## Example Subtask Formats

- **Essay**: `outline, draft, revise`
- **Problem Set**: `problem 1-2, problem 3-4, problem 5-6`
- **Project**: `research, design, implementation, testing`

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **date-fns** - Date utilities

## Project Structure

```
src/
├── components/
│   ├── Calendar.jsx       # Weekly calendar view
│   └── TaskForm.jsx       # Task input form
├── data/
│   └── dummySchedule.js   # Sample Harvard schedule
├── utils/
│   └── scheduler.js       # AI scheduling algorithm
├── App.jsx                # Main application
└── main.jsx              # Entry point
```

## Future Enhancements

- User authentication and personal schedules
- Drag-and-drop time block editing
- Task priority levels
- Study break recommendations
- Integration with Google Calendar
- Mobile app version
- Gamification features (points, streaks, achievements)

[Google Drive link](https://drive.google.com/drive/folders/157ljX_hkk2rsP9ihhz6eaXZAEej8gJUI?usp=sharing)
