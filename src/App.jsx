import React, { useState } from 'react';
import Calendar from './components/Calendar';
import TaskForm from './components/TaskForm';
import { dummySchedule, weekDays } from './data/dummySchedule';
import { scheduleTask } from './utils/scheduler';
import { BookOpen } from 'lucide-react';

function App() {
  const [schedule, setSchedule] = useState(dummySchedule);
  const [aiSuggestedBlocks, setAiSuggestedBlocks] = useState([]);
  
  const handleScheduleTask = (task) => {
    // Get the base schedule (without AI suggestions)
    const baseSchedule = schedule.filter(event => !event.isAISuggested);
    
    // Generate AI-scheduled blocks
    const scheduledBlocks = scheduleTask(task, baseSchedule, weekDays);
    
    if (scheduledBlocks.length === 0) {
      alert('Unable to find enough available time slots for this task. Try reducing the time commitment or extending the due date.');
      return;
    }
    
    // Add AI suggestions to the schedule
    setAiSuggestedBlocks(scheduledBlocks);
    setSchedule([...baseSchedule, ...scheduledBlocks]);
    
    // Scroll to calendar
    document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleAcceptBlock = (block) => {
    // Convert AI suggestion to permanent block
    setSchedule(prevSchedule => 
      prevSchedule.map(event => 
        event.id === block.id 
          ? { ...event, isAISuggested: false, color: 'bg-green-600' }
          : event
      )
    );
    
    // Remove from AI suggestions
    setAiSuggestedBlocks(prev => prev.filter(b => b.id !== block.id));
  };
  
  const handleRejectBlock = (block) => {
    // Remove the block from schedule
    setSchedule(prevSchedule => prevSchedule.filter(event => event.id !== block.id));
    
    // Remove from AI suggestions
    setAiSuggestedBlocks(prev => prev.filter(b => b.id !== block.id));
  };
  
  const handleAcceptAll = () => {
    setSchedule(prevSchedule => 
      prevSchedule.map(event => 
        event.isAISuggested 
          ? { ...event, isAISuggested: false, color: 'bg-green-600' }
          : event
      )
    );
    setAiSuggestedBlocks([]);
  };
  
  const handleRejectAll = () => {
    setSchedule(prevSchedule => prevSchedule.filter(event => !event.isAISuggested));
    setAiSuggestedBlocks([]);
  };
  
  const handleMoveBlock = (block, newDay, newStartTime, newEndTime) => {
    // Update the block's position
    setSchedule(prevSchedule => 
      prevSchedule.map(event => 
        event.id === block.id 
          ? { ...event, day: newDay, startTime: newStartTime, endTime: newEndTime }
          : event
      )
    );
    
    // If it was an AI suggestion, also update the AI suggestions array
    if (block.isAISuggested) {
      setAiSuggestedBlocks(prev => 
        prev.map(b => 
          b.id === block.id 
            ? { ...b, day: newDay, startTime: newStartTime, endTime: newEndTime }
            : b
        )
      );
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <BookOpen className="text-orange-500" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Schoova</h1>
              <p className="text-sm text-gray-600">Smart Task Scheduler for Students</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Task Form */}
        <TaskForm onScheduleTask={handleScheduleTask} />
        
        {/* AI Suggestions Banner */}
        {aiSuggestedBlocks.length > 0 && (
          <div className="bg-orange-100 border-2 border-orange-400 rounded-lg p-4 mb-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-orange-900">
                  🎯 {aiSuggestedBlocks.length} AI-Suggested Time Block{aiSuggestedBlocks.length > 1 ? 's' : ''} Available
                </h3>
                <p className="text-sm text-orange-800">
                  Review the highlighted blocks in your calendar below. Accept or reject individual blocks, or use the buttons here.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAcceptAll}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                  ✓ Accept All
                </button>
                <button
                  onClick={handleRejectAll}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                  ✗ Reject All
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Calendar */}
        <div id="calendar">
          {/* Drag and Drop Hint */}
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>💡 Pro Tip:</strong> You can drag and drop time blocks to reschedule them! 
              Just click and hold on any block, then drag it to a new time slot.
            </p>
          </div>
          
          <Calendar 
            schedule={schedule} 
            weekDays={weekDays}
            onAcceptBlock={handleAcceptBlock}
            onRejectBlock={handleRejectBlock}
            onMoveBlock={handleMoveBlock}
          />
        </div>
        
        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>CS106</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span>Economics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Math</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Expos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Study Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span>Personal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-pink-500 rounded"></div>
              <span>Extracurricular</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 border-2 border-orange-600 rounded"></div>
              <span>AI Suggested</span>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>Schoova - Helping students achieve their goals through smart scheduling 📚</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
