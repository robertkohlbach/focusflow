import React from 'react';
import { Task } from '../types';
import TaskCard from './TaskCard';
import { DayDetails } from '../constants';

interface DayCellProps {
  day: DayDetails;
  tasks: Task[];
  deleteTask: (taskId: string) => void;
  updateTaskContent: (taskId: string, newContent: string) => void;
  improveTaskContent: (content: string) => Promise<string>;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string, columnId: string) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  draggedItemId: string | null;
}

const DayCell: React.FC<DayCellProps> = ({
  day,
  tasks,
  deleteTask,
  updateTaskContent,
  improveTaskContent,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedItemId,
}) => {
  const [isOver, setIsOver] = React.useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    onDrop(e);
    setIsOver(false);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/50 flex flex-col transition-all duration-300 ${isOver ? 'bg-blue-500/10 border-blue-500' : ''}`}
    >
      <div className="p-2 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-center text-slate-700 dark:text-slate-300">{day.title}</h3>
      </div>
      <div className="p-2 space-y-2 flex-grow min-h-[200px]">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={day.id}
              onDelete={deleteTask}
              onUpdateContent={updateTaskContent}
              improveTaskContent={improveTaskContent}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              isDragging={draggedItemId === task.id}
            />
          ))
        ) : (
          isOver && (
            <div className="flex items-center justify-center h-full">
               <p className="text-xs text-slate-400 dark:text-slate-500">Hier ablegen</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DayCell;