import React from 'react';

const Calendar = ({ schedule, weekDays, onAcceptBlock, onRejectBlock }) => {
  const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8 AM to 10 PM
  
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Weekly Schedule</h2>
      
      <div className="flex gap-2 overflow-x-auto">
        {/* Time column */}
        <div className="flex-shrink-0 w-16">
          <div className="h-12 border-b border-gray-200"></div>
          {hours.map(hour => (
            <div key={hour} className="h-[60px] text-xs text-gray-500 border-b border-gray-100">
              {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </div>
          ))}
        </div>
        
        {/* Day columns */}
        {weekDays.map(day => (
          <div key={day} className="flex-1 min-w-[140px]">
            <div className="h-12 border-b-2 border-gray-300 font-semibold text-center flex items-center justify-center text-sm">
              {day}
            </div>
            <div className="relative">
              {hours.map(hour => (
                <div key={hour} className="h-[60px] border-b border-gray-100 border-r border-gray-100"></div>
              ))}
              
              {/* Events */}
              {getEventsByDay(day).map(event => (
                <div
                  key={event.id}
                  className={`absolute left-0 right-0 mx-1 rounded px-2 py-1 text-xs overflow-hidden ${
                    event.isAISuggested 
                      ? 'bg-orange-400 border-2 border-orange-600 shadow-lg animate-pulse' 
                      : event.color
                  } text-white`}
                  style={getEventStyle(event)}
                >
                  <div className="font-semibold truncate">{event.title}</div>
                  <div className="text-[10px] opacity-90">
                    {event.startTime} - {event.endTime}
                  </div>
                  
                  {event.isAISuggested && (
                    <div className="mt-1 flex gap-1">
                      <button
                        onClick={() => onAcceptBlock(event)}
                        className="bg-green-600 hover:bg-green-700 text-white text-[10px] px-2 py-0.5 rounded"
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={() => onRejectBlock(event)}
                        className="bg-red-600 hover:bg-red-700 text-white text-[10px] px-2 py-0.5 rounded"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
