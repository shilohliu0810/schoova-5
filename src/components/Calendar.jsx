import React, { useState } from 'react';
import { GripVertical } from 'lucide-react';

const Calendar = ({ schedule, weekDays, onAcceptBlock, onRejectBlock, onMoveBlock }) => {
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
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
  
  const handleDragStart = (e, event) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
  };
  
  const handleDragEnd = () => {
    setDraggedEvent(null);
    setDropTarget(null);
  };
  
  const handleDragOver = (e, day, hour) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropTarget({ day, hour });
  };
  
  const handleDragLeave = () => {
    setDropTarget(null);
  };
  
  const handleDrop = (e, day, hour) => {
    e.preventDefault();
    if (!draggedEvent) return;
    
    // Calculate new start time
    const newStartTime = `${hour.toString().padStart(2, '0')}:00`;
    
    // Calculate duration
    const oldStart = draggedEvent.startTime.split(':');
    const oldEnd = draggedEvent.endTime.split(':');
    const durationMinutes = (parseInt(oldEnd[0]) * 60 + parseInt(oldEnd[1])) - 
                           (parseInt(oldStart[0]) * 60 + parseInt(oldStart[1]));
    
    // Calculate new end time
    const newEndMinutes = hour * 60 + durationMinutes;
    const newEndHour = Math.floor(newEndMinutes / 60);
    const newEndMinute = newEndMinutes % 60;
    const newEndTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMinute.toString().padStart(2, '0')}`;
    
    // Call the move handler
    if (onMoveBlock) {
      onMoveBlock(draggedEvent, day, newStartTime, newEndTime);
    }
    
    setDraggedEvent(null);
    setDropTarget(null);
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
                <div 
                  key={hour} 
                  className={`h-[60px] border-b border-gray-100 border-r border-gray-100 transition-colors ${
                    dropTarget?.day === day && dropTarget?.hour === hour 
                      ? 'bg-blue-50 border-blue-300' 
                      : ''
                  }`}
                  onDragOver={(e) => handleDragOver(e, day, hour)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, day, hour)}
                ></div>
              ))}
              
              {/* Events */}
              {getEventsByDay(day).map(event => (
                <div
                  key={event.id}
                  draggable={event.isAISuggested || event.isDraggable !== false}
                  onDragStart={(e) => handleDragStart(e, event)}
                  onDragEnd={handleDragEnd}
                  className={`absolute left-0 right-0 mx-1 rounded px-2 py-1 text-xs overflow-hidden cursor-move ${
                    event.isAISuggested 
                      ? 'bg-orange-400 border-2 border-orange-600 shadow-lg animate-pulse' 
                      : event.color
                  } text-white ${
                    draggedEvent?.id === event.id ? 'opacity-50' : ''
                  }`}
                  style={getEventStyle(event)}
                >
                  <div className="flex items-center gap-1">
                    <GripVertical size={12} className="flex-shrink-0 opacity-70" />
                    <div className="font-semibold truncate flex-1">{event.title}</div>
                  </div>
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
