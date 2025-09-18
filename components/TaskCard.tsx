
import React from 'react';
import { Task, QuadrantID } from '../types';

interface TaskCardProps {
  task: Task;
  quadrantId: QuadrantID;
  onDelete: (taskId: string, quadrantId: QuadrantID) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, quadrantId: QuadrantID) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, quadrantId, onDelete, onDragStart, onDragEnd, isDragging }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id, quadrantId)}
      onDragEnd={onDragEnd}
      className={`group bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 flex justify-between items-center cursor-grab active:cursor-grabbing transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-95 shadow-xl' : 'hover:shadow-md hover:border-blue-500/50'
      }`}
    >
      <p className="text-slate-800 dark:text-slate-200 text-sm">{task.content}</p>
      <button
        onClick={() => onDelete(task.id, quadrantId)}
        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-full p-1"
        aria-label={`Delete task ${task.content}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default TaskCard;
