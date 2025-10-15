import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar = ({ schedule, weekDays, onAcceptBlock, onRejectBlock }) => {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8 AM to 10 PM
  
  const currentDay = weekDays[currentDayIndex];
  
  const goToPreviousDay = () => {
    setCurrentDayIndex((prev) => (prev > 0 ? prev - 1 : weekDays.length - 1));
  };
  
  const goToNextDay = () => {
    setCurrentDayIndex((prev) => (prev < weekDays.length - 1 ? prev + 1 : 0));
  };
  
  const getEventStyle = (event) => {
    const startHour = parseInt(event.startTime.split(':')[0]);
    const startMinute = parseInt(event.startTime.split(':')[1]);
    const endHour = parseInt(event.endTime.split(':')[0]);
    const endMinute = parseInt(event.endTime.split(':')[1]);
    
    const top = ((startHour - 8) * 60 + startMinute) * (60 / 60); // pixels per minute
    const height = ((endHour - startHour) * 60 + (endMinute - startMinute)) * (60 / 60);
    
    return {
      top: `${top}px`,
      height: `${height}px`,
    };
  };
  
  const getEventsByDay = (day) => {
    return schedule.filter(event => event.day === day);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Daily Schedule</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousDay}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            aria-label="Previous day"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
          <div className="text-center min-w-[120px]">
            <div className="text-xl font-bold text-gray-800">{currentDay}</div>
            <div className="text-sm text-gray-500">Day {currentDayIndex + 1} of {weekDays.length}</div>
          </div>
          <button
            onClick={goToNextDay}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            aria-label="Next day"
          >
            <ChevronRight size={24} className="text-gray-700" />
          </button>
        </div>
      </div>
      
      <div className="flex gap-2">
        {/* Time column */}
        <div className="flex-shrink-0 w-20">
          <div className="h-12 border-b border-gray-200"></div>
          {hours.map(hour => (
            <div key={hour} className="h-[60px] text-sm text-gray-600 border-b border-gray-100 flex items-start pt-1">
              {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </div>
          ))}
        </div>
        
        {/* Day column */}
        <div className="flex-1">
          <div className="h-12 border-b-2 border-gray-300 font-semibold text-center flex items-center justify-center text-lg">
            {currentDay}
          </div>
          <div className="relative">
            {hours.map(hour => (
              <div key={hour} className="h-[60px] border-b border-gray-100 border-r border-gray-100"></div>
            ))}
            
            {/* Events */}
            {getEventsByDay(currentDay).map(event => (
              <div
                key={event.id}
                className={`absolute left-0 right-0 mx-2 rounded px-3 py-2 text-sm overflow-hidden ${
                  event.isAISuggested 
                    ? 'bg-orange-400 border-2 border-orange-600 shadow-lg animate-pulse' 
                    : event.color
                } text-white`}
                style={getEventStyle(event)}
              >
                <div className="font-semibold truncate">{event.title}</div>
                <div className="text-xs opacity-90">
                  {event.startTime} - {event.endTime}
                </div>
                
                {event.isAISuggested && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => onAcceptBlock(event)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
                    >
                      ✓ Accept
                    </button>
                    <button
                      onClick={() => onRejectBlock(event)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                    >
                      ✗ Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
