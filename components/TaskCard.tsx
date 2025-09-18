import React, { useState, useRef, useEffect } from 'react';
import { Task, DayID } from '../types';
import { QUADRANTS, DAYS_OF_WEEK } from '../constants';

interface TaskCardProps {
  task: Task;
  columnId: string;
  onDelete: (taskId: string) => void;
  onUpdateContent: (taskId: string, newContent: string) => void;
  improveTaskContent: (content: string) => Promise<string>;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, columnId: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  assignedDay?: DayID;
}

const QuadrantIndicator: React.FC<{ task: Task }> = ({ task }) => {
  const quadrantDetails = QUADRANTS[task.quadrant];
  if (!quadrantDetails) return null;

  return (
    <div 
      className={`w-2 h-2 rounded-full ${quadrantDetails.color} flex-shrink-0`}
      title={`Quadrant: ${quadrantDetails.title}`}
    />
  );
};

const DayBadge: React.FC<{ dayId: DayID }> = ({ dayId }) => {
  const dayDetails = DAYS_OF_WEEK.find(d => d.id === dayId);
  if (!dayDetails) return null;
  return (
    <span className="text-xs font-semibold bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-full flex-shrink-0">
      {dayDetails.abbreviation}
    </span>
  );
};


const TaskCard: React.FC<TaskCardProps> = ({ task, columnId, onDelete, onUpdateContent, improveTaskContent, onDragStart, onDragEnd, isDragging, assignedDay }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(task.content);
  const [isImproving, setIsImproving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    if (!isDragging) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (editedContent.trim() && editedContent.trim() !== task.content) {
      onUpdateContent(task.id, editedContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(task.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleImproveContent = async () => {
    if (!editedContent.trim() || isImproving) return;
    setIsImproving(true);
    try {
      const improved = await improveTaskContent(editedContent);
      setEditedContent(improved);
    } finally {
      setIsImproving(false);
      inputRef.current?.focus();
    }
  };


  return (
    <div
      draggable={!isEditing}
      onDragStart={(e) => onDragStart(e, task.id, columnId)}
      onDragEnd={onDragEnd}
      onDoubleClick={handleDoubleClick}
      className={`group bg-white dark:bg-slate-800 p-2.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex justify-between items-center space-x-3 transition-all duration-200 ${
        isEditing ? 'cursor-default ring-2 ring-blue-500 shadow-lg' : 'cursor-grab active:cursor-grabbing'
      } ${
        isDragging ? 'opacity-50 scale-95 shadow-xl' : 'hover:shadow-md hover:border-blue-500/50'
      }`}
    >
      <div className="flex items-center space-x-3 min-w-0 flex-grow">
        <QuadrantIndicator task={task} />
        {isEditing ? (
          <div className="flex items-center space-x-2 flex-grow min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="flex-grow bg-slate-100 dark:bg-slate-700 focus:outline-none text-slate-800 dark:text-slate-200 text-sm rounded px-1 -my-1 -mx-1 w-full"
            />
            <button
              type="button"
              onClick={handleImproveContent}
              disabled={isImproving}
              className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-50 transition-colors flex-shrink-0"
              aria-label="Aufgabe mit KI verbessern"
            >
              {isImproving ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              )}
            </button>
          </div>
        ) : (
          <p className="flex-grow text-slate-800 dark:text-slate-200 text-sm truncate" title={task.content}>{task.content}</p>
        )}
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        {!isEditing && assignedDay && <DayBadge dayId={assignedDay} />}
        {!isEditing && (
          <button
            onClick={() => onDelete(task.id)}
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-full p-1"
            aria-label={`Delete task ${task.content}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;