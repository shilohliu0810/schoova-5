import { parse, format, addMinutes, isBefore, isAfter, isEqual } from 'date-fns';

// Convert time string to minutes since midnight
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Convert minutes since midnight to time string
const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Find available time slots in a day
const findAvailableSlots = (daySchedule, dayName, startHour = 8, endHour = 22) => {
  const slots = [];
  const dayStart = startHour * 60; // 8 AM
  const dayEnd = endHour * 60; // 10 PM
  
  // Sort events by start time
  const sortedEvents = [...daySchedule].sort((a, b) => 
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );
  
  let currentTime = dayStart;
  
  for (const event of sortedEvents) {
    const eventStart = timeToMinutes(event.startTime);
    const eventEnd = timeToMinutes(event.endTime);
    
    // If there's a gap before this event
    if (currentTime < eventStart) {
      slots.push({
        day: dayName,
        startTime: minutesToTime(currentTime),
        endTime: minutesToTime(eventStart),
        duration: eventStart - currentTime
      });
    }
    
    currentTime = Math.max(currentTime, eventEnd);
  }
  
  // Check for time after last event
  if (currentTime < dayEnd) {
    slots.push({
      day: dayName,
      startTime: minutesToTime(currentTime),
      endTime: minutesToTime(dayEnd),
      duration: dayEnd - currentTime
    });
  }
  
  return slots;
};

// Calculate days between today and due date
const getDaysUntilDue = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Split task description into subtasks if possible
const parseSubtasks = (description) => {
  if (!description) return null;
  
  // Look for patterns like "outline, draft, revise" or "problem 1-2, 3-4"
  const patterns = [
    /([^,]+),\s*([^,]+),\s*([^,]+)/i, // comma-separated
    /(\d+-\d+)[,\s]+(\d+-\d+)/i, // problem ranges
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match) {
      return match.slice(1).filter(Boolean);
    }
  }
  
  return null;
};

// Main scheduling algorithm
export const scheduleTask = (task, existingSchedule, weekDays) => {
  const { name, timeCommitment, dueDate, description } = task;
  
  // Parse time commitment (in hours)
  const totalMinutes = parseFloat(timeCommitment) * 60;
  
  // Get available slots for each day
  const availableSlotsByDay = {};
  weekDays.forEach(day => {
    const daySchedule = existingSchedule.filter(event => event.day === day);
    availableSlotsByDay[day] = findAvailableSlots(daySchedule, day);
  });
  
  // Parse subtasks if available
  const subtasks = parseSubtasks(description);
  const numSessions = subtasks ? subtasks.length : Math.min(Math.ceil(totalMinutes / 90), 5); // Max 90 min sessions or 5 sessions
  const minutesPerSession = Math.ceil(totalMinutes / numSessions);
  
  // Get days until due date
  const daysUntilDue = getDaysUntilDue(dueDate);
  const availableDays = weekDays.slice(0, Math.min(daysUntilDue + 1, weekDays.length));
  
  // Collect all available slots across available days
  const allSlots = [];
  availableDays.forEach(day => {
    const daySlots = availableSlotsByDay[day] || [];
    daySlots.forEach(slot => {
      if (slot.duration >= 30) { // Minimum 30 minutes
        allSlots.push(slot);
      }
    });
  });
  
  // Sort slots by day order and prefer longer slots
  allSlots.sort((a, b) => {
    const dayDiff = weekDays.indexOf(a.day) - weekDays.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return b.duration - a.duration; // Prefer longer slots
  });
  
  // Allocate time blocks
  const scheduledBlocks = [];
  let remainingMinutes = totalMinutes;
  let sessionIndex = 0;
  
  for (const slot of allSlots) {
    if (remainingMinutes <= 0) break;
    
    const blockDuration = Math.min(
      slot.duration,
      minutesPerSession,
      remainingMinutes
    );
    
    if (blockDuration >= 30) { // Minimum 30 minutes
      const startMinutes = timeToMinutes(slot.startTime);
      const endMinutes = startMinutes + blockDuration;
      
      const blockTitle = subtasks 
        ? `${name} - ${subtasks[sessionIndex] || subtasks[subtasks.length - 1]}`
        : `${name} (${sessionIndex + 1}/${numSessions})`;
      
      scheduledBlocks.push({
        id: `ai-${Date.now()}-${sessionIndex}`,
        title: blockTitle,
        day: slot.day,
        startTime: slot.startTime,
        endTime: minutesToTime(endMinutes),
        type: "ai-suggested",
        color: "bg-orange-400",
        isAISuggested: true,
        originalTask: name,
        subtask: subtasks ? subtasks[sessionIndex] : null
      });
      
      remainingMinutes -= blockDuration;
      sessionIndex++;
      
      // Update slot for next iteration
      slot.startTime = minutesToTime(endMinutes);
      slot.duration -= blockDuration;
    }
  }
  
  return scheduledBlocks;
};
