# Schoova Features Overview

## ✅ Implemented Features

### 1. Weekly Calendar Display
- **7-day view** (Monday - Sunday)
- **Time slots** from 8 AM to 10 PM
- **Dummy Harvard student schedule** with realistic classes and activities:
  - CS106 (Computer Science)
  - Math 21a (Calculus)
  - Econ 1010a (Economics)
  - Expos 20 (Writing)
  - Study time, meals, gym, clubs

### 2. Task Input Form
- **Task Name**: Required field for task title
- **Time Commitment**: Hours needed (0.5 - 20 hours)
- **Due Date**: Calendar picker with validation
- **Description/Subtasks**: Optional advanced field for breaking down tasks
  - Supports comma-separated subtasks
  - Examples: "outline, draft, revise" or "problem 1-2, 3-4, 5-6"

### 3. AI Scheduling Algorithm
Located in `src/utils/scheduler.js`:

- **Gap Detection**: Finds available time slots between existing events
- **Smart Splitting**: Divides tasks into manageable sessions (30-90 minutes)
- **Subtask Recognition**: Parses description field for subtask patterns
- **Due Date Awareness**: Only schedules within days before deadline
- **Preference Logic**: Prioritizes longer available slots for better focus time

### 4. AI Recommendation Highlighting
- **Visual Distinction**: Orange blocks with pulsing animation
- **Individual Controls**: Accept/Reject buttons on each block
- **Bulk Actions**: Accept All / Reject All buttons in banner
- **State Management**: 
  - Accepted blocks turn green and become permanent
  - Rejected blocks are removed from schedule
  - Can mix and match accepted/rejected blocks

### 5. User Interface
- **Modern Design**: Gradient background, clean cards, professional styling
- **Responsive Layout**: Works on desktop and tablet
- **Color-Coded Events**: Different colors for different event types
- **Interactive Elements**: Hover effects, smooth transitions
- **Legend**: Clear explanation of color coding

## 🎯 How the AI Scheduling Works

1. **Input Analysis**: Parses task details and time commitment
2. **Schedule Scan**: Examines existing calendar for gaps
3. **Slot Identification**: Finds all available time blocks (minimum 30 min)
4. **Session Planning**: Divides total time into optimal sessions
5. **Distribution**: Spreads sessions across available days
6. **Subtask Mapping**: If subtasks provided, assigns one per session
7. **Presentation**: Displays as highlighted blocks for review

## 📊 Example Use Cases

### Essay Assignment
- **Input**: "Expos Essay", 6 hours, due Friday, "outline, draft, revise"
- **Output**: 3 sessions of 2 hours each, labeled with each subtask

### Problem Set
- **Input**: "CS106 PSet 3", 4 hours, due Thursday, "problem 1-2, 3-4, 5-6"
- **Output**: 3 sessions distributed across available study time

### General Task
- **Input**: "Econ Reading", 3 hours, due Wednesday
- **Output**: 2-3 sessions split intelligently across free time

## 🔧 Technical Implementation

### Components
- **App.jsx**: Main application logic and state management
- **Calendar.jsx**: Weekly calendar view with event rendering
- **TaskForm.jsx**: Input form with validation

### Data
- **dummySchedule.js**: Sample Harvard student schedule

### Utilities
- **scheduler.js**: Core AI algorithm for task distribution

### Styling
- **Tailwind CSS**: Utility-first styling
- **Custom animations**: Pulse effect for AI suggestions
- **Responsive grid**: Adapts to screen size

## 🚀 Next Steps for Enhancement

1. **Drag-and-Drop**: Move AI-suggested blocks to different times
2. **Edit Mode**: Modify existing events
3. **Task Priorities**: High/Medium/Low priority scheduling
4. **Break Suggestions**: Automatic break insertion for long sessions
5. **Persistence**: Save schedule to localStorage or backend
6. **User Accounts**: Personal schedules instead of dummy data
7. **Calendar Import**: Sync with Google Calendar
8. **Mobile App**: React Native version
9. **Notifications**: Reminders for upcoming tasks
10. **Analytics**: Track completion rates and productivity
