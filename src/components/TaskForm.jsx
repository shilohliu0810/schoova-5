import React, { useState } from 'react';
import { Calendar, Clock, FileText, Sparkles } from 'lucide-react';

const TaskForm = ({ onScheduleTask }) => {
  const [taskName, setTaskName] = useState('');
  const [timeCommitment, setTimeCommitment] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!taskName || !timeCommitment || !dueDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    const task = {
      name: taskName,
      timeCommitment: parseFloat(timeCommitment),
      dueDate,
      description
    };
    
    onScheduleTask(task);
    
    // Reset form
    setTaskName('');
    setTimeCommitment('');
    setDueDate('');
    setDescription('');
    setShowAdvanced(false);
  };
  
  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-orange-500" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Add New Task</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Task Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Name *
          </label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="e.g., CS106 Problem Set 3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>
        
        {/* Time Commitment and Due Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Clock className="inline mr-1" size={16} />
              Time Commitment (hours) *
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="20"
              value={timeCommitment}
              onChange={(e) => setTimeCommitment(e.target.value)}
              placeholder="e.g., 4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="inline mr-1" size={16} />
              Due Date *
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={today}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
        </div>
        
        {/* Advanced: Description/Subtasks */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium mb-2"
          >
            {showAdvanced ? '− Hide' : '+ Show'} Advanced Options (Subtasks)
          </button>
          
          {showAdvanced && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FileText className="inline mr-1" size={16} />
                Description / Subtasks
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., outline, draft, revise&#10;or: problem 1-2, problem 3-4, problem 5-6"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tip: Separate subtasks with commas for better scheduling (e.g., "outline, draft, revise")
              </p>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2"
        >
          <Sparkles size={20} />
          Generate AI Schedule
        </button>
      </form>
      
      <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>💡 How it works:</strong> Our AI will analyze your schedule and intelligently split 
          this task into manageable chunks across your available time slots. Review the highlighted 
          blocks and accept or reject them!
        </p>
      </div>
    </div>
  );
};

export default TaskForm;
